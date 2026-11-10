"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LaminaDelReporte } from "@/lib/story-types";
import { ProveedorDeNavegacion } from "@/components/story/navegacion";
import {
  NavegadorDeHistoria,
  type ActoDelMapa,
  type LaminaDelMapa,
} from "@/components/story/NavegadorDeHistoria";
import { PuntosDeSeccion } from "@/components/story/PuntosDeSeccion";
import { EncabezadoDelReporte } from "@/components/story/EncabezadoDelReporte";
import { alternarTema } from "@/lib/tema";
import { useModoPresentacion, PALABRA_SECRETA } from "@/components/story/ModoPresentacion";

/**
 * El recorrido del reporte: UNA COLUMNA QUE SE BAJA, no una pila de tarjetas
 * que se pasan de lado.
 *
 * ── QUÉ CAMBIÓ Y POR QUÉ ───────────────────────────────────────────────────
 *
 * Antes esto era una historia tipo diapositivas: una lámina en pantalla, dos
 * flechas a los costados, clic en la mitad derecha para avanzar. Se cambió a
 * petición del cliente por lo que ya conocen sus lectores: se baja con la rueda
 * y unos puntos en el borde dicen en qué sección va uno.
 *
 * Cinco decisiones que lo definen:
 *
 * 1. SCROLL LIBRE CON ANCLAJE SUAVE. Cada lámina lleva `snap-start`, pero el
 *    anclaje es `proximity` (globals.css), no obligatorio: el obligatorio
 *    convertía cada gesto en un salto de lámina y se sentía secuestrado.
 *
 * 2. LOS PUNTOS SON POR ACTO, no por lámina. Treinta puntos apilados en el
 *    borde no se pueden apuntar con el ratón ni dicen nada; siete sí.
 *
 * 3. QUIÉN MANDA ES EL SCROLL, y los puntos lo siguen. El punto activo lo
 *    decide un observador sobre las láminas, no un contador propio.
 *
 * 4. TODOS LOS MANDOS VIVEN EN LA BARRA DE ARRIBA (EncabezadoDelReporte).
 *    Abajo no queda ningún mando: las esquinas de abajo son de la lámina.
 *
 * 5. NO HAY BOTÓN DE CERRAR. El reporte se embebe en MAIA y esa salida la pone
 *    MAIA. Un segundo botón de cerrar dentro del iframe cierra otra cosa.
 */

export function StoryShell({
  laminas: todas,
  pdf,
  titulo,
}: {
  /**
   * Las láminas ya aplanadas, con su clave y su título. Llegan hechas desde
   * el servidor a propósito: ver `laminasDeLaPropuesta` en lib/story/capitulos.
   */
  laminas: LaminaDelReporte[];
  /** Nombre del PDF en public/pdf. Sin él, no se pinta el botón. */
  pdf?: string | null;
  /**
   * El rótulo del estudio, en la barra de arriba y en el índice. El patrón de
   * la casa es «metodología · nombre». Se escribe en capitales por CSS y no
   * aquí, para que el índice lo pueda usar en caja normal.
   */
  titulo: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const secciones = useRef<(HTMLElement | null)[]>([]);
  const [activa, setActiva] = useState(0);
  /** Si la lámina en pantalla es de color, para que la barra y los puntos vayan en blanco. */
  const [sobreOscuro, setSobreOscuro] = useState(false);
  /**
   * Qué láminas ya se vieron, POR CLAVE. Nunca se quita una: la animación de
   * entrada es un estreno, no un efecto que se repita cada vez que se pasa
   * por encima. Por clave y no por posición: el modo presentación quita
   * láminas de la lista y las posiciones se corren.
   */
  const [vistas, setVistas] = useState<Set<string>>(() => new Set(todas[0] ? [todas[0].clave] : []));
  const [navegadorAbierto, setNavegadorAbierto] = useState(false);

  /**
   * El modo presentación: la lista que se recorre es la de láminas
   * ENCENDIDAS. Todo lo demás (actos, puntos, índice, contador) se deriva de
   * `laminas`, así que se acomoda solo.
   */
  const presentacion = useModoPresentacion(todas);
  const laminas = presentacion.visibles;
  useEffect(() => {
    setActiva((a) => Math.min(a, Math.max(laminas.length - 1, 0)));
  }, [laminas]);

  /** Dónde empieza cada acto, para que los puntos sepan a dónde llevar. */
  const actos = useMemo(() => {
    const salida: { titulo: string; primera: number }[] = [];
    laminas.forEach((l, i) => {
      if (salida.length === 0 || salida[salida.length - 1].titulo !== l.actoTitulo) {
        salida.push({ titulo: l.actoTitulo, primera: i });
      }
    });
    return salida;
  }, [laminas]);

  const actoActivo = useMemo(() => {
    let indice = 0;
    actos.forEach((a, i) => {
      if (activa >= a.primera) indice = i;
    });
    return indice;
  }, [actos, activa]);

  /** El mapa que consume el índice, agrupado por acto. */
  // El índice lista TODAS las láminas, no sólo las visibles: una apagada tiene
  // que seguir en la lista para poder volver a prenderla, y si desapareciera la
  // numeración bailaría en cada clic.
  //
  // `cardIndex` es la posición entre las VISIBLES, que es a donde salta el
  // recorrido. Una lámina apagada no tiene posición, así que lleva -1 y su
  // clic no va a ningún lado.
  const mapa: ActoDelMapa[] = useMemo(() => {
    const posicion = new Map(laminas.map((l, i) => [l.clave, i]));
    // Los actos del índice salen de TODAS las láminas, no de `actos`, que se
    // arma con las visibles: si un acto queda entero apagado desaparecería de
    // la lista y nadie podría volver a prenderlo.
    const orden: string[] = [];
    for (const l of todas) {
      if (!orden.includes(l.actoTitulo)) orden.push(l.actoTitulo);
    }
    const porTitulo = new Map(orden.map((t, i) => [t, i]));
    const salida: ActoDelMapa[] = orden.map((t) => ({ titulo: t, laminas: [] }));
    for (const l of todas) {
      const i = porTitulo.get(l.actoTitulo);
      if (i === undefined) continue;
      salida[i].laminas.push({
        clave: l.clave,
        rotulo: l.rotulo,
        cardIndex: posicion.get(l.clave) ?? -1,
        apagada: !posicion.has(l.clave),
      });
    }
    return salida;
  }, [laminas, todas]);

  /** Llevar a una lámina por su posición en la tira. */
  const irA = useCallback((indice: number) => {
    secciones.current[indice]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /**
   * Quién está en pantalla. Se mira contra el centro de la ventana y no contra
   * su borde: con `threshold` sobre láminas del alto de la ventana, dos entran
   * a la vez durante el desplazamiento y el punto parpadea entre las dos.
   */
  useEffect(() => {
    const caja = contenedor.current;
    if (!caja) return;
    secciones.current.length = laminas.length;
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          const i = secciones.current.indexOf(e.target as HTMLElement);
          if (i < 0) continue;
          setActiva(i);
          setSobreOscuro((e.target as HTMLElement).querySelector<HTMLElement>("[data-tono]")?.dataset.tono === "oscuro");
          const clave = laminas[i]?.clave;
          if (clave) setVistas((previas) => (previas.has(clave) ? previas : new Set(previas).add(clave)));
        }
      },
      { root: caja, rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    for (const s of secciones.current) if (s) observador.observe(s);
    return () => observador.disconnect();
  }, [laminas]);

  /*
   * NADA DE ANIMACIONES DE TRANSICIÓN ENTRE LÁMINAS. Ya se intentó y se retiró:
   * con el recorrido vertical el paso de una lámina a la siguiente es un
   * desplazamiento, y una animación que deforma la lámina AL MISMO TIEMPO que
   * el scroll la sube se ve como un temblor. Lo que se anime aquí tiene que ir
   * atado al avance del scroll, nunca a un temporizador.
   */

  const cerrarNavegador = useCallback(() => {
    setNavegadorAbierto(false);
    contenedor.current?.focus();
  }, []);

  const porClave = useMemo(() => new Map(laminas.map((l, i) => [l.clave, i])), [laminas]);

  const navegacion = useMemo(
    () => ({
      existe: (clave: string) => porClave.has(clave),
      irALamina: (clave: string) => {
        const destino = porClave.get(clave);
        if (destino === undefined) {
          console.warn(`No hay ninguna lámina con la clave "${clave}".`);
          return;
        }
        irA(destino);
      },
    }),
    [porClave, irA],
  );

  /**
   * La lámina-índice del acto en curso (la que empieza con "indice-"), si el
   * acto tiene una y no es la que se está viendo.
   */
  const indiceDelActo = useMemo(() => {
    const actual = laminas[activa];
    if (!actual) return null;
    const i = laminas.findIndex((l) => l.acto === actual.acto && l.clave.startsWith("indice-"));
    return i >= 0 && i !== activa ? i : null;
  }, [laminas, activa]);

  /** Lo tecleado hasta ahora de la palabra secreta del modo presentación. */
  const secreto = useRef("");

  /**
   * El teclado del presentador, en la ventana y no en el contenedor: las
   * teclas deben responder aunque el foco ande en un botón. Las flechas
   * SALTAN de lámina; la lectura fina de una lámina larga queda en la rueda.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const destino = e.target as HTMLElement | null;
      if (destino && (destino.tagName === "INPUT" || destino.tagName === "TEXTAREA" || destino.isContentEditable)) return;
      // Con el índice abierto, el panel es dueño del teclado.
      if (navegadorAbierto) return;

      // LA PALABRA SECRETA, antes que los atajos de una letra: "atlantia"
      // trae una T y una I, que solas cambian el tema y abren el índice.
      // Mientras lo tecleado sea un pedazo de la palabra, esas letras se
      // tragan; en cuanto se desvía, vuelven a ser atajos.
      const letra = e.key.length === 1 ? e.key.toLowerCase() : "";
      if (letra) {
        const candidato = (secreto.current + letra).slice(-PALABRA_SECRETA.length);
        if (PALABRA_SECRETA.startsWith(candidato)) {
          secreto.current = candidato;
          if (candidato === PALABRA_SECRETA) {
            secreto.current = "";
            e.preventDefault();
            // La palabra abre el índice, que es donde se prenden y apagan las
            // láminas. Se conserva como atajo de quien ya la tiene en la mano;
            // los ojos, en cambio, están siempre a la vista y no dependen de
            // ella (2026-09-23).
            setNavegadorAbierto(true);
            return;
          }
          if (candidato.length > 1) {
            e.preventDefault();
            return;
          }
        } else {
          secreto.current = letra === PALABRA_SECRETA[0] ? letra : "";
        }
      }

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          irA(Math.min(activa + 1, laminas.length - 1));
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          irA(Math.max(activa - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          irA(0);
          break;
        case "End":
          e.preventDefault();
          irA(laminas.length - 1);
          break;
        default: {
          const tecla = e.key.toLowerCase();
          if (tecla === "f") {
            e.preventDefault();
            if (document.fullscreenElement) void document.exitFullscreen();
            else void document.documentElement.requestFullscreen();
          } else if (tecla === "t") {
            e.preventDefault();
            alternarTema();
          } else if (tecla === "i") {
            e.preventDefault();
            setNavegadorAbierto(true);
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activa, navegadorAbierto, irA, laminas.length]);

  /**
   * El hilo de progreso, atado al avance REAL del contenedor de scroll. Se
   * pinta directo al estilo (sin estado) para no re-renderizar treinta láminas
   * a cada pixel de scroll.
   */
  const hiloDeProgreso = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = contenedor.current;
    if (!el) return;
    let cuadro = 0;
    const pintar = () => {
      cuadro = 0;
      const total = el.scrollHeight - el.clientHeight;
      const avance = total > 0 ? el.scrollTop / total : 0;
      if (hiloDeProgreso.current) hiloDeProgreso.current.style.transform = `scaleX(${avance})`;
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };
    el.addEventListener("scroll", alDesplazar, { passive: true });
    pintar();
    return () => {
      el.removeEventListener("scroll", alDesplazar);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <ProveedorDeNavegacion value={navegacion}>
      <div
        ref={contenedor}
        tabIndex={0}
        role="group"
        aria-roledescription="reporte"
        aria-label={`${laminas[activa]?.actoTitulo ?? ""}, lámina ${activa + 1} de ${laminas.length}`}
        className="recorrido h-dvh w-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-page outline-none"
      >
        {laminas.map((l, i) => (
          <section
            key={l.clave}
            ref={(el) => {
              secciones.current[i] = el;
            }}
            aria-label={l.rotulo}
            className={`relative min-h-dvh w-full snap-start ${vistas.has(l.clave) ? "a-la-vista" : ""}`}
          >
            {l.card}
          </section>
        ))}
      </div>

      {/* ── Los mandos, fuera del contenedor que se desplaza ─────────────── */}

      <EncabezadoDelReporte
        titulo={titulo}
        activa={activa}
        total={laminas.length}
        onAbrirIndice={() => setNavegadorAbierto(true)}
        onIndiceDeSeccion={indiceDelActo !== null ? () => irA(indiceDelActo) : null}
        onInicio={() => irA(0)}
        pdf={pdf}
        refHilo={hiloDeProgreso}
        sobreOscuro={sobreOscuro}
      />

      {/* La pista de teclas: se presenta una vez y se retira sola a los siete
          segundos (`.pista-teclas` en globals.css). Ya pasó que faltaba esa
          regla y la pista se quedaba fija estorbando todo el recorrido. */}
      <div
        aria-hidden
        className="pista-teclas mando-oculto-al-imprimir pointer-events-none fixed bottom-5 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 text-kicker font-medium backdrop-blur-sm sm:flex lg:bottom-8"
        style={{ backgroundColor: "color-mix(in oklab, var(--color-primary-900) 55%, transparent)", color: "var(--color-sobre-relleno)" }}
      >
        <span className="flex items-center gap-1.5">
          <Tecla>↑</Tecla>
          <Tecla>↓</Tecla>
          cambian de lámina
        </span>
        <span className="opacity-40">·</span>
        <span className="flex items-center gap-1.5">
          <Tecla>F</Tecla>
          pantalla completa
        </span>
        <span className="opacity-40">·</span>
        <span className="flex items-center gap-1.5">
          <Tecla>T</Tecla>
          tema
        </span>
        <span className="opacity-40">·</span>
        <span className="flex items-center gap-1.5">
          <Tecla>I</Tecla>
          índice
        </span>
      </div>

      <PuntosDeSeccion actos={actos.map((a) => a.titulo)} activo={actoActivo} onIr={(i) => irA(actos[i].primera)} sobreOscuro={sobreOscuro} />

      {/* AQUÍ VIVÍAN LOS MANDOS SUELTOS de las esquinas de abajo. Se mudaron
          enteros a la barra de arriba (2026-09). */}

      {/* AQUÍ VIVÍA EL MENÚ DE PRESENTACIÓN, una pantalla aparte con una
          casilla por lámina. Se retiró (2026-09-23): ahora se prende y apaga
          desde el ÍNDICE, con un ojo por fila, que es donde la mano ya está
          cuando alguien recorre el reporte.

          Y los ojos NO se esconden tras la palabra secreta: están siempre a la
          vista. Una función que hay que adivinar es una función que nadie usa.
          El hook `useModoPresentacion` sigue guardando qué está apagado; lo
          único que se retiró es su pantalla. */}

      {navegadorAbierto ? (
        <div className="fixed inset-0 z-40">
          <NavegadorDeHistoria
            actos={mapa}
            actual={{ cardIndex: activa }}
            total={laminas.length}
            titulo={titulo}
            onIr={(l: LaminaDelMapa) => {
              // Una lámina apagada no está en el recorrido: el clic en su
              // nombre no lleva a ningún lado. Para verla, primero su ojo.
              if (l.cardIndex < 0) return;
              cerrarNavegador();
              irA(l.cardIndex);
            }}
            onCerrar={cerrarNavegador}
            // Los ojos están SIEMPRE a la vista: armar una vista a la medida
            // es algo que hace tanto quien presenta como quien recibe el
            // reporte, y esconderlo tras una palabra secreta significaba que
            // nadie iba a dar con la función.
            onAlternar={presentacion.alternar}
            onAlternarActo={presentacion.alternarActo}
          />
        </div>
      ) : null}
    </ProveedorDeNavegacion>
  );
}

/** Una tecla dibujada, para la pista del teclado. */
function Tecla({ children }: { children: React.ReactNode }) {
  // Hereda el blanco del pastillero: nada de turquesa aquí, la barra y sus
  // pistas son de apoyo y el acento se lo lleva el contenido.
  return <kbd className="rounded bg-white/20 px-1.5 py-0.5 font-heading text-[0.6875rem] font-bold text-white">{children}</kbd>;
}
