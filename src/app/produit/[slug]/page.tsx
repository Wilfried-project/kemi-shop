'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  promoPrice: number | null;
  image: string | null;
  unit: string;
  minOrder: number;
  tags: string | null;
  category: { name: string; slug: string };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setQuantity(data.minOrder || 1);
      });
  }, [params.slug]);

  if (!product) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">Chargement...</div>;
  }

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      promoPrice: product.promoPrice,
      image: product.image,
      unit: product.unit,
      minOrder: product.minOrder,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const effectivePrice = product.promoPrice ?? product.price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-kemi-green">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/boutique" className="hover:text-kemi-green">Boutique</Link>
        <span className="mx-2">/</span>
        <Link href={`/boutique?categorie=${product.category.slug}`} className="hover:text-kemi-green">{product.category.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square bg-kemi-beige rounded-2xl overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-kemi-green/30">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm text-kemi-gold font-medium">{product.category.name}</span>
          <h1 className="font-serif text-3xl font-bold text-kemi-green mt-1 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            {product.promoPrice ? (
              <>
                <span className="text-3xl font-bold text-red-500">{formatPrice(product.promoPrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-kemi-green">{formatPrice(product.price)}</span>
            )}
            {product.unit !== 'piece' && (
              <span className="text-gray-500">/ {product.unit}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

          {product.minOrder > 1 && (
            <p className="text-sm text-orange-600 mb-4">
              Commande minimum : {product.minOrder} {product.unit}(s)
            </p>
          )}

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(product.minOrder, q - 1))}
                className="px-4 py-3 hover:bg-gray-100 transition text-lg font-bold"
              >
                -
              </button>
              <span className="px-4 py-3 font-semibold min-w-[60px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="px-4 py-3 hover:bg-gray-100 transition text-lg font-bold"
              >
                +
              </button>
            </div>
            <span className="text-gray-500 text-sm">= {formatPrice(effectivePrice * quantity)}</span>
          </div>

          <button
            onClick={handleAdd}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-kemi-gold hover:bg-kemi-gold/90 text-kemi-green'
            }`}
          >
            {added ? 'Ajoute au panier !' : 'Ajouter au panier'}
          </button>

          {product.tags && (
            <div className="flex flex-wrap gap-2 mt-6">
              {product.tags.split(',').map(tag => (
                <span key={tag} className="bg-kemi-beige text-kemi-green text-xs px-3 py-1 rounded-full">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
