'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => {
        if (r.status === 401) {
          window.location.href = '/admin/login';
          return null;
        }
        return r.json();
      })
      .then(data => { if (data) setStats(data); });
  }, []);

  if (!stats) return <div className="text-center py-12 text-gray-400">Chargement...</div>;

  const cards = [
    { label: 'Commandes totales', value: stats.totalOrders, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'En attente', value: stats.pendingOrders, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Chiffre d\'affaires', value: formatPrice(stats.totalRevenue), icon: '💰', color: 'bg-green-50 text-green-700' },
    { label: 'Produits actifs', value: stats.totalProducts, icon: '🍊', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-kemi-green mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`${card.color} rounded-2xl p-6`}>
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
