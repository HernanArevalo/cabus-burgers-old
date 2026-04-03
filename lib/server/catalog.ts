import { prisma } from "@/lib/prisma"
import type { Product } from "@/lib/types"

export async function getProductsWithCategories(): Promise<{ products: Product[]; categories: string[] }> {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      extras: {
        include: {
          extra: true,
        },
      },
    },
    orderBy: [{ category: { order: "asc" } }, { name: "asc" }],
  })

  const mapped: Product[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.image,
    category: product.category.name,
    badge: product.badge ?? undefined,
    inStock: product.inStock,
    extras: product.extras.map(({ extra }) => ({
      id: extra.id,
      name: extra.name,
      price: extra.price,
      inStock: extra.inStock,
    })),
  }))

  const categories = Array.from(new Set(mapped.map((product) => product.category)))

  return { products: mapped, categories }
}

export async function toggleProductStock(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, inStock: true },
  })

  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND")
  }

  return prisma.product.update({
    where: { id: product.id },
    data: { inStock: !product.inStock },
    select: { id: true, inStock: true },
  })
}
