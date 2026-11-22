import { supabase } from './lib/supabase'
import { iconoAlimento } from './lib/food-icon'

type Lote = {
  id: string
  expiration_date: string
  original_price: number
  discounted_price: number
  quantity_on_hand: number
  quantity_reserved: number
  status: string
}

type Producto = {
  id: string
  name: string
  status: string
  categories: { name: string } | null
  product_batches: Lote[]
}

type Fila = {
  nombre: string
  categoria: string
  estado: string
  lote: Lote
}

const grid = document.getElementById('grid-por-vencer')
const filtro = document.querySelector<HTMLSelectElement>('#filter-category')

let filas: Fila[] = []

function escribir(id: string, valor: string) {
  const nodo = document.getElementById(id)
  if (nodo) nodo.textContent = valor
}

function aviso(texto: string) {
  if (!grid) return
  grid.replaceChildren()

  const caja = document.createElement('div')
  caja.className = 'col-span-full clean-card rounded-3xl p-8 text-center'
  caja.textContent = texto

  grid.appendChild(caja)
}

function renderProductos() {
  if (!grid) return

  const categoria = filtro?.value ?? 'Todas'
  const visibles = filas.filter(f =>
    categoria === 'Todas' || f.categoria === categoria
  )

  grid.replaceChildren()

  if (!visibles.length) {
    aviso('No hay productos registrados en esta categoría.')
    return
  }

  const hoy = new Date().toLocaleDateString('sv-SE', {
    timeZone: 'America/La_Paz'
  })

  for (const fila of visibles) {
    const lote = fila.lote
    const disponibles = lote.quantity_on_hand - lote.quantity_reserved

    const publicada =
      fila.estado === 'active' &&
      lote.status === 'available' &&
      lote.expiration_date >= hoy &&
      disponibles > 0

    const tarjeta = document.createElement('article')
    tarjeta.className =
      'clean-card rounded-3xl overflow-hidden flex flex-col'

    tarjeta.innerHTML = `
      <div class="h-36 bg-gradient-to-br from-orange-50 via-amber-100 to-emerald-50 flex flex-col items-center justify-center gap-1">
        <span data-icono role="img" class="text-6xl drop-shadow-sm"></span>
        <span class="text-[10px] font-semibold text-emerald-900/70">Imagen ilustrativa</span>
      </div>
      <div class="p-6 space-y-3">
        <span data-categoria class="text-xs font-semibold u-nature-text"></span>
        <h3 data-nombre class="font-bold text-lg u-ink-30"></h3>
        <p data-estado class="text-xs font-bold"></p>
        <p data-fecha class="text-sm u-ink-muted"></p>
        <p data-stock class="text-sm u-ink-muted"></p>
        <div class="flex items-center gap-3 border-t u-border pt-3">
          <span data-original class="line-through text-sm u-ink-muted"></span>
          <strong data-precio class="text-xl u-ink-30"></strong>
        </div>
      </div>
    `

    function poner(selector: string, texto: string) {
      const nodo = tarjeta.querySelector(selector)
      if (nodo) nodo.textContent = texto
    }

    poner('[data-icono]', iconoAlimento(fila.nombre, fila.categoria))
    poner('[data-categoria]', fila.categoria)
    poner('[data-nombre]', fila.nombre)
    poner(
      '[data-estado]',
      publicada ? '🟢 Visible al comprador' : '⚪ No disponible para compra'
    )
    poner('[data-fecha]', `Vencimiento: ${lote.expiration_date}`)
    poner(
      '[data-stock]',
      `Stock: ${lote.quantity_on_hand} · Reservadas: ${lote.quantity_reserved} · Disponibles: ${disponibles}`
    )
    poner('[data-original]', `Bs. ${Number(lote.original_price).toFixed(2)}`)
    poner('[data-precio]', `Bs. ${Number(lote.discounted_price).toFixed(2)}`)

    grid.appendChild(tarjeta)
  }
}

async function cargarProductos() {
  if (!grid) return

  aviso('Consultando productos en Supabase...')

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      aviso('Inicia sesión con una empresa para ver sus productos.')
      return
    }

    const { data: miembros, error: errorMiembros } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .in('member_role', ['owner', 'staff'])

    if (errorMiembros) throw errorMiembros

    const ids = (miembros ?? []).map(m => m.organization_id)

    if (!ids.length) {
      aviso('Tu cuenta no pertenece a una empresa.')
      return
    }

    const { data: empresas, error: errorEmpresas } = await supabase
      .from('organizations')
      .select('id')
      .in('id', ids)
      .eq('status', 'active')
      .limit(1)

    if (errorEmpresas) throw errorEmpresas

    const empresaId = empresas?.[0]?.id

    if (!empresaId) {
      aviso('No tienes una empresa activa.')
      return
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        status,
        categories (name),
        product_batches (
          id,
          expiration_date,
          original_price,
          discounted_price,
          quantity_on_hand,
          quantity_reserved,
          status
        )
      `)
      .eq('organization_id', empresaId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    const productos = (data ?? []) as unknown as Producto[]

    filas = productos.flatMap(p =>
      (p.product_batches ?? []).map(lote => ({
        nombre: p.name,
        categoria: p.categories?.name ?? 'Otros',
        estado: p.status,
        lote
      }))
    )

    const categorias = [...new Set(filas.map(f => f.categoria))].sort()

    if (filtro) {
      const seleccionAnterior = filtro.value

      filtro.replaceChildren(
        new Option('Todas las categorías', 'Todas'),
        ...categorias.map(c => new Option(c, c))
      )

      filtro.value = categorias.includes(seleccionAnterior)
        ? seleccionAnterior
        : 'Todas'
    }

    escribir('nav-count-vencer', String(filas.length))
    escribir('kpi-lotes-detalle', `${filas.length} lotes registrados`)

    renderProductos()

  } catch (error) {
    console.error('Error consultando productos:', error)
    aviso('No fue posible consultar los productos de la empresa.')
  }
}

// No permitir que el filtro vuelva a mostrar datos ficticios.
if (filtro) {
  filtro.removeAttribute('onchange')
  filtro.addEventListener('change', renderProductos)
}

// La versión original incluye datos ficticios de compostaje e ingresos.
// No deben presentarse como información registrada en Supabase.
function desactivarDatosFicticios() {
  escribir('kpi-ingresos', '—')
  escribir('kpi-lotes-circular', 'Pendiente')
  escribir('nav-count-circular', '—')

  const circular = document.getElementById('grid-ciclo-circular')
  if (circular) {
    circular.replaceChildren()

    const nota = document.createElement('div')
    nota.className =
      'col-span-full clean-card rounded-3xl p-8 text-center text-sm'
    nota.textContent =
      'El módulo de compostaje es una propuesta del MVP. ' +
      'Todavía no registra operaciones en Supabase.'

    circular.appendChild(nota)
  }

  document.querySelectorAll<HTMLButtonElement>(
    '#sec-ciclo-circular button[onclick*="openPublishModal"]'
  ).forEach(boton => {
    boton.disabled = true
    boton.textContent = 'Próximamente'
    boton.title = 'Módulo de compostaje pendiente de integración'
  })
}

document.addEventListener('empresa-conectada', () => {
  void cargarProductos()
})

for (const id of ['nav-por-vencer', 'mnav-por-vencer']) {
  document.getElementById(id)
    ?.addEventListener('click', () => void cargarProductos())
}

window.addEventListener('DOMContentLoaded', () => {
  desactivarDatosFicticios()
  void cargarProductos()
})
