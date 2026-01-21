'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@prisma/client'
import { useState } from 'react'

interface ProductsFilterProps {
  categories: Category[]
  maxPrice: number
  searchParams: {
    category?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    inStock?: string
  }
}

export default function ProductsFilter({
  categories,
  maxPrice,
  searchParams,
}: ProductsFilterProps) {
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.search || '')
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '')
  const [maxPriceFilter, setMaxPriceFilter] = useState(
    searchParams.maxPrice || ''
  )
  const [inStock, setInStock] = useState(searchParams.inStock === 'true')

  const updateFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPriceFilter) params.set('maxPrice', maxPriceFilter)
    if (inStock) params.set('inStock', 'true')
    if (searchParams.category) params.set('category', searchParams.category)
    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPriceFilter('')
    setInStock(false)
    router.push('/products')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-clay-800 mb-4">Filteri</h2>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-clay-700 mb-2">
          Pretraga
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && updateFilters()}
          placeholder="Pretraži proizvode..."
          className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-clay-700 mb-2">
          Kategorija
        </label>
        <div className="space-y-2">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams as any)
              params.delete('category')
              router.push(`/products?${params.toString()}`)
            }}
            className={`block w-full text-left px-3 py-2 rounded-md ${
              !searchParams.category
                ? 'bg-clay-600 text-white'
                : 'bg-clay-50 text-clay-700 hover:bg-clay-100'
            }`}
          >
            Sve kategorije
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams as any)
                params.set('category', category.slug)
                router.push(`/products?${params.toString()}`)
              }}
              className={`block w-full text-left px-3 py-2 rounded-md ${
                searchParams.category === category.slug
                  ? 'bg-clay-600 text-white'
                  : 'bg-clay-50 text-clay-700 hover:bg-clay-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-clay-700 mb-2">
          Cena
        </label>
        <div className="space-y-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
          />
          <input
            type="number"
            value={maxPriceFilter}
            onChange={(e) => setMaxPriceFilter(e.target.value)}
            placeholder="Max"
            className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
          />
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="w-4 h-4 text-clay-600 border-clay-300 rounded focus:ring-clay-500"
          />
          <span className="text-sm text-clay-700">Samo na stanju</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={updateFilters}
          className="w-full bg-clay-600 text-white px-4 py-2 rounded-md hover:bg-clay-700 transition-colors"
        >
          Primeni Filtere
        </button>
        <button
          onClick={clearFilters}
          className="w-full bg-clay-200 text-clay-800 px-4 py-2 rounded-md hover:bg-clay-300 transition-colors"
        >
          Obriši Filtere
        </button>
      </div>
    </div>
  )
}

