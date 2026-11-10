# La marca de Atlantia

Los archivos OFICIALES de la guía de marca (GAIA, `/brand-guidelines`). Ya
vienen en el repo base: no hay que descargar nada ni recomponer nada.

Cuatro artes × tres versiones, en SVG (y en `png/` a 1600 px por si un lugar
no admite vectores):

| Arte | Archivo | Cuándo |
|---|---|---|
| Glifo | `atlantia-glifo-*.svg` | La "A" sola. Avatares, espacios chicos |
| Logo horizontal | `atlantia-logo-horizontal-*.svg` | Glifo y palabra en línea. **La barra de arriba del reporte** |
| Logo vertical | `atlantia-logo-vertical-*.svg` | Glifo arriba, palabra abajo. Piezas cuadradas |
| Atlantia Insights | `atlantia-insights-*.svg` | El lockup completo. Portadas y piezas formales |

## Las tres versiones

| Sufijo | Cuándo | Color |
|---|---|---|
| `-color` | La preferida, sobre blanco o fondos muy claros | Degradado violeta → púrpura → turquesa |
| `-blanco` | La ÚNICA sobre fondos oscuros o fotografías | Blanco sólido |
| `-negro` | Impresión a una tinta y contextos monocromos | `#363636` |

**Nunca la de color sobre fondo oscuro:** pierde la pierna morada del glifo y
deja de leerse. Y nunca se recompone el logo con tipografía suelta: es artwork.

Los componentes que los montan viven en `src/components/marca/AtlantiaMark.tsx`.

## Reglas de uso

1. No deformar, rotar ni cambiar proporciones.
2. No recolorear fuera de las tres versiones.
3. No aplicar sombras, contornos ni efectos.
4. Aire alrededor: como mínimo el alto de la "A" del glifo por cada lado.
5. La palabra "atlantia" siempre va en minúsculas.

## Del cliente

Aquí no: esta carpeta es sólo de Atlantia. El logo del cliente lo deja el
vendedor en `entradas/`, y Claude lo copia a `public/cliente/` para la portada.
