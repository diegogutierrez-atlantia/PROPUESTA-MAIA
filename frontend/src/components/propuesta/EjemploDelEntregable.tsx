import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";
import type { Captura } from "@/casa/entregable";
import { SOMBRA_DE_TARJETA } from "./estilos";

/**
 * Lo que se entrega, enseñado con capturas reales del producto.
 *
 * Las decisiones que la definen:
 *
 * 1. SON CAPTURAS, NO UNA MAQUETA: lo que el cliente va a recibir, tal cual se
 *    ve, con sus datos de demostración. Viven en `casa/entregable.ts`.
 *
 * 2. VARIAS CAPTURAS VAN EN MOSAICO DE 2 × 2 (cuatro pantallas distintas del
 *    mismo producto, para que se vea la gama); UNA SOLA va centrada, a su
 *    tamaño natural: estirada al ancho de la lámina se veía borrosa.
 *
 * 3. LA INSIGNIA "ENTREGABLE ÚNICO" va arriba del título, con el degradado
 *    insignia, y "DATA DEMO" a su lado: lo que se ve no son resultados reales.
 *
 * 4. SI HAY DEMO EN VIVO, va un botón que lo abre en otra pestaña.
 */
export function EjemploDelEntregable({
  titulo,
  capturas,
  demo,
}: {
  titulo: string;
  capturas: Captura[];
  demo?: { etiqueta: string; url: string };
}) {
  const una = capturas.length === 1;
  return (
    <div className="flex flex-1 flex-col gap-4 lg:gap-5">
      <header className="stagger flex flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span
            data-superficie="honda"
            className="flex items-center gap-2 rounded-lg px-3 py-1 font-heading text-body font-semibold"
            style={{
              backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              color: "var(--color-sobre-relleno)",
            }}
          >
            <Star className="h-4 w-4" strokeWidth={2.25} fill="currentColor" aria-hidden />
            Entregable único
          </span>
          <span className="rounded-full border border-border px-4 py-1 font-heading text-kicker font-bold uppercase tracking-[0.2em] text-muted">
            Data demo
          </span>
        </div>
        <h2 className="font-heading text-h2 font-extrabold text-tinta-marca">{titulo}</h2>
      </header>

      <div className={`stagger grid flex-1 items-center gap-3 lg:gap-4 ${una ? "justify-items-center" : "sm:grid-cols-2"}`}>
        {capturas.map((c) => (
          <figure key={c.src} className={`overflow-hidden rounded-2xl border border-border bg-surface ${SOMBRA_DE_TARJETA}`}>
            <Image
              src={c.src}
              alt={c.descripcion}
              width={c.ancho}
              height={c.alto}
              className={una ? "block h-auto max-h-[36rem] w-auto max-w-full" : "h-auto w-full"}
              sizes={una ? "90vw" : "(min-width: 640px) 50vw, 100vw"}
            />
          </figure>
        ))}
      </div>

      {demo ? (
        <a
          href={demo.url}
          target="_blank"
          rel="noopener noreferrer"
          data-superficie="honda"
          className="flex w-fit items-center gap-2 self-center rounded-full px-6 py-3 font-heading text-body font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "var(--color-sobre-relleno)" }}
        >
          {demo.etiqueta}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
