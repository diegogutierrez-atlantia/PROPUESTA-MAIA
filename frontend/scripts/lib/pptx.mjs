// Abrir un .pptx y leer sus partes, sin interpretarlas.
//
// Un .pptx es un zip de XML. Lo abre el lector de zip que ya trae `xlsx` (el
// mismo con el que abre sus propios .xlsx), así que no hace falta otra
// dependencia. Lo usan `ver-ppt.mjs` (las cifras de una presentación de
// resultados) y `ver-marca-ppt.mjs` (la paleta y las tipografías de una
// plantilla del cliente).

import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { createRequire } from "node:module";

const XLSX = createRequire(import.meta.url)("xlsx");

const entidades = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

/** El texto de un nodo XML, con sus entidades resueltas. */
export const texto = (s) =>
  s
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, e) => entidades[e])
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));

/** Todas las coincidencias de una expresión, como arreglo. */
export const todos = (xml, re) => [...xml.matchAll(re)];

/** Los párrafos de un bloque de texto de DrawingML, en orden. */
export function parrafos(xml) {
  return todos(xml, /<a:p>([\s\S]*?)<\/a:p>|<a:p [^>]*>([\s\S]*?)<\/a:p>/g)
    .map((m) => todos(m[1] ?? m[2], /<a:t>([\s\S]*?)<\/a:t>/g).map((t) => texto(t[1])).join(""))
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

/**
 * Abre el archivo. Devuelve:
 *   rutas          todas las partes, sin el prefijo del contenedor
 *   leer(ruta)     el XML de una parte, como texto (o null)
 *   bytes(ruta)    el contenido crudo de una parte (una imagen), o null
 *   relaciones(r)  las relaciones de una parte: id → { tipo, destino, externo }
 */
export function abrirPptx(archivo) {
  const zip = XLSX.CFB.read(readFileSync(archivo), { type: "buffer" });
  const partes = new Map();
  zip.FullPaths.forEach((p, i) => {
    const ruta = p.replace(/^Root Entry\//, "");
    if (zip.FileIndex[i]?.content?.length) partes.set(ruta, zip.FileIndex[i].content);
  });
  const bytes = (ruta) => (partes.has(ruta) ? Buffer.from(partes.get(ruta)) : null);
  const leer = (ruta) => bytes(ruta)?.toString("utf8") ?? null;

  function relaciones(ruta) {
    const dir = posix.dirname(ruta);
    const rels = leer(posix.join(dir, "_rels", posix.basename(ruta) + ".rels"));
    const mapa = new Map();
    if (!rels) return mapa;
    for (const m of todos(rels, /<Relationship\b[^>]*>/g)) {
      const id = /Id="([^"]+)"/.exec(m[0])?.[1];
      const tipo = /Type="[^"]*\/([^"/]+)"/.exec(m[0])?.[1];
      const destino = /Target="([^"]+)"/.exec(m[0])?.[1];
      const externo = /TargetMode="External"/.test(m[0]);
      if (id && destino) mapa.set(id, { tipo, destino: externo ? destino : posix.normalize(posix.join(dir, destino)), externo });
    }
    return mapa;
  }

  return { rutas: [...partes.keys()], leer, bytes, relaciones };
}
