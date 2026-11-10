import type { ActividadDelCronograma, Cronograma } from "@/lib/propuesta/tipos";

/**
 * Los cronogramas de la casa, para no escribirlos día por día.
 *
 * ── DE DÓNDE SALEN ─────────────────────────────────────────────────────────
 *
 * De las primeras propuestas armadas con la casa (2026-10): el
 * arranque y la preparación son iguales en todas; lo que cambia de un estudio
 * a otro es cuánto dura el campo (y, en cuali, el reclutamiento y el
 * análisis). Así que la plantilla recibe esas duraciones y coloca lo demás.
 *
 * ── LAS DURACIONES LAS DA EL VENDEDOR ──────────────────────────────────────
 *
 * En DÍAS HÁBILES (cinco por semana): seis semanas de levantamiento son 30.
 * Si el vendedor da otra cosa que una duración ("el campo arranca el día 4"),
 * no se fuerza la plantilla: el cronograma se escribe a mano en la propuesta,
 * actividad por actividad, con el mismo formato.
 *
 * Los días van del 1 en adelante y `hasta` es inclusivo: una actividad de un
 * solo día tiene desde = hasta. Media semana son 2.5 días.
 */

/** Las cinco actividades con que arranca todo estudio con cuestionario (días 1 a 5). */
function arranqueConCuestionario(): ActividadDelCronograma[] {
  return [
    { nombre: "Go de proyecto", desde: 1, hasta: 1, fase: "arranque" },
    { nombre: "Kick Off con cliente", desde: 1, hasta: 1, fase: "arranque" },
    { nombre: "Envío de materiales (conceptos)", desde: 2, hasta: 2, fase: "preparacion" },
    { nombre: "Diseño de cuestionario", desde: 3, hasta: 4, fase: "preparacion" },
    { nombre: "Revisión de cuestionario", desde: 5, hasta: 5, fase: "preparacion" },
  ];
}

/** El cierre de todo estudio: validar y procesar un día, el dashboard dos, y se entrega el último. */
function cierreDespuesDe(ultimoDia: number): ActividadDelCronograma[] {
  return [
    { nombre: "Validación de información", desde: ultimoDia + 1, hasta: ultimoDia + 1, fase: "analisis" },
    { nombre: "Procesamiento de BDD", desde: ultimoDia + 1, hasta: ultimoDia + 1, fase: "analisis" },
    { nombre: "Generación de Dashboard", desde: ultimoDia + 1, hasta: ultimoDia + 2, fase: "dashboard" },
    { nombre: "Entrega de Dashboard", desde: ultimoDia + 2, hasta: ultimoDia + 2, fase: "entrega" },
  ];
}

/**
 * Un estudio cuantitativo: arranque, cuestionario, programación (3 días),
 * levantamiento y cierre.
 */
export function cronogramaCuantitativo({
  nombre = "Cuantitativo",
  diasDeLevantamiento,
}: {
  nombre?: string;
  /** Días hábiles de campo: seis semanas son 30. */
  diasDeLevantamiento: number;
}): Cronograma {
  const finDeCampo = 8 + diasDeLevantamiento;
  return {
    nombre,
    actividades: [
      ...arranqueConCuestionario(),
      { nombre: "Programación del cuestionario", desde: 6, hasta: 8, fase: "preparacion" },
      { nombre: "Levantamiento", desde: 9, hasta: finDeCampo, fase: "campo" },
      ...cierreDespuesDe(finDeCampo),
    ],
  };
}

/**
 * Un estudio cualitativo: arranque, filtros y guía, reclutamiento (con la
 * revisión de perfiles en sus últimos tres días), campo, análisis y cierre.
 */
export function cronogramaCualitativo({
  nombre = "Cualitativo",
  diasDeReclutamiento,
  diasDeCampo,
  diasDeAnalisis,
  nombreDelCampo = "Entrevistas / Moderación",
}: {
  nombre?: string;
  diasDeReclutamiento: number;
  diasDeCampo: number;
  diasDeAnalisis: number;
  /** "Entrevistas / Moderación", "Tríadas", "Sesiones de grupo". */
  nombreDelCampo?: string;
}): Cronograma {
  const finDeReclutamiento = 4 + diasDeReclutamiento;
  const finDeCampo = finDeReclutamiento + diasDeCampo;
  const finDeAnalisis = finDeCampo + diasDeAnalisis;
  return {
    nombre,
    actividades: [
      { nombre: "Go de proyecto", desde: 1, hasta: 1, fase: "arranque" },
      { nombre: "Kick Off con cliente", desde: 1, hasta: 1, fase: "arranque" },
      { nombre: "Envío de materiales (conceptos)", desde: 2, hasta: 2, fase: "preparacion" },
      { nombre: "Generación de filtros", desde: 3, hasta: 3, fase: "preparacion" },
      { nombre: "Guía de tópicos", desde: 3, hasta: 4, fase: "preparacion" },
      { nombre: "Reclutamiento", desde: 5, hasta: finDeReclutamiento, fase: "preparacion" },
      {
        nombre: "Revisión de perfiles",
        desde: Math.max(5, finDeReclutamiento - 2),
        hasta: finDeReclutamiento,
        fase: "preparacion",
      },
      { nombre: nombreDelCampo, desde: finDeReclutamiento + 1, hasta: finDeCampo, fase: "campo" },
      { nombre: "Análisis", desde: finDeCampo + 1, hasta: finDeAnalisis, fase: "analisis" },
      ...cierreDespuesDe(finDeAnalisis),
    ],
  };
}

/** AI Market Pulse: tres semanas, siempre las mismas (aprobado el 2026-10-05). */
export function cronogramaAiMarketPulse(nombre = "AI Market Pulse"): Cronograma {
  return {
    nombre,
    actividades: [
      { nombre: "Go del proyecto", desde: 1, hasta: 1, fase: "arranque" },
      { nombre: "Kick off", desde: 1, hasta: 1, fase: "arranque" },
      { nombre: "Definición de estudio e investigación", desde: 2, hasta: 8, fase: "campo" },
      { nombre: "Generación de resultados", desde: 9, hasta: 13, fase: "analisis" },
      { nombre: "Generación de dashboard", desde: 14, hasta: 15, fase: "dashboard" },
      { nombre: "Entrega de dashboard", desde: 15, hasta: 15, fase: "entrega" },
    ],
  };
}

/** Las consideraciones que acompañan a todo cronograma (de la lámina tipo de la casa). */
export const CONSIDERACIONES_DEL_CRONOGRAMA = [
  "Modificaciones en alcances o perfiles podrán impactar tiempos y costos del proyecto.",
  "A partir de las **24 horas posteriores al cierre del trabajo de campo**, se habilitará un **dashboard interactivo** con los principales resultados del proyecto.",
];
