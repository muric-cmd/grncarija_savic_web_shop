'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    disabled?: boolean
}

export default function ImageUpload({
    value,
    onChange,
    disabled
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0]
            if (!file) return

            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            onChange([...value, data.url])
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Došlo je do greške pri otpremanju slike.')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove))
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden border border-clay-200">
                        <div className="absolute top-2 right-2 z-10">
                            <button
                                type="button"
                                onClick={() => handleRemove(url)}
                                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                disabled={disabled}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Uploaded image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <div>
                <label className={`
          block w-full sm:w-auto px-4 py-2 bg-clay-100 text-clay-700 
          rounded-md cursor-pointer hover:bg-clay-200 transition-colors 
          text-center font-medium
          ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                        disabled={disabled || uploading}
                    />
                    {uploading ? 'Otpremanje...' : 'Dodaj Sliku'}
                </label>
            </div>
        </div>
    )
}
