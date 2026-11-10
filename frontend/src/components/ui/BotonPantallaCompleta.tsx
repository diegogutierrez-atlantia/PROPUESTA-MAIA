"use client";

import { useCallback, useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";

/**
 * Pantalla completa, pensada para cuando el reporte va embebido.
 *
 * Dentro del iframe de MAIA la historia queda apretada y se pierde parte de
 * la experiencia. Esto la deja ocupar la pantalla sin sacar al usuario de
 * MAIA: lo que se agranda es el documento, no una ventana aparte.
 *
 * El botón se dibuja SÓLO si de verdad se puede. `document.fullscreenEnabled`
 * ya contempla la política de permisos del iframe que lo contiene: si el
 * `<iframe>` del host no trae `allow="fullscreen"`, esto es `false` y aquí no
 * aparece nada. Es a propósito que no haya plan B (abrir en otra pestaña
 * sacaría al usuario de MAIA, y eso no se quiere): o se puede en el sitio, o
 * no se ofrece.
 *
 * Empieza oculto y aparece tras montar, porque en el servidor no hay `document`
 * que consultar. Ese es también el motivo de que no haya desajuste de
 * hidratación: las dos pasadas coinciden en no dibujar nada.
 */
export function BotonPantallaCompleta({ className }: { className?: string }) {
  const [disponible, setDisponible] = useState(false);
  const [activa, setActiva] = useState(false);

  useEffect(() => {
    setDisponible(document.fullscreenEnabled);

    // Hay que escuchar el evento y no sólo recordar lo que pedimos: se sale de
    // pantalla completa con Escape, sin pasar por este botón.
    const alCambiar = () => setActiva(document.fullscreenElement !== null);
    alCambiar();
    document.addEventListener("fullscreenchange", alCambiar);
    return () => document.removeEventListener("fullscreenchange", alCambiar);
  }, []);

  const alternar = useCallback(async (e: React.MouseEvent) => {
    // La historia avanza de lámina con el clic del contenedor. Sin esto, entrar
    // a pantalla completa se comería una tarjeta de paso.
    e.stopPropagation();
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // El navegador puede negarla aunque se anuncie disponible. Se vuelve a
      // preguntar por si el permiso cambió, y si ya no está, el botón se retira
      // en vez de quedarse ahí sin hacer nada.
      setDisponible(document.fullscreenEnabled);
    }
  }, []);

  if (!disponible) return null;

  const Icono = activa ? Minimize : Maximize;
  const etiqueta = activa ? "Salir de pantalla completa" : "Ver en pantalla completa";

  return (
    <button type="button" onClick={alternar} aria-label={etiqueta} title={etiqueta} className={className}>
      {/* 18px como los demás mandos de la barra. A 20 se veía un punto más
          grande que sus vecinos y la fila perdía el renglón. */}
      <Icono className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
    </button>
  );
}
