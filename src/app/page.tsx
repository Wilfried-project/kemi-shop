import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });

  const featuredProducts = await prisma.product.findMany({
    where: { active: true, featured: true },
    include: { category: true },
    take: 8,
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-kemi-green to-kemi-green-light text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            Les Fruits et Legumes<br />de <span className="text-kemi-gold">KEMI</span>
          </h1>
          <p className="text-xl md:text-2xl text-kemi-beige italic mb-8">La fraicheur made in KEMI</p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8">
            Jus naturels 100% pur, salades de fruits frais, shots sante et prestations evenementielles. Livraison rapide sur Abidjan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/boutique" className="bg-kemi-gold hover:bg-kemi-gold/90 text-kemi-green font-bold py-3 px-8 rounded-xl text-lg transition">
              Decouvrir la boutique
            </Link>
            <a href="https://wa.me/2250757568828" target="_blank" rel="noopener noreferrer" className="border-2 border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-xl text-lg transition">
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 md:py-16 bg-kemi-beige/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-kemi-green text-center mb-8">Nos Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <Link key={cat.id} href={`/boutique?categorie=${cat.slug}`} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition group">
                <div className="w-16 h-16 mx-auto mb-3 bg-kemi-green/10 rounded-full flex items-center justify-center group-hover:bg-kemi-green/20 transition">
                  <span className="text-2xl">
                    {cat.slug === 'nos-jus' && '🥤'}
                    {cat.slug === 'mini-shots' && '💪'}
                    {cat.slug === 'jus-signature' && '🍊'}
                    {cat.slug === 'salades-de-fruits' && '🥗'}
                    {cat.slug === 'packs-et-offres' && '📦'}
                    {cat.slug === 'evenements' && '🎉'}
                    {cat.slug === 'fraises-au-chocolat' && '🍫'}
                  </span>
                </div>
                <h3 className="font-semibold text-kemi-green text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-kemi-green text-center mb-2">Nos Produits Vedettes</h2>
          <p className="text-center text-gray-500 mb-8">Les favoris de nos clients</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                promoPrice={product.promoPrice}
                image={product.image}
                category={product.category.name}
                unit={product.unit}
                minOrder={product.minOrder}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/boutique" className="bg-kemi-green hover:bg-kemi-green-light text-white font-semibold py-3 px-8 rounded-xl transition">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-kemi-green py-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="font-serif text-3xl font-bold mb-4">Une question ?</h2>
          <p className="text-lg text-gray-200 mb-6">Contactez-nous directement sur WhatsApp pour toute commande speciale ou question.</p>
          <a href="https://wa.me/2250757568828" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Ecrire sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
