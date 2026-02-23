"use client"

import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminSection } from "@/lib/admin-nav-context"

interface AdminHeaderProps {
  isStoreOpen: boolean
  onToggleStore: () => void
  activeTab: AdminSection
  onTabChange: (tab: "productos" | "pedidos") => void
}

export function AdminHeader({
  isStoreOpen,
  onToggleStore,
  activeTab,
  onTabChange,
}: AdminHeaderProps) {
  return (
    <header style={{ background: "#1a3a2a" }}>
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: "rgba(255,255,255,0.1)", color: "#f5f5f0" }}
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold font-mono" style={{ color: "#f5f5f0" }}>
                CABUS Admin
              </h1>
              <p className="text-xs" style={{ color: "#a3b8aa" }}>Panel de administracion</p>
            </div>
          </div>

          {/* Store toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium" style={{ color: "#a3b8aa" }}>
              {isStoreOpen ? "Abierto" : "Cerrado"}
            </span>
            <Switch
              checked={isStoreOpen}
              onCheckedChange={onToggleStore}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {(["productos", "pedidos"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className="px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all"
              style={
                activeTab === tab
                  ? { background: "#d4a017", color: "#1c1c1c" }
                  : { background: "rgba(255,255,255,0.08)", color: "#a3b8aa" }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
