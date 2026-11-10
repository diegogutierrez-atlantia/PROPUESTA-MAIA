import { NextResponse, type NextRequest } from "next/server";
import { verificarTokenMaia, firmarSesion, verificarSesion } from "@/lib/auth-maia";

/**
 * Compuerta de acceso. Corre antes de cualquier página.
 *
 * Reemplaza a la compuerta anterior por `?token=` fijo, que no protegía nada:
 * el token viajaba dentro del bundle con `NEXT_PUBLIC_`, así que cualquiera que
 * abriera las herramientas del navegador lo encontraba.
 *
 * Tres caminos:
 *   1. viene `?token=` de MAIA  -> se verifica, se mintea sesión, cookie y 302
 *      a la misma URL sin el token
 *   2. hay cookie de sesión     -> se verifica la firma y pasa
 *   3. ninguno                  -> salida a MAIA
 *
 * El 302 del primer caso no es cosmético: saca el token de MAIA del historial
 * del navegador, del referer que mandan las imágenes de la página y de los logs
 * del servidor.
 *
 * La liga con token (`AUTH_MODE=token`) se retiró en 2026-09 y volvió en
 * 2026-10, para lo que se comparte fuera de MAIA. Al volver, cierra cuando le
 * falta su token, igual que la de MAIA cuando le faltan sus secretos.
 */

const COOKIE = "maia_session";
/** Igual que el `exp` que estampa MAIA. No tiene caso durar más que el origen. */
const DURACION_SESION = 60 * 60;

/**
 * Qué compuerta se usa. Hay dos despliegues del mismo reporte:
 *
 *   maia  (ausente, o "maia")  el SSO por JWT de arriba. Es la entrega al
 *                              cliente dentro de MAIA. El default es este
 *                              justo para que ese despliegue no necesite
 *                              variable nueva ni cambie de comportamiento.
 *   token                      la liga con `?token=`, para quien ve el
 *                              reporte fuera de MAIA.
 *
 * El modo vive en una variable y no en una rama para que los dos despliegues
 * corran EL MISMO código: lo que se arregla de un lado sirve del otro.
 */
const MODO_TOKEN = process.env.AUTH_MODE === "token";
/** Sesión más larga en modo token: aquí nadie tiene un SSO que la renueve. */
const DURACION_SESION_TOKEN = 12 * 60 * 60;

/** Rutas que la compuerta no toca. */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|mp3)$).*)"],
};

/**
 * Salida hacia MAIA cuando no hay sesión.
 *
 * Es HTML con un script y no un 302, porque MAIA puede abrir el reporte dentro
 * de un iframe. Un 302 cargaría MAIA DENTRO de ese iframe, MAIA intentaría
 * arrancar el login de Google, y Google prohíbe OAuth en iframes: el usuario
 * termina viendo un 403. Este script se sale del iframe primero. En navegación
 * normal hace exactamente lo mismo.
 */
function salidaAMaia(destino: string) {
  const url = JSON.stringify(destino);
  const html = `<!doctype html><meta charset="utf-8"><title>Redirigiendo…</title>
<script>
(function(){
  var t = ${url};
  try {
    if (window.top && window.top !== window.self) { window.top.location.replace(t); }
    else { window.location.replace(t); }
  } catch (e) { window.location.replace(t); }
})();
</script>
<noscript><meta http-equiv="refresh" content="0;url=${destino}"></noscript>`;
  return new NextResponse(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

/**
 * Cortesía para el modo token: la liga necesita su `?token=`.
 *
 * No manda a MAIA porque este despliegue no vive dentro de MAIA; ahí el
 * usuario acabaría en un login que no tiene nada que ver con este reporte.
 */
function faltaToken() {
  const html = `<!doctype html><meta charset="utf-8"><title>Acceso restringido</title>
<style>
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:#f5f4f4;
         font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color:#2d1d5d; }
  main { max-width:32rem; padding:2rem; text-align:center; }
  h1 { font-size:1.35rem; margin:0 0 .75rem; }
  p { color:#656060; line-height:1.6; margin:0; }
</style>
<main>
  <h1>Este reporte necesita su liga de acceso</h1>
  <p>Abre la liga completa que te compartieron, la que termina en <code>?token=…</code>.
     Si no la tienes a la mano, pídesela a quien te compartió el reporte.</p>
</main>`;
  return new NextResponse(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

/**
 * Comparación en tiempo constante.
 *
 * Un `===` sale en el primer carácter que no coincide, y esa diferencia de
 * tiempo, medida muchas veces, deja adivinar el token carácter por carácter.
 * Aquí siempre se recorre la cadena completa.
 */
function igualesEnTiempoConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

/**
 * Compuerta por token de liga, para lo que se comparte fuera de MAIA.
 *
 * Misma mecánica que la de MAIA: se verifica una vez, se mintea una sesión
 * propia y se saca el token de la URL con un 302. Cambia sólo contra qué se
 * compara.
 *
 * Y a diferencia de la compuerta vieja, el token se compara AQUÍ, en el
 * servidor. Antes viajaba dentro del bundle con `NEXT_PUBLIC_`, así que
 * cualquiera lo sacaba de las herramientas del navegador. Por eso tampoco se
 * acepta ya ese nombre viejo como respaldo.
 */
async function compuertaPorToken(req: NextRequest) {
  const esperado = process.env.ACCESS_TOKEN;
  const secretoSesion = process.env.SESSION_SECRET;

  // Antes, sin token configurado no había compuerta: era para no dejar afuera
  // a quien entraba con la liga pelona a un despliegue que ya existía. Ese
  // despliegue no existe, y una liga abierta por una variable olvidada es
  // justo lo que la compuerta tiene que impedir. Cierra, no abre: sin token o
  // sin con qué firmar la sesión, nadie entra.
  if (!esperado || !secretoSesion) return faltaToken();

  const url = req.nextUrl;
  const esHttps = url.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";

  const token = url.searchParams.get("token");
  if (token) {
    if (!igualesEnTiempoConstante(token, esperado)) return faltaToken();

    const limpia = url.clone();
    limpia.searchParams.delete("token");
    const res = NextResponse.redirect(limpia, 302);
    const jwt = await firmarSesion({ sub: "acceso-por-token" }, secretoSesion, DURACION_SESION_TOKEN);
    return conCabeceras(ponerCookie(res, jwt, esHttps, DURACION_SESION_TOKEN));
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && (await verificarSesion(cookie, secretoSesion))) {
    return conCabeceras(NextResponse.next());
  }

  return faltaToken();
}

/**
 * La CSP y demás cabeceras que acompañan a toda respuesta que sí pasa.
 *
 * `frame-ancestors` es lo que impide que cualquiera embeba el reporte en su
 * propio sitio, que es la contraparte necesaria de una cookie SameSite=None.
 */
function conCabeceras(res: NextResponse) {
  const permitidos = process.env.FRAME_ANCESTORS ?? "https://maia.atlantia.ai";
  res.headers.set("content-security-policy", `frame-ancestors 'self' ${permitidos};`);
  res.headers.set("referrer-policy", "no-referrer");
  res.headers.set("x-content-type-options", "nosniff");
  return res;
}

function ponerCookie(res: NextResponse, jwt: string, esHttps: boolean, duracion = DURACION_SESION) {
  // SameSite=None es lo único que funciona dentro del iframe de MAIA, y exige
  // Secure. En local sobre HTTP el navegador rechazaría esa combinación, así
  // que ahí se baja a Lax.
  //
  // La cookie dura lo mismo que la sesión que lleva adentro. Antes de 2026-10
  // el modo token firmaba 12 horas pero la cookie caducaba a la hora.
  res.cookies.set(COOKIE, jwt, {
    httpOnly: true,
    secure: esHttps,
    sameSite: esHttps ? "none" : "lax",
    path: "/",
    maxAge: duracion,
  });
  return res;
}

export async function middleware(req: NextRequest) {
  // `next dev` pasa siempre.
  //
  // La compuerta falla cerrado a propósito: un despliegue al que se le olvidó
  // una variable debe dejar a todos afuera. Pero esa regla es para un
  // DESPLIEGUE, no para la laptop de quien está construyendo el reporte.
  //
  // Sin esto, alguien que clona el proyecto, corre `pnpm dev` y abre
  // localhost:3000 recibe un 401 y una salida hacia MAIA, porque todavía no
  // tiene ningún secreto configurado: no ha llegado a esa fase. Es lo primero
  // que hace en su primer día, y lo que ve es que "no funciona".
  //
  // `NODE_ENV === "development"` es exclusivo de `next dev`. Un build de
  // producción (`next build` + `next start`) y cualquier despliegue quedan en
  // "production", así que la compuerta sigue cerrando donde tiene que cerrar.
  if (process.env.NODE_ENV === "development") return conCabeceras(NextResponse.next());

  // El bypass explícito, para probar un build de producción en local (es lo
  // que usan `pnpm fotos` y `pnpm pdf`). Se activa por PRESENCIA de la
  // variable, no por su valor: así un `DEV_AUTH_BYPASS=false` olvidado en
  // producción no abre la puerta si alguien le cambia el valor por error.
  // Para cerrarlo hay que BORRAR la variable.
  if (process.env.DEV_AUTH_BYPASS !== undefined) return conCabeceras(NextResponse.next());

  if (MODO_TOKEN) return compuertaPorToken(req);

  const secretoMaia = process.env.MAIA_SHARED_SECRET;
  const secretoSesion = process.env.SESSION_SECRET;
  const login = process.env.MAIA_LOGIN_URL ?? "https://maia.atlantia.ai";

  // Sin secretos configurados no se puede verificar nada. Se cierra, no se abre:
  // un despliegue al que se le olvidó una variable debe fallar cerrado.
  if (!secretoMaia || !secretoSesion) return salidaAMaia(login);

  const url = req.nextUrl;
  const esHttps = url.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";

  // 1. Llega desde MAIA.
  const token = url.searchParams.get("token");
  if (token) {
    const maia = await verificarTokenMaia(token, secretoMaia);
    if (!maia) return salidaAMaia(login);

    const limpia = url.clone();
    limpia.searchParams.delete("token");
    const res = NextResponse.redirect(limpia, 302);
    return conCabeceras(ponerCookie(res, await firmarSesion(maia, secretoSesion, DURACION_SESION), esHttps));
  }

  // 2. Ya tiene sesión.
  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && (await verificarSesion(cookie, secretoSesion))) {
    return conCabeceras(NextResponse.next());
  }

  // 3. Ni token ni sesión válida.
  return salidaAMaia(login);
}
