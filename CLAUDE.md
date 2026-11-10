# Instrucciones para Claude

Este repo produce **propuestas comerciales de Atlantia**: la propuesta de investigación que el
equipo de ventas le manda a un prospecto, como una página online con la marca de la casa, en
lugar de una PowerPoint.

Lee este archivo completo antes de hacer nada. **Es la constitución, no el manual:** aquí va lo
que aplica siempre. Las reglas de cada tema viven en `.claude/rules/` y se cargan solas al abrir
un archivo de su carpeta (sección 8).

---

## 1. Quién te está hablando

Un **vendedor** de Atlantia. Sabe de su cliente, de lo que se le vendió y de lo que cuesta.
**De lo técnico no se entera de casi nada, y así debe quedarse.** Lo único que hace: hablarte,
dejar su material, tal cual lo tenga, en la carpeta `entradas` y abrir la liga que le das.

Todo lo demás lo haces tú, sin contárselo: instalar, revisar, levantar la propuesta, sacar el
PDF y publicar. **Nunca le pidas que corra un comando, que abra o edite un archivo de código,
ni que decida algo técnico.** Si algo truena, lo resuelves tú; si de verdad necesitas sus manos
(su correo, un permiso de su computadora), se lo pides en palabras de todos los días.

**Lo que nunca le enseñas:** comandos, rutas de archivos (salvo la carpeta `entradas`),
mensajes de error, nombres de componentes, git y nada del hosting.

### Cómo hablarle

- En español y en su idioma: "la lámina de precios", no "el componente `PropuestaEconomica`".
- Sin jerga: nada de "build", "props", "deploy", "commit". Si es inevitable, en palabras normales:
  "la subo a internet", "guardo la versión".
- Enseña lo que hiciste, no lo que vas a hacer. Corto.

---

## 2. La regla de oro

> **Las cifras son del vendedor. Los textos, si no los da, los propones tú. Lo de la casa no se
> pregunta.**

**Cifras** (muestras, semanas, precios, cuotas, número de SKUs, minutos del cuestionario): **ni
se inventan, ni se calculan, ni se leen de una imagen a ojo.** Si falta una, se pregunta. Si
faltan varias, se preguntan **todas juntas, en un solo mensaje**, para que la propuesta salga de
un jalón. Un precio mal no se ve mal: se ve perfecto y llega al cliente.

- **Los totales se copian, no se suman.** Si el total que dio el vendedor no es la suma de sus
  costos, la lámina no se arma y el error te lo dice: pregúntale si lleva descuento (entonces va
  `sinSumar` con su nota) o cuál de los dos números es el bueno.
- **Un porcentaje se escribe de 0 a 1** (`0.18`, no `18`) donde el formato lo pide (`porcentaje`
  en las cuotas).

**Textos** (título, bajada, retos, frase de cierre): si el vendedor los escribió, van **tal
cual**; sólo corriges una errata evidente, y se lo dices. Si los dejó en blanco, **los propones
tú** a partir de su brief, con tono de propuesta (claro, sin adjetivos de relleno), y al final le
dices cuáles redactaste para que los revise.

**Lo de la casa ya va solo y no se pregunta:** términos y condiciones, estándar de ejecución,
cortinillas, ejemplo del entregable, fases y consideraciones del timeline, KPIs de los estudios de
catálogo, láminas que explican un método, el cierre con la foto del vendedor. Vive en
`frontend/src/casa/` y **no se toca para una propuesta** (sección 5).

---

## 3. El flujo de una pasada

### Arrancar una propuesta nueva ("arranca una propuesta", la primera vez en este repo)

1. `cd frontend`, `pnpm install` si falta, y `pnpm verificar`. Si algo sale en rojo, lo
   arreglas tú o le dices al vendedor exactamente qué hacer.
2. Ábrele la carpeta `frontend/entradas` (en Windows: `start "" "frontend/entradas"`; en Mac:
   `open`). **No hay plantilla ni formulario que llenar** (decisión de dirección, 2026-11): el
   vendedor deja ahí su material tal cual lo tenga.
3. Dile en dos renglones qué sigue: dejar ahí el logo del cliente y lo que tenga (brief, PPT,
   correo, cotización, capturas, el Excel que use), y decirte "arma la propuesta".

### Armar ("arma la propuesta")

1. **Lee todo su material, venga como venga.** Un Excel con `pnpm material:excel` (lo vuelca a
   texto), una PPT con `pnpm material:ppt`, un PDF o una imagen directo. **No hay formato que
   seguir: lo interpretas tú.** Una cifra que sólo viene en una imagen se le confirma.
2. **Junta lo que falta y pregúntalo de una vez.** Sólo cifras y lo obligatorio (cliente,
   moneda, quién firma, muestras, precios). Lo demás, lo propones.
3. **Llena `frontend/src/content/propuesta.ts`.** Es lo ÚNICO que se escribe por propuesta.
   Los tipos de lámina y sus campos: `documentacion/catalogo-de-laminas.md` y
   `frontend/src/lib/propuesta/tipos.ts`. Lo de la casa se toma de `casa/` (`kpisDeLaCasa`,
   `cronogramaCuantitativo`…), no se copia.
4. **El logo** lo encuentras tú entre su material (una imagen con la marca del cliente) y lo
   copias a `frontend/public/cliente/`. Míralo y decide `fondo`: "placa" si es de color o trae
   fondo blanco; "directo" si es blanco o claro. Si no hay logo, la portada va sin él.
5. **Las fotos de las cortinillas** las buscas y descargas tú (Unsplash o Pexels), según el
   giro del cliente, a `frontend/public/separadores/`, y anotas su procedencia en
   `de-donde-salieron.json`. Está comprobado que se puede (sección 5).
6. `pnpm check`. Si truena por una cuenta que no cuadra, es una pregunta para el vendedor, no
   un error que se esconde.
7. **Levanta la propuesta** con `pnpm dev` (en segundo plano) y **ábresela tú** en su navegador
   (`start http://localhost:3000` en Windows, `open` en Mac).
8. **Un resumen corto:** cuántas láminas, qué tomaste de su material, qué textos redactaste tú
   y qué cifra falta, si falta alguna.

### Ajustar

El vendedor pide cambios en palabras ("cámbiale el título", "quita la segunda opción"). Los haces
en `propuesta.ts` y recarga solo. **No itera diseño:** si pide algo que el catálogo no tiene, ve
la sección 5.

### Sacar el PDF ("sácame el PDF")

`pnpm pdf`. Sale una hoja por lámina. En pantalla ya nada se despliega, así que el PDF trae lo
mismo que la liga.
**Ábreselo tú** (`start "" "<ruta>"` en Windows, `open` en Mac) y dile que ya está.

### Publicar ("publícala") → sección 6.

---

## 4. Qué decide quién

| Lo decide el vendedor | Lo decides tú, y avisas |
|---|---|
| Cifras, precios, opciones, estudios | Qué tipo de lámina usar para lo que dio |
| Qué se dice del cliente y de su reto | Íconos, orden dentro de un acto, fotos de cortinilla |
| Qué entra y qué no en la propuesta | Cómo se acomoda el contenido en el catálogo |
| Cuándo se publica | Si el logo va en placa o directo |

**El orden y el alcance de la propuesta son del vendedor.** Quitar una sección o un estudio no
es una decisión de ejecución, aunque te parezca que sobra.

---

## 5. Lo no negociable

- **Nunca uses nada de otra propuesta.** Ni un texto, ni una cifra, ni un archivo de otro
  cliente, y no lo busques en otras carpetas. Si el vendedor te pasa una propuesta vieja como
  referencia, tomas la estructura, nunca los datos. Ya pasó en otro proyecto que un Claude citó
  un resultado de otro cliente: en una propuesta eso es un precio ajeno frente al prospecto.
- **`casa/` no se toca para una propuesta.** Si el vendedor pide cambiar los términos, el
  estándar o un KPI de catálogo para todos, eso es de operaciones: díselo. Si es sólo para esta
  propuesta, se ajusta en `propuesta.ts` (los KPIs que no van, la duración del cuestionario).
  **Los términos y condiciones no se editan nunca desde una propuesta**: son texto legal y su
  fuente es el PDF de `documentacion/propuesta/`.
- **Una lámina fuera del catálogo no es el camino normal.** Si el vendedor pide algo que ningún
  tipo resuelve, dile qué tipo se le acerca. Si insiste, se puede construir, pero avisa que
  operaciones debe revisarla para subirla a la base y que todas las propuestas la tengan.
- **Nada de notas en la lámina.** Lo que el vendedor deba saber se lo dices en la conversación.
  Una lámina con una advertencia encima se ve a medio hacer frente al cliente.
- **Las credenciales no van al código, al chat ni a un commit.**
- **No corras `build` mientras se trabaja:** pelea con el `pnpm dev`. Para verificar basta
  `pnpm check`. **No dejes servidores vivos** al terminar.
- **Todo va a `main`.** Sin ramas ni pull requests.

### No declares que no puedes sin haberlo intentado

Antes de decir "no puedo", pruébalo: una frase, un comando, y ya sabes. Está comprobado que
puedes descargar fotos de Unsplash y Pexels y guardarlas en el repo. Si de verdad algo no se
puede, dilo **después** de intentarlo y di qué falló.

---

## 6. Publicar: lo haces tú, con su sí

Tú haces la publicación, pero **sólo cuando el vendedor la pide** ("publícala", "súbela") y
**nunca por iniciativa propia**. En reportes esto lo hace una persona; en propuestas se decidió
así para que el vendedor no tenga que aprender git (2026-10). La frontera de "nada se publica
solo" es su palabra.

1. **Antes, un resumen**: cliente, número de láminas, y por cada opción su muestra y su total
   con moneda. Pregunta: "¿La publico así?".
2. **Con su sí:** si pidió PDF, `pnpm pdf` primero. Luego `git add -A`, un commit que diga qué
   propuesta es, y `git push` a `main`.
3. **Si git pide nombre o correo**, pregúntaselos y configúralos.
4. **Después del push, le dices que quedó publicada.** Y nada más: el hosting, sus llaves y la
   liga con su token los administra otro equipo. **Al vendedor nunca se le pregunta ni se le
   pide nada del hosting**, ni siquiera que lo pida a alguien.

`entradas/` no sube nunca (es material del cliente) y `.env.local` tampoco: el `.gitignore`
ya lo cuida.

---

## 7. Dónde vive cada cosa

```
documentacion/
├── propuesta/               el PDF de términos (la fuente legal)
├── catalogo-de-laminas.md   los tipos de lámina: para qué es cada uno y qué pide
└── 01…13                    el método y el sistema visual
frontend/
├── entradas/                el material del vendedor (no sube)
├── public/
│   ├── cliente/             el logo del cliente
│   ├── separadores/         las fotos de las cortinillas, con su procedencia
│   └── casa/                capturas del entregable y fotos de los vendedores
├── scripts/                 material:excel, material:ppt, fotos, pdf, verificar
└── src/
    ├── content/propuesta.ts LA PROPUESTA: lo único que se llena
    ├── casa/                lo que es igual en todas: términos, estándar, KPIs, cronogramas, MAIA, vendedores
    ├── components/propuesta/ el catálogo de láminas
    └── lib/propuesta/       tipos.ts (la forma) y armar.tsx (de datos a láminas)
```

---

## 8. Las reglas que se cargan solas

Viven en `.claude/rules/`. Claude Code carga cada una en cuanto se abre un archivo de su
carpeta. Si vas a trabajar un tema sin haber abierto nada de él, ábrela tú.

| Regla | Qué trae | Se carga al abrir |
|---|---|---|
| `contenido-y-catalogo.md` | cómo se llena la propuesta, cifras, textos, lo de la casa | `src/content/`, `src/casa/`, `src/lib/propuesta/`, `src/components/propuesta/` |
| `laminas-y-visual.md` | el sistema visual de la casa | `src/components/`, `src/app/`, `public/` |
| `entrega-y-seguridad.md` | la compuerta del token, el PDF, publicar | `.env*`, `middleware.ts`, `11`, `13` |

---

## 9. Qué leer, y cuándo

Los documentos de `documentacion/` no se cargan solos: hay que abrirlos de verdad. Contestar de
memoria sobre un documento que no abriste es la manera más rápida de inventar una regla.

| Antes de… | Lee |
|---|---|
| Llenar la primera propuesta de la sesión | `catalogo-de-laminas.md` y `01` |
| Tocar un color, un componente o una lámina nueva | `03`, `04` |
| Publicar | `13` y `11` |
| Si algo truena | `cuando-algo-truena.md` |

Y antes de cambiar algo que ya funcionaba, busca su comentario: casi toda rareza de este código
tiene su motivo escrito al lado.
