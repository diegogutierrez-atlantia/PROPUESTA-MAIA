import Image from "next/image";

/**
 * La marca de Atlantia, con los ARCHIVOS OFICIALES de la guía (GAIA), en SVG.
 *
 * Tres versiones, y se elige por el fondo que hay debajo, nunca la misma en
 * todos lados:
 *   color   la preferida, sobre blanco o fondos muy claros
 *   blanco  la ÚNICA sobre fondos oscuros o fotografías. La de color pierde la
 *           pierna morada del glifo contra un fondo hondo
 *   negro   impresión a una tinta y contextos monocromos (#363636)
 *
 * Cuatro artes: el glifo (la "A" sola), el logo horizontal, el vertical y el
 * lockup "Atlantia Insights". Todos viven en `public/brand/`, con los nombres
 * de la guía. Ver `public/brand/LEEME.md` y `documentacion/marca/`.
 *
 * ── LO QUE NO SE HACE ──────────────────────────────────────────────────────
 * No se recompone el logo con tipografía suelta ("Atlantia" en Poppins con
 * "Insights" debajo). Ya pasó: se veía parecido y no era la marca. El lockup
 * es artwork y se monta como archivo.
 */

export type VersionDeMarca = "color" | "blanco" | "negro";
export type ArteDeMarca = "glifo" | "logo-horizontal" | "logo-vertical" | "insights";

/** Proporción ancho/alto de cada arte, para que `Image` no deforme. */
const PROPORCION: Record<ArteDeMarca, [number, number]> = {
  glifo: [190, 171],
  "logo-horizontal": [640, 128],
  "logo-vertical": [320, 320],
  insights: [640, 200],
};

export function rutaDeMarca(arte: ArteDeMarca, version: VersionDeMarca) {
  return `/brand/atlantia-${arte}-${version}.svg`;
}

/** El glifo: la "A" sola. Para espacios chicos. */
export function AtlantiaMark({
  className = "h-8 w-8",
  version = "color",
}: {
  className?: string;
  version?: VersionDeMarca;
}) {
  const [w, h] = PROPORCION.glifo;
  return (
    <Image
      src={rutaDeMarca("glifo", version)}
      alt="Atlantia"
      width={w}
      height={h}
      className={`${className} object-contain`}
      unoptimized
    />
  );
}

/**
 * El lockup "Atlantia Insights" (glifo, palabra y "insights" en degradado),
 * como archivo. Para portadas y piezas formales.
 */
export function AtlantiaWordmark({
  className = "",
  light = false,
}: {
  className?: string;
  /** Sobre fondo oscuro o foto: la versión blanca. */
  light?: boolean;
}) {
  const [w, h] = PROPORCION.insights;
  return (
    <Image
      src={rutaDeMarca("insights", light ? "blanco" : "color")}
      alt="Atlantia Insights"
      width={w}
      height={h}
      className={`h-14 w-auto lg:h-16 ${className}`}
      unoptimized
      priority
    />
  );
}

/**
 * El logo horizontal (glifo y palabra en línea), montado DOS veces: uno para
 * cada tema. Es CSS y no una condición en React porque el tema cambia sin
 * re-render: `.solo-en-claro` y `.solo-en-oscuro` viven en globals.css.
 *
 * Es el que va en la barra de arriba del reporte.
 */
export function LogoHorizontalPorTema({
  className = "h-4 w-auto",
  forzarBlanco = false,
}: {
  className?: string;
  /** Sobre una lámina de color, el blanco en los dos temas. */
  forzarBlanco?: boolean;
}) {
  const [w, h] = PROPORCION["logo-horizontal"];
  if (forzarBlanco) {
    return (
      <Image
        src={rutaDeMarca("logo-horizontal", "blanco")}
        alt="Atlantia"
        width={w}
        height={h}
        className={`shrink-0 ${className}`}
        unoptimized
        priority
      />
    );
  }
  return (
    <>
      <Image
        src={rutaDeMarca("logo-horizontal", "negro")}
        alt="Atlantia"
        width={w}
        height={h}
        className={`solo-en-claro shrink-0 ${className}`}
        unoptimized
        priority
      />
      <Image
        src={rutaDeMarca("logo-horizontal", "blanco")}
        alt=""
        aria-hidden
        width={w}
        height={h}
        className={`solo-en-oscuro shrink-0 ${className}`}
        unoptimized
        priority
      />
    </>
  );
}
