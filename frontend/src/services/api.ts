import { OfferProduct, Company, CompostLot, Reservation, User } from '../types';

/**
 * CLIENTE DE SERVICIOS API (CONEXIÓN BACKEND)
 * Aquí el equipo de Backend conectará sus endpoints REST o GraphQL.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  // --- OFERTAS DE RESCATE ---
  getOffers: async (): Promise<OfferProduct[]> => {
    // TODO (Backend): Conectar con GET ${API_BASE_URL}/offers
    const response = await fetch(`${API_BASE_URL}/offers`);
    if (!response.ok) throw new Error('Error al obtener ofertas de la base de datos');
    return response.json();
  },

  getOfferById: async (id: string): Promise<OfferProduct> => {
    // TODO (Backend): Conectar con GET ${API_BASE_URL}/offers/${id}
    const response = await fetch(`${API_BASE_URL}/offers/${id}`);
    if (!response.ok) throw new Error('Error al obtener la oferta');
    return response.json();
  },

  // --- EMPRESAS ALIADAS ---
  getCompanies: async (): Promise<Company[]> => {
    // TODO (Backend): Conectar con GET ${API_BASE_URL}/companies
    const response = await fetch(`${API_BASE_URL}/companies`);
    if (!response.ok) throw new Error('Error al obtener empresas de la base de datos');
    return response.json();
  },

  getCompanyById: async (id: string): Promise<Company> => {
    // TODO (Backend): Conectar con GET ${API_BASE_URL}/companies/${id}
    const response = await fetch(`${API_BASE_URL}/companies/${id}`);
    if (!response.ok) throw new Error('Error al obtener la empresa');
    return response.json();
  },

  // --- LOTES DE COMPOSTA Y ECONOMÍA CIRCULAR ---
  getCompostLots: async (): Promise<CompostLot[]> => {
    // TODO (Backend): Conectar con GET ${API_BASE_URL}/compost-lots
    const response = await fetch(`${API_BASE_URL}/compost-lots`);
    if (!response.ok) throw new Error('Error al obtener lotes de composta');
    return response.json();
  },

  // --- RESERVAS Y PUNTOS DE RETIRO ---
  getReservations: async (): Promise<Reservation[]> => {
    // TODO (Backend): Conectar con GET ${API_BASE_URL}/reservations
    const response = await fetch(`${API_BASE_URL}/reservations`);
    if (!response.ok) throw new Error('Error al obtener reservas');
    return response.json();
  },

  createReservation: async (data: Partial<Reservation>): Promise<Reservation> => {
    // TODO (Backend): Conectar con POST ${API_BASE_URL}/reservations
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al guardar la reserva en la base de datos');
    return response.json();
  },

  completeReservation: async (code: string): Promise<boolean> => {
    // TODO (Backend): Conectar con PATCH/PUT ${API_BASE_URL}/reservations/${code}/complete
    const response = await fetch(`${API_BASE_URL}/reservations/${code}/complete`, {
      method: 'PATCH'
    });
    return response.ok;
  },

  // --- AUTENTICACIÓN / USUARIOS ---
  loginUser: async (credentials: { name: string; emailOrPhone: string }): Promise<User> => {
    // TODO (Backend): Conectar con POST ${API_BASE_URL}/auth/login
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Error de autenticación');
    return response.json();
  }
};
