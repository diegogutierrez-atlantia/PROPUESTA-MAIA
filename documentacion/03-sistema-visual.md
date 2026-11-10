# 03 · Sistema visual

> **Viene de la base de reportes y aplica igual a las propuestas:** es el mismo sistema visual y
> el mismo recorrido. Donde dice *reporte*, léase también *propuesta*; donde dice *operador*,
> en propuestas es el *vendedor*. Las historias que cuenta son de reportes reales, y por eso
> se quedan como están.

Todo lo de este documento vive en un solo archivo, `frontend/src/app/globals.css`, y su
versión visual, con los pares claro/oscuro uno junto al otro, en
`documentacion/marca/catalogo-de-colores.html`. **Ábrelo en el navegador**: es lo que el
equipo revisa cuando algo se ve raro.

---

## 1. El catálogo de colores

**Todo color que se pinta sale de las escalas oficiales de Atlantia** (guía de marca en GAIA,
copiada en `documentacion/marca/`). Seis pasos por color, 100 el más oscuro, 10 el más claro;
el 80 es el color de identidad.

| Escala | Para qué |
|---|---|
| Violet | El color de la marca. El morado manda |
| Purple | Acompaña al violeta. En oscuro, es la rampa ordinal |
| Turquoise | Casi no se usa: se lee azul. Ni kickers ni destacados, que van en morado (2026-09). Nunca fondo |
| Lemon | Energía, en dosis chicas. Nunca fondo |
| Neutral | Los grises del texto y las pistas |
| Green · Yellow · Orange · Red | Estado: sube, advertencia, alerta, error. Nunca decorativos |

**No se inventan tonos.** Si falta uno, se toma el paso más cercano de la escala. En la
revisión del curso (2026-09) se retiraron todos los colores que no estaban en la guía: el
verde `#0ca30c`, el dorado `#fab219`, el coral `#ec835a`, el azul de Tailwind, la "gama
categórica" de jade, lila y gris, y los neutrales inventados del papel. La sección 5 del
catálogo HTML los lista uno por uno con su sustituto.

---

## 2. Un token por USO, con su par claro y oscuro

**Es la regla más importante de todo el sistema visual y la que más se rompe.**

Un componente no escribe un color: pide un token **por lo que ese color hace**, y el catálogo
decide qué paso oficial es en cada tema.

```
--tinta-marca     texto o trazo de marca sobre papel      violet-100 · violet-20
--marca           UNA serie de marca (una barra, un aro)  violet-80  · violet-40
--estimulo-a/b    los dos estímulos de una comparación    violet-80 / purple-80 · violet-60 / purple-60
--cat-1 … --cat-5 lo que NO tiene orden                   violet, turquoise, purple, lemon, neutral
--ordinal-1 … 6   lo que SÍ tiene orden, de más a menos   Violet 100→20 · Purple 20→100
--positivo(-ink)  lo que sube                             green-80 · green-100 / green-60
--negativo(-ink)  lo que baja (MORADO, no rojo)           purple-80 · purple-100 / purple-40
--pista           el carril vacío detrás de una barra     neutral-40 · veladura de violet-10
--atenuado        la serie que no se destaca              neutral-80 · neutral-80
--papel           la caja donde vive la gráfica           blanco · morado hondo
--kicker          los kickers en mayúsculas               purple-80 · purple-60
--acento          lo que se DESTACA (la marca del estudio, purple-80 · purple-60
                  la tarjeta elegida), como trazo o texto
--region-1 … 6    las regiones de un mapa (áreas Nielsen)  morados y violetas fijos, alternados
--signif-demografico  el glifo de significancia demográfica  el gris del PNG · el mismo
--signif-perfil       el glifo de significancia de perfil    el violeta del PNG · violet-20
```

Los dos `--signif-*` vienen de la base de reportes, donde marcan la significancia de una cifra.
Una propuesta no los usa; se quedan en `globals.css` para que el catálogo de colores sea el
mismo en las dos bases.

**El kicker y el destacado son morados, no turquesa** (decisión de Héctor, 2026-09). La guía
de GAIA pone el kicker en turquesa, pero en pantalla se leía azul y la casa casi no usa ese
color. Toda forma que destaca algo lo hace con `ACENTO` por omisión y deja cambiarlo con
`colorDestacado`.

El sufijo **`-ink`** significa *"este es el que puede llevar letra encima"*: el relleno de una
barra y el texto de su cifra no son el mismo paso. Y `ramps.ts` expone todo esto con nombre
(`TINTA_MARCA`, `MARCA`, `ESTIMULOS_2`, `CATEGORICA`, `ORDINAL_5`, `POLARIDAD`, `BANDAS`…)
para que un componente no escriba `var(--ordinal-3)` a mano.

**Un hex o un `rgba` suelto en un componente es un bug**, y `pnpm auditar:tokens` lo
reporta. El motivo no es de orden: **un hex no voltea con el tema**. Así se rompió el modo
oscuro en el primer estudio: las gráficas pintaban con `VIOLET[1]` fijo, que se lee perfecto
sobre blanco y desaparece sobre fondo hondo, y para compensar se metían blancos fijos. Esos
arreglos son los que se veían "construidos con las patas".

### Los únicos colores que NO voltean

Los **rellenos de marca** (una lámina morada, un chip de banda, una baldosa de color) son la
marca, no el papel: se ven igual en los dos temas, y lo que va encima es siempre blanco
(`--color-sobre-relleno`). Lo mismo los fondos de lámina de color (sección 5).

### Las islas: toda superficie que no voltea declara cuál es

El tema se decide una vez, para la página. Pero un reporte tiene **islas**: una tarjeta blanca
sobre la página honda, una placa de logo, un botón morado, una lámina de color en tema claro.
Si la isla no dice nada, el texto de adentro pide "la tinta del tema" y le toca la del papel
de **afuera**. En MIO (2026-09) salió así una tarjeta blanca con letra blanca en oscuro, y la
auditoría de colores la dio por buena, porque cada color, por separado, era del catálogo.

La regla: **todo fondo fijo con contenido encima declara su superficie en la misma etiqueta.**

| Declaración | Qué pasa adentro |
|---|---|
| `data-superficie="clara"` | papel y tinta de claro, en los dos temas |
| `data-superficie="honda"` | papel y tinta de oscuro, en los dos temas |

Adentro se sigue pidiendo tokens (`bg-surface`, `text-ink`, `text-muted`): la declaración los
voltea, igual que el tema voltea la página. Así nadie escoge "la letra oscura" a mano, que es
justo lo que se olvida. **Las láminas de color ya la declaran solas** (`StoryCardFrame`), así que
lo que va sobre ellas toma la tinta clara sin que el componente se entere.

`pnpm auditar:tokens` revienta si un fondo fijo (blanco, un relleno de marca, un paso de escala)
tiene contenido y no declara su superficie. No ve un fondo que llega en una variable ni los
rellenos translúcidos: lo dice en su cabecera, para que un verde no se lea como "todo se lee".

### Lo que se retiró: el auditor de contraste

Daba veredictos ("ese color no se ve") que la vista desmentía, y estresaba al equipo. **Se
retiró a propósito.** El auditor de hoy no mide contraste: comprueba que cada color que usa el
código exista en el catálogo, en los dos temas, y que nadie escriba un hex a mano. Si un color
del catálogo se ve, se ve.

La regla de las islas (arriba) **no es un auditor de contraste**: no opina si un color se lee,
sólo exige que cada superficie diga qué es, para que la tinta correcta llegue sola.

---

## 3. El polo negativo es morado, no rojo

Lo que va hacia abajo en los datos se pinta con `--negativo` (purple-80), el morado de marca.
`--error` (red-80) **se reserva para un error real del sistema**.

El motivo es de lectura, no de gusto: un dato bajo no es una falla. Pintarlo de rojo le mete
al número un juicio que el estudio no midió. El verde y el morado dicen "sube / baja"; el
verde y el rojo dicen "bien / mal". Es la misma idea que gobierna el tono de los reportes de la
casa: se describe, no se reprueba.

---

## 4. Los dos temas

El reporte tiene **tema claro y tema oscuro**, y **el oscuro es el que abre**: el reporte y el
PDF salen en oscuro, y el claro es la opción (decisión de la casa, 2026-09, al cerrar el curso).
Una sola pieza de estado: el atributo `data-theme="oscuro"` en `<html>`, que el layout manda
puesto desde el servidor. Ausente, el reporte es claro.

**Los componentes no se enteran.** Consumen los mismos nombres de token y el atributo los
voltea. Por eso la regla del token por uso (sección 2) es lo que hace posible el tema.

### El papel oscuro es morado, no negro

El tema oscuro no es un gris de sistema: el papel se deriva de Violet 100 mezclado con negro
(`#140d2a` la página, `#201543` la tarjeta), para que el oscuro siga siendo de la marca. Es lo
único que no está literalmente en la guía, porque la guía no contempla tema oscuro. La tinta
sube a los pasos claros de Violet (10, 20, 40).

### La rampa ordinal cambia de escala

En claro es Violet, 100 → 20. En oscuro es **Purple, 20 → 100**: Violet sólo tiene tres pasos
que se lean sobre fondo hondo, y su paso 10 se veía blanco. **El extremo alto nunca es
blanco** (en oscuro es purple-20, un rosa lavanda) **y el extremo bajo nunca es el paso 10**
(sobre papel claro no se percibe). Cinco pasos útiles; un sexto peldaño va en neutro, fuera de
rampa.

### Las tres reglas que lo definen

**1. No sigue al sistema operativo.** El reporte arranca oscuro siempre y el lector lo cambia
con el botón o con la tecla `T`. Un entregable de cliente no cambia de cara según la
computadora del que lo abre.

**2. La elección se guarda y sobrevive a la recarga.** Un script mínimo en `<head>` la aplica
antes del primer pintado (`lib/tema.ts`): como el atributo ya viene puesto, lo único que hace
es quitarlo si el lector dejó guardado el claro. El PDF (`pnpm pdf`) sale en oscuro por la
misma razón, y acepta `--tema=claro`.

**3. Se revisa VIENDO los dos.** Un token que se ve bien en un tema puede haber roto el otro, y
sólo se nota viéndolo. Mientras se construye, quien lo ve es el operador, en su `pnpm dev` con
la tecla `T`. `pnpm fotos` retrata cada lámina en claro y en oscuro **una vez, al final, antes de
entregar**, o cuando el operador lo pide (decisión de la casa, 2026-09: fotografiar en cada
vuelta duplicaba la revisión del operador y era lo más caro del proceso).

---

## 5. Fondos de lámina, con su par

**Un color plano se lee como un vacío a escala de lámina completa.** Toda superficie de color
lleva dos luces radiales sobre una base angulada, y su grano.

| Clase | Qué es | Tema |
|---|---|---|
| `card-bg-primary` | violet-80 → violet-100, luz púrpura y turquesa. Portadas, separadores, láminas de peso | igual en los dos |
| `card-bg-secondary` | purple-80 → purple-100. El degradado insignia, para el quiebre de un acto | igual en los dos |
| `card-bg-marino` | turquoise-100 → violet-100. El Gradient Turquoise de la guía, sostenido oscuro | igual en los dos |
| `card-bg-ink` | violet-100 → morado profundo. El cierre | igual en los dos |
| `card-bg-surface` | blanco → violet-10 → violet-20. **Las láminas de datos** | par: violet-100 → tarjeta → página |
| `card-bg-surface-alt` | violet-10 → violet-20 con luz. El segundo tono claro, para dar ritmo | par: tarjeta secundaria oscura |

**El turquesa no es fondo de lámina.** La guía lo reserva a acentos; la clase `card-bg-turquoise`
se conserva por compatibilidad y pinta como `primary`.

**Sin lavanda-menta.** `card-bg-surface` llevaba radiales de morado y turquesa que teñían la
lámina: se veía bonito suelto y contaminaba todas las gráficas encima, que es donde el color
sí tiene que significar algo. Ahora es blanco a violet-10.

### Los fondos claros extremos están prohibidos

Una lámina casi blanca, sin degradado, sin grano y sin capa de ambiente **no es sobria: es una
lámina sin terminar**. Si una lámina va clara, va con la receta completa: `surface` con su
degradado, su grano y sus formas flotantes tenues.

**Y la variedad importa.** Un reporte donde las veinte láminas traen el mismo fondo se lee
como una plantilla rellenada. Los tonos se alternan siguiendo el argumento: los actos de color
para lo que carga peso, los claros para lo denso, y los cambios de tono marcan los quiebres.

### Los separadores de sección

Entre acto y acto va una lámina de transición: imagen a sangre, el nombre del acto encima, y
nada más. El componente es `SeparadorDeSeccion`, y **funciona sin foto**. Las imágenes las
busca y descarga Claude de bancos con licencia libre (Unsplash, Pexels) a `public/separadores/`
con su procedencia en `de-donde-salieron.json`. Nunca se enlazan desde fuera. **La foto va
siempre bajo el duotono morado**: una foto a color crudo mete al reporte una paleta que no es
la suya.

### El grano

Un SVG de ruido fractal embebido, al 5%, con `mix-blend-mode: overlay`. Es la diferencia entre
"degradado" y "diseñado". `StoryCardFrame` ya lo pone.

---

## 6. Superficies y neutrales

```css
/* claro */                         /* oscuro */
--page:      #f5f4f4  neutral-10    #140d2a  violet-100 al 45% sobre negro
--surface:   #ffffff                #201543
--surface-2: #e5e0f2  violet-10     #26194f
--ink:       #2d1d5d  violet-100    #e5e0f2  violet-10
--ink-2:     #656060  neutral-100   #ccc4e0  violet-20
--muted:     #656060  neutral-100   #a492c5  violet-40
--atenuado:  #908989  neutral-80    #908989  neutral-80
--pista:     #d5d1d1  neutral-40    violet-10 al 12%
--pista-2:   #bbb4b4  neutral-60    violet-10 al 22%
--border:    #d5d1d1  neutral-40    violet-10 al 12%
```

**El claro se corrigió en 2026-09.** Con `--muted` en neutral-80 las bases medían 2.0 a 2.7 de
contraste sobre las tarjetas, y con pista y borde en neutral-20 el carril medía 1.1: la barra
quedaba al aire. Se bajó cada uno un paso de la escala, sin inventar tonos. Y **lo atenuado tiene
su propio token**, gris en los dos temas: tomaba `--muted`, que en oscuro es violet-40, el mismo
paso que `--marca`, y la competencia salía del color de los estímulos.

**Nunca negro puro** ni gris arbitrario: el texto sale de Neutral (guía, regla 5) y la tinta
fuerte es Violet 100.

---

## 7. Tipografía

**Poppins para títulos. Hind para cuerpo.** Vía `next/font/google`, que las auto-hospeda.
No es Montserrat. No es Inter. Son estas dos.

Los kickers van en **mayúsculas, en el morado claro de la casa y con letra muy espaciada**
(`.kicker-marca`; sobre lámina de color, `.kicker-marca-claro`). La guía los pide en turquesa;
aquí van en morado desde 2026-09 (ver arriba, "El kicker y el destacado son morados").

### La escala fluida

Los tamaños crecen **de forma continua con el ancho de la ventana**, con `clamp`:

```
text-kicker · text-body · text-lead · text-h3 · text-h2 · text-h1 · text-hero
```

Con breakpoints, el tamaño se congelaba en 640px y en una pantalla de 27 pulgadas el reporte
se veía como un bloque de celular flotando en un mar de vacío. **Nada de `text-xs` ni de
tamaños en px** salvo en notas de fuente y marcas de significancia, que sí son chicas a propósito
y van en rem (`text-[0.6875rem]`, `text-[0.75rem]`) para que crezcan con la pantalla (ver `04`,
sección 8).

---

## 8. La marca

Los archivos oficiales viven en `public/brand/` (SVG, y PNG por si acaso), y la iconografía de
la guía en `public/iconos/`. Los componentes están en `components/marca/`:

- `LogoHorizontalPorTema` — el de la barra de arriba, montado dos veces (negro y blanco).
- `AtlantiaWordmark` — el lockup "Atlantia Insights", para portadas.
- `AtlantiaMark` — el glifo solo.
- `Iconos.tsx` — los íconos del dominio (Tabler, mismo estilo de trazo que la guía).

**Nunca la versión a color sobre fondo oscuro** (pierde la pierna morada del glifo), y **nunca
se recompone el logo con tipografía suelta**: es artwork.

---

## 9. Qué revisar antes de dar por buena una lámina

- ¿Cada color sale de un token del catálogo? `pnpm auditar:tokens` lo dice.
- ¿El texto de color usa la variante `-ink`?
- ¿Cada tarjeta, placa o botón con fondo fijo declara `data-superficie`?
- ¿Esto va sobre papel o sobre lámina de color? ¿Usé `rampaSobreOscuro` donde toca?
- ¿Se vio en oscuro? Durante la construcción, el operador en su `pnpm dev`; antes de entregar,
  `pnpm fotos -- --tema=oscuro`.
- ¿Los tamaños salen de la escala (`text-h2`, `text-body`) y no de un `text-[22px]`?
- ¿El fondo lleva su degradado y su grano, o es un blanco pelón?
