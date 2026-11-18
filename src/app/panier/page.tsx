'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export default function PanierPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="font-serif text-3xl font-bold text-kemi-green mb-4">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Decouvrez nos produits frais et naturels</p>
        <Link href="/boutique" className="bg-kemi-green hover:bg-kemi-green-light text-white font-semibold py-3 px-8 rounded-xl transition">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-kemi-green mb-6">Votre Panier</h1>

      <div className="space-y-4 mb-8">
        {items.map(item => {
          const price = item.promoPrice ?? item.price;
          return (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-kemi-beige rounded-xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-kemi-green/30 text-2xl">🍊</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-kemi-green text-sm leading-tight">{item.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{formatPrice(price)} / {item.unit}</p>
                </div>

                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-600 p-1 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-100 text-sm font-bold">-</button>
                  <span className="px-3 py-1.5 text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-100 text-sm font-bold">+</button>
                </div>
                <p className="font-bold text-kemi-green">{formatPrice(price * item.quantity)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-kemi-beige/50 rounded-2xl p-6">
        <div className="flex justify-between items-center text-lg mb-4">
          <span className="text-gray-600">Sous-total</span>
          <span className="font-bold text-kemi-green">{formatPrice(subtotal)}</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">Frais de livraison calcules a la commande</p>
        <Link href="/commande" className="block w-full bg-kemi-gold hover:bg-kemi-gold/90 text-kemi-green font-bold py-4 px-8 rounded-xl text-center text-lg transition">
          Passer la commande
        </Link>
      </div>
    </div>
  );
}
