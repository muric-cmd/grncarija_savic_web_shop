'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

interface Variant {
    id: string
    name: string
    price: number
    stock: number
}

interface Product {
    id: string
    name: string
    description: string
    price: number
    stock: number
    images: string
    dimensions?: string | null
    material?: string | null
    variants: Variant[]
    category: {
        name: string
    }
}

export default function ProductDetails({ product }: { product: Product }) {
    const { addItem } = useCart()
    const images = JSON.parse(product.images || '[]')
    const [selectedImage, setSelectedImage] = useState(images[0] || '/placeholder.png')
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants.length > 0 ? product.variants[0] : null
    )

    const currentPrice = selectedVariant ? selectedVariant.price : product.price
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('sr-RS', {
            style: 'currency',
            currency: 'RSD',
        }).format(price)
    }

    const handleAddToCart = () => {
        addItem({
            productId: product.id,
            variantId: selectedVariant?.id,
            name: selectedVariant ? `${product.name} (${selectedVariant.name})` : product.name,
            price: currentPrice,
            quantity: 1,
            image: images[0] || '/placeholder.png',
            stock: currentStock,
        })
        alert('Dodato u korpu!')
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="relative h-96 bg-clay-100 rounded-lg overflow-hidden">
                    <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`relative h-24 bg-clay-100 rounded-lg overflow-hidden ring-2 transition-all ${selectedImage === img ? 'ring-clay-600' : 'ring-transparent'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div>
                <div className="mb-2">
                    <span className="text-sm font-medium text-clay-500 bg-clay-100 px-3 py-1 rounded-full">
                        {product.category.name}
                    </span>
                </div>

                <h1 className="text-4xl font-bold text-clay-800 mb-2">
                    {product.name}
                </h1>

                <div className="text-3xl font-bold text-clay-800 mb-6">
                    {formatPrice(currentPrice)}
                </div>

                <div className="prose max-w-none mb-8 text-clay-600">
                    <p>{product.description}</p>
                </div>

                {/* Variants Selector */}
                {product.variants.length > 0 && (
                    <div className="mb-8 p-4 bg-clay-50 rounded-lg">
                        <h3 className="text-sm font-semibold text-clay-700 mb-3">Izaberite varijantu:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedVariant?.id === variant.id
                                            ? 'bg-clay-800 text-white shadow-md'
                                            : 'bg-white text-clay-700 hover:bg-clay-100 border border-clay-200'
                                        }`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Attributes */}
                <div className="border-t border-b border-clay-200 py-6 mb-8 space-y-3">
                    {product.dimensions && (
                        <div className="flex justify-between">
                            <span className="font-semibold text-clay-800">Dimenzije</span>
                            <span className="text-clay-600">{product.dimensions}</span>
                        </div>
                    )}
                    {product.material && (
                        <div className="flex justify-between">
                            <span className="font-semibold text-clay-800">Materijal</span>
                            <span className="text-clay-600">{product.material}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="font-semibold text-clay-800">Stanje</span>
                        {currentStock > 0 ? (
                            <span className="text-green-600 font-medium">
                                Na stanju ({currentStock} kom.)
                            </span>
                        ) : (
                            <span className="text-red-500 font-medium">Nema na stanju</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={currentStock <= 0}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors shadow-lg ${currentStock > 0
                                ? 'bg-clay-600 text-white hover:bg-clay-700 hover:shadow-xl'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {currentStock > 0 ? 'Dodaj u Korpu' : 'Nema na stanju'}
                    </button>
                </div>
            </div>
        </div>
    )
}
