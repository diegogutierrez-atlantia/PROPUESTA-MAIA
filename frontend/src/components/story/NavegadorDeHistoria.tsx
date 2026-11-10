"use client";

import { useEffect, useRef } from "react";

/**
 * El índice: todas las láminas del reporte, de un vistazo, para saltar.
 *
 * Seis decisiones que lo definen:
 *
 * 1. UN BOTÓN DE "VOLVER AL ÍNDICE" SE QUEDABA CORTO. El índice de una sección
 *    resuelve un acto; esto resuelve el reporte. Quien presenta necesita llegar
 *    a la lámina que le están pidiendo, no regresar a un menú y desde ahí
 *    buscar. Son treinta láminas: a flechazos, la de precio está a veinte
 *    golpes de la de categoría.
 *
 * 2. SE ABRE CON UNA TECLA Y SE CIERRA CON ESCAPE. Presentar es tener las manos
 *    ocupadas. La tecla es la I de índice. También lo abre el botón de tres
 *    rayas de la barra de arriba, que es donde lo busca quien no se sabe el
 *    atajo.
 *
 * 3. LOS ACTOS SON LA ESTRUCTURA, no una lista de treinta renglones. Van
 *    numerados —01, 02, 03— porque un número ordena una lista que si no se lee
 *    como un montón.
 *
 * 4. EL NOMBRE DE CADA LÁMINA LO PONE EL ARMADO (`lib/propuesta/armar.tsx`), a
 *    partir de su título, no se adivina del componente. Ya salió una clave de
 *    código en un entregable.
 *
 * 5. LA LÁMINA ACTUAL SE MARCA, y con ella su acto. Lo primero que quien lo
 *    abre necesita saber es dónde está.
 *
 * 6. ES UN CAJÓN POR LA IZQUIERDA, no una ventana centrada. Alineado con los
 *    demás tableros de la casa, y de paso: el número de lámina cabe al final
 *    de cada renglón —en tres columnas no había dónde ponerlo— y la lista se
 *    recorre con la rueda en vez de saltar de columna, que es como se lee un
 *    índice. Se abre, se usa y se va.
 */

export interface LaminaDelMapa {
  clave: string;
  rotulo: string;
  /**
   * Posición en el RECORRIDO, que sólo cuenta las láminas visibles. Es lo que
   * necesita `onIr`. Una lámina apagada no tiene posición: lleva -1.
   */
  cardIndex: number;
  /** Apagada en el modo presentación: se lista atenuada y no entra al recorrido. */
  apagada?: boolean;
}

export interface ActoDelMapa {
  titulo: string;
  laminas: LaminaDelMapa[];
}

/**
 * El ojo que prende y apaga una lámina desde el índice.
 *
 * Va DESPUÉS del nombre, en una columna fija al borde derecho del panel: con
 * títulos de uno y de tres renglones, un ojo que siguiera al texto quedaría a
 * distinta altura en cada fila y habría que buscarlo.
 *
 * `self-start` lo ancla al primer renglón de un título largo, no al centro del
 * bloque: la fila se lee de arriba hacia abajo y el control pertenece al inicio.
 *
 * El área de clic es de 32×32 aunque el icono mida 16: un objetivo del tamaño
 * del dibujo se falla seguido.
 *
 * Es un <button> hermano del de la fila, no uno dentro de otro: saltar a la
 * lámina y ocultarla son dos acciones distintas, y así el tabulador las
 * recorre por separado.
 */
function Ojo({
  apagada,
  rotulo,
  onClick,
}: {
  apagada: boolean;
  rotulo: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${apagada ? "Mostrar" : "Ocultar"} ${rotulo}`}
      aria-pressed={apagada}
      title={apagada ? "Mostrar en el recorrido" : "Ocultar del recorrido"}
      onClick={(e) => {
        // El clic se detiene aquí: arriba está el velo que cierra el índice.
        e.stopPropagation();
        onClick();
      }}
      className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-lg transition-colors hover:bg-surface-2"
      style={{ color: apagada ? "var(--muted)" : "var(--ink-2)", opacity: apagada ? 1 : 0.55 }}
    >
      {apagada ? (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8.2 4.2A7.7 7.7 0 0110 4c4 0 7 4 7 6a7.9 7.9 0 01-1.7 2.9M12.5 12.5A3 3 0 018 8M5.3 5.4C3.9 6.5 3 8.1 3 10c0 2 3 6 7 6 1.2 0 2.3-.3 3.2-.8M3 3l14 14" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M10 4c4 0 7 4 7 6s-3 6-7 6-7-4-7-6 3-6 7-6z" />
          <circle cx="10" cy="10" r="2.4" />
        </svg>
      )}
    </button>
  );
}

export function NavegadorDeHistoria({
  actos,
  actual,
  total,
  titulo,
  onIr,
  onCerrar,
  onAlternar,
  onAlternarActo,
}: {
  actos: ActoDelMapa[];
  /** La lámina en curso, por su posición en el recorrido. */
  actual: { cardIndex: number };
  /** Cuántas láminas tiene el reporte, para el pie. */
  total: number;
  /** El mismo rótulo del estudio que lleva la barra de arriba. */
  titulo: string;
  onIr: (l: LaminaDelMapa) => void;
  onCerrar: () => void;
  /**
   * Prender y apagar láminas desde aquí. Los ojos son parte del índice y
   * están siempre a la vista: armar una vista a la medida es algo que hace
   * tanto quien presenta como quien recibe el reporte.
   */
  onAlternar?: (clave: string) => void;
  /** Lo mismo para un acto completo, por su título (que no cambia al apagar). */
  onAlternarActo?: (titulo: string, encender: boolean) => void;
}) {
  const conOjos = Boolean(onAlternar);
  const caja = useRef<HTMLDivElement>(null);
  const activo = useRef<HTMLButtonElement>(null);

  // El foco entra al panel al abrirlo: si se queda en el contenedor de la
  // historia, las flechas siguen pasando láminas por debajo del índice.
  useEffect(() => {
    caja.current?.focus();
    // Y la lámina en curso se trae a la vista: con seis actos listados, la del
    // acto 5 queda fuera de pantalla y el panel abriría "en blanco".
    activo.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div
      className="absolute inset-0 z-40 flex"
      // El clic en el velo cierra. Y para el shell, porque el contenedor de la
      // historia reacciona a los clics.
      onClick={(e) => {
        e.stopPropagation();
        onCerrar();
      }}
      style={{ backgroundColor: "color-mix(in oklab, var(--color-primary-900) 62%, transparent)", backdropFilter: "blur(4px)" }}
    >
      <div
        ref={caja}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Índice del reporte"
        className="cajon-entra flex h-full w-full max-w-[30rem] flex-col bg-papel shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Las flechas no deben pasar láminas mientras el índice está
          // abierto: aquí sólo se decide a dónde ir.
          if (e.key === "Escape" || e.key.toLowerCase() === "i") {
            e.preventDefault();
            e.stopPropagation();
            onCerrar();
          }
          if (e.key.startsWith("Arrow")) e.stopPropagation();
        }}
      >
        <header className="flex shrink-0 items-start justify-between gap-4 px-7 pt-7 pb-5">
          <div className="min-w-0">
            <p className="kicker-marca font-heading text-kicker font-bold tracking-[0.18em] uppercase">Índice</p>
            <p className="mt-1 truncate font-heading text-lead font-extrabold" style={{ color: "var(--tinta-marca)" }}>
              {titulo}
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar el índice"
            className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <svg viewBox="0 0 20 20" className="h-[1.125rem] w-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </header>

        <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {actos.map((acto, i) => {
            // El acto en curso se deduce de las filas del PROPIO índice, no del
            // número que llega de fuera: ese viene de la lista de láminas
            // visibles, y el índice numera incluyendo las apagadas. Al apagar
            // un acto los dos se desfasan y quedaba marcado el acto equivocado.
            const actoActivo = acto.laminas.some(
              (l) => l.cardIndex >= 0 && l.cardIndex === actual.cardIndex,
            );
            return (
              <section key={acto.titulo + i} className="mb-6 last:mb-2">
                {/* El ojo del acto vive FUERA del bloque con padding, igual
                    que el de cada lámina: así los tres quedan en la misma
                    columna. Antes el del acto heredaba el `px-3` del título y
                    se recorría a la izquierda. */}
                <h3 className="mb-2 flex items-center gap-1">
                  <span className="flex min-w-0 flex-1 items-center gap-3 px-3">
                    {/* El número del acto. Relleno cuando es el acto en curso:
                        es la única marca que se ve sin leer, y por eso es la
                        que orienta al abrir. */}
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-heading text-kicker font-bold tabular-nums"
                      style={
                        actoActivo
                          ? { backgroundColor: "var(--color-turquoise-ink)", color: "var(--color-sobre-relleno)" }
                          : { backgroundColor: "var(--surface-2)", color: "var(--muted)" }
                      }
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="min-w-0 flex-1 truncate font-heading text-body font-bold"
                      style={{ color: actoActivo ? "var(--tinta-marca)" : "var(--ink-2)" }}
                    >
                      {acto.titulo}
                    </span>
                  </span>
                  {/* El ojo del acto prende o apaga sus láminas de una vez.
                      Apagar un acto de seis con seis clics es la clase de
                      fricción que hace que nadie use la función. */}
                  {conOjos ? (
                    <Ojo
                      apagada={acto.laminas.every((l) => l.apagada)}
                      rotulo={`el acto ${acto.titulo}`}
                      onClick={() =>
                        onAlternarActo?.(acto.titulo, acto.laminas.every((l) => l.apagada))
                      }
                    />
                  ) : null}
                </h3>

                <ul className="flex flex-col gap-0.5">
                  {acto.laminas.map((l) => {
                    // Basta con la posición en el recorrido: es única entre
                    // las visibles. Comparar además el acto fallaba, porque la
                    // lista de actos del recorrido y la del índice ya no tienen
                    // los mismos índices (el índice incluye los apagados).
                    const aqui = l.cardIndex >= 0 && l.cardIndex === actual.cardIndex;
                    return (
                      <li key={l.clave} className="flex items-stretch gap-1">
                        {/* DOS BOTONES HERMANOS, no uno dentro de otro: saltar
                            a la lámina y ocultarla son dos acciones distintas,
                            así que cada una es su propio <button>. Anidarlos
                            obligaría a degradar la fila a un div con rol, y el
                            tabulador dejaría de recorrerlos por separado. */}
                        <button
                          type="button"
                          ref={aqui ? activo : undefined}
                          onClick={(e) => {
                            e.stopPropagation();
                            onIr(l);
                          }}
                          aria-current={aqui ? "true" : undefined}
                          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-1.5 text-left text-body transition-colors hover:bg-surface-2"
                          style={{
                            ...(aqui
                              ? { backgroundColor: "var(--surface-2)", color: "var(--tinta-marca)", fontWeight: 700 }
                              : { color: "var(--ink-2)" }),
                            // Apagada: se queda en su sitio, atenuada y tachada.
                            // Si desapareciera de la lista nadie podría volver a
                            // prenderla, y la numeración bailaría en cada clic.
                            ...(l.apagada
                              ? { opacity: 0.45, textDecoration: "line-through" }
                              : null),
                          }}
                        >
                          <span
                            aria-hidden
                            className="ml-2 h-1.5 w-1.5 shrink-0 self-start rounded-full"
                            style={{
                              marginTop: "0.5rem",
                              backgroundColor: aqui ? "var(--color-turquoise-ink)" : "var(--border)",
                            }}
                          />
                          <span className="min-w-0 flex-1 leading-snug">{l.rotulo}</span>
                          {/* El número de lámina. Es lo que se dicta en voz alta
                              cuando alguien pide la 14. */}
                          <span
                            className="shrink-0 self-start text-kicker tabular-nums"
                            style={{ color: aqui ? "var(--tinta-marca)" : "var(--muted)" }}
                          >
                            {l.apagada ? "—" : l.cardIndex + 1}
                          </span>
                        </button>

                        {conOjos ? (
                          <Ojo
                            apagada={Boolean(l.apagada)}
                            rotulo={l.rotulo}
                            onClick={() => onAlternar?.(l.clave)}
                          />
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </nav>

        <footer className="flex shrink-0 items-center justify-between gap-4 border-t border-border px-7 py-4 text-kicker text-muted">
          <span className="tabular-nums">
            Lámina {actual.cardIndex + 1} de {total}
          </span>
          <span>
            <kbd className="rounded border border-border px-1.5 py-0.5 font-heading">Esc</kbd> para cerrar
          </span>
        </footer>
      </div>
    </div>
  );
}
