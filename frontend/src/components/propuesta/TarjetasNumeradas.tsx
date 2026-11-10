import { TARJETA } from "./estilos";
import { columnasConSeparadorLg, columnasLg } from "./rejillas";
import type { PiezaNumerada } from "@/lib/propuesta/tipos";

/**
 * Dos a cuatro tarjetas numeradas en una fila: las dimensiones del problema,
 * las perspectivas de la propuesta o los retos del cliente.
 *
 * Las decisiones que la definen:
 *
 * 1. CADA TARJETA: UN DISCO CON EL NÚMERO, EL ÍCONO, UN KICKER Y LA IDEA EN
 *    GRANDE. La idea es lo que el lector recuerda; el texto es para quien
 *    quiere el detalle.
 *
 * 2. SI SE SUMAN, VAN UNIDAS CON "+" (U&A + Brand Awareness: dos miradas que
 *    se complementan). Sin "+", se leen como tres frentes del mismo problema.
 *    Nunca con flechas: una flecha diría "primero esto y luego aquello", y eso
 *    es la lámina de método, no ésta.
 *
 * 3. LA FRASE DE CIERRE, SI LA HAY, VA EN UNA BANDA CON EL DEGRADADO INSIGNIA:
 *    remata "tres cosas que son una".
 *
 * 4. NO LLEVA DATO NI GRÁFICA: es argumento.
 */
export function TarjetasNumeradas({
  titulo,
  texto,
  invitacion,
  piezas,
  unidasCon,
  cierre,
}: {
  titulo: string;
  texto?: string;
  invitacion?: string;
  piezas: PiezaNumerada[];
  unidasCon?: "+";
  cierre?: string;
}) {
  const columnas = unidasCon ? columnasConSeparadorLg(piezas.length) : columnasLg(piezas.length);
  return (
    <div className="flex flex-1 flex-col justify-center gap-5 lg:gap-6">
      <header className="stagger flex flex-col gap-2 lg:gap-3">
        <h2 className="font-heading text-h2 font-extrabold text-ink">{titulo}</h2>
        {texto ? <p className="text-body leading-relaxed text-ink-2">{texto}</p> : null}
        {invitacion ? <p className="font-heading text-body font-semibold text-tinta-marca">{invitacion}</p> : null}
      </header>

      <ol className={`stagger grid gap-4 lg:gap-5 ${columnas}`}>
        {piezas.flatMap((p, i) => {
          const Icono = p.icono;
          const tarjeta = (
            <li key={p.titulo} className={`flex flex-col gap-3 p-5 lg:p-6 ${TARJETA}`}>
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  data-superficie="honda"
                  className="flex h-11 w-11 items-center justify-center rounded-full font-heading text-body font-extrabold tabular-nums lg:h-12 lg:w-12"
                  style={{ backgroundColor: "var(--color-primary)", color: "var(--color-sobre-relleno)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icono className="h-7 w-7 text-tinta-marca lg:h-8 lg:w-8" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="kicker-marca font-heading text-kicker font-bold uppercase tracking-[0.2em]">{p.etiqueta}</p>
              <h3 className="font-heading text-lead font-bold leading-tight text-ink">{p.titulo}</h3>
              <p className="text-body text-ink-2">{p.texto}</p>
            </li>
          );
          if (!unidasCon || i === 0) return [tarjeta];
          return [
            <li
              key={`union-${i}`}
              aria-hidden
              className="flex items-center justify-center font-heading text-h2 font-bold text-tinta-marca"
            >
              +
            </li>,
            tarjeta,
          ];
        })}
      </ol>

      {cierre ? (
        <>
          <div aria-hidden className="mx-auto h-3 w-px bg-border lg:h-4" />
          <div
            data-superficie="honda"
            className="rounded-2xl p-5 text-center lg:p-7"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "var(--color-sobre-relleno)",
            }}
          >
            <p className="font-heading text-h3 font-bold leading-snug">{cierre}</p>
          </div>
        </>
      ) : null}
    </div>
  );
}
