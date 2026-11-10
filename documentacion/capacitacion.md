# Capacitación: propuestas con Claude

Para la sesión con el equipo de ventas. La parte 1 se hace una sola vez por computadora; de la
parte 2 en adelante es el día a día. El vendedor no corre comandos ni abre código: instala tres
programas, abre su carpeta y le habla a Claude.

---

## Antes de la sesión (quien capacita)

- [ ] Cada vendedor tiene **cuenta de Claude** de Atlantia y **cuenta de GitHub** con acceso a
      `AtlantiaSoftware`.
- [ ] Cada vendedor está dado de alta en `frontend/src/casa/vendedores.ts`, con su foto en
      `frontend/public/casa/vendedores/`. Sin eso, el cierre de la propuesta no tiene a quién firmar.
- [ ] Ya están arriba los últimos cambios de la base: láminas sin desplegables, KPIs de Packaging
      Concept Test y el flujo sin plantilla.
- [ ] Hay una carpeta de prueba con material ficticio (un brief corto, un logo inventado y una
      cotización con cifras de juguete) para practicar. **Nada de un cliente real.**

---

## 1. Preparar la computadora (una sola vez, unos 20 minutos)

### 1.1 Instalar tres programas

Todo con las opciones que vienen por default: siguiente, siguiente, instalar.

| Programa | Dónde | Para qué |
|---|---|---|
| **VS Code** | code.visualstudio.com | Donde se abre la carpeta y vive Claude |
| **Node.js (versión LTS)** | nodejs.org | Lo que hace funcionar la propuesta en tu computadora |
| **Git** | git-scm.com | Para bajar la carpeta y subir la propuesta |

En Mac, si al usar Git aparece un aviso de "herramientas de línea de comandos", se acepta y
se espera a que termine.

**Después de instalarlos, reinicia la computadora.** Así VS Code los encuentra.

### 1.2 Poner a Claude en VS Code

1. Abre VS Code, ve a **Extensiones** (el ícono de los cuadritos, a la izquierda).
2. Busca **Claude Code** (de Anthropic) e instálala.
3. Ábrela con el ícono de Claude y **entra con tu cuenta de Atlantia**.

### 1.3 Bajar la carpeta de propuestas

1. En VS Code: **Archivo → Nueva ventana**. En la pantalla de bienvenida, **Clonar repositorio
   de Git**.
2. Si lo pide, entra con tu cuenta de GitHub.
3. Pega la dirección que te dé el equipo. Para la base es
   `https://github.com/AtlantiaSoftware/propuestas_ventas`; para una propuesta, la de su copia.
4. Elige dónde guardarla (por ejemplo, Documentos) y dile **Abrir** cuando termine.

### 1.4 Primera vez con Claude

Con la carpeta abierta, abre Claude y escríbele:

> Arranca una propuesta nueva.

Claude revisa la computadora y termina de instalar lo que falte. Si te pide tu nombre y tu
correo para guardar versiones, dáselos. Al final te abre la carpeta **`entradas`**. Con eso,
la computadora queda lista.

Si algo sale mal, no hay que entender el error: se le dice a Claude "no funcionó" y él lo
arregla o te dice qué hacer en palabras normales.

---

## 2. Hacer una propuesta (el día a día)

### Paso 1 · Dejar el material en `entradas`

Lo que tengas, **tal cual**. No hay formato ni plantilla:

- El **logo** del cliente (una imagen).
- El **brief**, el correo del cliente, la PPT, un PDF, capturas de pantalla.
- Tu **cotización** o el Excel con el que trabajas.

Mientras más traigas, menos te pregunta. Esta carpeta **nunca se sube a internet**: el
material del cliente se queda en tu computadora.

### Paso 2 · Pedir que la arme

> Arma la propuesta.

Claude lee todo y te hace **una sola lista** con lo que falte. Casi siempre son cifras:

- Cliente, moneda y quién firma.
- Muestra por estudio, semanas de cada etapa.
- Precios y total de cada opción.

**Las cifras no se inventan.** Si una sólo viene en una captura, Claude te la confirma antes de
usarla. Si el total no es la suma de los costos, te pregunta si lleva descuento.

Los **textos** que no traigas (título, retos, frase de cierre) los redacta él y te dice cuáles
fueron, para que los revises.

Al final te abre la propuesta en tu navegador.

### Paso 3 · Revisar y pedir cambios con palabras

Como lo dirías en una junta:

> Cámbiale el título por "…".
> Quita la segunda opción.
> El levantamiento son 4 semanas, no 6.
> Quita los KPIs de arquetipo de marca.

La página se actualiza sola.

### Paso 4 · El PDF (si lo necesitas)

> Sácame el PDF.

Sale una hoja por lámina, con lo mismo que se ve en pantalla, y te lo abre.

### Paso 5 · Publicar

> Publícala.

Claude te enseña un resumen (cliente, número de láminas y, por opción, muestra y total) y te
pregunta **"¿La publico así?"**. Sólo con tu sí la sube. Nada se publica solo.

---

## 3. Lo que ya va solo (no se pregunta ni se llena)

Términos y condiciones, estándar de ejecución, cortinillas con foto, ejemplo del entregable,
fases del timeline, KPIs de los estudios de la casa (U&A, Brand Awareness, P&POSS, NPS,
Packaging Concept Test), las láminas que explican cada método y el cierre con tu foto.

**Los términos y condiciones no se cambian desde una propuesta.** Son texto legal. Si un cliente
pide algo distinto, se habla con operaciones.

---

## 4. Cómo se ve la propuesta

- **Todo a la vista.** No hay nada que abrir ni desplegar. Lo que no cabe en una pantalla pasa a
  la lámina siguiente (por ejemplo, los términos ocupan cuatro).
- **Pantalla completa a lo ancho**, en computadora, y se lee bien en celular.
- **La marca es Atlantia.** El cliente aparece con su logo en la portada.

---

## 5. Reglas que no se rompen

1. **Nada de otra propuesta.** Ni un texto, ni un precio, ni un archivo de otro cliente. Si
   usas una propuesta vieja como referencia, díselo a Claude: toma la estructura, nunca los datos.
2. **Las cifras son tuyas.** Claude no calcula ni adivina un precio.
3. **No se publica sin tu sí.**
4. **Las contraseñas y llaves no se escriben en el chat.**
5. Si pides algo que el catálogo de láminas no tiene, Claude te dice qué lámina se acerca. Una
   lámina nueva la revisa operaciones.

---

## 6. Si algo no funciona

| Pasa esto | Haz esto |
|---|---|
| Claude dice que no puede | Pídele que lo intente. Casi siempre sí puede. |
| Pregunta algo que ya estaba en tu material | Dile en qué archivo y en qué parte está. |
| Se pone a cambiar el diseño | Dile que se quede en el contenido. |
| La página no abre | Dile "no abre la propuesta" y él la levanta de nuevo. |
| Cualquier otra cosa | Díselo con tus palabras. No hace falta copiar el error. |

Más frases de ejemplo: [`recetario-de-prompts.md`](recetario-de-prompts.md).

---

## Guion sugerido para la sesión (1 hora)

| Min | Qué |
|---|---|
| 0–20 | Parte 1 en vivo, cada quien en su computadora. Quien termine, ayuda al de al lado. |
| 20–25 | Explicar la regla de oro: las cifras son del vendedor; los textos, si faltan, los propone Claude. |
| 25–45 | Práctica: dejar el material de prueba en `entradas`, "arma la propuesta", contestar sus preguntas y pedir dos cambios. |
| 45–50 | "Sácame el PDF". |
| 50–60 | Enseñar el paso de publicar **sin decir que sí**, y preguntas. |
