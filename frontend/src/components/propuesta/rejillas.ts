/**
 * Las rejillas por número de columnas, escritas COMPLETAS.
 *
 * Tailwind sólo genera las clases que encuentra escritas tal cual en el
 * código: `lg:grid-cols-${n}` armada al vuelo no existe en el CSS y la rejilla
 * se cae a una columna sin avisar. Por eso cada una va escrita aquí, y una
 * lámina pide la suya por número.
 */
const LG: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const SM: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

const FILAS_LG: Record<number, string> = {
  1: "lg:grid-rows-1",
  2: "lg:grid-rows-2",
  3: "lg:grid-rows-3",
  4: "lg:grid-rows-4",
  5: "lg:grid-rows-5",
  6: "lg:grid-rows-6",
};

/** Columnas iguales con un separador ("+") entre una y otra. */
const CON_SEPARADOR_LG: Record<number, string> = {
  2: "lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
  3: "lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]",
  4: "lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]",
};

export const columnasLg = (n: number) => LG[Math.min(Math.max(n, 1), 4)];
export const columnasSm = (n: number) => SM[Math.min(Math.max(n, 1), 3)];
export const filasLg = (n: number) => FILAS_LG[Math.min(Math.max(n, 1), 6)];
export const columnasConSeparadorLg = (n: number) => CON_SEPARADOR_LG[Math.min(Math.max(n, 2), 4)];
