import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

function checkAuth() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const settings = await prisma.settings.findUnique({ where: { id: 'main' } });
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const body = await req.json();
  const settings = await prisma.settings.update({
    where: { id: 'main' },
    data: {
      shopName: body.shopName,
      phone: body.phone,
      whatsapp: body.whatsapp,
      address: body.address,
      deliveryFee: body.deliveryFee,
      slogan: body.slogan,
      paymentMethods: body.paymentMethods,
    },
  });

  return NextResponse.json(settings);
}
