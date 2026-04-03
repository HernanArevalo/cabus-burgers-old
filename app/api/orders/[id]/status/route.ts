import { OrderStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import { updateOrderStatus } from "@/lib/server/orders"

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const status = body?.status as OrderStatus

    if (!status || !(status in OrderStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const order = await updateOrderStatus(id, status)
    return NextResponse.json({ order })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update order status"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
