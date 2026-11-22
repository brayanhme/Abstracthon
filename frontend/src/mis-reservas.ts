import { supabase } from './lib/supabase'
import { solicitarAcceso } from './reserva-compra'

type Reserva = {
  id: string
  quantity: number
  total_price: number
  status: string
  created_at: string
  product_batches: {
    products: {
      name: string
      organizations: { name: string } | null
    } | null
  } | null
}

const grid = document.getElementById('reservations-grid')

async function cargarMisReservas() {
  if (!grid) return

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    grid.innerHTML = `
      <div class="clean-card rounded-3xl p-8 text-center space-y-4">
        <h3 class="font-bold text-lg">Consulta tus reservas</h3>
        <p class="text-sm">Inicia sesión para consultar tus pedidos y códigos de retiro.</p>
        <button id="reservas-iniciar" type="button"
          class="px-5 py-3 rounded-xl text-white font-semibold u-accent-10">
          Iniciar sesión
        </button>
      </div>
    `

    document.getElementById('reservas-iniciar')
      ?.addEventListener('click', async () => {
        if (await solicitarAcceso()) await cargarMisReservas()
      })

    return
  }

  grid.textContent = 'Cargando tus reservas...'

  const { data, error } = await supabase
    .from('reservations')
    .select(`
      id,
      quantity,
      total_price,
      status,
      created_at,
      product_batches (
        products (
          name,
          organizations (name)
        )
      )
    `)
    .eq('consumer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error al consultar reservas:', error)
    grid.textContent = 'No fue posible consultar las reservas. Intenta nuevamente.'
    return
  }

  const reservas = (data ?? []) as unknown as Reserva[]

  grid.replaceChildren()

  if (!reservas.length) {
    grid.innerHTML = `
      <div class="clean-card rounded-3xl p-10 text-center space-y-3">
        <h3 class="font-bold text-lg">Todavía no tienes reservas</h3>
        <p class="text-sm">Explora los alimentos disponibles para hacer tu primera reserva.</p>
      </div>
    `
    return
  }

  for (const reserva of reservas) {
    const producto = reserva.product_batches?.products
    const tarjeta = document.createElement('article')
    tarjeta.className = 'clean-card rounded-3xl p-6 space-y-3'

    tarjeta.innerHTML = `
      <h3 data-nombre class="font-heading text-xl font-extrabold u-ink-30"></h3>
      <p data-empresa class="text-sm u-ink-muted"></p>
      <p data-detalle class="text-sm u-ink-30"></p>
      <p data-estado class="text-sm font-bold"></p>
      <div class="rounded-xl u-bg-60 p-3">
        <p class="text-xs u-ink-muted">Código de reserva para presentar al retirar</p>
        <p data-codigo class="font-mono text-xs font-semibold break-all select-all"></p>
      </div>
      <div data-acciones></div>
    `

    const escribir = (selector: string, texto: string) => {
      const nodo = tarjeta.querySelector<HTMLElement>(selector)
      if (nodo) nodo.textContent = texto
    }

    escribir('[data-nombre]', producto?.name ?? 'Producto reservado')
    escribir('[data-empresa]', producto?.organizations?.name ?? 'Empresa')
    escribir(
      '[data-detalle]',
      `${reserva.quantity} unidad(es) · Bs. ${Number(reserva.total_price).toFixed(2)}`
    )

    const estados: Record<string, string> = {
      reserved: 'Pendiente de retiro y pago presencial',
      completed: 'Entregada',
      cancelled: 'Cancelada'
    }

    escribir('[data-estado]', estados[reserva.status] ?? reserva.status)
    escribir('[data-codigo]', reserva.id)

    if (reserva.status === 'reserved') {
      const cancelar = document.createElement('button')
      cancelar.type = 'button'
      cancelar.className =
        'px-4 py-2 rounded-xl border border-red-300 text-red-700 text-sm font-semibold'
      cancelar.textContent = 'Cancelar reserva'

      cancelar.addEventListener('click', async () => {
        if (!confirm('¿Deseas cancelar esta reserva?')) return

        cancelar.disabled = true

        const { error: errorCancelacion } = await supabase.rpc(
          'cancel_reservation',
          { p_reservation_id: reserva.id }
        )

        if (errorCancelacion) {
          alert('No fue posible cancelar la reserva.')
          cancelar.disabled = false
          return
        }

        await cargarMisReservas()
      })

      tarjeta.querySelector('[data-acciones]')?.appendChild(cancelar)
    }

    grid.appendChild(tarjeta)
  }
}

for (const id of ['nav-reservas', 'mnav-reservas']) {
  document.getElementById(id)
    ?.addEventListener('click', () => void cargarMisReservas())
}

window.addEventListener('focus', () => {
  if (!document.getElementById('sec-reservas')?.classList.contains('hidden')) {
    void cargarMisReservas()
  }
})
