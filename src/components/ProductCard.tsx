'use client';

import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  promoPrice?: number | null;
  image?: string | null;
  category?: string;
  unit: string;
  minOrder: number;
}

export default function ProductCard({ id, name, slug, price, promoPrice, image, category, unit, minOrder }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, price, promoPrice, image, unit, minOrder });
  };

  return (
    <Link href={`/produit/${slug}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="aspect-square bg-kemi-beige relative overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-kemi-green">
            <svg className="w-16 h-16 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
        )}
        {promoPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            PROMO
          </div>
        )}
        {category && (
          <div className="absolute top-2 left-2 bg-kemi-green/80 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-kemi-green group-hover:text-kemi-green-light transition line-clamp-2 mb-2">{name}</h3>

        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            {promoPrice ? (
              <>
                <span className="text-lg font-bold text-red-500">{formatPrice(promoPrice)}</span>
                <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-kemi-green">{formatPrice(price)}</span>
            )}
            {unit !== 'piece' && <span className="text-xs text-gray-500">/ {unit}</span>}
          </div>

          <button
            onClick={handleAdd}
            className="w-full bg-kemi-gold hover:bg-kemi-gold/90 text-kemi-green font-semibold py-2 px-4 rounded-xl transition text-sm"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </Link>
  );
}
