import { NextResponse } from "next/server"
import { products as mockProducts, categories as mockCategories } from "@/lib/mock-data"
import { getProductsWithCategories } from "@/lib/server/catalog"

export async function GET() {
  try {
    const data = await getProductsWithCategories()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ products: mockProducts, categories: mockCategories })
  }
}
