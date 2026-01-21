import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      email,
      name,
      phone,
      shippingAddress,
      shippingCity,
      shippingZip,
      shippingMethod,
      paymentMethod,
      items,
      subtotal,
      shippingCost,
      total,
      notes,
    } = body

    // Validate required fields
    if (!email || !name || !phone || !shippingAddress || !shippingCity || !shippingZip) {
      return NextResponse.json(
        { error: 'Sva polja su obavezna' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Korpa je prazna' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        email,
        name,
        phone,
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingMethod,
        paymentMethod,
        shippingCost,
        subtotal,
        total,
        notes,
        status: 'pending',
        paymentStatus: paymentMethod === 'card' ? 'pending' : 'pending',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update product stock
    for (const item of items) {
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      } else {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }
    }

    // TODO: Send email notifications
    // await sendOrderConfirmationEmail(order)
    // await sendAdminNotificationEmail(order)

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Greška pri kreiranju porudžbine' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')

    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!order) {
        return NextResponse.json(
          { error: 'Porudžbina nije pronađena' },
          { status: 404 }
        )
      }

      return NextResponse.json(order)
    }

    // For admin: get all orders
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: error.message || 'Greška pri učitavanju porudžbina' },
      { status: 500 }
    )
  }
}

