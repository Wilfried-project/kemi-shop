import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { slugify } from '@/lib/utils';

function checkAuth() {
  const token = cookies().get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token);
}

export async function GET() {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const products = await prisma.product.findMany({
    include: { category: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });

  return NextResponse.json({ products, categories });
}

export async function POST(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: slugify(body.name),
      description: body.description || '',
      price: parseInt(body.price),
      promoPrice: body.promoPrice ? parseInt(body.promoPrice) : null,
      categoryId: body.categoryId,
      image: body.image || null,
      stock: parseInt(body.stock || '100'),
      active: body.active !== false,
      featured: body.featured === true,
      minOrder: parseInt(body.minOrder || '1'),
      unit: body.unit || 'piece',
      tags: body.tags || null,
    },
  });

  return NextResponse.json(product);
}

export async function PUT(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const body = await req.json();
  const product = await prisma.product.update({
    where: { id: body.id },
    data: {
      name: body.name,
      slug: slugify(body.name),
      description: body.description || '',
      price: parseInt(body.price),
      promoPrice: body.promoPrice ? parseInt(body.promoPrice) : null,
      categoryId: body.categoryId,
      image: body.image || null,
      stock: parseInt(body.stock || '100'),
      active: body.active !== false,
      featured: body.featured === true,
      minOrder: parseInt(body.minOrder || '1'),
      unit: body.unit || 'piece',
      tags: body.tags || null,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const { id } = await req.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
