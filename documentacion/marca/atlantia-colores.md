# Colores — Atlantia

> Paleta oficial de Atlantia Insights. Fuente: Guía de marca de Atlantia en GAIA (`/brand-guidelines`).

---

## 1. Colores de marca

| Color | HEX | RGB | Uso |
|---|---|---|---|
| **Violet** | `#482F91` | 72, 47, 145 | Color principal. Titulares, botones primarios, el morado "de Atlantia" |
| **Turquoise** | `#04D1CD` | 4, 209, 205 | Acento vivo. Etiquetas, iconos, detalles que deben llamar la atención |
| **Purple** | `#AA49CA` | 170, 73, 202 | Compañero del Violet en degradados y acentos secundarios |
| **Lemon** | `#77C014` | 119, 192, 20 | Acento de energía. Usar con moderación |
| **White** | `#FFFFFF` | 255, 255, 255 | Fondos. La marca vive sobre blanco |

El **Violet** es el color de la marca: si una pieza solo puede llevar un color,
lleva ese. Turquoise, Purple y Lemon son acentos y se usan en superficies
pequeñas — un icono, una etiqueta, un subrayado—, nunca como fondo de página.

---

## 2. Degradados oficiales

| Degradado | De | A | Uso |
|---|---|---|---|
| **Gradient Purple** | Violet `#482F91` | Purple `#AA49CA` | El degradado insignia. Botones primarios, fondos de héroe |
| **Gradient Turquoise** | Turquoise `#04D1CD` | Violet `#482F91` | Piezas con acento frío: portadas, gráficas, tarjetas de dato |
| **Gradient Lemon** | Turquoise `#04D1CD` | Lemon `#77C014` | El más enérgico. Solo en detalles y en piezas de campaña |

Los tres van siempre en diagonal, a 135°. No se inventan degradados nuevos ni se
cambia el ángulo.

```css
/* Gradient Purple */
background: linear-gradient(135deg, #482F91, #AA49CA);

/* Gradient Turquoise */
background: linear-gradient(135deg, #04D1CD, #482F91);

/* Gradient Lemon */
background: linear-gradient(135deg, #04D1CD, #77C014);
```

---

## 3. Reglas de color

1. **El morado manda.** En cualquier pieza, Violet es el protagonista.
2. **Turquoise es acento, no fondo.** Detalles y remates; nunca superficies grandes.
3. **Fondos:** blanco, o los pasos 10 y 20 de una escala. Los fondos oscuros solo
   admiten el logo en blanco.
4. **No inventes tonos intermedios.** Si falta un color, se toma el paso más
   cercano de la escala (ver el documento de Escala de colores).
5. **Texto gris:** siempre de la escala Neutral, nunca un gris cualquiera y
   nunca negro puro.
6. **Contraste:** texto claro sobre Violet 100/80; texto oscuro sobre los pasos
   20 y 10. Los pasos 60 y 40 no sirven de fondo para texto pequeño.

---

## 4. Tokens

```css
:root {
  --atlantia-violet: #482F91;
  --atlantia-turquoise: #04D1CD;
  --atlantia-purple: #AA49CA;
  --atlantia-lemon: #77C014;
  --atlantia-white: #FFFFFF;
}
```

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        atlantia: {
        violet: '#482F91',
        turquoise: '#04D1CD',
        purple: '#AA49CA',
        lemon: '#77C014',
        white: '#FFFFFF',
        }
      }
    }
  }
}
```
