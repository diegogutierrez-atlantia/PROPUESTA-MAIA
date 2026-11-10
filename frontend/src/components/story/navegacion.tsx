"use client";

import { createContext, useContext } from "react";

/**
 * Saltar a una lámina por su clave.
 *
 * Existe por la pantalla 7 del esquema: el cliente pide una portada de empaques
 * con botones a cada sección (APS, comparativa, performance, atributos, imagen,
 * gráficos, precio). Hasta ahora la historia era estrictamente lineal —flecha
 * adelante, flecha atrás— y no había manera de que una lámina mandara a otra.
 *
 * Va por CLAVE y no por número de lámina a propósito. Los índices se mueven en
 * cuanto alguien inserta una lámina en medio, y un botón que manda a la
 * pantalla equivocada es peor que no tener botón. La clave es la misma que ya
 * lleva cada `StoryCardFrame`, así que no hay una segunda lista que mantener.
 *
 * Si la clave no existe, `irALamina` no hace nada y avisa en consola. Fallar en
 * silencio dejaría un botón muerto que nadie nota hasta la presentación.
 */
export interface NavegacionDeHistoria {
  irALamina: (clave: string) => void;
  /** Qué claves existen, para que un botón pueda apagarse si su lámina no está. */
  existe: (clave: string) => boolean;
}

const Contexto = createContext<NavegacionDeHistoria | null>(null);

export const ProveedorDeNavegacion = Contexto.Provider;

export function useNavegacionDeHistoria(): NavegacionDeHistoria {
  const valor = useContext(Contexto);
  // Fuera del shell —en una prueba, o si alguien monta una lámina suelta— la
  // navegación no existe y los botones simplemente no hacen nada.
  return valor ?? { irALamina: () => {}, existe: () => false };
}
