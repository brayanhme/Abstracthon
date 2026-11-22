import { supabase } from './lib/supabase'

export function solicitarAcceso(): Promise<boolean> {
  return new Promise(resolve => {
    const capa = document.createElement('div')

    capa.className =
      'fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/70 p-4'

    capa.innerHTML = `
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-slate-900">
        <h2 class="mb-2 text-2xl font-bold">Iniciar sesión</h2>
        <p class="mb-4 text-sm">
          Ingresa para reservar alimentos de ReAprovecha.
        </p>

        <form class="space-y-3">
          <input type="email" name="email" required
            placeholder="Correo electrónico"
            autocomplete="username"
            class="w-full rounded-lg border p-3">

          <input type="password" name="password" required
            placeholder="Contraseña"
            autocomplete="current-password"
            class="w-full rounded-lg border p-3">

          <p data-mensaje class="text-sm" role="status"></p>

          <button type="submit"
            class="w-full rounded-lg bg-orange-600 p-3 font-bold text-white">
            Ingresar
          </button>
        </form>

        <button type="button" data-cancelar
          class="mt-4 text-sm underline">
          Cancelar
        </button>
      </div>
    `

    const cerrar = (resultado: boolean) => {
      capa.remove()
      resolve(resultado)
    }

    capa.querySelector('[data-cancelar]')
      ?.addEventListener('click', () => cerrar(false))

    const formulario = capa.querySelector<HTMLFormElement>('form')!
    const mensaje = capa.querySelector<HTMLElement>('[data-mensaje]')!
    const boton = formulario.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    )!

    formulario.addEventListener('submit', async evento => {
      evento.preventDefault()
      boton.disabled = true
      mensaje.textContent = 'Comprobando credenciales...'

      const datos = new FormData(formulario)
      const email = String(datos.get('email') ?? '').trim()
      const password = String(datos.get('password') ?? '')

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        mensaje.textContent = 'Correo o contraseña incorrectos.'
        boton.disabled = false
        return
      }

      cerrar(true)
    })

    document.body.appendChild(capa)
  })
}

export async function reservarUnidad(
  batchId: string,
  precio: number
): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const autenticado = await solicitarAcceso()
    if (!autenticado) return false
  }

  const confirmar = window.confirm(
    `¿Reservar una unidad por Bs. ${precio.toFixed(2)}?\n` +
    'El pago se realizará presencialmente al retirar el producto.'
  )

  if (!confirmar) return false

  const { data, error } = await supabase.rpc('create_reservation', {
    p_batch_id: batchId,
    p_quantity: 1
  })

  if (error) {
    console.error('Error al reservar:', error)
    alert(
      'No se pudo completar la reserva. ' +
      'Comprueba que el alimento siga disponible.'
    )
    return false
  }

  alert(
    '¡Reserva registrada correctamente!\n' +
    `Código: ${data}\n` +
    'Pagarás presencialmente al retirar el alimento.'
  )

  return true
}
