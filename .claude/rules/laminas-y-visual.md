---
paths:
  - "frontend/src/components/**"
  - "frontend/src/app/**"
  - "frontend/src/lib/story/**"
  - "frontend/src/lib/viz/**"
  - "frontend/public/**"
---

# Láminas y visual

> Se carga sola al abrir un componente, los estilos o los assets. El motivo largo de cada regla
> está en `03` y `04`: ábrelos antes de tocar un color o de maquetar una lámina nueva. Para
> llenar una propuesta no hace falta nada de esto: el catálogo ya lo cumple.

## De visual (ver `03`, `04`)

- **Ningún hex ni `rgba` suelto.** Todo color pide un token POR SU USO (`--tinta-marca`,
  `--marca`, `--cat-n`, `--ordinal-n`…) y el catálogo decide qué paso oficial es en cada tema.
  El catálogo vive en `globals.css` y, en versión visual con los pares claro/oscuro, en
  `documentacion/marca/catalogo-de-colores.html`. Un hex en un componente no voltea con el tema:
  fue lo que rompió el modo oscuro en el primer estudio de la casa. `pnpm auditar:tokens` lo
  caza, y NO da veredictos de contraste: si un color del catálogo se ve, se ve.
- **Todo fondo fijo con contenido encima declara su superficie** (`data-superficie="clara"` o
  `"honda"`, en la misma etiqueta). Una tarjeta blanca, una placa de logo, un botón morado: si no
  lo declaran, el texto de adentro toma la tinta del tema de afuera, y ya salió una tarjeta
  blanca con letra blanca en oscuro. Ver `03`, "Las islas".
- **Sólo escalas oficiales de Atlantia.** Violet, Purple, Turquoise, Lemon, Neutral y las
  semánticas, en sus seis pasos. No se inventan tonos.
- **La marca es Atlantia.** El cliente aparece con su logo en la portada, como artwork y sin
  recolorear; la paleta, la tipografía y todo lo demás son de la casa.
- **Los mandos y la marca viven en la barra de arriba, una sola vez.** Ninguna lámina pone marca
  de agua ni mandos. Ver `04`.
- **Ancho completo, de verdad.** Sin `max-w` de página, sin tope en píxeles, sin padding en
  `vw`. El error típico es el marco al ancho correcto con una columna angosta adentro.
- **Sin "enters de la nada".** Nada de topes en caracteres a títulos: un título parte cuando no
  cabe, nunca antes.
- **Los tamaños salen de la escala fluida** (`text-kicker`, `text-body`, `text-lead`, `text-h*`).
- **Ningún tamaño en px: en rem.** La raíz crece con la pantalla a partir de 1920; un px se queda
  chico en un monitor grande. `text-[0.6875rem]`, no `text-[11px]`. Dentro de un SVG con
  `viewBox`, al revés: `fontSize={11}`, en unidades del dibujo. Ver `04`, sección 8.
- **El kicker y lo que se destaca van en morado, no en turquesa.** En pantalla el turquesa se
  lee azul (decisión de Héctor, 2026-09). La excepción es la propuesta económica, cuyo color es
  el degradado turquesa de la marca.
- **Lo que se lee en orden va en vertical.** Si una lista se parte en columnas, el 1 y el 2
  quedan uno debajo del otro:
  ```
  1  3        NO:   1  2
  2  4              3  4
  ```
- **Una rejilla por número de columnas se pide escrita completa** (`components/propuesta/rejillas.ts`):
  Tailwind no genera `lg:grid-cols-${n}` armada al vuelo y la rejilla se cae a una columna sin
  avisar.
- **Prohibidos los fondos claros extremos.** Una lámina casi blanca, sin grano ni capa de
  ambiente, está sin terminar. Ver `03`.
- **Dos temas, y el oscuro es el que abre**, en pantalla y en el PDF. No se sigue al sistema
  operativo.
- **La cifra siempre va escrita**, aunque haya una barra que la dibuje, y toda barra lleva su
  pista.
- **Nada se encima, en ningún tamaño.** `pnpm fotos` cuenta los textos encimados y sale con
  error si hay uno.
- **Una forma del catálogo no trae nada de un cliente.** Textos, número de opciones, íconos:
  todo llega por props desde la propuesta.

## Una lámina nueva para el catálogo

Es trabajo de operaciones, no de una propuesta. Un tipo nuevo se declara en
`lib/propuesta/tipos.ts`, se dibuja en `components/propuesta/`, se arma en
`lib/propuesta/armar.tsx` y se documenta en `documentacion/catalogo-de-laminas.md`.

**Nada se abre con un clic** (decisión de operaciones, 2026-11): ni desplegables, ni botones que
abren algo encima, ni tarjetas que se agrandan. La propuesta se consume sin interactuar. Lo que
no cabe en una pantalla se va a la lámina siguiente, y `armar.tsx` reparte (ver KPIs, timeline
y términos). La calculadora de MAIA es la excepción: es una herramienta, no contenido escondido.

## Las revisiones, en proporción al cambio

| Qué se cambió | Qué se corre |
|---|---|
| Un texto o una cifra de la propuesta | `pnpm check` |
| Un color o un estilo | `pnpm auditar:tokens` |
| Un componente nuevo o rehecho | `pnpm check`, `pnpm auditar:tokens` y `pnpm fotos` de esa lámina |
| Antes de publicar | `pnpm verificar` |

Mientras se arma, quien ve es el vendedor, en su `localhost:3000`: su comentario ya es la
revisión. `pnpm fotos` no se corre en cada vuelta: arma un build por foto y cuesta.
