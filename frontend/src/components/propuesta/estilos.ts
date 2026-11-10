/**
 * Las clases que comparten las tarjetas del catálogo. Están en un solo lugar
 * para que todas las láminas de una propuesta tengan la misma tarjeta: el
 * mismo borde, el mismo radio y la misma sombra suave sobre el papel.
 */
export const SOMBRA_DE_TARJETA =
  "shadow-[0_0.5rem_2rem_-1rem_color-mix(in_oklab,var(--color-primary-900)_30%,transparent)]";

export const TARJETA = `rounded-2xl border border-border bg-surface ${SOMBRA_DE_TARJETA}`;

/** El punto de una lista: el morado secundario de la marca. */
export const PUNTO = "mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full";
export const COLOR_DE_PUNTO = { backgroundColor: "var(--color-secondary)" } as const;
