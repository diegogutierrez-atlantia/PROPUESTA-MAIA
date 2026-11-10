"use client";



/**
 * Los puntos del borde derecho: en qué sección va uno, y cómo saltar.
 *
 * Sustituyen a las flechas de pasar lámina. Cinco decisiones que los definen:
 *
 * 1. UNO POR ACTO, no por lámina. Treinta y un puntos apilados no se pueden
 *    apuntar con el ratón ni dicen nada; siete sí, y son el mapa que quien
 *    presenta ya tiene en la cabeza.
 *
 * 2. EL NOMBRE APARECE AL ACERCARSE. Un punto solo no dice a dónde lleva. El
 *    rótulo sale al pasar el cursor y va siempre montado —no se monta al
 *    entrar— para que no haya salto de posición al aparecer.
 *
 * 3. EL ACTIVO CRECE Y SE PINTA, los demás quedan traslúcidos. Es la única
 *    diferencia que se lee de reojo mientras se baja.
 *
 * 4. SON BOTONES DE VERDAD, con su nombre accesible. Un punto decorativo con un
 *    `onClick` deja fuera a quien navega con teclado, y aquí es la única manera
 *    de saltar de sección sin abrir el navegador.
 *
 * 5. NO SE IMPRIMEN. Al descargar el PDF, los mandos sobran.
 */
export function PuntosDeSeccion({
  actos,
  activo,
  onIr,
  sobreOscuro = false,
}: {
  actos: string[];
  activo: number;
  onIr: (indice: number) => void;
  /** La lámina en pantalla es de color: los puntos van en blanco. */
  sobreOscuro?: boolean;
}) {
  return (
    <nav
      aria-label="Secciones del reporte"
      className="mando-oculto-al-imprimir fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex lg:right-6"
    >
      {actos.map((titulo, i) => {
        const aqui = i === activo;
        return (
          <button
            key={titulo + i}
            type="button"
            onClick={() => onIr(i)}
            aria-label={titulo}
            aria-current={aqui ? "true" : undefined}
            // El botón mide SOLO su punto: la etiqueta va absoluta, fuera del
            // flujo y sin hitbox. Antes ocupaba lugar invisible y el rótulo
            // saltaba con el mouse a un palmo del punto (lo cazó el analista).
            className="group relative flex items-center justify-center p-1"
          >
            <span
              className="pointer-events-none absolute right-full top-1/2 mr-1.5 -translate-y-1/2 rounded-full bg-black/55 px-2.5 py-1 font-heading text-[0.6875rem] font-bold whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {titulo}
            </span>
            <span
              aria-hidden
              className={`block rounded-full transition-all ${
                aqui ? "h-2.5 w-2.5" : "h-2 w-2 group-hover:scale-125"
              }`}
              // Tokens, no blancos fijos: sobre lámina clara el blanco y el
              // turquesa de marca se lavaban (lo cazó el analista). La tinta
              // y el turquesa-tinta siguen al tema solos.
              style={{
                backgroundColor: aqui
                  ? sobreOscuro ? "var(--color-turquoise)" : "var(--color-turquoise-ink)"
                  : sobreOscuro ? "var(--color-sobre-relleno)" : "var(--ink)",
                opacity: aqui ? 1 : 0.35,
                boxShadow: aqui ? "0 0 0 4px color-mix(in oklab, var(--color-turquoise-ink) 25%, transparent)" : undefined,
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
