"use client";

import { useState } from "react";

/**
 * Descarga el reporte en PDF, el que vive en `public/pdf`.
 *
 * ── POR QUÉ NO ES `window.print()` ─────────────────────────────────────────
 *
 * Aquí había un botón que abría el diálogo de impresión del navegador. No es
 * como se entrega en la casa: el PDF que recibe el cliente es un documento
 * hecho aparte, con su portada y su maquetación, no una captura de las láminas
 * pasadas por la impresora. Imprimir la pantalla produce otro documento —el que
 * salga del papel que el usuario elija— y encima obliga a mantener una segunda
 * maquetación en CSS que nadie revisa hasta que alguien imprime.
 *
 * ── Y POR QUÉ NO ES UN `<a download>` ──────────────────────────────────────
 *
 * Por la compuerta. El PDF está detrás de la misma sesión que el reporte, y la
 * de MAIA dura una hora. Si alguien deja la pestaña abierta más de eso y luego
 * le da a descargar, el servidor responde con el HTML de la compuerta y el
 * navegador lo guarda con nombre de PDF: el usuario termina con un archivo roto
 * y sin ninguna pista de por qué.
 *
 * Así que se pide con fetch, se comprueba que lo que volvió SEA un PDF, y sólo
 * entonces se guarda. Si la sesión caducó se dice y se recarga, que es lo que
 * vuelve a disparar el SSO.
 */
export function BotonDescargarPdf({
  archivo,
  className = "",
}: {
  /** Nombre del archivo dentro de public/pdf. */
  archivo: string;
  className?: string;
}) {
  const [bajando, setBajando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function descargar() {
    setBajando(true);
    setError(null);
    try {
      // El nombre trae espacios y corchetes, así que hay que codificarlo.
      const res = await fetch(`/pdf/${encodeURIComponent(archivo)}`, { cache: "no-store" });

      // La compuerta contesta 401 con HTML. Un 200 con text/html también sería
      // la compuerta, así que se miran las dos cosas y no sólo el código.
      const tipo = res.headers.get("content-type") ?? "";
      if (!res.ok || tipo.includes("text/html")) {
        setError("Tu sesión caducó. Recargando para volver a entrar…");
        setTimeout(() => window.location.reload(), 1800);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archivo;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("No se pudo descargar. Revisa tu conexión y vuelve a intentarlo.");
    } finally {
      setBajando(false);
    }
  }

  return (
    <span className="pointer-events-auto relative">
      <button
        type="button"
        onClick={descargar}
        disabled={bajando}
        aria-label="Descargar el reporte en PDF"
        title="Descargar el reporte en PDF"
        /* El aspecto lo pone quien lo usa. Antes las clases de píldora iban
           FIJAS y el `className` se pegaba después: en la barra de arriba
           ganaba el fondo redondo viejo y este botón se veía distinto a los
           tres de al lado. Ahora el `className` SUSTITUYE al aspecto por
           omisión en vez de sumarse a él. */
        className={`mando-oculto-al-imprimir disabled:opacity-60 ${
          className ||
          "flex h-10 w-10 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
        }`}
      >
        {bajando ? (
          <svg viewBox="0 0 20 20" className="h-4 w-4 animate-spin" fill="none" aria-hidden>
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5M4 15v1.5A1.5 1.5 0 0 0 5.5 18h9a1.5 1.5 0 0 0 1.5-1.5V15" />
          </svg>
        )}
      </button>
      {error ? (
        <span
          role="status"
          /* Cuelga HACIA ABAJO: el botón vive en la barra de arriba, y un
             aviso encima se saldría de la pantalla. */
          className="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg bg-black/80 px-3 py-2 text-right text-kicker text-white backdrop-blur-sm"
        >
          {error}
        </span>
      ) : null}
    </span>
  );
}
