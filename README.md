# ReAprovecha

**Plataforma de rescate alimentario y economía circular**

*Cochabamba, Bolivia | Abstracthon 2026*


**Repositorio:** [GitHub](https://github.com/brayanhme/Abstracthon)
**Demostración pública:** [Portal del consumidor](https://abstracthon-frontend.vercel.app/)
**Panel de empresas:** [Portal empresarial](https://abstracthon-frontend.vercel.app/empresa.html)

## Descripción del proyecto

ReAprovecha es una plataforma web concebida para conectar comercios y productores de alimentos con consumidores interesados en adquirir productos próximos a su fecha de vencimiento a precios reducidos. El proyecto busca dar una segunda oportunidad comercial a productos que todavía son aptos para el consumo, reducir pérdidas para los establecimientos y ampliar el acceso a alimentos a precios asequibles.

La propuesta incorpora una visión de economía circular: los materiales orgánicos que ya no pueden destinarse al consumo humano podrían derivarse, mediante operadores autorizados y procesos adecuados, a compostaje, lombricultura u otras formas de valorización. Los nutrientes recuperados podrían emplearse en actividades agrícolas, cerrando el ciclo entre producción, comercialización y aprovechamiento de residuos.

ReAprovecha se desarrolló en el contexto de Abstracthon 2026 como un producto mínimo viable (MVP). La implementación actual se concentra en la publicación, consulta y reserva de ofertas alimentarias. Algunas funciones asociadas al aprovechamiento circular se presentan como parte de la experiencia de demostración y de la evolución prevista del proyecto.

## Problema que aborda

Los negocios de alimentos pueden acumular productos próximos a vencer que pierden su valor comercial, aun cuando permanecen en condiciones aptas para su consumo. Al mismo tiempo, numerosas familias y consumidores buscan alternativas de compra más económicas.

La falta de canales accesibles para ofrecer estos productos de forma oportuna contribuye al desperdicio alimentario, a pérdidas económicas para los comercios y al desaprovechamiento de recursos utilizados durante la producción y distribución.

ReAprovecha propone un canal digital para acercar oferta y demanda antes de que se produzca esa pérdida.

## Objetivos

### Objetivo general

Desarrollar una plataforma digital que facilite la comercialización responsable de alimentos próximos a su vencimiento y promueva un modelo de aprovechamiento circular de recursos en Cochabamba.

### Objetivos específicos

- Permitir a empresas y productores publicar productos con precio original, precio rebajado, cantidad disponible y fecha de vencimiento.
- Facilitar a los consumidores la búsqueda y reserva de ofertas.
- Dar visibilidad a empresas participantes mediante un directorio público.
- Gestionar la disponibilidad de productos y la confirmación de retiros.
- Establecer una base tecnológica para futuras conexiones con operadores de compostaje, recuperación orgánica y productores agrícolas.

## Actores de la plataforma

### Consumidores

Consultan el catálogo, comparan precios, identifican empresas participantes, reservan unidades disponibles y realizan el retiro coordinado con el establecimiento.

### Empresas y establecimientos alimentarios

Publican lotes aptos para consumo, administran sus ofertas y consultan las reservas asociadas a sus productos. Las operaciones están vinculadas a organizaciones y usuarios autorizados.

### Productores agrícolas

Forman parte de los tipos de organización contemplados en el modelo de datos y pueden integrarse a las ofertas según las reglas del sistema.

### Operadores de recuperación orgánica

Se consideran dentro del modelo de organizaciones y de la proyección de economía circular. La intermediación completa para residuos orgánicos no debe confundirse con una funcionalidad ya validada de extremo a extremo.

## Funcionalidades del mvp

### Portal del consumidor

- Consulta de productos publicados y lotes disponibles.
- Visualización de precios originales y reducidos, cantidades y fechas de vencimiento.
- Navegación por categorías de alimentos.
- Directorio de empresas aliadas con ofertas asociadas.
- Reserva de productos mediante una cuenta autenticada.
- Consulta de reservas y gestión de cancelaciones según los permisos establecidos.

### Portal empresarial

- Inicio de sesión mediante Supabase Auth.
- Vinculación de usuarios con organizaciones registradas.
- Publicación de productos y lotes mediante operaciones protegidas de la base de datos.
- Consulta de productos de la organización.
- Consulta de reservas y confirmación de entrega o retiro.

### Administración y seguridad

- Registro de perfiles asociados a usuarios autenticados.
- Modelo de organizaciones y miembros con roles de propietario y personal.
- Estados de organización, incluida la activación posterior a revisión.
- Políticas de seguridad a nivel de filas (`Row Level Security`, RLS).
- Funciones de base de datos para operaciones que requieren validaciones de autorización e integridad.

### Economía circular

La interfaz contempla espacios y conceptos relacionados con composta y reutilización de biomasa. En la versión documentada, esta línea representa una propuesta de expansión y contiene elementos demostrativos; no se afirma que exista una red operativa de gestores de residuos, una transferencia automática validada de productos vencidos o un sistema de trazabilidad de compostaje completamente implementado.

## Funcionamiento general

### Flujo de publicación y reserva

1. **Acceso empresarial:** una empresa inicia sesión en el portal empresarial con su cuenta.

2. **Validación de organización:** el sistema identifica la organización a la que pertenece y verifica las condiciones necesarias para operar.

3. **Publicación de productos:** la empresa registra un producto y su lote, incluyendo precios, disponibilidad y fecha de vencimiento.

4. **Exploración de ofertas:** el consumidor consulta los productos disponibles desde el portal público.

5. **Solicitud de reserva:** el consumidor autenticado selecciona los productos y solicita una reserva.

6. **Validación de disponibilidad:** el sistema comprueba el inventario y registra la reserva.

7. **Confirmación de entrega:** durante el retiro, el personal autorizado confirma la entrega del producto.

8. **Actualización de datos:** el sistema actualiza el inventario y el estado de la reserva en la base de datos.

**Nota:** la reserva digital no equivale a un pago electrónico. La integración de pasarelas de pago no forma parte de las funcionalidades confirmadas del MVP.

La reserva digital no equivale, por sí sola, a un pago electrónico. La integración de pasarelas de pago no forma parte de las operaciones confirmadas de este MVP.

## Tecnologías utilizadas

### Frontend
- HTML5, CSS y TypeScript.
- Vite como servidor de desarrollo y herramienta de compilación.
- React, disponible en la estructura del proyecto.
- Tailwind CSS para estilos de interfaz.
- Lucide para iconografía.

### Backend y datos
- Supabase como plataforma backend.
- PostgreSQL como base de datos relacional.
- Supabase Auth para autenticación.
- Supabase Data API y funciones RPC para acceso a datos y operaciones de negocio.
- `Row Level Security` (RLS) para restringir el acceso según identidad y organización.

### Desarrollo y despliegue
- Git y GitHub para control de versiones.
- npm para dependencias y scripts.
- Vercel para alojamiento del frontend.

El proyecto no requiere un servidor Express independiente para las operaciones del MVP descritas.

## Estructura general del repositorio

```text
Abstracthon/
|-- frontend/
|   |-- index.html                 Portal del consumidor
|   |-- empresa.html               Portal empresarial
|   |-- src/
|   |   |-- catalogo.ts            Carga de categorías y catálogo
|   |   |-- ofertas.ts             Consulta de ofertas
|   |   |-- empresas.ts            Directorio de organizaciones
|   |   |-- mis-reservas.ts        Reservas del consumidor
|   |   |-- reserva-compra.ts      Creación de reservas
|   |   |-- empresa-integracion.ts Integración del portal empresarial
|   |   |-- productos-empresa.ts   Productos de la organización
|   |   |-- entregas.ts            Gestión de entregas
|   |   |-- lib/supabase.ts        Cliente de Supabase
|   |   `-- components/           Componentes de interfaz
|   |-- package.json
|   `-- vite.config.ts
|-- supabase/
|   |-- config.toml
|   `-- migrations/               Esquema, seguridad y funciones SQL
|-- docs/
|   `-- backend2/                Diseño y contratos técnicos
`-- README.md
```

La estructura corresponde a la versión de integración del repositorio revisada para esta documentación.

## Requisitos para ejecución local

- Node.js y npm instalados.
- Acceso a un proyecto Supabase configurado con las migraciones necesarias.
- Credenciales públicas de conexión a Supabase.
- Git, si se desea clonar el repositorio.

## Instalación y configuración

### Clonar el repositorio

```bash
git clone https://github.com/brayanhme/Abstracthon.git
cd Abstracthon
```

Para reproducir la versión utilizada en la demostración de integración, seleccionar la rama correspondiente:

```bash
git switch integration/demo
```

### Instalar dependencias

```bash
cd frontend
npm install
```

### Configurar Supabase

Crear el archivo `frontend/.env.local` con los siguientes valores:

```dotenv
VITE_SUPABASE_URL=https://kdkbcqakojbqbpnxfbtv.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY= sb_publishable_XDENCZvOBGFV5Qka_TC5mA_X3xcUa-m
```

Los nombres anteriores coinciden con los utilizados en `frontend/src/lib/supabase.ts` de la versión revisada.

La clave debe ser la clave pública o publicable destinada a clientes. Nunca se debe colocar una clave de servicio privilegiada, secret o `service_role` en variables que comiencen con `VITE_`, ya que estas pueden incluirse en el código enviado al navegador.

El archivo .env.local no debe añadirse al repositorio. Está excluido por la configuración de Git del proyecto.

### Iniciar el entorno de desarrollo

```bash
npm run dev
```

Abrir la URL indicada por Vite, normalmente:

```text
http://localhost:5173/
```

Portal empresarial local

```text
http://localhost:5173/empresa.html
```

### Compilar para producción

```bash
npm run build
```

La compilación ejecuta la verificación de TypeScript y genera los archivos de salida en `frontend/dist/`.

### Previsualizar la compilación

```bash
npm run preview
```

## Configuración en vercel

Para un despliegue de este repositorio con Vite, se deben revisar las siguientes opciones:

- Repositorio de GitHub: brayanhme/Abstracthon.
- Rama de producción: la rama acordada para publicación por el equipo.
- Root Directory: frontend.
- Build Command: `npm run build`.
- Output Directory: dist.
- Framework Preset: Vite.

En Settings > Environment Variables deben configurarse, para Production, las mismas variables públicas de Supabase que utiliza el frontend:

```dotenv
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Después de modificar variables de entorno es necesario generar un nuevo despliegue. El archivo .env.local de una computadora no se transfiere automáticamente a Vercel.

## Base de datos y modelo de seguridad

Las migraciones SQL del proyecto incluyen estructuras para:

- profiles: datos básicos del perfil de usuario.
- organizations: organizaciones, tipo y estado de verificación.
- organization_members: asociación de usuarios con organizaciones y roles.
- organization_verification_requests: solicitudes de verificación empresarial.
- categories: categorías del catálogo.
- products: productos ofrecidos por organizaciones.
- product_batches: lotes, inventario, precios y vencimiento.
- reservations: reservas, cantidades y estado de retiro.

Las operaciones principales implementadas mediante funciones de PostgreSQL incluyen:

- `create_organization`.
- `submit_organization_verification`.
- `publish_product`.
- `create_reservation`.
- `confirm_reservation_pickup`.
- `cancel_reservation`.

Estas funciones deben invocarse respetando la autenticación y las reglas de autorización definidas en la base de datos. No deben reemplazarse por escrituras directas que omitan sus validaciones.

La aplicación pública consulta información comercial permitida por las políticas RLS. Los datos administrativos y las reservas requieren permisos específicos.

## Criterios de seguridad alimentaria

ReAprovecha diferencia los alimentos próximos a vencer que siguen siendo aptos para consumo de los materiales que ya no deben comercializarse para alimentación humana.

- Los alimentos destinados a compradores deben cumplir requisitos de inocuidad, conservación, cadena de frío cuando corresponda y normas aplicables.
- La fecha de vencimiento no sustituye una evaluación de seguridad alimentaria.
- Los productos vencidos o no aptos para consumo humano no deben volver a ofrecerse como alimentos para personas.
- Su posible valorización orgánica requiere clasificación, manejo y destinatarios adecuados; no todos los residuos son aptos para compostaje o alimentación animal.
- Cualquier expansión hacia recuperación orgánica deberá incorporar procedimientos de trazabilidad y cumplimiento normativo.

## Alcance y limitaciones actuales

Esta implementación corresponde a un MVP de hackathon y no a una plataforma comercial completa.

Funcionalidades respaldadas por la estructura y el código revisados:
- Consulta pública de catálogo y empresas.
- Autenticación y acceso asociado a organizaciones.
- Publicación de productos mediante Supabase.
- Creación, consulta, cancelación y confirmación de reservas.
- Gestión básica de inventario vinculado a lotes.

Funcionalidades pendientes de consolidación o validación operativa:
- Flujo completo de reutilización de residuos orgánicos.
- Transferencia automática y trazable a gestores de compostaje.
- Integraciones de pagos electrónicos.
- Notificaciones automáticas por correo o mensajería.
- Operación logística a escala y validación con establecimientos reales.

Algunas cifras, tarjetas y contenidos de la interfaz empresarial son demostrativos. Los datos de ejemplo utilizados en las pruebas no deben interpretarse como operaciones comerciales reales.

## Oportunidades de evolución

- Mejorar la verificación y administración de organizaciones.
- Incorporar alertas de vencimiento y descuentos oportunos.
- Añadir mecanismos de calificación y reputación.
- Incorporar ubicación geográfica y búsqueda por proximidad.
- Integrar pagos y opciones de retiro o entrega, de acuerdo con la viabilidad del servicio.
- Desarrollar un módulo independiente para gestores autorizados de residuos orgánicos.
- Medir alimentos rescatados, ahorros generados y residuos valorizados.
- Explorar modelos de ingresos basados en servicios empresariales y transacciones, previa validación con usuarios y comercios.

## Enfoque de impacto

**Impacto económico:** recuperación potencial de valor para comercios y acceso a ofertas más asequibles para consumidores.

**Impacto social:** ampliación de alternativas de compra y mayor visibilidad para negocios participantes.

**Impacto ambiental:** reducción potencial del desperdicio y promoción del aprovechamiento responsable de residuos orgánicos.

Estos beneficios representan objetivos y oportunidades del proyecto. Su magnitud deberá evaluarse mediante indicadores y pruebas con usuarios reales.

## Estado del proyecto

ReAprovecha se presenta como un MVP desarrollado para Abstracthon 2026. La versión de integración revisada cuenta con frontend Vite/TypeScript, conexión Supabase, tablas y funciones SQL para operaciones principales y una configuración de despliegue compatible con Vercel.

Para contribuciones al proyecto, se recomienda trabajar en una rama específica, verificar la compilación con `npm run build` y solicitar revisión antes de integrar cambios en la rama utilizada por producción.

## Licencia

No se identificó un archivo LICENSE en la versión del repositorio revisada. Por tanto, no se declara una licencia de uso ni permisos de redistribución adicionales. El equipo deberá definirlos antes de publicar el proyecto bajo una licencia específica.

---

**ReAprovecha**
*Tecnología para recuperar valor, ampliar el acceso a alimentos y avanzar hacia una economía circular.*
