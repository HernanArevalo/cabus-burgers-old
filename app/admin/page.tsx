"use client"

import { useEffect, useState } from "react"
import { products as initialProducts, categories, storeStatus as initialStoreStatus } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import { 
         AdminProducts,
         AdminOrders,
         AdminCategories,
        AdminExtras,
        AdminDashboard,
        AdminShipping,
        AdminPayments
        } from "@/components/admin"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminSection, useAdminNav } from "@/lib/admin-nav-context"


export default function AdminPage() {
    const { activeSection, setActiveSection } = useAdminNav()
  
  const [productsList, setProductsList] = useState<Product[]>(initialProducts)
  const [isStoreOpen, setIsStoreOpen] = useState(initialStoreStatus.isOpen)

  const handleToggleStock = (productId: string) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    )
  }

  const sections: Record<AdminSection, React.ReactNode> = {
    productos: <AdminProducts />,
    pedidos: <AdminOrders />,
    categorias: <AdminCategories />,
    extras: <AdminExtras />,
    dashboard : <AdminDashboard />,
    envio : <AdminShipping />,
    pagos : <AdminPayments />,
    config : <AdminDashboard />,

  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        isStoreOpen={isStoreOpen}
        onToggleStore={() => setIsStoreOpen((prev) => !prev)}
        activeTab={activeSection}
        onTabChange={setActiveSection}
      />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <AdminStats products={productsList} />

        {sections[activeSection]}
      </main>
    </div>
  )
}
