# 12 · Cómo trabajamos

El método, no el código. Esto es lo que cuesta más caro aprender por las malas.

---

## 1. De un jalón, pero preguntando una sola vez

La propuesta sale completa en la primera pasada: el vendedor da su material, Claude lo lee todo
y arma todas las láminas. Lo que falta se pregunta **una sola vez y todo junto**, al principio,
no lámina por lámina. Cinco preguntas sueltas a lo largo de una tarde son cinco interrupciones;
una lista de cinco cifras es un minuto.

Sólo se pregunta lo que de verdad es del vendedor: cifras y lo obligatorio. Lo de la casa ya va
solo, y los textos que faltan se proponen.

## 2. La verificación rápida no es el build

Mientras se arma, se revisa con `pnpm check`. El build es lento, se pelea por el directorio de
salida con el `pnpm dev` y hace perder el hilo. El build lo hacen solos `pnpm pdf` y `pnpm fotos`
(en su propio directorio) y el hosting al publicar.

## 3. Se revisa viendo, no adivinando

Si hay que saber cómo quedó una lámina, se abre la lámina. No se deduce del código.

Quien ve, mientras se arma, es **el vendedor**: Claude le levanta la propuesta y le da la liga
(`localhost:3000`), y su comentario ya es la revisión. Claude no se fotografía en cada vuelta:
cada foto cuesta un build y tokens, y una misma lámina terminaba vista cuatro veces antes de
cualquier cambio (decisión de la casa, 2026-09).

`pnpm fotos` se corre cuando se toca un componente o una lámina nueva del catálogo, no para
llenar una propuesta: el catálogo ya está fotografiado.

| Qué se cambió | Qué se corre |
|---|---|
| Un texto o una cifra de la propuesta | `pnpm check` |
| Un color o un estilo | `pnpm auditar:tokens` |
| Un componente del catálogo | `pnpm check`, `pnpm auditar:tokens` y `pnpm fotos` de esa lámina |

## 4. El comentario explica el porqué, no el qué

El código ya dice qué hace. Lo que se pierde es **por qué está así**, y eso es justo lo que la
siguiente persona necesita para no deshacerlo.

```ts
// Mal
// Comprueba el total.

// Bien
// Un total que no es la suma de sus renglones es el error que más cuesta en una
// propuesta, y se ve perfecto. Si no cuadra, la lámina no se arma.
```

Los comentarios de este proyecto son largos a propósito. Cada uno es una decisión que ya se
discutió una vez, y su función es que no se vuelva a discutir desde cero ni se revierta sin
saber qué se está revirtiendo. **Ningún comentario nombra a un cliente**: se escribe el motivo,
no de quién salió.

## 5. Los nombres son del dominio, y en español

Los componentes y funciones se llaman como se llaman las cosas en la conversación con el
equipo: `PropuestaEconomica`, `cronogramaCuantitativo`, `kpisDeLaCasa`. No `PricingCard` ni
`buildTimeline`. Quien lee el código es quien discute la propuesta, y la traducción mental entre
las dos conversaciones es fricción pura.

Lo que queda en inglés es lo que ya está en inglés en el dominio (U&A, Brand Awareness, Match
Index) y las convenciones del framework.

## 6. Publicar es del vendedor, aunque lo ejecute Claude

En los reportes, los commits y los pushes los hace una persona. En propuestas, **los ejecuta
Claude, pero sólo cuando el vendedor lo pide** y después de enseñarle el resumen de lo que se va
a publicar (decisión de Héctor, 2026-10): el vendedor aprende lo mínimo y git no es parte de lo
mínimo. La frontera de "nada se publica solo" es su sí.

## 7. Un problema a la vez, y del lado correcto

Si una clase nueva de CSS no hace nada, no la reescribas diez veces: es el caché, o una clase
armada al vuelo que Tailwind no generó. Si una lámina se ve mal en un solo navegador, es el
navegador. Si un total no cuadra, es una pregunta para el vendedor, no un error que se esconde.

Antes de cambiar algo que ya funcionaba, **busca su comentario**.

## 8. Lo que se decide, se escribe donde se aplica

- Una decisión visual → el comentario del componente.
- Una regla de la casa (términos, estándar, KPIs) → `casa/`, con su motivo.
- Una decisión de proceso → esta carpeta.
- Una decisión de esta propuesta en particular → la conversación con el vendedor; la propuesta
  no lleva notas.

Lo que no se escribe se vuelve a discutir en tres meses, con menos información.
