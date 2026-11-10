"use client";

import type { RefObject } from "react";
import { BotonDeTema } from "@/components/ui/BotonDeTema";
import { BotonPantallaCompleta } from "@/components/ui/BotonPantallaCompleta";
import { BotonDescargarPdf } from "@/components/ui/BotonDescargarPdf";
import { LogoHorizontalPorTema } from "@/components/marca/AtlantiaMark";

/**
 * La barra de arriba: índice, marca, título del estudio y todos los mandos,
 * juntos. Es la distribución de la casa desde 2026-09 (instrucción del
 * responsable del método, tomada viendo un reporte real).
 *
 *   izquierda:  ☰ índice · logo Atlantia · NOMBRE DEL ESTUDIO
 *   derecha:    ↑ índice de sección · n / N · inicio · tema · PDF · pantalla completa
 *
 * ── POR QUÉ ESTO REEMPLAZA A LAS ESQUINAS ──────────────────────────────────
 *
 * Antes los mandos vivían regados: inicio, PDF, tema y pantalla completa abajo
 * a la derecha; índice y contador abajo a la izquierda; y la marca de Atlantia
 * repetida como agua en la esquina de CADA lámina. Tres grupos que había que
 * aprenderse por separado, y una marca que se repetía treinta veces para decir
 * lo mismo una vez. La esquina superior izquierda ya no se reserva.
 *
 * ── POR QUÉ NO TIENE FONDO ─────────────────────────────────────────────────
 *
 * Nació con un velo negro translúcido. Se quitó: una franja oscura fija le
 * corta la cabeza a cada lámina, y en un reporte donde el fondo cambia de
 * morado a foto a blanco, esa franja es lo único que nunca cambia y se vuelve
 * lo primero que se ve.
 *
 * ── DE QUÉ COLOR VA LA TINTA ───────────────────────────────────────────────
 *
 * Sin fondo, el contraste depende de lo que haya debajo. Sobre lámina clara
 * va `--tinta-marca` (oscura en claro, clara en oscuro). Sobre una lámina de
 * color va BLANCO: sobre marino en tema claro la barra desaparecía entera (lo
 * cazó la foto de auditoría). No se mide luminancia: cada lámina declara su
 * tono en el DOM (`data-tono`, lo pone StoryCardFrame) y el shell avisa cuál
 * está en pantalla. Una condición, cero cálculo. Nunca azul ni turquesa: la
 * barra es de apoyo, y el acento se lo lleva el contenido.
 */

/**
 * Todos los mandos miden y pesan igual. Chicos a propósito: sin fondo que los
 * contenga, un icono grande se lee como parte de la lámina. El hover sube la
 * opacidad en vez de pintar un fondo, que es lo único que se ve igual sobre
 * morado, sobre foto y sobre blanco.
 */
const MANDO =
  "flex h-6 w-6 items-center justify-center rounded opacity-55 transition-opacity hover:opacity-100";

export function EncabezadoDelReporte({
  titulo,
  activa,
  total,
  onAbrirIndice,
  onIndiceDeSeccion,
  onInicio,
  pdf,
  refHilo,
  sobreOscuro = false,
}: {
  /** La lámina en pantalla es de color: la barra va en blanco. */
  sobreOscuro?: boolean;
  /** El rótulo del estudio: metodología · nombre. Se pone en capitales por CSS. */
  titulo: string;
  /** Índice de la lámina en pantalla, base 0. */
  activa: number;
  total: number;
  /** Abre el cajón con todas las láminas. */
  onAbrirIndice: () => void;
  /**
   * Vuelve a la lámina-índice del acto en curso. `null` cuando el acto no
   * tiene una o cuando ya se está en ella: ahí el mando no se pinta.
   */
  onIndiceDeSeccion: (() => void) | null;
  onInicio: () => void;
  /** Nombre del PDF en public/pdf. Sin él no se pinta el botón. */
  pdf?: string | null;
  /**
   * El hilo de progreso vive en el borde de arriba de todo. Se pinta desde
   * aquí y no suelto en el shell para que no se peleen por el mismo `top-0`.
   */
  refHilo: RefObject<HTMLDivElement | null>;
}) {
  return (
    <header
      className="mando-oculto-al-imprimir fixed inset-x-0 top-0 z-40 flex h-11 items-center gap-2 px-3 lg:h-12 lg:gap-2.5 lg:px-4"
      style={{ color: sobreOscuro ? "var(--color-sobre-relleno)" : "var(--tinta-marca)" }}
    >
      <button type="button" onClick={onAbrirIndice} aria-label="Abrir el índice" title="Índice (I)" className={MANDO}>
        <svg viewBox="0 0 20 20" className="h-[0.9375rem] w-[0.9375rem]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden>
          <path d="M3 5.5h14M3 10h14M3 14.5h14" />
        </svg>
      </button>

      <span aria-hidden className="h-3.5 w-px shrink-0 opacity-25" style={{ backgroundColor: "currentColor" }} />

      {/* El lockup oficial, montado dos veces: el tema decide cuál se ve.
          Nunca la versión a color: sobre fondo oscuro pierde la pierna morada. */}
      {/* El logo mide 328×86: a 16px de alto la palabra "atlantia" queda a la
          altura de la x del título. `self-center` y `leading-none` en los
          textos mantienen todo sobre la misma línea. */}
      <LogoHorizontalPorTema className="h-4 w-auto self-center opacity-90 lg:h-[1.125rem]" forzarBlanco={sobreOscuro} />

      {/* En celular no cabe junto al logo y los mandos; ahí manda el logo. */}
      <span className="hidden truncate self-center font-heading text-kicker font-bold leading-none tracking-[0.16em] uppercase opacity-65 sm:inline">
        {titulo}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-0.5">
        {/* VOLVER AL ÍNDICE DE LA SECCIÓN. Los actos con lámina-índice (la
            que arranca con "indice-") tienen este mando desde cualquiera de
            sus láminas, para saltarse lo que no se va a tocar en una
            presentación corta (pedido del equipo). */}
        {onIndiceDeSeccion ? (
          <button
            type="button"
            onClick={onIndiceDeSeccion}
            aria-label="Volver al índice de la sección"
            title="Volver al índice de la sección"
            className={`${MANDO} mr-1`}
          >
            <svg viewBox="0 0 20 20" className="h-[0.9375rem] w-[0.9375rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M10 16V5M5 9.5 10 4.5l5 5" />
            </svg>
          </button>
        ) : null}

        {/* Dónde va uno: información de posición, junto a los mandos que la mueven. */}
        <span className="mr-1 font-heading text-kicker font-bold leading-none tabular-nums opacity-55 lg:mr-1.5">
          {activa + 1} / {total}
        </span>

        <button type="button" onClick={onInicio} aria-label="Ir al inicio" title="Ir al inicio" className={MANDO}>
          <svg viewBox="0 0 20 20" className="h-[0.9375rem] w-[0.9375rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M3 9.5 10 4l7 5.5V16a1 1 0 0 1-1 1h-3v-4H7v4H4a1 1 0 0 1-1-1z" />
          </svg>
        </button>

        <BotonDeTema className={MANDO} />
        {pdf ? <BotonDescargarPdf archivo={pdf} className={MANDO} /> : null}
        <BotonPantallaCompleta className={MANDO} />

        {/* Aquí NO va una X. El reporte se embebe en MAIA y esa salida la pone
            MAIA: una segunda dentro del iframe cierra otra cosa. */}
      </div>

      {/* El hilo de progreso: 3 píxeles, del violeta al turquesa de la marca,
          soldado al borde de arriba de la barra. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[3px] overflow-hidden">
        <div
          ref={refHilo}
          className="h-full w-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, var(--color-primary) 0%, var(--color-turquoise-ink) 55%, var(--color-turquoise) 100%)",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </header>
  );
}
