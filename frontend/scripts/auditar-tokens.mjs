// Comprueba que TODO lo que el código pide del CSS exista de verdad.
//
// ── POR QUÉ EXISTE ─────────────────────────────────────────────────────────
//
// Nueve gráficas del repo base pintaban la pista de sus barras con
// `var(--pista)`, y ese token no estaba declarado en ninguna parte. El
// resultado: las barras se dibujaban SIN carril, así que una barra al 30% se
// leía como una barra suelta en vez de como el 30% de algo.
//
// Y no lo atrapó nada. Los tipos compilaban, el build pasaba, las auditorías
// de método y de reglas salían en verde. **Un token que no existe no es un
// error de compilación: es un color que simplemente no se pinta.** Falla en
// silencio y sólo se ve mirando la lámina, que es exactamente el modo de falla
// que esta casa no tolera en una cifra y tampoco debería tolerar en su marco.
//
// Revisa cuatro cosas:
//
//   1. Todo `var(--x)` del código tiene su `--x:` declarado.
//   2. Toda clase de la casa que usa el código está definida en el CSS.
//   3. Todo token de tema declarado en CLARO existe también en OSCURO, y al
//      revés. Uno que falta de un lado se queda con el valor del otro y pinta
//      mal sin avisar.
//   4. Ningún componente escribe un hex o un rgba a mano: pide tokens.
//   5. Todo script de package.json apunta a un archivo que existe.
//   6. Ningún tamaño va en px: no crecería con la pantalla (ver globals.css,
//      "La lámina guarda su proporción").
//
// Uso:  pnpm auditar:tokens

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = join(RAIZ, "src", "app", "globals.css");

const ROJO = "\x1b[31m";
const VERDE = "\x1b[32m";
const GRIS = "\x1b[90m";
const FIN = "\x1b[0m";

/**
 * Los que NO declara globals.css y aun así existen.
 *
 * `next/font` inyecta las suyas como variables en el <html>, así que no están
 * en la hoja y sí resuelven. Es la única excepción legítima; cualquier otra
 * que alguien quiera agregar aquí tiene que venir con su motivo.
 */
const DECLARADOS_FUERA = new Set(["font-poppins", "font-hind"]);

if (!existsSync(CSS)) {
  console.error("\nNo encontre src/app/globals.css.\n");
  process.exit(1);
}

const css = readFileSync(CSS, "utf8");

// ---------------------------------------------------------------------------

function* archivos(carpeta, ext) {
  if (!existsSync(carpeta)) return;
  for (const nombre of readdirSync(carpeta)) {
    const ruta = join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) {
      yield* archivos(ruta, ext);
      continue;
    }
    if (ext.some((e) => nombre.toLowerCase().endsWith(e))) yield ruta;
  }
}

const fuentes = [...archivos(join(RAIZ, "src"), [".tsx", ".ts"])];
const hallazgos = [];

// ── 1. Tokens usados que nadie declara ──────────────────────────────────────

const declarados = new Set([...css.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((m) => m[1]));

for (const ruta of fuentes) {
  const texto = readFileSync(ruta, "utf8");
  const vistos = new Set();
  for (const m of texto.matchAll(/var\(--([a-z0-9-]+)/gi)) {
    const token = m[1];
    if (declarados.has(token) || DECLARADOS_FUERA.has(token) || vistos.has(token)) continue;
    vistos.add(token);
    hallazgos.push({
      que: `--${token}`,
      donde: relative(RAIZ, ruta),
      porque: "se usa pero no está declarado en globals.css",
      efecto: "el color no se pinta, y la falla no se ve en el build",
    });
  }
}

// ── 2. Clases de la casa usadas y no definidas ──────────────────────────────
// Sólo las nuestras: las de Tailwind las resuelve el compilador y listarlas
// aquí sería reimplementar Tailwind.

const PREFIJOS_CASA = ["card-bg-", "card-grain", "brand-gradient", "stagger", "recorrido", "a-la-vista", "mando-oculto", "kicker-marca", "note-fall", "grow-bar", "palabra-", "pista-teclas", "solo-en-", "cajon-", "espejo-", "arco-", "linea-", "paso-", "bolita-", "abanico-sector", "tintineo", "baldosa-", "punto-que-", "glifo-"];

for (const ruta of fuentes) {
  const texto = readFileSync(ruta, "utf8");
  const vistos = new Set();
  for (const m of texto.matchAll(/["'`\s]([a-z][a-z0-9-]{2,})["'`\s]/gi)) {
    const clase = m[1];
    if (!PREFIJOS_CASA.some((p) => clase.startsWith(p))) continue;
    if (vistos.has(clase)) continue;
    vistos.add(clase);
    if (css.includes(`.${clase}`)) continue;
    hallazgos.push({
      que: `.${clase}`,
      donde: relative(RAIZ, ruta),
      porque: "es una clase de la casa que el CSS no define",
      efecto: "el elemento se queda sin ese tratamiento, en silencio",
    });
  }
}

// ── 3. Paridad entre los dos temas ──────────────────────────────────────────
// Un token que existe en claro y no en oscuro se queda con el valor claro
// sobre fondo hondo: no revienta, se ve mal. Y eso sólo se descubre abriendo
// el reporte en el otro tema, que es justo lo que nadie hace.

function tokensDe(selector) {
  const i = css.indexOf(selector);
  if (i === -1) return null;
  const abre = css.indexOf("{", i);
  let nivel = 0;
  let fin = abre;
  for (let k = abre; k < css.length; k++) {
    if (css[k] === "{") nivel++;
    else if (css[k] === "}") {
      nivel--;
      if (nivel === 0) {
        fin = k;
        break;
      }
    }
  }
  const bloque = css.slice(abre, fin);
  return new Set([...bloque.matchAll(/--([a-z0-9-]+)\s*:/gi)].map((m) => m[1]));
}

// El lado CLARO son dos bloques, no uno: `@theme` declara los colores de marca
// y la escala tipográfica, `:root` declara el papel y la tinta. Comparar sólo
// contra `:root` marcaba como huérfanas las variantes `-ink`, que viven en
// `@theme` y el tema oscuro sí redefine. Un auditor que grita por algo correcto
// se desactiva a la semana, y entonces deja de servir para lo que sí importa.
const theme = tokensDe("@theme {") ?? new Set();
const raiz = tokensDe(":root {") ?? new Set();
const claro = raiz.size || theme.size ? new Set([...theme, ...raiz]) : null;
const oscuro = tokensDe(':root[data-theme="oscuro"]');

/**
 * Los que a propósito viven en un solo tema.
 *
 * Un token de MARCA no voltea: el morado es el mismo en los dos. Lo que tiene
 * que estar en los dos es el PAPEL y la TINTA. Si agregas algo aquí, escribe
 * por qué no voltea.
 */
const SOLO_EN_CLARO = new Set([]);

// La comprobación va en DOS DIRECCIONES DISTINTAS, porque los dos bloques del
// lado claro no juegan el mismo papel:
//
//   `@theme` son la MARCA y la escala tipográfica. No voltean nunca: el morado
//           es el mismo en los dos temas, y un texto no cambia de tamaño porque
//           el fondo se oscurezca. Que no estén en oscuro es lo correcto.
//   `:root` es el PAPEL y la TINTA. Eso sí tiene que voltear entero: un token
//           de papel que no está en oscuro se queda con su valor claro sobre
//           fondo hondo.
//
// Y al revés: un token declarado SÓLO en oscuro no tiene base, así que en claro
// simplemente no existe y el color se cae.
if (claro && oscuro) {
  for (const t of raiz) {
    if (oscuro.has(t) || SOLO_EN_CLARO.has(t)) continue;
    hallazgos.push({
      que: `--${t}`,
      donde: "globals.css",
      porque: "es papel o tinta (`:root`) y NO tiene su versión oscura",
      efecto: "sobre fondo hondo conserva el valor claro y se ve mal, sin reventar",
    });
  }
  for (const t of oscuro) {
    if (claro.has(t)) continue;
    hallazgos.push({
      que: `--${t}`,
      donde: "globals.css",
      porque: "se declara sólo en oscuro, sin base en `@theme` ni en `:root`",
      efecto: "en claro no existe, así que el color se cae",
    });
  }
} else {
  hallazgos.push({
    que: "los bloques de tema",
    donde: "globals.css",
    porque: "no encontré `:root` o `:root[data-theme=\"oscuro\"]`",
    efecto: "no pude comprobar la paridad entre los dos temas",
  });
}

// ── 4. Hex sueltos en componentes ───────────────────────────────────────────
// Un hex en un componente no voltea con el tema: es la ÚNICA forma de romper
// el modo oscuro, y fue exactamente lo que pasó (VIOLET[1] fijo sobre fondo
// hondo). El catálogo vive en globals.css; los componentes piden tokens.
//
// Esto NO mide contraste. El auditor de contraste se retiró a propósito
// (2026-09): daba veredictos que la vista desmentía y estresaba al equipo. Si
// un color del catálogo se ve, se ve. Lo que sí se comprueba es que el color
// EXISTA en el catálogo.

const PERMITEN_HEX = new Set(["src/middleware.ts"]); // la compuerta no carga globals.css
for (const ruta of fuentes) {
  const rel = relative(RAIZ, ruta).split("\\").join("/");
  if (PERMITEN_HEX.has(rel)) continue;
  const texto = readFileSync(ruta, "utf8");
  // Sin comentarios: un hex citado en un comentario es historia, no pintura.
  const sinComentarios = texto.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
  for (const m of sinComentarios.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b(?![0-9a-f])|rgba?\(\s*\d/gi)) {
    hallazgos.push({
      que: m[0],
      donde: rel,
      porque: "es un color escrito a mano, fuera del catálogo",
      efecto: "no voltea con el tema: se ve bien en claro y desaparece en oscuro, o al revés",
    });
  }
}

// ── 4b. Fondos fijos que no declaran su superficie ──────────────────────────
// Un fondo FIJO no voltea con el tema: un blanco es blanco en los dos, un
// morado de marca es morado en los dos. Pero el texto de adentro, si pide un
// token, sí voltea, y le toca la tinta del papel de AFUERA. Así salió en MIO
// una tarjeta blanca con letra blanca en oscuro (2026-09), y el punto 4 la dio
// por buena porque cada color, por separado, era del catálogo.
//
// La regla: todo elemento con fondo fijo y contenido adentro declara
// `data-superficie="clara"` o `"honda"` EN LA MISMA ETIQUETA. Con eso, lo de
// adentro toma la tinta correcta sin que nadie la escoja (ver globals.css,
// "Las superficies traen su tinta"). Se revisa la misma etiqueta y no el
// árbol, a propósito: adivinar qué componente queda encima de cuál es lo que
// hace frágil a un auditor, y uno que grita por algo correcto se desactiva.
//
// LO QUE NO VE, para que nadie lea "verde" como "todo se lee":
//   · un fondo que llega en una variable (`backgroundColor: color`) o en un
//     mapa de clases fuera de la etiqueta (`TONE_CLASSES`),
//   · los degradados (`from-…`), que en la casa son filetes y velos,
//   · los rellenos translúcidos (`bg-white/20`), que son veladuras,
//   · y el contraste en sí: la letra correcta sobre una superficie la decide
//     el catálogo, no este script.

const FONDO_FIJO_CLASE =
  /(?:^|[\s"'`:])(bg-(?:white|black|primary(?:-900)?|secondary|turquoise|lemon|sobre-relleno|banda-\d|positivo|negativo|advertencia|alerta|error|(?:violet|purple|turquoise|lemon|neutral|green|yellow|orange|red)-\d+)|card-bg-(?:primary|secondary|marino|ink|turquoise))(?![\w/-])/g;
const FONDO_FIJO_ESTILO =
  /background(?:Color)?:\s*(?:["'`]var\(--color-[a-z0-9-]+\)["'`]|SOBRE_RELLENO\b|TURQUESA\b|LIMON\b)/g;

/** La etiqueta JSX que contiene la posición `i`: de su `<` a su `>`, saltando llaves y comillas. */
function etiquetaEn(texto, i) {
  let ini = i;
  while (ini > 0 && !(texto[ini] === "<" && /[A-Za-z]/.test(texto[ini + 1] ?? ""))) ini--;
  let nivel = 0;
  let comilla = null;
  for (let k = ini + 1; k < texto.length; k++) {
    const c = texto[k];
    if (comilla) {
      if (c === comilla && texto[k - 1] !== "\\") comilla = null;
    } else if (c === '"' || c === "'" || c === "`") comilla = c;
    else if (c === "{") nivel++;
    else if (c === "}") nivel--;
    else if (c === ">" && nivel === 0) return { ini, texto: texto.slice(ini, k + 1) };
  }
  return { ini, texto: texto.slice(ini) };
}

for (const ruta of fuentes) {
  if (!ruta.endsWith(".tsx")) continue;
  const rel = relative(RAIZ, ruta).split("\\").join("/");
  const texto = readFileSync(ruta, "utf8").replace(/\{\/\*[\s\S]*?\*\/\}/g, (m) => " ".repeat(m.length));
  const vistas = new Set();
  for (const patron of [FONDO_FIJO_CLASE, FONDO_FIJO_ESTILO]) {
    for (const m of texto.matchAll(patron)) {
      const { ini, texto: etiqueta } = etiquetaEn(texto, m.index);
      // Fuera de una etiqueta (un mapa de clases, un tipo genérico `Record<…>`)
      // no hay dónde declarar nada: la declaración va en la etiqueta que usa
      // el mapa. Ver StoryCardFrame.
      if (m.index > ini + etiqueta.length) continue;
      if (vistas.has(etiqueta)) continue;
      vistas.add(etiqueta);
      // Sin contenido no hay letra que se pierda: autocerradas y decorativas.
      if (etiqueta.endsWith("/>") || /\baria-hidden\b/.test(etiqueta)) continue;
      if (/\bdata-superficie\b/.test(etiqueta)) continue;
      const linea = texto.slice(0, m.index).split("\n").length;
      hallazgos.push({
        que: (m[1] ?? m[0]).trim(),
        donde: `${rel}:${linea}`,
        porque: "es un fondo fijo con contenido encima y no declara data-superficie",
        efecto: "el texto de adentro toma la tinta del tema de afuera: en un tema, letra del color del fondo",
      });
    }
  }
}

// ── 4c. Tamaños en px ───────────────────────────────────────────────────────
// La raíz del reporte crece con la pantalla (globals.css): todo lo que está en
// rem crece con ella y la lámina guarda su proporción en un monitor grande o
// con el navegador alejado. Un tamaño en px se queda fijo, y en esa pantalla
// sale chico: así se perdieron el pie de fuente y las etiquetas de las
// gráficas en la presentación de un operador (2026-09).
//
// Se revisan las clases con valor arbitrario (`text-[11px]`, `w-[620px]`) y
// el `fontSize` en estilo. Quedan fuera los trazos (bordes, anillos, sombras,
// radios, desenfoques) y todo lo de 1 a 3px: son filete, no tamaño.
//
// OJO dentro de un SVG con viewBox: ahí la letra NO va en rem. El dibujo
// entero ya crece con su caja, y una letra en rem crecería dos veces. Va con
// el atributo `fontSize={11}`, en unidades del dibujo (este script no lo
// marca). Se cazó al convertir las etiquetas de la curva de Van Westendorp.

const TRAZO = /^(-?)(rounded|border|ring|outline|shadow|blur|drop-shadow|stroke|decoration|underline-offset|tracking)/;
const CLASE_EN_PX = /(?<![\w-])(?:[a-z]+:)*-?([a-z][a-z0-9-]*)-\[-?(\d+(?:\.\d+)?)px\]/g;
const FUENTE_EN_PX = /fontSize:\s*(?:["'`](\d+(?:\.\d+)?)px["'`]|(\d+(?:\.\d+)?)\b)/g;

for (const ruta of fuentes) {
  const rel = relative(RAIZ, ruta).split("\\").join("/");
  const lineas = readFileSync(ruta, "utf8").split("\n");
  let enComentario = false;
  lineas.forEach((l, k) => {
    const t = l.trim();
    const esComentario = enComentario || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*") || t.startsWith("{/*");
    if (/\/\*/.test(l) && !/\*\//.test(l)) enComentario = true;
    if (/\*\//.test(l)) enComentario = false;
    if (esComentario) return;
    for (const m of l.matchAll(CLASE_EN_PX)) {
      if (Number(m[2]) < 4 || TRAZO.test(m[1])) continue;
      hallazgos.push({
        que: m[0],
        donde: `${rel}:${k + 1}`,
        porque: `es un tamaño en px; en rem es \`${m[0].replace(/(\d+(?:\.\d+)?)px/, (_, n) => `${Number((n / 16).toFixed(4))}rem`)}\``,
        efecto: "no crece con la pantalla: en un monitor grande o con el navegador alejado sale chico",
      });
    }
    for (const m of l.matchAll(FUENTE_EN_PX)) {
      if (Number(m[1] ?? m[2]) < 4) continue;
      hallazgos.push({
        que: m[0],
        donde: `${rel}:${k + 1}`,
        porque: "es un tamaño de letra en px escrito en el estilo",
        efecto: "no crece con la pantalla: pide una clase de la escala fluida (text-kicker, text-body…)",
      });
    }
  });
}

// ── 5. Scripts de package.json que apuntan a nada ───────────────────────────

const pkg = JSON.parse(readFileSync(join(RAIZ, "package.json"), "utf8"));
for (const [nombre, comando] of Object.entries(pkg.scripts ?? {})) {
  for (const m of comando.matchAll(/scripts\/[\w/-]+\.mjs/g)) {
    if (existsSync(join(RAIZ, m[0]))) continue;
    hallazgos.push({
      que: `pnpm ${nombre}`,
      donde: "package.json",
      porque: `apunta a ${m[0]}, que no existe`,
      efecto: "el operador recibe un 'Cannot find module' sin explicación",
    });
  }
}

// ---------------------------------------------------------------------------

console.log(
  "\n  Auditoría de tokens y clases sobre " + fuentes.length + " archivos\n",
);

if (hallazgos.length === 0) {
  console.log(VERDE + "  Todo lo que el código pide del CSS existe." + FIN);
  console.log(
    GRIS + "  Tokens declarados: " + declarados.size +
      " · en los dos temas: " + (claro && oscuro ? claro.size : "?") + FIN + "\n",
  );
  process.exit(0);
}

for (const h of hallazgos) {
  console.log(ROJO + "  " + h.que + FIN + GRIS + "  ·  " + h.donde + FIN);
  console.log("    " + h.porque);
  console.log(GRIS + "    lo que pasa: " + h.efecto + FIN);
  console.log("");
}

console.log(
  ROJO + "  " + hallazgos.length + " hallazgo(s)." + FIN + "\n" +
    GRIS +
    "  Ninguno de éstos revienta el build: fallan callados. Por eso se revisan\n" +
    "  aquí y no se descubren mirando una lámina.\n" + FIN,
);
process.exit(1);
