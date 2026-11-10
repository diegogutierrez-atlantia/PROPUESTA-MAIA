import type { Propuesta } from "@/lib/propuesta/tipos";

/**
 * LA PROPUESTA. Es lo único que se llena en cada propuesta nueva.
 *
 * En la base va vacía a propósito: aquí no vive la propuesta de ningún
 * cliente, ni como ejemplo. Un ejemplo con textos y precios reales a la mano
 * es justo lo que termina copiado, o citado, en la propuesta de otro.
 *
 * Qué lleva cada tipo de lámina está en `lib/propuesta/tipos.ts`, y lo de la
 * casa (términos, estándar, KPIs, cronogramas, MAIA) se toma de `casa/`.
 * Mientras esto sea `null`, la página dice que todavía no hay propuesta.
 */
export const PROPUESTA: Propuesta | null = null;
