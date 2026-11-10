/**
 * El interruptor del tema. Una sola pieza de estado: el atributo
 * `data-theme="oscuro"` en <html>; ausente, el reporte es claro.
 *
 * ── LAS REGLAS ─────────────────────────────────────────────────────────────
 *
 * · EL OSCURO ES EL QUE ABRE (decisión de la casa, 2026-09). El layout ya
 *   manda el <html> con el atributo puesto, así que el reporte es oscuro
 *   aunque no corra ni una línea de JavaScript. El claro es la opción: el
 *   lector lo elige con su botón o con la tecla T.
 * · NO se sigue al sistema. Un entregable no cambia de cara según el sistema
 *   operativo del que lo abre.
 * · La elección se guarda y sobrevive a la recarga. El script inline del
 *   layout la aplica ANTES del primer pintado, para que no haya destello:
 *   sólo tiene que QUITAR el atributo si el lector dejó guardado el claro.
 * · El PDF no pasa por aquí: el Chrome que fotografía corre con perfil
 *   limpio, sin nada guardado, y cae en el oscuro por omisión. `pnpm pdf`
 *   acepta `--tema=claro` si un cliente lo pide.
 *
 * Los componentes NO leen este módulo para colorear: consumen tokens de CSS
 * que el atributo voltea. Esto sólo mueve el atributo y avisa a quien pinte
 * un control (el ícono del botón).
 */

const CLAVE = "tema-reporte";
export const EVENTO_TEMA = "tema-cambiado";

export type Tema = "claro" | "oscuro";

export function temaActual(): Tema {
  if (typeof document === "undefined") return "claro";
  return document.documentElement.dataset.theme === "oscuro" ? "oscuro" : "claro";
}

export function ponerTema(tema: Tema) {
  if (tema === "oscuro") document.documentElement.dataset.theme = "oscuro";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem(CLAVE, tema);
  } catch {
    /* sin almacenamiento, el tema vive lo que la pestaña */
  }
  window.dispatchEvent(new CustomEvent(EVENTO_TEMA, { detail: tema }));
}

export function alternarTema() {
  ponerTema(temaActual() === "oscuro" ? "claro" : "oscuro");
}

/**
 * El script que corre en <head>, como texto: aplica la elección guardada
 * antes del primer pintado. Vive aquí para que el layout no lleve strings
 * mágicos, y es deliberadamente mínimo.
 *
 * Como el servidor ya manda el atributo puesto, lo único que hace es
 * QUITARLO cuando el lector dejó guardado el claro. Sin nada guardado, o sin
 * almacenamiento, el reporte se queda oscuro.
 */
export const SCRIPT_DE_TEMA = `try{if(localStorage.getItem("${CLAVE}")==="claro")delete document.documentElement.dataset.theme}catch(e){}`;
