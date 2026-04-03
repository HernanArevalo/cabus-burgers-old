import { NextResponse } from "next/server"
import { createOrder, getOrders } from "@/lib/server/orders"

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not fetch orders"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const order = await createOrder(body)
    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create order"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
