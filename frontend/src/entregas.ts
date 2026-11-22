import { supabase } from './lib/supabase'

type Producto = {
  id: string
  name: string
}

type Lote = {
  id: string
  product_id: string
}

type Reserva = {
  id: string
  batch_id: string
  quantity: number
  total_price: number
  created_at: string
  status: string
}

const grid = document.getElementById('grid-entregas')
let cargando = false

// El backend identifica retiros mediante el UUID de la reserva,
// no mediante el PIN ficticio de cuatro dígitos del diseño inicial.
const titulo = document.querySelector('#sec-entregas h2')
if (titulo) titulo.textContent = 'Reservas pendientes de retiro'

const descripcion = document.querySelector('#sec-entregas h2 + p')
if (descripcion) {
  descripcion.textContent =
    'Compara el código completo con el del comprador y confirma la entrega después del pago presencial.'
}

const contador = document.getElementById('nav-count-entregas')
if (contador) contador.textContent = '–'

function mostrarMensaje(texto: string) {
  if (!grid) return
  grid.replaceChildren()

  const aviso = document.createElement('div')
  aviso.className =
    'col-span-full clean-card rounded-3xl p-8 text-center text-sm u-ink-muted'
  aviso.textContent = texto

  grid.appendChild(aviso)
}

async function buscarEmpresaActiva(): Promise<string | null> {
  const { data: { user }, error: errorUsuario } =
    await supabase.auth.getUser()

  if (errorUsuario || !user) return null

  const { data: miembros, error: errorMiembros } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .in('member_role', ['owner', 'staff'])

  if (errorMiembros) throw errorMiembros

  const ids = (miembros ?? []).map(m => m.organization_id)
  if (!ids.length) return null

  const { data: empresas, error: errorEmpresas } = await supabase
    .from('organizations')
    .select('id')
    .in('id', ids)
    .eq('status', 'active')
    .limit(1)

  if (errorEmpresas) throw errorEmpresas

  return empresas?.[0]?.id ?? null
}

export async function cargarEntregas() {
  if (!grid || cargando) return

  cargando = true
  mostrarMensaje('Consultando reservas reales...')

  try {
    const organizacionId = await buscarEmpresaActiva()

    if (!organizacionId) {
      mostrarMensaje('Inicia sesión con una empresa activa para consultar las entregas.')
      return
    }

    // Productos pertenecientes a esta empresa.
    const { data: productos, error: errorProductos } = await supabase
      .from('products')
      .select('id, name')
      .eq('organization_id', organizacionId)

    if (errorProductos) throw errorProductos

    const listaProductos = (productos ?? []) as Producto[]

    if (!listaProductos.length) {
      if (contador) contador.textContent = '0'
      mostrarMensaje('Tu empresa todavía no tiene productos publicados.')
      return
    }

    // Lotes pertenecientes a esos productos.
    const { data: lotes, error: errorLotes } = await supabase
      .from('product_batches')
      .select('id, product_id')
      .in('product_id', listaProductos.map(p => p.id))

    if (errorLotes) throw errorLotes

    const listaLotes = (lotes ?? []) as Lote[]

    if (!listaLotes.length) {
      if (contador) contador.textContent = '0'
      mostrarMensaje('No hay lotes con reservas.')
      return
    }

    // Solo reservas pendientes de los lotes de esta empresa.
    const { data: reservas, error: errorReservas } = await supabase
      .from('reservations')
      .select('id, batch_id, quantity, total_price, created_at, status')
      .in('batch_id', listaLotes.map(l => l.id))
      .eq('status', 'reserved')
      .order('created_at', { ascending: false })
      .limit(100)

    if (errorReservas) throw errorReservas

    const listaReservas = (reservas ?? []) as Reserva[]

    if (contador) contador.textContent = String(listaReservas.length)

    if (!listaReservas.length) {
      mostrarMensaje('No hay reservas pendientes de entrega.')
      return
    }

    const productoPorId = new Map(
      listaProductos.map(p => [p.id, p.name])
    )

    const lotePorId = new Map(
      listaLotes.map(l => [l.id, l.product_id])
    )

    grid.replaceChildren()

    for (const reserva of listaReservas) {
      const productoId = lotePorId.get(reserva.batch_id)
      const nombre = productoId
        ? productoPorId.get(productoId) ?? 'Producto'
        : 'Producto'

      const tarjeta = document.createElement('article')

      tarjeta.className =
        'clean-card rounded-3xl p-6 flex flex-col justify-between gap-5'

      tarjeta.innerHTML = `
        <div class="space-y-3">
          <span class="inline-block text-xs font-bold u-accent-text">
            Pendiente de retiro
          </span>

          <h3 data-producto class="font-heading text-lg font-extrabold u-ink-30"></h3>

          <p data-detalle class="text-sm u-ink-muted"></p>

          <div class="u-ink-bg text-white rounded-2xl px-4 py-4">
            <p class="text-xs mb-2">Código de reserva</p>
            <p data-codigo class="font-mono text-xs break-all select-all"></p>
          </div>

          <p class="text-xs u-ink-muted">
            Confirma únicamente después de verificar el código
            y realizar el pago presencial.
          </p>
        </div>

        <button type="button" data-confirmar
          class="px-5 py-3 rounded-full u-accent-10 text-white text-sm font-bold">
          Confirmar entrega
        </button>
      `

      const nombreNodo = tarjeta.querySelector('[data-producto]')
      if (nombreNodo) nombreNodo.textContent = nombre

      const detalle = tarjeta.querySelector('[data-detalle]')
      if (detalle) {
        detalle.textContent =
          `${reserva.quantity} unidad(es) · Bs. ${Number(reserva.total_price).toFixed(2)}`
      }

      const codigo = tarjeta.querySelector('[data-codigo]')
      if (codigo) codigo.textContent = reserva.id

      const boton = tarjeta.querySelector<HTMLButtonElement>('[data-confirmar]')

      boton?.addEventListener('click', async () => {
        const aprobado = window.confirm(
          `¿Verificaste el código completo y recibiste el pago de Bs. ${Number(reserva.total_price).toFixed(2)}?\n\n` +
          'Esta acción registrará la entrega en Supabase.'
        )

        if (!aprobado) return

        boton.disabled = true
        boton.textContent = 'Confirmando...'

        const { error } = await supabase.rpc(
          'confirm_reservation_pickup',
          { p_reservation_id: reserva.id }
        )

        if (error) {
          alert(`No se pudo confirmar la entrega: ${error.message}`)
          boton.disabled = false
          boton.textContent = 'Confirmar entrega'
          return
        }

        alert('Entrega confirmada correctamente.')
        setTimeout(() => void cargarEntregas(), 0)
      })

      grid.appendChild(tarjeta)
    }

  } catch (error) {
    console.error('Error cargando entregas:', error)
    mostrarMensaje('No fue posible consultar las entregas en Supabase.')
  } finally {
    cargando = false
  }
}

// Actualizar al abrir Entregas desde escritorio o móvil.
for (const id of ['nav-entregas', 'mnav-entregas']) {
  document.getElementById(id)
    ?.addEventListener('click', () => void cargarEntregas())
}

// Actualizar si el usuario vuelve desde otra pestaña.
window.addEventListener('focus', () => {
  const seccion = document.getElementById('sec-entregas')

  if (seccion && !seccion.classList.contains('hidden')) {
    void cargarEntregas()
  }
})
