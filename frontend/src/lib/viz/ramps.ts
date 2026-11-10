/**
 * Los colores del dato, con nombre. TODOS son tokens (`var(--…)`) que
 * voltean con el tema; ninguno es un hex.
 *
 * ── POR QUÉ NO HAY HEX AQUÍ ────────────────────────────────────────────────
 *
 * La versión anterior exportaba las escalas oficiales como arreglos de hex
 * (`VIOLET[1]`, `TURQUOISE[0]`) y las gráficas pintaban con ellos. Eso es
 * exactamente lo que rompió el tema oscuro: un hex no se entera del tema, así
 * que el violeta 80 que se leía perfecto sobre blanco desaparecía sobre fondo
 * hondo, y para compensar se metían blancos fijos. Se cazó en la revisión del
 * curso (2026-09): "el modo oscuro parece construido con las patas".
 *
 * Ahora una gráfica pide un color POR SU USO —la tinta de marca, la serie
 * única, el estímulo A, el peldaño 3 de la rampa— y el catálogo (globals.css,
 * y su versión visual en documentacion/marca/catalogo-de-colores.html)
 * decide qué paso oficial es en cada tema.
 *
 * ── LAS TRES REGLAS ────────────────────────────────────────────────────────
 *
 * 1. El morado manda: Violet es el protagonista.
 * 2. Turquesa, púrpura y limón son acentos, nunca una serie larga ni un fondo.
 * 3. El polo negativo va en MORADO, no en rojo. El rojo se reserva para un
 *    error real de interfaz: un dato bajo no es una falla.
 */

// ── Tinta y acentos de marca ────────────────────────────────────────────────

/** El violeta profundo que hace de texto o trazo de marca sobre papel. */
export const TINTA_MARCA = "var(--tinta-marca)";
/** UNA serie de marca: una sola barra, un solo aro, una sola línea. */
export const MARCA = "var(--marca)";
/**
 * Lo que se DESTACA (la marca del estudio en un ranking, la tarjeta elegida),
 * como trazo o como texto: el morado claro de la casa, que voltea con el tema.
 * Es el destacado por omisión de toda forma; el turquesa casi no se usa.
 */
export const ACENTO = "var(--acento)";
/** El acento turquesa, como TEXTO o trazo fino (voltea al paso 80 en oscuro). */
export const TURQUESA_INK = "var(--turquoise-ink)";
/** El acento turquesa, como RELLENO. Es el mismo en los dos temas. */
export const TURQUESA = "var(--color-turquoise)";
/** El limón, como relleno y como texto. */
export const LIMON = "var(--color-lemon)";
export const LIMON_INK = "var(--lemon-ink)";
/** Lo que va encima de un relleno de marca: blanco en los dos temas. */
export const SOBRE_RELLENO = "var(--color-sobre-relleno)";

// ── Papel y neutrales de una gráfica ────────────────────────────────────────

/** La caja donde vive la gráfica. */
export const PAPEL = "var(--papel)";
/** El carril VACÍO detrás de una barra: es lo que dibuja el 100%. */
export const PISTA = "var(--pista)";
/** La pista de una segunda serie, o el carril de referencia. */
export const PISTA_2 = "var(--pista-2)";
export const BORDE = "var(--border)";
export const REJILLA = "var(--grid)";
export const TINTA = "var(--ink)";
export const TINTA_2 = "var(--ink-2)";
/** Lo que se atenúa: gris en los dos temas, nunca el paso de la marca. */
export const ATENUADO = "var(--atenuado)";

// ── Los dos estímulos de una comparación ────────────────────────────────────

/**
 * Dos empaques, dos conceptos, dos campañas. El color SIGUE AL ESTÍMULO en
 * todo el reporte: si el primero es violeta en la lámina 9, es violeta en la
 * 14. Un color que cambia de dueño entre láminas obliga al lector a releer la
 * leyenda cada vez.
 */
export const ESTIMULOS_2 = ["var(--estimulo-a)", "var(--estimulo-b)"] as const;
/** Género, u otro corte nominal de dos. */
export const CATEGORICAL_2 = ESTIMULOS_2;

// ── Categórica: lo que NO tiene orden ───────────────────────────────────────

/**
 * Grupos de atributos, bloques, marcas. Hasta cinco: más de cinco es señal de
 * que la gráfica está mal elegida (ver 05). Ninguna es semántica: un grupo no
 * es bueno ni malo. Toda paleta categórica lleva codificación secundaria
 * (punto de leyenda y etiqueta directa): el color no es el único portador.
 */
export const CATEGORICA = [
  "var(--cat-1)",
  "var(--cat-2)",
  "var(--cat-3)",
  "var(--cat-4)",
  "var(--cat-5)",
] as const;

/** La rampa categórica del número de pasos que pidas (máximo 5). */
export function categorica(pasos: number): string[] {
  if (pasos > CATEGORICA.length) {
    throw new Error(
      `Una categórica de ${pasos} pasos no existe: el catálogo llega a ${CATEGORICA.length}. ` +
        "Con más categorías la gráfica está mal elegida (ver 05).",
    );
  }
  return CATEGORICA.slice(0, pasos);
}

// ── Ordinal: lo que SÍ tiene orden ──────────────────────────────────────────

/**
 * Edad, NSE, frecuencia. Un solo matiz de más a menos. DECLARADO: el índice 0
 * es SIEMPRE el extremo alto (el más frecuente, el nivel más alto). Ya salió
 * una invertida una vez.
 *
 * En claro es la escala Violet; en oscuro, la Purple. Cinco pasos útiles. El
 * sexto peldaño va en neutro, fuera de rampa.
 */
export const ORDINAL_3 = ["var(--ordinal-2)", "var(--ordinal-3)", "var(--ordinal-4)"] as const;
export const ORDINAL_4 = ["var(--ordinal-1)", "var(--ordinal-2)", "var(--ordinal-3)", "var(--ordinal-4)"] as const;
export const ORDINAL_5 = [
  "var(--ordinal-1)",
  "var(--ordinal-2)",
  "var(--ordinal-3)",
  "var(--ordinal-4)",
  "var(--ordinal-5)",
] as const;
export const ORDINAL_6 = [...ORDINAL_5, "var(--ordinal-6)"] as const;

/** La escala hermana, para la SEGUNDA serie de una apilada. */
export const ORDINAL_PURPLE_4 = [
  "var(--ordinal-p-1)",
  "var(--ordinal-p-2)",
  "var(--ordinal-p-3)",
  "var(--ordinal-p-4)",
] as const;

/**
 * La tinta que va ENCIMA de cada peldaño, por posición. No se calcula por
 * luminancia: los peldaños son `var()` y JavaScript no ve su valor. Se
 * declara junto al peldaño, en globals.css.
 */
export const SOBRE_ORDINAL = [
  "var(--sobre-ordinal-1)",
  "var(--sobre-ordinal-2)",
  "var(--sobre-ordinal-3)",
  "var(--sobre-ordinal-4)",
  "var(--sobre-ordinal-5)",
  "var(--sobre-ordinal-6)",
] as const;
export const SOBRE_ORDINAL_PURPLE = [
  "var(--sobre-ordinal-p-1)",
  "var(--sobre-ordinal-p-2)",
  "var(--sobre-ordinal-p-3)",
  "var(--sobre-ordinal-p-4)",
] as const;

/** Nombres por uso: un corte demográfico pide SU rampa, no elige una. */
export const ORDINAL_SECONDARY_3 = ORDINAL_3;
export const ORDINAL_PRIMARY_5 = ORDINAL_5;
export const REGION_RAMP = ORDINAL_6;

// ── Polaridad ────────────────────────────────────────────────────────────────

/**
 * Lo que sube va en verde; lo que baja va en MORADO. Cada polo trae su
 * versión de relleno (barra, chip) y su versión de tinta (texto).
 */
export const POLARIDAD = {
  positivo: "var(--color-positivo)",
  positivoTexto: "var(--positivo-ink)",
  negativo: "var(--color-negativo)",
  negativoTexto: "var(--negativo-ink)",
} as const;

/** Rampas de polaridad para listas ordenadas de conceptos, de más a menos. */
export const RAMPA_POSITIVA = [
  "var(--color-green-100)",
  "var(--color-green-80)",
  "var(--color-green-60)",
  "var(--color-green-40)",
] as const;
export const RAMPA_NEGATIVA = [
  "var(--color-purple-100)",
  "var(--color-purple-80)",
  "var(--color-purple-60)",
  "var(--color-purple-40)",
] as const;

/** Advertencia, alerta y error de sistema. Relleno y tinta. */
export const ESTADO = {
  advertencia: "var(--color-advertencia)",
  advertenciaTexto: "var(--advertencia-ink)",
  alerta: "var(--color-alerta)",
  alertaTexto: "var(--alerta-ink)",
  error: "var(--color-error)",
  errorTexto: "var(--error-ink)",
} as const;

// ── Bandas de desempeño ─────────────────────────────────────────────────────

/**
 * Seis bandas, de la más alta a la más baja. `chip` es el color de fondo del
 * chip (texto blanco encima, en los dos temas); `texto` es la tinta cuando la
 * banda se escribe como cifra. Con cuatro bandas se usan 1, 2, 4 y 6.
 */
export const BANDAS = [
  { chip: "var(--color-banda-1)", texto: "var(--banda-1-ink)" },
  { chip: "var(--color-banda-2)", texto: "var(--banda-2-ink)" },
  { chip: "var(--color-banda-3)", texto: "var(--banda-3-ink)" },
  { chip: "var(--color-banda-4)", texto: "var(--banda-4-ink)" },
  { chip: "var(--color-banda-5)", texto: "var(--banda-5-ink)" },
  { chip: "var(--color-banda-6)", texto: "var(--banda-6-ink)" },
] as const;

/**
 * Qué pasos de `BANDAS` usa un puntaje de N bandas, de la más alta a la más
 * baja: los dos extremos siempre, y en medio la regla del catálogo (tres:
 * 1, 4 y 6; cuatro: 1, 2, 4 y 6). Tomarlas por posición dejaba a la banda más
 * baja de un puntaje de cuatro en violeta, no en el extremo.
 */
const PASOS_DE_BANDAS: Record<number, number[]> = {
  1: [0],
  2: [0, 5],
  3: [0, 3, 5],
  4: [0, 1, 3, 5],
  5: [0, 1, 3, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
};
export function bandasPara(n: number): (typeof BANDAS)[number][] {
  const pasos = PASOS_DE_BANDAS[n];
  if (!pasos) {
    throw new Error(`Un puntaje de ${n} bandas no existe en el catálogo: llega a seis.`);
  }
  return pasos.map((p) => BANDAS[p]);
}

// ── Sobre láminas de COLOR (primary, secondary, marino, ink) ────────────────
// Las rampas de arriba asumen papel. Sobre una lámina morada, una rampa morada
// desaparece contra el fondo: ahí entra el turquesa, que es exactamente el uso
// que la guía le da (acento vivo sobre superficie de marca). Estos son pasos
// fijos a propósito: la lámina de color no cambia con el tema.
//
// CUIDADO CON EL PAPEL. Esto es para lo que se pinta DIRECTO sobre el fondo de
// color. Si la gráfica vive en tarjetas de papel (`--papel`), aunque la lámina
// sea marino, sus colores son los de papel: un turquesa claro sobre una tarjeta
// blanca se lava. Ya pasó con un duelo puesto sobre marino.

const SOBRE_OSCURO_5 = [
  "var(--color-turquoise-10)",
  "var(--color-turquoise-20)",
  "var(--color-turquoise-40)",
  "var(--color-turquoise-60)",
  "var(--color-turquoise-80)",
];

/** La rampa para gráficas que van sobre una lámina de color. */
export function rampaSobreOscuro(pasos: number): string[] {
  if (pasos <= 1) return [SOBRE_OSCURO_5[2]];
  if (pasos === 2) return [SOBRE_OSCURO_5[1], SOBRE_OSCURO_5[4]];
  if (pasos === 3) return [SOBRE_OSCURO_5[1], SOBRE_OSCURO_5[2], SOBRE_OSCURO_5[4]];
  return SOBRE_OSCURO_5.slice(0, pasos);
}

/** Un corte de dos sobre lámina de color: turquesa y limón, los dos claros. */
export const SOBRE_OSCURO_2 = ["var(--color-turquoise-40)", "var(--color-lemon-60)"] as const;
/** Texto secundario sobre lámina de color. */
export const SOBRE_OSCURO_TEXTO = "var(--color-violet-20)";
