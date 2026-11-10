import { CalendarCheck, Filter, Languages, LayoutDashboard, ShieldCheck, Timer, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * El estándar de ejecución de Atlantia: lo que toda propuesta incluye.
 *
 * Es el mismo en las cinco primeras propuestas, con una sola diferencia entre
 * ellas: la duración del cuestionario. Por eso una propuesta no lo escribe;
 * sólo declara lo que cambia (`cambios` en la lámina `estandar`).
 *
 * Las cifras ("24 a 48 hrs", "18 minutos") son las del documento de la casa.
 * Si el área comercial cambia el estándar, se cambia aquí y aplica a todas las
 * propuestas nuevas.
 */
export interface TarjetaDelEstandar {
  titulo: string;
  icono: LucideIcon;
  /** Texto corrido, con **negritas**. */
  texto?: string;
  lista?: string[];
  chips?: string[];
  introDeChips?: string;
}

export const ENTREGABLE_DEL_ESTANDAR = {
  insignia: "Entregable único",
  nombre: "Reporte Digital (Dashboard)",
  icono: LayoutDashboard,
  descripcion:
    "Plataforma interactiva para la visualización integral de los resultados del estudio. Sustituye reportes estáticos eliminando el ruido visual para facilitar el análisis estratégico.",
  cifra: "24 a 48 hrs",
  cifraRotulo: "Post-Trabajo de Campo",
} as const;

/** La duración por omisión del instrumento, como se escribe en la tarjeta. */
export const EXTENSION_DEL_ESTANDAR = "**18 minutos**";

export const CRUCES_DEL_ESTANDAR = ["Género", "Edad", "NSE", "Región Geográfica"];

export const TRADUCCION_DEL_ESTANDAR = "No incluye traducción.";

/**
 * Las seis tarjetas, en el orden del mosaico: dos arriba, dos al medio y las
 * dos de abajo (la penúltima, ancha).
 */
export function tarjetasDelEstandar(cambios?: {
  extension?: string;
  cruces?: string[];
  traduccion?: string;
}): TarjetaDelEstandar[] {
  return [
    {
      titulo: "Extensión del Instrumento",
      icono: Timer,
      texto: `Cuestionario de evaluación diseñado y estructurado para una duración máxima de ${
        cambios?.extension ?? EXTENSION_DEL_ESTANDAR
      } de aplicación.`,
    },
    {
      titulo: "Cruces Básicos Incluidos",
      icono: Filter,
      introDeChips: "Variables demográficas estándar:",
      chips: cambios?.cruces ?? CRUCES_DEL_ESTANDAR,
    },
    {
      titulo: "Reuniones de Proyecto",
      icono: Users,
      lista: ["Sesión de Kick-Off (KO)", "Revisión de cuestionario (Opcional)", "Presentación de Resultados"],
    },
    {
      titulo: "Tiempos de Inicio",
      icono: CalendarCheck,
      texto:
        "El proyecto inicia tras la **confirmación formal**, aprobación del cuestionario y pago del **anticipo correspondiente**.",
    },
    {
      titulo: "Confidencialidad & Seguridad",
      icono: ShieldCheck,
      texto:
        "El estudio será elaborado **exclusivamente para el cliente**. La información no se compartirá públicamente ni se referenciará. De ser solicitado por el cliente, se firmará un **contrato NDA**.",
    },
    {
      titulo: "Traducción",
      icono: Languages,
      texto: cambios?.traduccion ?? TRADUCCION_DEL_ESTANDAR,
    },
  ];
}
