import { BarChart3, Cookie, HeartHandshake, Package, Tags, ThumbsUp } from "lucide-react";
import type { GrupoDeKpis, SolucionConKpis } from "@/lib/propuesta/tipos";

/**
 * Los KPIs que la casa entrega por solución, para no transcribirlos en cada
 * propuesta.
 *
 * ── DE DÓNDE SALEN ─────────────────────────────────────────────────────────
 *
 * Del kit comercial de Atlantia (las láminas "KPI's U&A", "KPI's BA" y "Kpi's
 * Base" de P&POSS; el Packaging Concept Test, del deck de soluciones), con el texto como quedó revisado en las primeras
 * propuestas (2026-10).
 *
 * Lo que se dejó fuera A PROPÓSITO: "Árbol de decisión de compra" de U&A (el
 * operador lo quitó en las dos propuestas que llevaban U&A) y el doble
 * asterisco del kit, que no trae leyenda. Si una propuesta lo pide, se agrega
 * en la propuesta, no aquí.
 *
 * ── CÓMO SE USA ────────────────────────────────────────────────────────────
 *
 * En la propuesta: `kpisDeLaCasa("ua")`. Si el vendedor quita o agrega grupos,
 * se ajusta ahí mismo:
 *
 *   { ...kpisDeLaCasa("ba"), grupos: kpisDeLaCasa("ba").grupos.filter(...) }
 *
 * Lo que el vendedor escribe para un estudio a la medida (el NPS de una
 * categoría, un B2B de servicios) va directo en la propuesta, con la misma forma.
 */
export type CatalogoDeKpis = "ua" | "ba" | "ba-complementarios" | "pposs" | "nps" | "pct";

const UA: GrupoDeKpis[] = [
  {
    nombre: "Hábitos de consumo",
    kpis: [
      "Número de consumidores en el hogar",
      "Frecuencia de consumo",
      "Lugares de consumo",
      "Drivers de consumo",
      "Limitantes de consumo",
      "Categorías acompañantes del consumo",
      "Momento de consumo (tiempo del día)",
      "Ocasiones de consumo de la categoría (actividades)",
      "Necesidades funcionales",
      "Necesidades emocionales",
    ],
  },
  {
    nombre: "Hábitos de compra",
    kpis: [
      "Frecuencia de compra",
      "Lugares de compra",
      "Ranking de atributos de compra",
      "Horarios y días de mayor demanda",
      "Decisor e influenciador de compra",
      "Detonadores de compra",
      "Volumen de compra",
      "Zero moment of truth",
      "Drivers espontáneos de compra y condicionadas",
      "Limitantes espontáneas de compra y condicionadas",
    ],
  },
  {
    nombre: "Posicionamiento de marca",
    kpis: [
      "Marcas compradas",
      "Marca frecuente",
      "Marcas abandonadas",
      "Razones de compra de la marca favorita",
      "Razones de no recompra o abandono",
      "Funnel de marca",
    ],
  },
  {
    nombre: "Perfilamiento por variables",
    kpis: ["Demográficos", "Frecuencia de compra", "Perfil de consumidor / shopper", "Marcas de consumo", "Lugares de compra"],
  },
  {
    nombre: "Clusterización por K-means",
    ejemplo: "cluster",
    kpis: [
      "Hábitos digitales: analógico, moderado, social, nativo digital",
      "Orientación a precio: price seeker / brand seeker / quality seeker",
      "Tendencias alimenticias: vegano, vegetariano, indiferente, dieta y moda",
      "Uso de tecnología: innovador, early adopter, mainstream, laggard",
      "Orientación a marca: premium, regular, marcas libres, moda",
    ],
  },
];

const BA: GrupoDeKpis[] = [
  {
    nombre: "Posicionamiento de marca",
    kpis: [
      "Segmentación de mercado",
      "Frecuencia de consumo (categoría)",
      "Top of Mind",
      "Share of Mind",
      "Brand Awareness",
      "Brands Used / Consume",
      "Most Frequently Used Brands",
      "Ultimate Brand Love",
      "Brand Funnel",
    ],
  },
  {
    nombre: "Indicadores de compra",
    kpis: [
      "Frecuencia de compra (categoría)",
      "Brand Purchase Intention",
      "Marca futura",
      "Brand Value Quadrant",
      "Índice de deseabilidad",
      "Drivers y limitantes de compra espontáneos de la marca",
      "Drivers y limitantes de compra ayudados de la marca",
    ],
  },
  {
    nombre: "Análisis de satisfacción de marca",
    kpis: [
      "Net Promoter Score de marca (NPS)",
      "Nivel de satisfacción con la marca",
      "Marca de rechazo",
      "Brand Rejection Index",
      "Elementos más y menos valorados (ayudado)",
    ],
  },
  {
    nombre: "Perfil de cliente de la marca por nivel de satisfacción",
    kpis: ["Perfil Lover", "Perfil Satisfied", "Perfil Potential", "Perfil Rejected", "Perfil Disappointed"],
  },
  {
    nombre: "Arquetipo de marca",
    kpis: ["12 Brand Archetypes Radial Chart", "Percepción de marca (espontáneo)"],
  },
  {
    nombre: "Análisis de atributos",
    ejemplo: "correspondencias",
    kpis: [
      "Principales atributos de la marca",
      "Elementos más valorados de la marca",
      "Elementos menos valorados de la marca",
      "Análisis comparativo de atributos de las marcas",
      "Análisis de correspondencias",
    ],
  },
  {
    nombre: "Match Index con la categoría",
    ejemplo: "match-index",
    kpis: [
      "Ranking de atributos de la categoría",
      "Ranking de atributos percibidos en la marca",
      "Gap entre atributos valorados de la categoría vs reconocidos en el elemento a evaluar",
    ],
  },
];

/** Los módulos que se suman a un Brand Awareness, cuando el vendedor los vende. */
const BA_COMPLEMENTARIOS: GrupoDeKpis[] = [
  {
    nombre: "Módulo de Recordación Publicitaria",
    kpis: [
      "Índice de recordación publicitaria espontánea",
      "Índice de recordación publicitaria ayudada",
      "Recordación publicitaria ayudada segmentada",
    ],
  },
  {
    nombre: "Módulo de Reputación de Marca",
    kpis: ["Índice de recordación de esfuerzos", "Ranking de recordación de esfuerzos", "Impacto de esfuerzos realizados"],
  },
  {
    nombre: "Módulo de Evaluación Rápida de Últimos Ads",
    kpis: [
      "Atributos de marca percibidos por la pieza",
      "Ratio de modificación de percepción",
      "Modificación de intención de compra",
      "Proyección de atributos de marca",
    ],
  },
  {
    nombre: "Módulo de Gestión de Crisis",
    kpis: ["Recordación de última crisis", "Ranking de momentos críticos", "Evaluación de manejo de crisis"],
  },
];

const PPOSS: GrupoDeKpis[] = [
  {
    nombre: "Indicadores de viabilidad de las innovaciones",
    kpis: [
      "Ranking de Preference Share sobre escenario actual",
      "Participación por SKU en escenario actual",
      "Participación por marca / agrupación",
      "Revenue por SKU en escenario actual",
    ],
  },
  {
    nombre: "Escenarios de mercado (2 en reporte)",
    kpis: [
      "Incrementalidad por SKU",
      "Incrementalidad por marca",
      "Variación del Preference share",
      "InnoSOV (Innovation Source of Volume)",
      "Canibalización por SKU",
      "Canibalización por marca",
      "Variación del revenue",
    ],
  },
  {
    nombre: "Price sensitivity Innovation",
    kpis: [
      "Punto de precio óptimo",
      "Punto marginal barato",
      "Punto marginal caro",
      "Punto de indiferencia",
      "Rango de precio aceptable",
      "Punto de precio que maximiza la demanda",
    ],
  },
  {
    nombre: "Simulador online · características",
    kpis: [
      "Accesos ilimitados a miembros autorizados del equipo",
      "Disponible en línea las 24 horas",
      "Configuración previa por puntos de precio según hipótesis o necesidades",
      "Escenarios de mercado ilimitados",
      "Capacitación para uso de simulador (En vivo y grabada)",
      "Acceso al histórico de simulaciones",
      "Descargable en Excel, listo para editarse por el usuario",
    ],
  },
  {
    nombre: "Simulador online · indicadores incluidos",
    kpis: [
      "Participación por SKU y marca",
      "Variación de la participación",
      "Revenue por SKU y marca",
      "Variación del revenue",
      "Índice de elasticidad de precio",
      "Histórico de simulaciones",
    ],
  },
];

/** Los cuatro grupos de un NPS competitivo, escritos para servir a cualquier categoría. */
const NPS: GrupoDeKpis[] = [
  {
    nombre: "Satisfacción",
    kpis: ["NSS", "Satisfacción positiva / neutral / negativa", "Índice de Satisfacción General", "Drivers Espontáneos de Satisfacción"],
  },
  {
    nombre: "Recomendación",
    kpis: ["NPS", "Promotor, pasivo y detractor", "Índice de recomendación General"],
  },
  {
    nombre: "Experiencia",
    kpis: ["Índice de Experiencia", "Asociación de Atributos por Marca", "Fortalezas Diferenciales por Marca"],
  },
  {
    nombre: "Oportunidades",
    kpis: ["Índice de Oportunidad", "Drivers de Insatisfacción", "Índice de Agrado / Desagrado", "Prioridades de Mejora"],
  },
];

/**
 * Packaging Concept Test. El kit comercial no trae su lámina de KPIs: se tomó
 * la del Fast Concept Test del deck de soluciones (junio 2026), con sus cuatro
 * módulos, por decisión de operaciones (2026-11). Cuando exista la lámina
 * "KPI's PCT" del kit, se sustituye aquí.
 */
const PCT: GrupoDeKpis[] = [
  {
    nombre: "Evaluación de conceptos",
    kpis: [
      "ACS · Atlantia Concept Score",
      "Elementos más y menos atractivos del concepto",
      "Intención de compra detonada",
      "Performance de la propuesta en conjunto con el producto",
    ],
  },
  {
    nombre: "Evaluación de nombre, envase o etiquetas",
    kpis: ["Evaluación de nombre", "Evaluación de envase", "Evaluación de etiquetas"],
  },
  {
    nombre: "Sensibilidad de precios",
    kpis: ["Precio ideal del concepto"],
  },
  {
    nombre: "Match Index",
    ejemplo: "match-index",
    kpis: [
      "Atributos asociados a la categoría",
      "Atributos asociados al producto",
      "Nivel de relacionamiento con la categoría",
    ],
  },
];

const CATALOGO: Record<CatalogoDeKpis, SolucionConKpis> = {
  ua: { nombre: "U&A · Usos y Hábitos", icono: Cookie, grupos: UA },
  ba: { nombre: "Brand Awareness", icono: HeartHandshake, grupos: BA },
  "ba-complementarios": { nombre: "Módulos complementarios", icono: BarChart3, grupos: BA_COMPLEMENTARIOS },
  pposs: { nombre: "P&POSS · Precio y portafolio", icono: Tags, grupos: PPOSS },
  nps: { nombre: "NPS y experiencia del cliente", icono: ThumbsUp, grupos: NPS },
  pct: { nombre: "Packaging Concept Test", icono: Package, grupos: PCT },
};

/** Una copia del catálogo, para que ajustarla en una propuesta no toque las demás. */
export function kpisDeLaCasa(cual: CatalogoDeKpis): SolucionConKpis {
  const s = CATALOGO[cual];
  return { ...s, grupos: s.grupos.map((g) => ({ ...g, kpis: [...g.kpis] })) };
}
