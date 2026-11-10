import { numero, porcentaje } from "@/lib/propuesta/formato";
import type { LaminaCuotas, Rango } from "@/lib/propuesta/tipos";
import { TARJETA } from "./estilos";

/**
 * "A lo que vamos a llegar": cuántas entrevistas se esperan y de qué.
 *
 * Dos formas:
 *
 * 1. CUOTAS: una barra por renglón, con su cifra escrita y su pista, escalada
 *    contra el mayor de la lista.
 *
 * 2. TABLAS DE RANGOS ("150 – 190"): un rango honesto en lugar de una cifra
 *    exacta que la muestra no garantiza. Un renglón puede traer también el
 *    rango en porcentaje.
 *
 * NINGUNA CIFRA SE CALCULA AQUÍ: llegan escritas por el vendedor.
 */
const rangoNum = (r: Rango) => `${numero(r.min)} – ${numero(r.max)}`;
const rangoPct = (r: Rango) => `${porcentaje(r.min).replace("%", "")} – ${porcentaje(r.max)}`;

export function ZonaDeCuotas({ lamina }: { lamina: LaminaCuotas }) {
  const max = Math.max(...(lamina.cuotas ?? []).map((c) => c.entrevistas), 1);
  return (
    <div className="flex flex-1 flex-col justify-center gap-5 lg:gap-6">
      <h2 className="stagger font-heading text-h2 font-extrabold text-ink">{lamina.titulo}</h2>

      <div className={`stagger flex flex-col gap-4 p-5 lg:p-7 ${TARJETA}`}>
        {lamina.tablas ? (
          <div className="grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
            {lamina.tablas.map((t) => {
              const conPct = t.renglones.some((r) => r.porcentaje);
              const cols = conPct ? "grid-cols-[minmax(0,1fr)_7rem_8rem]" : "grid-cols-[minmax(0,1fr)_8rem]";
              return (
                <section key={t.titulo} className="flex min-w-0 flex-col rounded-xl border border-border bg-surface-2 p-4">
                  <h3 className="mb-2 font-heading text-lead font-bold text-tinta-marca">{t.titulo}</h3>
                  <div className={`grid ${cols} gap-3 border-b border-border pb-1 text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted`}>
                    <span>{t.columnaEtiqueta}</span>
                    {conPct ? <span className="text-right">Porcentaje</span> : null}
                    <span className="text-right">Entrevistas</span>
                  </div>
                  <ul className="flex flex-col">
                    {t.renglones.map((r) => (
                      <li key={r.etiqueta} className={`grid ${cols} items-baseline gap-3 border-b border-border py-1.5 last:border-b-0`}>
                        <span className="text-body font-bold leading-snug">{r.etiqueta}</span>
                        {conPct ? (
                          <span className="text-right text-body tabular-nums text-ink-2">
                            {r.porcentaje ? rangoPct(r.porcentaje) : ""}
                          </span>
                        ) : null}
                        <span className="text-right font-heading text-lead font-extrabold tabular-nums">{rangoNum(r.personas)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {(lamina.cuotas ?? []).map((c) => (
              <li key={c.etiqueta}>
                <p className="mb-1 flex items-baseline justify-between gap-3">
                  <span className="text-body font-medium leading-snug">{c.etiqueta}</span>
                  <span className="font-heading text-lead font-extrabold tabular-nums">{numero(c.entrevistas)}</span>
                </p>
                <span className="block h-2 w-full overflow-hidden rounded-full bg-pista">
                  <span
                    className="grow-bar block h-full rounded-full"
                    style={{ width: `${(c.entrevistas / max) * 100}%`, backgroundColor: "var(--marca)" }}
                  />
                </span>
              </li>
            ))}
          </ul>
        )}
        {lamina.nota ? <p className="border-t border-border pt-3 text-body text-ink-2">{lamina.nota}</p> : null}
      </div>
    </div>
  );
}
