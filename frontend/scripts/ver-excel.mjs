// Vuelca a texto plano un Excel que traiga el vendedor (un esquema, una cotización).
//
// Es un VOLCADOR: no interpreta. Cada quien llena como puede y con lo que
// entiende —agrega renglones, combina celdas, escribe donde no era—, y un
// lector que intente entender eso funciona con un archivo limpio y truena con
// el de un vendedor real, en silencio. Volcar nunca truena. Claude lee el
// volcado y lo interpreta conversando; si algo no se entiende, pregunta.
//
// Cada celda sale con su COLUMNA ("C=…"), para ubicar qué dato va con qué
// encabezado. Las filas se numeran igual que en Excel (F34 = fila 34).
// Las hojas ocultas (las listas de los desplegables) no se vuelcan.
//
// Uso:
//   pnpm material:excel                      el Excel más reciente de entradas/
//   pnpm material:excel -- "ruta/a/otro.xlsx"

import { readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const XLSX = createRequire(import.meta.url)("xlsx");

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CARPETA = join(RAIZ, "entradas");
const EXTENSIONES = [".xlsx", ".xlsm", ".xls", ".csv"];

// pnpm deja pasar el "--" que separa sus argumentos de los del script.
let archivo = process.argv.slice(2).find((a) => a !== "--");
if (!archivo) {
  if (!existsSync(CARPETA)) salirConAyuda("Todavía no existe la carpeta entradas/.");
  const candidatos = readdirSync(CARPETA)
    .filter((f) => EXTENSIONES.includes(extname(f).toLowerCase()) && !f.startsWith("~$"))
    .map((f) => join(CARPETA, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  if (candidatos.length === 0) salirConAyuda("No encontré ningún Excel en entradas/.");
  archivo = candidatos[0];
  if (candidatos.length > 1) console.log("Hay varios Excel ahí. Tomo el más reciente:\n  " + basename(archivo) + "\n");
}
if (!existsSync(archivo)) salirConAyuda("No existe el archivo: " + archivo);

console.log("\nLeyendo " + basename(archivo) + "\n");
const libro = XLSX.readFile(archivo, { cellDates: true });
const ocultas = new Set(
  (libro.Workbook?.Sheets ?? []).filter((h) => h.Hidden).map((h) => h.name),
);
const hojas = libro.SheetNames.filter((h) => !ocultas.has(h));

const lineas = [];
lineas.push("# Volcado del Excel");
lineas.push("");
lineas.push("- Archivo: `" + basename(archivo) + "`");
lineas.push("- Hojas: " + hojas.length + " (" + hojas.join(", ") + ")");
lineas.push("- Volcado: " + new Date().toISOString());
lineas.push("");
lineas.push(
  "> El archivo tal como está, sin interpretar, con las celdas como se ven en Excel.\n" +
    "> Cada celda lleva su columna (C=…) y cada renglón su número de Excel (F34 = fila 34).",
);
lineas.push("");

let totalFilas = 0;
for (const hoja of hojas) {
  const ws = libro.Sheets[hoja];
  lineas.push("---");
  lineas.push("");
  lineas.push("## Hoja: " + hoja);
  lineas.push("");
  if (!ws["!ref"]) {
    lineas.push("_(vacía)_");
    lineas.push("");
    continue;
  }
  const rango = XLSX.utils.decode_range(ws["!ref"]);
  // raw:false devuelve el texto formateado (lo que se ve en la celda);
  // blankrows:true conserva las filas vacías para no perder la numeración.
  const filas = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: true, defval: "", raw: false });
  const salida = [];
  filas.forEach((fila, i) => {
    const celdas = fila
      .map((c, j) => [XLSX.utils.encode_col(rango.s.c + j), String(c ?? "").replace(/\s+/g, " ").trim()])
      .filter(([, texto]) => texto !== "" && texto.toLowerCase() !== "false");
    if (celdas.length === 0) return;
    salida.push(
      "F" + String(rango.s.r + i + 1).padStart(4, " ") + " | " + celdas.map(([col, texto]) => `${col}=${texto}`).join(" | "),
    );
  });
  totalFilas += salida.length;
  lineas.push("Filas con contenido: " + salida.length);
  lineas.push("");
  lineas.push("```");
  lineas.push(...salida);
  lineas.push("```");
  lineas.push("");
  console.log("  " + hoja + ": " + salida.length + " filas con contenido");
}

const destino = join(dirname(archivo), basename(archivo, extname(archivo)) + ".volcado.md");
writeFileSync(destino, lineas.join("\n") + "\n", "utf8");
console.log(`\nListo: ${hojas.length} hojas, ${totalFilas} filas con contenido.\n`);
console.log("  " + destino + "   <- esto es lo que lee Claude\n");

function salirConAyuda(mensaje) {
  console.log("\n" + mensaje + "\n");
  console.log("Deja el Excel en entradas/ y vuelve a correr:\n");
  console.log("  pnpm material:excel\n");
  process.exit(1);
}
