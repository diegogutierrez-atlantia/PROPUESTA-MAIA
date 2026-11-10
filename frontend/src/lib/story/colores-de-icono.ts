/**
 * Los fondos de los círculos con ícono: tres degradados de la marca, que se
 * alternan por posición.
 *
 * Dos decisiones:
 *
 * 1. SON LOS DEGRADADOS OFICIALES DE ATLANTIA (en diagonal, 135°): el insignia
 *    (Violet a Purple), el Turquoise (Turquoise a Violet) y una variante en
 *    Purple. El turquesa entra con su paso 100, el que aguanta un ícono blanco
 *    encima; el paso 80 se lava.
 *
 * 2. SE ALTERNAN PARA QUE UNA FILA DE CÍRCULOS NO SE LEA COMO LA MISMA COSA
 *    REPETIDA. El color no significa nada (es decoración); por eso va por
 *    posición y no por tema.
 *
 * Son rellenos de marca: no voltean con el tema y llevan siempre el ícono en
 * blanco, así que el círculo se declara `data-superficie="honda"`.
 */
const DEGRADADOS = [
  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
  "linear-gradient(135deg, var(--color-turquoise-100), var(--color-primary))",
  "linear-gradient(135deg, var(--color-secondary), var(--color-purple-100))",
] as const;

/**
 * El verde de la marca (escala Lemon, del paso hondo al vivo), para el círculo
 * que se quiere destacar fuera del ciclo. Lleva el ícono en blanco: el paso 100
 * es el que aguanta la letra clara.
 */
export const ESTILO_DE_ICONO_VERDE = {
  backgroundImage: "linear-gradient(135deg, var(--color-lemon-100), var(--color-lemon))",
  color: "var(--color-sobre-relleno)",
} as const;

/** El estilo del círculo número `i` (desde 0). */
export function estiloDeIcono(i: number) {
  return {
    backgroundImage: DEGRADADOS[i % DEGRADADOS.length],
    color: "var(--color-sobre-relleno)",
  } as const;
}
