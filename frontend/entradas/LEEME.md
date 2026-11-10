# entradas/

Aquí deja el vendedor su material. Nada de esta carpeta sube a GitHub: es material del
cliente (salvo estos LEEME).

| Qué | Dónde |
|---|---|
| La plantilla llena | `propuesta.xlsx` (Claude la copia aquí al arrancar, desde `documentacion/propuesta/`) |
| El logo del cliente | aquí mismo: Claude lo reconoce entre lo demás |
| El brief, una PPT, un PDF, un correo, notas | aquí mismo, sueltos |

Claude lo lee así:

- **El Excel:** `pnpm material:excel`. Lo vuelca a texto, celda por celda, y lo interpreta
  conversando. No hay un lector rígido: si el vendedor agregó renglones o escribió donde no
  era, se lee igual.
- **Una PPT:** `pnpm material:ppt`.
- **Un PDF, una imagen o un texto:** directo.

Si algo no se entiende, Claude pregunta. Las cifras (muestras, semanas, precios) nunca se
deducen de una imagen ni se inventan: se le preguntan al vendedor.
