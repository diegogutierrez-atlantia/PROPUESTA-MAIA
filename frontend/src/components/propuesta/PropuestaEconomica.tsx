import { Check } from "lucide-react";
import { dinero, numero, sumar } from "@/lib/propuesta/formato";
import type { CostoDeLaOpcion, OpcionEconomica } from "@/lib/propuesta/tipos";
import { columnasLg } from "./rejillas";

/**
 * La propuesta económica: una tarjeta por opción, lado a lado.
 *
 * Las decisiones que la definen:
 *
 * 1. SON OPCIONES, NO UNA MAGNITUD: tarjetas con lo mismo adentro, no una
 *    barra que compare precios. Cada una abre con la MUESTRA en cifra grande
 *    (lo que cambia entre una y otra), sigue con lo que incluye y cierra con
 *    los costos.
 *
 * 2. NINGUNA SE MARCA COMO "RECOMENDADA": qué opción conviene es criterio del
 *    vendedor, no de quien arma la lámina.
 *
 * 3. EL TOTAL SE COMPRUEBA. Un total que no es la suma de sus partes es el
 *    error que más cuesta en una propuesta, y se ve perfecto. Si no cuadra, la
 *    lámina no se arma. La excepción es un total con descuento (la compra
 *    conjunta de varios países): va marcado `sinSumar` y con su nota,
 *    y se copia tal cual lo dio el vendedor.
 *
 * 4. CON TOTAL, LOS COSTOS VAN EN CAJAS Y EL TOTAL EN BARRA. SIN TOTAL,
 *    cada costo es una alternativa (una ola o dos) o el único precio, y va en
 *    su propia barra.
 *
 * 5. EL AZUL ES EL COLOR DE ESTA LÁMINA (el degradado Turquoise de la marca,
 *    del turquesa hondo al violeta) en cabeceras y costos. Las tarjetas son
 *    islas claras sobre cualquier tema.
 *
 * Los montos llegan como números y se formatean al pintar, sin redondear.
 */
const DEGRADADO_TURQUESA = "linear-gradient(135deg, var(--color-turquoise-100), var(--color-primary))";

export function PropuestaEconomica({
  titulo,
  opciones,
  moneda,
  pie,
}: {
  titulo: string;
  opciones: OpcionEconomica[];
  /** "MXN + IVA", "USD". */
  moneda: string;
  pie: string;
}) {
  for (const o of opciones) revisarCuentas(o);
  const una = opciones.length === 1;

  return (
    <div className="flex flex-1 flex-col gap-3 lg:gap-4">
      <h2 className="stagger font-heading text-h3 font-extrabold text-ink">{titulo}</h2>

      <div
        className={`stagger grid items-stretch gap-4 lg:gap-5 ${columnasLg(opciones.length)}`}
      >
        {opciones.map((o) => (
          <article
            key={o.etiqueta}
            data-superficie="clara"
            className="flex flex-col overflow-hidden rounded-3xl bg-surface text-ink shadow-[0_1rem_3rem_-1.5rem_color-mix(in_oklab,black_60%,transparent)]"
          >
            <Cabecera opcion={o} />
            {/* Sin nada que decir de lo que incluye, los costos suben: empujados
                abajo dejaban un hueco vacío encima de la tabla. */}
            <div className={`flex flex-1 flex-col gap-3 p-4 lg:p-5 ${una && incluyeAlgo(o) ? "lg:grid lg:grid-cols-2 lg:gap-8" : ""}`}>
              {incluyeAlgo(o) ? <Incluye opcion={o} /> : null}
              <Costos opcion={o} moneda={moneda} arriba={!incluyeAlgo(o)} />
            </div>
          </article>
        ))}
      </div>

      <p className="border-t border-border pt-3 text-[0.6875rem] text-muted">{pie}</p>
    </div>
  );
}

function Cabecera({ opcion }: { opcion: OpcionEconomica }) {
  return (
    <header
      data-superficie="honda"
      className="flex flex-col gap-1 px-5 py-3 lg:px-6"
      style={{ backgroundImage: DEGRADADO_TURQUESA, color: "var(--color-sobre-relleno)" }}
    >
      <p className="font-heading text-kicker font-bold uppercase tracking-[0.2em] opacity-90">{opcion.etiqueta}</p>
      <div
        className="grid text-center"
        style={{ gridTemplateColumns: `repeat(${opcion.cifras.length}, minmax(0, 1fr))` }}
      >
        {opcion.cifras.map((c) => (
          <div key={c.rotulo}>
            <p className="font-heading text-h3 font-extrabold leading-none tabular-nums">{numero(c.valor)}</p>
            <p className="mt-0.5 text-body opacity-90">{c.rotulo}</p>
          </div>
        ))}
      </div>
      {opcion.detalle ? <p className="text-center text-body opacity-90">{opcion.detalle}</p> : null}
    </header>
  );
}

function Incluye({ opcion }: { opcion: OpcionEconomica }) {
  return (
    <div className="flex flex-col gap-2.5">
      {opcion.estudio ? (
        <div className="flex flex-col">
          {opcion.estudio.map((linea, i) => (
            <p key={linea} className={`font-heading text-body font-bold ${i === 0 ? "text-ink" : "text-turquoise-ink"}`}>
              {linea}
            </p>
          ))}
        </div>
      ) : null}

      {opcion.especificaciones ? (
        <div className="flex flex-col gap-1">
          <p className="font-heading text-body font-bold text-turquoise-ink">
            {opcion.especificaciones.titulo ?? "Especificaciones"}
          </p>
          <ul className="flex flex-col gap-0.5">
            {opcion.especificaciones.items.map((e) => (
              <li key={e} className="text-kicker leading-snug text-ink">
                {e}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {opcion.alcances ? (
        <div className="flex flex-col gap-1.5">
          <p className="font-heading text-body font-bold text-turquoise-ink">Alcances muestrales</p>
          <ul className="flex flex-col gap-1">
            {opcion.alcances.map((a) => (
              <li key={`${a.rotulo ?? ""}${a.valor}`} className="flex items-start gap-3 text-kicker text-ink">
                <Check className="mt-[0.2em] h-4 w-4 shrink-0 text-turquoise-ink" strokeWidth={2.75} aria-hidden />
                <span>
                  {a.rotulo ? <strong className="font-bold">{a.rotulo} </strong> : null}
                  {a.valor}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function incluyeAlgo(o: OpcionEconomica) {
  return Boolean(o.estudio?.length || o.especificaciones?.items.length || o.alcances?.length);
}

function Costos({ opcion, moneda, arriba }: { opcion: OpcionEconomica; moneda: string; arriba: boolean }) {
  const costos = opcion.costos ?? [];
  const conTotal = Boolean(opcion.total);
  const cajas = costos.filter((c) => !c.desglose);
  const desglosados = costos.filter((c) => c.desglose);

  return (
    <div className={`flex flex-col gap-2.5 ${arriba ? "" : "mt-auto"}`}>
      {opcion.tabla ? <TablaDePrecios tabla={opcion.tabla} /> : null}

      {conTotal && costos.length > 0 ? (
        <div className={`grid items-stretch gap-2.5 ${cajas.length > 0 && desglosados.length > 0 ? "grid-cols-2" : ""}`}>
          {cajas.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {cajas.map((c) => (
                <CajaDeCosto key={c.rotulo} costo={c} moneda={moneda} />
              ))}
            </div>
          ) : null}
          {desglosados.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {desglosados.map((c) => (
                <CajaDesglosada key={c.rotulo} costo={c} moneda={moneda} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {!conTotal
        ? costos.map((c) => (
            <div key={c.rotulo} className="flex flex-col gap-1.5">
              {c.desglose ? <Desglose desglose={c.desglose} /> : null}
              <BarraDeMonto rotulo={c.rotulo} monto={c.monto} moneda={moneda} />
            </div>
          ))
        : null}

      {opcion.total ? (
        <div className="flex flex-col gap-1">
          <BarraDeMonto rotulo={opcion.total.rotulo} monto={opcion.total.monto} moneda={moneda} grande />
          {opcion.total.nota ? <p className="text-right text-kicker text-ink-2">{opcion.total.nota}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function TablaDePrecios({ tabla }: { tabla: NonNullable<OpcionEconomica["tabla"]> }) {
  const [concepto, muestra, costo] = tabla.columnas;
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border text-muted">
          <th scope="col" className="py-2 font-heading text-[0.6875rem] font-bold uppercase tracking-[0.15em]">
            {concepto}
          </th>
          <th scope="col" className="px-3 py-2 text-right font-heading text-[0.6875rem] font-bold uppercase tracking-[0.15em]">
            {muestra}
          </th>
          <th scope="col" className="py-2 text-right font-heading text-[0.6875rem] font-bold uppercase tracking-[0.15em]">
            {costo}
          </th>
        </tr>
      </thead>
      <tbody>
        {tabla.filas.map((f) => (
          <tr key={f.concepto} className="border-b border-border last:border-b-0">
            <th scope="row" className="py-1.5 text-body font-semibold text-ink">
              {f.concepto}
            </th>
            <td className="px-3 py-1.5 text-right text-body tabular-nums text-ink-2">
              {f.muestra !== undefined ? numero(f.muestra) : ""}
            </td>
            <td className="py-1.5 text-right font-heading text-body font-bold tabular-nums text-ink">{dinero(f.monto)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CajaDeCosto({ costo, moneda }: { costo: CostoDeLaOpcion; moneda: string }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border text-center">
      <p
        className="px-3 py-1 font-heading text-kicker font-semibold"
        data-superficie="honda"
        style={{ backgroundColor: "var(--color-turquoise-100)", color: "var(--color-sobre-relleno)" }}
      >
        {costo.rotulo}
      </p>
      <p className="flex flex-1 items-baseline justify-center gap-2 px-3 py-2">
        <span className="font-heading text-lead font-bold tabular-nums text-ink">{dinero(costo.monto)}</span>
        <span className="text-kicker text-muted">{moneda}</span>
      </p>
    </div>
  );
}

function CajaDesglosada({ costo, moneda }: { costo: CostoDeLaOpcion; moneda: string }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border">
      <p
        className="px-3 py-1 text-center font-heading text-kicker font-semibold"
        data-superficie="honda"
        style={{ backgroundColor: "var(--color-turquoise-100)", color: "var(--color-sobre-relleno)" }}
      >
        {costo.rotulo}
      </p>
      <div className="flex flex-1 flex-col justify-center gap-1 px-3 py-1.5">
        <Desglose desglose={costo.desglose ?? []} />
        <div className="flex items-baseline justify-between gap-3 border-t border-border pt-1.5">
          <span className="font-heading text-kicker font-bold text-ink">TOTAL</span>
          <span className="font-heading text-lead font-bold tabular-nums text-ink">
            {dinero(costo.monto)} <span className="text-kicker font-normal text-muted">{moneda}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Desglose({ desglose }: { desglose: { rotulo: string; monto: number }[] }) {
  return (
    <>
      {desglose.map((d) => (
        <div key={d.rotulo} className="flex items-baseline justify-between gap-3 text-kicker text-ink-2">
          <span>{d.rotulo}</span>
          <span className="font-heading font-bold tabular-nums text-ink">{dinero(d.monto)}</span>
        </div>
      ))}
    </>
  );
}

function BarraDeMonto({
  rotulo,
  monto,
  moneda,
  grande = false,
}: {
  rotulo: string;
  monto: number;
  moneda: string;
  grande?: boolean;
}) {
  return (
    <div className="flex items-stretch overflow-hidden rounded-xl border border-border">
      <p
        className="flex w-2/5 items-center px-4 py-1.5 font-heading text-body font-bold"
        data-superficie="honda"
        style={{ backgroundImage: DEGRADADO_TURQUESA, color: "var(--color-sobre-relleno)" }}
      >
        {rotulo}
      </p>
      <p className="flex flex-1 flex-col items-center justify-center px-4 py-1.5">
        <span className={`font-heading font-extrabold leading-none tabular-nums text-ink ${grande ? "text-h3" : "text-lead"}`}>
          {dinero(monto)}
        </span>
        <span className="mt-0.5 text-kicker text-muted">{moneda}</span>
      </p>
    </div>
  );
}

/**
 * Las cuentas de una opción, antes de pintarla. Revienta con un mensaje que
 * dice qué no cuadra: es Claude quien lo lee y se lo pregunta al vendedor.
 */
function revisarCuentas(o: OpcionEconomica) {
  for (const c of o.costos ?? []) {
    if (!c.desglose) continue;
    const partes = sumar(c.desglose.map((d) => d.monto));
    if (partes !== c.monto) {
      throw new Error(
        `En "${o.etiqueta}", el desglose de "${c.rotulo}" suma ${partes} y el costo dice ${c.monto}. Pregúntale al vendedor cuál es el bueno.`,
      );
    }
  }
  if (!o.total || o.total.sinSumar) return;
  const partes = o.tabla ? o.tabla.filas.map((f) => f.monto) : (o.costos ?? []).map((c) => c.monto);
  const suma = sumar(partes);
  if (suma !== o.total.monto) {
    throw new Error(
      `En "${o.etiqueta}", los costos suman ${suma} y el total dice ${o.total.monto}. Si el total trae descuento, márcalo "sinSumar" con su nota; si no, pregúntale al vendedor cuál es el bueno.`,
    );
  }
}
