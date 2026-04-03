import type { Order, Product, CheckoutFormData, CartItem } from "@/lib/types"

interface ProductsResponse {
  products: Product[]
  categories: string[]
}

interface OrderResponse {
  order: Order
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch("/api/products", { cache: "no-store" })
  if (!response.ok) {
    throw new Error("No se pudo cargar el menu")
  }
  return response.json()
}

export async function submitOrder(input: {
  items: CartItem[]
  subtotal: number
  shippingCost: number
  paymentAdjustment: number
  total: number
  customer: CheckoutFormData
}): Promise<Order> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: input.items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
        selectedExtras: item.selectedExtras.map((extra) => ({ id: extra.id })),
        observations: item.observations,
      })),
      subtotal: input.subtotal,
      shippingCost: input.shippingCost,
      paymentAdjustment: input.paymentAdjustment,
      total: input.total,
      customer: input.customer,
    }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "Error al crear el pedido" }))
    throw new Error(payload.error ?? "Error al crear el pedido")
  }

  const payload = (await response.json()) as OrderResponse
  return payload.order
}
