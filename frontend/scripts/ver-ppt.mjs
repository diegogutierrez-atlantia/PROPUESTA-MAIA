// Vuelca a texto plano una presentación (.pptx) que trae el vendedor: el brief
// del cliente en diapositivas, una propuesta anterior, notas de una junta.
//
// Es un VOLCADOR: no interpreta. Escupe lo que la presentación trae, en orden,
// y Claude lo lee y lo usa para llenar la propuesta, preguntando lo que no
// quede claro.
//
// Lo que saca, diapositiva por diapositiva y en el orden de la presentación:
//   - los textos (títulos, cajas, pies)
//   - las tablas, celda por celda
//   - cada GRÁFICA NATIVA con sus categorías, sus series y sus valores
//   - las notas del orador
//   - cuántas imágenes trae
//
// Una cifra que viene en una IMAGEN (una tabla de precios pegada como captura)
// no existe como dato para este volcado: se le pregunta al vendedor, nunca se
// transcribe de la imagen a ojo. Un PDF no hace falta volcarlo: Claude lo lee
// directo.
//
// Deja dos archivos junto a la presentación:
//   <nombre>.volcado.md    lo que lee Claude
//   <nombre>.volcado.json  lo mismo, estructurado
//
// Uso:
//   pnpm material:ppt                         la presentación más reciente de entradas/
//   pnpm material:ppt -- "ruta/a/otra presentación.pptx"

import { readdirSync, writeFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { dirname, join, extname, basename, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { abrirPptx, parrafos, texto, todos } from "./lib/pptx.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARPETA = join(RAIZ, "entradas");

const args = process.argv.slice(2);
const salidaArg = args.find((a) => a.startsWith("--salida="))?.slice("--salida=".length);
let archivo = args.find((a) => !a.startsWith("--"));

if (!archivo) {
  if (!existsSync(CARPETA)) salirConAyuda("Todavía no existe la carpeta entradas/.");
  const candidatos = readdirSync(CARPETA)
    .filter((f) => extname(f).toLowerCase() === ".pptx" && !f.startsWith("~$"))
    .map((f) => join(CARPETA, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (candidatos.length === 0) {
    const pdf = readdirSync(CARPETA).some((f) => extname(f).toLowerCase() === ".pdf");
    salirConAyuda(
      pdf
        ? "Hay un PDF pero ningún .pptx. Un PDF no se vuelca: Claude lo lee directo."
        : "No encontré ninguna presentación (.pptx) en entradas/.",
    );
  }
  archivo = candidatos[0];
  if (candidatos.length > 1) console.log("Hay varias presentaciones ahí. Tomo la más reciente:\n  " + basename(archivo) + "\n");
}
if (!existsSync(archivo)) salirConAyuda("No existe el archivo: " + archivo);
if (extname(archivo).toLowerCase() !== ".pptx") salirConAyuda("Sólo leo .pptx. Un PDF o un .ppt viejo pierden los datos de las gráficas.");

console.log("\nLeyendo " + basename(archivo) + "\n");

// ── El contenedor ─────────────────────────────────────────────────────────

const { leer, relaciones } = abrirPptx(archivo);

// ── Las gráficas ──────────────────────────────────────────────────────────

function puntos(bloque) {
  if (!bloque) return [];
  const cuenta = Number(/<c:ptCount val="(\d+)"/.exec(bloque)?.[1] ?? 0);
  const vals = new Array(cuenta).fill(null);
  for (const m of todos(bloque, /<c:pt idx="(\d+)"[^>]*>\s*<c:v>([\s\S]*?)<\/c:v>/g)) vals[Number(m[1])] = texto(m[2]);
  // Una categoría en varios niveles (región › ciudad) trae un bloque por nivel:
  // se juntan en el orden en que vienen.
  if (cuenta === 0) return todos(bloque, /<c:v>([\s\S]*?)<\/c:v>/g).map((m) => texto(m[1]));
  return vals;
}
const bloqueDe = (xml, etiqueta) => new RegExp(`<c:${etiqueta}>([\\s\\S]*?)</c:${etiqueta}>`).exec(xml)?.[1] ?? null;

function grafica(ruta) {
  const xml = leer(ruta);
  if (!xml) return { archivo: ruta, error: "no se pudo leer" };
  const tipos = todos(xml, /<c:(\w+Chart)>/g).map((m) => m[1]);
  const orientacion = /<c:barDir val="(\w+)"/.exec(xml)?.[1] ?? null;
  const agrupacion = /<c:grouping val="(\w+)"/.exec(xml)?.[1] ?? null;
  const tituloXml = bloqueDe(xml, "title");
  const titulo = tituloXml ? parrafos(tituloXml).join(" ") || null : null;
  const formatos = [...new Set(todos(xml, /<c:formatCode>([\s\S]*?)<\/c:formatCode>/g).map((m) => texto(m[1])))];
  const vinculada = /<c:externalData\b/.test(xml) && !/<c:autoUpdate val="0"/.test(xml) ? "revisar" : null;
  const series = todos(xml, /<c:ser>([\s\S]*?)<\/c:ser>/g).map((m) => {
    const s = m[1];
    const tx = bloqueDe(s, "tx");
    const nombre = tx ? (todos(tx, /<c:v>([\s\S]*?)<\/c:v>/g).map((v) => texto(v[1])).join(" ") || null) : null;
    const categorias = puntos(bloqueDe(s, "cat") ?? bloqueDe(s, "xVal"));
    const valores = puntos(bloqueDe(s, "val") ?? bloqueDe(s, "yVal")).map((v) => (v === null || v === "" ? null : Number(v)));
    return { nombre, categorias, valores };
  });
  return { archivo: posix.basename(ruta), tipos, orientacion, agrupacion, titulo, formatos, vinculada, series };
}

// ── Las diapositivas, en el orden de la presentación ──────────────────────

const presentacion = leer("ppt/presentation.xml");
if (!presentacion) salirConAyuda("El archivo no parece una presentación de PowerPoint (no trae ppt/presentation.xml).");
const relsPres = relaciones("ppt/presentation.xml");
const orden = todos(presentacion, /<p:sldId\b[^>]*r:id="([^"]+)"/g).map((m) => relsPres.get(m[1])?.destino).filter(Boolean);

const diapositivas = orden.map((ruta, i) => {
  const xml = leer(ruta) ?? "";
  const rels = relaciones(ruta);
  const oculta = /<p:sld\b[^>]*\bshow="0"/.test(xml);
  const sinTablas = xml.replace(/<a:tbl>[\s\S]*?<\/a:tbl>/g, "");
  const textos = parrafos(sinTablas);
  const tablas = todos(xml, /<a:tbl>([\s\S]*?)<\/a:tbl>/g).map((t) =>
    todos(t[1], /<a:tr\b[^>]*>([\s\S]*?)<\/a:tr>/g).map((fila) =>
      todos(fila[1], /<a:tc\b[^>]*>([\s\S]*?)<\/a:tc>/g).map((celda) => parrafos(celda[1]).join(" / ")),
    ),
  );
  // Las gráficas, en el orden en que aparecen en la diapositiva.
  const idsGrafica = todos(xml, /<c:chart\b[^>]*r:id="([^"]+)"/g).map((m) => m[1]);
  const graficas = idsGrafica
    .map((id) => rels.get(id))
    .filter((r) => r && r.tipo === "chart" && !r.externo)
    .map((r) => grafica(r.destino));
  const notasRel = [...rels.values()].find((r) => r.tipo === "notesSlide");
  const notas = notasRel ? parrafos(leer(notasRel.destino) ?? "").filter((p) => !/^\d+$/.test(p)) : [];
  const imagenes = (xml.match(/<p:pic>/g) ?? []).length;
  return { numero: i + 1, archivo: posix.basename(ruta), oculta, textos, tablas, graficas, notas, imagenes };
});

// ── Lo que se escribe ─────────────────────────────────────────────────────

const lineas = [];
const totalGraficas = diapositivas.reduce((n, d) => n + d.graficas.length, 0);
const totalImagenes = diapositivas.reduce((n, d) => n + d.imagenes, 0);
lineas.push("# Presentación de resultados (volcado del .pptx)");
lineas.push("");
lineas.push("- Archivo: `" + basename(archivo) + "`");
lineas.push(`- Diapositivas: ${diapositivas.length} · gráficas nativas: ${totalGraficas} · imágenes: ${totalImagenes}`);
lineas.push("- Volcado: " + new Date().toISOString());
lineas.push("");
lineas.push(
  "> Esto es la presentación tal como está, sin interpretar. Las cifras de cada gráfica salen de\n" +
    "> los datos que la gráfica guarda adentro, con su formato (`0%` = valores de 0 a 1).\n" +
    "> Una gráfica pegada como IMAGEN no trae cifras: aparece contada en «Imágenes» y sus números\n" +
    "> se le piden al vendedor. Nunca se transcriben de la imagen.\n" +
    "> Las cifras que aparecen en «Textos» o en una «Tabla» son TEXTO que alguien tecleó en la\n" +
    "> diapositiva, no el dato de una gráfica: pueden estar redondeadas o desfasadas. Las cifras\n" +
    "> de la propuesta (muestras, semanas, precios) las confirma el vendedor.",
);
lineas.push("");
for (const d of diapositivas) {
  lineas.push("---");
  lineas.push("");
  lineas.push(`## Diapositiva ${d.numero}${d.oculta ? " (OCULTA en la presentación)" : ""}`);
  lineas.push("");
  if (d.textos.length) {
    lineas.push("**Textos**");
    lineas.push("");
    for (const t of d.textos) lineas.push("- " + t);
    lineas.push("");
  }
  d.tablas.forEach((t, k) => {
    lineas.push(`**Tabla ${k + 1}** (${t.length} filas)`);
    lineas.push("");
    lineas.push("```");
    t.forEach((fila, f) => lineas.push("F" + String(f + 1).padStart(2, " ") + " | " + fila.join(" | ")));
    lineas.push("```");
    lineas.push("");
  });
  d.graficas.forEach((g, k) => {
    if (g.error) {
      lineas.push(`**Gráfica ${k + 1}**: ${g.error} (${g.archivo})`);
      lineas.push("");
      return;
    }
    const forma = [g.tipos.join(" + "), g.orientacion, g.agrupacion].filter(Boolean).join(" · ");
    lineas.push(`**Gráfica ${k + 1}** · ${forma}${g.titulo ? ` · «${g.titulo}»` : ""} · formato: ${g.formatos.join(", ") || "sin formato"}${g.vinculada ? " · VINCULADA a un Excel externo: la caché puede estar vieja" : ""}`);
    lineas.push("");
    lineas.push("```");
    const categorias = g.series.find((s) => s.categorias.length)?.categorias ?? [];
    if (categorias.length) lineas.push("categorías | " + categorias.map((c) => c ?? "(vacía)").join(" | "));
    for (const s of g.series) {
      const propias = s.categorias.length && s.categorias.join("|") !== categorias.join("|") ? " [categorías propias: " + s.categorias.join(" | ") + "]" : "";
      lineas.push(`serie «${s.nombre ?? "(sin nombre)"}» | ` + s.valores.map((v) => (v === null ? "(vacío)" : String(v))).join(" | ") + propias);
    }
    lineas.push("```");
    lineas.push("");
  });
  if (d.imagenes) {
    lineas.push(`**Imágenes: ${d.imagenes}.** Si alguna es una gráfica pegada como imagen, sus cifras NO están en este volcado.`);
    lineas.push("");
  }
  if (d.notas.length) {
    lineas.push("**Notas del orador**");
    lineas.push("");
    for (const n of d.notas) lineas.push("> " + n);
    lineas.push("");
  }
  if (!d.textos.length && !d.tablas.length && !d.graficas.length && !d.imagenes) {
    lineas.push("_(sin contenido)_");
    lineas.push("");
  }
}

const carpetaSalida = salidaArg ?? dirname(archivo);
mkdirSync(carpetaSalida, { recursive: true });
const base = join(carpetaSalida, basename(archivo, extname(archivo)));
writeFileSync(base + ".volcado.md", lineas.join("\n") + "\n", "utf8");
writeFileSync(
  base + ".volcado.json",
  JSON.stringify({ archivo: basename(archivo), volcado: new Date().toISOString(), diapositivas }, null, 2) + "\n",
  "utf8",
);

console.log(`  ${diapositivas.length} diapositivas · ${totalGraficas} gráficas nativas · ${totalImagenes} imágenes`);
const conImagenesSinGrafica = diapositivas.filter((d) => d.imagenes && !d.graficas.length).length;
if (conImagenesSinGrafica) {
  console.log(`  ${conImagenesSinGrafica} diapositivas traen imágenes y ninguna gráfica nativa: si alguna era una gráfica, sus cifras hay que pedirlas.`);
}
console.log("\nListo.\n");
console.log("  " + base + ".volcado.md    <- esto es lo que lee Claude");
console.log("  " + base + ".volcado.json  <- lo mismo, estructurado\n");

function salirConAyuda(mensaje) {
  console.log("\n" + mensaje + "\n");
  console.log("Deja la presentación (.pptx) en entradas/ y vuelve a correr:\n");
  console.log("  pnpm material:ppt\n");
  process.exit(1);
}
