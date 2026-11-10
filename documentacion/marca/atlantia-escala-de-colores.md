# Escala de colores — Atlantia

> Los colores neutros y semánticos que complementan la paleta de marca.
> Fuente: Guía de marca de Atlantia en GAIA (`/brand-guidelines`).

---

## 1. Cómo se lee la escala

Cada color tiene seis pasos, de **100** (el más oscuro) a **10** (el más claro):

**100** · **80** · **60** · **40** · **20** · **10**

En las escalas de marca, el paso **80 es el color oficial**; los demás son
variaciones para construir interfaces, no colores nuevos de identidad.

| Paso | Dónde se usa |
|---|---|
| 100 | Texto sobre fondo claro, estados presionados |
| 80 | El color en sí: botones, iconos, acentos |
| 60 | Estados hover, bordes marcados |
| 40 | Bordes suaves, elementos deshabilitados |
| 20 | Fondos de tarjeta y de estado |
| 10 | Fondos de página, franjas |

---

## 2. Neutral

La base. Es el gris que deja respirar al morado: todo el texto y todos los
bordes de una interfaz de Atlantia salen de aquí.

| Escala | 100 | 80 | 60 | 40 | 20 | 10 |
|---|---|---|---|---|---|---|
| Neutral | `#656060` | `#908989` | `#BBB4B4` | `#D5D1D1` | `#EAE8E8` | `#F5F4F4` |

---

## 3. Escalas de marca

| Escala | 100 | 80 | 60 | 40 | 20 | 10 |
|---|---|---|---|---|---|---|
| Violet | `#2D1D5D` | `#482F91` | `#7460AB` | `#A492C5` | `#CCC4E0` | `#E5E0F2` |
| Turquoise | `#028B89` | `#04D1CD` | `#3DDBD8` | `#7DE9E7` | `#B0F2F0` | `#D8F8F7` |
| Purple | `#722F8F` | `#AA49CA` | `#C072DB` | `#D59BE6` | `#E8C5F2` | `#F4E0F9` |
| Lemon | `#4A7A0B` | `#77C014` | `#9DD44F` | `#BDE28A` | `#D8F0BB` | `#EDFADB` |

| Escala | Para qué |
|---|---|
| **Violet** | El color de la marca. El paso 80 es el Violet oficial |
| **Turquoise** | Acentos. El paso 80 es el Turquoise oficial |
| **Purple** | Acompaña al Violet. El paso 80 es el Purple oficial |
| **Lemon** | Energía, en dosis pequeñas. El paso 80 es el Lemon oficial |

---

## 4. Escalas semánticas

Comunican estado, no identidad. Se usan en semáforos, gráficas y mensajes de
sistema, y **no** deben aparecer como color decorativo de una pieza de marca.

| Escala | 100 | 80 | 60 | 40 | 20 | 10 |
|---|---|---|---|---|---|---|
| Green | `#1A5A32` | `#2A9152` | `#55AB78` | `#85C9A1` | `#B5E0C8` | `#DAF0E3` |
| Yellow | `#7A5400` | `#C8A000` | `#DFBE40` | `#EDDA80` | `#F5ECBA` | `#FAF5DC` |
| Orange | `#7A3200` | `#D05000` | `#E07830` | `#EDA070` | `#F5C8A8` | `#FBE4D2` |
| Red | `#7A0E1C` | `#C41230` | `#D84055` | `#E87888` | `#F4B0BA` | `#FAD8DC` |

| Escala | Para qué |
|---|---|
| **Green** | Éxito, positivo, "arriba" en una gráfica |
| **Yellow** | Advertencia, pendiente, atención |
| **Orange** | Alerta media, un dato que se sale de rango |
| **Red** | Error, negativo, "abajo" en una gráfica |

---

## 5. Reglas

1. El color de identidad es el paso 80. Los otros cinco existen para que una
   interfaz tenga jerarquía, no para ampliar la paleta.
2. Un texto y su fondo nunca salen de pasos contiguos: mínimo 100 sobre 20.
3. Los semánticos no se mezclan con los de marca en la misma jerarquía visual.
4. Si hace falta un tono que no está, se usa el paso más cercano. No se
   interpola.

---

## 6. Tokens

```css
:root {
  --atlantia-neutral-100: #656060;
  --atlantia-neutral-80: #908989;
  --atlantia-neutral-60: #BBB4B4;
  --atlantia-neutral-40: #D5D1D1;
  --atlantia-neutral-20: #EAE8E8;
  --atlantia-neutral-10: #F5F4F4;
  --atlantia-violet-100: #2D1D5D;
  --atlantia-violet-80: #482F91;
  --atlantia-violet-60: #7460AB;
  --atlantia-violet-40: #A492C5;
  --atlantia-violet-20: #CCC4E0;
  --atlantia-violet-10: #E5E0F2;
  --atlantia-turquoise-100: #028B89;
  --atlantia-turquoise-80: #04D1CD;
  --atlantia-turquoise-60: #3DDBD8;
  --atlantia-turquoise-40: #7DE9E7;
  --atlantia-turquoise-20: #B0F2F0;
  --atlantia-turquoise-10: #D8F8F7;
  --atlantia-purple-100: #722F8F;
  --atlantia-purple-80: #AA49CA;
  --atlantia-purple-60: #C072DB;
  --atlantia-purple-40: #D59BE6;
  --atlantia-purple-20: #E8C5F2;
  --atlantia-purple-10: #F4E0F9;
  --atlantia-lemon-100: #4A7A0B;
  --atlantia-lemon-80: #77C014;
  --atlantia-lemon-60: #9DD44F;
  --atlantia-lemon-40: #BDE28A;
  --atlantia-lemon-20: #D8F0BB;
  --atlantia-lemon-10: #EDFADB;
  --atlantia-green-100: #1A5A32;
  --atlantia-green-80: #2A9152;
  --atlantia-green-60: #55AB78;
  --atlantia-green-40: #85C9A1;
  --atlantia-green-20: #B5E0C8;
  --atlantia-green-10: #DAF0E3;
  --atlantia-yellow-100: #7A5400;
  --atlantia-yellow-80: #C8A000;
  --atlantia-yellow-60: #DFBE40;
  --atlantia-yellow-40: #EDDA80;
  --atlantia-yellow-20: #F5ECBA;
  --atlantia-yellow-10: #FAF5DC;
  --atlantia-orange-100: #7A3200;
  --atlantia-orange-80: #D05000;
  --atlantia-orange-60: #E07830;
  --atlantia-orange-40: #EDA070;
  --atlantia-orange-20: #F5C8A8;
  --atlantia-orange-10: #FBE4D2;
  --atlantia-red-100: #7A0E1C;
  --atlantia-red-80: #C41230;
  --atlantia-red-60: #D84055;
  --atlantia-red-40: #E87888;
  --atlantia-red-20: #F4B0BA;
  --atlantia-red-10: #FAD8DC;
}
```
