# 13 · Checklist antes de publicar

Una hoja. Claude la corre completa antes de publicar, y le dice al vendedor lo que no pasó.

---

## Cifras

- [ ] Toda cifra salió del vendedor (su material o su respuesta): ninguna se calculó,
      se supuso ni se leyó de una imagen.
- [ ] Cada total de la propuesta económica es la suma de sus costos, o va marcado como precio
      con descuento con su nota. (`pnpm check` lo comprueba.)
- [ ] La moneda de la ficha es la de la cotización (MXN lleva "+ IVA" en cada monto).
- [ ] Las muestras de la portada, del perfil y de la propuesta económica dicen lo mismo.
- [ ] Las semanas del timeline son las que dio el vendedor.

## Contenido

- [ ] Ficha completa: cliente, rótulo de la barra, mes y año, moneda y quién firma.
- [ ] Los textos que redactó Claude se le enseñaron al vendedor y los aprobó.
- [ ] Ninguna lámina lleva notas de trabajo, "pendiente", "por confirmar" ni texto de prueba.
- [ ] Nada de otro cliente: ningún texto, cifra, logo ni foto que no sea de esta propuesta.
- [ ] Los términos y condiciones son la lámina de la casa (`terminos`), sin cambios.
- [ ] Las fotos de las cortinillas tienen su procedencia en `de-donde-salieron.json`.

## Visual

- [ ] El logo del cliente se ve bien en la portada (placa o directo, según el logo).
- [ ] El vendedor recorrió la propuesta en su `localhost:3000`, en oscuro y en claro (tecla `T`).
- [ ] Si se tocó un componente: `pnpm auditar:tokens` limpio y `pnpm fotos` sin textos
      encimados.

## PDF

- [ ] Si el vendedor lo pidió: `pnpm pdf` corrió sobre la versión final, tiene una hoja por
      lámina, y los KPIs, los términos y los cronogramas salen desplegados.

## Publicar

- [ ] El vendedor vio el resumen (cliente, láminas, muestra y total de cada opción) y dijo que sí.
- [ ] `pnpm check` limpio.
- [ ] Nada de `entradas/` ni `.env.local` en el commit.

El hosting (conectar el repo, sus llaves, probar la liga con y sin token) no está en esta lista:
lo hace el equipo que administra las publicaciones, y al vendedor no se le pregunta.
