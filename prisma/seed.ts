import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin
  const hashedPassword = await bcrypt.hash('kemi2024', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@kemi.ci' },
    update: {},
    create: {
      email: 'admin@kemi.ci',
      password: hashedPassword,
      name: 'Admin KEMI',
    },
  });

  // Create settings
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

  // Create categories
  const catJus = await prisma.category.upsert({
    where: { slug: 'nos-jus' },
    update: {},
    create: {
      name: 'Nos Jus',
      slug: 'nos-jus',
      description: 'Jus de fruits et légumes naturels, 100% pur jus, pressés à froid',
      order: 1,
    },
  });

  const catShots = await prisma.category.upsert({
    where: { slug: 'mini-shots' },
    update: {},
    create: {
      name: 'Mini Shots',
      slug: 'mini-shots',
      description: 'Concentrés naturels pour booster votre immunité et votre énergie',
      order: 2,
    },
  });

  const catSignature = await prisma.category.upsert({
    where: { slug: 'jus-signature' },
    update: {},
    create: {
      name: 'Jus Signature KEMI',
      slug: 'jus-signature',
      description: 'Jus de fruits frais 100% naturels, frais et délicieux',
      order: 3,
    },
  });

  const catSalades = await prisma.category.upsert({
    where: { slug: 'salades-de-fruits' },
    update: {},
    create: {
      name: 'Salades de Fruits',
      slug: 'salades-de-fruits',
      description: 'Gobelets, barquettes et verrines de fruits frais',
      order: 4,
    },
  });

  const catPacks = await prisma.category.upsert({
    where: { slug: 'packs-et-offres' },
    update: {},
    create: {
      name: 'Packs & Offres',
      slug: 'packs-et-offres',
      description: 'Nos packs et offres spéciales pour encore plus de fraîcheur',
      order: 5,
    },
  });

  const catEvenements = await prisma.category.upsert({
    where: { slug: 'evenements' },
    update: {},
    create: {
      name: 'Événements & Prestations',
      slug: 'evenements',
      description: 'Brochettes, plateaux, buffets de fruits pour vos événements',
      order: 6,
    },
  });

  const catChocolat = await prisma.category.upsert({
    where: { slug: 'fraises-au-chocolat' },
    update: {},
    create: {
      name: 'Fraises au Chocolat',
      slug: 'fraises-au-chocolat',
      description: 'Fraises enrobées de chocolat, bouquets et coffrets gourmands',
      order: 7,
    },
  });

  // ===== PRODUCTS =====

  // --- Nos Jus ---
  const juices = [
    {
      name: 'Persil Detox',
      slug: 'persil-detox',
      description: 'Jus vert detox à base de persil, 100% pur jus. Fraîcheur, vitalité et bien-être. Fabriqué à Abidjan.',
      price: 3000,
      categoryId: catJus.id,
      featured: true,
      tags: 'detox,vert,persil,elimination',
    },
    {
      name: 'Red Juice',
      slug: 'red-juice',
      description: 'Jus rouge à base de betterave, 100% pur jus. Fraîcheur, vitalité et hydratation. Riche en antioxydants.',
      price: 3000,
      categoryId: catJus.id,
      featured: true,
      tags: 'betterave,rouge,hydratation,antioxydant',
    },
    {
      name: 'Brûle Graisse',
      slug: 'brule-graisse',
      description: 'Jus brûle-graisse 100% pur jus. Énergie, vitalité et fraîcheur. Idéal pour accompagner une alimentation saine.',
      price: 3000,
      categoryId: catJus.id,
      featured: true,
      tags: 'minceur,energie,brule-graisse,detox',
    },
    {
      name: 'Booster',
      slug: 'booster',
      description: 'Jus orange à base de carotte, 100% pur jus. Énergie, vitalité et fraîcheur. Riche en vitamines.',
      price: 3000,
      categoryId: catJus.id,
      featured: true,
      tags: 'carotte,orange,vitamines,energie',
    },
  ];

  // --- Mini Shots ---
  const shots = [
    {
      name: 'Ginger Shot',
      slug: 'ginger-shot',
      description: 'Concentré de jus de gingembre et citron, 100% naturel. Boost immunitaire puissant. Cure recommandée : 1 shot par jour.',
      price: 1000,
      categoryId: catShots.id,
      featured: true,
      tags: 'gingembre,citron,immunite,boost',
    },
    {
      name: 'Élixir Shot',
      slug: 'elixir-shot',
      description: 'Concentré de jus au curcuma, 100% naturel. Anti-inflammatoire naturel, antioxydant puissant, renforce le système immunitaire, protège le foie.',
      price: 1000,
      categoryId: catShots.id,
      featured: true,
      tags: 'curcuma,anti-inflammatoire,immunite,detox',
    },
    {
      name: 'Réveil Cobra Shot',
      slug: 'reveil-cobra-shot',
      description: 'Concentré de jus de légumes à base de souchet (tigernuts), 100% naturel. Focus et énergie durable, vitalité et libido.',
      price: 1000,
      categoryId: catShots.id,
      featured: true,
      tags: 'souchet,energie,vitalite,focus',
    },
  ];

  // --- Jus Signature KEMI ---
  const signatures = [
    {
      name: 'Jus d\'Orange Frais',
      slug: 'jus-orange-frais',
      description: 'Jus d\'orange 100% naturel, pressé frais. Sans conservateur, sans eau ajoutée.',
      price: 1500,
      categoryId: catSignature.id,
      featured: true,
      tags: 'orange,frais,naturel',
    },
    {
      name: 'Jus d\'Ananas Frais',
      slug: 'jus-ananas-frais',
      description: 'Jus d\'ananas 100% naturel, pressé frais. Sans conservateur, sans eau ajoutée.',
      price: 1500,
      categoryId: catSignature.id,
      tags: 'ananas,frais,naturel',
    },
    {
      name: 'Jus de Pastèque Frais',
      slug: 'jus-pasteque-frais',
      description: 'Jus de pastèque 100% naturel, pressé frais. Rafraîchissant et désaltérant.',
      price: 1500,
      categoryId: catSignature.id,
      tags: 'pasteque,frais,rafraichissant',
    },
  ];

  // --- Salades de Fruits ---
  const salades = [
    {
      name: 'Gobelet de Fruits',
      slug: 'gobelet-de-fruits',
      description: 'Gobelet de fruits frais découpés (pastèque, ananas, papaye...). Fruit unique ou mix selon disponibilité.',
      price: 1500,
      categoryId: catSalades.id,
      featured: true,
      tags: 'gobelet,fruit-unique,frais',
    },
    {
      name: 'Salade de Fruits Fraîcheurs',
      slug: 'salade-fruits-fraicheurs',
      description: 'Plateau de salade de fruits frais composé : ananas, pomme, papaye, kiwi, fraise, raisin. 100% naturel, sans conservateurs, sans sucres ajoutés. Livraison en 1h sur Abidjan.',
      price: 5000,
      categoryId: catSalades.id,
      featured: true,
      tags: 'salade,plateau,fraicheur,mix',
    },
    {
      name: 'Barquette de Fruits',
      slug: 'barquette-de-fruits',
      description: 'Barquette de fruits frais découpés, mix de saison. Idéal pour le bureau ou la maison.',
      price: 3000,
      categoryId: catSalades.id,
      tags: 'barquette,mix,bureau',
    },
    {
      name: 'Petit Pot de Fruits',
      slug: 'petit-pot-de-fruits',
      description: 'Petit pot de fruits frais découpés, format individuel pratique.',
      price: 1500,
      categoryId: catSalades.id,
      tags: 'pot,individuel,pratique',
    },
    {
      name: 'Verrine de Fruits',
      slug: 'verrine-de-fruits',
      description: 'Verrine de fruits frais élégante avec brochette de fruits. Parfaite pour mariages, baptêmes, réceptions et anniversaires.',
      price: 2000,
      categoryId: catSalades.id,
      tags: 'verrine,elegant,evenement,brochette',
    },
  ];

  // --- Packs & Offres ---
  const packs = [
    {
      name: 'Pack 10 Bouteilles de Jus',
      slug: 'pack-10-bouteilles',
      description: 'Pack de 10 bouteilles de jus naturels (Persil Detox, Red Juice, Brûle Graisse, Booster). 100% pur jus naturel. Renforce l\'immunité, facilite la digestion, aide à brûler les graisses, donne de l\'énergie.',
      price: 28000,
      promoPrice: null,
      categoryId: catPacks.id,
      featured: true,
      tags: 'pack,10-bouteilles,economique',
    },
    {
      name: 'Pack 10 Mini Shots',
      slug: 'pack-10-mini-shots',
      description: 'Pack de 10 mini shots au choix (Ginger, Élixir ou Réveil Cobra). Boostez votre immunité !',
      price: 10000,
      categoryId: catPacks.id,
      tags: 'pack,10-shots,immunite',
    },
    {
      name: 'Pack Immunité Complet',
      slug: 'pack-immunite-complet',
      description: '30 shots pour transformer votre corps : 10 Ginger Shot + 10 Élixir Shot + 10 Réveil Cobra Shot. Renforce le système immunitaire, énergie et vitalité naturelle, favorise la digestion.',
      price: 29000,
      promoPrice: null,
      categoryId: catPacks.id,
      featured: true,
      tags: 'pack,30-shots,immunite,complet',
    },
    {
      name: 'Pack Spécial Bien-être',
      slug: 'pack-special-bien-etre',
      description: 'Pack combiné salade de fruits + jus Brûle Graisse. Naturel, sain et délicieux. Idéal pour votre santé.',
      price: 8000,
      categoryId: catPacks.id,
      tags: 'pack,bien-etre,sante',
    },
    {
      name: 'Box Surprise',
      slug: 'box-surprise',
      description: 'Box surprise gourmande avec assortiment de fruits frais, chocolat et accompagnements. Merci de nous prévenir 2 à 3 jours à l\'avance.',
      price: 20000,
      categoryId: catPacks.id,
      tags: 'box,surprise,cadeau',
    },
  ];

  // --- Événements & Prestations ---
  const evenements = [
    {
      name: 'Brochettes de Fruits',
      slug: 'brochettes-de-fruits',
      description: 'Brochettes de fruits frais pour vos événements : anniversaires, mariages, baptêmes, réunions. Minimum de commande : 50 brochettes.',
      price: 500,
      minOrder: 50,
      unit: 'brochette',
      categoryId: catEvenements.id,
      tags: 'brochette,evenement,mariage,bapteme',
    },
    {
      name: 'Plateau de Fruits',
      slug: 'plateau-de-fruits',
      description: 'Plateau de fruits soigneusement composé. Chaque création est réalisée avec des fruits frais sélectionnés avec attention. Contactez-nous pour un devis personnalisé.',
      price: 15000,
      categoryId: catEvenements.id,
      tags: 'plateau,evenement,devis',
    },
    {
      name: 'Buffet de Fruits / Événement',
      slug: 'buffet-fruits-evenement',
      description: 'Prestations fruitées, élégantes et raffinées pour sublimer vos moments d\'exception : mariages, dot, anniversaires. Compositions 100% naturelles, fraîches, colorées et élégantes.',
      price: 50000,
      categoryId: catEvenements.id,
      tags: 'buffet,traiteur,mariage,evenement',
    },
  ];

  // --- Fraises au Chocolat ---
  const chocolat = [
    {
      name: 'Coffret Fraises au Chocolat',
      slug: 'coffret-fraises-chocolat',
      description: 'Coffret de fraises enrobées de chocolat (lait, blanc, noir). Différentes décorations disponibles : noix, copeaux, feuille d\'or. Idéal pour offrir.',
      price: 15000,
      categoryId: catChocolat.id,
      featured: true,
      tags: 'fraise,chocolat,coffret,cadeau',
    },
    {
      name: 'Bouquet de Fraises au Chocolat',
      slug: 'bouquet-fraises-chocolat',
      description: 'Bouquet de fraises enrobées de chocolat, présentation florale élégante. Parfait pour dire je t\'aime ou marquer un événement spécial.',
      price: 20000,
      categoryId: catChocolat.id,
      tags: 'bouquet,fraise,chocolat,amour',
    },
  ];

  // Insert all products
  const allProducts = [
    ...juices, ...shots, ...signatures, ...salades,
    ...packs, ...evenements, ...chocolat,
  ];

  for (const product of allProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: product.price,
        promoPrice: (product as any).promoPrice ?? null,
        categoryId: product.categoryId,
        featured: (product as any).featured ?? false,
        minOrder: (product as any).minOrder ?? 1,
        unit: (product as any).unit ?? 'piece',
        tags: (product as any).tags ?? null,
        active: true,
        stock: 100,
      },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
