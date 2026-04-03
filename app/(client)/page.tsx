"use client"

import { useEffect, useRef, useState } from "react"
import type { Product } from "@/lib/types"
import { categories as mockCategories, products as mockProducts } from "@/lib/mock-data"
import { fetchProducts } from "@/lib/api"
import { HeroSection } from "@/components/hero-section"
import { CategoryNav } from "@/components/category-nav"
import { ProductList } from "@/components/product-list"
import { ProductDetail } from "@/components/product-detail"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartFloatingButton } from "@/components/cart-floating-button"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [categories, setCategories] = useState<string[]>(mockCategories)
  const [activeCategory, setActiveCategory] = useState(mockCategories[0] ?? "Hamburguesas")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleOrderClick = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDetailOpen(true)
  }


  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data.products)
        setCategories(data.categories)
        if (!data.categories.includes(activeCategory)) {
          setActiveCategory(data.categories[0] ?? "Hamburguesas")
        }
      } catch {
        setProducts(mockProducts)
        setCategories(mockCategories)
      }
    }

    void loadProducts()
  }, [])

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <HeroSection onOrderClick={handleOrderClick} />

      {/* Menu section */}
      <div ref={menuRef}>
        <CategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <ProductList
          products={products}
          category={activeCategory}
          onProductClick={handleProductClick}
        />
      </div>

      {/* Product detail drawer */}
      <ProductDetail
        product={selectedProduct}
        open={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false)
          setSelectedProduct(null)
        }}
      />

      {/* Cart sidebar */}
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating cart button */}
      <CartFloatingButton onClick={() => setIsCartOpen(true)} />
    </main>
  )
}
