import { redirect } from "next/navigation";

/**
 * La raíz manda directo a la propuesta.
 *
 * En la base de reportes, `/` era un tablero de fases para quien construye.
 * Aquí no hay fases: quien abre la liga (el vendedor en su computadora o el
 * cliente con su token) viene a ver la propuesta.
 */
export default function Inicio() {
  redirect("/propuesta");
}
