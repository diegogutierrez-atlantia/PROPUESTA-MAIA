/**
 * El juego de íconos del reporte, para el DOMINIO del estudio (una galleta,
 * un vaso, una tienda, un calendario).
 *
 * Tres decisiones que lo definen:
 *
 * 1. SON SVG DE VERDAD, INCRUSTADOS, no imágenes. Con `currentColor` heredan
 *    el color del texto que los rodea, así que el mismo ícono sirve sobre
 *    lámina clara, sobre lámina de color y en los dos temas, sin duplicar
 *    archivos.
 *
 * 2. TRAZO SIMPLE, SIN RELLENOS, en la retícula de 24 con grosor 1.75. Es el
 *    mismo estilo que la iconografía oficial de Atlantia (`public/iconos/`,
 *    trazo 1.5 sobre 24), y es lo único que aguanta pintarse a 16px y a 64px
 *    con el mismo archivo.
 *
 * 3. NO SE DIBUJAN A MANO. Vienen de Tabler Icons (MIT), que es un juego
 *    completo y consistente. Un pictograma hecho a ojo se nota de inmediato al
 *    lado de tipografía cuidada. Para agregar uno: se copia el `path` de
 *    Tabler y se declara aquí con el nombre en español.
 *
 * Los 20 de interfaz de la guía (buscar, descargar, calendario…) viven como
 * archivos en `public/iconos/`; éstos son los del dominio.
 */
import type { SVGProps } from "react";

interface BaseProps extends SVGProps<SVGSVGElement> {
  trazos: string[];
}

function Base({ trazos, ...props }: BaseProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {trazos.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

export type IconoProps = SVGProps<SVGSVGElement>;

export const IconoTienda = (p: IconoProps) => <Base trazos={["M3 21l18 0", "M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4", "M5 21l0 -10.15", "M19 21l0 -10.15", "M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"]} {...p} />;
export const IconoCalendario = (p: IconoProps) => <Base trazos={["M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z", "M16 3v4", "M8 3v4", "M4 11h16", "M8 14v4", "M12 14v4", "M16 14v4"]} {...p} />;
export const IconoReloj = (p: IconoProps) => <Base trazos={["M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0", "M12 7v5l3 3"]} {...p} />;
export const IconoGalleta = (p: IconoProps) => <Base trazos={["M8 13v.01", "M12 17v.01", "M12 12v.01", "M16 14v.01", "M11 8v.01", "M13.148 3.476l2.667 1.104a4 4 0 0 0 4.656 6.14l.053 .132a3 3 0 0 1 0 2.296q -.745 1.18 -1.024 1.852q -.283 .684 -.66 2.216a3 3 0 0 1 -1.624 1.623q -1.572 .394 -2.216 .661q -.712 .295 -1.852 1.024a3 3 0 0 1 -2.296 0q -1.203 -.754 -1.852 -1.024q -.707 -.292 -2.216 -.66a3 3 0 0 1 -1.623 -1.624q -.397 -1.577 -.661 -2.216q -.298 -.718 -1.024 -1.852a3 3 0 0 1 0 -2.296q .719 -1.116 1.024 -1.852q .257 -.62 .66 -2.216a3 3 0 0 1 1.624 -1.623q 1.547 -.384 2.216 -.661q .687 -.285 1.852 -1.024a3 3 0 0 1 2.296 0"]} {...p} />;
export const IconoTaza = (p: IconoProps) => <Base trazos={["M5 11h14v-3h-14z", "M17.5 11l-1.5 10h-8l-1.5 -10", "M6 8v-1a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v1", "M15 5v-2"]} {...p} />;
export const IconoMujer = (p: IconoProps) => <Base trazos={["M12 9m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0", "M12 14v7", "M9 18h6"]} {...p} />;
export const IconoHombre = (p: IconoProps) => <Base trazos={["M10 14m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0", "M19 5l-5.4 5.4", "M19 5h-5", "M19 5v5"]} {...p} />;
export const IconoCorazon = (p: IconoProps) => <Base trazos={["M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"]} {...p} />;
export const IconoUbicacion = (p: IconoProps) => <Base trazos={["M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0", "M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"]} {...p} />;
export const IconoLeche = (p: IconoProps) => <Base trazos={["M8 6h8v-2a1 1 0 0 0 -1 -1h-6a1 1 0 0 0 -1 1v2z", "M16 6l1.094 1.759a6 6 0 0 1 .906 3.17v8.071a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-8.071a6 6 0 0 1 .906 -3.17l1.094 -1.759", "M12 16m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M10 10h4"]} {...p} />;
export const IconoCarrito = (p: IconoProps) => <Base trazos={["M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M17 17h-11v-14h-2", "M6 5l14 1l-1 7h-13"]} {...p} />;
export const IconoDestellos = (p: IconoProps) => <Base trazos={["M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"]} {...p} />;
export const IconoNiveles = (p: IconoProps) => <Base trazos={["M12 4l-8 4l8 4l8 -4l-8 -4", "M4 12l8 4l8 -4", "M4 16l8 4l8 -4"]} {...p} />;
export const IconoEstrella = (p: IconoProps) => <Base trazos={["M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"]} {...p} />;
export const IconoEtiqueta = (p: IconoProps) => <Base trazos={["M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0", "M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"]} {...p} />;
export const IconoPersonas = (p: IconoProps) => <Base trazos={["M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0", "M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2", "M16 3.13a4 4 0 0 1 0 7.75", "M21 21v-2a4 4 0 0 0 -3 -3.85"]} {...p} />;
