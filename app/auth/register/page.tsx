'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Lozinke se ne poklapaju')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Došlo je do greške')
            }

            // Automatically log in after registration
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            })

            if (result?.error) {
                router.push('/auth/login')
            } else {
                router.push('/')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-clay-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-clay-800 mb-6 text-center">
                    Registracija
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-clay-700 mb-1">
                            Ime i prezime
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            required
                            className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-clay-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            required
                            className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-clay-700 mb-1">
                            Lozinka
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-clay-700 mb-1">
                            Potvrdite lozinku
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-clay-600 text-white px-4 py-2 rounded-md hover:bg-clay-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Kreiranje naloga...' : 'Registruj se'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-clay-600">
                        Već imate nalog?{' '}
                        <Link href="/auth/login" className="text-clay-600 font-semibold hover:underline">
                            Prijavite se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
