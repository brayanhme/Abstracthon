import { supabase } from './lib/supabase'

let organizacionId: string | null = null

// Pantalla de acceso
const pantalla = document.createElement('div')
pantalla.className =
  'fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4'

pantalla.innerHTML = `
  <div class="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl text-slate-900">
    <h2 class="text-2xl font-bold mb-2">Acceso de empresas</h2>
    <p class="text-sm mb-5">Ingresa con tu cuenta empresarial.</p>

    <form id="login-empresa" class="space-y-3">
      <input id="email-empresa" type="email" required
        placeholder="Correo de la empresa"
        autocomplete="username"
        class="w-full rounded-lg border p-3" />

      <input id="clave-empresa" type="password" required
        placeholder="Contraseña"
        autocomplete="current-password"
        class="w-full rounded-lg border p-3" />

      <button type="submit"
        class="w-full rounded-lg bg-orange-600 p-3 text-white font-bold">
        Ingresar
      </button>
    </form>

    <p id="mensaje-empresa" class="mt-3 text-sm" role="status"></p>
    <button id="cambiar-empresa" type="button"
      class="mt-4 text-sm underline">Cambiar cuenta</button>
    <a href="/" class="block mt-3 text-sm underline">Volver al comprador</a>
  </div>`

document.body.appendChild(pantalla)

function mensaje(texto: string) {
  const elemento = document.getElementById('mensaje-empresa')
  if (elemento) elemento.textContent = texto
}

async function validarAcceso() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    mensaje('Inicia sesión para acceder al panel.')
    return
  }

  const { data: membresias, error: errorMiembros } = await supabase
    .from('organization_members')
    .select('organization_id, member_role')
    .eq('user_id', user.id)

  if (errorMiembros) {
    mensaje(`Error de membresía: ${errorMiembros.message}`)
    return
  }

  const miembros = (membresias ?? []) as {
    organization_id: string
    member_role: string
  }[]

  const ids = miembros
    .filter(m => m.member_role === 'owner' || m.member_role === 'staff')
    .map(m => m.organization_id)

  if (!ids.length) {
    mensaje('Esta cuenta no pertenece a una empresa.')
    return
  }

  const { data: empresas, error: errorEmpresas } = await supabase
    .from('organizations')
    .select('id, name, status')
    .in('id', ids)

  if (errorEmpresas) {
    mensaje(`Error al consultar empresas: ${errorEmpresas.message}`)
    return
  }

  const lista = (empresas ?? []) as {
    id: string
    name: string
    status: string
  }[]

  const empresa = lista.find(e => e.status === 'active')

  if (!empresa) {
    mensaje('Tu empresa todavía no está activa o aprobada.')
    return
  }

  const { data: categorias, error: errorCategorias } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  if (errorCategorias) {
    mensaje(`Error al cargar categorías: ${errorCategorias.message}`)
    return
  }

  organizacionId = empresa.id

  const nombre = document.getElementById('header-company-name')
  if (nombre) nombre.textContent = empresa.name

  const bienvenida = document.getElementById('welcome-company-badge')
  if (bienvenida) {
    bienvenida.textContent = `Panel empresarial • ${empresa.name}`
  }

  const selector = document.querySelector<HTMLSelectElement>('#prod-category')
  if (selector) {
    const listaCategorias = (categorias ?? []) as {
      id: string
      name: string
    }[]

    selector.replaceChildren(
      ...listaCategorias.map(c => new Option(c.name, c.id))
    )
  }

  const stock = document.querySelector<HTMLInputElement>('#prod-stock')
  if (stock) {
    stock.type = 'number'
    stock.min = '1'
    stock.step = '1'
    stock.placeholder = 'Ej. 10 unidades'
    stock.value = ''
  }

  // El selector original muestra empresas ficticias.
  const cambiar = document.querySelector<HTMLButtonElement>(
    '[onclick="openCompanyModal()"]'
  )
  if (cambiar) cambiar.disabled = true

  pantalla.remove()
  document.dispatchEvent(new Event('empresa-conectada'))

  const aviso = document.createElement('div')
  aviso.className = 'bg-amber-100 text-amber-950 text-center text-xs p-2'
  aviso.textContent =
    'Modo MVP: las tarjetas y contadores iniciales son demostrativos. ' +
    'Las publicaciones nuevas sí se guardan en Supabase. ' +
    'Fotos, direcciones, horas y recuperación todavía no se almacenan.'
  document.body.prepend(aviso)
}

// Inicio de sesión empresarial
document.getElementById('login-empresa')?.addEventListener('submit', async evento => {
  evento.preventDefault()

  const email = (
    document.getElementById('email-empresa') as HTMLInputElement
  ).value.trim()

  const password = (
    document.getElementById('clave-empresa') as HTMLInputElement
  ).value

  mensaje('Comprobando acceso...')

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    mensaje('No se pudo iniciar sesión. Revisa correo y contraseña.')
    return
  }

  await validarAcceso()
})

document.getElementById('cambiar-empresa')?.addEventListener('click', async () => {
  await supabase.auth.signOut()
  mensaje('Sesión cerrada. Ingresa con otra cuenta.')
})

// Publicación real: reemplaza la operación ficticia
document.getElementById('publish-form')?.addEventListener('submit', async evento => {
  evento.preventDefault()
  evento.stopImmediatePropagation()

  if (!organizacionId) return

  const modo = document.querySelector<HTMLInputElement>(
    'input[name="lote-status"]:checked'
  )?.value

  if (modo !== 'por-vencer') {
    alert('La publicación de productos vencidos para recuperación aún no está conectada.')
    return
  }

  const valor = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value.trim()

  const nombre = valor('prod-name')
  const categoria = valor('prod-category')
  const fecha = valor('prod-expiry-date')
  const cantidad = Number(valor('prod-stock'))
  const original = Number(valor('prod-orig-price'))
  const reducido = Number(valor('prod-rescue-price'))

  if (
    !nombre || !categoria || !fecha ||
    !Number.isInteger(cantidad) || cantidad <= 0 ||
    !Number.isFinite(original) || !Number.isFinite(reducido) ||
    original <= 0 || reducido <= 0 || reducido >= original
  ) {
    alert('Comprueba nombre, categoría, cantidad, vencimiento y precios.')
    return
  }

  const boton = document.querySelector<HTMLButtonElement>('#btn-submit-lote')
  if (boton) boton.disabled = true

  try {
    const { error } = await supabase.rpc('publish_product', {
      p_organization_id: organizacionId,
      p_category_id: categoria,
      p_name: nombre,
      p_expiration_date: fecha,
      p_original_price: original,
      p_discounted_price: reducido,
      p_quantity: cantidad
    })

    if (error) throw error

    alert('¡Producto registrado en Supabase! Abriremos el catálogo del comprador.')
    window.location.assign('/')

  } catch (error) {
    const detalle = error instanceof Error ? error.message : 'Error desconocido'
    alert(`No se pudo publicar: ${detalle}`)
  } finally {
    if (boton) boton.disabled = false
  }
}, true)

void validarAcceso()
