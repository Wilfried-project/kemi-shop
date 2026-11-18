'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart';

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-kemi-green sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-white font-serif text-xl font-bold">KEMI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-kemi-gold transition">Accueil</Link>
            <Link href="/boutique" className="text-white hover:text-kemi-gold transition">Boutique</Link>
            <Link href="/panier" className="relative text-white hover:text-kemi-gold transition">
              Panier
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-kemi-gold text-kemi-green text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-4 md:hidden">
            <Link href="/panier" className="relative text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-kemi-gold text-kemi-green text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-kemi-green-light">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 text-white hover:text-kemi-gold">Accueil</Link>
            <Link href="/boutique" onClick={() => setMenuOpen(false)} className="block py-2 text-white hover:text-kemi-gold">Boutique</Link>
            <Link href="/panier" onClick={() => setMenuOpen(false)} className="block py-2 text-white hover:text-kemi-gold">Panier</Link>
          </div>
        )}
      </div>
    </header>
  );
}
