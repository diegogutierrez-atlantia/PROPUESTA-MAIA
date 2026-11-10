import { estiloDeIcono } from "@/lib/story/colores-de-icono";
import { ENTREGABLE_DEL_ESTANDAR, type TarjetaDelEstandar } from "@/casa/estandar";
import { TARJETA } from "./estilos";
import { TextoConNegritas } from "./TextoConNegritas";

/**
 * El estándar de ejecución: lo que toda propuesta incluye, en un mosaico.
 *
 * Las decisiones que la definen:
 *
 * 1. UNA TARJETA GRANDE PARA EL ENTREGABLE y seis más chicas alrededor: lo que
 *    el cliente recibe pesa más que las condiciones con que lo recibe.
 *
 * 2. LAS CIFRAS DESTACADAS VAN GRANDES: "24 a 48 hrs" tiene su caja; la
 *    duración del cuestionario va resaltada dentro de su frase.
 *
 * 3. EL CONTENIDO ES DE LA CASA (`casa/estandar.ts`); la propuesta sólo dice
 *    lo que cambia. Así el estándar no se transcribe en cada propuesta.
 */
export function EstandarDeEjecucion({ tarjetas }: { tarjetas: TarjetaDelEstandar[] }) {
  const e = ENTREGABLE_DEL_ESTANDAR;
  const Entregable = e.icono;
  return (
    <div className="flex flex-1 flex-col justify-center gap-4 lg:gap-5">
      <header className="stagger flex flex-col gap-1.5">
        <p className="kicker-marca font-heading text-kicker font-bold uppercase tracking-[0.2em]">Parámetros estándar</p>
        <h2 className="font-heading text-h3 font-extrabold text-ink">Estándar de ejecución</h2>
      </header>

      <div className="stagger grid items-stretch gap-3 lg:grid-cols-3 lg:gap-4">
        <section
          className="flex flex-col gap-3 rounded-3xl border-2 p-4 lg:row-span-2 lg:gap-4 lg:p-6"
          style={{ borderColor: "var(--color-secondary)", backgroundColor: "var(--surface-2)" }}
        >
          <span
            data-superficie="honda"
            className="w-fit rounded-md px-3 py-1 font-heading text-kicker font-semibold"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "var(--color-sobre-relleno)",
            }}
          >
            {e.insignia}
          </span>
          <div className="flex items-center gap-4">
            <span
              aria-hidden
              data-superficie="honda"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={estiloDeIcono(0)}
            >
              <Entregable className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-heading text-lead font-bold leading-tight text-tinta-marca">{e.nombre}</h3>
          </div>
          <p className="text-body leading-relaxed text-ink">{e.descripcion}</p>
          <div
            data-superficie="clara"
            className="mt-auto rounded-2xl bg-surface px-4 py-3 text-center shadow-[0_0.5rem_1.5rem_-0.75rem_color-mix(in_oklab,var(--color-primary-900)_35%,transparent)]"
          >
            <p className="font-heading text-h3 font-extrabold leading-none text-tinta-marca">{e.cifra}</p>
            <p className="mt-1.5 font-heading text-kicker font-semibold text-ink-2">{e.cifraRotulo}</p>
          </div>
        </section>

        {tarjetas.map((t, i) => {
          const Icono = t.icono;
          // La penúltima ocupa dos columnas: la de abajo a la izquierda.
          const ancha = i === tarjetas.length - 2;
          return (
            <section key={t.titulo} className={`flex flex-col gap-2 p-4 lg:p-5 ${TARJETA} ${ancha ? "lg:col-span-2" : ""}`}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  data-superficie="honda"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={estiloDeIcono(i + 1)}
                >
                  <Icono className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                </span>
                <h3 className="font-heading text-body font-bold leading-tight text-ink">{t.titulo}</h3>
              </div>

              {t.introDeChips ? <p className="text-kicker text-ink-2">{t.introDeChips}</p> : null}
              {t.chips ? (
                <ul className="flex flex-wrap gap-2">
                  {t.chips.map((c) => (
                    <li
                      key={c}
                      className="rounded-lg border px-2.5 py-0.5 font-heading text-kicker font-semibold text-tinta-marca"
                      style={{ borderColor: "var(--color-secondary)", backgroundColor: "var(--surface-2)" }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              ) : null}
              {t.lista ? (
                <ul className="flex flex-col gap-2">
                  {t.lista.map((l) => (
                    <li key={l} className="flex items-start gap-2.5 text-kicker text-ink-2">
                      <span aria-hidden className="mt-[0.5em] h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: "var(--color-primary)" }} />
                      {l}
                    </li>
                  ))}
                </ul>
              ) : null}
              {t.texto ? (
                <p className="text-kicker leading-relaxed text-ink-2">
                  <TextoConNegritas texto={t.texto} clase="font-semibold text-tinta-marca" />
                </p>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
