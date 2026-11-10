import { estiloDeIcono } from "@/lib/story/colores-de-icono";
import type { BloqueDeTerminos } from "@/casa/terminos";
import { COLOR_DE_PUNTO, PUNTO } from "./estilos";
import { TextoConNegritas } from "./TextoConNegritas";

/**
 * Los términos y condiciones, completos y a la vista, en las láminas que hagan falta.
 *
 * Las decisiones que la definen:
 *
 * 1. ES TEXTO LEGAL, COMPLETO Y TEXTUAL, y viene de `casa/terminos.ts`: la
 *    lámina no lo resume ni lo reordena.
 *
 * 2. NADA SE ABRE CON UN CLIC (decisión de operaciones, 2026-11). Antes eran
 *    siete bloques cerrados en una pantalla; ahora todo el texto se ve, y lo
 *    que no cabe se va a la lámina siguiente. `partirTerminosEnLaminas` reparte
 *    los bloques en su orden; un bloque nunca se parte entre dos láminas.
 *
 * 3. EL TEXTO FLUYE EN DOS COLUMNAS DE ARRIBA ABAJO, como se lee un contrato.
 *    Un párrafo no se parte entre columnas, y el título de un bloque no se queda
 *    solo al pie de una.
 *
 * 4. LOS ÍCONOS LLEVAN EL MISMO COLOR: en texto legal el color no distingue
 *    nada, y una fila pareja se lee más seria.
 */

/** Lo que cabe en una pantalla, en caracteres, a dos columnas. */
const CARACTERES_POR_LAMINA = 3000;

const largoDe = (b: BloqueDeTerminos) =>
  b.secciones.reduce((n, s) => n + (s.subtitulo?.length ?? 0) + s.parrafos.reduce((m, p) => m + p.length, 0), 0);

/** Reparte los bloques entre láminas, sin cambiar su orden ni partir ninguno. */
export function partirTerminosEnLaminas(bloques: BloqueDeTerminos[]): BloqueDeTerminos[][] {
  const laminas: BloqueDeTerminos[][] = [];
  let actual: BloqueDeTerminos[] = [];
  let largo = 0;
  for (const b of bloques) {
    if (actual.length > 0 && largo + largoDe(b) > CARACTERES_POR_LAMINA) {
      laminas.push(actual);
      actual = [];
      largo = 0;
    }
    actual.push(b);
    largo += largoDe(b);
  }
  if (actual.length > 0) laminas.push(actual);
  return laminas;
}

export function TerminosYCondiciones({
  bloques,
  parte,
}: {
  bloques: BloqueDeTerminos[];
  /** "2 de 4" cuando los términos ocupan varias láminas. */
  parte?: { n: number; de: number };
}) {
  return (
    <div className="flex flex-1 flex-col gap-8 lg:gap-10">
      <header className="stagger flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h2 className="font-heading text-h2 font-extrabold text-ink">Términos y condiciones del proyecto</h2>
        {parte && parte.de > 1 ? (
          <span className="font-heading text-lead font-semibold text-muted">
            {parte.n} de {parte.de}
          </span>
        ) : null}
      </header>

      <div className="stagger gap-x-14 lg:columns-2">
        {bloques.map((b) => {
          const Icono = b.icono;
          return (
            <section key={b.titulo} className="mb-8">
              <div className="mb-4 flex break-inside-avoid break-after-avoid items-center gap-4 border-t border-border pt-5">
                <span
                  aria-hidden
                  data-superficie="honda"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={estiloDeIcono(1)}
                >
                  <Icono className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="flex-1 font-heading text-lead font-bold leading-snug text-ink">{b.titulo}</h3>
              </div>

              {b.secciones.map((s, i) => (
                <div key={s.subtitulo ?? i} className="mb-4">
                  {s.subtitulo ? (
                    <h4 className="mb-2 break-after-avoid font-heading text-body font-bold text-tinta-marca">{s.subtitulo}</h4>
                  ) : null}
                  {/* En bloque, no en flex: una lista flex no se reparte bien entre columnas. */}
                  <ul className="space-y-2.5">
                    {s.parrafos.map((p) => (
                      <li key={p} className="flex break-inside-avoid gap-3 text-body leading-relaxed text-ink-2">
                        <span aria-hidden className={PUNTO} style={COLOR_DE_PUNTO} />
                        <span>
                          <TextoConNegritas texto={p} clase="font-bold text-ink" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
