import { readdirSync } from "node:fs";
import path from "node:path";
import { StoryShell } from "@/components/story/StoryShell";
import { laminasDeLaPropuesta, ROTULO_DE_LA_PROPUESTA } from "@/lib/story/capitulos";

// Los archivos de página son cascarones: el armado vive en lib/propuesta/armar.

/**
 * El PDF de la propuesta, si ya se generó (`pnpm pdf`).
 *
 * Se busca en su carpeta y no se declara a mano: el nombre trae al cliente y
 * cambia entre propuestas, y apuntar a un nombre fijo deja el botón
 * descargando un 404 sin ningún aviso. Sin PDF no hay botón.
 */
function pdfDeLaPropuesta(): string | null {
  try {
    const dir = path.join(process.cwd(), "public", "pdf");
    return readdirSync(dir).find((f) => f.toLowerCase().endsWith(".pdf")) ?? null;
  } catch {
    return null;
  }
}

export default function PaginaDeLaPropuesta() {
  const laminas = laminasDeLaPropuesta();

  // Sin propuesta no hay recorrido que pintar. Esto sólo lo ve quien arranca
  // una propuesta en su computadora: en cuanto se llena `content/propuesta.ts`,
  // desaparece. Nunca llega a un cliente.
  if (laminas.length === 0) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-heading text-h3 font-bold text-ink">Todavía no hay propuesta.</p>
        <p className="max-w-[40rem] text-body text-ink-2">
          Deja tu material en <code className="font-mono">entradas/</code> y pídele a Claude que arme la
          propuesta. Aquí la vas a ver en cuanto esté.
        </p>
      </main>
    );
  }

  return <StoryShell laminas={laminas} pdf={pdfDeLaPropuesta()} titulo={ROTULO_DE_LA_PROPUESTA} />;
}
