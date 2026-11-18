'use client';

import { useState, useEffect } from 'react';

interface Settings {
  shopName: string;
  phone: string;
  whatsapp: string;
  address: string;
  deliveryFee: number;
  slogan: string;
  currency: string;
  paymentMethods: string;
}

export default function AdminParametresPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => {
        if (r.status === 401) { window.location.href = '/admin/login'; return null; }
        return r.json();
      })
      .then(data => { if (data) setSettings(data); });
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return <div className="text-center py-12 text-gray-400">Chargement...</div>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-kemi-green mb-6">Parametres</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
          <input type="text" value={settings.shopName} onChange={e => setSettings({ ...settings, shopName: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
          <input type="text" value={settings.slogan} onChange={e => setSettings({ ...settings, slogan: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
            <input type="text" value={settings.phone} onChange={e => setSettings({ ...settings, phone: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (format international)</label>
            <input type="text" value={settings.whatsapp} onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input type="text" value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frais de livraison (FCFA)</label>
          <input type="number" value={settings.deliveryFee} onChange={e => setSettings({ ...settings, deliveryFee: parseInt(e.target.value) || 0 })}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green" />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-3 rounded-xl font-bold transition ${
            saved ? 'bg-green-500 text-white' : 'bg-kemi-green hover:bg-kemi-green-light text-white'
          } disabled:opacity-50`}
        >
          {saved ? 'Enregistre !' : saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-2xl mt-6">
        <h2 className="font-semibold text-lg text-kemi-green mb-4">Acces administrateur</h2>
        <div className="bg-kemi-beige/50 rounded-xl p-4 text-sm">
          <p><strong>Email :</strong> admin@kemi.ci</p>
          <p><strong>Mot de passe :</strong> kemi2024</p>
          <p className="text-orange-600 mt-2">Changez le mot de passe en production !</p>
        </div>
      </div>
    </div>
  );
}
