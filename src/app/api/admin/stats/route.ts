import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const token = cookies().get('admin_token')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
  }

  const [totalOrders, totalProducts, orders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({ select: { total: true, status: true } }),
  ]);

  const totalRevenue = orders
    .filter(o => o.status !== 'annulee')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o => o.status === 'en_attente').length;

  return NextResponse.json({
    totalOrders,
    totalProducts,
    totalRevenue,
    pendingOrders,
  });
}
