import type { LaminaDelReporte } from "@/lib/story-types";
import { armarPropuesta } from "@/lib/propuesta/armar";
import { PROPUESTA } from "@/content/propuesta";

/**
 * Las láminas de la propuesta en una sola tira, cada una con su clave y su
 * nombre para el índice. Sin propuesta todavía, la tira va vacía.
 *
 * ── POR QUÉ SE APLANA AQUÍ Y NO EN EL RECORRIDO ────────────────────────────
 *
 * Este módulo corre en el servidor, y aquí los elementos todavía son
 * elementos. El recorrido es un componente de cliente, y lo que le llega
 * cruzando la frontera son referencias diferidas, sin `key` ni `props`.
 * Cuando el aplanado vivía allá, compilado se descartaban TODAS las láminas
 * menos la primera y en desarrollo no se notaba. (Viene de la base de
 * reportes, donde ya costó una vez.)
 *
 * Las claves se comprueban a propósito: dos láminas con la misma clave se
 * pisarían en el índice. Mejor que no compile.
 */
export function laminasDeLaPropuesta(): LaminaDelReporte[] {
  if (!PROPUESTA) return [];
  const actos = armarPropuesta(PROPUESTA);
  const laminas = actos.flatMap((acto, ai) =>
    acto.laminas.map((l) => ({
      clave: l.clave,
      rotulo: l.rotulo,
      card: l.elemento,
      acto: ai,
      actoTitulo: acto.titulo,
    })),
  );

  const repetidas = laminas.map((l) => l.clave).filter((c, i, todas) => todas.indexOf(c) !== i);
  if (repetidas.length > 0) {
    throw new Error(`Hay láminas con la misma clave: ${repetidas.join(", ")}.`);
  }
  return laminas;
}

/** El rótulo de la barra de arriba y de la pestaña. */
export const ROTULO_DE_LA_PROPUESTA = PROPUESTA?.ficha.rotulo ?? "Propuesta de investigación";

/** Para quién es, en la descripción de la página. */
export const CLIENTE_DE_LA_PROPUESTA = PROPUESTA?.ficha.cliente ?? null;
