import Image from "next/image";
import { StoryCardFrame } from "@/components/story/StoryCardFrame";
import type { LaminaPortada, LogoDelCliente } from "@/lib/propuesta/tipos";

/**
 * La portada de una propuesta.
 *
 * Las decisiones que la definen:
 *
 * 1. ES LA LÁMINA CON MÁS PESO VISUAL Y VA SOBRE EL DEGRADADO DE MARCA, con
 *    una franja diagonal más clara que lo cruza y el título anclado ABAJO. Es
 *    gemela del cierre: la propuesta abre y cierra igual. Con una foto del
 *    giro también funciona, bajo el duotono morado, pero es opcional: se probó
 *    con foto y salió casi negra y recargada.
 *
 * 2. EL LOGO DEL CLIENTE VA COMO ARTWORK, SIN RECOLOREAR. Un logo de colores
 *    o con fondo blanco va sobre una placa blanca; uno claro, pensado para
 *    fondo oscuro, va directo sobre el morado (una placa blanca lo borraría;
 *    ya pasó). Lo decide `logo.fondo` en la ficha.
 *
 * 3. ATLANTIA NO SE REPITE AQUÍ: su logo vive en la barra de arriba. La
 *    portada sólo la nombra en la línea de pie.
 */
export function Portada({
  lamina,
  cliente,
  logo,
  fecha,
}: {
  lamina: LaminaPortada;
  cliente: string;
  logo?: LogoDelCliente;
  fecha: string;
}) {
  return (
    <StoryCardFrame
      tone="primary"
      bgImage={lamina.foto}
      dense
      decoration={lamina.foto ? undefined : <FranjaDiagonal />}
    >
      <div className="stagger mt-auto flex flex-col gap-6 lg:gap-8">
        <p className="kicker-marca-claro font-heading text-kicker font-bold uppercase tracking-[0.2em]">
          Propuesta de investigación
        </p>

        <h1 className="font-heading text-h1 font-extrabold leading-[1.02]">{lamina.titulo}</h1>

        <p className="text-lead leading-relaxed opacity-90">{lamina.bajada}</p>

        <ul className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {lamina.soluciones.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              {i > 0 ? (
                <span aria-hidden className="font-heading text-lead font-bold opacity-70">
                  +
                </span>
              ) : null}
              <span className="rounded-full border border-white/45 px-4 py-1.5 font-heading text-body font-semibold">
                {s}
              </span>
            </li>
          ))}
        </ul>

        {lamina.frase ? <p className="text-lead leading-relaxed opacity-85">{lamina.frase}</p> : null}

        <div className="mt-2 flex flex-wrap items-center justify-between gap-6 border-t border-white/25 pt-6">
          <p className="text-body font-medium opacity-85">Atlantia | Propuesta de investigación | {fecha}</p>
          {logo ? <LogoEnPortada logo={logo} cliente={cliente} /> : null}
        </div>
      </div>
    </StoryCardFrame>
  );
}

function LogoEnPortada({ logo, cliente }: { logo: LogoDelCliente; cliente: string }) {
  const imagen = (
    <Image
      src={logo.archivo}
      alt={cliente}
      width={logo.ancho}
      height={logo.alto}
      className={logo.fondo === "directo" ? "h-20 w-auto lg:h-28" : "h-8 w-auto lg:h-10"}
      priority
    />
  );
  if (logo.fondo === "directo") return imagen;
  return (
    <div data-superficie="clara" className="flex items-center rounded-2xl bg-surface px-5 py-3 lg:px-6 lg:py-4">
      {imagen}
    </div>
  );
}

/** La franja más clara que cruza el morado. La comparten la portada y el cierre. */
export function FranjaDiagonal() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        clipPath: "polygon(66% 0, 100% 0, 100% 100%, 44% 100%)",
        backgroundImage:
          "linear-gradient(160deg, color-mix(in oklab, var(--color-secondary) 60%, transparent), color-mix(in oklab, var(--color-secondary) 28%, transparent))",
      }}
    />
  );
}
