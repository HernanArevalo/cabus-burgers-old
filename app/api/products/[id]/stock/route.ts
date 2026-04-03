import { NextResponse } from "next/server"
import { toggleProductStock } from "@/lib/server/catalog"

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(_: Request, { params }: Params) {
  try {
    const { id } = await params
    const product = await toggleProductStock(id)
    return NextResponse.json({ product })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not toggle stock"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
