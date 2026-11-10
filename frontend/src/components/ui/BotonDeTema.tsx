"use client";

import { useEffect, useState } from "react";
import { EVENTO_TEMA, alternarTema, temaActual, type Tema } from "@/lib/tema";

/**
 * El botón de tema: luna en claro, sol en oscuro (enseña a dónde LLEVA).
 *
 * No es dueño del tema: `lib/tema` mueve el atributo y este botón sólo lo
 * refleja. Por eso escucha el evento en vez de guardar su propia verdad —la
 * tecla T cambia el tema sin pasar por aquí y el ícono debe seguirla.
 *
 * El estado arranca en "claro" fijo y se corrige al montar: en el servidor no
 * hay tema y adivinarlo hidrataría un ícono distinto al pintado.
 */
export function BotonDeTema({ className = "" }: { className?: string }) {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    setTema(temaActual());
    const alCambiar = () => setTema(temaActual());
    window.addEventListener(EVENTO_TEMA, alCambiar);
    return () => window.removeEventListener(EVENTO_TEMA, alCambiar);
  }, []);

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={tema === "oscuro" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={`${tema === "oscuro" ? "Tema claro" : "Tema oscuro"} · T`}
      className={className}
    >
      {tema === "oscuro" ? (
        /* El sol: a dónde lleva el clic. */
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" />
        </svg>
      ) : (
        /* La luna. */
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M16.5 12.2A6.8 6.8 0 0 1 7.8 3.5a6.8 6.8 0 1 0 8.7 8.7Z" />
        </svg>
      )}
    </button>
  );
}
