'use client';

import { useState, useEffect } from 'react';
import { formatPrice, ORDER_STATUSES, PAYMENT_METHODS } from '@/lib/utils';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  product: { name: string };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  commune: string;
  quartier: string;
  address: string;
  instructions: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => {
        if (r.status === 401) { window.location.href = '/admin/login'; return null; }
        return r.json();
      })
      .then(data => { if (data) setOrders(data); });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = orders.filter(o => !filter || o.status === filter);

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-kemi-green mb-6">Commandes</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter('')} className={`px-3 py-1 rounded-full text-sm ${!filter ? 'bg-kemi-green text-white' : 'bg-gray-100'}`}>
          Toutes ({orders.length})
        </button>
        {Object.entries(ORDER_STATUSES).map(([key, s]) => {
          const count = orders.filter(o => o.status === key).length;
          return (
            <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1 rounded-full text-sm ${filter === key ? 'bg-kemi-green text-white' : 'bg-gray-100'}`}>
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition" onClick={() => setSelected(order)}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-semibold text-kemi-green">{order.orderNumber}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ORDER_STATUSES[order.status]?.color || 'bg-gray-100'}`}>
                {ORDER_STATUSES[order.status]?.label || order.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{order.customerName} - {order.commune}</span>
              <span className="font-semibold text-kemi-green">{formatPrice(order.total)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-kemi-green">{selected.orderNumber}</h2>
                <p className="text-sm text-gray-500">{new Date(selected.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Client</h3>
                <p>{selected.customerName}</p>
                <p className="text-sm text-gray-500">{selected.customerPhone}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Livraison</h3>
                <p>{selected.commune}, {selected.quartier}</p>
                <p className="text-sm text-gray-500">{selected.address}</p>
                {selected.instructions && <p className="text-sm italic text-gray-400">{selected.instructions}</p>}
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Paiement</h3>
                <p>{PAYMENT_METHODS[selected.paymentMethod]?.label || selected.paymentMethod}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-1">Articles</h3>
                {selected.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span>{formatPrice(item.total)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 space-y-1">
                  <div className="flex justify-between text-sm"><span>Sous-total</span><span>{formatPrice(selected.subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span>Livraison</span><span>{formatPrice(selected.deliveryFee)}</span></div>
                  <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(selected.total)}</span></div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-500 mb-2">Changer le statut</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(ORDER_STATUSES).map(([key, s]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selected.id, key)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        selected.status === key ? s.color + ' ring-2 ring-offset-1 ring-gray-300' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
