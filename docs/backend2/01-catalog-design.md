# Backend 2 — Diseño 001: Catálogo e inventario

Estado: Propuesta pendiente de validación
Proyecto: Abstracthon 2026

## 1. Objetivo

Permitir que las organizaciones autorizadas publiquen
alimentos próximos a vencer, con precios reducidos,
cantidades disponibles y fechas de vencimiento.

Los consumidores podrán consultar productos
por categoría y por empresa.

## 2. Alcance del módulo

Incluye:
- Categorías de alimentos.
- Productos asociados a organizaciones.
- Lotes con vencimientos diferentes.
- Precio original y precio reducido.
- Cantidades físicas y reservadas.
- Control de disponibilidad.

No incluye todavía:
- Reservas y confirmaciones de compras.
- Pagos en línea.
- Chat y notificaciones externas.
- Gestión de recuperación alimentaria.

## 3. Entidades propuestas

### categories

Clasifica alimentos.

Campos candidatos:
- id: UUID, clave primaria.
- name: TEXT, obligatorio.
- slug: TEXT, obligatorio y único.

Categorías iniciales:
- Lácteos.
- Jugos.
- Frutas.
- Verduras.
- Otros.

### products

Representa un alimento publicado por una organización.

Campos candidatos:
- id: UUID, clave primaria.
- organization_id: UUID, clave foránea.
- category_id: UUID, clave foránea.
- name: TEXT, obligatorio.
- description: TEXT, opcional.
- created_at: TIMESTAMPTZ.

Relaciones:
- organization_id → organizations.id
- category_id → categories.id

### product_batches

Representa un lote específico de un producto.

Campos candidatos:
- id: UUID, clave primaria.
- product_id: UUID, clave foránea.
- expiration_date: DATE.
- original_price: NUMERIC(10,2).
- discounted_price: NUMERIC(10,2).
- quantity_on_hand: INTEGER.
- quantity_reserved: INTEGER.
- status: TEXT.

Relación:
- product_id → products.id

## 4. Reglas de negocio propuestas

1. Cada producto pertenece a una organización.
2. Solo organizaciones autorizadas podrán publicar.
3. Un producto puede tener varios lotes.
4. Cada lote tendrá su propio vencimiento.
5. El precio reducido no superará al original.
6. Ninguna cantidad puede ser negativa.
7. No se podrá reservar más que la disponibilidad.
8. Los lotes no aptos para consumo quedarán
   fuera del catálogo comercial.

## 5. Inventario

Propuesta inicial:

Cantidad disponible =
quantity_on_hand - quantity_reserved

La reserva incrementa quantity_reserved.

La venta confirmada reduce quantity_on_hand
y libera las unidades correspondientes de
quantity_reserved.

La cancelación libera unidades reservadas,
si todavía son aptas para comercialización.

Todas estas operaciones deberán garantizar
consistencia transaccional.

## 6. Seguridad

- Las tablas tendrán RLS.
- La autorización usará Supabase Auth.
- No se confiará en roles enviados por React.
- Se verificará la membresía del usuario.
- Se verificará el estado de la organización.
- No se permitirán modificaciones ajenas.

## 7. Dependencias de Backend 1

- organizations.
- organization_members.
- Verificación empresarial.
- Funciones de autorización y RLS.

## 8. Decisiones pendientes de validar

- Tipos y restricciones definitivos.
- Estados permitidos para productos y lotes.
- Reglas exactas de vencimiento.
- Cómo publicar y archivar lotes.
- Control de concurrencia del inventario.
- Permisos de lectura pública del catálogo.

## 9. Estado

Diseño inicial.
No ejecutar migraciones todavía.

## 10. Decisiones técnicas del MVP

Estado: Propuestas para validación.

### 10.1. Autorización de publicaciones

Solo podrán publicar organizaciones que:

- Tengan status = 'active'.
- Sean food_business o agricultural_producer.
- Tengan un usuario autenticado con membresía
  owner o staff autorizada.

Estas condiciones se verificarán en PostgreSQL,
utilizando las funciones de Backend 1.

### 10.2. Reglas de precios

- original_price > 0.
- discounted_price > 0.
- discounted_price < original_price.
- Se utilizarán importes en bolivianos (Bs).
- Los precios serán NUMERIC(10,2).

### 10.3. Reglas de inventario

- quantity_on_hand >= 0.
- quantity_reserved >= 0.
- quantity_reserved <= quantity_on_hand.

Disponibilidad:

available_quantity =
quantity_on_hand - quantity_reserved

Las reservas y confirmaciones deberán utilizar
operaciones transaccionales.

No se permitirá que React modifique directamente
quantity_reserved.

### 10.4. Estados de lote

Estados iniciales propuestos:

- available: habilitado para comercialización.
- withdrawn: retirado de la venta.

La disponibilidad comercial también depende de:

- Fecha de vencimiento.
- Stock disponible.
- Estado de la organización.
- Condiciones de inocuidad.

Un lote vencido o no apto no podrá reservarse.

### 10.5. Venta presencial

La reserva apartará unidades, pero no significará
que se realizó una venta.

Al confirmar el retiro y pago:

- Se disminuirá quantity_on_hand.
- Se disminuirá quantity_reserved.
- Se registrará la reserva como completada.

En una cancelación:

- Se liberarán las unidades reservadas.
- Solo volverán a ofrecerse si siguen siendo aptas.

### 10.6. Dependencias pendientes

Antes de implementar RLS y publicar productos:

- Backend 1 debe entregar organizations.
- Backend 1 debe entregar organization_members.
- Debe existir una forma segura de comprobar
  membresías y organizaciones activas.
- Debe acordarse el despliegue de migraciones.

No implementar operaciones dependientes hasta
validar estos contratos.
