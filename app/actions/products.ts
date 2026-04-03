"use server"

import { getProductsWithCategories, toggleProductStock } from "@/lib/server/catalog"

export async function getProductsAction() {
  return getProductsWithCategories()
}

export async function toggleProductStockAction(productId: string) {
  return toggleProductStock(productId)
}
