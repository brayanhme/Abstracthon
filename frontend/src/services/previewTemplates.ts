import { OfferProduct, Company, CompostLot, Reservation } from '../types';

/**
 * PLANTILLAS VISUALES DE MUESTRA (PREVIEW UI)
 * Sirven exclusivamente para previsualizar el diseño visual cuando la base de datos está desconectada.
 * No guardan ni persisten datos.
 */

export const PREVIEW_COMPANIES: Company[] = [
  {
    id: 'pil-andina',
    name: 'PIL Andina S.A.',
    category: 'Lácteos y Bebidas',
    zone: 'Av. Blanco Galindo',
    address: 'Km 10.5 Av. Blanco Galindo, Zona Piñami Central',
    description: 'Empresa líder de lácteos en Bolivia con planta en Cochabamba.',
    phone: '+591 4 4260100',
    hours: '08:00 - 18:30',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#004B93"/><path d="M22 65V35C22 35 34 32 46 35C58 38 58 49 46 51C34 53 22 53 22 53" stroke="white" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="80" r="4" fill="#FF7A00"/></svg>`
  },
  {
    id: 'delizia',
    name: 'Delizia',
    category: 'Helados y Lácteos',
    zone: 'Zona Norte / Av. América',
    address: 'Av. América Este #845, casi Pando, Queru Queru',
    description: 'Tradición boliviana en helados y postres frescos del valle.',
    phone: '+591 4 4452100',
    hours: '09:00 - 20:00',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#E11D48"/><circle cx="50" cy="50" r="28" fill="white"/><path d="M36 50Q50 62 64 50" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/></svg>`
  },
  {
    id: 'hipermaxi',
    name: 'Hipermaxi',
    category: 'Supermercado',
    zone: 'Tiquipaya / Cala Cala',
    address: 'Av. Juan de la Rosa esq. Av. Gabriel René Moreno',
    description: 'La cadena de supermercados más grande con panadería fresca y frescos.',
    hours: '07:30 - 22:00',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#0284C7"/><text x="50" y="65" font-family="Arial" font-weight="900" font-size="40" fill="white" text-anchor="middle">H</text></svg>`
  },
  {
    id: 'ic-norte',
    name: 'IC Norte',
    category: 'Supermercado Gourmet',
    zone: 'Zona Norte / Av. América',
    address: 'Av. Melchor Pérez de Olguín y Av. D\'Orbigny',
    description: 'Supermercado emblemático reconocido por su panadería europea y charcutería fina.',
    hours: '08:00 - 21:30',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#1E3A8A"/><circle cx="50" cy="50" r="30" fill="#FF7A00"/><text x="50" y="58" font-family="sans-serif" font-weight="800" font-size="20" fill="white" text-anchor="middle">IC</text></svg>`
  },
  {
    id: 'sofia',
    name: 'Sofía Alimentos',
    category: 'Embutidos y Frescos',
    zone: 'Centro / El Prado',
    address: 'Av. Ballivián #620 (El Prado)',
    description: 'Líder en carnes frescas, embutidos y cortes con estricta cadena de frío.',
    hours: '08:30 - 19:30',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#B91C1C"/><circle cx="50" cy="50" r="25" fill="#FF7A00"/></svg>`
  },
  {
    id: 'panaderia-victoria',
    name: 'Panadería Victoria',
    category: 'Panadería Tradicional',
    zone: 'Centro / El Prado',
    address: 'Calle Baptista #425 esq. Mayor Rocha',
    description: 'Más de 70 años horneando marraquetas crocantes y panes tradicionales del valle.',
    hours: '06:30 - 21:00',
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#D97706"/><path d="M30 65C25 50 35 30 50 30C65 30 75 50 70 65Z" fill="#FDE68A"/></svg>`
  }
];

export const PREVIEW_OFFERS: OfferProduct[] = [
  {
    id: 'preview-1',
    companyId: 'panaderia-victoria',
    bizName: 'Panadería Victoria',
    title: 'Pack Marraquetas Crocantes y Panes Vallunos',
    category: 'Panadería',
    zone: 'Centro / El Prado',
    oldPrice: 32,
    newPrice: 15,
    stock: 7,
    pickupWindow: 'Hoy 18:30 - 20:30',
    description: '12 marraquetas artesanales de corteza crocante recién horneadas más 4 panes de maíz.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'preview-2',
    companyId: 'pil-andina',
    bizName: 'PIL Andina S.A.',
    title: 'Lote Yogures Probióticos + Leche Natural 1L',
    category: 'Lácteos y Helados',
    zone: 'Av. Blanco Galindo',
    oldPrice: 48,
    newPrice: 22,
    stock: 5,
    pickupWindow: 'Hoy 17:00 - 19:00',
    description: 'Caja con 6 yogures batidos surtidos más 2 botellas de leche pasteurizada natural.',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'preview-3',
    companyId: 'ic-norte',
    bizName: 'IC Norte',
    title: 'Box Pastelería Francesa y Croissants Gourmet',
    category: 'Panadería',
    zone: 'Zona Norte / Av. América',
    oldPrice: 65,
    newPrice: 29,
    stock: 4,
    pickupWindow: 'Hoy 19:00 - 21:00',
    description: '3 croissants de mantequilla pura, 2 pain au chocolat y 2 tartaletas de manzana.',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80'
  }
];

export const PREVIEW_COMPOST: CompostLot[] = [
  {
    id: 'comp-1',
    companyId: 'ic-norte',
    title: 'Lote Excedentes Orgánicos de Frutas y Hortalizas',
    source: 'IC Norte (Sucursal Melchor Pérez)',
    useType: 'Compostaje / Humus',
    stock: 12,
    price: 15,
    unit: 'Bolsa 25 kg',
    weightApprox: '25 kg',
    description: 'Hojas verdes, cáscaras y mermas limpias vegetales para lombricultura o composteras térmicas.'
  },
  {
    id: 'comp-2',
    companyId: 'pil-andina',
    title: 'Suero Lácteo Orgánico y Residuos de Cuajada',
    source: 'PIL Andina S.A. (Planta Piñami)',
    useType: 'Alimento Animal',
    stock: 18,
    price: 20,
    unit: 'Bidón 30 L',
    weightApprox: '30 Litros',
    description: 'Suero de leche pasteurizado rico en proteínas para suplemento de crianza porcina.'
  }
];

export const PREVIEW_RESERVATIONS: Reservation[] = [
  {
    code: 'QM-8421',
    companyId: 'panaderia-victoria',
    bizName: 'Panadería Victoria',
    title: 'Pack Marraquetas Crocantes y Panes Vallunos',
    qty: 1,
    totalPaid: 15,
    pickupWindow: 'Hoy 18:30 - 20:30',
    zone: 'Centro / El Prado',
    address: 'Calle Baptista #425 esq. Mayor Rocha, Cochabamba',
    reference: 'Mostrar el código en caja de retiro rápido.',
    coords: { lat: -17.3916, lng: -66.1579 },
    status: 'Listo para recoger',
    type: 'rescate'
  }
];
