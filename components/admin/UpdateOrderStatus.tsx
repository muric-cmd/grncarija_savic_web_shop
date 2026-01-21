'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UpdateOrderStatusProps {
  orderId: string
  currentStatus: string
  type?: 'order' | 'payment'
}

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
  type = 'order',
}: UpdateOrderStatusProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const statusOptions =
    type === 'payment'
      ? [
          { value: 'pending', label: 'Na čekanju' },
          { value: 'paid', label: 'Plaćeno' },
          { value: 'failed', label: 'Neuspešno' },
        ]
      : [
          { value: 'pending', label: 'Na čekanju' },
          { value: 'paid', label: 'Plaćeno' },
          { value: 'shipped', label: 'Poslato' },
          { value: 'completed', label: 'Završeno' },
          { value: 'canceled', label: 'Otkazano' },
        ]

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'payment' ? 'paymentStatus' : 'status']: status,
        }),
      })

      if (!response.ok) {
        throw new Error('Greška pri ažuriranju')
      }

      router.refresh()
    } catch (error) {
      alert('Došlo je do greške')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="w-full bg-clay-600 text-white px-4 py-2 rounded-md hover:bg-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? 'Ažuriranje...' : 'Ažuriraj'}
      </button>
    </div>
  )
}

