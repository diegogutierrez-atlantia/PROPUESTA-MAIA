# Tipografía — Atlantia

> La dupla tipográfica de la marca y su escala. Fuente: Guía de marca de Atlantia en GAIA (`/brand-guidelines`).

---

## 1. Las dos familias

| Familia | Rol | Uso | Dónde conseguirla |
|---|---|---|---|
| **Poppins** | Encabezados | Titulares cortos, nombres de sección, cifras destacadas | Google Fonts |
| **Hind** | Texto | Párrafos, interfaces, etiquetas y todo lo que se lee de corrido | Google Fonts |

Ambas son sans-serif geométricas, modernas y atemporales. **Nunca** se usan
serifas ni tipografías decorativas, y no se sustituyen por Arial o Helvetica en
piezas de marca. La única excepción son los correos electrónicos, donde Arial es
el respaldo obligado porque las webfonts no cargan.

---

## 2. Pesos

| Peso | Valor CSS |
|---|---|
| Light | 300 |
| Regular | 400 |
| Medium | 500 |
| Semibold | 600 |
| Bold | 700 |

Los titulares viven entre 600 y 700; el texto corrido, en 400. El 300 es para
cifras grandes y nada más.

---

## 3. Escala tipográfica

| Nivel | Familia | Tamaño | Peso | Interlineado | Tracking | Notas |
|---|---|---|---|---|---|---|
| **Display** | Poppins | 60 px | 700 | 1.05 | -0.02em | Solo una vez por pieza: la portada o el titular de apertura |
| **Heading 1** | Poppins | 38 px | 600 | 1.15 | — | Título de sección |
| **Heading 2** | Poppins | 24 px | 600 | 1.25 | — | Subtítulo dentro de una sección |
| **Body** | Hind | 16 px | 400 | 1.65 | — | Texto corrido. El interlineado amplio es parte del estilo |
| **Caption** | Hind | 12 px | 500 | — | 0.12em | Etiquetas y pies. Va en MAYÚSCULAS |

---

## 4. Reglas tipográficas

1. Encabezados cortos en Poppins. Si un titular pasa de dos líneas, va un nivel
   más abajo de la escala.
2. Los titulares principales van en Violet `#482F91` sobre claro, o
   en blanco sobre oscuro.
3. Las etiquetas pequeñas (los kickers sobre cada título) van en MAYÚSCULAS, en
   Turquoise `#04D1CD` y con tracking amplio, entre 0.2 y 0.3em.
4. El cuerpo de texto va en gris de la escala Neutral, nunca en negro puro.
5. No se usan tamaños fuera de la escala: si algo queda entre dos niveles, se
   elige uno.

---

## 5. Implementación

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Hind:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
.display {
  font-family: Poppins, sans-serif;
  font-size: 60px;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.heading-1 {
  font-family: Poppins, sans-serif;
  font-size: 38px;
  font-weight: 600;
  line-height: 1.15;
}

.heading-2 {
  font-family: Poppins, sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
}

.body {
  font-family: Hind, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.65;
}

.caption {
  font-family: Hind, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
}
```
