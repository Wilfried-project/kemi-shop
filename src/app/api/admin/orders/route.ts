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

  const orders = await prisma.order.findMany({
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(orders);
}

export async function PATCH(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const { id, status } = await req.json();
  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(order);
}
