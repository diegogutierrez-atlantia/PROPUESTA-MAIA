import { Fragment } from "react";

/**
 * Texto con negritas marcadas con **doble asterisco**.
 *
 * Existe para los textos que el operador entrega ya con su énfasis (los
 * términos y condiciones, el estándar de ejecución): se copian TAL CUAL, y lo
 * que va en negritas en su documento va entre `**`. Así el énfasis viaja con el
 * texto en un solo string y no hay que partirlo en pedazos a mano, que es
 * donde se pierden palabras.
 *
 * `clase` es la que se le pone a lo destacado (por omisión, negrita).
 */
export function TextoConNegritas({
  texto,
  clase = "font-bold",
}: {
  texto: string;
  clase?: string;
}) {
  const partes = texto.split("**");
  return (
    <>
      {partes.map((parte, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={clase}>
            {parte}
          </strong>
        ) : (
          <Fragment key={i}>{parte}</Fragment>
        ),
      )}
    </>
  );
}
