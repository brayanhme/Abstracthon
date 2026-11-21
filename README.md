# Q'omer — Plataforma de Rescate Alimentario (Cochabamba)

Frontend oficial para **Q'omer**, una plataforma de rescate alimentario y economía circular en **Cochabamba, Bolivia**.

---

## 🎨 Sistema de Diseño (Paleta Fresh Citrus — Regla 60-30-10)

- **60% Fondo Dominante (`#FFFBF7`):** Fondo general limpio y descansado a la vista.
- **30% Superficies Suaves y Estructura (`#FFE1C6`, `#FFFFFF` y `#1E3A8A`):**
  - Contenedores secundarios, etiquetas y burbujas: `#FFE1C6`
  - Tarjetas limpias (`clean-card`) con bordes sutiles: `#FFFFFF`
  - Tipografía principal e identidad estructural: `#1E3A8A`
  - Tipografía secundaria y metadatos: `#526384`
- **10% Acento Llamativo (`#FF7A00`, hover `#E06800`):** Exclusivo para acciones primarias, códigos `#QM-XXXX` y elementos activos.
- **Verde Ecológico (`#6B8F5E`):** Etiquetas de composta, sustentabilidad y granjas del valle.

---

## 📁 Estructura del Proyecto Frontend (`frontend/`)

```text
frontend/
├── src/
│   ├── components/            # Componentes 100% visuales (UI)
│   │   ├── Header.tsx         # Encabezado fijo con 4 burbujas didácticas
│   │   ├── ExploreView.tsx    # Vista visual de ofertas, filtros y zonas
│   │   ├── CompaniesView.tsx  # Directorio visual de empresas
│   │   ├── CompostView.tsx    # Vista de composta y economía circular
│   │   ├── ReservationsView.tsx # Vista de retiros y mapa vectorial de Cochabamba
│   │   ├── ProductDrawer.tsx  # Panel lateral deslizable
│   │   └── LoginModal.tsx     # Modal de inicio de sesión
│   ├── types/
│   │   └── index.ts           # Modelos de datos para el frontend
│   ├── App.tsx                # Estructura principal de la aplicación
│   ├── index.css              # Estilos Tailwind y animaciones elásticas
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 💻 Ejecución en Desarrollo

```bash
cd frontend
npm run dev
```
