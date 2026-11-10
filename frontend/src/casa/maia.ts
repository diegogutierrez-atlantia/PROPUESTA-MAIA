import { Activity, Compass, Lightbulb, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Las herramientas de MAIA que se venden por créditos, con lo que cuestan en
 * créditos y lo que hacen. Se escribieron una vez (2026-10) y son las mismas
 * para cualquier cliente.
 *
 * Lo que NO vive aquí es el precio del crédito: depende de la negociación, y
 * lo da el vendedor en cada propuesta (los `tramos` de la lámina `maia`).
 *
 * Si cambia una herramienta o su costo en créditos, se cambia aquí.
 */
export interface HerramientaDeMaia {
  sigla: string;
  creditos: number;
  nombre: string;
  /** Una línea que dice qué hace. */
  lema: string;
  /** Qué hace, para el reverso de la tarjeta. */
  descripcion: string;
  etiquetas: string[];
  /** El color de la herramienta: un paso de la paleta de la casa. */
  acento: string;
  /** La tinta de lo que va sobre el acento; por omisión, la de relleno. */
  sobre?: string;
  icono: LucideIcon;
}

export const HERRAMIENTAS_DE_MAIA: HerramientaDeMaia[] = [
  {
    sigla: "AIMP",
    creditos: 20,
    nombre: "AI Market Pulse",
    lema: "Investigación de mercado profunda, lista para presentar",
    descripcion:
      "Un brief sencillo se vuelve investigación de mercado con fuentes: nueve módulos configurables, del tamaño de mercado al panorama competitivo, con investigación profunda y búsqueda web en vivo. Entrega una presentación diseñada (PPTX y PDF), el documento completo con fuentes, un chat de preguntas y respuestas y un resumen en audio a dos voces.",
    etiquetas: ["9 módulos de análisis", "Búsqueda web en vivo", "Deck PPTX y PDF", "Resumen en audio"],
    acento: "var(--color-turquoise-80)",
    sobre: "var(--color-violet-100)",
    icono: Activity,
  },
  {
    sigla: "AIITE",
    creditos: 30,
    nombre: "Evaluación técnica de conceptos con IA",
    lema: "Prueba tus conceptos antes que el mercado",
    descripcion:
      "Pasa tu concepto por un diagnóstico completo de innovación en cinco dimensiones: concepto, empaque, nombre, anaquel y mercado. Dos evaluadores de IA independientes califican cada dimensión contra pruebas reales y un agente de síntesis integra el diagnóstico. Evalúa un concepto a fondo o hasta seis variantes cara a cara.",
    etiquetas: ["5 dimensiones", "2 evaluadores de IA", "Radar de benchmark", "Reporte PPTX editable"],
    acento: "var(--color-purple-80)",
    icono: Lightbulb,
  },
  {
    sigla: "AIPE",
    creditos: 30,
    nombre: "AIPE",
    lema: "Diagnostica el empaque. Genera rediseños.",
    descripcion:
      "Califica tu portafolio de empaques en 25 dimensiones estratégicas contra productos reales de la competencia, genera variantes de rediseño y las vuelve a calificar. Cada propuesta llega con una calificación proyectada validada.",
    etiquetas: ["25 dimensiones", "Contra SKUs reales", "Variantes de rediseño"],
    acento: "var(--color-lemon-80)",
    sobre: "var(--color-violet-100)",
    icono: Package,
  },
  {
    sigla: "ACEX",
    creditos: 20,
    nombre: "ACEX",
    lema: "Inteligencia de categoría en vivo",
    descripcion:
      "Convierte un catálogo maestro de retail en vivo en un explorador interactivo de la categoría, con lienzo de profundización, matriz de propiedades y tableros de KPIs, más insights escritos por IA y decks exportables a PDF, PPTX o Excel.",
    etiquetas: ["Explorador interactivo", "KPIs", "Exporta PDF, PPTX o Excel"],
    acento: "var(--color-orange-80)",
    icono: Compass,
  },
];

export function herramientasDeMaia(siglas: string[]): HerramientaDeMaia[] {
  return siglas.map((s) => {
    const h = HERRAMIENTAS_DE_MAIA.find((x) => x.sigla === s);
    if (!h) {
      throw new Error(
        `No hay una herramienta "${s}" en casa/maia.ts. Las que hay: ${HERRAMIENTAS_DE_MAIA.map((x) => x.sigla).join(", ")}.`,
      );
    }
    return h;
  });
}
