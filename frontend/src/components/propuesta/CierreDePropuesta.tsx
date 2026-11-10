import Image from "next/image";
import { StoryCardFrame } from "@/components/story/StoryCardFrame";
import { rutaDeMarca } from "@/components/marca/AtlantiaMark";
import type { Vendedor } from "@/casa/vendedores";
import { FranjaDiagonal } from "./Portada";

/**
 * El cierre: la marca, la frase y quien presenta la propuesta.
 *
 * Las decisiones que la definen:
 *
 * 1. LO ÚLTIMO QUE SE LLEVA EL CLIENTE ES UNA CARA: la persona que vende. El
 *    logo de Atlantia arriba, la frase en medio y abajo la foto en círculo con
 *    el nombre.
 *
 * 2. SOBRIO A PROPÓSITO. Una versión con el "Gracias" gigante en degradado,
 *    la frase en negritas y el nombre en título se veía saturada: cuatro cosas
 *    gritando a la vez. El agradecimiento va como una línea discreta.
 *
 * 3. MISMO FONDO QUE LA PORTADA (morado con la franja diagonal): la propuesta
 *    abre y cierra igual.
 *
 * 4. LA FOTO SE RECORTA EN CÍRCULO Y SE AMPLÍA UN POCO: las fotos de perfil
 *    suelen llegar con esquinas de otro color. Sin foto, las iniciales.
 */
export function CierreDePropuesta({ frase, vendedor }: { frase: string; vendedor: Vendedor }) {
  const iniciales = vendedor.nombre
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <StoryCardFrame tone="primary" dense decoration={<FranjaDiagonal />}>
      <div className="stagger flex flex-1 flex-col items-center justify-between gap-8 text-center lg:gap-10">
        <Image
          src={rutaDeMarca("insights", "blanco")}
          alt="Atlantia Insights"
          width={640}
          height={200}
          unoptimized
          priority
          className="h-16 w-auto lg:h-20"
        />

        <p className="max-w-[80ch] text-lead font-medium leading-relaxed opacity-95">{frase}</p>

        <div className="flex flex-col items-center gap-5 lg:gap-6">
          <div className="flex w-full items-center justify-center gap-5">
            <span aria-hidden className="h-px w-16 bg-white/40 lg:w-28" />
            <p className="font-heading text-body font-semibold uppercase tracking-[0.35em]">Gracias</p>
            <span aria-hidden className="h-px w-16 bg-white/40 lg:w-28" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 lg:h-28 lg:w-28">
              {vendedor.foto ? (
                <Image src={vendedor.foto} alt={vendedor.nombre} fill sizes="8rem" className="scale-[1.12] object-cover" />
              ) : (
                <span className="font-heading text-h3 font-extrabold">{iniciales}</span>
              )}
            </div>
            <p className="font-heading text-lead font-bold leading-tight">{vendedor.nombre}</p>
            <p className="text-body opacity-85">{vendedor.linea}</p>
            {vendedor.correo && <p className="text-body opacity-85">{vendedor.correo}</p>}
          </div>
        </div>
      </div>
    </StoryCardFrame>
  );
}
