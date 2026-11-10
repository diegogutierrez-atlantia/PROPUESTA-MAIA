/**
 * Las capturas que enseñan cómo se ve lo que el cliente recibe.
 *
 * Son capturas reales de un demo de Atlantia (datos de demostración, de
 * ningún cliente), recortadas del original y SIN RETOCAR: dibujar una versión
 * "limpia" prometería algo que no es el producto. Si cambia el producto, se
 * cambian aquí y todas las propuestas nuevas salen con las nuevas.
 */
export interface Captura {
  src: string;
  ancho: number;
  alto: number;
  /** Qué muestra, para quien no la ve. */
  descripcion: string;
}

export const CAPTURAS_DEL_ENTREGABLE: Record<"dashboard", { titulo: string; capturas: Captura[] }> = {
  dashboard: {
    titulo: "Ejemplo del Entregable Digital",
    capturas: [
      {
        src: "/casa/entregable/veredicto.png",
        ancho: 1222,
        alto: 507,
        descripcion:
          "Pantalla de veredicto del tablero: una gráfica de agrado contra diferenciación con un punto por concepto y el cuadrante donde un concepto puede lanzarse.",
      },
      {
        src: "/casa/entregable/portada.png",
        ancho: 1230,
        alto: 484,
        descripcion:
          "Portada del tablero de resultados: título, menú de secciones y cinco tarjetas con las cifras principales del estudio.",
      },
      {
        src: "/casa/entregable/categoria.png",
        ancho: 1230,
        alto: 510,
        descripcion:
          "Pantalla de la historia sobre la categoría: una cifra grande de la audiencia y un ranking de momentos de consumo con su porcentaje.",
      },
      {
        src: "/casa/entregable/comparativa.png",
        ancho: 1220,
        alto: 524,
        descripcion:
          "Tabla comparativa de conceptos con su puntaje, su banda de aceptación y sus indicadores, con filtros por segmento arriba.",
      },
    ],
  },
  // El juego del simulador va aquí en cuanto haya una captura con datos de
  // demostración. La que circulaba traía marcas y cifras de un estudio real,
  // y en una propuesta para otro cliente eso no puede salir.
};
