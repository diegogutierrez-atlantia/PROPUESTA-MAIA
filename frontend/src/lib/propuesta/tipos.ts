import type { LucideIcon } from "lucide-react";

/**
 * La forma de una propuesta: lo que se llena en `content/propuesta.ts`.
 *
 * ── POR QUÉ UNA PROPUESTA ES UN ARCHIVO DE DATOS ───────────────────────────
 *
 * Las cinco primeras propuestas (2026-10) se armaron cada una desde cero sobre
 * la base de reportes, y cada una volvió a hacer las mismas piezas: cuatro
 * Gantt distintos, cinco tarjetas económicas, los términos transcritos cinco
 * veces (y en una se perdió una palabra de una cláusula). Una propuesta sigue
 * un patrón; lo que cambia es lo que DICE, no cómo se dibuja.
 *
 * Por eso aquí se declara qué dice cada lámina y su `tipo`, y el catálogo de
 * `components/propuesta/` sabe cómo se dibuja cada tipo. Una propuesta nueva
 * no toca ningún componente.
 *
 * ── LO QUE NO VIENE AQUÍ ───────────────────────────────────────────────────
 *
 * Lo que es igual en todas las propuestas vive en `casa/`: los términos y
 * condiciones, el estándar de ejecución, los catálogos de KPIs, las plantillas
 * de cronograma, las láminas que explican un método, las herramientas de MAIA,
 * las capturas del entregable y los vendedores. Se ELIGE de ahí; no se copia.
 *
 * Las cifras (muestras, semanas, precios) son del vendedor. Ninguna se calcula
 * ni se inventa: si falta, se le pregunta.
 */

// ── La ficha ────────────────────────────────────────────────────────────────

export type Moneda = "MXN" | "USD";

export interface LogoDelCliente {
  /** Ruta dentro de `public/`, p. ej. "/cliente/logo.png". */
  archivo: string;
  /** Medidas reales del archivo, en píxeles. */
  ancho: number;
  alto: number;
  /**
   * Sobre qué va en la portada. "placa" (por omisión): una placa blanca, para
   * logos de colores o con fondo blanco. "directo": sobre el morado, para
   * logos claros pensados para fondo oscuro.
   */
  fondo?: "placa" | "directo";
}

export interface FichaDeLaPropuesta {
  /** A quién va dirigida. */
  cliente: string;
  logo?: LogoDelCliente;
  /** Lo que se lee en la barra de arriba y en la pestaña: «Propuesta de investigación · Tema». */
  rotulo: string;
  /** "Octubre 2026". */
  fecha: string;
  moneda: Moneda;
  /** La clave del vendedor en `casa/vendedores.ts`. Firma el cierre. */
  vendedor: string;
}

// ── Piezas que se repiten entre láminas ─────────────────────────────────────

/** Un renglón con rótulo opcional en negritas: «**Edad:** 25 a 65 años». */
export interface Renglon {
  rotulo?: string;
  valor: string;
}

/** Una tarjeta con ícono y su lista (especificaciones, cruces, método…). */
export interface TarjetaConLista {
  titulo: string;
  icono: LucideIcon;
  items: string[];
}

// ── Las láminas ─────────────────────────────────────────────────────────────

export interface LaminaPortada {
  tipo: "portada";
  /** El titular creativo de la propuesta. */
  titulo: string;
  /** La línea que dice de qué trata. */
  bajada: string;
  /** Lo que integra la propuesta: píldoras unidas con "+". */
  soluciones: string[];
  /** Lo que la propuesta se propone lograr, en una frase. */
  frase?: string;
  /** Foto de fondo opcional (en `public/separadores/`). Sin ella, el degradado de marca. */
  foto?: string;
}

/** Tres (o dos, o cuatro) tarjetas numeradas: dimensiones, perspectivas, retos. */
export interface PiezaNumerada {
  /** Kicker en mayúsculas ("MERCADO", "VALOR"). */
  etiqueta: string;
  titulo: string;
  texto: string;
  icono: LucideIcon;
}

export interface LaminaContexto {
  tipo: "contexto";
  titulo: string;
  /** El párrafo de contexto. */
  texto?: string;
  /** La frase en negritas que presenta las tarjetas. */
  invitacion?: string;
  piezas: PiezaNumerada[];
  /** Si las piezas se suman (perspectivas que se complementan), van unidas con "+". */
  unidasCon?: "+";
  /** La frase de remate, en la banda de color. */
  cierre?: string;
}

export interface LaminaRetos {
  tipo: "retos";
  titulo: string;
  retos: PiezaNumerada[];
}

export interface PreguntaDeNegocio {
  texto: string;
  icono: LucideIcon;
  /** Una línea de detalle debajo de la pregunta, si el vendedor la dio. */
  detalle?: string;
}

export interface LaminaPreguntas {
  tipo: "preguntas";
  titulo: string;
  preguntas: PreguntaDeNegocio[];
}

export interface EtapaDelMetodo {
  /** El nombre de la etapa ("AI MARKET PULSE"). */
  nombre: string;
  /** Una segunda línea bajo el nombre, opcional ("Validación de conceptos y sabores"). */
  subtitulo?: string;
  texto: string;
  icono: LucideIcon;
}

export interface LaminaComo {
  tipo: "como";
  titulo: string;
  /** Párrafo de entrada, opcional. */
  texto?: string;
  /** El kicker de cada tarjeta: "Etapa" → "ETAPA 1". */
  rotuloDeEtapa?: string;
  /**
   * true: van en secuencia, con flechas entre una y otra ("primero esto, luego
   * aquello"). false: son independientes (tres propuestas que se contratan por
   * separado) y van sin flechas.
   */
  encadenadas: boolean;
  etapas: EtapaDelMetodo[];
}

export type Explicativa = "cluster" | "correspondencias" | "match-index";

export interface GrupoDeKpis {
  nombre: string;
  kpis: string[];
  /** Una lámina de la casa que explica el método; se abre desde el grupo. */
  ejemplo?: Explicativa;
}

export interface SolucionConKpis {
  nombre: string;
  icono: LucideIcon;
  grupos: GrupoDeKpis[];
  /** Una nota al pie de la solución ("* Proyectos intermedios"). */
  nota?: string;
}

export interface LaminaKpis {
  tipo: "kpis";
  titulo: string;
  /** Una por columna. Lo de la casa se toma con `kpisDeLaCasa()` y se ajusta. */
  soluciones: SolucionConKpis[];
}

export interface LaminaEntregable {
  tipo: "entregable";
  titulo?: string;
  /** Qué juego de capturas de la casa (`casa/entregable.ts`). */
  capturas: "dashboard";
  /** Una liga a un demo en vivo, si el vendedor la quiere enseñar. */
  demo?: { etiqueta: string; url: string };
}

export interface LaminaExplicativa {
  tipo: "explicativa";
  cual: Explicativa;
}

/** Dónde se levanta: el mapa por áreas Nielsen, unas plazas, o países. */
export type Cobertura =
  | { tipo: "nielsen" }
  | { tipo: "plazas"; plazas: { estado: string; etiqueta: string }[] }
  | { tipo: "paises"; paises: { clave: string; nombre: string }[] }
  | { tipo: "ninguna" };

export interface LaminaPerfil {
  tipo: "perfil";
  titulo: string;
  /** A quién se entrevista: los renglones con palomita. */
  perfil: Renglon[];
  /** Especificaciones, cruces, extensión, método… Sólo las que el estudio tiene. */
  tarjetas: TarjetaConLista[];
  /** El recuadro punteado: alcance y muestras, como texto ("250 / 200"). */
  recuadro: Renglon[];
  cobertura: Cobertura;
}

export interface Rango {
  min: number;
  max: number;
}

export interface LaminaCuotas {
  tipo: "cuotas";
  titulo: string;
  /** Cuotas puntuales: una barra por renglón. */
  cuotas?: { etiqueta: string; entrevistas: number }[];
  /** O tablas de rangos (porcentajes 0 a 1 y personas). */
  tablas?: {
    titulo: string;
    columnaEtiqueta: string;
    renglones: { etiqueta: string; porcentaje?: Rango; personas: Rango }[];
  }[];
  nota?: string;
}

export type FaseDelCronograma = "arranque" | "preparacion" | "campo" | "analisis" | "dashboard" | "entrega";

export interface ActividadDelCronograma {
  nombre: string;
  /** Día hábil en que empieza (el primero es 1). */
  desde: number;
  /** Día hábil en que termina, incluido. Una actividad de un día: desde = hasta. */
  hasta: number;
  fase: FaseDelCronograma;
}

export interface Cronograma {
  /** "Cuantitativo", "U&A". */
  nombre: string;
  actividades: ActividadDelCronograma[];
}

export interface LaminaTimeline {
  tipo: "timeline";
  titulo?: string;
  /** Uno se pinta directo; dos o más, cada uno en su tarjeta con botón. */
  cronogramas: Cronograma[];
  /** Las consideraciones de la casa van por omisión; aquí se agregan otras. */
  consideraciones?: string[];
}

export interface CostoDeLaOpcion {
  rotulo: string;
  monto: number;
  /** Sus partes. Si vienen, deben sumar el monto. */
  desglose?: { rotulo: string; monto: number }[];
}

export interface OpcionEconomica {
  /** "Propuesta 1", "Opción 2". */
  etiqueta: string;
  /** Las cifras grandes de la cabecera: la muestra de cada estudio. */
  cifras: { valor: number; rotulo: string }[];
  /** Una línea bajo las cifras, opcional. */
  detalle?: string;
  /** Una o dos líneas que nombran el estudio ("Conjoint + Elasticidad"). */
  estudio?: string[];
  especificaciones?: { titulo?: string; items: string[] };
  alcances?: Renglon[];
  /** Precios por renglón (país, ciudad, ola): concepto, muestra y costo. */
  tabla?: { columnas: [string, string, string]; filas: { concepto: string; muestra?: number; monto: number }[] };
  costos?: CostoDeLaOpcion[];
  /**
   * El total. Por omisión DEBE ser la suma de `costos` (o de la tabla): si no
   * cuadra, la lámina no se arma. Cuando el vendedor da un total que no es
   * suma (descuento por compra conjunta), va `sinSumar: true` y su `nota`.
   */
  total?: { rotulo: string; monto: number; sinSumar?: boolean; nota?: string };
}

export interface LaminaEconomica {
  tipo: "economica";
  titulo?: string;
  opciones: OpcionEconomica[];
}

export interface LaminaEstandar {
  tipo: "estandar";
  /** Lo que cambia contra el estándar de la casa (`casa/estandar.ts`). */
  cambios?: {
    /** "**18 minutos**", "**25 minutos** cuanti y **60 minutos** cuali". */
    extension?: string;
    cruces?: string[];
    traduccion?: string;
  };
}

export interface LaminaTerminos {
  tipo: "terminos";
}

export interface TramoDeCreditos {
  desde: number;
  hasta: number;
  /** Precio por crédito, en la moneda de la ficha. */
  precio: number;
}

export interface LaminaMaia {
  tipo: "maia";
  titulo?: string;
  /** Qué herramientas de `casa/maia.ts` entran (por su sigla). */
  herramientas: string[];
  /** Los precios por crédito los da el vendedor. */
  tramos: TramoDeCreditos[];
}

export interface LaminaCierre {
  tipo: "cierre";
  /** La frase de cierre. */
  frase: string;
}

export type Lamina =
  | LaminaPortada
  | LaminaContexto
  | LaminaRetos
  | LaminaPreguntas
  | LaminaComo
  | LaminaKpis
  | LaminaEntregable
  | LaminaExplicativa
  | LaminaPerfil
  | LaminaCuotas
  | LaminaTimeline
  | LaminaEconomica
  | LaminaEstandar
  | LaminaTerminos
  | LaminaMaia
  | LaminaCierre;

export type TipoDeLamina = Lamina["tipo"];

// ── Los actos ───────────────────────────────────────────────────────────────

export interface ActoDeLaPropuesta {
  /** El nombre del acto en el índice ("Retos y preguntas de negocio"). */
  titulo: string;
  /**
   * La cortinilla que abre el acto. Se numera sola, en orden. Sin ella el acto
   * empieza directo en su primera lámina (la apertura, el cierre).
   */
  separador?: {
    /** Lo que dice la cortinilla; por omisión, el título del acto. */
    titulo?: string;
    /** Una línea debajo. */
    entrada?: string;
    /** Foto de fondo, en `public/separadores/`. */
    foto?: string;
  };
  laminas: Lamina[];
}

export interface Propuesta {
  ficha: FichaDeLaPropuesta;
  actos: ActoDeLaPropuesta[];
}
