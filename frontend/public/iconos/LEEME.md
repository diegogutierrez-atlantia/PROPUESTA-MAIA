# La iconografía de Atlantia

Los 20 iconos de trazo de la guía de marca (GAIA, `/brand-guidelines`).

| | |
|---|---|
| Estilo | Sólo trazo, sin relleno |
| Retícula | 24 × 24 px |
| Grosor | 1.5 px |
| Remates | Redondos |
| Color | Violet `#482F91` en `./`, blanco en `blanco/` |

Los SVG no llevan relleno: todo el dibujo es el `stroke` de la raíz. Puesto en
`currentColor` hereda el color del texto que lo rodea, y entonces el mismo
archivo sirve en claro, en oscuro y sobre lámina de color:

```html
<svg ... stroke="currentColor" stroke-width="1.5">
```

No cambies el grosor del trazo al escalar: 1.5 sobre 24 es lo que hace que el
set se vea como un set.

## Cuando el estudio necesita un icono que no está aquí

Los veinte de la guía son de interfaz (buscar, descargar, calendario…). Para
los del **dominio** del estudio (una galleta, un vaso de leche, una tienda) se
usa Tabler Icons (MIT), que comparte el mismo estilo de trazo: ver
`src/components/marca/Iconos.tsx`. Un pictograma hecho a ojo se nota de
inmediato al lado de tipografía cuidada.
