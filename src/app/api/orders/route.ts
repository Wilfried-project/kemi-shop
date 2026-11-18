import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, commune, quartier, address, instructions, paymentMethod, items, subtotal, deliveryFee, total } = body;

    if (!customerName || !customerPhone || !commune || !quartier || !address || !paymentMethod || !items?.length) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerPhone,
        commune,
        quartier,
        address,
        instructions: instructions || '',
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Erreur lors de la creation de la commande' }, { status: 500 });
  }
}
