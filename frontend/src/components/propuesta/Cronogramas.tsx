import type { ActividadDelCronograma, Cronograma, FaseDelCronograma } from "@/lib/propuesta/tipos";
import { COLOR_DE_PUNTO, PUNTO, SOMBRA_DE_TARJETA } from "./estilos";
import { TextoConNegritas } from "./TextoConNegritas";

/**
 * El timeline: uno o varios cronogramas, una semana tras otra.
 *
 * Las decisiones que lo definen:
 *
 * 1. CADA CRONOGRAMA SE PINTA DIRECTO, EN SU PROPIA LÁMINA, y nada se abre con
 *    un clic (decisión de operaciones, 2026-11). Antes, con dos o más, cada uno
 *    iba en una tarjeta con un botón que lo abría en grande; con ocho semanas y
 *    once actividades, dos rutas en una pantalla dejaban las barras ilegibles.
 *    `armar.tsx` reparte un timeline de varios cronogramas en varias láminas.
 *
 * 2. LA DURACIÓN SE LEE DE LAS ACTIVIDADES, no se teclea: la que termina más
 *    tarde manda. Si se mueve una actividad, la tarjeta y la ruta cambian
 *    juntas y no pueden contradecirse.
 *
 * 3. CADA RENGLÓN LLEVA SU CARRIL (los días del proyecto, las semanas
 *    alternadas en dos tonos) y la barra encima: ninguna barra va "al aire".
 *
 * 4. EL COLOR DICE LA FASE (arranque, preparación, campo, análisis, dashboard,
 *    entrega), igual en todos los cronogramas, y la clave de abajo nombra sólo
 *    las fases que aparecen. El color nunca va solo: el nombre de la
 *    actividad está escrito y la posición dice cuándo.
 *
 * 5. NO CALCULA FECHAS: COLOCA. Una actividad fuera del proyecto revienta en
 *    vez de pintarse.
 *
 * 6. LAS CONSIDERACIONES DE LA CASA van debajo (las de la lámina tipo de
 *    ventas): cambiar alcances mueve tiempos, y el dashboard se habilita 24
 *    horas después del campo.
 */
const DIAS_POR_SEMANA = 5;

const ORDEN_DE_FASES: FaseDelCronograma[] = ["arranque", "preparacion", "campo", "analisis", "dashboard", "entrega"];

const FASES: Record<FaseDelCronograma, { etiqueta: string; barra: string }> = {
  arranque: { etiqueta: "Arranque", barra: "linear-gradient(90deg, var(--color-violet-40), var(--color-violet-60))" },
  preparacion: { etiqueta: "Preparación", barra: "linear-gradient(90deg, var(--color-purple-40), var(--color-purple-60))" },
  campo: { etiqueta: "Campo", barra: "linear-gradient(90deg, var(--color-violet-60), var(--color-violet-80))" },
  analisis: { etiqueta: "Análisis y procesamiento", barra: "linear-gradient(90deg, var(--color-purple-60), var(--color-purple-80))" },
  dashboard: { etiqueta: "Dashboard", barra: "linear-gradient(90deg, var(--color-purple-80), var(--color-purple-100))" },
  entrega: { etiqueta: "Entrega", barra: "linear-gradient(90deg, var(--color-violet-80), var(--color-violet-100))" },
};

/** Los degradados de cabecera, uno por cronograma, en orden. */
const DEGRADADOS = [
  "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
  "linear-gradient(135deg, var(--color-secondary), var(--color-purple-100))",
  "linear-gradient(135deg, var(--color-violet-60), var(--color-secondary))",
  "linear-gradient(135deg, var(--color-turquoise-100), var(--color-primary))",
];

/** Las semanas alternan los dos morados de marca, los dos con letra blanca. */
const COLOR_DE_SEMANA = ["var(--color-primary)", "var(--color-secondary)"] as const;

export function semanasDe(c: Cronograma) {
  return Math.ceil(Math.max(...c.actividades.map((a) => a.hasta)) / DIAS_POR_SEMANA);
}

export function Cronogramas({
  titulo,
  cronogramas,
  consideraciones,
  desde = 0,
}: {
  titulo: string;
  /** Normalmente uno: `armar.tsx` pone cada cronograma en su propia lámina. */
  cronogramas: Cronograma[];
  consideraciones: string[];
  /** El lugar del primer cronograma en la propuesta: conserva su color de cabecera. */
  desde?: number;
}) {
  const fases = ORDEN_DE_FASES.filter((f) => cronogramas.some((c) => c.actividades.some((a) => a.fase === f)));
  return (
    <div className="flex flex-1 flex-col justify-center gap-4 lg:gap-5">
      <h2 className="stagger font-heading text-h3 font-extrabold text-ink">{titulo}</h2>

      <div className="stagger flex flex-col gap-4">
        {cronogramas.map((c, i) => (
          <RutaPorSemanas key={c.nombre} cronograma={c} degradado={DEGRADADOS[(i + desde) % DEGRADADOS.length]} />
        ))}
      </div>

      <div className="stagger flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
        <LeyendaDeFases fases={fases} />
        {consideraciones.length > 0 ? (
          <div className="flex max-w-[60rem] flex-col gap-2">
            <p className="kicker-marca font-heading text-kicker font-bold uppercase tracking-[0.2em]">Consideraciones</p>
            <ul className="flex flex-col gap-1.5">
              {consideraciones.map((c) => (
                <li key={c} className="flex gap-3 text-body text-ink-2">
                  <span aria-hidden className={PUNTO} style={COLOR_DE_PUNTO} />
                  <span>
                    <TextoConNegritas texto={c} clase="font-semibold text-tinta-marca" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RutaPorSemanas({ cronograma, degradado }: { cronograma: Cronograma; degradado: string }) {
  const semanas = semanasDe(cronograma);
  const dias = semanas * DIAS_POR_SEMANA;
  for (const a of cronograma.actividades) revisarActividad(a, cronograma.nombre);
  const columnas = "minmax(7.5rem, 13rem) minmax(0, 1fr)";

  return (
    <section className={`overflow-hidden rounded-3xl border border-border bg-surface ${SOMBRA_DE_TARJETA}`}>
      <header
        data-superficie="honda"
        className="px-4 py-3 lg:px-5"
        style={{ backgroundImage: degradado, color: "var(--color-sobre-relleno)" }}
      >
        <h3 className="font-heading text-lead font-extrabold leading-none">
          {cronograma.nombre} · {semanas} semanas
        </h3>
      </header>

      <div className="overflow-x-auto">
        <div className="flex min-w-[32rem] flex-col gap-1 p-3 lg:p-4">
          <div className="grid items-center gap-x-3" style={{ gridTemplateColumns: columnas }}>
            <span aria-hidden />
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${semanas}, minmax(0, 1fr))` }}>
              {Array.from({ length: semanas }, (_, s) => (
                <span
                  key={s}
                  data-superficie="honda"
                  className="rounded-md py-0.5 text-center font-heading text-kicker font-semibold"
                  style={{ backgroundColor: COLOR_DE_SEMANA[s % COLOR_DE_SEMANA.length], color: "var(--color-sobre-relleno)" }}
                >
                  Semana {s + 1}
                </span>
              ))}
            </div>
          </div>

          {cronograma.actividades.map((a, i) => {
            // Los días van del 1 en adelante y `hasta` es inclusivo: la barra
            // empieza al inicio del día `desde` y termina al final del `hasta`.
            const inicio = a.desde - 1;
            const fin = a.hasta;
            return (
              <div key={`${a.nombre}-${i}`} className="grid items-center gap-x-3" style={{ gridTemplateColumns: columnas }}>
                <span className="text-kicker font-medium leading-tight text-ink">{a.nombre}</span>
                <div className="relative grid h-5 overflow-hidden rounded-full" style={{ gridTemplateColumns: `repeat(${dias}, minmax(0, 1fr))` }}>
                  {Array.from({ length: dias }, (_, d) => (
                    <span
                      key={d}
                      aria-hidden
                      className={Math.floor(d / DIAS_POR_SEMANA) % 2 === 0 ? "bg-pista" : "bg-pista-2"}
                      style={{ opacity: Math.floor(d / DIAS_POR_SEMANA) % 2 === 0 ? 1 : 0.55 }}
                    />
                  ))}
                  <span
                    title={a.nombre}
                    className="absolute inset-y-0.5 rounded-full"
                    style={{
                      left: `${(inicio / dias) * 100}%`,
                      width: `${((fin - inicio) / dias) * 100}%`,
                      backgroundImage: FASES[a.fase].barra,
                      minWidth: "0.75rem",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function revisarActividad(a: ActividadDelCronograma, cronograma: string) {
  if (a.desde < 1 || a.hasta < a.desde) {
    throw new Error(
      `En el cronograma "${cronograma}", la actividad "${a.nombre}" va del día ${a.desde} al ${a.hasta}: los días empiezan en 1 y "hasta" no puede ser antes de "desde".`,
    );
  }
}

function LeyendaDeFases({ fases }: { fases: FaseDelCronograma[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Fases del cronograma">
      {fases.map((f) => (
        <li key={f} className="flex items-center gap-2 text-kicker text-ink-2">
          <span aria-hidden className="h-3 w-6 rounded-full" style={{ backgroundImage: FASES[f].barra }} />
          {FASES[f].etiqueta}
        </li>
      ))}
    </ul>
  );
}
