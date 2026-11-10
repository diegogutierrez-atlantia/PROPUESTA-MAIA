/**
 * Genera el PDF del reporte. Lo genera ESTE proyecto, no llega de fuera.
 *
 *   pnpm pdf                    tema oscuro (el que abre el reporte)
 *   pnpm pdf -- --tema=claro    tema claro, si el cliente lo pide
 *
 * ── LA REGLA DEL DOCUMENTO (de la casa, y no se negocia) ───────────────────
 *
 * Una hoja por lámina, cada hoja EXACTAMENTE del tamaño de su lámina, y lo
 * que sale en papel es lo que se ve en computadora. Las hojas crecen con las
 * láminas; nada se mueve, se comprime ni se recorta.
 *
 * ── CÓMO: FOTOS, NO IMPRESIÓN ──────────────────────────────────────────────
 *
 * Antes esto imprimía con el motor de PDF de Chrome (texto vectorial). Salía
 * texto seleccionable, pero NO salía el reporte: ese motor no dibuja las
 * mezclas de color, ni el grano, ni las escenas en 3D, y todo lo que nace
 * invisible esperando su animación de entrada se quedaba invisible (una lámina
 * de preguntas de negocio salió sin preguntas). El analista lo cazó
 * comparándolo con el PDF de otro reporte de la casa.
 *
 * Ahora se FOTOGRAFÍA cada lámina tal cual se ve, a doble resolución, con las
 * animaciones ya asentadas, y `pdf-lib` arma una hoja por foto. Es el mismo
 * método que `pnpm fotos`, así que la foto de auditoría y la hoja del PDF son
 * la misma imagen.
 *
 * ── Y EL TEXTO: UNA CAPA INVISIBLE ENCIMA DE CADA FOTO ─────────────────────
 *
 * Una foto sola no se puede buscar ni copiar. Encima de cada una va el texto
 * del reporte en modo de dibujo INVISIBLE (render mode 3, el mismo truco de
 * los PDF escaneados con OCR), renglón por renglón, en la posición y el
 * tamaño en que aparece en pantalla. No hace falta reconocer nada: el
 * navegador nos da cada palabra con sus coordenadas al fotografiar. El PDF se
 * ve idéntico (es la foto) y Ctrl+F, seleccionar y copiar funcionan con el
 * texto exacto, acentos incluidos.
 *
 * El resultado queda en `public/pdf/`, de donde lo baja el botón de la
 * barra. El nombre sale de la ficha: `[Propuesta] - <cliente>.pdf`.
 */
import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";
import { PDFDocument, PDFName, StandardFonts, TextRenderingMode, setTextRenderingMode } from "pdf-lib";

const RAIZ = path.resolve(process.cwd());
const NEXT_BIN = path.join(RAIZ, "node_modules", "next", "dist", "bin", "next");
const SALIDA = path.join(RAIZ, "public", "pdf");
const DIST = ".next-pdf";
const PUERTO = Number(process.env.PUERTO_PDF ?? 3311);

/** "Como se ve en computadora": el mismo tamaño con el que se audita. */
const ANCHO = 1600;
const ALTO = 900;
/** Doble resolución: nítido al hacer zoom sin que el archivo se dispare. */
const ESCALA = 2;
const CALIDAD_JPEG = 92;

const argumentos = process.argv.slice(2);
const TEMA = argumentos.find((a) => a.startsWith("--tema="))?.split("=")[1] ?? "oscuro";
if (!["claro", "oscuro"].includes(TEMA)) {
  console.error(`Tema desconocido: ${TEMA} (claro | oscuro)`);
  process.exit(1);
}

/**
 * El nombre del archivo, con el cliente de la ficha (`content/propuesta.ts`).
 * Se lee del texto, no se importa: este script es Node puro y la propuesta es
 * TypeScript.
 */
const contenido = await readFile(path.join(RAIZ, "src", "content", "propuesta.ts"), "utf8");
const cliente = (contenido.match(/cliente:\s*"([^"]+)"/)?.[1] ?? "Propuesta").replace(/[\\/:*?"<>|]/g, "-").trim();
const NOMBRE = `[Propuesta] - ${cliente}.pdf`;

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA ?? ""}/Google/Chrome/Application/chrome.exe`,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => existsSync(p));

if (!CHROME) {
  console.error("No encontré Chrome. Es la cámara: instálalo y vuelve a correr.");
  process.exit(1);
}

function correr(comando, args, opciones = {}) {
  return new Promise((resolver, rechazar) => {
    const hijo = spawn(comando, args, { stdio: "inherit", shell: true, ...opciones });
    hijo.on("exit", (codigo) =>
      codigo === 0 ? resolver() : rechazar(new Error(`${comando} salió con ${codigo}`)),
    );
  });
}

async function esperarAlServidor(url, intentos = 60) {
  for (let i = 0; i < intentos; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* todavía no levanta */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("El servidor no levantó a tiempo.");
}

/** Mata el árbol del servidor, no sólo su raíz (en Windows el hijo sobrevive al padre). */
async function matarServidor(servidor) {
  if (!servidor?.pid) return;
  if (process.platform === "win32") {
    await new Promise((r) =>
      spawn("taskkill", ["/PID", String(servidor.pid), "/T", "/F"], { stdio: "ignore" }).on("exit", r),
    );
  } else {
    servidor.kill("SIGTERM");
  }
  await new Promise((r) => setTimeout(r, 500));
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Corre DENTRO del navegador: cada palabra visible de la lámina con su caja
 * (en píxeles CSS, relativa a la esquina superior izquierda de la lámina) y
 * el tamaño de fuente con que se pinta. Recorre nodos de texto, incluidos los
 * de SVG (las cifras de las gráficas), y salta lo oculto.
 */
function palabrasDelElemento(sec) {
  const base = sec.getBoundingClientRect();
  const salida = [];
  const walker = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
  let nodo;
  while ((nodo = walker.nextNode())) {
    const texto = nodo.nodeValue;
    if (!texto || !texto.trim()) continue;
    const el = nodo.parentElement;
    if (!el) continue;
    let oculto = false;
    for (let a = el; a && a !== sec; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") {
        oculto = true;
        break;
      }
    }
    if (oculto) continue;
    const tamano = parseFloat(getComputedStyle(el).fontSize) || 12;
    const re = /\S+/g;
    let m;
    while ((m = re.exec(texto))) {
      const rango = document.createRange();
      rango.setStart(nodo, m.index);
      rango.setEnd(nodo, m.index + m[0].length);
      const rects = rango.getClientRects();
      if (!rects.length) continue;
      const r = rects[0];
      if (r.width <= 0 || r.height <= 0) continue;
      if (r.bottom < base.top || r.top > base.bottom || r.right < base.left || r.left > base.right) continue;
      salida.push({ t: m[0], x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height, s: tamano });
    }
  }
  return salida;
}

/** Lo que Helvetica WinAnsi puede escribir; lo demás se aproxima o se cae. */
function palabraEncodable(fuente, palabra) {
  const aproximada = palabra
    .replace(/\u2212/g, "-")
    .replace(/[\u2191\u2193\u2192\u2190]/g, "")
    .replace(/\u2265/g, ">=")
    .replace(/\u2264/g, "<=");
  const limpia = aproximada.replace(/[^\x20-\x7E\xA0-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2026\u2022\u20AC]/g, "");
  if (!limpia) return null;
  try {
    fuente.encodeText(limpia);
    return limpia;
  } catch {
    return null;
  }
}

/**
 * Las palabras se juntan en RENGLONES con espacios de verdad antes de
 * escribirse. Palabra por palabra, el visor tenía que adivinar los espacios
 * por la distancia entre cajas, y en una portada en perspectiva los pegaba
 * ("Unestudioquenospermite"). Con el renglón escrito como una sola cadena,
 * el espacio es un carácter y ningún visor tiene que adivinar nada.
 *
 * Pendiente conocido: el visor de Edge (motor de Adobe) sigue pegando
 * algunas palabras de textos en perspectiva al copiar; Chrome, Firefox y
 * MuPDF las separan bien.
 */
function renglonesDe(palabras) {
  const ordenadas = [...palabras].sort((a, b) => (Math.abs(a.y - b.y) > 3 ? a.y - b.y : a.x - b.x));
  const renglones = [];
  for (const p of ordenadas) {
    const ultimo = renglones[renglones.length - 1];
    const mismaLinea = ultimo && Math.abs(ultimo.y - p.y) <= 3 && Math.abs(ultimo.h - p.h) <= 4;
    const pegada = mismaLinea && p.x - (ultimo.x + ultimo.w) < ultimo.s * 0.9 && p.x >= ultimo.x;
    if (pegada) {
      ultimo.t += " " + p.t;
      ultimo.w = p.x + p.w - ultimo.x;
    } else {
      renglones.push({ ...p });
    }
  }
  return renglones;
}

/**
 * La capa invisible: cada renglón en su caja, con render mode 3 (no se
 * dibuja, pero existe: se busca, se selecciona y se copia). El tamaño parte
 * del de pantalla y se ajusta al ancho real del renglón, porque Helvetica no
 * mide lo que Poppins o Hind.
 */
function escribirCapaInvisible(hoja, palabras, altoHoja, fuente) {
  if (!palabras.length) return;
  hoja.pushOperators(setTextRenderingMode(TextRenderingMode.Invisible));
  for (const r of renglonesDe(palabras)) {
    const texto = palabraEncodable(fuente, r.t);
    if (!texto) continue;
    let tamano = r.s;
    const ancho = fuente.widthOfTextAtSize(texto, tamano);
    if (ancho > 0) tamano = Math.min(r.s * 1.15, tamano * (r.w / ancho));
    if (tamano < 2) continue;
    // La línea base: el borde inferior de la caja menos el descenso típico.
    const y = altoHoja - (r.y + r.h) + r.h * 0.22;
    hoja.drawText(texto, { x: r.x, y, size: tamano, font: fuente });
  }
  hoja.pushOperators(setTextRenderingMode(TextRenderingMode.Fill));
}

// ── 1. Compilar ─────────────────────────────────────────────────────────────
console.log(`Compilando el reporte (tema ${TEMA})…`);
await correr("npx", ["next", "build"], { env: { ...process.env, NEXT_DIST_DIR: DIST } });

// ── 2. Servir ───────────────────────────────────────────────────────────────
console.log(`Sirviendo en el puerto ${PUERTO}…`);
const servidor = spawn(process.execPath, [NEXT_BIN, "start", "-p", String(PUERTO), "-H", "127.0.0.1"], {
  stdio: "ignore",
  env: {
    ...process.env,
    NEXT_DIST_DIR: DIST,
    // La compuerta se abre para esta corrida: la cámara no pasa por el SSO.
    // Es el bypass de local (se activa por presencia), en un servidor que sólo
    // escucha en 127.0.0.1 y muere al terminar.
    DEV_AUTH_BYPASS: "1",
  },
});

let codigoDeSalida = 0;
let navegador = null;
try {
  await esperarAlServidor(`http://127.0.0.1:${PUERTO}/propuesta`);

  // ── 3. Fotografiar, lámina por lámina ─────────────────────────────────────
  navegador = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    // Con movimiento reducido toda pieza nace en su estado FINAL (patrón de
    // la casa): el título puesto, las barras crecidas. Sin esto una portada
    // salió a media animación.
    args: ["--force-prefers-reduced-motion"],
  });
  const pagina = await navegador.newPage();
  const tamano = { width: ANCHO, height: ALTO, deviceScaleFactor: ESCALA };
  await pagina.setViewport(tamano);
  // El tema se elige como lo elegiría el lector: la preferencia guardada,
  // aplicada por el script del layout antes del primer pintado.
  await pagina.evaluateOnNewDocument((t) => {
    try {
      localStorage.setItem("tema-reporte", t);
    } catch {
      /* sin almacenamiento, el tema por omisión */
    }
  }, TEMA);
  await pagina.goto(`http://127.0.0.1:${PUERTO}/propuesta`, { waitUntil: "networkidle0", timeout: 120_000 });

  // El chrome fijo (barra, contador, puntos, hilo, pista de teclas) saldría
  // estampado en cada hoja: en el papel no existe.
  await pagina.addStyleTag({
    content: `
      .mando-oculto-al-imprimir, .fixed:not(.recorrido) { display: none !important; }
      /* Lo que en pantalla se elige con un botón, en papel va todo desplegado. */
      .solo-en-pantalla { display: none !important; }
      .solo-en-papel { display: flex !important; }
      /* En papel el recorrido no es una ventana con scroll propio, y una lámina
         mide al menos una hoja de referencia, no "una pantalla". Con min-h-dvh,
         agrandar la ventana para retratar una lámina alta (los términos
         abiertos miden cuatro pantallas) estiraba TODAS las láminas a ese alto,
         el recorrido se reacomodaba y la foto caía sobre otra lámina. */
      .recorrido { height: auto !important; overflow: visible !important; scroll-snap-type: none !important; }
      .recorrido .min-h-dvh { min-height: ${ALTO}px !important; }
      /* Congela lo que se mueve: una foto de algo animado sale a medio camino. */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });

  const cuantas = await pagina.$$eval(".recorrido > section", (ss) => ss.length);
  if (cuantas === 0) throw new Error("La página no sirvió ninguna lámina: ¿ya hay actos en capitulos.tsx?");
  console.log(`Fotografiando ${cuantas} láminas, cada hoja del tamaño de la suya…`);

  const documento = await PDFDocument.create();
  // Helvetica estándar: no se ve, sólo mide. Cubre WinAnsi, que alcanza para
  // el español con acentos; lo que no cabe se limpia en `palabraEncodable`.
  const fuente = await documento.embedFont(StandardFonts.Helvetica);
  let totalPalabras = 0;

  /**
   * Una hoja del tamaño de su foto (en puntos = píxeles CSS); la foto va a
   * doble resolución encima, así que al hacer zoom se ve nítida. Y la capa
   * de texto invisible, para buscar y copiar.
   */
  async function agregarHoja(foto, palabras) {
    const imagen = await documento.embedJpg(foto);
    const anchoHoja = imagen.width / ESCALA;
    const altoHoja = imagen.height / ESCALA;
    const hoja = documento.addPage([anchoHoja, altoHoja]);
    hoja.drawImage(imagen, { x: 0, y: 0, width: anchoHoja, height: altoHoja });
    escribirCapaInvisible(hoja, palabras, altoHoja, fuente);
    totalPalabras += palabras.length;
  }

  for (let i = 0; i < cuantas; i++) {
    await pagina.$$eval(
      ".recorrido > section",
      (ss, indice) => ss[indice].scrollIntoView({ behavior: "instant", block: "start" }),
      i,
    );
    await espera(600);

    // En papel no hay clics: lo que se abre con un botón sale ABIERTO, y el
    // botón mismo lleva la clase de mando oculto, así que no se estampa.
    await pagina.$$eval(
      ".recorrido > section",
      (ss, indice) => ss[indice].querySelectorAll('button[aria-expanded="false"]').forEach((b) => b.click()),
      i,
    );
    // Y los desplegables (los KPIs por grupo, los términos y condiciones):
    // una propuesta en papel se entrega completa, con todo su texto.
    await pagina.$$eval(
      ".recorrido > section",
      (ss, indice) => ss[indice].querySelectorAll("details:not([open])").forEach((d) => d.setAttribute("open", "")),
      i,
    );
    await espera(400);

    // La foto es de la SECCIÓN completa. Una lámina más alta que la pantalla
    // se retrata AGRANDANDO la ventana a su alto y devolviéndola después.
    const alto = await pagina.$$eval(
      ".recorrido > section",
      (ss, indice) => Math.ceil(ss[indice].getBoundingClientRect().height),
      i,
    );
    if (alto > ALTO) {
      await pagina.setViewport({ ...tamano, height: Math.min(alto, 6000) });
      await pagina.$$eval(
        ".recorrido > section",
        (ss, indice) => ss[indice].scrollIntoView({ behavior: "instant", block: "start" }),
        i,
      );
      await espera(300);
    }
    const seccion = (await pagina.$$(".recorrido > section"))[i];
    // Cada palabra visible con su caja, medida en el MISMO instante que la
    // foto para que coincidan.
    const palabras = await pagina.$eval(`.recorrido > section:nth-of-type(${i + 1})`, palabrasDelElemento);
    const foto = await seccion.screenshot({ type: "jpeg", quality: CALIDAD_JPEG });
    if (alto > ALTO) {
      await pagina.setViewport(tamano);
      await espera(150);
    }

    await agregarHoja(foto, palabras);
    process.stdout.write(`  ${i + 1}`);
  }
  console.log("");

  // El documento pide abrirse en la PRIMERA hoja, ajustada a la ventana. Los
  // visores que recuerdan la última posición la recuerdan por nombre de
  // archivo, y como el nombre no cambia, reabrían el reporte a la mitad.
  documento.catalog.set(
    PDFName.of("OpenAction"),
    documento.context.obj([documento.getPage(0).ref, PDFName.of("Fit")]),
  );

  // ── 4. Coser y verificar ──────────────────────────────────────────────────
  await mkdir(SALIDA, { recursive: true });
  // Sólo puede haber un PDF: la página toma el primero que encuentra.
  for (const f of await readdir(SALIDA)) {
    if (f.toLowerCase().endsWith(".pdf")) await rm(path.join(SALIDA, f));
  }
  const destino = path.join(SALIDA, NOMBRE);
  await writeFile(destino, await documento.save());

  /*
   * Un folio por lámina, contado, no supuesto. El PDF salió una vez con UNA
   * sola hoja y el peso correcto, y nada se quejó: contar hojas contra
   * láminas es lo que separa "el archivo existe" de "el archivo trae el
   * reporte completo".
   */
  const hojas = documento.getPageCount();
  if (hojas !== cuantas) {
    throw new Error(`El PDF trae ${hojas} hojas y el reporte tiene ${cuantas} láminas.`);
  }
  const info = await stat(destino);
  if (info.size < 200_000) {
    throw new Error(`El PDF salió de ${info.size} bytes: algo no se fotografió.`);
  }
  console.log(`\nPDF listo: public/pdf/${NOMBRE}`);
  console.log(`  ${hojas} hojas, cada una del tamaño de su lámina, tema ${TEMA}.`);
  console.log(`  ${(info.size / 1024 / 1024).toFixed(1)} MB · ${totalPalabras} palabras en la capa de texto`);
  console.log("El botón de descargar lo encuentra solo.");
} catch (error) {
  console.error(`\nNo se pudo generar el PDF: ${error.message}`);
  codigoDeSalida = 1;
} finally {
  await navegador?.close().catch(() => {});
  await matarServidor(servidor);
  await rm(path.join(RAIZ, DIST), { recursive: true, force: true }).catch(() => {});
}

process.exit(codigoDeSalida);
