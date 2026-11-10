# Cuando algo truena

**Para Claude y para el equipo, no para el vendedor.** El vendedor no se entera de casi nada
técnico: si algo no funciona, se lo dice a Claude con sus palabras, y Claude lo resuelve. Al
vendedor sólo se le dice, en una línea y sin jerga, qué pasó y qué sigue. Si hacen falta sus
manos (un permiso de su computadora, su correo), se le pide en palabras de todos los días.

---

## Al arrancar

**"pnpm no se reconoce" o "node no se reconoce".** Falta instalar Node.js (versión LTS, de
nodejs.org) o la terminal no se ha enterado. Cerrar VS Code por completo y abrirlo otra vez. Si
sigue, reinstalar Node con la opción de agregar al PATH.

**"No tienes permisos" al instalar.** Es la computadora, no la persona: va con TI.

**El antivirus borra archivos de `node_modules`.** Pedirle a TI que agregue la carpeta del
proyecto a sus excepciones.

**`pnpm install` se queda colgado.** Casi siempre es la red de la oficina. Probar con otra
conexión (el celular sirve para descartar).

## Al ver la propuesta

**`localhost:3000` no abre.** El servidor no está prendido o se apagó. Claude lo vuelve a
levantar (`pnpm dev`).

**"El puerto 3000 ya está en uso".** Quedó un servidor de antes. Claude lo apaga y levanta uno
nuevo.

**La página dice "Todavía no hay propuesta".** `content/propuesta.ts` sigue vacío: falta decirle
a Claude "arma la propuesta".

**Un cambio no se ve.** Recargar la página. Si sigue igual, es el caché del servidor: Claude lo
reinicia.

## Al armar

**"No cuadra: los costos suman X y el total dice Y".** No es una falla del sistema: es una
pregunta para el vendedor. ¿El total lleva descuento? ¿Cuál de los dos números es el bueno?

**"La plaza dice estado …, que no está en el mapa".** El estado se escribe con su nombre común:
"Ciudad de México", "Nuevo León", "México" (para el Estado de México).

**"No hay un vendedor … en casa/vendedores.ts".** El vendedor que firma no está dado de alta.
Claude lo agrega con su nombre, su puesto y su foto (en `public/casa/vendedores/`).

## Al publicar

**Git pide nombre o correo.** Claude se los pregunta al vendedor y los configura.

**El push falla por permisos.** La cuenta de GitHub del vendedor no tiene acceso al repo: hay
que pedir que la den de alta en la organización.

**La liga no abre.** Avisar a quien la mandó. El hosting no se revisa desde aquí ni se le
pregunta nada de él al vendedor.

**La liga abre pero pide "la liga completa".** Se abrió sin el `?token=…` del final: hay que
mandar la liga entera.

## Con Claude

**Claude dice que no puede algo.** Pedirle que lo intente antes de darlo por hecho: muchas
veces sí puede (bajar fotos, leer un PDF, abrir el Excel).

**Claude pregunta algo que ya estaba en el material.** Decirle en qué archivo y en qué parte
está.

**Claude se pone a cambiar el diseño.** No es lo normal: el catálogo ya resuelve cómo se ve
cada lámina. Decirle que se quede en el contenido.
