import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@/lib/server/health"

export async function GET() {
  try {
    await checkDatabaseConnection()
    return NextResponse.json({ status: "ok", database: "connected" })
  } catch {
    return NextResponse.json({ status: "error", database: "disconnected" }, { status: 503 })
  }
}
