import { CONTORNO_DE_ESTADO, VIEWBOX_ESTADOS } from "@/lib/viz/estados-mexico";

/**
 * Cuánto se ensancha el dibujo para que México tenga su proporción.
 *
 * Los contornos se generaron en una caja de 1000 x 900 y salieron COMPRIMIDOS
 * A LO ANCHO: el país completo medía 1.13 de ancho por alto, y en un mapa real
 * es cerca de 1.5 (Chihuahua, que es casi cuadrado en la realidad, salía como
 * una columna). Se veía deformado: Baja California gorda, el país cuadrado.
 * Se corrige aquí, al pintar, y no en `estados-mexico.ts`, que está generado y
 * dice "no editar a mano". El trazo va con `non-scaling-stroke` para que el
 * borde entre estados no se ensanche con el dibujo.
 */
const ENSANCHE = 1.35;
const [, , ANCHO_BASE, ALTO_BASE] = VIEWBOX_ESTADOS.split(" ").map(Number);
import { AREAS_NIELSEN, AREA_NIELSEN_DE_ESTADO } from "@/lib/viz/areas-nielsen";
import { PAPEL, PISTA } from "@/lib/viz/ramps";

/**
 * México por estado, cada estado pintado según el grupo al que pertenece.
 *
 * Cinco decisiones:
 *
 * 1. LOS 32 CONTORNOS SON REALES, no una silueta aproximada: son los límites
 *    estatales de INEGI (`estados-mexico.ts`).
 *
 * 2. LA CLASIFICACIÓN LA PONE QUIEN LLAMA. Por omisión, las seis áreas Nielsen
 *    (`areas-nielsen.ts`), que es la que la casa usa casi siempre. Un estudio con
 *    otra —tiers de ciudades, zonas propias de la muestra— pasa `grupoDeEstado`
 *    (estado → grupo) y `grupos`. Nada de la muestra de un estudio vive aquí.
 *
 * 3. SÓLO SE ILUMINAN LOS GRUPOS QUE SE PASAN. Un estado cuyo grupo no viene en
 *    `grupos` va en la pista: da contexto sin competir. Así se enseña, por
 *    ejemplo, sólo dónde hubo muestra.
 *
 * 4. LA CIFRA VA ESCRITA EN LA LEYENDA, no en el color. Si un grupo trae `valor`
 *    (0 a 1), se escribe junto a su nombre: el mapa ubica y el número dice. El
 *    color distingue grupos, no ordena magnitudes: con seis tonos el ojo no
 *    ordena seis cifras.
 *
 * 5. SÓLO MORADOS Y VIOLETAS (`--color-region-1..6`): en un mapa, un tono
 *    fuera de la paleta de la casa se lee como otra cosa. Son rellenos fijos,
 *    como las bandas.
 *
 * DONDE MÁS SE USA: en la ficha demográfica, en su propia tarjeta, con el
 * reparto de la muestra por área Nielsen. Para eso es `compacto`: mapa y
 * leyenda lado a lado desde tablet, con la letra de la ficha. La leyenda de
 * ancho fijo (16rem) no cabía en media columna.
 */

export interface GrupoDelMapa {
  id: string;
  etiqueta: string;
  /** Un relleno del catálogo: uno de `COLOR_DE_REGION`, o el que pida el estudio. */
  color: string;
  /** 0-1, opcional. Se escribe en la leyenda. */
  valor?: number;
}

/** Los seis rellenos de región, en orden. Escritos completos (no armados con el
 *  número) para que `pnpm auditar:tokens` compruebe que cada uno existe. */
export const COLOR_DE_REGION = [
  "var(--color-region-1)",
  "var(--color-region-2)",
  "var(--color-region-3)",
  "var(--color-region-4)",
  "var(--color-region-5)",
  "var(--color-region-6)",
] as const;

/** Las seis áreas Nielsen, cada una con el color de su código (el 1 es Pacífico… el 6, Sureste). */
export const GRUPOS_NIELSEN: GrupoDelMapa[] = AREAS_NIELSEN.map((a) => ({
  id: a.id,
  etiqueta: a.nombre,
  color: COLOR_DE_REGION[a.codigo - 1],
}));

const pct = (v: number) => `${Math.round(v * 100)}%`;

export function MapaDeMexico({
  grupos = GRUPOS_NIELSEN,
  grupoDeEstado = AREA_NIELSEN_DE_ESTADO,
  leyenda = true,
  compacto = false,
  leyendaAbajo = false,
  llenarAlto = false,
  className = "",
}: {
  /** Los grupos a iluminar, en el orden de la leyenda. */
  grupos?: GrupoDelMapa[];
  /** A qué grupo pertenece cada estado, por su nombre común ("Ciudad de México", "Coahuila"…). */
  grupoDeEstado?: Readonly<Record<string, string>>;
  leyenda?: boolean;
  /** Para una tarjeta de la ficha demográfica: mapa y leyenda lado a lado, letra de ficha. */
  compacto?: boolean;
  /** La leyenda debajo del mapa, en renglón, en vez de a su lado: el mapa gana ancho. */
  leyendaAbajo?: boolean;
  /**
   * Con la leyenda abajo, el mapa se ajusta al alto que le deja su contenedor
   * (que debe ser una columna con alto definido) en vez de al ancho: sirve para
   * que termine a la altura de lo que tiene al lado. Sólo desde `lg`; en
   * angosto manda el ancho.
   */
  llenarAlto?: boolean;
  className?: string;
}) {
  const colorDe = new Map(grupos.map((g) => [g.id, g.color]));

  return (
    <figure
      className={`flex flex-col ${
        leyendaAbajo
          ? `gap-4 ${llenarAlto ? "lg:min-h-0 lg:flex-1" : ""}`
          : compacto
            ? "gap-4 sm:flex-row sm:items-center sm:gap-6"
            : "gap-6 lg:flex-row lg:items-center lg:gap-10"
      } ${className}`}
    >
      {/* Con `llenarAlto`, el dibujo va ABSOLUTO dentro de su caja: no cuenta para el
          alto de la columna (si contara, el mapa mandaría y las tarjetas de al lado
          se estirarían) y se ajusta a lo que le deja la caja. */}
      <div className={llenarAlto && leyendaAbajo ? "relative lg:min-h-0 lg:flex-1" : "contents"}>
      <svg
        viewBox={`0 0 ${ANCHO_BASE * ENSANCHE} ${ALTO_BASE}`}
        className={`w-full min-w-0 ${
          leyendaAbajo
            ? llenarAlto
              ? "lg:absolute lg:inset-0 lg:h-full"
              : ""
            : compacto
              ? "sm:flex-[1.4]"
              : "lg:flex-1"
        }`}
        role="img"
        aria-label={`Mapa de México por estado: ${grupos.map((g) => g.etiqueta).join(", ")}`}
      >
        <g transform={`scale(${ENSANCHE} 1)`}>
          {Object.entries(CONTORNO_DE_ESTADO).map(([nombre, d]) => {
            const grupo = grupoDeEstado[nombre];
            const color = grupo === undefined ? undefined : colorDe.get(grupo);
            return (
              <path
                key={nombre}
                d={d}
                fill={color ?? PISTA}
                stroke={PAPEL}
                strokeWidth={1.4}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              >
                <title>{nombre}</title>
              </path>
            );
          })}
        </g>
      </svg>
      </div>

      {leyenda ? (
        <ul
          className={`flex ${
            leyendaAbajo
              ? "flex-wrap gap-x-6 gap-y-2"
              : `flex-col ${compacto ? "gap-2 sm:flex-1" : "gap-3 lg:w-[16rem] lg:shrink-0"}`
          }`}
        >
          {grupos.map((g) => (
            <li key={g.id} className={`flex items-baseline ${compacto || leyendaAbajo ? "gap-2" : "gap-3"}`}>
              <span
                aria-hidden
                className={`shrink-0 translate-y-0.5 rounded-full ${compacto ? "h-2.5 w-2.5" : "h-3.5 w-3.5"}`}
                style={{ backgroundColor: g.color }}
              />
              <span className={`min-w-0 flex-1 leading-snug text-ink ${compacto ? "text-kicker" : "text-body"}`}>{g.etiqueta}</span>
              {g.valor !== undefined ? (
                <span
                  className={`font-heading font-extrabold leading-none tabular-nums text-ink ${compacto ? "text-body" : "text-lead"}`}
                >
                  {pct(g.valor)}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </figure>
  );
}
