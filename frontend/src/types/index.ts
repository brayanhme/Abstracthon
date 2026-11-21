export interface Company {
  id: string;
  name: string;
  category: string;
  zone: string;
  address: string;
  description: string;
  logoUrl?: string;
  logoSvg?: string;
  phone?: string;
  hours?: string;
  coords?: {
    lat: number;
    lng: number;
  };
  createdAt?: string;
}

export interface OfferProduct {
  id: string;
  companyId: string;
  bizName: string;
  title: string;
  category: string;
  zone: string;
  oldPrice: number;
  newPrice: number;
  stock: number;
  pickupWindow: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface CompostLot {
  id: string;
  companyId: string;
  title: string;
  source: string;
  useType: 'Compostaje / Humus' | 'Alimento Animal' | string;
  stock: number;
  price: number;
  unit: string;
  weightApprox?: string;
  description: string;
  createdAt?: string;
}

export interface Reservation {
  id?: string;
  code: string;
  companyId: string;
  bizName: string;
  title: string;
  qty: number;
  totalPaid: number;
  pickupWindow: string;
  zone: string;
  address: string;
  reference: string;
  coords: {
    lat: number;
    lng: number;
  };
  status: 'Pendiente' | 'Listo para recoger' | 'Entregado' | 'Cancelado';
  type: 'rescate' | 'composta';
  createdAt?: string;
}

export interface User {
  id?: string;
  name: string;
  emailOrPhone: string;
  role?: 'consumidor' | 'empresa' | 'agricultor';
}
