/** Iconografía ilustrativa para productos sin fotografías. */
export function iconoAlimento(nombre: string, categoria = ''): string {
  const texto = `${nombre} ${categoria}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  // Dar preferencia al alimento concreto sobre su categoría.
  const reglas: Array<[RegExp, string]> = [
    [/canasta|surtido|mixt[ao]/, '🥗'],
    [/manzana/, '🍎'],
    [/platano|banana|banano/, '🍌'],
    [/mandarina|naranja/, '🍊'],
    [/papaya|melon/, '🍈'],
    [/durazno|melocoton/, '🍑'],
    [/papa|patata/, '🥔'],
    [/tomate/, '🍅'],
    [/zanahoria/, '🥕'],
    [/cebolla/, '🧅'],
    [/choclo|maiz/, '🌽'],
    [/zapallo|calabaza/, '🎃'],
    [/acelga|lechuga|espinaca|verdura|hortaliza/, '🥬'],
    [/queso/, '🧀'],
    [/leche|yogur|yogurt|lacteo/, '🥛'],
    [/huevo/, '🥚'],
    [/empanada|saltena/, '🥟'],
    [/galleta/, '🍪'],
    [/pan|marraqueta|batalla|baguette/, '🥖'],
    [/jugo|nectar|bebida/, '🧃'],
    [/fruta/, '🍎'],
    [/arroz/, '🍚'],
    [/miel/, '🍯'],
    [/carne/, '🥩'],
  ]

  for (const [patron, icono] of reglas) {
    if (patron.test(texto)) return icono
  }

  return '🛒'
}
