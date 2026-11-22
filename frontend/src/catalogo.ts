import { supabase } from './lib/supabase'

async function cargarCategorias() {
  const barra = document.getElementById('category-bar')

  if (!barra) return

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name')

  if (error) {
    console.error('Error de Supabase:', error)
    barra.textContent = 'No se pudieron cargar las categorías'
    return
  }

  barra.replaceChildren()

  const opciones = [
    { id: '', name: 'Todas las categorías' },
    ...(data ?? [])
  ]

  for (const categoria of opciones) {
    const boton = document.createElement('button')
    boton.type = 'button'
    boton.textContent = categoria.name
    boton.className =
      'cat-chip px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap'

    boton.addEventListener('click', () => {
      barra.querySelectorAll('button').forEach(b => {
        b.classList.remove('u-ink-bg', 'text-white')
        b.classList.add('u-card-30', 'u-ink-30')
      })

      boton.classList.add('u-ink-bg', 'text-white')
      boton.classList.remove('u-card-30', 'u-ink-30')
    })

    if (!categoria.id) {
      boton.classList.add('u-ink-bg', 'text-white')
    } else {
      boton.classList.add('u-card-30', 'u-ink-30')
    }

    barra.appendChild(boton)
  }

  console.log('Categorías cargadas desde Supabase:', data?.length)
}

cargarCategorias()
