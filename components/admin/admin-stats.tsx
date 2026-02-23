"use client"

import type { Product } from "@/lib/types"
import { Package, ShoppingBag, DollarSign, AlertTriangle } from "lucide-react"

interface AdminStatsProps {
  products: Product[]
}

export function AdminStats({ products }: AdminStatsProps) {
  const totalProducts = products.length
  const inStock = products.filter((p) => p.inStock).length
  const outOfStock = products.filter((p) => !p.inStock).length
  const mockOrders = 24 // Simulated

  const stats = [
    {
      label: "Productos",
      value: totalProducts,
      icon: Package,
      color: "#d4a017",
      bgColor: "rgba(212, 160, 23, 0.1)",
    },
    {
      label: "Con stock",
      value: inStock,
      icon: ShoppingBag,
      color: "#22c55e",
      bgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "Sin stock",
      value: outOfStock,
      icon: AlertTriangle,
      color: "#ef4444",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      label: "Pedidos hoy",
      value: mockOrders,
      icon: DollarSign,
      color: "#3b82f6",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-2 p-4 rounded-xl border"
          style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
        >
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ background: stat.bgColor }}
          >
            <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: "#1c1c1c" }}>{stat.value}</p>
            <p className="text-xs font-medium" style={{ color: "#888888" }}>{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
