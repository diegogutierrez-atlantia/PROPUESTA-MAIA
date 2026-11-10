# 02 · Arquitectura

## El stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · pnpm. El mismo que la base de
reportes, para que lo que se aprenda en uno sirva en el otro y que una mejora del sistema visual
se pueda llevar de un lado al otro.

Sin librería de gráficas: lo poco que se dibuja (el mapa, los cronogramas, las barras de cuotas)
es SVG y CSS de la casa. Los íconos vienen de `lucide-react`.

## La decisión de fondo: la propuesta es un archivo de datos

Las primeras propuestas (2026-10) se armaron cada una desde cero sobre la base de reportes, y
cada una volvió a hacer las mismas piezas: cuatro cronogramas distintos, cinco tarjetas
económicas, los términos transcritos cinco veces. Una propuesta sigue un patrón; lo que cambia
es lo que dice, no cómo se dibuja. Por eso:

```
content/propuesta.ts   →   lib/propuesta/armar.tsx   →   components/propuesta/*   →   /propuesta
   (qué dice)                (qué componente, qué tono,       (cómo se dibuja
                              qué clave y qué nombre)          cada tipo)
```

- **`content/propuesta.ts`** es lo único que se llena. Su forma está en `lib/propuesta/tipos.ts`,
  y TypeScript revisa que esté completa (`pnpm check`).
- **`casa/`** guarda lo que es igual en todas las propuestas: términos, estándar, KPIs por
  solución, plantillas de cronograma, herramientas de MAIA, capturas del entregable y vendedores.
  La propuesta lo toma; no lo copia.
- **`lib/propuesta/armar.tsx`** decide lo que la propuesta no declara: qué componente dibuja cada
  tipo, sobre qué fondo, la numeración de las cortinillas y el nombre de cada lámina en el índice.
- **`components/propuesta/`** es el catálogo de láminas.

Las cuentas que se pueden equivocar se comprueban al armar: un total que no es la suma de sus
costos, un desglose que no cuadra o una plaza que no existe en el mapa no dejan que la lámina
se arme, con un mensaje que dice qué preguntarle al vendedor.

## Estructura de carpetas

```
frontend/
├── entradas/                el material del vendedor (no sube a git)
├── public/
│   ├── casa/                capturas del entregable, fotos de los vendedores
│   ├── cliente/             el logo del cliente de esta propuesta
│   ├── separadores/         las fotos de las cortinillas, con su procedencia
│   └── pdf/                 el PDF de la propuesta, cuando se genera
├── scripts/                 Node puro (.mjs): leer material, fotos, PDF, auditorías
└── src/
    ├── app/                 rutas delgadas: / manda a /propuesta
    ├── casa/                lo fijo de Atlantia
    ├── components/
    │   ├── propuesta/       el catálogo de láminas
    │   ├── story/           el recorrido: barra de arriba, puntos, índice, lámina
    │   ├── marca/ · ui/     logo de Atlantia, botones
    │   └── viz/             el mapa de México
    ├── content/             propuesta.ts
    ├── lib/propuesta/       tipos, armado y formato de cifras
    └── middleware.ts        la compuerta (liga con token)
```

## El recorrido es el de los reportes

`StoryShell`, la barra de arriba, los puntos por acto, el índice con su ojo para apagar láminas,
el modo oscuro que abre y la escala que crece con la pantalla vienen tal cual de la base de
reportes. El motivo de cada uno está en `03` y `04`.

## Sin consultas en vivo

La propuesta no consulta nada cuando alguien la abre: todo está en el código que se compiló.
Abre rápido, no tiene estado de "cargando" y es la misma mañana que la tarde. Cambiar algo
exige volver a publicar, y eso es bueno: lo que el prospecto vio es lo que se mandó.

## El PDF

`pnpm pdf` levanta la propuesta en su propio directorio, la recorre con Chrome y retrata cada
lámina en una hoja de su tamaño, con una capa de texto invisible para buscar y copiar. En papel
todo va desplegado: los grupos de KPIs, los términos y todos los cronogramas.
