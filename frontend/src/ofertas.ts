import { reservarUnidad } from './reserva-compra'
import { supabase } from './lib/supabase'
import { iconoAlimento } from './lib/food-icon'

type Oferta = {
  id: string
  expiration_date: string
  original_price: number
  discounted_price: number
  quantity_on_hand: number
  quantity_reserved: number
  products: {
    name: string
    categories: { name: string } | null
    organizations: { name: string } | null
  } | null
}

let ofertas: Oferta[] = []
let categoriaActual = 'Todas las categorías'

const grid = document.getElementById('offers-grid')
const plantilla = document.getElementById(
  'product-card-template'
) as HTMLTemplateElement | null

function mostrarMensaje(texto: string) {
  if (!grid) return

  const mensaje = document.createElement('div')
  mensaje.className =
    'col-span-full clean-card rounded-3xl p-12 text-center u-ink-muted'
  mensaje.textContent = texto

  grid.replaceChildren(mensaje)
}

function mostrarOfertas() {
  if (!grid || !plantilla) return

  const filtradas = ofertas.filter(oferta => {
    const categoria = oferta.products?.categories?.name

    return (
      categoriaActual === 'Todas las categorías' ||
      categoria === categoriaActual
    )
  })

  if (filtradas.length === 0) {
    mostrarMensaje('No hay alimentos disponibles en esta categoría por ahora.')
    return
  }

  grid.replaceChildren()

  for (const oferta of filtradas) {
    const tarjeta = plantilla.content.firstElementChild?.cloneNode(
      true
    ) as HTMLElement | null

    if (!tarjeta) continue

    const llenar = (campo: string, valor: string) => {
      const elemento = tarjeta.querySelector(
        `[data-field="${campo}"]`
      )

      if (elemento) elemento.textContent = valor
    }

    const disponibles =
      oferta.quantity_on_hand - oferta.quantity_reserved

    const descuento = Math.round(
      (1 - oferta.discounted_price / oferta.original_price) * 100
    )

    llenar('discount', `-${descuento}%`)
    llenar('stock', `${disponibles} disponibles`)
    llenar('biz', oferta.products?.organizations?.name ?? 'Empresa')
    llenar('zone', 'Retiro presencial')
    llenar('title', oferta.products?.name ?? 'Alimento')
    llenar(
      'time',
      `Vencimiento: ${oferta.expiration_date.split('-').reverse().join('/')}`
    )
    llenar('oldPrice', `Bs. ${Number(oferta.original_price).toFixed(2)}`)
    llenar('newPrice', `Bs. ${Number(oferta.discounted_price).toFixed(2)}`)

    // Ícono representativo: no se inventan fotografías de productos reales.
    const imagen = tarjeta.querySelector('[data-field="img"]')

    if (imagen) {
      const marcador = document.createElement('div')
      marcador.className =
        'w-full h-full flex flex-col items-center justify-center gap-2 ' +
        'bg-gradient-to-br from-orange-50 via-amber-100 to-emerald-50'

      const icono = document.createElement('span')
      icono.className =
        'text-7xl drop-shadow-sm transition-transform duration-300 ' +
        'group-hover:scale-110'
      icono.textContent = iconoAlimento(
        oferta.products?.name ?? '',
        oferta.products?.categories?.name ?? ''
      )
      icono.setAttribute('role', 'img')
      icono.setAttribute(
        'aria-label',
        `Ícono de ${oferta.products?.name ?? 'alimento'}`
      )

      const nota = document.createElement('span')
      nota.className = 'text-[10px] font-semibold tracking-wide text-emerald-900/70'
      nota.textContent = 'Imagen ilustrativa'
      marcador.append(icono, nota)
      imagen.replaceWith(marcador)
    }

    const boton = tarjeta.querySelector<HTMLButtonElement>('button')

    if (boton) {
      boton.textContent = 'Reservar 1 unidad'

      boton.addEventListener('click', async () => {
        boton.disabled = true

        try {
          const creada = await reservarUnidad(
            oferta.id,
            Number(oferta.discounted_price)
          )

          if (creada) {
            await cargarOfertas()
          }
        } finally {
          boton.disabled = false
        }
      })
    }

    grid.appendChild(tarjeta)
  }
}

async function cargarOfertas() {
  mostrarMensaje('Cargando alimentos disponibles...')

  const { data, error } = await supabase
    .from('product_batches')
    .select(`
      id,
      expiration_date,
      original_price,
      discounted_price,
      quantity_on_hand,
      quantity_reserved,
      products!inner (
        name,
        categories (name),
        organizations (name)
      )
    `)
    .order('expiration_date', { ascending: true })
    .limit(60)

  if (error) {
    console.error('Error consultando ofertas:', error)
    mostrarMensaje('No se pudieron cargar los alimentos.')
    return
  }

  ofertas = (data ?? []) as unknown as Oferta[]
  mostrarOfertas()

  console.log('Ofertas disponibles desde Supabase:', ofertas.length)
}

document.getElementById('category-bar')?.addEventListener('click', event => {
  const boton = (event.target as HTMLElement).closest('button')

  if (!boton) return

  categoriaActual = boton.textContent?.trim() ?? 'Todas las categorías'
  mostrarOfertas()
})

void cargarOfertas()
