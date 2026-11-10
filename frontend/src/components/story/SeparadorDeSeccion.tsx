import { StoryCardFrame, type StoryTone } from "./StoryCardFrame";

/**
 * La lámina que abre un capítulo: número, título y nada más.
 *
 * Las tres decisiones que la definen:
 *
 * 1. NO LLEVA DATO. Es una pausa, y su trabajo es que el lector sepa que
 *    cambió de tema. Meterle una cifra la convierte en una lámina más y le
 *    quita justo lo que la hace útil.
 *
 * 2. ES DE COLOR, SIEMPRE. Es la que rompe la racha: cuatro láminas claras
 *    seguidas se leen como la misma lámina aunque digan cosas distintas (ver
 *    `05`, "romper el formato a propósito"). El separador es el respiro.
 *
 * 3. FUNCIONA SIN FOTO. Si el estudio no trae imágenes, el fondo de marca con
 *    su grano y sus formas flotantes sostiene la lámina solo. El día que
 *    lleguen las fotos se pasa `imagen` y no hay que tocar nada más: es la
 *    misma regla de "haz que la lámina funcione desde hoy" del catálogo.
 *
 * 4. LA FOTO VA SIEMPRE BAJO EL DUOTONO MORADO. Una foto a color crudo mete a
 *    la lámina una paleta que no es la del reporte —los rojos y verdes de un
 *    anaquel, por ejemplo— y rompe la continuidad de todo lo demás. El velo la
 *    trae de vuelta a la marca y de paso sostiene el texto blanco encima.
 *
 *    El tratamiento SUAVE (`fotoOscura`) baja ese velo, y es sólo para fotos
 *    que ya vienen oscuras: sobre una foto clara deja la imagen casi cruda.
 */
export function SeparadorDeSeccion({
  numero,
  titulo,
  entrada,
  tono = "primary",
  imagen,
  fotoOscura = false,
}: {
  /** El número del capítulo. Se pinta con cero a la izquierda. */
  numero: number;
  titulo: string;
  /** Una línea que dice de qué va el capítulo. Opcional. */
  entrada?: string;
  tono?: StoryTone;
  /** Ruta a una foto de fondo, cuando el estudio tenga uno. */
  imagen?: string;
  /** Sólo para fotos que ya vienen oscuras: baja la intensidad del velo. */
  fotoOscura?: boolean;
}) {
  return (
    <StoryCardFrame tone={tono} bgImage={imagen} bgSuave={fotoOscura} dense>
      {/* Anclado ABAJO (mt-auto): el número y el título asientan la lámina y
          la textura ocupa el resto. Centrado se leía como una portada; arriba,
          como un encabezado suelto. */}
      <div className="mt-auto flex flex-col gap-6 lg:gap-8">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 font-heading text-lead font-bold tabular-nums lg:h-16 lg:w-16"
          aria-hidden="true"
        >
          {String(numero).padStart(2, "0")}
        </span>

        <h2 className="font-heading text-h1 font-extrabold leading-[1.02]">
          {titulo}
        </h2>

        {entrada ? (
          <p className="text-lead leading-relaxed opacity-85">{entrada}</p>
        ) : null}
      </div>
    </StoryCardFrame>
  );
}
