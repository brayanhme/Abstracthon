# Q'omer — Plataforma de Rescate Alimentario y Economía Circular (Cochabamba)

Plataforma web desarrollada para **Q'omer**, una iniciativa de rescate alimentario y economía circular en **Cochabamba, Bolivia**. Conecta comercios, panaderías y supermercados locales con consumidores y granjas para aprovechar alimentos en perfecto estado a precio de rescate y canalizar excedentes orgánicos para compostaje y nutrición animal.

---

## 🎨 Sistema de Diseño (Paleta Fresh Citrus — Regla 60-30-10)

- **60% Fondo Dominante Limpio (`#FFFBF7`):** Base general de la aplicación para una navegación descansada y libre de fatiga visual.
- **30% Superficies Suaves y Estructura (`#FFE1C6`, `#FFFFFF` y `#1E3A8A`):**
  - Contenedores secundarios, etiquetas y burbujas didácticas: `#FFE1C6`
  - Tarjetas limpias con bordes sutiles: `#FFFFFF` con borde `rgba(30, 58, 138, 0.09)`
  - Tipografía principal e identidad estructural: `#1E3A8A`
  - Tipografía secundaria y metadatos: `#526384`
- **10% Acento Principal Llamativo (`#FF7A00`, hover `#E06800`):** Exclusivo para botones de acción primaria (*Reservar*, *Reservar ahora*, burbujas activas y códigos de retiro `#QM-XXXX`).
- **Apoyos Semánticos:**
  - Verde ecológico para composta y granjas: `#6B8F5E`
  - Celeste suave para detalles de agua y ríos del valle: `#9EC5E8`

**Tipografía:**
- Títulos, números y precios: `Plus Jakarta Sans` (600, 700, 800)
- Cuerpo de texto, controles y descripciones: `Inter` (400, 500, 600)

---

## 🚀 Vistas y Funcionalidades Implementadas

1. **Encabezado con Burbujas Didácticas:**
   - Logotipo oficial Q'omer Cochabamba con ícono de hoja.
   - Navegación interactiva con animación elástica (`scale(1.03)`) y giro del punto interior (`.bubble-dot`):
     - **Explorar**
     - **Empresas**
     - **Composta**
     - **Mis Reservas** (con contador dinámico en `#FF7A00`)
   - Botón de acceso de usuario / perfil activo.

2. **Vista 1: Explorar (Ofertas de Rescate):**
   - Título y propuesta de valor de Cochabamba.
   - Filtros rápidos horizontales por categoría (*Panadería*, *Lácteos y Helados*, *Supermercado*, *Embutidos y Frescos*) y selector de zonas (*Centro / El Prado*, *Zona Norte*, *Av. Blanco Galindo*, *Tiquipaya / Cala Cala*).
   - Cuadrícula responsiva con stock en tiempo real, insignias de descuento, logotipos SVG de empresas aliadas y botón de reserva inmediata.
   - **Drawer lateral de detalle:** Deslizamiento suave desde la derecha con fotografía de alta resolución, información de retiro, dirección y botón de confirmación.

3. **Vista 2: Empresas (Directorio Oficial y Perfil Individual):**
   - Directorio de empresas aliadas de Cochabamba: **PIL Andina**, **Delizia**, **Hipermaxi**, **IC Norte**, **Sofía Alimentos** y **Panadería Victoria** con logotipos vectoriales SVG personalizados.
   - Perfil individual detallado con dirección física, contacto y dos bloques:
     - Ofertas disponibles de rescate alimentario.
     - Lotes de excedentes orgánicos para composta y granjas.

4. **Vista 3: Composta (Economía Circular):**
   - Sección dedicada para agricultores, lombricultores y granjas del Valle Alto y Valle Bajo.
   - Filtros por tipo de aprovechamiento: *Compostaje / Humus* y *Alimento Animal*.
   - Tarjetas con etiqueta `#6B8F5E`, presentación, aporte logístico simbólico y botón para solicitar lote.

5. **Vista 4: Mis Reservas y Punto de Retiro:**
   - **Columna Izquierda:** Listado de pedidos activos con código `#QM-XXXX`, horario de retiro, total en Bs. y estado de preparación. Tarjeta seleccionada destacada con borde `#FF7A00`.
   - **Columna Derecha (Fija):** Mapa vectorial estilizado de Cochabamba (Parque Tunari, Río Rocha, El Prado, Laguna Alalay y Cristo de la Concordia) con pin interactivo de ubicación, dirección exacta, instrucciones de entrega, caja para mostrar en caja con código y QR, botón a **Google Maps** y acción **"Ya lo recogí"** para finalizar la entrega.

6. **Modal de Login y Sistema de Toasts:**
   - Ventana modal limpia para registrar nombre y celular/correo.
   - Notificaciones flotantes en tiempo real para confirmación de reservas, solicitudes y entregas.

---

## 🛠️ Estructura de Datos Mock (Lista para Conexión Backend)

Ubicada en `src/data/mockData.ts` con tipado estricto en `src/types.ts`:
- `Company`: `{ id, name, category, zone, address, description, logoSvg, phone, hours, coords }`
- `OfferProduct`: `{ id, companyId, biz, title, category, zone, oldPrice, newPrice, stock, time, desc, img }`
- `CompostLot`: `{ id, companyId, title, source, useType, stock, price, unit, weightApprox, desc }`
- `UserReservation`: `{ code, companyId, biz, title, qty, totalPaid, pickupWindow, zone, address, reference, coords, status, type, createdAt }`

---

## 📦 Instalación y Ejecución Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```
