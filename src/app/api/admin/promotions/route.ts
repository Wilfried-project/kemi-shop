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

  const promotions = await prisma.promotion.findMany({
    include: { products: { include: { product: { select: { id: true, name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  const products = await prisma.product.findMany({
    where: { active: true },
    select: { id: true, name: true, price: true },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ promotions, products });
}

export async function POST(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const body = await req.json();
  const promo = await prisma.promotion.create({
    data: {
      name: body.name,
      type: body.type,
      value: parseInt(body.value),
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      active: body.active !== false,
      products: {
        create: (body.productIds || []).map((pid: string) => ({ productId: pid })),
      },
    },
  });

  if (body.productIds?.length && body.type && body.value) {
    for (const pid of body.productIds) {
      const product = await prisma.product.findUnique({ where: { id: pid } });
      if (product) {
        let promoPrice: number;
        if (body.type === 'percentage') {
          promoPrice = Math.round(product.price * (1 - parseInt(body.value) / 100));
        } else {
          promoPrice = product.price - parseInt(body.value);
        }
        if (promoPrice > 0) {
          await prisma.product.update({ where: { id: pid }, data: { promoPrice } });
        }
      }
    }
  }

  return NextResponse.json(promo);
}

export async function DELETE(req: Request) {
  if (!checkAuth()) return NextResponse.json({ error: 'Non autorise' }, { status: 401 });

  const { id } = await req.json();

  const promo = await prisma.promotion.findUnique({
    where: { id },
    include: { products: true },
  });

  if (promo) {
    for (const pp of promo.products) {
      await prisma.product.update({
        where: { id: pp.productId },
        data: { promoPrice: null },
      });
    }
    await prisma.productPromotion.deleteMany({ where: { promotionId: id } });
    await prisma.promotion.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}
