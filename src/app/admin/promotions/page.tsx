'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface ProductRef {
  product: { id: string; name: string };
}

interface Promotion {
  id: string;
  name: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  active: boolean;
  products: ProductRef[];
}

interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    active: true,
    productIds: [] as string[],
  });

  const loadData = () => {
    fetch('/api/admin/promotions')
      .then(r => {
        if (r.status === 401) { window.location.href = '/admin/login'; return null; }
        return r.json();
      })
      .then(data => {
        if (data) {
          setPromotions(data.promotions);
          setProducts(data.products);
        }
      });
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = async () => {
    await fetch('/api/admin/promotions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setShowForm(false);
    setForm({ name: '', type: 'percentage', value: '', startDate: '', endDate: '', active: true, productIds: [] });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette promotion ? Les prix promo des produits concernes seront retires.')) return;
    await fetch('/api/admin/promotions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  const toggleProduct = (id: string) => {
    setForm(f => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter(p => p !== id)
        : [...f.productIds, id],
    }));
  };

  const isActive = (promo: Promotion) => {
    const now = new Date();
    return promo.active && new Date(promo.startDate) <= now && new Date(promo.endDate) >= now;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-kemi-green">Promotions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-kemi-green hover:bg-kemi-green-light text-white font-semibold px-4 py-2 rounded-xl transition text-sm"
        >
          + Nouvelle promotion
        </button>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucune promotion pour le moment</div>
      ) : (
        <div className="space-y-4">
          {promotions.map(promo => (
            <div key={promo.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{promo.name}</h3>
                    {isActive(promo) ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {promo.type === 'percentage' ? `${promo.value}% de reduction` : `${formatPrice(promo.value)} de reduction`}
                  </p>
                </div>
                <button onClick={() => handleDelete(promo.id)} className="text-red-400 hover:text-red-600 text-sm">
                  Supprimer
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Du {new Date(promo.startDate).toLocaleDateString('fr-FR')} au {new Date(promo.endDate).toLocaleDateString('fr-FR')}
              </p>
              {promo.products.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {promo.products.map(pp => (
                    <span key={pp.product.id} className="bg-kemi-beige text-kemi-green text-xs px-2 py-0.5 rounded-full">
                      {pp.product.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-bold text-kemi-green mb-4">Nouvelle promotion</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la promotion *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green"
                  placeholder="Ex: Promo de Noel" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green">
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (FCFA)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valeur * {form.type === 'percentage' ? '(%)' : '(FCFA)'}
                  </label>
                  <input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green"
                    placeholder={form.type === 'percentage' ? '20' : '500'} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de debut *</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produits concernes</label>
                <div className="max-h-48 overflow-y-auto border rounded-xl p-2 space-y-1">
                  {products.map(p => (
                    <label key={p.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(p.id)}
                        onChange={() => toggleProduct(p.id)}
                        className="accent-kemi-green"
                      />
                      <span className="text-sm flex-1">{p.name}</span>
                      <span className="text-xs text-gray-400">{formatPrice(p.price)}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{form.productIds.length} produit(s) selectionne(s)</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm hover:bg-gray-50">Annuler</button>
              <button onClick={handleCreate} className="flex-1 bg-kemi-green text-white py-2 rounded-xl text-sm hover:bg-kemi-green-light">Creer la promotion</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
