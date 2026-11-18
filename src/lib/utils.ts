export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  const r = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `KEMI-${y}${m}${d}-${r}`;
}

export function getWhatsAppLink(orderNumber: string): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '2250757568828';
  const message = encodeURIComponent(
    `Bonjour KEMI ! Je viens de passer la commande ${orderNumber} sur votre site. Merci de confirmer ma commande.`
  );
  return `https://wa.me/${phone}?text=${message}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const COMMUNES_ABIDJAN = [
  'Abobo', 'Adjamé', 'Anyama', 'Attécoubé', 'Bingerville',
  'Cocody', 'Koumassi', 'Marcory', 'Plateau', 'Port-Bouët',
  'Songon', 'Treichville', 'Yopougon',
];

export const PAYMENT_METHODS: Record<string, { label: string; icon: string }> = {
  livraison: { label: 'Paiement à la livraison', icon: '💵' },
  wave: { label: 'Wave', icon: '🌊' },
  orange_money: { label: 'Orange Money', icon: '🟠' },
  mtn_money: { label: 'MTN Mobile Money', icon: '🟡' },
  moov_money: { label: 'Moov Money', icon: '🔵' },
};

export const ORDER_STATUSES: Record<string, { label: string; color: string }> = {
  en_attente: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  confirmee: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
  en_preparation: { label: 'En préparation', color: 'bg-purple-100 text-purple-800' },
  en_livraison: { label: 'En livraison', color: 'bg-orange-100 text-orange-800' },
  livree: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  annulee: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
};
