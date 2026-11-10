import { estiloDeIcono } from "@/lib/story/colores-de-icono";
import type { GrupoDeKpis, SolucionConKpis } from "@/lib/propuesta/tipos";
import { COLOR_DE_PUNTO, PUNTO } from "./estilos";

/**
 * Los indicadores de UNA solución, todos a la vista.
 *
 * Las decisiones que la definen:
 *
 * 1. NADA SE ABRE CON UN CLIC (decisión de operaciones, 2026-11). Antes los
 *    grupos eran desplegables y el lector tenía que ir abriéndolos; ahora la
 *    propuesta se consume sin interactuar. Lo que no cabe en una pantalla se
 *    va a la siguiente lámina, nunca a un desplegable.
 *
 * 2. UNA LÁMINA POR SOLUCIÓN (o más, si no cabe): con varias soluciones lado a
 *    lado y todo abierto, las columnas quedaban angostas y larguísimas.
 *    `partirKpisEnLaminas` reparte los grupos, en su orden, entre las láminas.
 *
 * 3. LOS GRUPOS FLUYEN EN COLUMNAS DE ARRIBA ABAJO (CSS `columns`): se leen en
 *    vertical, como pide la casa, y un grupo nunca se parte entre columnas.
 *
 * 4. LOS INDICADORES VAN TEXTUALES y NO SE CUENTAN: ningún "14 indicadores"
 *    tecleado, que se desactualiza en cuanto alguien agrega uno.
 *
 * 5. EL EJEMPLO DE UN GRUPO (el clúster, el Match Index) YA NO ABRE ENCIMA:
 *    va como lámina explicativa propia, justo después (lo pone `armar.tsx`).
 *    Aquí el grupo sólo lo anuncia con su chip.
 */

/** Lo que pesa un grupo en renglones: su nombre y sus indicadores. */
const pesoDeGrupo = (g: GrupoDeKpis) => g.kpis.length + 2;

/** Lo que cabe en una pantalla: cuatro columnas de unos catorce renglones. */
const RENGLONES_POR_LAMINA = 56;

/** Reparte los grupos de una solución entre láminas, sin cambiar su orden. */
export function partirKpisEnLaminas(grupos: GrupoDeKpis[]): GrupoDeKpis[][] {
  const laminas: GrupoDeKpis[][] = [];
  let actual: GrupoDeKpis[] = [];
  let peso = 0;
  for (const g of grupos) {
    if (actual.length > 0 && peso + pesoDeGrupo(g) > RENGLONES_POR_LAMINA) {
      laminas.push(actual);
      actual = [];
      peso = 0;
    }
    actual.push(g);
    peso += pesoDeGrupo(g);
  }
  if (actual.length > 0) laminas.push(actual);
  return laminas;
}

export function KpisPorSolucion({
  titulo,
  solucion,
  grupos,
  indice,
  parte,
}: {
  titulo: string;
  solucion: SolucionConKpis;
  /** Los grupos que van en esta lámina (todos, o un tramo si no cupo en una). */
  grupos: GrupoDeKpis[];
  /** El lugar de la solución en la propuesta: decide el color de su ícono. */
  indice: number;
  /** "2 de 2" cuando la solución ocupa más de una lámina. */
  parte?: { n: number; de: number };
}) {
  const Icono = solucion.icono;
  const peso = grupos.reduce((n, g) => n + pesoDeGrupo(g), 0);
  // Las clases van escritas completas: Tailwind no genera una armada al vuelo.
  const columnas =
    grupos.length === 1
      ? ""
      : peso > 36 && grupos.length > 3
        ? "md:columns-2 lg:columns-3 xl:columns-4"
        : peso > 24 && grupos.length > 2
          ? "md:columns-2 xl:columns-3"
          : "md:columns-2";
  const ultima = !parte || parte.n === parte.de;

  return (
    <div className="flex flex-1 flex-col gap-8 lg:gap-10">
      <header className="stagger flex flex-col gap-5">
        <h2 className="font-heading text-h2 font-extrabold text-ink">{titulo}</h2>
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            data-superficie="honda"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={estiloDeIcono(indice)}
          >
            <Icono className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <h3 className="font-heading text-h3 font-bold leading-tight text-ink">
            {solucion.nombre}
            {parte && parte.de > 1 ? (
              <span className="ml-3 font-heading text-lead font-semibold text-muted">
                {parte.n} de {parte.de}
              </span>
            ) : null}
          </h3>
        </div>
      </header>

      <div className={`stagger gap-x-12 ${columnas}`}>
        {grupos.map((g) => (
          <section key={g.nombre} className="mb-7 break-inside-avoid border-t border-border pt-4">
            <h4 className="flex items-center gap-3 font-heading text-body font-semibold text-tinta-marca">
              <span className="flex-1">{g.nombre}</span>
              {g.ejemplo ? (
                <span className="shrink-0 rounded-full border border-border px-3 py-0.5 font-heading text-[0.6875rem] font-semibold uppercase tracking-[0.12em]">
                  Con ejemplo
                </span>
              ) : null}
            </h4>
            <ul className="mt-3 flex flex-col gap-2">
              {g.kpis.map((k) => (
                <li key={k} className="flex gap-3 text-body text-ink-2">
                  <span aria-hidden className={PUNTO} style={COLOR_DE_PUNTO} />
                  <span>{k}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {ultima && solucion.nota ? <p className="mt-auto text-[0.6875rem] text-muted">{solucion.nota}</p> : null}
    </div>
  );
}
