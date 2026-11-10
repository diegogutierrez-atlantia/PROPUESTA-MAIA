---
paths:
  - "frontend/.env*"
  - "frontend/src/middleware.ts"
  - "documentacion/11-*"
  - "documentacion/13-*"
---

# Entrega y seguridad

> Se carga sola al abrir las variables de entorno, la compuerta o los documentos `11` y `13`.
> El motivo largo de la compuerta está en `11`; la lista antes de publicar, en `13`.

## La compuerta

- **Una propuesta se publica con liga de token** (`AUTH_MODE=token`, `ACCESS_TOKEN` y
  `SESSION_SECRET` en el hosting). Quien la recibe todavía no es cliente y no tiene cuenta en
  MAIA. Sin esas variables, la compuerta **cierra**: un despliegue al que se le olvidó una llave
  deja a todos afuera, no a todos adentro.
- **En la computadora del vendedor no hace falta ninguna llave:** `pnpm dev` abre la propuesta
  sin compuerta.
- **Un token por propuesta.** Si una liga se reenvía de más, se rota el token de esa propuesta
  sin tocar las demás.
- Las credenciales no van al código, al chat ni a un commit. `.env.local` no sube.

## Publicar

- **Lo haces tú, sólo cuando el vendedor lo pide**, después de enseñarle el resumen (cliente,
  láminas, muestra y total de cada opción) y con su sí. Nunca por iniciativa propia.
- Antes del push, si pidió PDF: `pnpm pdf`. El PDF sale con todo desplegado (KPIs, términos,
  cronogramas) y queda en `public/pdf/`, de donde lo toma el botón de la barra.
- `git add -A`, commit, `git push` a `main`. `entradas/` no sube (es material del cliente).
- **El hosting no es asunto del vendedor.** Conectar el repo, poner sus llaves y entregar la liga
  lo hace otro equipo. Al vendedor nunca se le pregunta ni se le pide nada de eso: después del
  push, le dices que quedó publicada.
