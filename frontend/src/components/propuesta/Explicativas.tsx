import type { ReactNode } from "react";
import type { Explicativa } from "@/lib/propuesta/tipos";

/**
 * Las láminas que explican un método de la casa: Análisis Clúster, Análisis de
 * correspondencias y Match Index.
 *
 * Los textos son los del kit comercial de Atlantia, LITERALES. Las tres
 * decisiones que las definen:
 *
 * 1. MISMA ESTRUCTURA LAS TRES: la pregunta que contesta, el nombre del método,
 *    qué es, dos o tres razones y, a la derecha, un esquema. Quien abre la
 *    segunda ya sabe dónde buscar.
 *
 * 2. LOS ESQUEMAS SON ESQUEMAS, NO DATOS: ninguna cifra. Los puntos van en
 *    posiciones fijas (nada de `Math.random()`, que haría creer que el dato se
 *    movió). La imagen original del Match Index traía porcentajes de ejemplo;
 *    no se usaron.
 *
 * 3. VAN SOBRE COLOR: se usan como lámina propia (tipo `explicativa`) o se
 *    abren encima desde un grupo de KPIs (`ejemplo`), y en los dos casos se
 *    ven como una lámina de la propuesta.
 */
export const NOMBRE_DE_EXPLICATIVA: Record<Explicativa, string> = {
  cluster: "Análisis Clúster",
  correspondencias: "Análisis de correspondencias",
  "match-index": "Match Index",
};

export function ContenidoExplicativo({ cual }: { cual: Explicativa }) {
  if (cual === "cluster") return <LaminaCluster />;
  if (cual === "correspondencias") return <LaminaCorrespondencias />;
  return <LaminaMatchIndex />;
}

interface Punto {
  titulo: string;
  texto: string;
}

const Resaltado = ({ children }: { children: ReactNode }) => (
  <span style={{ color: "var(--color-turquoise-40)" }}>{children}</span>
);

function Explicacion({
  pregunta,
  nombre,
  que,
  puntos,
  esquema,
}: {
  pregunta: ReactNode;
  nombre: string;
  que: string;
  puntos: Punto[];
  esquema: ReactNode;
}) {
  return (
    <div className="stagger grid flex-1 items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <p className="font-heading text-lead font-bold leading-snug">{pregunta}</p>
        <h2 className="font-heading text-h1 font-extrabold leading-[1.02]">{nombre}</h2>
        <p className="text-body leading-relaxed opacity-90">{que}</p>
        <dl className="flex flex-col gap-5">
          {puntos.map((p) => (
            <div key={p.titulo} className="flex flex-col gap-1">
              <dt className="font-heading text-body font-bold" style={{ color: "var(--color-turquoise-40)" }}>
                {p.titulo}
              </dt>
              <dd className="text-body leading-relaxed opacity-90">{p.texto}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex min-h-[18rem] items-center justify-center rounded-3xl border border-white/25 bg-white/10 p-6 shadow-lg backdrop-blur-md lg:min-h-[26rem] lg:p-8">
        {esquema}
      </div>
    </div>
  );
}

/** Los puntos del esquema del clúster: posiciones fijas, deterministas. */
const GRUPO_A = [
  [60, 52], [74, 40], [88, 58], [70, 70], [96, 46], [54, 78], [84, 82], [102, 66], [66, 34], [92, 30],
];
const GRUPO_B = [
  [122, 62], [138, 48], [150, 72], [130, 86], [160, 56], [144, 96], [172, 80], [116, 94], [156, 36],
];
const GRUPO_C = [
  [176, 108], [190, 122], [168, 126], [184, 140], [200, 112], [172, 146], [196, 134],
];

function EsquemaCluster() {
  return (
    <svg viewBox="0 0 240 180" className="h-auto w-full" role="img" aria-label="Tres grupos de personas agrupadas por semejanza">
      <rect x="1" y="1" width="238" height="178" rx="12" fill="none" stroke="var(--border)" />
      {[0, 1, 2, 3].map((i) => (
        <line key={`h${i}`} x1="10" x2="230" y1={30 + i * 40} y2={30 + i * 40} stroke="var(--border)" />
      ))}
      <ellipse cx="80" cy="56" rx="52" ry="38" fill="none" stroke="var(--cat-1)" strokeWidth="1.5" />
      <ellipse cx="144" cy="68" rx="46" ry="42" fill="none" stroke="var(--cat-3)" strokeWidth="1.5" />
      <ellipse cx="186" cy="126" rx="34" ry="30" fill="none" stroke="var(--cat-4)" strokeWidth="1.5" />
      {GRUPO_A.map(([x, y], i) => <circle key={`a${i}`} cx={x} cy={y} r="3.2" fill="var(--cat-1)" />)}
      {GRUPO_B.map(([x, y], i) => <circle key={`b${i}`} cx={x} cy={y} r="3.2" fill="var(--cat-3)" />)}
      {GRUPO_C.map(([x, y], i) => <circle key={`c${i}`} cx={x} cy={y} r="3.2" fill="var(--cat-4)" />)}
    </svg>
  );
}

function EsquemaCorrespondencias() {
  const atributos = [
    [28, 30], [64, 22], [120, 40], [38, 74], [78, 64], [96, 100], [150, 70], [168, 108], [188, 56], [62, 124], [118, 132], [204, 130],
  ];
  return (
    <svg viewBox="0 0 240 180" className="h-auto w-full" role="img" aria-label="Mapa de marcas y atributos">
      <rect x="1" y="1" width="238" height="178" rx="12" fill="none" stroke="var(--border)" />
      <line x1="120" x2="120" y1="10" y2="170" stroke="var(--border)" strokeDasharray="4 4" />
      <line x1="10" x2="230" y1="90" y2="90" stroke="var(--border)" strokeDasharray="4 4" />
      <rect x="50" y="48" width="56" height="42" rx="6" fill="var(--cat-1)" fillOpacity="0.14" stroke="var(--cat-1)" />
      <rect x="140" y="60" width="62" height="52" rx="6" fill="var(--cat-3)" fillOpacity="0.14" stroke="var(--cat-3)" />
      <rect x="72" y="112" width="64" height="40" rx="6" fill="var(--cat-2)" fillOpacity="0.14" stroke="var(--cat-2)" />
      {atributos.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="var(--atenuado)" />)}
      <polygon points="90,70 98,84 82,84" fill="var(--cat-1)" />
      <polygon points="178,82 186,96 170,96" fill="var(--cat-3)" />
      <polygon points="108,134 116,148 100,148" fill="var(--cat-2)" />
    </svg>
  );
}

/** Barras divergentes: sólo enseñan que hay zonas arriba y abajo de la línea. */
const DIVERGENTES: { lado: "der" | "izq"; ancho: string }[] = [
  { lado: "der", ancho: "22%" },
  { lado: "der", ancho: "58%" },
  { lado: "der", ancho: "86%" },
  { lado: "izq", ancho: "62%" },
  { lado: "der", ancho: "16%" },
  { lado: "izq", ancho: "28%" },
  { lado: "der", ancho: "52%" },
  { lado: "izq", ancho: "14%" },
  { lado: "der", ancho: "74%" },
  { lado: "izq", ancho: "40%" },
];

function EsquemaMatchIndex() {
  return (
    <div className="relative flex w-full flex-col gap-2 py-2" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-[22%] rounded-l-xl bg-pista" />
      <div className="absolute inset-y-0 right-0 w-[22%] rounded-r-xl bg-pista" />
      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-border" />
      {DIVERGENTES.map((b, i) => (
        <div key={i} className="relative flex h-5 items-center">
          <span
            className={`absolute h-full rounded-sm ${b.lado === "der" ? "left-1/2" : "right-1/2"}`}
            style={{
              width: `calc(${b.ancho} / 2)`,
              backgroundColor: b.lado === "der" ? "var(--color-turquoise-100)" : "var(--color-secondary)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function LaminaCluster() {
  return (
    <Explicacion
      pregunta={
        <>
          Visualiza la diversidad real de tu mercado en <Resaltado>grupos accionables</Resaltado>.
        </>
      }
      nombre="Análisis Clúster"
      que="Utilizando K-means, un algoritmo iterativo para generar grupos e identificar perfiles demográficos, por comportamientos, necesidades y otras variables de valor real."
      puntos={[
        { titulo: "Objetividad", texto: "Los datos definen los grupos, eliminando sesgos humanos o “corazonadas”." },
        {
          titulo: "Microsegmentación",
          texto: "No solo es recolectar datos; les damos una identidad para que sepas exactamente a quién venderle.",
        },
        { titulo: "Agilidad de Big Data", texto: "La forma más eficiente de convertir datos crudos en información accionable." },
      ]}
      esquema={<EsquemaCluster />}
    />
  );
}

function LaminaCorrespondencias() {
  return (
    <Explicacion
      pregunta={
        <>
          Identifica los atributos con los que tu <Resaltado>marca</Resaltado> tiene{" "}
          <Resaltado>mayor asociación</Resaltado>
        </>
      }
      nombre="Análisis de correspondencias"
      que="Es una técnica de reducción de dimensionalidad y visualización para poder identificar en un mapa bidimensional los atributos que se perciben más próximos a una marca en un escenario diverso donde están también varios competidores."
      puntos={[
        {
          titulo: "Atributos positivos / negativos",
          texto:
            "Mediante preguntas de asociación directa realizadas a usuarios de cada marca, se obtienen las frecuencias para el análisis.",
        },
        {
          titulo: "Zonas compartidas con los competidores",
          texto:
            "Permite determinar qué atributos se comparten en asociación, cuáles son más lejanos y cuáles pueden estar siendo diferenciadores para la marca.",
        },
      ]}
      esquema={<EsquemaCorrespondencias />}
    />
  );
}

function LaminaMatchIndex() {
  return (
    <Explicacion
      pregunta={
        <>
          ¿Proyectas lo que se necesita en la <Resaltado>categoría</Resaltado>?
        </>
      }
      nombre="Match Index"
      que="Es un indicador desarrollado por Atlantia para identificar si los atributos percibidos en un concepto o marca se encuentran en el nivel esperado en relación a su categoría."
      puntos={[
        {
          titulo: "Zonas de indexación",
          texto: "Zonas en las que hay una diferencia importante entre atributos, positiva o negativa.",
        },
        {
          titulo: "Tipos de atributos",
          texto:
            "Clasificación con relación a las distancias relevantes entre atributos para poder identificar los gaps que realmente son importantes o bien, pueden ser diferenciales en la categoría.",
        },
      ]}
      esquema={<EsquemaMatchIndex />}
    />
  );
}
