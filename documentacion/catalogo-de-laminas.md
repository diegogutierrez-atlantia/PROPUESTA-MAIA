# Catálogo de láminas

Los tipos de lámina que sabe dibujar la base. Una propuesta es una lista de actos, y cada acto
una lista de láminas con su `tipo`. La forma exacta de cada uno está en
`frontend/src/lib/propuesta/tipos.ts`; aquí va **para qué sirve, qué pide y de dónde sale**.

Los nombres de lámina en el índice, las claves y la numeración de las cortinillas salen solos.
El tono de fondo también: las de papel alternan sus dos tonos por orden, y las de color
(portada, método, explicativas, MAIA, cierre) van sobre el morado de la casa.

---

## La estructura de siempre

Es el patrón de las propuestas que ya se mandaron. Se sigue salvo que el vendedor pida otra
cosa.

```
Acto «Apertura»                      portada · contexto (opcional)
Acto «Retos y preguntas de negocio»  [cortinilla] retos (opcional) · preguntas · como · kpis · entregable
Acto «Dimensión del estudio»         [cortinilla] perfil · cuotas (opcional) · timeline · economica · estandar · terminos · cierre
```

**Varios estudios que se venden por separado** (el vendedor dice que se cotizan aparte): un acto por estudio, cada uno con su cortinilla y sus propias `preguntas`, `kpis`,
`perfil`, `timeline` y `economica`. Al final, un acto con `terminos` y `cierre`. La lámina `como`
de la apertura los presenta con `encadenadas: false` (sin flechas).

---

## Los tipos

### `portada`
La primera lámina. Título creativo, una línea de qué trata, las soluciones en píldoras y una
frase opcional. El logo y la fecha salen de la ficha.
**De su material:** el tema y las soluciones. Si no da título, lo propones tú.

### `contexto`
Dos a cuatro tarjetas numeradas que plantean el problema (las dimensiones del mercado, las
perspectivas que se suman) con un párrafo arriba y una frase de remate opcional en banda de
color. `unidasCon: "+"` cuando las piezas se suman.
**De su material:** el brief o el correo del cliente. Si no hay, se omite.

### `retos`
Hasta tres retos del cliente en tarjetas numeradas (kicker, título, explicación).
**De su material:** si no los nombra, los sacas del contexto, o se omite.

### `preguntas`
Las preguntas de negocio en mosaico, numeradas por columna. Cada una con su ícono y, si el
vendedor lo dio, una línea de detalle. Hasta doce caben bien.
**De su material:** lo que el cliente quiere saber. Los íconos los eliges tú (lucide).

### `como`
Cómo se va a lograr: las etapas o los estudios en tarjetas translúcidas sobre color.
`encadenadas: true` pone flechas (uno lleva al otro); `false`, sin flechas (se contratan por
separado). `rotuloDeEtapa`: "Etapa", "Paso" o "Propuesta".
**De su material:** si no describe etapas, son los estudios que se cotizan.

### `kpis`
Los indicadores, todos a la vista: **una lámina por solución** (o dos, si no caben en una
pantalla), con sus grupos en columnas. Los estudios de
catálogo se toman de la casa: `kpisDeLaCasa("ua" | "ba" | "ba-complementarios" | "pposs" |
"nps" | "pct")` (`pct` = Packaging Concept Test), y se ajustan si el vendedor quita o agrega algo. Un estudio a la medida lleva sus
grupos escritos. Un grupo puede traer `ejemplo` ("cluster", "correspondencias",
"match-index"): su lámina explicativa se agrega sola justo después de esos KPIs.
**De su material:** qué estudio es y si pide quitar o agregar KPIs.

### `entregable`
Capturas reales del dashboard que recibe el cliente, con la insignia "Entregable único".
`capturas: "dashboard"`. Opcional: `demo` con una liga a un demo en vivo.
**No se pregunta:** va siempre.

### `explicativa`
Una lámina propia que explica un método de la casa: `cual: "cluster" | "correspondencias" |
"match-index"`. Normalmente no se declara: va sola detrás de los KPIs del grupo que la trae. Se
declara sólo para ponerla en otro lugar; entonces ya no se repite detrás de los KPIs.

### `perfil`
A quién se entrevista y dónde: renglones de perfilamiento con palomita, tarjetas (especificaciones,
cruces, duración, método…: sólo las que aplican), el recuadro punteado con alcance y muestras,
y la cobertura: `nielsen` (mapa por áreas Nielsen), `plazas` (sólo esos estados iluminados:
`estado` con su nombre común, "Ciudad de México", "Nuevo León", "México" para el Estado de
México), `paises` (baldosas) o `ninguna`.
**De su material:** a quién y dónde. Las muestras van como texto ("250 / 200"). Si faltan, se preguntan.

### `cuotas`
"A lo que vamos a llegar": cuotas puntuales con barra, o tablas de rangos ("150 – 190"), con
porcentaje opcional de 0 a 1.
**De su material:** cuotas por marca o segmento, si las da. Opcional.

### `timeline`
Uno o varios cronogramas por semanas, **cada uno en su propia lámina**, dibujado completo. Las
consideraciones de la casa van solas.
Se arman con la casa: `cronogramaCuantitativo({ diasDeLevantamiento })`,
`cronogramaCualitativo({ diasDeReclutamiento, diasDeCampo, diasDeAnalisis })`,
`cronogramaAiMarketPulse()`. **Las duraciones van en días hábiles: semanas × 5.** Un cronograma
que no sigue la plantilla se escribe actividad por actividad (días del 1 en adelante, `hasta`
inclusivo).
**De su material:** las semanas de cada etapa. Si faltan, se preguntan.

### `economica`
Una tarjeta por opción. Cabecera con las cifras grandes (la muestra de cada estudio), lo que
incluye (estudio, especificaciones, alcances) y los costos. Con `total`, los costos van en cajas
y el total en barra; sin `total`, cada costo es una alternativa en su propia barra. Un costo con
`desglose` enseña sus partes. Una `tabla` da precios por renglón (país, ciudad, ola).
**El total se comprueba contra la suma**; si trae descuento, `sinSumar: true` y su `nota`.
**De su material:** su cotización. Si faltan precios, se preguntan.

### `estandar`
El estándar de ejecución de la casa. Sólo se declara lo que cambia: `cambios.extension`
("**25 minutos**"), `cambios.cruces`, `cambios.traduccion`.
**De su material:** duración del cuestionario y cruces, si los da.

### `terminos`
Los términos y condiciones de la casa, en la moneda de la ficha, completos y a la vista: se
reparten solos en las láminas que hagan falta (hoy, cuatro). No lleva campos. Va siempre.

### `maia`
La calculadora de herramientas de MAIA por créditos: `herramientas` (siglas de `casa/maia.ts`)
y `tramos` de precio por crédito, que da el vendedor.
**De su material:** si ofrece MAIA, qué herramientas y a qué precio. Los precios se preguntan.

### `cierre`
La última lámina: la frase de cierre y el vendedor que firma (foto y nombre de
`casa/vendedores.ts`). Va siempre.
**De su material:** si no da frase, la propones tú.

---

## La ficha

`cliente`, `logo` (archivo en `public/cliente/`, medidas reales y `fondo`), `rotulo` (lo de la
barra de arriba: «Propuesta de investigación · Tema»), `fecha` ("Noviembre 2026"), `moneda`
("MXN" o "USD") y `vendedor` (su clave en `casa/vendedores.ts`; si no está, se da de alta con su
foto en `public/casa/vendedores/`).

**De su material:** cliente, moneda y quién firma. Si faltan, se preguntan: son obligatorios.

---

## Cuando nada del catálogo sirve

Primero, el tipo que más se acerca. Si el vendedor insiste en algo nuevo, se puede construir en
`components/propuesta/`, con las reglas visuales de la casa (`.claude/rules/laminas-y-visual.md`),
pero es trabajo de operaciones subirlo a la base: un tipo nuevo se declara en `tipos.ts`, se
arma en `armar.tsx` y se documenta aquí, para que la siguiente propuesta lo tenga sin volver a
hacerlo.
