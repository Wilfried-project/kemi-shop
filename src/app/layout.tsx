import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Les Fruits et Légumes de KEMI | Jus naturels & Fruits frais à Abidjan',
  description: 'La fraîcheur made in KEMI. Jus naturels, salades de fruits, shots santé et prestations événementielles à Abidjan, Côte d\'Ivoire. Livraison rapide.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${poppins.variable} ${playfair.variable} font-sans bg-white text-gray-900 antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
