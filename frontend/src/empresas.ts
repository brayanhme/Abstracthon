import { supabase } from './lib/supabase'

type Empresa = {
  id: string
  name: string
  organization_type: string
  description: string | null
  address: string | null
}

type OfertaEmpresa = {
  id: string
  products: { organization_id: string } | null
}

const grid = document.getElementById('companies-grid')
const plantilla = document.getElementById(
  'company-card-template'
) as HTMLTemplateElement | null

const buscador = document.querySelector<HTMLInputElement>(
  '#sec-empresas input[type="text"]'
)

const gridOfertas = document.getElementById('offers-grid')

let empresas: Empresa[] = []
let conteos = new Map<string, number>()
let empresaSeleccionada: Empresa | null = null

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function mostrarMensaje(texto: string) {
  if (!grid) return

  const aviso = document.createElement('div')
  aviso.className =
    'col-span-full clean-card rounded-3xl p-10 text-center text-sm u-ink-muted'

  aviso.textContent = texto
  grid.replaceChildren(aviso)
}

function filtrarOfertasDeEmpresa() {
  if (!gridOfertas) return

  let visibles = 0

  const tarjetas = gridOfertas.querySelectorAll<HTMLElement>(
    ':scope > article'
  )

  for (const tarjeta of tarjetas) {
    const nombre = tarjeta.querySelector<HTMLElement>(
      '[data-field="biz"]'
    )?.textContent ?? ''

    const mostrar =
      !empresaSeleccionada ||
      normalizar(nombre) === normalizar(empresaSeleccionada.name)

    tarjeta.style.display = mostrar ? '' : 'none'

    if (mostrar) visibles++
  }

  let aviso = document.getElementById('empresa-sin-ofertas')

  if (!aviso && gridOfertas.parentElement) {
    aviso = document.createElement('div')
    aviso.id = 'empresa-sin-ofertas'
    aviso.className =
      'clean-card rounded-2xl p-7 text-center text-sm u-ink-muted'
    gridOfertas.parentElement.appendChild(aviso)
  }

  if (aviso) {
    aviso.textContent = empresaSeleccionada
      ? `No hay ofertas visibles de ${empresaSeleccionada.name} en el catálogo actual.`
      : ''

    aviso.style.display =
      empresaSeleccionada && tarjetas.length > 0 && visibles === 0
        ? ''
        : 'none'
  }
}

function actualizarFiltroVisual() {
  const ofertas = document.getElementById('offers-grid')
  if (!ofertas?.parentElement) return

  let barra = document.getElementById('empresa-filtro-activo')

  if (!empresaSeleccionada) {
    barra?.remove()
    filtrarOfertasDeEmpresa()
    return
  }

  if (!barra) {
    barra = document.createElement('div')
    barra.id = 'empresa-filtro-activo'
    barra.className =
      'flex flex-wrap items-center gap-3 rounded-2xl border u-border bg-white p-4'

    ofertas.parentElement.insertBefore(barra, ofertas)
  }

  barra.replaceChildren()

  const etiqueta = document.createElement('span')
  etiqueta.className = 'text-sm font-semibold u-ink-30'
  etiqueta.textContent =
    `Mostrando ofertas de: ${empresaSeleccionada.name}`

  const limpiar = document.createElement('button')
  limpiar.type = 'button'
  limpiar.className =
    'px-4 py-2 rounded-full u-accent-10 text-white text-xs font-bold'
  limpiar.textContent = 'Ver todas las empresas ×'

  limpiar.addEventListener('click', () => {
    empresaSeleccionada = null
    actualizarFiltroVisual()
  })

  barra.append(etiqueta, limpiar)

  filtrarOfertasDeEmpresa()
}

function abrirProductos(empresa: Empresa) {
  // Utiliza la navegación ya implementada del comprador.
  const explorar = document.getElementById('nav-explorar')
    ?? document.getElementById('mnav-explorar')

  explorar?.click()

  empresaSeleccionada = empresa
  actualizarFiltroVisual()

  document.getElementById('sec-explorar')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

function dibujarEmpresas() {
  if (!grid || !plantilla) return

  const busqueda = normalizar(buscador?.value ?? '')

  const resultados = empresas.filter(empresa =>
    normalizar(
      `${empresa.name} ${empresa.address ?? ''} ${empresa.description ?? ''}`
    ).includes(busqueda)
  )

  grid.replaceChildren()

  if (!resultados.length) {
    mostrarMensaje(
      busqueda
        ? 'No encontramos empresas con esa búsqueda.'
        : 'Todavía no hay empresas activas registradas.'
    )
    return
  }

  for (const empresa of resultados) {
    const tarjeta = plantilla.content.firstElementChild
      ?.cloneNode(true) as HTMLElement | undefined

    if (!tarjeta) continue

    const colocar = (campo: string, valor: string) => {
      const nodo = tarjeta.querySelector<HTMLElement>(
        `[data-field="${campo}"]`
      )
      if (nodo) nodo.textContent = valor
    }

    const esProductor =
      empresa.organization_type === 'agricultural_producer'

    colocar('logo', esProductor ? '🌱' : '🏪')
    colocar(
      'category',
      esProductor ? 'Productor · DEMO' : 'Comercio · DEMO'
    )
    colocar('name', empresa.name)
    colocar(
      'description',
      empresa.description ??
        'Negocio de demostración de ReAprovecha Cochabamba.'
    )

    const direccion = tarjeta.querySelector<HTMLElement>(
      '[data-field="address"] span'
    )

    if (direccion) {
      direccion.textContent =
        empresa.address ?? 'Cochabamba · Ubicación no registrada'
    }

    const cantidad = conteos.get(empresa.id) ?? 0

    colocar(
      'offersCount',
      `${cantidad} ${cantidad === 1 ? 'oferta disponible' : 'ofertas disponibles'}`
    )

    // Transformar el enlace visual en un botón funcional.
    const contador = tarjeta.querySelector('[data-field="offersCount"]')
    const enlaceOriginal = contador?.nextElementSibling

    const boton = document.createElement('button')
    boton.type = 'button'
    boton.className =
      'font-semibold u-accent-text flex items-center gap-1 hover:underline'
    boton.textContent = 'Ver productos →'
    boton.setAttribute(
      'aria-label',
      `Ver productos de ${empresa.name}`
    )

    boton.addEventListener('click', () => abrirProductos(empresa))

    enlaceOriginal?.replaceWith(boton)

    grid.appendChild(tarjeta)
  }
}

async function cargarEmpresas() {
  if (!grid) return

  mostrarMensaje('Cargando empresas de Cochabamba...')

  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, organization_type, description, address')
      .eq('status', 'active')
      .in('organization_type', [
        'food_business',
        'agricultural_producer'
      ])
      .order('name')
      .limit(100)

    if (error) throw error

    empresas = (data ?? []) as Empresa[]

    // Contamos únicamente los lotes visibles en el catálogo público.
    const hoy = new Date().toLocaleDateString('sv-SE', {
      timeZone: 'America/La_Paz'
    })

    const { data: lotes, error: errorLotes } = await supabase
      .from('product_batches')
      .select('id, products!inner(organization_id)')
      .eq('status', 'available')
      .gte('expiration_date', hoy)
      .limit(1000)

    if (errorLotes) throw errorLotes

    conteos = new Map()

    for (const lote of (lotes ?? []) as unknown as OfertaEmpresa[]) {
      const id = lote.products?.organization_id
      if (!id) continue

      conteos.set(id, (conteos.get(id) ?? 0) + 1)
    }

    dibujarEmpresas()
  } catch (error) {
    console.error('Error cargando empresas:', error)
    mostrarMensaje(
      'No fue posible cargar las empresas. Actualiza la página.'
    )
  }
}

buscador?.addEventListener('input', dibujarEmpresas)

// Reaplicar el filtro cuando el catálogo se actualiza,
// por ejemplo al cambiar de categoría.
if (gridOfertas) {
  const observador = new MutationObserver(() => {
    filtrarOfertasDeEmpresa()
  })

  observador.observe(gridOfertas, {
    childList: true
  })
}

void cargarEmpresas()
