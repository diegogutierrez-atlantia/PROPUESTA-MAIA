import type { ReactNode } from "react";

export interface StoryChapterData {
  id: string;
  title: string;
  cards: ReactNode[];
}

/**
 * Una lámina, ya aplanada y con su clave DECLARADA.
 *
 * ── POR QUÉ EXISTE ESTE TIPO ───────────────────────────────────────────────
 *
 * El recorrido necesita saber cómo se llama cada lámina para el navegador, los
 * puntos y el rótulo accesible. Eso se sacaba leyendo el `key` del elemento
 * DENTRO del componente de cliente, y ahí no se puede leer: al cruzar la
 * frontera de servidor a cliente, React no manda el elemento sino una
 * referencia diferida, un objeto sin `key` y sin `props`. En desarrollo llega
 * el elemento entero y todo parecía funcionar; compilado, la clave salía vacía,
 * la lámina se descartaba y el reporte se quedaba en UNA sola pantalla.
 *
 * Por eso la clave viaja aparte: se lee del lado del servidor, donde el
 * elemento todavía es un elemento, y llega al cliente como un dato normal.
 */
export interface LaminaDelReporte {
  /** La clave de la lámina, la misma con la que se declara su título. */
  clave: string;
  /** Cómo se llama para el cliente. */
  rotulo: string;
  /** La lámina en sí. */
  card: ReactNode;
  /** En qué acto va, por posición. */
  acto: number;
  /** Cómo se llama ese acto. */
  actoTitulo: string;
}
