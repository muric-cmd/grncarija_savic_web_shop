'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'

interface Product {
  id: string
  name: string
  price: number
  image: string
  stock: number
}

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      stock: product.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="font-semibold text-clay-800">Količina:</label>
        <div className="flex items-center border border-clay-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-clay-700 hover:bg-clay-100"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1
              setQuantity(Math.min(product.stock, Math.max(1, val)))
            }}
            className="w-16 text-center border-0 focus:ring-0"
          />
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="px-4 py-2 text-clay-700 hover:bg-clay-100"
          >
            +
          </button>
        </div>
      </div>
      <button
        onClick={handleAddToCart}
        className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-clay-600 text-white hover:bg-clay-700'
        }`}
      >
        {added ? '✓ Dodato u korpu!' : 'Dodaj u korpu'}
      </button>
    </div>
  )
}

