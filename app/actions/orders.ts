"use server"

import type { CreateOrderInput } from "@/lib/server/types"
import { createOrder, getOrders, updateOrderStatus } from "@/lib/server/orders"
import { OrderStatus } from "@prisma/client"

export async function createOrderAction(input: CreateOrderInput) {
  return createOrder(input)
}

export async function getOrdersAction() {
  return getOrders()
}

export async function updateOrderStatusAction(externalId: string, status: OrderStatus) {
  return updateOrderStatus(externalId, status)
}
