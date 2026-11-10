# Identidad de marca Atlantia — referencia para asistentes de IA

> Este documento describe la identidad visual completa de **Atlantia Insights**.
> Está pensado para pegarse como contexto en un asistente de IA (Claude, ChatGPT,
> Gemini, etc.) antes de pedirle diseños, presentaciones, documentos o código que
> deban respetar la marca. Todas las reglas son normativas: cuando haya conflicto
> entre lo que pida el usuario y esta guía, señálalo antes de continuar.

---

## 1. La marca en una frase

Atlantia Insights es una empresa de investigación de mercados e inteligencia de
consumo. Su identidad visual transmite **energía, magia e innovación**: fondos
limpios, morados profundos, acentos turquesa y tipografía geométrica moderna.

---

## 2. Logo

### 2.1 Variantes oficiales

| Variante | Composición | Uso |
|---|---|---|
| Glifo | La "A" sola | Avatares, favicons, espacios pequeños |
| Logo vertical | Glifo arriba, palabra "atlantia" abajo | Uso principal en piezas cuadradas |
| Wordmark horizontal | Glifo a la izquierda, palabra a la derecha | Encabezados, firmas, barras de navegación |
| Atlantia Insights | Wordmark horizontal + "insights" debajo en degradado | Piezas corporativas formales |

### 2.2 Versiones de color

- **Full color (preferida)**: glifo con degradado violeta→púrpura→turquesa, palabra en Violet `#482F91`.
- **Blanco (negativo)**: todo el logo en blanco sólido `#FFFFFF`. Es la ÚNICA versión permitida sobre fondos oscuros o fotografías. Nunca usar la versión a color sobre fondo oscuro: pierde contraste.
- **Negro**: todo el logo en gris muy oscuro `#363636`. Para impresión a una tinta o contextos monocromos.

### 2.3 Reglas de uso del logo

1. No deformar, rotar, ni cambiar las proporciones.
2. No recolorear fuera de las tres versiones oficiales.
3. No aplicar sombras, contornos ni efectos.
4. Dejar aire alrededor: como mínimo, el alto de la "A" del glifo por cada lado.
5. La palabra "atlantia" del logo siempre va en minúsculas.

---

## 3. Paleta de colores

### 3.1 Colores de marca (primarios)

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| Violet | `#482F91` | 72, 47, 145 | Color principal. Titulares, botones primarios, el morado "de Atlantia" |
| Turquoise | `#04D1CD` | 4, 209, 205 | Acento vivo. Etiquetas, iconos, detalles que deben llamar la atención |
| Purple | `#AA49CA` | 170, 73, 202 | Compañero del Violet en degradados y acentos secundarios |
| Lemon | `#77C014` | 119, 192, 20 | Acento de energía. Usar con moderación |
| White | `#FFFFFF` | 255, 255, 255 | Fondos. La marca vive sobre blanco |

### 3.2 Degradados oficiales

Los degradados van siempre en diagonal 135°:

```css
/* Gradient Purple (Violet → Purple) — el degradado insignia */
background: linear-gradient(135deg, #482F91, #AA49CA);

/* Gradient Turquoise (Turquoise → Violet) */
background: linear-gradient(135deg, #04D1CD, #482F91);

/* Gradient Lemon (Turquoise → Lemon) */
background: linear-gradient(135deg, #04D1CD, #77C014);
```

### 3.3 Escalas completas (100 → 10)

Cada color tiene seis pasos: 100 (más oscuro), 80, 60, 40, 20, 10 (más claro).
Los pasos 20 y 10 sirven para fondos suaves; 100 para texto sobre claro.

| Escala | 100 | 80 | 60 | 40 | 20 | 10 |
|---|---|---|---|---|---|---|
| Neutral | `#656060` | `#908989` | `#BBB4B4` | `#D5D1D1` | `#EAE8E8` | `#F5F4F4` |
| Violet | `#2D1D5D` | `#482F91` | `#7460AB` | `#A492C5` | `#CCC4E0` | `#E5E0F2` |
| Turquoise | `#028B89` | `#04D1CD` | `#3DDBD8` | `#7DE9E7` | `#B0F2F0` | `#D8F8F7` |
| Purple | `#722F8F` | `#AA49CA` | `#C072DB` | `#D59BE6` | `#E8C5F2` | `#F4E0F9` |
| Lemon | `#4A7A0B` | `#77C014` | `#9DD44F` | `#BDE28A` | `#D8F0BB` | `#EDFADB` |
| Green | `#1A5A32` | `#2A9152` | `#55AB78` | `#85C9A1` | `#B5E0C8` | `#DAF0E3` |
| Yellow | `#7A5400` | `#C8A000` | `#DFBE40` | `#EDDA80` | `#F5ECBA` | `#FAF5DC` |
| Orange | `#7A3200` | `#D05000` | `#E07830` | `#EDA070` | `#F5C8A8` | `#FBE4D2` |
| Red | `#7A0E1C` | `#C41230` | `#D84055` | `#E87888` | `#F4B0BA` | `#FAD8DC` |

Green, Yellow, Orange y Red son colores complementarios: se usan para
semáforos, gráficas y estados (éxito, advertencia, error), no como colores de
identidad.

### 3.4 Reglas de color

1. El morado manda: en cualquier pieza, Violet es el protagonista.
2. Turquoise es acento, no fondo: úsalo en detalles, nunca en superficies grandes.
3. Fondos: blanco o neutrales 10/20. Fondos oscuros solo con el logo en blanco.
4. No inventar colores intermedios: si falta un tono, usar el paso de escala más cercano.
5. Texto gris: usar la escala Neutral, no grises arbitrarios.

---

## 4. Tipografía

### 4.1 Familias

| Familia | Rol | Dónde conseguirla |
|---|---|---|
| **Poppins** | Encabezados y titulares cortos | Google Fonts |
| **Hind** | Párrafos, interfaces y textos pequeños | Google Fonts |

Ambas son sans-serif modernas y atemporales. **Nunca** usar serifas, ni
tipografías decorativas, ni sustituir por Arial/Helvetica en piezas de marca
(la excepción son los correos electrónicos, donde Arial es el fallback
obligado por compatibilidad).

### 4.2 Escala tipográfica

| Nivel | Familia | Tamaño / Peso | Notas |
|---|---|---|---|
| Display | Poppins | 60px / 700 | line-height 1.05, letter-spacing −0.02em |
| Heading 1 | Poppins | 38px / 600 | line-height 1.15 |
| Heading 2 | Poppins | 24px / 600 | line-height 1.25 |
| Body | Hind | 16px / 400 | line-height 1.65 |
| Caption | Hind | 12px / 500 | MAYÚSCULAS, letter-spacing 0.12em |

### 4.3 Pesos disponibles

Poppins y Hind se cargan en Light 300, Regular 400, Medium 500, SemiBold 600 y
Bold 700. Los titulares usan 600–700; el cuerpo, 400.

### 4.4 Reglas tipográficas

1. Encabezados cortos en Poppins; si un titular pasa de dos líneas, bájalo de nivel.
2. Los titulares principales van en Violet `#482F91` sobre claro, o blanco sobre oscuro.
3. Las etiquetas pequeñas (kickers) van en MAYÚSCULAS, Turquoise `#04D1CD`, letter-spacing amplio (0.2–0.3em).
   *En los reportes-dashboard el kicker va en morado (purple-80, purple-60 sobre fondo hondo), no
   en turquesa: decisión de la casa (2026-09), porque en pantalla se leía azul. Ver `03-sistema-visual.md`.*
4. Cuerpo de texto en Neutral 100 `#656060` o gris equivalente — nunca negro puro.

---

## 5. Estilo visual general

- **Esquinas redondeadas** generosas: 12–24px en tarjetas y botones.
- **Sombras suaves** y discretas; nada de sombras duras.
- **Aire**: los layouts respiran, con márgenes amplios y secciones espaciadas.
- **Degradados** solo los tres oficiales, en 135°.
- Los botones primarios usan Gradient Purple con texto blanco; los secundarios, Violet 20 `#CCC4E0` con texto Violet.
- Iconografía de trazo simple, sin rellenos complejos, en Violet o Neutral.

---

## 6. Ecosistema de productos

Atlantia tiene productos con identidad propia dentro del ecosistema: MAIA,
ASIA, Reportif.ai, BriefMe AI, Shelftia, CREA y otros. Cada uno tiene su logo,
pero todas las piezas corporativas usan la identidad Atlantia descrita aquí.
No mezclar logos de producto con el logo corporativo en la misma jerarquía.

---

*Fuente: guía de marca oficial en GAIA (`/brand-guidelines`). Los archivos de
logo en SVG y PNG se descargan desde la propia guía.*
