import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "Category" ("id" TEXT NOT NULL,"name" TEXT NOT NULL,"slug" TEXT NOT NULL,"description" TEXT,"image" TEXT,"order" INTEGER NOT NULL DEFAULT 0,"active" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Category_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "Product" ("id" TEXT NOT NULL,"name" TEXT NOT NULL,"slug" TEXT NOT NULL,"description" TEXT,"price" INTEGER NOT NULL,"promoPrice" INTEGER,"image" TEXT,"images" TEXT,"categoryId" TEXT NOT NULL,"stock" INTEGER NOT NULL DEFAULT 100,"active" BOOLEAN NOT NULL DEFAULT true,"featured" BOOLEAN NOT NULL DEFAULT false,"minOrder" INTEGER NOT NULL DEFAULT 1,"unit" TEXT NOT NULL DEFAULT 'piece',"tags" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Product_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "Order" ("id" TEXT NOT NULL,"orderNumber" TEXT NOT NULL,"customerName" TEXT NOT NULL,"customerPhone" TEXT NOT NULL,"commune" TEXT NOT NULL,"quartier" TEXT NOT NULL,"address" TEXT NOT NULL,"instructions" TEXT,"subtotal" INTEGER NOT NULL,"deliveryFee" INTEGER NOT NULL,"total" INTEGER NOT NULL,"paymentMethod" TEXT NOT NULL,"status" TEXT NOT NULL DEFAULT 'en_attente',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Order_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "OrderItem" ("id" TEXT NOT NULL,"orderId" TEXT NOT NULL,"productId" TEXT NOT NULL,"quantity" INTEGER NOT NULL,"price" INTEGER NOT NULL,"total" INTEGER NOT NULL,CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "Promotion" ("id" TEXT NOT NULL,"name" TEXT NOT NULL,"type" TEXT NOT NULL,"value" INTEGER NOT NULL,"startDate" TIMESTAMP(3) NOT NULL,"endDate" TIMESTAMP(3) NOT NULL,"active" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "ProductPromotion" ("id" TEXT NOT NULL,"productId" TEXT NOT NULL,"promotionId" TEXT NOT NULL,CONSTRAINT "ProductPromotion_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "Admin" ("id" TEXT NOT NULL,"email" TEXT NOT NULL,"password" TEXT NOT NULL,"name" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Admin_pkey" PRIMARY KEY ("id"));
CREATE TABLE IF NOT EXISTS "Settings" ("id" TEXT NOT NULL DEFAULT 'main',"shopName" TEXT NOT NULL DEFAULT 'Les Fruits et Légumes de KEMI',"phone" TEXT NOT NULL DEFAULT '07 57 56 88 28',"whatsapp" TEXT NOT NULL DEFAULT '2250757568828',"address" TEXT NOT NULL DEFAULT 'Abidjan, Côte d''Ivoire',"deliveryFee" INTEGER NOT NULL DEFAULT 1000,"logo" TEXT,"slogan" TEXT NOT NULL DEFAULT 'La fraîcheur made in KEMI',"currency" TEXT NOT NULL DEFAULT 'FCFA',"paymentMethods" TEXT NOT NULL DEFAULT 'livraison,wave,orange_money,mtn_money,moov_money',CONSTRAINT "Settings_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductPromotion_productId_promotionId_key" ON "ProductPromotion"("productId","promotionId");
CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");
DO $$ BEGIN ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "ProductPromotion" ADD CONSTRAINT "ProductPromotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER TABLE "ProductPromotion" ADD CONSTRAINT "ProductPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`;

export async function GET() {
  try {
    // Step 1: Create tables
    const statements = SCHEMA_SQL.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt + ';');
    }

    // Step 2: Check if already seeded
    const existing = await prisma.admin.findFirst();
    if (existing) {
      return NextResponse.json({ message: 'Tables creees. Base de donnees deja initialisee.', seeded: false });
    }

    // Step 3: Seed data
    const hashedPassword = await bcrypt.hash('kemi2024', 10);
    await prisma.admin.create({
      data: { email: 'admin@kemi.ci', password: hashedPassword, name: 'Admin KEMI' },
    });

    await prisma.settings.upsert({
      where: { id: 'main' },
      update: {},
      create: {
        id: 'main',
        shopName: 'Les Fruits et Légumes de KEMI',
        phone: '07 57 56 88 28',
        whatsapp: '2250757568828',
        address: 'Abidjan, Côte d\'Ivoire',
        deliveryFee: 1000,
        slogan: 'La fraîcheur made in KEMI',
        currency: 'FCFA',
        paymentMethods: 'livraison,wave,orange_money,mtn_money,moov_money',
      },
    });

    const catJus = await prisma.category.create({ data: { name: 'Nos Jus', slug: 'nos-jus', description: 'Jus de fruits et légumes naturels, 100% pur jus', order: 1 } });
    const catShots = await prisma.category.create({ data: { name: 'Mini Shots', slug: 'mini-shots', description: 'Concentrés naturels pour booster votre immunité', order: 2 } });
    const catSignature = await prisma.category.create({ data: { name: 'Jus Signature KEMI', slug: 'jus-signature', description: 'Jus de fruits frais 100% naturels', order: 3 } });
    const catSalades = await prisma.category.create({ data: { name: 'Salades de Fruits', slug: 'salades-de-fruits', description: 'Gobelets, barquettes et verrines de fruits frais', order: 4 } });
    const catPacks = await prisma.category.create({ data: { name: 'Packs & Offres', slug: 'packs-et-offres', description: 'Nos packs et offres spéciales', order: 5 } });
    const catEvenements = await prisma.category.create({ data: { name: 'Événements & Prestations', slug: 'evenements', description: 'Brochettes, plateaux, buffets de fruits', order: 6 } });
    const catChocolat = await prisma.category.create({ data: { name: 'Fraises au Chocolat', slug: 'fraises-au-chocolat', description: 'Fraises enrobées de chocolat', order: 7 } });

    const products = [
      { name: 'Persil Detox', slug: 'persil-detox', description: 'Jus vert detox à base de persil, 100% pur jus.', price: 3000, categoryId: catJus.id, featured: true, tags: 'detox,vert,persil' },
      { name: 'Red Juice', slug: 'red-juice', description: 'Jus rouge à base de betterave, 100% pur jus.', price: 3000, categoryId: catJus.id, featured: true, tags: 'betterave,rouge,antioxydant' },
      { name: 'Brûle Graisse', slug: 'brule-graisse', description: 'Jus brûle-graisse 100% pur jus.', price: 3000, categoryId: catJus.id, featured: true, tags: 'minceur,energie,detox' },
      { name: 'Booster', slug: 'booster', description: 'Jus orange à base de carotte, 100% pur jus.', price: 3000, categoryId: catJus.id, featured: true, tags: 'carotte,vitamines,energie' },
      { name: 'Ginger Shot', slug: 'ginger-shot', description: 'Concentré de gingembre et citron, 100% naturel.', price: 1000, categoryId: catShots.id, featured: true, tags: 'gingembre,citron,immunite' },
      { name: 'Élixir Shot', slug: 'elixir-shot', description: 'Concentré au curcuma, anti-inflammatoire naturel.', price: 1000, categoryId: catShots.id, featured: true, tags: 'curcuma,anti-inflammatoire' },
      { name: 'Réveil Cobra Shot', slug: 'reveil-cobra-shot', description: 'Concentré à base de souchet. Focus et énergie.', price: 1000, categoryId: catShots.id, featured: true, tags: 'souchet,energie,vitalite' },
      { name: "Jus d'Orange Frais", slug: 'jus-orange-frais', description: "Jus d'orange 100% naturel, pressé frais.", price: 1500, categoryId: catSignature.id, featured: true, tags: 'orange,frais,naturel' },
      { name: "Jus d'Ananas Frais", slug: 'jus-ananas-frais', description: "Jus d'ananas 100% naturel, pressé frais.", price: 1500, categoryId: catSignature.id, tags: 'ananas,frais' },
      { name: 'Jus de Pastèque Frais', slug: 'jus-pasteque-frais', description: 'Jus de pastèque 100% naturel.', price: 1500, categoryId: catSignature.id, tags: 'pasteque,frais' },
      { name: 'Gobelet de Fruits', slug: 'gobelet-de-fruits', description: 'Gobelet de fruits frais découpés.', price: 1500, categoryId: catSalades.id, featured: true, tags: 'gobelet,frais' },
      { name: 'Salade de Fruits Fraîcheurs', slug: 'salade-fruits-fraicheurs', description: 'Plateau de salade de fruits frais composé.', price: 5000, categoryId: catSalades.id, featured: true, tags: 'salade,plateau' },
      { name: 'Barquette de Fruits', slug: 'barquette-de-fruits', description: 'Barquette de fruits frais découpés.', price: 3000, categoryId: catSalades.id, tags: 'barquette,mix' },
      { name: 'Petit Pot de Fruits', slug: 'petit-pot-de-fruits', description: 'Petit pot de fruits frais individuel.', price: 1500, categoryId: catSalades.id, tags: 'pot,individuel' },
      { name: 'Verrine de Fruits', slug: 'verrine-de-fruits', description: 'Verrine de fruits frais élégante.', price: 2000, categoryId: catSalades.id, tags: 'verrine,elegant' },
      { name: 'Pack 10 Bouteilles de Jus', slug: 'pack-10-bouteilles', description: 'Pack de 10 bouteilles de jus naturels.', price: 28000, categoryId: catPacks.id, featured: true, tags: 'pack,economique' },
      { name: 'Pack 10 Mini Shots', slug: 'pack-10-mini-shots', description: 'Pack de 10 mini shots au choix.', price: 10000, categoryId: catPacks.id, tags: 'pack,shots' },
      { name: 'Pack Immunité Complet', slug: 'pack-immunite-complet', description: '30 shots pour transformer votre corps.', price: 29000, categoryId: catPacks.id, featured: true, tags: 'pack,immunite' },
      { name: 'Pack Spécial Bien-être', slug: 'pack-special-bien-etre', description: 'Salade de fruits + jus Brûle Graisse.', price: 8000, categoryId: catPacks.id, tags: 'pack,bien-etre' },
      { name: 'Box Surprise', slug: 'box-surprise', description: 'Box surprise gourmande avec fruits frais.', price: 20000, categoryId: catPacks.id, tags: 'box,surprise,cadeau' },
      { name: 'Brochettes de Fruits', slug: 'brochettes-de-fruits', description: 'Brochettes de fruits pour événements. Min. 50.', price: 500, minOrder: 50, unit: 'brochette', categoryId: catEvenements.id, tags: 'brochette,evenement' },
      { name: 'Plateau de Fruits', slug: 'plateau-de-fruits', description: 'Plateau de fruits pour événements.', price: 15000, categoryId: catEvenements.id, tags: 'plateau,evenement' },
      { name: 'Buffet de Fruits / Événement', slug: 'buffet-fruits-evenement', description: 'Prestations fruitées pour mariages.', price: 50000, categoryId: catEvenements.id, tags: 'buffet,traiteur' },
      { name: 'Coffret Fraises au Chocolat', slug: 'coffret-fraises-chocolat', description: 'Coffret de fraises enrobées de chocolat.', price: 15000, categoryId: catChocolat.id, featured: true, tags: 'fraise,chocolat,coffret' },
      { name: 'Bouquet de Fraises au Chocolat', slug: 'bouquet-fraises-chocolat', description: 'Bouquet de fraises enrobées de chocolat.', price: 20000, categoryId: catChocolat.id, tags: 'bouquet,fraise,chocolat' },
    ];

    for (const p of products) {
      await prisma.product.create({
        data: {
          name: p.name, slug: p.slug, description: p.description, price: p.price,
          categoryId: p.categoryId, featured: (p as any).featured ?? false,
          minOrder: (p as any).minOrder ?? 1, unit: (p as any).unit ?? 'piece',
          tags: (p as any).tags ?? null, active: true, stock: 100,
        },
      });
    }

    return NextResponse.json({ message: 'Base de donnees initialisee avec succes!', seeded: true, products: products.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
