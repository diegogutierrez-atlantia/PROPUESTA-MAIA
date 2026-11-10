// El semaforo de la computadora.
//
// Lo corre Claude al arrancar una propuesta y contesta una sola pregunta: esta
// maquina ya puede armar y publicar propuestas, si o no.
//
// Cada revision que falla dice QUE hacer, no solo que fallo. Un "Error: ENOENT"
// no le sirve a nadie que no programe, y este script esta escrito para gente
// que no programa.
//
// Uso:  pnpm verificar

import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");

const VERDE = "\x1b[32m";
const ROJO = "\x1b[31m";
const AMARILLO = "\x1b[33m";
const GRIS = "\x1b[90m";
const FIN = "\x1b[0m";

const resultados = [];

function revisar(nombre, fn) {
  try {
    const r = fn();
    resultados.push({ nombre, ...r });
  } catch (e) {
    resultados.push({ nombre, estado: "falla", detalle: e.message, comoArreglar: null });
  }
}

function version(comando) {
  return execSync(comando, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
}

// ---------------------------------------------------------------------------

revisar("Node.js", () => {
  const v = process.versions.node;
  const mayor = Number(v.split(".")[0]);
  if (mayor < 20) {
    return {
      estado: "falla",
      detalle: "tienes la " + v + ", y este proyecto necesita la 20 o mas nueva",
      comoArreglar:
        "Entra a nodejs.org, descarga la version LTS y instalala.\n" +
        "Cierra la terminal, abrela de nuevo y vuelve a correr pnpm verificar.",
    };
  }
  return { estado: "ok", detalle: "v" + v };
});

revisar("pnpm", () => {
  try {
    return { estado: "ok", detalle: "v" + version("pnpm --version") };
  } catch {
    return {
      estado: "falla",
      detalle: "no esta instalado",
      comoArreglar:
        "Corre esto en la terminal:\n" +
        "  npm install -g pnpm\n" +
        "Si te dice que no tienes permisos, avisale al instructor: es un\n" +
        "permiso de la computadora, no un error tuyo.",
    };
  }
});

revisar("Git", () => {
  try {
    const v = version("git --version");
    let identidad = "";
    try {
      const nombre = version("git config --get user.name");
      const correo = version("git config --get user.email");
      identidad = " · " + nombre + " <" + correo + ">";
    } catch {
      return {
        estado: "aviso",
        detalle: v + ", pero sin tu nombre configurado",
        comoArreglar:
          "Git necesita saber quien eres para firmar tus guardados:\n" +
          '  git config --global user.name "Tu Nombre"\n' +
          '  git config --global user.email "tu.correo@atlantiasearch.com"\n' +
          "Hace falta para publicar. Claude lo configura contigo.",
      };
    }
    return { estado: "ok", detalle: v + identidad };
  } catch {
    return {
      estado: "falla",
      detalle: "no esta instalado",
      comoArreglar: "Descargalo de git-scm.com, instalalo con las opciones por default,\ncierra la terminal y abrela de nuevo.",
    };
  }
});

revisar("Dependencias instaladas", () => {
  if (!existsSync(join(RAIZ, "node_modules"))) {
    return {
      estado: "falla",
      detalle: "falta node_modules",
      comoArreglar:
        "Parate en la carpeta frontend y corre:\n" +
        "  pnpm install\n" +
        "Tarda un par de minutos la primera vez. Es normal.",
    };
  }
  const criticas = ["next", "react", "jose", "lucide-react", "xlsx"];
  const faltan = criticas.filter((d) => !existsSync(join(RAIZ, "node_modules", d)));
  if (faltan.length) {
    return {
      estado: "falla",
      detalle: "faltan: " + faltan.join(", "),
      comoArreglar: "Corre  pnpm install  otra vez, parado en la carpeta frontend.",
    };
  }
  return { estado: "ok", detalle: criticas.length + " paquetes clave presentes" };
});

revisar("El proyecto compila", () => {
  // Sin node_modules no hay nada que compilar, y `npx tsc` termina agarrando
  // otro tsc del sistema que contesta "This is not the tsc command you are
  // looking for": un rojo indescifrable cuando lo unico que falta es
  // `pnpm install`. Se salta y se dice por que.
  if (!existsSync(join(RAIZ, "node_modules"))) {
    return { estado: "aviso", detalle: "no se puede revisar todavia, falta pnpm install" };
  }

  // Se llama al tsc DEL PROYECTO por su ruta, no por `npx`: npx resuelve contra
  // lo que haya en el sistema y puede traer una version distinta, o ninguna.
  const tsc = join(RAIZ, "node_modules", "typescript", "bin", "tsc");
  try {
    execSync(`node "${tsc}" --noEmit`, { cwd: RAIZ, stdio: ["ignore", "pipe", "pipe"] });
    return { estado: "ok", detalle: "sin errores de tipos" };
  } catch (e) {
    const salida = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    const primeras = salida.split("\n").filter(Boolean).slice(0, 4).join("\n    ");
    return {
      estado: "falla",
      detalle: "hay errores de tipos",
      comoArreglar:
        "Copia esto y pegaselo a Claude, el sabe leerlo:\n\n    " + primeras,
    };
  }
});

revisar("Los tokens del CSS", () => {
  // Un token que el codigo pide y el CSS no declara NO revienta el build: el
  // color simplemente no se pinta. Nueve graficas dibujaron sus barras sin
  // carril durante un tiempo por exactamente esto, y ni los tipos ni el build
  // dijeron nada. Por eso se revisa aqui.
  if (!existsSync(join(RAIZ, "node_modules"))) {
    return { estado: "aviso", detalle: "no se puede revisar todavia, falta pnpm install" };
  }
  try {
    execSync("node scripts/auditar-tokens.mjs", { cwd: RAIZ, stdio: ["ignore", "pipe", "pipe"] });
    return { estado: "ok", detalle: "todo lo que el codigo pide existe" };
  } catch (e) {
    const salida = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    const n = salida.match(/(\d+) hallazgo/);
    return {
      estado: "falla",
      detalle: (n ? n[1] : "varios") + " token(s) o clase(s) que no existen",
      comoArreglar: "Corre  pnpm auditar:tokens  para ver cuales, y pegaselo a Claude.",
    };
  }
});


// ---------------------------------------------------------------------------

console.log("\n  Revision del entorno\n");

for (const r of resultados) {
  const icono =
    r.estado === "ok" ? VERDE + "  OK  " + FIN : r.estado === "aviso" ? AMARILLO + " AVISO" + FIN : ROJO + " FALTA" + FIN;
  console.log(icono + "  " + r.nombre.padEnd(24) + GRIS + (r.detalle || "") + FIN);
}

const fallas = resultados.filter((r) => r.estado === "falla");
const avisos = resultados.filter((r) => r.estado === "aviso");

console.log("");

for (const r of [...fallas, ...avisos]) {
  if (!r.comoArreglar) continue;
  const color = r.estado === "falla" ? ROJO : AMARILLO;
  console.log(color + "  " + r.nombre + FIN);
  console.log(
    r.comoArreglar
      .split("\n")
      .map((l) => "    " + l)
      .join("\n"),
  );
  console.log("");
}

if (fallas.length === 0) {
  console.log(VERDE + "  Esta computadora esta lista." + FIN);
  console.log(GRIS + "  Prueba final: corre  pnpm dev  y abre http://localhost:3000" + FIN);
  console.log("");
  process.exit(0);
}

console.log(ROJO + "  Faltan " + fallas.length + " cosas. Arregla las de arriba y vuelve a correr:" + FIN);
console.log("    pnpm verificar\n");
process.exit(1);
