import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_')

        // Ensure uploads directory exists (you might need to create it manually or check here)
        // For simplicity, we assume public/uploads exists or we write to it.
        // In production, you'd use S3 or Cloudinary.
        const uploadDir = path.join(process.cwd(), 'public/uploads')

        try {
            await writeFile(path.join(uploadDir, filename), buffer)
        } catch (error) {
            // If directory doesn't exist, this might fail unless we create it.
            // Let's rely on manual creation or subsequent step to ensure dir exists.
            return NextResponse.json({ error: 'Failed to write file. Ensure public/uploads exists.' }, { status: 500 })
        }

        return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
    }
}
