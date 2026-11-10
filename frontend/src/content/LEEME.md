# content/

`propuesta.ts` es **lo único que se llena en cada propuesta**: qué dice cada lámina, en datos.
Cómo se dibuja cada tipo de lámina lo sabe `components/propuesta/`, y lo que es igual en todas
las propuestas vive en `casa/`.

En la base va en `null`, a propósito: aquí no vive la propuesta de ningún cliente, ni como
ejemplo. Los tipos de lámina y sus campos están en `lib/propuesta/tipos.ts` y, explicados, en
`documentacion/catalogo-de-laminas.md`.
