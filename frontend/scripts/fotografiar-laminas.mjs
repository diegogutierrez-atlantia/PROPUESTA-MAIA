/**
 * Fotografía el reporte lámina por lámina, en teléfono y en escritorio, en
 * los dos temas.
 *
 *   pnpm fotos                    todas las láminas, ambos tamaños y temas
 *   pnpm fotos -- --solo=celular  un solo tamaño (celular | escritorio)
 *   pnpm fotos -- --tema=oscuro   un solo tema (claro | oscuro)
 *   pnpm fotos -- --laminas=3,7   sólo esas posiciones (base 1)
 *   pnpm fotos -- --conservar     deja el build al terminar, para repetir rápido
 *   pnpm fotos -- --sin-build     reutiliza ese build (sólo tras --conservar)
 *
 * Deja los PNG en `capturas/` (ignorada por git), nombrados por tema, tamaño,
 * posición y título: `claro-escritorio-05-frecuencia-de-consumo.png`.
 *
 * ── POR QUÉ EXISTE ─────────────────────────────────────────────────────────
 *
 * Un reporte se revisó siempre en pantalla grande y salió a producción sin que
 * nadie lo hubiera VISTO en un teléfono. En celular estaba francamente mal, y
 * ninguna verificación lo detectó porque todas leían código, no píxeles. Los
 * clientes consumen en celular; esta es la herramienta para que "se ve bien en
 * teléfono" sea algo que se comprueba, no algo que se supone.
 *
 * Y es la manera en que Claude REVISA VIENDO (ver 12, sección 3): después de
 * construir un bloque, se fotografía y se abren las fotos. Lo que no se ve en
 * el código —texto encimado, gráficas desbordadas, vacíos, un color que se
 * pierde en oscuro— se ve aquí.
 *
 * ── LOS TEXTOS ENCIMADOS, ADEMÁS, LOS CUENTA ───────────────────────────────
 *
 * Nada se encima. En cada foto se miden los renglones de texto de la lámina y
 * se listan los pares que se cruzan (`scripts/lib/encimados.mjs`), con la foto
 * donde pasa. Si hay alguno, sale con código 1: se arregla antes de entregar.
 * Pasó en una forma de la base que en escritorio se veía bien y en un teléfono
 * encimaba "TOTAL 62" con "PUNTAJE", y entre veinte fotos se pierde.
 *
 * ── CÓMO FUNCIONA ──────────────────────────────────────────────────────────
 *
 * Levanta un build de producción en SU PROPIO directorio (`.next-fotos`, para
 * no pelearse con el `pnpm dev` del operador), abre Chrome sin ventana con
 * puppeteer-core —el Chrome ya instalado, no uno descargado—, recorre las
 * secciones del recorrido y fotografía cada una después de darle a las
 * animaciones de entrada un momento para asentarse.
 */
import { spawn } from "node:child_process";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";
import { textosEncimados } from "./lib/encimados.mjs";

const RAIZ = path.resolve(process.cwd());
const NEXT_BIN = path.join(RAIZ, "node_modules", "next", "dist", "bin", "next");
const SALIDA = path.join(RAIZ, "capturas");
const DIST = ".next-fotos";
const PUERTO = Number(process.env.PUERTO_FOTOS ?? 3315);

/** Los dos ojos con los que se mira: un iPhone chico y un escritorio normal. */
const TAMANOS = {
  celular: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  escritorio: { width: 1600, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};

const argumentos = process.argv.slice(2);
const valorDe = (nombre) =>
  argumentos.find((a) => a.startsWith(`--${nombre}=`))?.split("=")[1] ?? null;
const SOLO = valorDe("solo");
const TEMA = valorDe("tema");
const LAMINAS_PEDIDAS = valorDe("laminas")?.split(",").map(Number) ?? null;
const SIN_BUILD = argumentos.includes("--sin-build");
const CONSERVAR = argumentos.includes("--conservar");

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

// ── 1. Compilar y servir ────────────────────────────────────────────────────
if (SIN_BUILD && !existsSync(path.join(RAIZ, DIST))) {
  console.error("No hay build de fotos que reutilizar: corre sin --sin-build (o antes con --conservar).");
  process.exit(1);
}
if (!SIN_BUILD) {
  console.log("Compilando el reporte…");
  await correr("npx", ["next", "build"], { env: { ...process.env, NEXT_DIST_DIR: DIST } });
}

console.log(`Sirviendo en el puerto ${PUERTO}…`);
// `shell: false` a propósito: con shell, en Windows el kill mata al cmd.exe y
// el servidor queda vivo (ya pasó, y las corridas siguientes miden un build viejo).
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
/** Cada foto con textos que se cruzan, y cuáles. */
const encimados = [];
try {
  await esperarAlServidor(`http://127.0.0.1:${PUERTO}/propuesta`);
  await mkdir(SALIDA, { recursive: true });

  // Con movimiento reducido toda pieza nace en su estado FINAL (patrón de la
  // casa). Sin esto la foto salía a media animación de crecimiento y las
  // barras se veían más cortas de lo que son (lo cazó el analista).
  navegador = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--force-prefers-reduced-motion"],
  });

  for (const tema of ["claro", "oscuro"]) {
    if (TEMA && TEMA !== tema) continue;
    for (const [nombre, tamano] of Object.entries(TAMANOS)) {
      if (SOLO && SOLO !== nombre) continue;

      const pagina = await navegador.newPage();
      await pagina.setViewport(tamano);
      // El tema se elige como lo elegiría el lector: la preferencia guardada,
      // aplicada por el script del layout antes del primer pintado.
      await pagina.evaluateOnNewDocument((t) => {
        try {
          localStorage.setItem("tema-reporte", t);
        } catch {
          /* sin almacenamiento no hay tema oscuro que probar */
        }
      }, tema);
      await pagina.goto(`http://127.0.0.1:${PUERTO}/propuesta`, { waitUntil: "networkidle0", timeout: 120_000 });
      // La pista de teclas se va sola a los siete segundos; en la foto, que se
      // toma antes, salía como si fuera parte de la lámina. Fuera.
      await pagina.addStyleTag({ content: ".pista-teclas { display: none !important; }" });

      const claves = await pagina.$$eval(".recorrido > section", (ss) =>
        ss.map((s) => s.getAttribute("aria-label") ?? "sin-nombre"),
      );
      if (claves.length === 0) throw new Error("La página no sirvió ninguna lámina: ¿ya hay actos en capitulos.tsx?");
      console.log(`\n${tema} · ${nombre}: ${claves.length} láminas a ${tamano.width}×${tamano.height}`);

      for (let i = 0; i < claves.length; i++) {
        if (LAMINAS_PEDIDAS && !LAMINAS_PEDIDAS.includes(i + 1)) continue;

        // Se salta directo, sin scroll suave: la cámara no necesita el paseo.
        await pagina.$$eval(
          ".recorrido > section",
          (ss, indice) => ss[indice].scrollIntoView({ behavior: "instant", block: "start" }),
          i,
        );
        // Las animaciones de entrada corren al entrar a la vista; un momento
        // para que asienten y la foto no salga a media transición.
        await new Promise((r) => setTimeout(r, 700));

        const clave = claves[i]
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .slice(0, 40);
        const archivo = path.join(SALIDA, `${tema}-${nombre}-${String(i + 1).padStart(2, "0")}-${clave}.png`);
        // La foto es de la SECCIÓN completa, no de la ventana: una lámina más
        // alta que la pantalla se retrata entera, que es donde suele esconderse
        // lo desbordado. El recorrido es un contenedor con scroll propio y lo
        // que queda fuera de la ventana no se rasteriza, así que el retrato se
        // toma AGRANDANDO la ventana al alto de la lámina y devolviéndola.
        const alto = await pagina.$$eval(
          ".recorrido > section",
          (ss, indice) => Math.ceil(ss[indice].getBoundingClientRect().height),
          i,
        );
        if (alto > tamano.height) {
          await pagina.setViewport({ ...tamano, height: Math.min(alto, 6000) });
          await pagina.$$eval(
            ".recorrido > section",
            (ss, indice) => ss[indice].scrollIntoView({ behavior: "instant", block: "start" }),
            i,
          );
          await new Promise((r) => setTimeout(r, 250));
        }
        const cruces = await pagina.$$eval(".recorrido > section", textosEncimados, i);
        if (cruces.length > 0) encimados.push({ foto: path.basename(archivo), cruces });
        const seccion = (await pagina.$$(".recorrido > section"))[i];
        await seccion.screenshot({ path: archivo });
        if (alto > tamano.height) {
          await pagina.setViewport(tamano);
          await new Promise((r) => setTimeout(r, 150));
        }
        process.stdout.write(`  ${i + 1}`);
      }
      await pagina.close();
      console.log("");
    }
  }

  console.log(`\nFotos en ${path.relative(RAIZ, SALIDA)}/`);
  if (encimados.length > 0) {
    console.log(`\nTextos encimados en ${encimados.length} fotos. Se arreglan antes de entregar:`);
    for (const { foto, cruces } of encimados) {
      console.log(`  ${foto}`);
      for (const c of cruces) console.log(`    ${c}`);
    }
    codigoDeSalida = 1;
  } else {
    console.log("Ningún texto encimado.");
  }
} catch (error) {
  console.error(`\nNo se pudo fotografiar: ${error.message}`);
  codigoDeSalida = 1;
} finally {
  await navegador?.close().catch(() => {});
  await matarServidor(servidor);
  // El build se borra para no medir uno viejo la próxima vez, salvo que se
  // pida conservarlo para repetir fotos sin volver a compilar.
  if (!CONSERVAR) await rm(path.join(RAIZ, DIST), { recursive: true, force: true }).catch(() => {});
}

process.exit(codigoDeSalida);
