"use client"

import { useState } from "react"
import Image from "next/image"
import type { Product } from "@/lib/types"
import { products as initialProducts, categories } from "@/lib/mock-data"
import { mockExtras } from "@/lib/admin-mock-data"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"

export function AdminProducts() {
  const [productsList, setProductsList] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState("Todos")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formCategory, setFormCategory] = useState(categories[0])
  const [formBadge, setFormBadge] = useState("")
  const [formInStock, setFormInStock] = useState(true)
  const [formExtras, setFormExtras] = useState<string[]>([])

  const filteredProducts = productsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      filterCategory === "Todos" || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const openCreate = () => {
    setEditingProduct(null)
    setFormName("")
    setFormDescription("")
    setFormPrice("")
    setFormCategory(categories[0])
    setFormBadge("")
    setFormInStock(true)
    setFormExtras([])
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setFormName(product.name)
    setFormDescription(product.description)
    setFormPrice(product.price.toString())
    setFormCategory(product.category)
    setFormBadge(product.badge || "")
    setFormInStock(product.inStock)
    setFormExtras(product.extras.map((e) => e.id))
    setModalOpen(true)
  }

  const handleSave = () => {
    const selectedExtras = mockExtras.filter((e) => formExtras.includes(e.id))
    if (editingProduct) {
      setProductsList((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formName,
                description: formDescription,
                price: parseInt(formPrice) || 0,
                category: formCategory,
                badge: formBadge || undefined,
                inStock: formInStock,
                extras: selectedExtras,
              }
            : p
        )
      )
    } else {
      const newProduct: Product = {
        id: `product-${Date.now()}`,
        name: formName,
        description: formDescription,
        price: parseInt(formPrice) || 0,
        image: "/images/burger-clasica.jpg",
        category: formCategory,
        badge: formBadge || undefined,
        inStock: formInStock,
        extras: selectedExtras,
      }
      setProductsList((prev) => [...prev, newProduct])
    }
    setModalOpen(false)
  }

  const handleDelete = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId))
  }

  const handleToggleStock = (productId: string) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, inStock: !p.inStock } : p
      )
    )
  }

  const toggleExtra = (extraId: string) => {
    setFormExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1c1c1c" }}>Productos</h1>
          <p className="text-sm mt-1" style={{ color: "#999999" }}>
            {productsList.length} productos en total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: "#1a3a2a", color: "#f5f5f0" }}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Agregar producto</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#aaaaaa" }}
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
            style={{
              background: "#ffffff",
              borderColor: "#e8e8e5",
              color: "#1c1c1c",
              "--tw-ring-color": "#1a3a2a",
            } as React.CSSProperties}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["Todos", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
              style={
                filterCategory === cat
                  ? { background: "#1a3a2a", color: "#f5f5f0" }
                  : { background: "#ffffff", color: "#888888", border: "1px solid #e8e8e5" }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "#ffffff", borderColor: "#e8e8e5" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#fafaf8" }}>
                <th
                  className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "#999999" }}
                >
                  Producto
                </th>
                <th
                  className="text-left py-3 px-4 font-semibold text-xs uppercase tracking-wider hidden sm:table-cell"
                  style={{ color: "#999999" }}
                >
                  Categoria
                </th>
                <th
                  className="text-right py-3 px-4 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "#999999" }}
                >
                  Precio
                </th>
                <th
                  className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "#999999" }}
                >
                  Activo
                </th>
                <th
                  className="text-center py-3 px-4 font-semibold text-xs uppercase tracking-wider"
                  style={{ color: "#999999" }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id}
                  style={{
                    borderTop: index > 0 ? "1px solid #f0f0ed" : "none",
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="font-semibold truncate"
                          style={{ color: product.inStock ? "#1c1c1c" : "#aaaaaa" }}
                        >
                          {product.name}
                        </p>
                        <p
                          className="text-xs truncate sm:hidden"
                          style={{ color: "#aaaaaa" }}
                        >
                          {product.category}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-md text-xs font-medium"
                      style={{ background: "#f0f0ed", color: "#666666" }}
                    >
                      {product.category}
                    </span>
                  </td>
                  <td
                    className="py-3 px-4 text-right font-bold"
                    style={{ color: "#1c1c1c" }}
                  >
                    ${product.price.toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <Switch
                        checked={product.inStock}
                        onCheckedChange={() => handleToggleStock(product.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" style={{ color: "#888888" }} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"
                        aria-label={`Eliminar ${product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#aaaaaa" }}>
            <p className="text-sm">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="max-h-[90vh] overflow-y-auto"
          style={{ background: "#ffffff" }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "#1c1c1c" }}>
              {editingProduct ? "Editar producto" : "Agregar producto"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                Nombre
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="Nombre del producto"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                Descripcion
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="Descripcion breve"
              />
            </div>

            {/* Price & Category row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                  Precio ($)
                </label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                  placeholder="4500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                  Categoria
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 appearance-none"
                  style={{ borderColor: "#e8e8e5", color: "#1c1c1c", background: "#ffffff", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#666666" }}>
                Etiqueta (opcional)
              </label>
              <input
                type="text"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "#e8e8e5", color: "#1c1c1c", "--tw-ring-color": "#1a3a2a" } as React.CSSProperties}
                placeholder="Ej: Mas vendido, Nuevo, Ahorra $500"
              />
            </div>

            {/* In stock toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="text-sm font-semibold" style={{ color: "#1c1c1c" }}>
                Producto activo
              </label>
              <Switch
                checked={formInStock}
                onCheckedChange={setFormInStock}
                className="data-[state=checked]:bg-green-500"
              />
            </div>

            {/* Extras selection */}
            <div>
              <label className="block text-xs font-semibold mb-2" style={{ color: "#666666" }}>
                Extras disponibles
              </label>
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto">
                {mockExtras.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                    style={{
                      background: formExtras.includes(extra.id) ? "#f0f0ed" : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formExtras.includes(extra.id)}
                      onChange={() => toggleExtra(extra.id)}
                      className="w-4 h-4 rounded accent-green-600"
                    />
                    <span className="text-sm flex-1" style={{ color: "#1c1c1c" }}>
                      {extra.name}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#999999" }}>
                      {extra.price > 0 ? `+$${extra.price.toLocaleString("es-AR")}` : "Gratis"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
                style={{ borderColor: "#e8e8e5", color: "#666666" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formName || !formPrice}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
                style={{ background: "#1a3a2a", color: "#f5f5f0" }}
              >
                {editingProduct ? "Guardar cambios" : "Crear producto"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
