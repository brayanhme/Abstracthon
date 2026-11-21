import { Company, OfferProduct, CompostLot, UserReservation } from '../types';

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'pil-andina',
    name: 'PIL Andina S.A.',
    category: 'Lácteos y Bebidas',
    zone: 'Av. Blanco Galindo',
    address: 'Km 10.5 Av. Blanco Galindo, Zona Piñami Central',
    description: 'Empresa líder de lácteos y alimentos en Bolivia con planta principal en Cochabamba. Comprometida con el aprovechamiento de lotes frescos y economía circular.',
    phone: '+591 4 4260100',
    hours: '08:00 - 18:30',
    coords: { lat: -17.3912, lng: -66.2341 },
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#004B93"/>
      <path d="M22 65V35C22 35 34 32 46 35C58 38 58 49 46 51C34 53 22 53 22 53" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M60 35V65" stroke="white" stroke-width="7" stroke-linecap="round"/>
      <path d="M74 35V65H86" stroke="white" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="50" cy="80" r="4" fill="#FF7A00"/>
    </svg>`
  },
  {
    id: 'delizia',
    name: 'Delizia',
    category: 'Helados y Lácteos',
    zone: 'Zona Norte / Av. América',
    address: 'Av. América Este #845, casi Pando, Zona Queru Queru',
    description: 'Tradición boliviana en helados artesanales, leche fresca, yogures y postres con sabores del valle cochabambino.',
    phone: '+591 4 4452100',
    hours: '09:00 - 20:00',
    coords: { lat: -17.3718, lng: -66.1524 },
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#E11D48"/>
      <path d="M25 70C25 50 40 30 50 20C60 30 75 50 75 70C75 77 69 82 50 82C31 82 25 77 25 70Z" fill="white"/>
      <circle cx="50" cy="45" r="12" fill="#FF7A00"/>
      <path d="M35 60Q50 72 65 60" stroke="#E11D48" stroke-width="4" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'hipermaxi',
    name: 'Hipermaxi',
    category: 'Supermercado',
    zone: 'Tiquipaya / Cala Cala',
    address: 'Av. Juan de la Rosa esq. Av. Gabriel René Moreno',
    description: 'La cadena de supermercados más grande de Cochabamba con amplia sección de panadería fresca, charcutería y verduras seleccionadas.',
    phone: '+591 4 4141200',
    hours: '07:30 - 22:00',
    coords: { lat: -17.3745, lng: -66.1668 },
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#0284C7"/>
      <rect x="20" y="24" width="60" height="52" rx="10" fill="#E11D48"/>
      <text x="50" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="white" text-anchor="middle">H</text>
      <circle cx="72" cy="32" r="5" fill="#FACC15"/>
    </svg>`
  },
  {
    id: 'ic-norte',
    name: 'IC Norte',
    category: 'Supermercado Gourmet',
    zone: 'Zona Norte / Av. América',
    address: 'Av. Melchor Pérez de Olguín y Av. D\'Orbigny',
    description: 'El hipermercado insignia de Cochabamba, reconocido por su panadería europea premium, pastelería fina, quesos importados y carnicería de primer nivel.',
    phone: '+591 4 4438000',
    hours: '08:00 - 21:30',
    coords: { lat: -17.3789, lng: -66.1832 },
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#1E3A8A"/>
      <circle cx="50" cy="50" r="32" fill="#FF7A00"/>
      <text x="50" y="58" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="22" fill="white" text-anchor="middle">IC</text>
      <path d="M42 22L50 14L58 22" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: 'sofia',
    name: 'Sofía Alimentos',
    category: 'Embutidos y Frescos',
    zone: 'Centro / El Prado',
    address: 'Av. Ballivián #620 (El Prado Cochabambino)',
    description: 'Líder en embutidos premium, cortes frescos de ave, cerdo y carnes de primera calidad con rigurosa cadena de frío en Bolivia.',
    phone: '+591 4 4529000',
    hours: '08:30 - 19:30',
    coords: { lat: -17.3871, lng: -66.1558 },
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#B91C1C"/>
      <path d="M28 65C28 45 42 35 52 35C64 35 72 43 72 52C72 63 60 67 48 69" stroke="white" stroke-width="7" stroke-linecap="round"/>
      <path d="M52 25V35" stroke="#FF7A00" stroke-width="6" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="6" fill="#FACC15"/>
    </svg>`
  },
  {
    id: 'panaderia-victoria',
    name: 'Panadería Victoria',
    category: 'Panadería Tradicional',
    zone: 'Centro / El Prado',
    address: 'Calle Baptista #425 esq. Mayor Rocha',
    description: 'Más de 70 años horneando el auténtico pan de batalla, marraquetas crocantes cochabambinas, empanadas blanqueadas y pastelería artesanal.',
    phone: '+591 4 4253322',
    hours: '06:30 - 21:00',
    coords: { lat: -17.3916, lng: -66.1579 },
    logoSvg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#D97706"/>
      <path d="M30 65C25 50 35 30 50 30C65 30 75 50 70 65Z" fill="#FDE68A"/>
      <path d="M50 30V65M40 45L60 45" stroke="#92400E" stroke-width="4" stroke-linecap="round"/>
      <path d="M26 72H74" stroke="white" stroke-width="6" stroke-linecap="round"/>
    </svg>`
  }
];

export const INITIAL_OFFERS: OfferProduct[] = [
  {
    id: 'off-1',
    companyId: 'panaderia-victoria',
    biz: 'Panadería Victoria',
    title: 'Pack Marraquetas Crocantes y Panes Vallunos',
    category: 'Panadería',
    zone: 'Centro / El Prado',
    oldPrice: 32,
    newPrice: 15,
    stock: 7,
    time: 'Hoy 18:30 - 20:30',
    desc: 'Lote recién salido del segundo turno de horneado. Incluye 12 marraquetas artesanales de corteza crocante, 4 panes de maíz y 2 sarnitas caseras de queso.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-2',
    companyId: 'pil-andina',
    biz: 'PIL Andina S.A.',
    title: 'Lote Yogures Probióticos + Leche Natural 1L',
    category: 'Lácteos y Helados',
    zone: 'Av. Blanco Galindo',
    oldPrice: 48,
    newPrice: 22,
    stock: 5,
    time: 'Hoy 17:00 - 19:00',
    desc: 'Caja con 6 yogures batidos Chiquilac con frutas surtidas (frutilla, durazno) más 2 botellas de leche pasteurizada natural entera 100% boliviana con fecha de consumo óptimo a 4 días.',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-3',
    companyId: 'ic-norte',
    biz: 'IC Norte',
    title: 'Box Pastelería Francesa y Croissants de Mantequilla',
    category: 'Panadería',
    zone: 'Zona Norte / Av. América',
    oldPrice: 65,
    newPrice: 29,
    stock: 4,
    time: 'Hoy 19:00 - 21:00',
    desc: 'Selección de la panadería gourmet IC Norte: 3 croissants de mantequilla pura, 2 pain au chocolat y 2 tartaletas de manzana y canela elaboradas con harina importada.',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-4',
    companyId: 'sofia',
    biz: 'Sofía Alimentos',
    title: 'Pack Embutidos Frankfurt & Pechuga Ahumada',
    category: 'Embutidos y Frescos',
    zone: 'Centro / El Prado',
    oldPrice: 56,
    newPrice: 26,
    stock: 8,
    time: 'Hoy 17:30 - 19:30',
    desc: 'Paquete sellado al vacío con salchichas Frankfurt estilo alemán (500g) más 1 bandeja de jamón cocido ahumado de cerdo de primera calidad, conservado en cadena de frío.',
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-5',
    companyId: 'hipermaxi',
    biz: 'Hipermaxi',
    title: 'Caja Mixta Verduras Frescas del Valle Alto',
    category: 'Supermercado',
    zone: 'Tiquipaya / Cala Cala',
    oldPrice: 42,
    newPrice: 19,
    stock: 6,
    time: 'Hoy 18:00 - 20:30',
    desc: 'Caja con verduras cosechadas en huertos de Cochabamba: tomates manzana, lechuga hidropónica, zapallitos tiernos, zanahorias y albahaca fresca en óptimo estado de maduración.',
    img: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-6',
    companyId: 'delizia',
    biz: 'Delizia',
    title: 'Combo Helados Tentación Familiar 2L',
    category: 'Lácteos y Helados',
    zone: 'Zona Norte / Av. América',
    oldPrice: 50,
    newPrice: 24,
    stock: 3,
    time: 'Hoy 17:00 - 19:30',
    desc: 'Pote familiar Delizia sabor Maracuyá del Chapare y Crema Americana con salsa de dulce de leche, listo para consumir o conservar en freezer.',
    img: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-7',
    companyId: 'panaderia-victoria',
    biz: 'Panadería Victoria',
    title: 'Docena Empanadas de Queso y Blanqueadas',
    category: 'Panadería',
    zone: 'Centro / El Prado',
    oldPrice: 38,
    newPrice: 18,
    stock: 5,
    time: 'Hoy 19:00 - 20:45',
    desc: 'Empanadas típicas de Cochabamba con abundante relleno de quesillo criollo derretido y blanqueadas con merengue de huevo, ideales para la hora del té.',
    img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-8',
    companyId: 'hipermaxi',
    biz: 'Hipermaxi',
    title: 'Bandeja Frutas Cortadas & Ensalada Tropical',
    category: 'Supermercado',
    zone: 'Tiquipaya / Cala Cala',
    oldPrice: 28,
    newPrice: 13,
    stock: 4,
    time: 'Hoy 18:30 - 21:00',
    desc: 'Bandeja de frutas listas para comer del Chapare: papaya, piña dorada, melón y uvas de Tarija, empacadas en atmósfera protectora.',
    img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'off-9',
    companyId: 'pil-andina',
    biz: 'PIL Andina S.A.',
    title: 'Dúo Queso Criollo Chaqueño 500g',
    category: 'Lácteos y Helados',
    zone: 'Av. Blanco Galindo',
    oldPrice: 52,
    newPrice: 25,
    stock: 6,
    time: 'Hoy 16:30 - 18:45',
    desc: 'Piezas de queso tipo chaqueño semiduro de mesa, pasteurizado y con sabor auténtico boliviano. Ideal para cuñapés, sándwiches o fundir.',
    img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_COMPOST: CompostLot[] = [
  {
    id: 'comp-1',
    companyId: 'ic-norte',
    title: 'Lote Excedentes Orgánicos de Frutas y Hortalizas',
    source: 'IC Norte (Sucursal Melchor Pérez)',
    useType: 'Compostaje / Humus',
    stock: 12,
    price: 15,
    unit: 'Bolsas reforzadas de 25 kg',
    weightApprox: '25 kg aprox.',
    desc: 'Hojas verdes, cáscaras de plátano, manzana y verduras de merma limpia no apta para venta al público, ideal para lombricultura o composteras térmicas.'
  },
  {
    id: 'comp-2',
    companyId: 'pil-andina',
    title: 'Suero Lácteo Orgánico y Residuos de Cuajada',
    source: 'PIL Andina S.A. (Planta Piñami)',
    useType: 'Alimento Animal',
    stock: 18,
    price: 20,
    unit: 'Bidón de 30 Litros',
    weightApprox: '30 L aprox.',
    desc: 'Suero de leche pasteurizado rico en proteínas y minerales, excelente suplemento para crianza porcina y avícola en granjas del Valle Bajo.'
  },
  {
    id: 'comp-3',
    companyId: 'panaderia-victoria',
    title: 'Remanentes de Masa y Panes Horneados',
    source: 'Panadería Victoria (Centro)',
    useType: 'Alimento Animal',
    stock: 8,
    price: 10,
    unit: 'Saco harinero de 20 kg',
    weightApprox: '20 kg aprox.',
    desc: 'Excedentes secos de pan de trigo y masas horneadas del día anterior sin aditivos químicos, óptimo para alimentación de aves de corral y ganado.'
  },
  {
    id: 'comp-4',
    companyId: 'hipermaxi',
    title: 'Restos de Cítricos, Café y Cáscaras Seleccionadas',
    source: 'Hipermaxi (Cala Cala)',
    useType: 'Compostaje / Humus',
    stock: 10,
    price: 12,
    unit: 'Bolsa biodegradable 20 kg',
    weightApprox: '20 kg aprox.',
    desc: 'Cáscaras de naranja del Chapare, bagazo de café de cafetería y restos de cáscaras ricos en nitrógeno y materia orgánica para enriquecer suelos arcillosos del valle.'
  },
  {
    id: 'comp-5',
    companyId: 'sofia',
    title: 'Subproductos Orgánicos para Suplemento de Granjas',
    source: 'Sofía Alimentos (El Prado)',
    useType: 'Alimento Animal',
    stock: 6,
    price: 18,
    unit: 'Caja térmica 15 kg',
    weightApprox: '15 kg aprox.',
    desc: 'Cortes vegetales y subproductos no cárnicos provenientes de control de calidad, aptos para granjas certificadas y cría de cerdos.'
  }
];

export const INITIAL_RESERVATIONS: UserReservation[] = [
  {
    code: 'QM-8421',
    companyId: 'panaderia-victoria',
    biz: 'Panadería Victoria',
    title: 'Pack Marraquetas Crocantes y Panes Vallunos',
    qty: 1,
    totalPaid: 15,
    pickupWindow: 'Hoy 18:30 - 20:30',
    zone: 'Centro / El Prado',
    address: 'Calle Baptista #425 esq. Mayor Rocha, Cochabamba',
    reference: 'Entrar por la puerta principal de la panadería y mostrar el código en la caja 1 de retiro rápido.',
    coords: { lat: -17.3916, lng: -66.1579 },
    status: 'Listo para recoger',
    type: 'rescate',
    createdAt: 'Hace 25 minutos'
  },
  {
    code: 'QM-5190',
    companyId: 'ic-norte',
    biz: 'IC Norte',
    title: 'Lote Excedentes Orgánicos de Frutas y Hortalizas (25kg)',
    qty: 1,
    totalPaid: 15,
    pickupWindow: 'Hoy 16:00 - 20:00',
    zone: 'Zona Norte / Av. América',
    address: 'Av. Melchor Pérez de Olguín y Av. D\'Orbigny, Cochabamba',
    reference: 'Portón de carga y logística de IC Norte sobre la calle lateral. Preguntar por el encargado de Economía Circular.',
    coords: { lat: -17.3789, lng: -66.1832 },
    status: 'Listo para recoger',
    type: 'composta',
    createdAt: 'Hace 1 hora'
  }
];
