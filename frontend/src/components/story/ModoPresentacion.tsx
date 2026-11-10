"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LaminaDelReporte } from "@/lib/story-types";

/**
 * Prender y apagar láminas para UNA presentación: qué está apagado, qué se ve
 * y cómo se guarda. Los mandos son los OJOS DEL ÍNDICE (`NavegadorDeHistoria`):
 * uno por lámina y uno por acto.
 *
 * Nace de las presentaciones a directivos con poco tiempo, o de cuando piden
 * ver una sola parte: el analista arma a mano qué láminas se muestran y el
 * recorrido se acomoda solo (contador, índice, puntos por acto y botones de
 * índice se derivan de la lista visible).
 *
 * Cinco decisiones:
 *
 * 1. LOS OJOS ESTÁN SIEMPRE A LA VISTA, en el índice. Antes esto era una
 *    pantalla aparte que se abría tecleando `atlantia`, y no servía: la palabra
 *    había que escribirla con el índice cerrado y nadie daba con la secuencia.
 *    Una función que hay que adivinar es una función que no existe. La palabra
 *    se conserva como atajo: abre el índice (2026-09).
 *
 * 2. NO HAY PRESETS. "Sólo hallazgos" cambia con cada audiencia; el analista
 *    lo arma a mano, lámina por lámina o acto por acto.
 *
 * 3. SE GUARDA EN EL NAVEGADOR, y nada más. Cerrar y abrir conserva la
 *    selección. No viaja en la URL: el reporte vive embebido en MAIA, donde
 *    no hay barra de direcciones.
 *
 * 4. UN SEPARADOR SE APAGA CON SU ACTO: si todas las láminas de un acto están
 *    apagadas, su portada de capítulo tampoco se muestra. Y nunca se apaga
 *    todo: si la selección deja cero láminas, se muestra el reporte completo.
 *
 * 5. EL PDF NO SE ENTERA. Es el reporte completo siempre; la selección vive en
 *    el navegador de quien presenta.
 *
 * LA TRAMPA QUE YA COSTÓ: el índice numera TODAS las láminas y el recorrido
 * sólo las visibles. Son dos listas, y cada vez que algo mezcló sus posiciones
 * salió un error que no se ve hasta que alguien apaga una sección (apagabas un
 * acto y se apagaba otro). Una posición entre las visibles sólo sirve para
 * saltar; para agrupar o identificar un acto se usa la clave o el título.
 */

const CLAVE_GUARDADA = "reporte-presentacion-v1";
export const PALABRA_SECRETA = "atlantia";

/** Los separadores de acto llevan clave `sep-` (o `div-`, por compatibilidad). */
const esSeparador = (clave: string) => clave.startsWith("sep-") || clave.startsWith("div-");

function leerGuardadas(): string[] {
  try {
    const guardado = localStorage.getItem(CLAVE_GUARDADA);
    return guardado ? (JSON.parse(guardado) as string[]) : [];
  } catch {
    return [];
  }
}

function guardar(apagadas: Set<string>) {
  try {
    localStorage.setItem(CLAVE_GUARDADA, JSON.stringify([...apagadas]));
  } catch {
    /* sin almacenamiento, la selección vive lo que la pestaña */
  }
}

export function useModoPresentacion(todas: LaminaDelReporte[]) {
  const [apagadas, setApagadas] = useState<Set<string>>(() => new Set());
  const cargado = useRef(false);

  // La selección guardada entra DESPUÉS del primer pintado: el servidor no
  // sabe qué guardó este navegador, y pintar distinto en los dos lados rompe
  // la hidratación.
  useEffect(() => {
    const claves = new Set(todas.map((l) => l.clave));
    setApagadas(new Set(leerGuardadas().filter((c) => claves.has(c))));
    cargado.current = true;
  }, [todas]);

  useEffect(() => {
    if (cargado.current) guardar(apagadas);
  }, [apagadas]);

  const visibles = useMemo(() => {
    const encendidas = todas.filter((l) => !apagadas.has(l.clave));
    const conContenido = new Set(encendidas.filter((l) => !esSeparador(l.clave)).map((l) => l.acto));
    const lista = encendidas.filter((l) => !esSeparador(l.clave) || conContenido.has(l.acto));
    return lista.length ? lista : todas;
  }, [todas, apagadas]);

  const alternar = useCallback((clave: string) => {
    setApagadas((previas) => {
      const siguientes = new Set(previas);
      if (siguientes.has(clave)) siguientes.delete(clave);
      else siguientes.add(clave);
      return siguientes;
    });
  }, []);

  /**
   * Prende o apaga un acto entero, POR SU TÍTULO.
   *
   * Antes recibía la posición del acto, y ahí estaba el error: la lista de actos
   * del recorrido se arma con las láminas VISIBLES, así que al apagar un acto
   * la lista se reacomoda y esa posición deja de apuntar al mismo acto. Apagar
   * uno terminaba apagando otro, o nada. El título no cambia porque algo se
   * apague.
   */
  const alternarActo = useCallback(
    (titulo: string, encender: boolean) => {
      setApagadas((previas) => {
        const siguientes = new Set(previas);
        for (const l of todas) {
          if (l.actoTitulo !== titulo) continue;
          if (encender) siguientes.delete(l.clave);
          else siguientes.add(l.clave);
        }
        return siguientes;
      });
    },
    [todas],
  );

  const todo = useCallback(() => setApagadas(new Set()), []);

  return { apagadas, visibles, alternar, alternarActo, todo };
}
