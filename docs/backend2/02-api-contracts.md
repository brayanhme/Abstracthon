# Backend 2 — Contratos de API del MVP

Proyecto: Abstracthon 2026
Estado: Propuesta pendiente de implementación
Responsable: Backend 2

## 1. Objetivo

Definir las operaciones necesarias para que el frontend
React pueda consultar, publicar y administrar alimentos.

Tecnologías:
- React + Vite + Tailwind CSS.
- Supabase Auth.
- Supabase Data API.
- PostgreSQL con RLS.

No utilizaremos endpoints personalizados de Express.

## 2. Dependencias de Backend 1

El módulo depende de:

- public.profiles
- public.organizations
- public.organization_members
- Verificación empresarial.
- Funciones de autorización.

Un usuario solo podrá administrar publicaciones
de una organización a la que pertenezca.

La organización deberá tener status = 'active'.

Los roles habilitados inicialmente serán:
- owner
- staff

Backend 1 deberá confirmar el contrato definitivo
de autorización antes de implementar RLS.

## 3. Operación: consultar categorías

Objetivo:
Mostrar las categorías disponibles al comprador.

Método previsto: GET

Recurso Supabase previsto:
rest/v1/categories

Datos de respuesta:

- id: UUID
- name: TEXT
- slug: TEXT

Categorías iniciales:

- Lácteos
- Jugos
- Frutas
- Verduras
- Otros

Permisos:
Lectura pública.

La escritura de categorías no estará disponible
para compradores ni empresas desde React.

Esta operación estará disponible únicamente
después de crear y exponer la tabla de forma segura.

## 4. Operación: consultar catálogo

Objetivo:
Mostrar alimentos disponibles para consumo humano.

Filtros previstos:

- Categoría.
- Organización.
- Nombre del producto.
- Precio.
- Fecha de vencimiento.

Datos necesarios:

Producto:
- id
- name
- description
- category_id
- organization_id

Organización:
- id
- name

Lotes:
- id
- expiration_date
- original_price
- discounted_price
- available_quantity

Reglas:

- Solo mostrar organizaciones activas.
- Solo mostrar lotes habilitados.
- No mostrar lotes vencidos.
- No mostrar lotes sin disponibilidad.
- No mostrar alimentos retirados de comercialización.

La disponibilidad se calcula a partir del
inventario físico y las unidades reservadas.

La fecha se interpretará según el calendario
local de Bolivia, sujeto a las reglas de inocuidad.

Permisos:
Lectura pública de información comercial.

La consulta técnica definitiva se establecerá
cuando las tablas, relaciones y RLS estén probadas.

## 5. Operación: consultar productos por empresa

Objetivo:
Permitir que un comprador visite el perfil
comercial de una empresa y consulte sus alimentos.

Entrada:
- organization_id

Respuesta:
- Información comercial pública.
- Lista de productos disponibles.
- Lotes aptos para comercialización.

Restricción:
No exponer información privada de la organización
ni publicaciones de empresas suspendidas.

## 6. Operación: publicar un alimento

Objetivo:
Permitir a una organización autorizada
crear un producto con su primer lote.

Entrada conceptual:

Producto:
- organization_id
- category_id
- name
- description

Lote:
- expiration_date
- original_price
- discounted_price
- quantity_on_hand

Reglas:

- El usuario debe estar autenticado.
- Debe ser owner o staff autorizado.
- La organización debe estar activa.
- El tipo de organización debe permitir publicar.
- Los precios deben ser positivos.
- El precio reducido debe ser menor al original.
- Las cantidades no pueden ser negativas.
- El vencimiento debe ser válido para la venta.

La creación del producto y su lote inicial
debe ser atómica para evitar registros incompletos.

Implementación técnica:
Pendiente de definir y validar.

No se habilitarán inserciones directas
sin controles de permisos e integridad.

## 7. Operación: administrar inventario

Objetivo:
Permitir que una empresa consulte y actualice
datos comerciales de sus propios lotes.

Operaciones previstas:

- Consultar inventario.
- Actualizar precio reducido.
- Registrar cambios de stock físico.
- Retirar lotes de la comercialización.

Los usuarios no podrán modificar directamente
quantity_reserved desde React.

El control de las unidades reservadas se hará
mediante operaciones transaccionales protegidas.

No se permitirá modificar lotes de otras empresas.

## 8. Operación: reservar alimentos

Objetivo:
Permitir que un comprador reserve unidades
para retirarlas y pagarlas presencialmente.

Entrada conceptual:
- Identificador del lote.
- Cantidad solicitada.

Reglas:

- El usuario deberá estar autenticado.
- La cantidad solicitada debe ser positiva.
- El lote debe estar apto y disponible.
- No se podrá superar la disponibilidad.
- La reserva apartará unidades de inventario.
- Reservar no representa una venta completada.

Esta operación deberá ser transaccional.

El contrato definitivo se desarrollará
en el módulo de reservas.

## 9. Operación: confirmar retiro presencial

Objetivo:
Permitir que la empresa confirme que el cliente
recogió y pagó su reserva.

Reglas:

- Solo personal autorizado de la empresa.
- La reserva debe estar en estado válido.
- El inventario debe actualizarse una sola vez.
- No permitir confirmaciones duplicadas.

También se registrarán reservas no retiradas.

No se implementarán sanciones automáticas
en esta primera versión.

## 10. Manejo de errores

El frontend deberá distinguir:

- Usuario no autenticado.
- Organización no autorizada.
- Producto inexistente o no visible.
- Datos inválidos.
- Precio inválido.
- Lote vencido.
- Inventario insuficiente.
- Operación duplicada o estado incorrecto.
- Error interno.

No se mostrarán mensajes SQL internos
directamente al consumidor.

Los códigos HTTP y errores PostgreSQL definitivos
se documentarán después de implementar
y probar cada operación.

## 11. Seguridad

- Usar Supabase Auth para identificar al usuario.
- Aplicar RLS en todas las tablas.
- Usar permisos mínimos.
- Verificar membresías desde PostgreSQL.
- No confiar en roles enviados por React.
- No exponer service_role ni claves secretas.
- Proteger operaciones de inventario.
- Probar con usuarios de organizaciones distintas.

## 12. Estado de implementación

Este documento es un contrato funcional preliminar.

No implica que las tablas ni las operaciones
ya estén disponibles en Supabase.

Pendiente:
- Validación final del esquema SQL.
- Confirmación de las dependencias de Backend 1.
- Implementación de migraciones.
- Implementación de RLS.
- Pruebas con Postman.
- Entrega de contratos definitivos a frontend.
