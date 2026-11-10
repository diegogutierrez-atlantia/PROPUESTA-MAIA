/**
 * Quién firma las propuestas: el cierre lleva la foto y el nombre de quien
 * vende, porque la última imagen que se lleva el cliente es una cara.
 *
 * Un vendedor nuevo se da de alta aquí una vez, con su foto en
 * `public/casa/vendedores/` (cuadrada o casi, de preferencia con fondo limpio:
 * el cierre la recorta en círculo). La propuesta sólo dice su clave.
 */
export interface Vendedor {
  nombre: string;
  /** La línea bajo el nombre. */
  linea: string;
  /** Su correo, que va bajo la línea en el cierre. */
  correo?: string;
  /** Ruta dentro de `public/`. Sin foto, el cierre pone sus iniciales. */
  foto?: string;
}

export const VENDEDORES: Record<string, Vendedor> = {
  "diego-gutierrez": {
    nombre: "Diego Gutiérrez Garza",
    linea: "Insights Partner · Atlantia",
    foto: "/casa/vendedores/diego-gutierrez.png",
    correo: "dgutierrez@atlantiasearch.com",
  },
  "jonathan-ramirez": {
    nombre: "Jonathan Ramírez Álvarez",
    linea: "Insights Partner · Atlantia",
    foto: "/casa/vendedores/jonathan-ramirez.png",
    correo: "jramirez@atlantiasearch.com",
  },
  "ana-maria-escarela": {
    nombre: "Ana María Escarela",
    linea: "Insights Partner · Atlantia",
    foto: "/casa/vendedores/ana-maria-escarela.png",
    correo: "aescarela@atlantiasearch.com",
  },
  "mariana-luna": {
    nombre: "Mariana Luna Govea",
    linea: "Insights Partner · Atlantia",
    foto: "/casa/vendedores/mariana-luna.png",
    correo: "partner.support1@atlantiasearch.com",
  },
  "karina-malpica": {
    nombre: "Karina Malpica",
    linea: "Methodologies Development Specialist · Atlantia",
    foto: "/casa/vendedores/karina-malpica.png",
    correo: "analyst@atlantiasearch.com",
  },
  "daniel-azpiazu": {
    nombre: "Daniel Azpiazu",
    linea: "Projects Manager · Atlantia",
    foto: "/casa/vendedores/daniel-azpiazu.png",
    correo: "data.analyst2@atlantiasearch.com",
  },
  "andrea-ferrari": {
    nombre: "Andrea Ferrari",
    linea: "COO · Atlantia",
    foto: "/casa/vendedores/andrea-ferrari.png",
    correo: "operations@atlantiasearch.com",
  },
};

export function vendedor(clave: string): Vendedor {
  const v = VENDEDORES[clave];
  if (!v) {
    throw new Error(
      `No hay un vendedor "${clave}" en casa/vendedores.ts. Los que hay: ${Object.keys(VENDEDORES).join(", ")}.`,
    );
  }
  return v;
}
