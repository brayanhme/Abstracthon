# Q'omer — Plataforma de Rescate Alimentario (Cochabamba)

Plataforma de rescate alimentario y economía circular para **Cochabamba, Bolivia**.

---

## 📁 Estructura del Repositorio

El proyecto mantiene una separación limpia entre Frontend y Backend:

```text
Abstracthon/
├── frontend/                # Aplicación Web Frontend (Vite + React + TS + Tailwind)
│   ├── src/
│   │   ├── components/      # Componentes 100% visuales (UI / Presentación)
│   │   │   ├── Header.tsx           # Barra fija con burbujas didácticas
│   │   │   ├── ExploreView.tsx      # Catálogo de ofertas, filtros y zonas
│   │   │   ├── ProductDrawer.tsx    # Drawer lateral de detalle de producto
│   │   │   ├── CompaniesView.tsx    # Directorio de aliados y perfil de empresa
│   │   │   ├── CompostView.tsx      # Excedentes orgánicos y economía circular
│   │   │   ├── ReservationsView.tsx # Gestión de retiros y mapa de Cochabamba
│   │   │   └── LoginModal.tsx       # Modal de acceso de usuario
│   │   ├── services/        # Servicios de conexión con Backend y API
│   │   │   ├── api.ts               # Endpoints REST preparados para Backend
│   │   │   └── previewTemplates.ts  # Plantillas visuales (sin almacenamiento local)
│   │   ├── types/           # Interfaces y modelos de entidades de Base de Datos
│   │   │   └── index.ts             # Company, OfferProduct, CompostLot, Reservation, User
│   │   ├── App.tsx          # Coordinador visual de vistas y estados
│   │   ├── index.css        # Paleta Fresh Citrus (Regla 60-30-10)
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── README.md
└── .gitignore
```

---

## 🎨 Paleta Fresh Citrus (Regla 60-30-10)

- **60% Fondo Dominante (`#FFFBF7`):** Fondo descansado a la vista.
- **30% Estructura y Superficies (`#FFE1C6`, `#FFFFFF` y `#1E3A8A`):** Contenedores secundarios, tarjetas y tipografía principal.
- **10% Acento Llamativo (`#FF7A00`, hover `#E06800`):** Botones de acción primaria (*Reservar*, *Reservar ahora*, códigos `#QM-XXXX`).
- **Verde Ecológico (`#6B8F5E`):** Etiquetas de composta, empresas aliadas y estado de pedidos.

---

## 🔌 Integración para el Equipo de Backend

Los componentes son **100% visuales** y no contienen lógica de almacenamiento local simulado. 

1. **Modelos de Base de Datos:** Definidos en `frontend/src/types/index.ts`.
2. **Endpoints de Conexión:** Declarados en `frontend/src/services/api.ts` apuntando a `VITE_API_URL` (por defecto `http://localhost:8000/api`):
   - `GET /api/offers` (Ofertas de alimentos)
   - `GET /api/companies` (Empresas aliadas de Cochabamba)
   - `GET /api/compost-lots` (Lotes de biomasa y composta)
   - `GET /api/reservations` (Reservas activas del usuario)
   - `POST /api/reservations` (Guardar nueva reserva)
   - `PATCH /api/reservations/:code/complete` (Confirmar entrega)

---

## 💻 Ejecución Local

```bash
# Entrar a la carpeta frontend
cd frontend

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
