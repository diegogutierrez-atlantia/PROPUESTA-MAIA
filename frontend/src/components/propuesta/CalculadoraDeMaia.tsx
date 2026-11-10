"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw, Undo2 } from "lucide-react";
import { herramientasDeMaia } from "@/casa/maia";
import { dinero, numero } from "@/lib/propuesta/formato";
import type { TramoDeCreditos } from "@/lib/propuesta/tipos";

/**
 * Calculadora de herramientas de MAIA y créditos: el cliente marca lo que le
 * interesa y ve, en el momento, cuántos créditos son, a cuánto sale cada uno
 * y cuánto cuesta en total.
 *
 * Las decisiones que la definen:
 *
 * 1. EL PRECIO DEPENDE SÓLO DE CUÁNTOS PROYECTOS SE CONTRATAN, y cada unidad
 *    cuenta aunque repita herramienta (decisión del operador, 2026-10-15). Los
 *    tramos los da el vendedor; la calculadora no sabe de ningún precio, sólo
 *    busca en qué tramo cae la cuenta.
 * 2. SE COMPARA CONTRA DOS ESCENARIOS con las mismas reglas: contratar cada
 *    herramienta por separado (cada una paga el primer tramo) y contratar todas.
 * 3. EL TECLADO DEL RECORRIDO NO SE ROBA LOS BOTONES: con el foco en un botón,
 *    la barra espaciadora marca la herramienta en vez de saltar de lámina.
 * 4. LAS TARJETAS VOLTEAN AL PICAR: al frente, qué es y cuánto cuesta en
 *    créditos; al reverso, qué hace. Una sola a la vez.
 * 5. LAS HERRAMIENTAS SON DE LA CASA (`casa/maia.ts`); la propuesta sólo dice
 *    cuáles entran, por su sigla.
 */

/** Tope de unidades por herramienta, para que un clic sostenido no se vaya al infinito. */
const MAXIMO = 99;

function tramoDe(n: number, tramos: TramoDeCreditos[]): TramoDeCreditos | null {
  if (n < 1) return null;
  // Pasado el último tramo se queda en él: el mejor precio no se pierde por
  // pedir más unidades de las que la tabla nombra.
  const ultimo = tramos[tramos.length - 1];
  if (ultimo && n > ultimo.hasta) return ultimo;
  return tramos.find((t) => n >= t.desde && n <= t.hasta) ?? null;
}

function rotuloDeTramo(t: TramoDeCreditos) {
  if (t.desde === t.hasta) return t.desde === 1 ? "1 proyecto" : `${t.desde} proyectos`;
  return `${t.desde} a ${t.hasta} proyectos`;
}

export function CalculadoraDeMaia({
  siglas,
  tramos,
  moneda,
}: {
  siglas: string[];
  tramos: TramoDeCreditos[];
  /** "MXN", "USD". */
  moneda: string;
}) {
  const proyectos = useMemo(() => herramientasDeMaia(siglas), [siglas]);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [abierta, setAbierta] = useState<string | null>(null);

  const calculo = useMemo(() => {
    const sel = proyectos.filter((p) => (cantidades[p.sigla] ?? 0) > 0);
    const unidades = sel.reduce((s, p) => s + cantidades[p.sigla], 0);
    const creditos = sel.reduce((s, p) => s + p.creditos * cantidades[p.sigla], 0);
    const tramo = tramoDe(unidades, tramos);
    const total = tramo ? creditos * tramo.precio : 0;

    const primero = tramos[0];
    const separado = primero ? creditos * primero.precio : 0;

    const todos = proyectos.reduce((s, p) => s + p.creditos, 0);
    const tramoTodos = tramoDe(proyectos.length, tramos);
    const totalTodos = tramoTodos ? todos * tramoTodos.precio : 0;

    const siguiente = tramo ? tramos.find((t) => t.desde > unidades) : undefined;
    return { sel, unidades, creditos, tramo, total, separado, todos, tramoTodos, totalTodos, siguiente };
  }, [cantidades, proyectos, tramos]);

  const cambiar = (id: string, delta: number) =>
    setCantidades((prev) => {
      const n = Math.max(0, Math.min(MAXIMO, (prev[id] ?? 0) + delta));
      return { ...prev, [id]: n };
    });
  const hayElegidos = calculo.unidades > 0;

  const hayAhorro = calculo.tramo && calculo.separado > calculo.total;
  const faltan = calculo.siguiente ? calculo.siguiente.desde - calculo.unidades : 0;

  return (
    <div
      className="grid flex-1 gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8"
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") e.stopPropagation();
      }}
    >
      {/* ── Catálogo ─────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4" aria-label="Catálogo de proyectos">
        <div className="flex items-center justify-between gap-4">
          <p className="font-heading text-lead font-semibold ">
            Pica una herramienta para ver qué hace y agrégala
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCantidades(Object.fromEntries(proyectos.map((p) => [p.sigla, Math.max(1, cantidades[p.sigla] ?? 0)])))}
              className="rounded-full border border-white/25 px-4 py-1.5 font-heading text-body font-semibold  transition-colors hover:border-white"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={() => setCantidades({})}
              disabled={!hayElegidos}
              className="flex items-center gap-2 rounded-full border border-white/25 px-4 py-1.5 font-heading text-body font-semibold  transition-colors hover:border-white disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Limpiar
            </button>
          </div>
        </div>

        <ul className="stagger grid flex-1 gap-4 sm:grid-cols-2 sm:grid-rows-2">
          {proyectos.map((p) => {
            const n = cantidades[p.sigla] ?? 0;
            const activo = n > 0;
            const volteada = abierta === p.sigla;
            const acento = p.acento ?? "var(--color-primary)";
            return (
              <li key={p.sigla} className="min-h-[19rem] [perspective:1200px]">
                <div
                  className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d]"
                  style={{ transform: volteada ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  {/* Frente */}
                  <div
                                        aria-hidden={volteada}
                    className={`absolute inset-0 flex flex-col justify-between gap-3 overflow-hidden rounded-2xl border-2 bg-white/10 p-5 shadow-sm backdrop-blur-sm [backface-visibility:hidden] lg:p-6 ${
                      activo ? "border-white" : "border-white/25"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-2"
                      style={{ backgroundColor: acento }}
                    />
                    <button
                      type="button"
                      tabIndex={volteada ? -1 : 0}
                      aria-label={`Ver qué hace ${p.sigla}`}
                      onClick={() => setAbierta(p.sigla)}
                      className="flex flex-1 flex-col justify-between gap-3 text-left"
                    >
                    <div className="mt-2 flex items-start justify-between gap-3">
                      {p.icono ? (
                        <span
                          aria-hidden
                          data-superficie="honda"
                          className="flex h-14 w-14 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: acento, color: p.sobre ?? "var(--color-sobre-relleno)" }}
                        >
                          <p.icono className="h-7 w-7" strokeWidth={1.75} />
                        </span>
                      ) : null}
                      {activo ? (
                        <span
                          data-superficie="honda"
                          className="rounded-full px-3 py-1 font-heading text-body font-bold tabular-nums"
                          style={{ backgroundColor: acento, color: p.sobre ?? "var(--color-sobre-relleno)" }}
                        >
                          En tu cotización · {n}
                        </span>
                      ) : null}
                    </div>
                    <div>
                      <p className="font-heading text-h3 font-extrabold leading-none ">{p.sigla}</p>
                      {p.lema ? (
                        <p className="mt-2 font-heading text-body font-semibold leading-snug ">{p.lema}</p>
                      ) : null}
                    </div>
                    <div className="flex items-end justify-between gap-3">
                      <p className="font-heading text-body font-semibold opacity-80">
                        <span className="font-heading text-h2 font-extrabold tabular-nums ">
                          {p.creditos}
                        </span>{" "}
                        créditos
                      </p>
                      <span className="text-body font-semibold opacity-80">Ver qué hace ↻</span>
                    </div>
                    </button>
                    {activo ? (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Quitar una unidad de ${p.sigla}`}
                          onClick={() => cambiar(p.sigla, -1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/25  transition-colors hover:border-white"
                        >
                          <Minus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        </button>
                        <span className="min-w-8 text-center font-heading text-h3 font-extrabold tabular-nums ">
                          {n}
                        </span>
                        <button
                          type="button"
                          aria-label={`Agregar otra unidad de ${p.sigla}`}
                          onClick={() => cambiar(p.sigla, 1)}
                          disabled={n >= MAXIMO}
                          data-superficie="honda"
                          className="flex h-10 w-10 items-center justify-center rounded-full disabled:opacity-40"
                          style={{ backgroundColor: acento, color: p.sobre ?? "var(--color-sobre-relleno)" }}
                        >
                          <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCantidades((prev) => ({ ...prev, [p.sigla]: 0 }))}
                          className="ml-auto rounded-full border-2 border-white/25 px-4 py-2 font-heading text-body font-semibold  transition-colors hover:border-white"
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                          onClick={() => cambiar(p.sigla, 1)}
                        data-superficie="honda"
                        className="flex items-center justify-center gap-2 rounded-full px-4 py-2.5 font-heading text-body font-bold"
                        style={{ backgroundColor: acento, color: p.sobre ?? "var(--color-sobre-relleno)" }}
                      >
                        <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                        Agregar a la cotización
                      </button>
                    )}
                  </div>

                  {/* Reverso */}
                  <div
                                        aria-hidden={!volteada}
                    className="absolute inset-0 flex flex-col justify-between gap-3 overflow-hidden rounded-2xl border-2 bg-white/10 backdrop-blur-sm p-5 shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] lg:p-6"
                    style={{ borderColor: acento }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-2"
                      style={{ backgroundColor: acento }}
                    />
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-heading text-lead font-extrabold ">
                          {p.nombre ?? p.sigla}
                        </p>
                        <button
                          type="button"
                          tabIndex={volteada ? 0 : -1}
                          aria-label="Volver"
                          onClick={() => setAbierta(null)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25  transition-colors hover:border-white"
                        >
                          <Undo2 className="h-4 w-4" aria-hidden />
                        </button>
                      </div>
                      {p.descripcion ? (
                        <p className="text-body leading-snug opacity-80">{p.descripcion}</p>
                      ) : null}
                      {p.etiquetas?.length ? (
                        <ul className="flex flex-wrap gap-1.5">
                          {p.etiquetas.map((e) => (
                            <li
                              key={e}
                              className="rounded-full border border-white/25 px-2.5 py-0.5 text-body opacity-80"
                            >
                              {e}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Resultado ────────────────────────────────────────────── */}
      <section className="flex flex-col gap-4" aria-label="Resumen de tu selección" aria-live="polite">
        <div
          data-superficie="honda"
          className="flex flex-col gap-5 rounded-2xl p-6 text-white lg:p-8"
          style={{
            backgroundImage:
              "linear-gradient(160deg, var(--color-primary), var(--color-primary-900))",
          }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-heading text-kicker font-bold uppercase tracking-[0.2em] opacity-80">
              Costo estimado
            </span>
            <span className="text-body opacity-80">
              {calculo.unidades === 0
                ? "Sin proyectos"
                : `${calculo.unidades} ${calculo.unidades === 1 ? "proyecto" : "proyectos"}${
                    calculo.unidades !== calculo.sel.length
                      ? ` · ${calculo.sel.length} distinto${calculo.sel.length === 1 ? "" : "s"}`
                      : ""
                  }`}
            </span>
          </div>
          <p className="font-heading text-h1 font-extrabold leading-none tabular-nums">
            {calculo.tramo ? dinero(calculo.total) : "—"}
            {calculo.tramo ? <span className="ml-2 text-lead font-semibold opacity-80">{moneda}</span> : null}
          </p>
          <dl className="grid grid-cols-2 gap-4 border-t border-white/25 pt-4">
            <div>
              <dt className="text-body opacity-80">Créditos</dt>
              <dd className="font-heading text-h3 font-extrabold tabular-nums">
                {numero(calculo.creditos)}
              </dd>
            </div>
            <div>
              <dt className="text-body opacity-80">Precio por crédito</dt>
              <dd className="font-heading text-h3 font-extrabold tabular-nums">
                {calculo.tramo ? dinero(calculo.tramo.precio) : "—"}
              </dd>
            </div>
          </dl>
          <p className="text-body leading-snug opacity-90">
            {calculo.unidades === 0
              ? "Agrega un proyecto para ver cuánto cuesta."
              : hayAhorro
                ? `Ahorras ${dinero(calculo.separado - calculo.total)} frente a contratarlos por separado.`
                : faltan > 0 && calculo.siguiente
                  ? `Con ${faltan} proyecto${faltan === 1 ? "" : "s"} más, el crédito baja a ${dinero(calculo.siguiente.precio)}.`
                  : "Estás en el mejor precio por crédito."}
          </p>
        </div>

        {/* Escalones: dónde cae la selección. */}
        <div
                    className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-5 shadow-sm lg:p-6"
        >
          <p className="kicker-marca-claro font-heading text-kicker font-bold uppercase tracking-[0.2em]">
            Precio por crédito
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {tramos.map((t) => {
              const activo = calculo.tramo === t;
              return (
                <li
                  key={t.desde}
                  className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-2.5 transition-colors ${
                    activo ? "border-white bg-white/20" : "border-transparent"
                  }`}
                >
                  <span className={`text-body ${activo ? "font-semibold " : "opacity-80"}`}>
                    {rotuloDeTramo(t)}
                  </span>
                  <span className="font-heading text-lead font-extrabold tabular-nums ">
                    {dinero(t.precio)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Comparación con otros escenarios. */}
        <div
                    className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-5 shadow-sm lg:p-6"
        >
          <p className="kicker-marca-claro font-heading text-kicker font-bold uppercase tracking-[0.2em]">
            Comparación
          </p>
          <ul className="mt-3 flex flex-col gap-2.5">
            <FilaEscenario
              titulo="Tu selección"
              detalle={
                calculo.tramo
                  ? `${numero(calculo.creditos)} créditos × ${dinero(calculo.tramo.precio)}`
                  : "Elige al menos un proyecto"
              }
              total={calculo.tramo ? dinero(calculo.total) : "—"}
              resaltado
            />
            <FilaEscenario
              titulo="Contratados por separado"
              detalle={
                calculo.tramo
                  ? `${numero(calculo.creditos)} créditos × ${dinero(tramos[0].precio)}`
                  : "—"
              }
              total={calculo.tramo ? dinero(calculo.separado) : "—"}
            />
            <FilaEscenario
              titulo={`Los ${proyectos.length} proyectos`}
              detalle={
                calculo.tramoTodos
                  ? `${numero(calculo.todos)} créditos × ${dinero(calculo.tramoTodos.precio)}`
                  : "—"
              }
              total={calculo.tramoTodos ? dinero(calculo.totalTodos) : "—"}
            />
          </ul>
        </div>
      </section>
    </div>
  );
}

function FilaEscenario({
  titulo,
  detalle,
  total,
  resaltado = false,
}: {
  titulo: string;
  detalle: string;
  total: string;
  resaltado?: boolean;
}) {
  return (
    <li className="flex items-center justify-between gap-4">
      <div>
        <p className={`font-heading text-body ${resaltado ? "font-extrabold" : "font-semibold"} `}>
          {titulo}
        </p>
        <p className="text-body opacity-80">{detalle}</p>
      </div>
      <p
        className={`font-heading tabular-nums  ${
          resaltado ? "text-lead font-extrabold" : "text-lead font-semibold"
        }`}
      >
        {total}
      </p>
    </li>
  );
}
