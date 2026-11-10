// Antes de escribir una lamina o un componente, le pega a Claude las reglas
// visuales de la casa. UNA VEZ POR SESION.
//
// Existe porque el recordatorio dentro de CLAUDE.md no bastaba: en una sesion
// larga los documentos se salen de contexto y reaparecen los mismos vicios
// (columna angosta, text-xs, sustituir la grafica que pide el guion, otra
// lista de barras). Un hook lo ejecuta Claude Code, no Claude, asi que no se
// puede olvidar.
//
// POR QUE UNA SOLA VEZ (2026-09-21). Antes salia en CADA edicion de un .tsx o
// .css: unos 600 tokens por edicion, decenas de veces por tarde, y para la
// tercera ya era ruido. Hoy las reglas visuales viven en
// .claude/rules/laminas-y-visual.md, que Claude Code carga solo en cuanto se
// abre un archivo de componentes; y para editar un archivo hay que abrirlo
// antes. El unico hueco es una lamina NUEVA escrita sin abrir nada: para eso
// queda este hook, la primera vez de la sesion.
//
// POR QUE PEGA LA REGLA Y NO SU PROPIA LISTA. Antes traia una lista escrita
// aqui mismo, que ya decia cosas distintas a CLAUDE.md (mandaba sacar fotos
// en cada bloque). Una sola fuente: si la regla cambia, el hook la sigue.
//
// Usa Node y no jq a proposito: jq no viene en Windows y Node ya esta
// instalado para correr la propuesta. Una dependencia menos que falle.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let entrada = "";
process.stdin.on("data", (d) => (entrada += d));
process.stdin.on("end", () => {
  let datos = {};
  try {
    datos = JSON.parse(entrada);
  } catch {
    process.exit(0);
  }

  const ruta = datos?.tool_input?.file_path ?? "";
  // Solo lo que se ve: laminas, componentes y estilos.
  if (!/\.(tsx|css)$/i.test(ruta)) process.exit(0);

  // Una vez por sesion: una marca en la carpeta temporal, con el id de la
  // sesion. Sin id (no deberia pasar) se comporta como antes, cada vez.
  const sesion = String(datos?.session_id ?? "").replace(/[^\w-]/g, "");
  const marca = sesion ? join(tmpdir(), `atlantia-recordatorio-${sesion}`) : "";
  if (marca && existsSync(marca)) process.exit(0);

  const raiz = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const archivoRegla = join(raiz, ".claude", "rules", "laminas-y-visual.md");
  let regla = "";
  try {
    // Sin el encabezado de rutas: a Claude le sirve la regla, no su frontmatter.
    regla = readFileSync(archivoRegla, "utf8").replace(/^---[\s\S]*?---\s*/, "");
  } catch {
    regla =
      "No encontre .claude/rules/laminas-y-visual.md. Abrela antes de escribir: ahi viven las reglas visuales de la casa.";
  }

  const recordatorio = [
    "Recordatorio de la casa, la primera vez que escribes una lamina en esta sesion.",
    "Si no has abierto documentacion/03, 04 y 05 en esta sesion, abrelos antes de maquetar.",
    "",
    regla,
  ].join("\n");

  if (marca) {
    try {
      writeFileSync(marca, new Date().toISOString());
    } catch {
      // Si no se puede escribir la marca, el costo es que el recordatorio
      // vuelva a salir. Nunca bloquear la edicion por esto.
    }
  }

  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        additionalContext: recordatorio,
      },
      suppressOutput: true,
    }),
  );
});
