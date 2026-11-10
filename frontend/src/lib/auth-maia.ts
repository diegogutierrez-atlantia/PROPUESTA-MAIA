import { SignJWT, jwtVerify } from "jose";

/**
 * SSO con MAIA (maia.atlantia.ai), modo "Outbound JWT Shared Secret".
 *
 * MAIA abre el reporte en `?token=<JWT firmado HS256>`. Aquí se verifica ese
 * token y se mintea uno PROPIO para la sesión, que es lo que viaja en la cookie.
 *
 * Se mintea uno propio en vez de guardar el de MAIA porque:
 *   - si MAIA rota su secreto, las sesiones ya abiertas siguen vivas
 *   - el token de MAIA viaja en la URL, así que puede quedar en el historial,
 *     en el referer y en los logs; uno filtrado son las llaves de MAIA entera,
 *     mientras que el de sesión sólo abre este reporte y por poco tiempo
 *   - la forma del payload de MAIA puede cambiar sin aviso
 *
 * Todo esto corre en el runtime Edge del middleware, por eso `jose` y no
 * `jsonwebtoken`, que necesita APIs de Node.
 */

/** Lo que MAIA manda. Sólo se declara lo que se usa; lo demás se ignora. */
export interface TokenMaia {
  sub?: string;
  user_id?: string;
  email?: string;
  /** Ojo: es `full_name`, no `name`. */
  full_name?: string;
  /** Es un OBJETO, no una cadena. */
  company?: { id?: string; name?: string; role?: string };
}

/** La sesión propia: una forma estable que este reporte controla. */
export interface Sesion {
  sub: string;
  email?: string;
  nombre?: string;
  empresa?: string;
}

const aClave = (secreto: string) => new TextEncoder().encode(secreto);

/**
 * Verifica el token de MAIA.
 *
 * El algoritmo va PINNEADO a HS256: si el verificador lo tomara de la cabecera
 * del propio token, cualquiera podría mandar uno con `alg: none` o forzar una
 * confusión con RS256 y pasar sin firma válida.
 *
 * No se exige `iss` ni `aud`: MAIA hoy no los emite y exigirlos tumbaría todos
 * los tokens. Si algún día los manda, se validan aquí.
 */
export async function verificarTokenMaia(token: string, secreto: string): Promise<TokenMaia | null> {
  try {
    const { payload } = await jwtVerify(token, aClave(secreto), { algorithms: ["HS256"] });
    // `exp` lo valida jose; sin `sub` no hay a quién atribuir la sesión.
    const sub = (payload.sub ?? payload.user_id) as string | undefined;
    if (!sub) return null;
    return payload as TokenMaia;
  } catch {
    return null;
  }
}

/** Mintea la sesión propia a partir de lo que vino de MAIA. */
export async function firmarSesion(
  maia: TokenMaia,
  secreto: string,
  duracionSegundos: number,
): Promise<string> {
  const sub = (maia.sub ?? maia.user_id) as string;
  const sesion: Sesion = {
    sub,
    email: maia.email,
    nombre: maia.full_name,
    empresa: maia.company?.name,
  };
  return new SignJWT({ ...sesion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + duracionSegundos)
    .sign(aClave(secreto));
}

/** Verifica la cookie de sesión. Mismo pinneo de algoritmo. */
export async function verificarSesion(jwt: string, secreto: string): Promise<Sesion | null> {
  try {
    const { payload } = await jwtVerify(jwt, aClave(secreto), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return payload as unknown as Sesion;
  } catch {
    return null;
  }
}
