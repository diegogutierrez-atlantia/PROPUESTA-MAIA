# Propuestas base

La base de la que sale cualquier **propuesta de investigación** de Atlantia: la que ventas le
manda a un prospecto como página online, con la marca de la casa, en lugar de una PowerPoint.

**Esto es una plantilla.** Cada propuesta es una copia de este repo.

---

## Para el vendedor: lo mínimo

Primera vez: los pasos para preparar la computadora están en
[`documentacion/capacitacion.md`](documentacion/capacitacion.md).

Con la carpeta de tu propuesta abierta en VS Code y Claude abierto:

1. Dile: **«Arranca una propuesta nueva»**. Te abre la carpeta donde va tu material.
2. Deja ahí, tal cual lo tengas, el logo del cliente y tu brief, PPT, correo, cotización o
   capturas. No hay nada que llenar.
3. Dile: **«Arma la propuesta»**. Te pregunta lo que falte y te da la liga para verla.
4. Pide cambios con palabras. **«Sácame el PDF»** si lo necesitas.
5. **«Publícala»**: te enseña un resumen y, con tu sí, la sube.

Lo demás lo hace Claude, y no tienes que enterarte. Ideas de qué decirle:
[`documentacion/recetario-de-prompts.md`](documentacion/recetario-de-prompts.md). Si algo no
funciona, díselo a Claude con tus palabras.

**Lo que no llenas porque ya va solo:** términos y condiciones, estándar de ejecución,
cortinillas, ejemplo del entregable, fases del timeline, KPIs de los estudios de la casa y el
cierre con tu foto.

---

## Qué hay aquí

| | |
|---|---|
| `CLAUDE.md` | Las instrucciones de Claude. Las lee solo |
| `documentacion/` | El método, el catálogo de láminas y el PDF de términos |
| `frontend/src/content/propuesta.ts` | **La propuesta.** Lo único que cambia de una a otra |
| `frontend/src/casa/` | Lo que es igual en todas: términos, estándar, KPIs, cronogramas, MAIA, vendedores |
| `frontend/src/components/propuesta/` | El catálogo de láminas |
| `frontend/entradas/` | El material del vendedor. No sube a GitHub |

## Los comandos (los corre Claude)

| Comando | Qué hace |
|---|---|
| `pnpm verificar` | Revisa que la computadora esté lista |
| `pnpm dev` | Levanta la propuesta en `localhost:3000` |
| `pnpm check` | Revisa que la propuesta esté completa y que sus cuentas cuadren |
| `pnpm material:excel` | Vuelca a texto un Excel que traiga el vendedor |
| `pnpm material:ppt` | Vuelca a texto una presentación |
| `pnpm pdf` | Genera el PDF, una hoja por lámina |
| `pnpm fotos` | Retrata cada lámina (para revisar un componente del catálogo) |
| `pnpm auditar:tokens` | Revisa que todo color salga del catálogo de la casa |

---

## Para el equipo: preparar y mantener

- **Una propuesta nueva:** en GitHub, **Use this template** sobre este repo, con el nombre
  `Propuesta_Cliente_Folio`, y se le entrega al vendedor la carpeta lista para abrir.
- **Una lámina nueva para todas las propuestas:** se declara en `lib/propuesta/tipos.ts`, se
  dibuja en `components/propuesta/`, se arma en `lib/propuesta/armar.tsx` y se documenta en
  `documentacion/catalogo-de-laminas.md`.
- **Un cambio de la casa** (términos, estándar, KPIs, cronogramas, precios de MAIA): en
  `frontend/src/casa/`. Los términos sólo cambian si cambia su PDF.
- **Un vendedor nuevo:** en `casa/vendedores.ts`, con su foto en `public/casa/vendedores/`.
- **Publicar una propuesta por primera vez:** conectar su repo al hosting con `AUTH_MODE=token`,
  `ACCESS_TOKEN` y `SESSION_SECRET` (ver `frontend/.env.example` y `documentacion/11`).

**La regla que manda:** la base no lleva nada de ningún cliente. Ni ejemplos, ni logos, ni fotos,
ni su nombre en un comentario. Lo que es de un cliente vive en la copia de su propuesta.
