import { OrderStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import type { Order } from "@/lib/types"
import { createOrderInputSchema, type CreateOrderInput } from "@/lib/server/types"

function formatOrderExternalId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}`
}

function toClientOrder(order: Awaited<ReturnType<typeof getOrderRecord>>): Order {
  return {
    id: order.externalId,
    status: order.status,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    paymentAdjustment: order.paymentAdjustment,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    customer: {
      name: order.customerName,
      phone: order.customerPhone,
      email: order.customerEmail ?? "",
      shippingMethod: order.shippingMethod,
      street: order.street ?? "",
      number: order.number ?? "",
      neighborhood: order.neighborhood ?? "",
      paymentMethod: order.paymentMethod,
      cashAmount: order.cashAmount ?? "",
      observations: order.observations ?? "",
    },
    items: order.items.map((item) => ({
      id: item.id,
      product: {
        id: item.product.id,
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        image: item.product.image,
        category: item.product.category.name,
        badge: item.product.badge ?? undefined,
        inStock: item.product.inStock,
        extras: item.product.extras.map(({ extra }) => ({
          id: extra.id,
          name: extra.name,
          price: extra.price,
          inStock: extra.inStock,
        })),
      },
      quantity: item.quantity,
      observations: item.observations ?? "",
      totalPrice: item.totalPrice,
      selectedExtras: item.extras.map(({ extra }) => ({
        id: extra.id,
        name: extra.name,
        price: extra.price,
        inStock: extra.inStock,
      })),
    })),
  }
}

async function getOrderRecord(id: string) {
  return prisma.order.findUniqueOrThrow({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              extras: {
                include: {
                  extra: true,
                },
              },
            },
          },
          extras: {
            include: {
              extra: true,
            },
          },
        },
      },
    },
  })
}

export async function createOrder(rawInput: CreateOrderInput): Promise<Order> {
  const input = createOrderInputSchema.parse(rawInput)

  const productIds = input.items.map((item) => item.id)
  const extraIds = input.items.flatMap((item) => item.selectedExtras.map((extra) => extra.id))

  const [products, extras] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: productIds }, inStock: true },
      include: {
        category: true,
        extras: {
          include: {
            extra: true,
          },
        },
      },
    }),
    prisma.extra.findMany({
      where: {
        id: { in: extraIds },
        inStock: true,
      },
    }),
  ])

  const productMap = new Map(products.map((p) => [p.id, p]))
  const extraMap = new Map(extras.map((e) => [e.id, e]))

  for (const item of input.items) {
    if (!productMap.has(item.id)) {
      throw new Error(`PRODUCT_NOT_AVAILABLE:${item.id}`)
    }
    for (const selectedExtra of item.selectedExtras) {
      if (!extraMap.has(selectedExtra.id)) {
        throw new Error(`EXTRA_NOT_AVAILABLE:${selectedExtra.id}`)
      }
    }
  }

  const createdOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        externalId: formatOrderExternalId(),
        subtotal: input.subtotal,
        shippingCost: input.shippingCost,
        paymentAdjustment: input.paymentAdjustment,
        total: input.total,
        customerName: input.customer.name,
        customerPhone: input.customer.phone,
        customerEmail: input.customer.email,
        shippingMethod: input.customer.shippingMethod,
        street: input.customer.street,
        number: input.customer.number,
        neighborhood: input.customer.neighborhood,
        paymentMethod: input.customer.paymentMethod,
        cashAmount: input.customer.cashAmount,
        observations: input.customer.observations,
      },
    })

    for (const cartItem of input.items) {
      const product = productMap.get(cartItem.id)
      if (!product) continue

      const selectedExtras = cartItem.selectedExtras
        .map((extra) => extraMap.get(extra.id))
        .filter((extra): extra is NonNullable<typeof extra> => Boolean(extra))

      const extrasTotal = selectedExtras.reduce((acc, extra) => acc + extra.price, 0)

      const orderItem = await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: cartItem.quantity,
          observations: cartItem.observations,
          unitPrice: product.price,
          extrasTotal,
          totalPrice: (product.price + extrasTotal) * cartItem.quantity,
        },
      })

      if (selectedExtras.length > 0) {
        await tx.orderItemExtra.createMany({
          data: selectedExtras.map((extra) => ({
            orderItemId: orderItem.id,
            extraId: extra.id,
          })),
        })
      }
    }

    return order
  })

  const hydratedOrder = await getOrderRecord(createdOrder.id)
  return toClientOrder(hydratedOrder)
}

export async function getOrders(): Promise<Order[]> {
  const records = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              extras: {
                include: {
                  extra: true,
                },
              },
            },
          },
          extras: {
            include: {
              extra: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return records.map(toClientOrder)
}

export async function updateOrderStatus(externalId: string, status: OrderStatus): Promise<Order> {
  const updated = await prisma.order.update({
    where: { externalId },
    data: { status },
    select: { id: true },
  })

  const hydratedOrder = await getOrderRecord(updated.id)
  return toClientOrder(hydratedOrder)
}
