/**
 * Las áreas Nielsen de México: la clasificación regional que la casa usa casi
 * siempre. Es la que pinta `MapaDeMexico` por omisión; un estudio con otra
 * (tiers de ciudades, zonas propias de la muestra) le pasa la suya.
 *
 * Los CÓDIGOS DE ESTADO del cuestionario (la pregunta de estado trae los suyos,
 * p. ej. 20 a 51) NO viven aquí a propósito: son ids de una pregunta, cambian
 * de un instrumento a otro y pasan por el mapeo como cualquier otro id. Aquí
 * sólo va lo que no cambia entre estudios: qué estado cae en qué área.
 *
 * Los nombres de estado son los comunes ("Ciudad de México", "Coahuila",
 * "Michoacán", "Veracruz"), los mismos que las llaves de `estados-mexico.ts`.
 */

export interface AreaNielsen {
  id: string;
  /** El código del área (1 a 6), el que viaja en las bases de datos. */
  codigo: number;
  nombre: string;
}

export const AREAS_NIELSEN: readonly AreaNielsen[] = [
  { id: "pacifico", codigo: 1, nombre: "Pacífico" },
  { id: "norte", codigo: 2, nombre: "Norte" },
  { id: "oeste-centro", codigo: 3, nombre: "Oeste-Centro" },
  { id: "centro", codigo: 4, nombre: "Centro" },
  { id: "cdmx", codigo: 5, nombre: "CDMX" },
  { id: "sureste", codigo: 6, nombre: "Sureste" },
];

export const AREA_NIELSEN_DE_ESTADO: Readonly<Record<string, string>> = {
  Aguascalientes: "oeste-centro",
  "Baja California": "pacifico",
  "Baja California Sur": "pacifico",
  Campeche: "sureste",
  Coahuila: "norte",
  Colima: "oeste-centro",
  Chiapas: "sureste",
  Chihuahua: "norte",
  "Ciudad de México": "cdmx",
  Durango: "norte",
  Guanajuato: "oeste-centro",
  Guerrero: "centro",
  Hidalgo: "centro",
  Jalisco: "oeste-centro",
  México: "centro",
  Michoacán: "oeste-centro",
  Morelos: "centro",
  Nayarit: "pacifico",
  "Nuevo León": "norte",
  Oaxaca: "sureste",
  Puebla: "centro",
  Querétaro: "centro",
  "Quintana Roo": "sureste",
  "San Luis Potosí": "norte",
  Sinaloa: "pacifico",
  Sonora: "pacifico",
  Tabasco: "sureste",
  Tamaulipas: "norte",
  Tlaxcala: "centro",
  Veracruz: "sureste",
  Yucatán: "sureste",
  Zacatecas: "norte",
};
