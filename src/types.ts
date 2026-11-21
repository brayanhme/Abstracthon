export interface Company {
  id: string;
  name: string;
  category: string;
  zone: string;
  address: string;
  description: string;
  logoSvg: string;
  phone?: string;
  hours?: string;
  coords?: { lat: number; lng: number };
}

export interface OfferProduct {
  id: string;
  companyId: string;
  biz: string;
  title: string;
  category: 'Panadería' | 'Lácteos y Helados' | 'Supermercado' | 'Embutidos y Frescos';
  zone: 'Centro / El Prado' | 'Zona Norte / Av. América' | 'Av. Blanco Galindo' | 'Tiquipaya / Cala Cala';
  oldPrice: number;
  newPrice: number;
  stock: number;
  time: string;
  desc: string;
  img: string;
}

export interface CompostLot {
  id: string;
  companyId: string;
  title: string;
  source: string;
  useType: 'Compostaje / Humus' | 'Alimento Animal';
  stock: number;
  price: number;
  unit: string;
  weightApprox: string;
  desc: string;
}

export interface UserReservation {
  code: string;
  companyId: string;
  biz: string;
  title: string;
  qty: number;
  totalPaid: number;
  pickupWindow: string;
  zone: string;
  address: string;
  reference: string;
  coords: { lat: number; lng: number };
  status: 'Listo para recoger' | 'Entregado';
  type: 'rescate' | 'composta';
  createdAt: string;
}

export interface UserProfile {
  name: string;
  emailOrPhone: string;
  isLoggedIn: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}
