import type { ReactNode } from "react";
import { Check, Globe2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { COLOR_DE_REGION, MapaDeMexico, type GrupoDelMapa } from "@/components/viz/MapaDeMexico";
import { CONTORNO_DE_ESTADO } from "@/lib/viz/estados-mexico";
import { estiloDeIcono } from "@/lib/story/colores-de-icono";
import type { Cobertura, Renglon, TarjetaConLista } from "@/lib/propuesta/tipos";
import { COLOR_DE_PUNTO, PUNTO, TARJETA } from "./estilos";
import { columnasSm } from "./rejillas";

/**
 * El perfil de la muestra: a quién se entrevista, cómo y dónde, en una lámina.
 *
 * Las decisiones que la definen:
 *
 * 1. LAS CONDICIONES VAN EN TARJETAS A LA IZQUIERDA y la cobertura a la
 *    derecha: a quién, qué se cruza, cuánto dura y cómo se levanta de un lado;
 *    DÓNDE y CUÁNTOS del otro. Es la ficha técnica que el cliente quiere ver
 *    de un vistazo.
 *
 * 2. SÓLO SE ESCRIBE LO QUE APLICA. Una tarjeta vacía o un método que no va,
 *    atenuado, se lee como una promesa a medias. Las tarjetas son las que el
 *    estudio tiene y se acomodan solas en filas de dos y de tres.
 *
 * 3. LA COBERTURA ES UNA DE TRES: el mapa por áreas Nielsen (la de casi
 *    siempre), el mapa con sólo las plazas del estudio iluminadas, o los
 *    países en baldosas iguales (seis países de cuatro continentes no caben
 *    con sentido en un mapa, y una baldosa más grande diría que un país pesa
 *    más).
 *
 * 4. EL RECUADRO PUNTEADO DICE ALCANCE Y MUESTRAS, como texto del vendedor
 *    ("250 / 200"). Nada se calcula aquí.
 */
export function PerfilDeLaMuestra({
  titulo,
  perfil,
  tarjetas,
  recuadro,
  cobertura,
}: {
  titulo: string;
  perfil: Renglon[];
  tarjetas: TarjetaConLista[];
  recuadro: Renglon[];
  cobertura: Cobertura;
}) {
  const sinCobertura = cobertura.tipo === "ninguna";
  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      <h2 className="stagger font-heading text-h3 font-extrabold text-ink">{titulo}</h2>

      <div className={`stagger grid items-stretch gap-3 lg:gap-5 ${sinCobertura ? "" : "lg:grid-cols-[1.1fr_1fr]"}`}>
        <div className="flex flex-col gap-3">
          <section className={`flex flex-col gap-1.5 p-3 lg:p-4 ${TARJETA}`}>
            <Encabezado titulo="Perfilamiento" icono={Users} />
            <ul className="flex flex-col gap-1">
              {perfil.map((r) => (
                <li key={`${r.rotulo ?? ""}${r.valor}`} className="flex items-start gap-2.5 text-kicker text-ink">
                  <Check className="mt-[0.2em] h-4 w-4 shrink-0 text-tinta-marca" strokeWidth={2.75} aria-hidden />
                  <span>
                    {r.rotulo ? <strong className="font-bold">{r.rotulo} </strong> : null}
                    {r.valor}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {filasDeTarjetas(tarjetas).map((fila, i) => (
            <div
              key={i}
              className={`grid gap-3 ${columnasSm(fila.length)}`}
            >
              {fila.map((t) => (
                <section key={t.titulo} className={`flex flex-col gap-1.5 p-3 lg:p-4 ${TARJETA}`}>
                  <Encabezado titulo={t.titulo} icono={t.icono} />
                  <ul className="flex flex-col gap-1">
                    {t.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-kicker text-ink">
                        <span aria-hidden className={PUNTO} style={COLOR_DE_PUNTO} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ))}
        </div>

        <div className={`flex flex-col gap-4 ${sinCobertura ? "" : "lg:min-h-0"}`}>
          <dl
            className="flex flex-col gap-1 rounded-2xl border-2 border-dashed p-4 lg:p-5"
            style={{ borderColor: "var(--color-secondary)" }}
          >
            {recuadro.map((r) => (
              <div key={`${r.rotulo ?? ""}${r.valor}`} className="flex flex-wrap items-baseline gap-x-2">
                {r.rotulo ? <dt className="font-heading text-body font-bold text-tinta-marca">{r.rotulo}:</dt> : null}
                <dd className="font-heading text-lead font-semibold text-ink">{r.valor}</dd>
              </div>
            ))}
          </dl>
          <VistaDeCobertura cobertura={cobertura} />
        </div>
      </div>
    </div>
  );
}

function Encabezado({ titulo, icono: Icono }: { titulo: string; icono: LucideIcon }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        data-superficie="honda"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={estiloDeIcono(0)}
      >
        <Icono className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <h3 className="font-heading text-body font-bold leading-tight text-tinta-marca">{titulo}</h3>
    </div>
  );
}

/**
 * Acomoda las tarjetas en filas de tres; si sobran dos, la primera fila es de
 * dos (cinco tarjetas: dos y tres, como en la propuesta de referencia).
 */
function filasDeTarjetas<T>(tarjetas: T[]): T[][] {
  const resto = [...tarjetas];
  const filas: T[][] = [];
  if (resto.length % 3 === 2 || resto.length === 4) filas.push(resto.splice(0, 2));
  if (resto.length === 2) filas.push(resto.splice(0, 2));
  while (resto.length > 0) filas.push(resto.splice(0, 3));
  return filas;
}

/**
 * El mapa se ajusta al alto que le dejan las tarjetas de al lado, para que la
 * lámina cierre pareja. Con pocas tarjetas ese alto era tan poco que el mapa
 * salía diminuto; por eso tiene un piso.
 */
function MapaConAlto({ children }: { children: ReactNode }) {
  return <div className="flex min-h-[22rem] flex-1 flex-col">{children}</div>;
}

function VistaDeCobertura({ cobertura }: { cobertura: Cobertura }) {
  if (cobertura.tipo === "ninguna") return null;

  if (cobertura.tipo === "nielsen") {
    return (
      <MapaConAlto>
        <MapaDeMexico leyendaAbajo llenarAlto />
      </MapaConAlto>
    );
  }

  if (cobertura.tipo === "plazas") {
    for (const p of cobertura.plazas) {
      if (!CONTORNO_DE_ESTADO[p.estado]) {
        throw new Error(
          `La plaza "${p.etiqueta}" dice estado "${p.estado}", que no está en el mapa. Los nombres válidos: ${Object.keys(
            CONTORNO_DE_ESTADO,
          ).join(", ")}.`,
        );
      }
    }
    const grupos: GrupoDelMapa[] = cobertura.plazas.map((p, i) => ({
      id: p.estado,
      etiqueta: p.etiqueta,
      color: COLOR_DE_REGION[(i * 2) % COLOR_DE_REGION.length],
    }));
    const grupoDeEstado = Object.fromEntries(cobertura.plazas.map((p) => [p.estado, p.estado]));
    return (
      <MapaConAlto>
        <MapaDeMexico grupos={grupos} grupoDeEstado={grupoDeEstado} leyendaAbajo llenarAlto />
      </MapaConAlto>
    );
  }

  return (
    <section className="flex flex-1 flex-col gap-3">
      <p className="flex items-center gap-2 font-heading text-kicker font-bold uppercase tracking-[0.2em] text-tinta-marca">
        <Globe2 className="h-4 w-4" aria-hidden />
        {cobertura.paises.length === 1 ? "Un mercado" : `${cobertura.paises.length} mercados`}
      </p>
      <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
        {cobertura.paises.map((p) => (
          <li
            key={p.clave}
            data-superficie="honda"
            className="relative flex flex-col justify-center overflow-hidden rounded-2xl px-5 py-4"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "var(--color-sobre-relleno)",
            }}
          >
            <span className="font-heading text-h3 font-extrabold leading-none">{p.clave}</span>
            <span className="mt-1 text-body opacity-90">{p.nombre}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
