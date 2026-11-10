import { ChevronDown, ChevronRight } from "lucide-react";
import type { EtapaDelMetodo } from "@/lib/propuesta/tipos";

/**
 * Cómo lo vamos a lograr: las etapas o las propuestas, en tarjetas
 * translúcidas sobre la lámina de color.
 *
 * Las decisiones que la definen:
 *
 * 1. ENCADENADAS O INDEPENDIENTES, Y SE NOTA. Si son pasos de un método
 *    (Market Pulse → cuanti → cuali), entre una tarjeta y otra va un chevrón
 *    que dice "luego". Si son propuestas que se contratan por separado (U&A,
 *    P&POSS, MAIA), van sin flecha: una flecha diría lo contrario de lo que
 *    se está vendiendo.
 *
 * 2. VA SOBRE LÁMINA DE COLOR y las tarjetas son translúcidas, para que el
 *    degradado y el grano sigan asomando.
 *
 * 3. EN ANGOSTO SE APILAN y el chevrón apunta hacia abajo.
 *
 * 4. NO LLEVA CIFRAS: es método.
 */
export function EtapasDelMetodo({
  titulo,
  texto,
  rotuloDeEtapa = "Etapa",
  encadenadas,
  etapas,
}: {
  titulo: string;
  texto?: string;
  rotuloDeEtapa?: string;
  encadenadas: boolean;
  etapas: EtapaDelMetodo[];
}) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-8 lg:gap-12">
      <header className="stagger flex flex-col gap-4">
        <h2 className="font-heading text-h1 font-extrabold leading-[1.02]">{titulo}</h2>
        {texto ? <p className="text-lead leading-relaxed opacity-90">{texto}</p> : null}
      </header>

      <ol className="stagger flex flex-col items-stretch gap-3 lg:flex-row lg:gap-4">
        {etapas.flatMap((e, i) => {
          const Icono = e.icono;
          const tarjeta = (
            <li
              key={e.nombre}
              className="flex flex-1 flex-col gap-4 rounded-2xl border border-white/30 bg-white/10 p-6 lg:gap-5 lg:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="kicker-marca-claro font-heading text-kicker font-bold uppercase tracking-[0.2em]">
                  {rotuloDeEtapa} {i + 1}
                </span>
                <Icono className="h-8 w-8 opacity-90 lg:h-10 lg:w-10" strokeWidth={1.5} aria-hidden />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-heading text-h3 font-bold uppercase leading-tight">{e.nombre}</h3>
                {e.subtitulo ? <p className="font-heading text-lead font-semibold leading-snug">{e.subtitulo}</p> : null}
              </div>
              <p className="text-lead leading-relaxed opacity-90">{e.texto}</p>
            </li>
          );
          if (!encadenadas || i === etapas.length - 1) return [tarjeta];
          return [
            tarjeta,
            <li key={`union-${i}`} aria-hidden className="flex items-center justify-center self-center opacity-70">
              <ChevronDown className="h-7 w-7 lg:hidden" strokeWidth={2} />
              <ChevronRight className="hidden h-8 w-8 lg:block" strokeWidth={2} />
            </li>,
          ];
        })}
      </ol>
    </div>
  );
}
