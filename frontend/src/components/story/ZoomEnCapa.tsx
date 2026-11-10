"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, X } from "lucide-react";

/**
 * Un botón en la lámina que abre su contenido en grande, en una capa de
 * pantalla completa encima del recorrido. Para lo que dentro de la lámina
 * quedaba cortado por abajo (pedido del operador, 2026-09-24, la tabla de
 * "Dónde se compra").
 *
 * Mismo patrón que `DiagnosticosDeMarca`: la capa sale por portal a
 * document.body porque "fixed" dentro de la lámina queda atrapado en su
 * contexto de apilamiento y la lámina siguiente le pinta encima. Escape la
 * cierra.
 */
export function ZoomEnCapa({
  etiqueta,
  volverA,
  children,
  className = "mt-8",
}: {
  /** El texto del botón que la abre. */
  etiqueta: string;
  /** A dónde regresa el botón de cerrar: "Volver a {volverA}". */
  volverA: string;
  children: ReactNode;
  className?: string;
}) {
  const [abierta, setAbierta] = useState(false);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  useEffect(() => {
    if (!abierta) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierta]);

  const capa = abierta ? (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-surface px-5 pb-16 pt-[4.5rem] text-ink sm:px-8 lg:px-10 lg:pt-[5.5rem]">
      <button
        type="button"
        onClick={() => setAbierta(false)}
        className="mb-6 flex items-center gap-2 rounded-full border border-border px-5 py-2.5 font-heading text-body font-bold text-ink"
      >
        <X className="h-4 w-4" />
        Volver a {volverA}
      </button>
      {children}
    </div>
  ) : null;

  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={() => setAbierta(true)}
          data-superficie="honda"
          className="flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-heading text-body font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {etiqueta}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      {montado && capa ? createPortal(capa, document.body) : null}
    </>
  );
}
