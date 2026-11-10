import { estiloDeIcono } from "@/lib/story/colores-de-icono";
import type { PreguntaDeNegocio } from "@/lib/propuesta/tipos";
import { TARJETA } from "./estilos";
import { columnasLg, filasLg } from "./rejillas";

/**
 * Las preguntas de negocio como un mosaico de tarjetas.
 *
 * Las decisiones que la definen:
 *
 * 1. CADA PREGUNTA ES UNA TARJETA CON SU NÚMERO GRANDE en degradado de marca.
 *    Nueve renglones iguales se leen como formulario; un mosaico, como el mapa
 *    de lo que la propuesta va a contestar.
 *
 * 2. LAS COLUMNAS SE LEEN HACIA ABAJO: 1, 2, 3 en la primera; 4, 5, 6 en la
 *    segunda. Regla de la casa. En angosto, una sola columna en el mismo orden.
 *
 * 3. EL NÚMERO ES LA POSICIÓN, no un dato: si se quita una pregunta, se
 *    corren solos.
 *
 * 4. EL TEXTO VA TEXTUAL, como lo escribió el vendedor. El ícono es
 *    decorativo, para escanear.
 *
 * 5. CON DETALLE (una línea bajo la pregunta, si el vendedor la dio), las
 *    tarjetas crecen; sin él, la pregunta se asienta abajo.
 */
export function PreguntasEnMosaico({ titulo, preguntas }: { titulo: string; preguntas: PreguntaDeNegocio[] }) {
  const columnas = preguntas.length <= 4 ? 2 : 3;
  const filas = Math.ceil(preguntas.length / columnas);
  return (
    <div className="flex flex-1 flex-col gap-3 lg:gap-4">
      <h2 className="stagger font-heading text-h3 font-extrabold text-ink">{titulo}</h2>

      <ol
        className={`stagger grid flex-1 gap-2.5 lg:grid-flow-col lg:gap-3 ${columnasLg(columnas)} ${filasLg(filas)}`}
      >
        {preguntas.map((p, i) => {
          const Icono = p.icono;
          return (
            <li key={p.texto} className={`relative flex flex-col justify-between gap-2 overflow-hidden p-3.5 lg:p-4 ${TARJETA}`}>
              <div className="flex items-start justify-between gap-3">
                <span
                  aria-hidden
                  className="font-heading text-h3 font-extrabold leading-[0.9] tabular-nums"
                  style={{
                    backgroundImage: "linear-gradient(135deg, var(--color-secondary), var(--color-violet-60))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  data-superficie="honda"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full lg:h-10 lg:w-10"
                  style={estiloDeIcono(0)}
                >
                  <Icono className="h-[1.125rem] w-[1.125rem] lg:h-5 lg:w-5" strokeWidth={1.75} />
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <p className="font-heading text-body font-semibold leading-snug text-ink">{p.texto}</p>
                {p.detalle ? <p className="text-kicker leading-snug text-ink-2">{p.detalle}</p> : null}
              </div>

              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1"
                style={{ backgroundImage: "linear-gradient(90deg, var(--color-secondary), var(--color-violet-60))" }}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
