# 04 · Layout y medidas

> **Viene de la base de reportes y aplica igual a las propuestas:** es el mismo sistema visual y
> el mismo recorrido. Donde dice *reporte*, léase también *propuesta*; donde dice *operador*,
> en propuestas es el *vendedor*. Las historias que cuenta son de reportes reales, y por eso
> se quedan como están.

Léelo **antes** de maquetar la primera lámina. Las reglas de este documento (la barra de
arriba, el ancho completo, las alturas) afectan a todas las superficies a la vez, y
descubrirlas tarde significa volver a recorrer el reporte completo.

---

## 1. La barra de arriba: todos los mandos, una sola vez

**Es la distribución de la casa desde septiembre de 2026**, fijada viendo un reporte real.
Reemplaza a las esquinas: antes los mandos vivían regados (inicio, PDF, tema y pantalla completa
abajo a la derecha; índice y contador abajo a la izquierda; la marca de Atlantia repetida como
agua en la esquina de cada lámina). Tres grupos que había que aprenderse por separado, y una
marca que se repetía treinta veces para decir lo mismo una vez.

```
☰  │ atlantia  PROPUESTA · TEMA DEL ESTUDIO       ↑  12 / 37   ⌂   ☾   ⤓   ⛶
```

| Lado | Qué va | En qué orden |
|---|---|---|
| Izquierda | El índice (☰), el logo horizontal de Atlantia, el nombre del estudio | fijo |
| Derecha | Volver al índice de sección (solo si el acto tiene uno) · contador `n / N` · inicio · tema · descargar PDF · pantalla completa | fijo |

El componente es `EncabezadoDelReporte`, y el shell lo monta solo: **una lámina no pone
mandos ni marca**. Ninguna lámina lleva marca de agua.

Tres decisiones que la definen:

- **No tiene fondo.** Una franja fija oscura le corta la cabeza a cada lámina, y en un reporte
  donde el fondo cambia de morado a foto a blanco, esa franja se vuelve lo primero que se ve.
  Los mandos van sueltos, chicos, en `--tinta-marca`, que ya viene oscura en claro y clara en
  oscuro. Cero JavaScript para acertarle al contraste lámina por lámina.
- **El logo es el archivo oficial**, montado dos veces (negro y blanco) y el tema decide cuál se
  ve. Nunca la versión a color: sobre fondo oscuro pierde la pierna morada del glifo.
- **El hilo de progreso** (3 px, del violeta al turquesa de la marca) va soldado al borde de
  arriba de la barra y se estira con el avance real del scroll.

**La esquina superior izquierda ya NO está reservada.** Durante un tiempo se dejaba libre
porque MAIA dibujaba su botón ahí al embeber. Esa reserva se retiró en la revisión del curso:
el índice y el logo van ahí. Si al embeber en MAIA vuelve a aparecer un choque, se resuelve en
la barra, no reservando la esquina en cada lámina.

**No va un botón de cerrar.** El reporte se embebe en MAIA y esa salida la pone MAIA. Un
segundo botón de cerrar dentro del iframe cierra otra cosa, y el lector no sabe cuál.

### El relleno de arriba de cada lámina

El contenido arranca debajo de la barra fija:

```
pt-[4.5rem]  lg:pt-[5.5rem]
```

`StoryCardFrame` ya lo pone. Si construyes una lámina fuera del marco (una portada a medida),
respétalo o el cintillo se mete debajo de la barra.

### Los puntos de sección van por ACTO, no por lámina

En el borde derecho, centrados verticalmente. Un punto por acto.

Treinta y un puntos apilados no se pueden apuntar con el ratón y no dicen nada; siete sí, y
son el mapa que quien presenta ya tiene en la cabeza.

**Quién manda es el scroll, y los puntos lo siguen.** El punto activo lo decide un observador
sobre las láminas, no un contador propio: en cuanto alguien usa la rueda, el teclado o la
barra, un contador propio se separa de la posición real y los puntos empiezan a mentir.

### Y nada de barras pegajosas propias dentro del reporte

Dentro de un embebido, un `sticky top-0` nuestro compite con el chrome del host. El único
que existe es la barra de arriba; ninguna lámina lleva el suyo.

---

## 2. Ancho completo

El reporte usa **todo el ancho de la ventana**. Sin `max-w`, sin tope en píxeles, sin padding
en unidades de viewport.

```tsx
// Bien
<div className="px-5 pt-[4.5rem] pb-16 sm:px-8 lg:px-10 lg:pt-[5.5rem] lg:pb-20">

// Mal
<div className="mx-auto max-w-2xl 2xl:max-w-[1900px] px-[5vw] lg:px-[6vw]">
```

Los tres pecados que se quitaron, y lo que costaba cada uno:

- **`max-w-2xl`** dejaba una columna de lectura de blog en una pantalla de trabajo.
- **`2xl:max-w-[1900px]`** ponía un tope arbitrario que en un monitor grande dejaba franjas
  muertas a los lados.
- **`px-5vw` / `px-6vw`** parecía elegante y en realidad **se comía cien píxeles por lado** en
  cuanto la pantalla crecía.

En una ventana de 1600px, el ancho útil pasó de 1440 a **1520** sólo por quitar eso.

**Y nada de topes en caracteres a títulos, subtítulos ni bajadas.** Durante un tiempo la
casa les ponía `max-w-[16ch]` "para que partieran bonito en dos renglones". El resultado era un
salto de línea de la nada: "Muestrario de / formas" cuando cabía completo en un renglón. Lo
cazó el responsable del método (2026-09): *"nunca he entendido este enter que metemos"*. Un
título parte cuando de verdad no cabe, y sólo entonces. Lo mismo un subtítulo o una bajada.

El único tope legítimo es el de un **párrafo largo de cuerpo** que cruce toda una pantalla de
27 pulgadas (unas 80 palabras por renglón cansan): ahí un `max-w-[80ch]`, y nunca menos.

---

## 3. Alturas

**`h-dvh`, nunca `100vh`.** En móvil, `100vh` cuenta el alto de la barra del navegador
aunque esté visible: el contenido se corta y el usuario tiene que rodar en algo diseñado para
caber en una pantalla. `dvh` (dynamic viewport height) sigue a la barra cuando aparece y
desaparece.

```tsx
<main className="min-h-dvh ...">                          // páginas de scroll
<div  className="relative min-h-dvh w-full overflow-hidden">  // una lámina
```

Una lámina mide **al menos** una pantalla y puede crecer. Una altura clavada recortaba las
láminas de datos que miden dos.

### La banda blanca

Una lámina `dense` alinea su contenido arriba. Si nada dentro pide crecer, el alto sobrante
se acumula al pie en un solo bloque: eso es la banda blanca, y se corrigió media docena de
veces a ojo en un estudio. Basta con que un elemento absorba el sobrante (`flex-1`, `my-auto`,
`mt-auto`, `justify-center`). En las fotos (`pnpm fotos`) se ve.

---

## 4. Pantalla completa

Dentro del `iframe` de MAIA la historia queda apretada y se pierde parte de la experiencia.
El botón de pantalla completa la deja ocupar la pantalla **sin sacar al usuario de MAIA**: lo
que se agranda es el documento, no una ventana aparte.

**Se dibuja sólo si de verdad se puede.** `document.fullscreenEnabled` ya toma en cuenta la
política de permisos del `iframe` que nos contiene: si el host no puso `allow="fullscreen"`,
el botón no aparece. Un botón que no hace nada es peor que no tenerlo. **No hay plan B.**

---

## 5. Los controles del recorrido

El reporte **se baja**, no se pasa de lado. Una columna vertical, no una pila de diapositivas.

### El anclaje es SUAVE, nunca obligatorio

```css
.recorrido { scroll-snap-type: y proximity; }
```

`mandatory` convertía cada golpe de rueda en un salto de lámina completa: el desplazamiento
se sentía **secuestrado**, y en las láminas de datos —que miden dos y tres pantallas— peleaba
contra quien intentaba leer su parte de abajo.

### Las teclas

| Tecla | Qué hace |
|---|---|
| ↓ ↑ · Espacio · AvPág RePág | Lámina siguiente y anterior |
| Inicio / Fin | Primera y última |
| `I` | Abre el índice (cajón por la izquierda, con número de lámina y un ojo por lámina y por acto) |
| `T` | Cambia el tema |
| `F` | Pantalla completa |
| teclear `atlantia` | Atajo que abre el índice, donde se prenden y apagan láminas |

**La pista de teclas se enseña siete segundos y se desvanece.** No se queda: es una ayuda de
arranque, no una barra de estado. En los dashboards del equipo se quedaba fija porque a la
base le faltaba la regla de CSS (`.pista-teclas`); ya está.

### Prender y apagar láminas: el ojo del índice

Cada lámina del índice lleva un **ojo** al final de su renglón, y cada acto el suyo, que prende
o apaga la sección completa. Sirve para armar una junta corta o una vista a la medida:

- La lámina apagada **sale del recorrido** y el contador baja. Un acto entero apagado **se lleva
  su separador**.
- La apagada **se queda en el índice**, atenuada y tachada, para poder volver a prenderla.
- Se guarda **en el navegador** de quien la arma. **Nunca se apaga todo**: si no queda ninguna,
  se ve el reporte completo. **El PDF no se entera**: siempre lleva el reporte completo.
- Los ojos están **siempre a la vista**, en todas las versiones. Antes era una pantalla aparte
  que se abría tecleando `atlantia`, y nadie daba con ella: esa palabra hay que escribirla con
  el índice cerrado. Se conserva como atajo que abre el índice.

**La trampa, para quien toque este código:** el índice numera TODAS las láminas y el recorrido
sólo las visibles. Cada vez que algo mezcló esas dos posiciones salió un error que no se ve hasta
que alguien apaga una sección: apagabas un acto y se apagaba otro, o un acto apagado desaparecía
del índice sin ojo para recuperarlo. La posición entre las visibles sólo sirve para saltar; para
agrupar o identificar un acto se usa la clave o el título. Está escrito junto al código, en
`ModoPresentacion.tsx`, `NavegadorDeHistoria.tsx` y `StoryShell.tsx`.

Para probarlo: apagar una lámina y recorrer (no aparece, el contador baja); apagar un acto
completo (se va su separador y el acto sigue listado con su ojo tachado); apagar todo (se ve
completo); recargar (la selección sigue); clic en el ojo no salta a la lámina, clic en el nombre
sí.

### Lo que se probó y se retiró

- **Las flechas a los costados.** Eran de la navegación por clic; con scroll no tienen trabajo.
- **Los mandos en las esquinas de abajo.** Se mudaron enteros a la barra de arriba.
- **La marca de agua por lámina.** Vive una sola vez, en la barra.
- **El menú de presentación aparte**, con una casilla por lámina. Lo reemplazó el ojo del índice:
  dos pantallas que hacen lo mismo terminan comportándose distinto.
- **Las animaciones de transición entre láminas.** Ver `06`: con scroll, la animación y el
  desplazamiento se pelean y lo que se ve es un temblor.

---

## 6. Composición de una lámina

- **Una lámina, una idea.** Si la lámina necesita dos títulos, son dos láminas.
- **Los bloques centrados arrancan en la misma `x`.** `items-start` dentro de un contenedor
  centrado: el bloque sigue al centro de la lámina, pero los renglones alinean su inicio.
- **Lo que se lee en orden va en vertical.** Si una lista se parte en dos columnas, el 1 y el 2
  quedan uno debajo del otro (`grid-flow-col` con las filas declaradas), no uno al lado del otro.
- **Nada de avisos en la lámina.** Lo que el vendedor deba saber se le dice en la conversación;
  una lámina con una nota de trabajo encima se ve a medio hacer frente al cliente.

---

## 7. Tamaños de pieza

Los que se repiten y conviene no reinventar:

| Pieza | Medida |
|---|---|
| Mando de la barra de arriba | `h-6 w-6`, ícono de `h-[0.9375rem]` a `h-[1.125rem]` (15 a 18 px a tamaño de referencia), opacidad 55 → 100 al pasar |
| Ícono de etiqueta de KPI | `h-3.5 w-3.5 strokeWidth={2.5}` |
| Barra de acento del título de sección | `w-1` / `lg:w-1.5` |
| Radio de tarjeta | `rounded-xl` (contenido) · `rounded-2xl` (tarjeta) · `rounded-3xl` (tarjeta de opción económica) |
| Nota al pie (vigencia de la cotización) | `text-[0.6875rem]` (11 px a tamaño de referencia), tinta tenue |

La regla detrás de la nota al pie: **una anotación no puede pesar más que lo que anota.**

Los tamaños van en **rem, nunca en px**: ver la sección 8.

---

## 8. La lámina guarda su proporción en cualquier pantalla

Un operador presentó en un monitor grande (o con el navegador alejado) y la lámina salió
chica, con huecos arriba y abajo de las gráficas y el pie de fuente ilegible (2026-09). En su
pantalla el ancho de la lámina crecía, pero la letra y las gráficas no.

**La raíz del reporte crece con el ancho de la pantalla** a partir de 1920, que es la pantalla
de referencia (`html { font-size: clamp(16px, 100vw / 120, 32px) }` en `globals.css`). Todo lo
que está en rem —la escala fluida, los aros, el waffle, las alturas de las gráficas— crece con
ella, y la lámina se ve igual en un monitor de 1920 que en uno de 2560 o con el navegador al
75%.

- **Sólo el ancho, no el alto.** La lámina crece hacia abajo con scroll, que es como se trabaja
  aquí; no es un lienzo fijo de 1920×1080.
- **Por debajo de 1920 no cambia nada**: laptops, celular, las fotos y el PDF (que se toman a
  1600). Y acercar el navegador sigue agrandando la letra.
- **Ningún tamaño en px.** Un px no crece con la pantalla. `text-[11px]` se escribe
  `text-[0.6875rem]`; `w-[620px]`, `w-[38.75rem]`. Bordes y filetes de 1 a 3 px se quedan en px:
  son trazo, no tamaño. `pnpm auditar:tokens` lo caza.
- **Dentro de un SVG con `viewBox`, al revés:** la letra va con el atributo `fontSize={11}`, en
  unidades del dibujo. El dibujo entero ya crece con su caja, y una letra en rem crecería dos
  veces.

Los reportes que ya existían antes de esta regla no la heredan: se parchan uno por uno.
