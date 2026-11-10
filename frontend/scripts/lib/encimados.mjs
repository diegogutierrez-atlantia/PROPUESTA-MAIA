/**
 * Textos encimados dentro de una lámina: pares de renglones de texto cuyas
 * cajas se cruzan en pantalla. Lo usa `pnpm fotos` en cada lámina, en cada
 * tamaño y en cada tema.
 *
 * Nada se debe encimar. Pasó en una forma de la base que en escritorio se veía
 * bien y en un teléfono ponía "TOTAL 62" encima de "PUNTAJE": ninguna revisión
 * de código lo ve, y en la foto se pierde entre veinte láminas. Esto lo dice
 * con nombre y apellido.
 *
 * Se mide el TEXTO, no las cajas: un rótulo encima de una barra está bien; dos
 * rótulos uno encima del otro, no. Y se mide lo que el lector ve:
 *
 * - Lo oculto no cuenta: `display: none`, `visibility: hidden`, opacidad 0 (lo
 *   que aparece al pasar el cursor), y la cara trasera de una tarjeta que voltea.
 * - Lo recortado se recorta: un nombre con `truncate` ocupa hasta su elipsis,
 *   no el largo completo del texto.
 * - Se mide el TRAZO, no la caja de la letra. La caja de Poppins mide 1.4 veces
 *   el tamaño de la letra, con mucho aire abajo: un "62%" en tamaño héroe
 *   "tocaba" el texto de abajo sin que un solo trazo lo tocara, y así el aviso
 *   salía donde no había nada. Se toma una franja de 0.9 veces el tamaño,
 *   centrada en la caja, que es donde viven mayúsculas, números y minúsculas.
 * - Dos renglones seguidos de un mismo párrafo se tocan por la tipografía: por
 *   eso un cruce cuenta sólo si tapa al menos el 40% del alto del más bajo.
 *
 * Se ejecuta DENTRO del navegador (puppeteer la serializa), así que no puede
 * usar nada de fuera de su propio cuerpo.
 */
export function textosEncimados(secciones, indice) {
  const seccion = secciones[indice];

  const seVe = (el) => {
    // Lo de adentro de un desplegable cerrado (`<details>` sin `open`) no se
    // pinta, pero Chrome le deja su caja: el medidor lo contaba y los términos
    // y los KPIs cerrados salían "encimados" sin que se viera nada. Su
    // `<summary>`, el renglón que sí se ve, sí cuenta.
    const cerrado = el.closest("details:not([open])");
    if (cerrado && !el.closest("summary")) return false;
    for (let e = el; e && e !== seccion.parentElement; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
      // La cara de atrás de una tarjeta volteable: girada 180° y sin revés.
      if (s.backfaceVisibility === "hidden" && s.transform.startsWith("matrix3d(-1")) return false;
    }
    return true;
  };

  // El rectángulo visible de un elemento: lo recortan sus ancestros que no
  // dejan desbordar (truncate, overflow-hidden, un carril con scroll).
  const recorte = (el) => {
    let caja = { x: -Infinity, y: -Infinity, r: Infinity, b: Infinity };
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.overflowX !== "visible" || s.overflowY !== "visible") {
        const r = e.getBoundingClientRect();
        caja = {
          x: Math.max(caja.x, s.overflowX !== "visible" ? r.left : -Infinity),
          y: Math.max(caja.y, s.overflowY !== "visible" ? r.top : -Infinity),
          r: Math.min(caja.r, s.overflowX !== "visible" ? r.right : Infinity),
          b: Math.min(caja.b, s.overflowY !== "visible" ? r.bottom : Infinity),
        };
      }
    }
    return caja;
  };

  const cajas = [];
  const recorrido = document.createTreeWalker(seccion, NodeFilter.SHOW_TEXT);
  for (let nodo = recorrido.nextNode(); nodo; nodo = recorrido.nextNode()) {
    const texto = nodo.textContent.replace(/\s+/g, " ").trim();
    const el = nodo.parentElement;
    if (!texto || !el || !seVe(el)) continue;
    const limite = recorte(el);
    const medioTrazo = 0.45 * parseFloat(getComputedStyle(el).fontSize);
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    for (const c of rango.getClientRects()) {
      const centro = (c.top + c.bottom) / 2;
      const caja = {
        texto: texto.slice(0, 40),
        el,
        x: Math.max(c.left, limite.x),
        y: Math.max(c.top, centro - medioTrazo, limite.y),
        r: Math.min(c.right, limite.r),
        b: Math.min(c.bottom, centro + medioTrazo, limite.b),
      };
      if (caja.r - caja.x > 2 && caja.b - caja.y > 2) cajas.push(caja);
    }
  }

  const pares = new Set();
  for (let i = 0; i < cajas.length; i++) {
    for (let j = i + 1; j < cajas.length; j++) {
      const p = cajas[i];
      const q = cajas[j];
      if (p.el === q.el) continue;
      const ancho = Math.min(p.r, q.r) - Math.max(p.x, q.x);
      const alto = Math.min(p.b, q.b) - Math.max(p.y, q.y);
      if (ancho > 2 && alto > 0.4 * Math.min(p.b - p.y, q.b - q.y)) pares.add(`"${p.texto}" con "${q.texto}"`);
    }
  }
  return [...pares];
}
