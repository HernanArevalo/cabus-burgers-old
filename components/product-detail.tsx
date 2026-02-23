"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import type { Product, Extra } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { X } from "lucide-react"

interface ProductDetailProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function ProductDetail({ product, open, onClose }: ProductDetailProps) {
  const { addItem } = useCart()
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const [observations, setObservations] = useState("")

  const totalPrice = useMemo(() => {
    if (!product) return 0
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0)
    return product.price + extrasTotal
  }, [product, selectedExtras])

  const handleExtraToggle = (extra: Extra, checked: boolean) => {
    if (checked) {
      setSelectedExtras((prev) => [...prev, extra])
    } else {
      setSelectedExtras((prev) => prev.filter((e) => e.id !== extra.id))
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, selectedExtras, observations)
    setSelectedExtras([])
    setObservations("")
    onClose()
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedExtras([])
      setObservations("")
      onClose()
    }
  }

  if (!product) return null

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[90vh] bg-card">
        <div className="overflow-y-auto flex-1">
          {/* Close button */}
          <DrawerClose className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-card/80 backdrop-blur-sm text-card-foreground shadow-md">
            <X className="w-4 h-4" />
            <span className="sr-only">Cerrar</span>
          </DrawerClose>

          {/* Product image */}
          <div className="relative w-full h-52 sm:h-64">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="px-5 py-4">
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle className="text-xl font-bold text-card-foreground font-mono">
                {product.name}
              </DrawerTitle>
              <DrawerDescription className="mt-1 text-sm text-card-foreground/60 leading-relaxed">
                {product.description}
              </DrawerDescription>
              <p className="mt-2 text-xl font-bold text-primary">
                ${product.price.toLocaleString("es-AR")}
              </p>
            </DrawerHeader>

            {/* Extras */}
            {product.extras.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider mb-3">
                  Extras
                </h3>
                <div className="flex flex-col gap-2">
                  {product.extras.map((extra) => {
                    const isSelected = selectedExtras.some((e) => e.id === extra.id)
                    const isDisabled = !extra.inStock

                    return (
                      <label
                        key={extra.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                          isDisabled
                            ? "opacity-40 cursor-not-allowed bg-muted/10 border-border/30"
                            : isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border/40 hover:border-primary/40"
                        }`}
                      >
                        <Checkbox
                          checked={isSelected}
                          disabled={isDisabled}
                          onCheckedChange={(checked) =>
                            handleExtraToggle(extra, checked === true)
                          }
                          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className={`flex-1 text-sm font-medium ${isDisabled ? "text-card-foreground/40 line-through" : "text-card-foreground"}`}>
                          {extra.name}
                          {isDisabled && (
                            <span className="ml-2 text-xs text-card-foreground/30">(Sin stock)</span>
                          )}
                        </span>
                        <span className={`text-sm font-bold ${isDisabled ? "text-card-foreground/30" : "text-primary"}`}>
                          {extra.price > 0 ? `+$${extra.price.toLocaleString("es-AR")}` : "Gratis"}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Observations */}
            <div className="mt-6">
              <h3 className="text-sm font-bold text-card-foreground uppercase tracking-wider mb-3">
                Observaciones
              </h3>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Ej: Sin cebolla, bien cocida..."
                rows={2}
                className="w-full p-3 rounded-lg border border-border/40 bg-card text-card-foreground text-sm placeholder:text-card-foreground/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Fixed bottom CTA */}
        <div className="sticky bottom-0 px-5 py-4 border-t border-border/20 bg-card">
          <button
            onClick={handleAddToCart}
            className="w-full px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all hover:brightness-110 active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            Agregar al carrito &ndash; ${totalPrice.toLocaleString("es-AR")}
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
