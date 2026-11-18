'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/produits', label: 'Produits', icon: '🍊' },
    { href: '/admin/commandes', label: 'Commandes', icon: '📦' },
    { href: '/admin/promotions', label: 'Promos', icon: '🏷️' },
    { href: '/admin/parametres', label: 'Parametres', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-kemi-green text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="font-serif text-xl font-bold">KEMI Admin</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-kemi-beige hover:text-white transition">Voir le site</Link>
          <button
            onClick={() => {
              document.cookie = 'admin_token=; Max-Age=0; path=/';
              window.location.href = '/admin/login';
            }}
            className="text-sm text-red-300 hover:text-red-100 transition"
          >
            Deconnexion
          </button>
        </div>
      </div>

      <div className="flex">
        <nav className="w-56 bg-white shadow-sm min-h-[calc(100vh-52px)] hidden md:block">
          <div className="py-4">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition ${
                  pathname === link.href
                    ? 'bg-kemi-green/10 text-kemi-green font-semibold border-r-2 border-kemi-green'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="flex justify-around py-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-1 px-3 text-xs ${
                  pathname === link.href ? 'text-kemi-green font-semibold' : 'text-gray-500'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
