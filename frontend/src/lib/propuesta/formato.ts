/**
 * Cómo se escriben las cifras de una propuesta.
 *
 * Los montos llegan como números (los da el vendedor) y se formatean al
 * pintar: separador de miles, sin redondear. Si el vendedor dio centavos
 * ($32,355.88), se respetan; si no, no se inventan ".00".
 */
const MILES = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const CON_CENTAVOS = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Con centavos, siempre los dos: "$1,000.5" se lee como un error. */
export function dinero(monto: number) {
  return `$${Number.isInteger(monto) ? MILES.format(monto) : CON_CENTAVOS.format(monto)}`;
}

export function numero(n: number) {
  return MILES.format(n);
}

/** Un porcentaje 0 a 1, sin decimales: 0.18 → "18%". */
export function porcentaje(p: number) {
  return `${Math.round(p * 100)}%`;
}

/** Suma montos sin arrastrar el error de los decimales de coma flotante. */
export function sumar(montos: number[]) {
  return Math.round(montos.reduce((s, m) => s + m, 0) * 100) / 100;
}
