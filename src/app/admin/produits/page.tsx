'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  promoPrice: number | null;
  image: string | null;
  active: boolean;
  featured: boolean;
  stock: number;
  minOrder: number;
  unit: string;
  description: string;
  tags: string | null;
  categoryId: string;
  category: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const emptyProduct = {
  name: '', description: '', price: '', promoPrice: '', categoryId: '',
  image: '', stock: '100', active: true, featured: false, minOrder: '1', unit: 'piece', tags: '',
};

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const loadData = () => {
    fetch('/api/admin/products')
      .then(r => {
        if (r.status === 401) { window.location.href = '/admin/login'; return null; }
        return r.json();
      })
      .then(data => {
        if (data) {
          setProducts(data.products);
          setCategories(data.categories);
        }
      });
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    const method = editing.id ? 'PUT' : 'POST';
    await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    });
    setShowForm(false);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    loadData();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-kemi-green">Produits ({products.length})</h1>
        <button
          onClick={() => { setEditing({ ...emptyProduct }); setShowForm(true); }}
          className="bg-kemi-green hover:bg-kemi-green-light text-white font-semibold px-4 py-2 rounded-xl transition text-sm"
        >
          + Nouveau produit
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-3">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-kemi-beige rounded-lg overflow-hidden flex-shrink-0">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl">🍊</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{p.name}</h3>
                {!p.active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactif</span>}
                {p.featured && <span className="text-xs bg-kemi-gold/20 text-kemi-gold px-2 py-0.5 rounded-full">Vedette</span>}
              </div>
              <p className="text-sm text-gray-500">{p.category.name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-kemi-green">{formatPrice(p.price)}</p>
              {p.promoPrice && <p className="text-xs text-red-500">Promo: {formatPrice(p.promoPrice)}</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditing({ ...p, price: p.price.toString(), promoPrice: p.promoPrice?.toString() || '', stock: p.stock.toString(), minOrder: p.minOrder.toString(), tags: p.tags || '' }); setShowForm(true); }}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Modifier
              </button>
              <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 text-sm">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create modal */}
      {showForm && editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl font-bold text-kemi-green mb-4">
              {editing.id ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input type="text" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                  <input type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix promo</label>
                  <input type="number" value={editing.promoPrice} onChange={e => setEditing({ ...editing, promoPrice: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categorie *</label>
                <select value={editing.categoryId} onChange={e => setEditing({ ...editing, categoryId: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green">
                  <option value="">Choisir</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image du produit</label>
                <div className="flex gap-2">
                  <input type="text" value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })}
                    className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" placeholder="/images/produit.jpg" />
                  <label className="bg-kemi-beige hover:bg-kemi-beige/80 text-kemi-green text-sm px-3 py-2 rounded-xl cursor-pointer transition flex-shrink-0">
                    Uploader
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('file', file);
                      const res = await fetch('/api/upload', { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.url) setEditing({ ...editing, image: data.url });
                    }} />
                  </label>
                </div>
                {editing.image && (
                  <img src={editing.image} alt="Preview" className="mt-2 w-20 h-20 rounded-lg object-cover" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" value={editing.stock} onChange={e => setEditing({ ...editing, stock: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. commande</label>
                  <input type="number" value={editing.minOrder} onChange={e => setEditing({ ...editing, minOrder: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unite</label>
                  <input type="text" value={editing.unit} onChange={e => setEditing({ ...editing, unit: e.target.value })}
                    className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separes par des virgules)</label>
                <input type="text" value={editing.tags} onChange={e => setEditing({ ...editing, tags: e.target.value })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-kemi-green" />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="accent-kemi-green" />
                  <span className="text-sm">Actif</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className="accent-kemi-green" />
                  <span className="text-sm">Produit vedette</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 py-2 rounded-xl text-sm hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} className="flex-1 bg-kemi-green text-white py-2 rounded-xl text-sm hover:bg-kemi-green-light">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
