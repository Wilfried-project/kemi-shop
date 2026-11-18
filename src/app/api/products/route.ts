import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    select: { id: true, name: true, slug: true },
  });

  return NextResponse.json({ products, categories });
}
