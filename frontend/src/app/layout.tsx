import type { Metadata, Viewport } from "next";
import { Poppins, Hind } from "next/font/google";
import "./globals.css";
import { SCRIPT_DE_TEMA } from "@/lib/tema";
import { CLIENTE_DE_LA_PROPUESTA, ROTULO_DE_LA_PROPUESTA } from "@/lib/story/capitulos";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const hind = Hind({
  variable: "--font-hind",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// La pestaña dice lo mismo que la barra de arriba: sale de la ficha.
export const metadata: Metadata = {
  title: `Atlantia · ${ROTULO_DE_LA_PROPUESTA}`,
  description: CLIENTE_DE_LA_PROPUESTA
    ? `Propuesta de investigación de Atlantia para ${CLIENTE_DE_LA_PROPUESTA}.`
    : "Propuesta de investigación de Atlantia.",
};

// El esquema lo declara cada tema en globals.css (`:root` claro,
// `:root[data-theme="oscuro"]` oscuro), no esta constante: fijarlo aqui en
// "light" hacia que el navegador dibujara barras de scroll y controles claros
// aunque el reporte estuviera en oscuro.
export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-theme="oscuro" desde el servidor: el oscuro es el que abre (decisión
    // de la casa, 2026-09), y así lo es aunque no corra JavaScript. El claro es
    // la opción del lector, y el script de abajo quita el atributo ANTES de
    // que React hidrate cuando encuentra esa elección guardada.
    //
    // suppressHydrationWarning: por ese mismo script, React puede ver en <html>
    // un atributo distinto del que mandó el servidor. Es intencional (el tema
    // guardado debe aplicarse antes del primer pintado, o habría un destello) y
    // la supresión alcanza SOLO a los atributos de este elemento, no a sus
    // hijos. Sin esto, cada vez que el lector tiene guardado el claro sale un
    // aviso rojo en dev.
    <html
      lang="es"
      data-theme="oscuro"
      suppressHydrationWarning
      className={`${poppins.variable} ${hind.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-page text-ink font-body">
        {/* La eleccion guardada se aplica ANTES de pintar, o habria un
            destello oscuro al abrir en claro. Es la unica linea de JS que corre
            antes que React. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_DE_TEMA }} />
        {children}
      </body>
    </html>
  );
}
