import type { ReactElement } from "react";
import { StoryCardFrame, type StoryTone } from "@/components/story/StoryCardFrame";
import { SeparadorDeSeccion } from "@/components/story/SeparadorDeSeccion";
import { Portada } from "@/components/propuesta/Portada";
import { TarjetasNumeradas } from "@/components/propuesta/TarjetasNumeradas";
import { PreguntasEnMosaico } from "@/components/propuesta/PreguntasEnMosaico";
import { EtapasDelMetodo } from "@/components/propuesta/EtapasDelMetodo";
import { KpisPorSolucion, partirKpisEnLaminas } from "@/components/propuesta/KpisPorSolucion";
import { EjemploDelEntregable } from "@/components/propuesta/EjemploDelEntregable";
import { ContenidoExplicativo, NOMBRE_DE_EXPLICATIVA } from "@/components/propuesta/Explicativas";
import { PerfilDeLaMuestra } from "@/components/propuesta/PerfilDeLaMuestra";
import { ZonaDeCuotas } from "@/components/propuesta/ZonaDeCuotas";
import { Cronogramas } from "@/components/propuesta/Cronogramas";
import { PropuestaEconomica } from "@/components/propuesta/PropuestaEconomica";
import { EstandarDeEjecucion } from "@/components/propuesta/EstandarDeEjecucion";
import { TerminosYCondiciones, partirTerminosEnLaminas } from "@/components/propuesta/TerminosYCondiciones";
import { CalculadoraDeMaia } from "@/components/propuesta/CalculadoraDeMaia";
import { CierreDePropuesta } from "@/components/propuesta/CierreDePropuesta";
import { CAPTURAS_DEL_ENTREGABLE } from "@/casa/entregable";
import { CONSIDERACIONES_DEL_CRONOGRAMA } from "@/casa/cronogramas";
import { tarjetasDelEstandar } from "@/casa/estandar";
import { pieDeCotizacion, rotuloDeMoneda, terminosYCondiciones } from "@/casa/terminos";
import { vendedor } from "@/casa/vendedores";
import type { Explicativa, Lamina, Propuesta } from "./tipos";

/**
 * De la propuesta (datos) a las láminas (elementos), acto por acto.
 *
 * Aquí se decide lo que la propuesta NO declara, para que nadie tenga que
 * decidirlo cada vez:
 *
 * 1. QUÉ COMPONENTE DIBUJA CADA TIPO, y sobre qué fondo. La portada, el
 *    método, las explicativas, MAIA y el cierre van sobre color; las demás,
 *    sobre papel.
 *
 * 2. LAS LÁMINAS DE PAPEL ALTERNAN SUS DOS TONOS (`surface` y `surface-2`):
 *    doce láminas claras seguidas en el mismo tono se leen como la misma
 *    lámina. Se alternan solas, por orden.
 *
 * 3. LAS CORTINILLAS SE NUMERAN SOLAS, en el orden de los actos que traen una.
 *
 * 4. CADA LÁMINA LLEVA SU CLAVE Y SU NOMBRE PARA EL ÍNDICE, sacados de su
 *    título. En los reportes eso se declaraba a mano en `titulos.ts` y una
 *    lámina sin declarar enseñaba su clave de código al cliente; aquí no hay
 *    nada que declarar.
 *
 * 5. NADA SE ABRE CON UN CLIC (decisión de operaciones, 2026-11): la propuesta
 *    se consume sin interactuar. Lo que antes se desplegaba ahora se reparte en
 *    láminas: una de KPIs por solución (o más, si no cabe), la explicativa de
 *    un grupo con ejemplo justo después de sus KPIs, un cronograma por lámina y
 *    los términos en las láminas que hagan falta. Por eso un tipo de la
 *    propuesta puede dar varias láminas.
 */
export interface LaminaArmada {
  clave: string;
  rotulo: string;
  elemento: ReactElement;
}

export interface ActoArmado {
  id: string;
  titulo: string;
  laminas: LaminaArmada[];
}

const CLARAS: StoryTone[] = ["surface", "surface-2"];

export function armarPropuesta(propuesta: Propuesta): ActoArmado[] {
  const { ficha } = propuesta;
  const moneda = rotuloDeMoneda(ficha.moneda);
  const usadas = new Map<string, number>();
  let claras = 0;
  let separadores = 0;
  // Las explicativas que la propuesta ya trae como lámina propia no se repiten
  // detrás de los KPIs.
  const explicativasPuestas = new Set<Explicativa>(
    propuesta.actos.flatMap((a) => a.laminas.flatMap((l) => (l.tipo === "explicativa" ? [l.cual] : []))),
  );
  const parteDe = (n: number, de: number) => (de > 1 ? { n: n + 1, de } : undefined);
  const explicativa = (cual: Explicativa): LaminaArmada => {
    const clave = claveDe("explicativa");
    return {
      clave,
      rotulo: NOMBRE_DE_EXPLICATIVA[cual],
      elemento: (
        <StoryCardFrame key={clave} tone="primary">
          <ContenidoExplicativo cual={cual} />
        </StoryCardFrame>
      ),
    };
  };

  /** Una clave única por tipo: "kpis", "kpis-2"… */
  const claveDe = (tipo: string) => {
    const n = (usadas.get(tipo) ?? 0) + 1;
    usadas.set(tipo, n);
    return n === 1 ? tipo : `${tipo}-${n}`;
  };

  /** Una lámina de papel, con su tono por turno. */
  const enPapel = (clave: string, contenido: ReactElement) => (
    <StoryCardFrame key={clave} tone={CLARAS[claras++ % CLARAS.length]}>
      {contenido}
    </StoryCardFrame>
  );

  const armarLamina = (l: Lamina): LaminaArmada | LaminaArmada[] => {
    // Los tipos que se reparten en varias láminas piden su clave por lámina.
    const clave = ["kpis", "timeline", "terminos", "explicativa"].includes(l.tipo) ? "" : claveDe(l.tipo);
    switch (l.tipo) {
      case "portada":
        return {
          clave,
          rotulo: "Portada",
          elemento: <Portada key={clave} lamina={l} cliente={ficha.cliente} logo={ficha.logo} fecha={ficha.fecha} />,
        };
      case "contexto":
        return {
          clave,
          rotulo: l.titulo,
          elemento: enPapel(
            clave,
            <TarjetasNumeradas
              titulo={l.titulo}
              texto={l.texto}
              invitacion={l.invitacion}
              piezas={l.piezas}
              unidasCon={l.unidasCon}
              cierre={l.cierre}
            />,
          ),
        };
      case "retos":
        return { clave, rotulo: l.titulo, elemento: enPapel(clave, <TarjetasNumeradas titulo={l.titulo} piezas={l.retos} />) };
      case "preguntas":
        return { clave, rotulo: l.titulo, elemento: enPapel(clave, <PreguntasEnMosaico titulo={l.titulo} preguntas={l.preguntas} />) };
      case "como":
        return {
          clave,
          rotulo: l.titulo,
          elemento: (
            <StoryCardFrame key={clave} tone="primary">
              <EtapasDelMetodo
                titulo={l.titulo}
                texto={l.texto}
                rotuloDeEtapa={l.rotuloDeEtapa}
                encadenadas={l.encadenadas}
                etapas={l.etapas}
              />
            </StoryCardFrame>
          ),
        };
      case "kpis": {
        const varias = l.soluciones.length > 1;
        return l.soluciones.flatMap((s, i) => {
          const tramos = partirKpisEnLaminas(s.grupos);
          const deKpis = tramos.map((grupos, t): LaminaArmada => {
            const c = claveDe("kpis");
            const sufijo = tramos.length > 1 ? ` (${t + 1})` : "";
            return {
              clave: c,
              rotulo: (varias ? `${l.titulo} · ${s.nombre}` : l.titulo) + sufijo,
              elemento: enPapel(
                c,
                <KpisPorSolucion titulo={l.titulo} solucion={s} grupos={grupos} indice={i} parte={parteDe(t, tramos.length)} />,
              ),
            };
          });
          const ejemplos = s.grupos.flatMap((g) => (g.ejemplo && !explicativasPuestas.has(g.ejemplo) ? [g.ejemplo] : []));
          ejemplos.forEach((e) => explicativasPuestas.add(e));
          return [...deKpis, ...ejemplos.map(explicativa)];
        });
      }
      case "entregable": {
        const juego = CAPTURAS_DEL_ENTREGABLE[l.capturas];
        const titulo = l.titulo ?? juego.titulo;
        return {
          clave,
          rotulo: titulo,
          elemento: enPapel(clave, <EjemploDelEntregable titulo={titulo} capturas={juego.capturas} demo={l.demo} />),
        };
      }
      case "explicativa":
        return explicativa(l.cual);
      case "perfil":
        return {
          clave,
          rotulo: l.titulo,
          elemento: enPapel(
            clave,
            <PerfilDeLaMuestra titulo={l.titulo} perfil={l.perfil} tarjetas={l.tarjetas} recuadro={l.recuadro} cobertura={l.cobertura} />,
          ),
        };
      case "cuotas":
        return { clave, rotulo: l.titulo, elemento: enPapel(clave, <ZonaDeCuotas lamina={l} />) };
      case "timeline": {
        const titulo = l.titulo ?? "Timeline";
        const varios = l.cronogramas.length > 1;
        return l.cronogramas.map((cr, i) => {
          const c = claveDe("timeline");
          return {
            clave: c,
            rotulo: varios ? `${titulo} · ${cr.nombre}` : titulo,
            elemento: enPapel(
              c,
              <Cronogramas
                titulo={titulo}
                cronogramas={[cr]}
                desde={i}
                consideraciones={[...CONSIDERACIONES_DEL_CRONOGRAMA, ...(l.consideraciones ?? [])]}
              />,
            ),
          };
        });
      }
      case "economica": {
        const titulo = l.titulo ?? "Propuesta económica";
        return {
          clave,
          rotulo: titulo,
          elemento: enPapel(
            clave,
            <PropuestaEconomica titulo={titulo} opciones={l.opciones} moneda={moneda} pie={pieDeCotizacion(ficha.moneda)} />,
          ),
        };
      }
      case "estandar":
        return {
          clave,
          rotulo: "Estándar de ejecución",
          elemento: enPapel(clave, <EstandarDeEjecucion tarjetas={tarjetasDelEstandar(l.cambios)} />),
        };
      case "terminos": {
        const tramos = partirTerminosEnLaminas(terminosYCondiciones(ficha.moneda));
        return tramos.map((bloques, t) => {
          const c = claveDe("terminos");
          return {
            clave: c,
            rotulo: tramos.length > 1 ? `Términos y condiciones (${t + 1})` : "Términos y condiciones",
            elemento: enPapel(c, <TerminosYCondiciones bloques={bloques} parte={parteDe(t, tramos.length)} />),
          };
        });
      }
      case "maia": {
        const titulo = l.titulo ?? "Arma tu selección de MAIA y mira cuánto cuesta";
        return {
          clave,
          rotulo: "Soluciones de MAIA",
          elemento: (
            <StoryCardFrame key={clave} tone="marino" dense kicker="Soluciones de MAIA">
              <div className="flex flex-1 flex-col gap-6 lg:gap-8">
                <h2 className="font-heading text-h2 font-extrabold">{titulo}</h2>
                <CalculadoraDeMaia siglas={l.herramientas} tramos={l.tramos} moneda={ficha.moneda} />
              </div>
            </StoryCardFrame>
          ),
        };
      }
      case "cierre":
        return {
          clave,
          rotulo: "Gracias",
          elemento: <CierreDePropuesta key={clave} frase={l.frase} vendedor={vendedor(ficha.vendedor)} />,
        };
    }
  };

  return propuesta.actos.map((acto, i) => {
    const laminas: LaminaArmada[] = [];
    if (acto.separador) {
      separadores += 1;
      const clave = `sep-${separadores}`;
      const titulo = acto.separador.titulo ?? acto.titulo;
      laminas.push({
        clave,
        rotulo: titulo,
        elemento: (
          <SeparadorDeSeccion
            key={clave}
            numero={separadores}
            titulo={titulo}
            entrada={acto.separador.entrada}
            imagen={acto.separador.foto}
          />
        ),
      });
    }
    laminas.push(...acto.laminas.flatMap(armarLamina));
    return { id: `acto-${i + 1}`, titulo: acto.titulo, laminas };
  });
}
