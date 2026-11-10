---
paths:
  - "frontend/src/content/**"
  - "frontend/src/casa/**"
  - "frontend/src/lib/propuesta/**"
  - "frontend/src/components/propuesta/**"
  - "documentacion/catalogo-de-laminas.md"
---

# Contenido y catálogo

> Se carga sola al abrir la propuesta, lo de la casa o el catálogo. Los tipos de lámina, uno por
> uno: `documentacion/catalogo-de-laminas.md`.

## La propuesta es un archivo de datos

- **`content/propuesta.ts` es lo único que se llena por propuesta.** Ningún componente se toca
  para una propuesta: si una lámina necesita algo que su tipo no tiene, la respuesta es el tipo
  que más se acerca o una conversación con operaciones, no un parche en el componente.
- **Lo de la casa se toma, no se copia.** `kpisDeLaCasa("ua")`, `cronogramaCuantitativo({…})`,
  la lámina `terminos` sin campos. Copiar el texto de la casa dentro de la propuesta es como se
  perdió una palabra de una cláusula legal en una de las primeras propuestas.
- **Ninguna propuesta lleva contenido de otra.** Ni texto, ni cifras, ni archivos. La base no
  trae ejemplos de clientes a propósito.

## Las cifras

- Son del vendedor: muestras, semanas, precios, cuotas, SKUs, minutos. Si falta una, se
  pregunta; nunca se inventa "para ver cómo se ve".
- **Los totales se copian.** `economica` comprueba que el total sea la suma de sus costos y
  revienta si no; un total con descuento va `sinSumar: true` con su `nota`.
- **Los montos van como números** (`2571000`), sin signo ni comas: se formatean al pintar. Con
  centavos sólo si el vendedor los dio.
- **Los porcentajes, de 0 a 1** (`0.18`), donde el tipo pide un porcentaje.
- **Las duraciones del timeline, en días hábiles**: semanas × 5 (seis semanas = 30). Media semana
  son 2.5 días.

## Los textos

- Los del vendedor van tal cual; sólo se corrige una errata evidente, avisando.
- Los que faltan los propones a partir de su brief y se lo dices en el resumen. Tono de
  propuesta: claro, concreto, sin adjetivos de relleno ni promesas que el estudio no mide.
- Mayúscula inicial y acentos. Los nombres de producto de la casa se escriben como en el catálogo
  (U&A, P&POSS, AI Market Pulse, MAIA).

## Los íconos

Son de `lucide-react` y se importan en `propuesta.ts`. Uno por pregunta, reto o etapa, que diga
algo del texto (un mapa para "dónde", una cartera para "cuánto gastan"). Son decorativos: no
llevan información que el texto no lleve.

## Lo de la casa (`casa/`)

Términos (`terminos.ts`, fuente: el PDF de `documentacion/propuesta/`), estándar, KPIs por
solución, cronogramas, herramientas de MAIA, capturas del entregable y vendedores. **No se
edita para una propuesta.** Cambia sólo cuando cambia la casa, y entonces aplica a todas las
propuestas nuevas. Un vendedor nuevo sí se da de alta aquí, con su foto en
`public/casa/vendedores/`.
