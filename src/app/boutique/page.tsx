'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  promoPrice: number | null;
  image: string | null;
  unit: string;
  minOrder: number;
  category: { name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('categorie') || '';
    setSelectedCategory(cat);
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => {
    const matchCat = !selectedCategory || p.category.slug === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-kemi-green mb-6">Notre Boutique</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kemi-green"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !selectedCategory ? 'bg-kemi-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug === selectedCategory ? '' : cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat.slug ? 'bg-kemi-green text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Chargement...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">Aucun produit trouve</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
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
      )}
    </div>
  );
}
