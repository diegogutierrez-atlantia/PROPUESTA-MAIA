import type { ReactNode } from "react";
import Image from "next/image";
import { FormasFlotantes } from "./FormasFlotantes";

export type StoryTone =
  | "primary"
  | "secondary"
  | "turquoise"
  | "marino"
  | "ink"
  | "surface"
  | "surface-2";

const TONE_CLASSES: Record<StoryTone, string> = {
  primary: "card-bg-primary text-white",
  secondary: "card-bg-secondary text-white",
  /* El turquesa NO es fondo de lámina: la guía lo reserva a acentos. La clase
     se conserva por compatibilidad y globals.css la pinta como primary. */
  turquoise: "card-bg-turquoise text-white",
  marino: "card-bg-marino text-white",
  ink: "card-bg-ink text-white",
  surface: "card-bg-surface bg-surface text-ink",
  /* El segundo tono claro. Existe para que doce láminas de datos seguidas no se
     lean como la misma lámina: el texto sigue siendo oscuro, así que ninguna
     gráfica pierde contraste, y aun así el recorrido respira. */
  "surface-2": "card-bg-surface-alt text-ink",
};

interface StoryCardFrameProps {
  tone?: StoryTone;
  kicker?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** For content-heavy cards: tighter padding, top-aligned, scrolls if it overflows the viewport. */
  dense?: boolean;
  /** Purely decorative background layer (p. ej. FormasFlotantes) — always painted behind the content. */
  decoration?: ReactNode;
  /**
   * Baja la intensidad del duotono y del velo negro. Para fotos que ya son
   * oscuras: el tratamiento normal está pensado para imágenes claras y sobre
   * un blanco y negro con el sujeto de negro no deja ver nada.
   */
  bgSuave?: boolean;
  /** Full-bleed photo (e.g. artist portrait) under a purple duotone scrim, replacing the flat tone gradient. */
  bgImage?: string;
}

export function StoryCardFrame({
  tone = "primary",
  kicker,
  children,
  footer,
  dense = false,
  decoration,
  bgImage,
  bgSuave = false,
}: StoryCardFrameProps) {
  // El fondo NO se desplaza con el contenido.
  //
  // Antes este div era a la vez el contenedor con scroll y el que pintaba el
  // fondo, y las capas decorativas (foto, grano, notas cayendo) eran
  // `absolute` DENTRO de él. Un elemento absoluto se posiciona contra la caja
  // de su contenedor, así que al hacer scroll se iba con el contenido: en las
  // láminas altas el degradado y las notas se despegaban y quedaba fondo
  // liso abajo.
  //
  // Ahora son dos capas: esta de afuera pinta y no scrollea nunca, y una de
  // adentro es la única con overflow. Las decorativas se quedan afuera, así
  // que quedan fijas, y el padding se mueve adentro para que el scroll
  // respete los márgenes.
  // Las láminas claras llevan texto oscuro; las de color, texto blanco. El
  // tono se declara en el DOM (data-tono) para que el shell sepa qué tinta
  // ponerle a la barra de arriba y a los puntos cuando esta lámina está en
  // pantalla: sobre marino en tema claro, la tinta de marca desaparecía.
  //
  // Las de color (y las de foto) además se declaran superficie HONDA: son
  // oscuras en los dos temas, así que todo lo que lleven adentro toma la tinta
  // del oscuro sin que cada componente se entere. Sin esto, un `text-ink` en
  // una lámina morada salía violeta hondo sobre morado en tema claro. Las
  // claras NO declaran nada: siguen al tema, que es lo correcto para ellas.
  const esClara = !bgImage && (tone === "surface" || tone === "surface-2");
  return (
    <div
      data-tono={esClara ? "claro" : "oscuro"}
      data-superficie={esClara ? undefined : "honda"}
      // Sin animación de entrada propia. En el recorrido vertical las láminas
      // existen TODAS desde el primer cuadro, así que una animación al montar se
      // dispararía treinta veces a la vez y fuera de pantalla: cuando el lector
      // llega, ya pasó. Lo que sí se anima al entrar a la vista lo marca el
      // shell poniendo `.a-la-vista` en la sección.
      //
      // Y `min-h-dvh` en vez de `h-full`: en el recorrido cada lámina mide al
      // menos una pantalla pero puede crecer, y una altura clavada recortaba
      // las láminas de datos que miden dos.
      className={`relative flex min-h-dvh w-full flex-col overflow-hidden bg-cover ${
        bgImage ? "bg-ink text-white" : TONE_CLASSES[tone]
      }`}
    >
      {bgImage ? (
        <>
          <Image src={bgImage} alt="" fill priority sizes="100vw" className="object-cover object-top" />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              opacity: bgSuave ? 0.35 : 1,
              backgroundImage:
                "linear-gradient(165deg, var(--color-primary), color-mix(in oklab, var(--color-secondary) 45%, var(--color-primary)))",
            }}
            aria-hidden="true"
          />
          <div
            className={`absolute inset-0 ${
              bgSuave
                ? "bg-gradient-to-t from-black/75 via-black/45 to-black/20"
                : "bg-gradient-to-t from-black/85 via-black/35 to-black/10"
            }`}
            aria-hidden="true"
          />
        </>
      ) : null}
      <div className="card-grain" aria-hidden="true" />
      {/* Toda lámina sin foto lleva la capa de formas. Las que traen foto se
          quedan sin ella: la imagen ya es la textura.

          Las claras la llevan en su variante tenue. Antes se quedaban sin nada
          y, junto a las de color, se veían como un fondo plano; eso se resuelve
          bajando la opacidad, no quitando la capa: las gráficas viven sobre
          tarjetas encima, así que la textura sólo asoma en los márgenes. */}
      {!bgImage ? (
        <FormasFlotantes fondo={tone === "surface" || tone === "surface-2" ? "papel" : "oscuro"} />
      ) : null}
      {decoration}

      {/* AQUÍ VIVÍA LA MARCA DE AGUA de Atlantia, arriba a la derecha de cada
          lámina, en tres variantes según el tono del fondo. Se retiró
          (2026-09): la marca vive UNA sola vez, en la barra de arriba
          (EncabezadoDelReporte). Repetirla treinta veces no decía nada nuevo a
          partir de la segunda, y ocupaba justo la esquina que la barra
          necesita para sus mandos. */}

      {/* Lo único que scrollea.

          ANCHO COMPLETO, sin `max-w` y sin padding en unidades de viewport (ver
          `04`, sección 2). Antes esto traía `max-w-2xl`, `2xl:max-w-[1900px]` y
          `px-[6vw]`: en una pantalla de trabajo el contenido quedaba en una
          columna de blog con medio lienzo vacío a la derecha, y el padding en
          vw se comía cien píxeles por lado en cuanto la ventana crecía.

          EL RELLENO DE ARRIBA despeja la BARRA FIJA del encabezado (h-11 en
          celular, h-12 de lg para arriba) más su propio aire. Antes despejaba
          la marca de agua y el botón de MAIA, que ya no están; si se dejaran
          los valores viejos, el cintillo de cada lámina quedaría demasiado
          lejos de la barra y con un hueco muerto encima.

          El `pb` grande deja aire para la nota de fuente sin que la última
          línea quede pegada al borde. */}
      {/* Ya NO lleva su propio scroll: el recorrido es una columna que se baja,
          así que quien desplaza es la página. Con un scroll aquí dentro, la
          rueda se quedaba atrapada en la lámina y no pasaba a la siguiente. Y
          con `h-full` sobre un padre de alto automático, el centrado vertical
          no centraba nada: el separador dejaba su título arriba. */}
      <div className="relative z-10 flex flex-1 flex-col px-5 pt-[4.5rem] pb-16 sm:px-8 lg:px-10 lg:pt-[5.5rem] lg:pb-20">
        <div className={`flex w-full flex-1 flex-col ${dense ? "justify-start" : "justify-center"}`}>
          {kicker ? (
            <p className={`${esClara ? "kicker-marca" : "kicker-marca-claro"} mb-4 font-heading text-kicker font-bold uppercase tracking-[0.2em]`}>
              {kicker}
            </p>
          ) : null}
          {dense ? (
            /* En modo denso el contenido es una columna que CRECE pero se alinea
               ARRIBA: así una lámina puede estirar su gráfica con `flex-1`, y la
               que no lo pida arranca pegada al título en vez de flotar al centro. */
            <div className="flex flex-1 flex-col">{children}</div>
          ) : (
            <div className="flex flex-1 flex-col justify-center">{children}</div>
          )}
          {footer ? <div className="mt-8 text-body opacity-70">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
