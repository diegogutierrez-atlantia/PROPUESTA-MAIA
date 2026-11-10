# 06 · Movimiento

> **Viene de la base de reportes y aplica igual a las propuestas:** es el mismo sistema visual y
> el mismo recorrido. Donde dice *reporte*, léase también *propuesta*; donde dice *operador*,
> en propuestas es el *vendedor*. Las historias que cuenta son de reportes reales, y por eso
> se quedan como están.

## La regla

**Se anima la entrada, nunca el dato.**

El movimiento sirve para que el ojo llegue en orden a una lámina densa. En cuanto la lámina
está quieta, el movimiento se acabó. Nada parpadea, nada pulsa, nada llama la atención en
bucle mientras alguien lee.

Corolario: **ninguna información puede depender del movimiento**. Si apagas todas las
animaciones, el reporte dice exactamente lo mismo. Eso no es una cortesía de accesibilidad,
es la prueba de que la animación es decoración.

---

## Las de la casa

Viven en `globals.css` y se usan como clases.

### Lo primero: el movimiento va atado al SCROLL, no a un temporizador

En el recorrido vertical **todas las láminas existen desde el primer cuadro**. Una animación
que arranca al montar el componente se dispara treinta veces a la vez, fuera de pantalla, y
cuando el lector llega ya pasó todo.

Por eso el shell marca `.a-la-vista` en la sección cuando entra al viewport, y **toda animación
de entrada cuelga de esa clase**:

```css
.a-la-vista .stagger > * { animation: rise-in 0.5s ... ; }
```

Y si esa marca nunca llega —porque el observador no corre, o el navegador no lo soporta— el
elemento se queda **en su estado final**, que es el correcto. Nunca se queda invisible: una
animación que falla tiene que fallar hacia "se ve", no hacia "no está".

### Lo que se retiró: la animación de entrada de lámina

Hubo una, `card-enter`: la lámina entraba con un desvanecido y una subida corta, para que
navegar se leyera como un corte entre tomas.

Funcionaba **cuando el reporte era una pila de diapositivas** y sólo una lámina existía a la
vez. Con el recorrido vertical el paso de una lámina a la siguiente ya no es un corte, es un
desplazamiento, y las dos láminas se mueven juntas mientras dura: la animación deformaba la
lámina al mismo tiempo que el scroll la subía, las dos transformaciones se peleaban, y lo que
se veía era un temblor.

**No la reintroduzcas.** Si algún día hace falta un efecto de transición, tiene que ir atado al
avance del scroll y no a un temporizador.

### `.stagger` — el revelado escalonado

Los hijos de un contenedor entran en secuencia, no todos de golpe:

```css
.stagger > * { animation: rise-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
.stagger > *:nth-child(1) { animation-delay: 0.04s; }
/* ... 40ms por hijo ... */
.stagger > *:nth-child(n + 10) { animation-delay: 0.4s; }
```

Es lo que hace que un bloque denso se lea como algo **compuesto** en vez de volcado. El tope
en el hijo 10 no es pereza: sin él, una lista de treinta elementos tardaría más de un segundo
en terminar de aparecer y el usuario ya se fue.

### `.grow-bar` — las barras que se miden

```css
.grow-bar { transform-origin: left center; animation: grow-x 0.7s cubic-bezier(0.16,1,0.3,1) both; }
```

Las barras crecen desde cero. El valor se lee como **medido** y el ojo recorre el largo en vez
de encontrárselo ya puesto. Es la única animación que toca una marca de datos, y es aceptable
porque sólo ocurre a la entrada y termina en el valor correcto.

### Elementos flotantes de ambiente

Formas que caen o flotan de fondo, con desplazamiento y rotación, opacidad baja, en bucle
lento. Van **detrás** del contenido y con `pointer-events: none`. Es lo único que se repite en
bucle, y por eso es lo primero que se apaga.

### Piezas que giran

Un elemento decorativo que gira lento (14s por vuelta, lineal). Igual que el anterior: es
decoración, nunca información.

---

## `prefers-reduced-motion`, sin excepciones

**Toda** animación de la casa lleva su bloque:

```css
@media (prefers-reduced-motion: reduce) {
  .a-la-vista .stagger > *, .grow-bar, .acetato-gira { animation: none; }
}
```

Y las de bucle no sólo se detienen: se dejan en un estado quieto que sí se ve bien.

```css
@media (prefers-reduced-motion: reduce) {
  .note-fall { animation: none; opacity: 0.12; transform: none; }
}
```

Si al desactivarlas una lámina se rompe o se queda invisible, la animación estaba cargando
información. Arréglalo ahí, no en el media query.

---

## La curva

`cubic-bezier(0.16, 1, 0.3, 1)` para todo lo que entra. Sale rápido y frena largo: es la
curva que se siente "de producto terminado" en vez de "de transición por defecto".

Duraciones: **0.4s** para una lámina completa, **0.5s** para un elemento de lista, **0.7s**
para una barra que crece. Nada por encima de un segundo, salvo el ambiente de fondo.

---

## Lo que no se hace

- Nada que se mueva mientras alguien lee.
- Nada de spinners ni estados de carga: el reporte no carga nada (ver `02`).
- Nada de scroll-jacking ni de animaciones atadas al scroll.
- Nada de transiciones que reordenen datos en pantalla: si el ranking cambia, el lector no
  puede seguir la pieza que le interesa.
- Nada de `transition: all`.
