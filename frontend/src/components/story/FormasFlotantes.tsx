import Image from "next/image";
import type { LucideIcon } from "lucide-react";

/**
 * Capa de ambiente: formas que caen despacio detrás del contenido de una
 * lámina de color. Es lo único del sistema que se mueve en bucle, así que es
 * lo primero que se apaga con `prefers-reduced-motion` (ver documentacion/06-movimiento.md).
 *
 * Cada quinta forma es la marca de Atlantia en vez del ícono: lo bastante
 * seguido para leerse como marca, lo bastante raro para seguir siendo textura
 * y no un logo salpicado por toda la lámina.
 *
 * Pásale los íconos del dominio del estudio (`iconos={[Coffee, Cup]}`) o
 * ninguno, y entonces caen sólo marcas.
 *
 * LA LISTA DE POSICIONES ES FIJA, deliberadamente no `Math.random()`: esto se
 * pinta en el servidor y se hidrata en el cliente, así que aleatorizar por
 * render produce un desajuste de hidratación. Es el mismo principio que la
 * textura determinista de las gráficas (ver 05, "reglas transversales").
 */

const MARCA_CADA = 5;

const FORMAS = [
  { left: 3, size: 14, duration: 8.0, delay: -0.0, drift: -10 },
  { left: 8, size: 16, duration: 8.4, delay: -1.3, drift: -8 },
  { left: 13, size: 18, duration: 8.7, delay: -2.6, drift: -6 },
  { left: 18, size: 20, duration: 9.1, delay: -3.9, drift: 6 },
  { left: 23, size: 22, duration: 9.5, delay: -5.2, drift: 8 },
  { left: 28, size: 24, duration: 9.8, delay: -6.6, drift: 10 },
  { left: 33, size: 26, duration: 10.2, delay: -7.9, drift: -9 },
  { left: 38, size: 14, duration: 10.6, delay: -9.2, drift: 9 },
  { left: 43, size: 16, duration: 11.0, delay: -10.5, drift: 7 },
  { left: 48, size: 18, duration: 11.3, delay: -11.8, drift: -7 },
  { left: 53, size: 20, duration: 11.7, delay: -0.1, drift: -10 },
  { left: 58, size: 22, duration: 12.1, delay: -1.4, drift: -8 },
  { left: 63, size: 24, duration: 12.4, delay: -2.7, drift: -6 },
  { left: 68, size: 26, duration: 12.8, delay: -4.0, drift: 6 },
  { left: 73, size: 14, duration: 13.2, delay: -5.3, drift: 8 },
  { left: 78, size: 16, duration: 13.6, delay: -6.7, drift: 10 },
  { left: 83, size: 18, duration: 13.9, delay: -8.0, drift: -9 },
  { left: 88, size: 20, duration: 14.3, delay: -9.3, drift: 9 },
  { left: 93, size: 22, duration: 14.7, delay: -10.6, drift: 7 },
  { left: 97, size: 24, duration: 8.0, delay: -11.9, drift: -7 },
  { left: 6, size: 26, duration: 8.4, delay: -0.2, drift: -10 },
  { left: 11, size: 14, duration: 8.8, delay: -1.5, drift: -8 },
  { left: 16, size: 16, duration: 9.1, delay: -2.8, drift: -6 },
  { left: 21, size: 18, duration: 9.5, delay: -4.1, drift: 6 },
  { left: 26, size: 20, duration: 9.9, delay: -5.4, drift: 8 },
  { left: 31, size: 22, duration: 10.2, delay: -6.8, drift: 10 },
  { left: 36, size: 24, duration: 10.6, delay: -8.1, drift: -9 },
  { left: 41, size: 26, duration: 11.0, delay: -9.4, drift: 9 },
  { left: 46, size: 14, duration: 11.4, delay: -10.7, drift: 7 },
  { left: 51, size: 16, duration: 11.7, delay: -12.0, drift: -7 },
  { left: 56, size: 18, duration: 12.1, delay: -0.3, drift: -10 },
  { left: 61, size: 20, duration: 12.5, delay: -1.6, drift: -8 },
  { left: 66, size: 22, duration: 12.8, delay: -2.9, drift: -6 },
  { left: 71, size: 24, duration: 13.2, delay: -4.2, drift: 6 },
  { left: 76, size: 26, duration: 13.6, delay: -5.5, drift: 8 },
  { left: 81, size: 14, duration: 13.9, delay: -6.9, drift: 10 },
  { left: 86, size: 16, duration: 14.3, delay: -8.2, drift: -9 },
  { left: 91, size: 18, duration: 14.7, delay: -9.5, drift: 9 },
  { left: 5, size: 20, duration: 8.1, delay: -10.8, drift: 7 },
  { left: 15, size: 22, duration: 8.4, delay: -12.1, drift: -7 },
  { left: 25, size: 24, duration: 8.8, delay: -0.4, drift: -10 },
  { left: 35, size: 26, duration: 9.2, delay: -1.7, drift: -8 },
  { left: 45, size: 14, duration: 9.5, delay: -3.0, drift: -6 },
  { left: 55, size: 16, duration: 9.9, delay: -4.3, drift: 6 },
  { left: 65, size: 18, duration: 10.3, delay: -5.6, drift: 8 },
  { left: 75, size: 20, duration: 10.6, delay: -7.0, drift: 10 },
  { left: 85, size: 22, duration: 11.0, delay: -8.3, drift: -9 },
  { left: 95, size: 24, duration: 11.4, delay: -9.6, drift: 9 },
] as const;

/**
 * Cómo se pinta la capa según el fondo que tenga debajo.
 *
 * No es lo mismo un fondo oscuro que un papel claro que un turquesa saturado:
 * la capa estaba fija en blanco y por eso desaparecía en los dos últimos.
 *
 *   oscuro   morado, marino, tinta, turquesa  -> marca BLANCA
 *   papel    superficie clara                 -> marca a color y MUY tenue,
 *                                                porque encima van las gráficas
 *
 * El turquesa entra en "oscuro" aunque su texto sea oscuro. Aquí probé la marca
 * en morado, razonando que el blanco se lavaría sobre un turquesa brillante, y
 * se ve peor: la marca oscura ensucia y la blanca respira. En una capa de
 * textura al 28% el criterio de contraste de un texto no aplica — se decide
 * viéndolo, no calculándolo.
 */
const TRATAMIENTO = {
  oscuro: { marca: "/brand/atlantia-glifo-blanco.svg", pico: "0.28", icono: "text-white/25" },
  papel: { marca: "/brand/atlantia-glifo-color.svg", pico: "0.10", icono: "text-primary/10" },
} as const;

export type FondoDeFormas = keyof typeof TRATAMIENTO;

export function FormasFlotantes({
  iconos = [],
  fondo = "oscuro",
}: {
  iconos?: LucideIcon[];
  fondo?: FondoDeFormas;
}) {
  const { marca, pico, icono: claseIcono } = TRATAMIENTO[fondo];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FORMAS.map((f, i) => {
        const estilo = {
          left: `${f.left}%`,
          width: f.size,
          height: f.size,
          animationDuration: `${f.duration}s`,
          animationDelay: `${f.delay}s`,
          ["--note-drift" as string]: `${f.drift}px`,
        };

        const esMarca = iconos.length === 0 || i % MARCA_CADA === MARCA_CADA - 1;

        if (esMarca) {
          return (
            <Image
              key={i}
              src={marca}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="note-fall absolute top-0 opacity-0"
              // 0.28 iguala el text-white/25 de los íconos, para que la marca
              // se lea como textura y no como un logo encima de la lámina.
              style={{ ...estilo, ["--note-peak" as string]: pico }}
            />
          );
        }

        const Icono = iconos[i % iconos.length];
        return (
          <Icono
            key={i}
            className={`note-fall absolute top-0 opacity-0 ${claseIcono}`}
            style={estilo}
          />
        );
      })}
    </div>
  );
}
