'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { formatPrice, COMMUNES_ABIDJAN, PAYMENT_METHODS } from '@/lib/utils';

export default function CommandePage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    commune: '',
    quartier: '',
    address: '',
    instructions: '',
    paymentMethod: 'livraison',
  });

  const deliveryFee = 1000;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.promoPrice ?? i.price,
          })),
          subtotal,
          deliveryFee,
          total,
        }),
      });

      const data = await res.json();
      if (data.orderNumber) {
        clearCart();
        router.push(`/confirmation/${data.orderNumber}`);
      }
    } catch {
      alert('Erreur lors de la commande. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-kemi-green mb-6">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
        {/* Info client */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-kemi-green">Vos informations</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
            <input
              type="text"
              required
              value={form.customerName}
              onChange={e => setForm({ ...form, customerName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone *</label>
            <input
              type="tel"
              required
              value={form.customerPhone}
              onChange={e => setForm({ ...form, customerPhone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
              placeholder="07 XX XX XX XX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commune *</label>
            <select
              required
              value={form.commune}
              onChange={e => setForm({ ...form, commune: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
            >
              <option value="">Choisir une commune</option>
              {COMMUNES_ABIDJAN.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quartier *</label>
            <input
              type="text"
              required
              value={form.quartier}
              onChange={e => setForm({ ...form, quartier: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
              placeholder="Votre quartier"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse precise *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
              placeholder="Rue, immeuble, repere..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              value={form.instructions}
              onChange={e => setForm({ ...form, instructions: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
              rows={3}
              placeholder="Instructions pour la livraison (optionnel)"
            />
          </div>
        </div>

        {/* Recap + payment */}
        <div className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg text-kemi-green mb-3">Mode de paiement</h2>
            <div className="space-y-2">
              {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    form.paymentMethod === key ? 'border-kemi-green bg-kemi-green/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={key}
                    checked={form.paymentMethod === key}
                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                    className="accent-kemi-green"
                  />
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-kemi-beige/50 rounded-2xl p-6">
            <h2 className="font-semibold text-lg text-kemi-green mb-4">Recapitulatif</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice((item.promoPrice ?? item.price) * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Livraison</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-kemi-green pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kemi-gold hover:bg-kemi-gold/90 text-kemi-green font-bold py-4 rounded-xl text-lg transition disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
          </button>
        </div>
      </form>
    </div>
  );
}
