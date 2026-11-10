# 11 · Acceso y embebido en MAIA

El entregable se publica detrás de una compuerta. Hay dos formas y **un solo código** las
sostiene.

> **Una propuesta va con liga de token** (`AUTH_MODE=token`): quien la recibe todavía no es
> cliente y no tiene cuenta en MAIA. Lo de MAIA se queda documentado porque el código es el
> mismo que el de los reportes.

---

## 1. Dos despliegues, un solo código, y el local del operador

| | Compuerta | Para quién |
|---|---|---|
| **MAIA** (default) | SSO por JWT desde `maia.atlantia.ai` | El cliente, dentro de MAIA |
| **Liga con token** (`AUTH_MODE=token`) | `?token=` en la liga | Quien ve el reporte fuera de MAIA |
| **Local** (`pnpm dev`) | Sin compuerta | Quien construye el reporte |

El modo vive en **una variable de entorno, no en una rama de git**, para que los dos
despliegues corran exactamente el mismo código: lo que se arregla de un lado sirve del otro.
Dos ramas divergen y a la tercera semana ya son dos proyectos.

El default es MAIA justo para que el despliegue del cliente no necesite variable nueva ni
cambie de comportamiento por existir el otro modo.

La liga con token se retiró en 2026-09 y volvió en 2026-10. Al volver, **cierra cuando le falta
su token** (antes se abría), porque una puerta que nadie vigila es una puerta abierta.

---

## 2. Cómo funciona la compuerta de MAIA

```
1. Llega ?token= de MAIA  →  se verifica  →  se mintea sesión propia  →  cookie  →  302 limpio
2. Hay cookie de sesión   →  se verifica la firma  →  pasa
3. Ni token ni cookie     →  salida a MAIA
```

Todo esto vive en `middleware.ts`, que corre **antes de cualquier página**.

### Se mintea una sesión PROPIA, no se guarda la de MAIA

Tres motivos:

- Si MAIA rota su secreto, las sesiones ya abiertas siguen vivas.
- El token de MAIA viaja en la URL, así que puede quedar en el historial, en el `referer` y
  en los logs. **Uno filtrado son las llaves de MAIA entera**, mientras que el de sesión sólo
  abre este reporte y por poco tiempo.
- La forma del payload de MAIA puede cambiar sin aviso. La sesión propia es una forma estable
  que este reporte controla.

### El 302 no es cosmético

Después de verificar, se redirige a la misma URL **sin** el parámetro. Eso saca el token del
historial del navegador, del `referer` que mandan las imágenes de la página y de los logs del
servidor.

### El algoritmo va pinneado

```ts
await jwtVerify(token, clave, { algorithms: ["HS256"] });
```

Si el verificador tomara el algoritmo de la cabecera del propio token, cualquiera podría
mandar uno con `alg: none` o forzar una confusión con RS256 y pasar sin firma válida.

### `jose`, no `jsonwebtoken`

El middleware corre en el runtime Edge, que no tiene las APIs de Node que `jsonwebtoken`
necesita.

---

## 3. La salida al login es HTML con script, no un 302

**Es el detalle más contraintuitivo de todo el archivo.**

MAIA puede abrir el reporte dentro de un `iframe`. Un 302 hacia el login cargaría MAIA
**dentro de ese iframe**, MAIA intentaría arrancar el login de Google, y **Google prohíbe
OAuth en iframes**: el usuario termina viendo un 403.

Por eso la salida es una página con un script que primero se sale del iframe:

```js
if (window.top && window.top !== window.self) { window.top.location.replace(destino); }
else { window.location.replace(destino); }
```

En navegación normal hace exactamente lo mismo, así que sirve en los dos casos. Y lleva su
`<noscript>` con un `meta refresh`.

---

## 4. La cookie

```ts
res.cookies.set("maia_session", jwt, {
  httpOnly: true,
  secure: esHttps,
  sameSite: esHttps ? "none" : "lax",
  path: "/",
  maxAge: DURACION_SESION,
});
```

**`SameSite=None` es lo único que funciona dentro de un iframe de otro dominio**, y exige
`Secure`. En local sobre HTTP el navegador rechazaría esa combinación, así que ahí se baja a
`Lax`.

La duración de la sesión iguala la del token de MAIA (una hora). No tiene caso durar más que
el origen. En modo token la sesión es más larga (12 horas), porque ahí nadie tiene un SSO que
la renueve. La cookie dura lo mismo que la sesión que lleva adentro.

---

## 5. Las cabeceras

Toda respuesta que pasa la compuerta lleva:

```ts
res.headers.set("content-security-policy", `frame-ancestors 'self' ${permitidos};`);
res.headers.set("referrer-policy", "no-referrer");
res.headers.set("x-content-type-options", "nosniff");
```

**`frame-ancestors` es la contraparte necesaria de una cookie `SameSite=None`.** Sin ella,
cualquiera podría embeber el reporte en su propio sitio y la cookie viajaría igual. Los
orígenes permitidos salen de una variable (`FRAME_ANCESTORS`), con MAIA como default.

---

## 6. La compuerta por token

Misma mecánica: se verifica una vez, se mintea sesión propia, se saca el token de la URL con
un 302. Lo único que cambia es contra qué se compara. Sin el token, o con uno equivocado, sale
una pantalla que pide la liga completa; no manda a MAIA, porque este despliegue no vive ahí.

**El token se compara en el servidor.** La compuerta vieja lo tenía en `NEXT_PUBLIC_ACCESS_TOKEN`,
así que viajaba dentro del bundle y cualquiera lo sacaba de las herramientas del navegador.
Eso no protegía nada. Por eso ese nombre viejo ya no se acepta: el token va en `ACCESS_TOKEN`.

Y se compara **en tiempo constante**:

```ts
let dif = 0;
for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
return dif === 0;
```

Un `===` sale en el primer carácter que no coincide, y esa diferencia de tiempo, medida muchas
veces, deja adivinar el token carácter por carácter.

Necesita dos variables: `ACCESS_TOKEN` y `SESSION_SECRET` (la que firma la cookie que sostiene
el acceso de una página a otra). **Si falta cualquiera de las dos, nadie entra.**

Generar un token:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Rotar el token:** genera uno nuevo, actualízalo en el hosting, redespliega y comparte la liga
nueva. La liga vieja deja de abrir; quien ya tenía sesión abierta la conserva hasta que caduque.

---

## 7. Reglas de configuración

**`next dev` pasa siempre.** La compuerta es para un DESPLIEGUE, no para la laptop de quien
construye el reporte. Sin esta excepción, alguien que clona el proyecto y corre `pnpm dev` en su
primer día recibe un 401 y una salida hacia MAIA, porque todavía no tiene ningún secreto: no ha
llegado a esa fase. Lo primero que ve es que "no funciona".

Va contra `NODE_ENV === "development"`, que es exclusivo de `next dev`. Un build de producción
(`next build` + `next start`) y cualquier despliegue quedan en `"production"`, así que la
compuerta sigue cerrando donde tiene que cerrar. **Comprobado en las dos direcciones:** en `dev`
sin secretos la página responde 200; en producción sin secretos responde 401 y saca a MAIA.

**Falla cerrado, en los dos modos.** Sin los secretos configurados no se puede verificar nada,
así que se cierra. Un despliegue al que se le olvidó una variable debe dejar a todos afuera, no
dejar a todos adentro.

**El bypass de desarrollo se activa por PRESENCIA de la variable, no por su valor.** Es para
probar un build de producción en la máquina del operador; `pnpm fotos` y `pnpm pdf` lo ponen
solos en su servidor, que escucha únicamente en `127.0.0.1` y muere al terminar.

```ts
if (process.env.DEV_AUTH_BYPASS !== undefined) return pasar();
```

Así un `DEV_AUTH_BYPASS=false` olvidado en producción no abre la puerta el día que alguien le
cambie el valor por error. Para cerrarlo hay que **borrar** la variable. En ningún despliegue
debe existir: ni en MAIA ni en el de la liga.

---

## 8. Qué protege y qué no

La compuerta por token mantiene la liga fuera de circulación. **No** es autenticación: no sabe
quién entró y no distingue entre personas. Quien tenga la liga, entra; si la liga se reenvía,
entra quien la reciba.

La compuerta de MAIA sí identifica al usuario, con la fuerza que tenga el SSO de MAIA.

Para datos verdaderamente sensibles haría falta autenticación con backend y control de acceso
por registro. Decirlo por escrito es parte del entregable.

---

## 9. Descargas detrás de la compuerta

Si el reporte ofrece un PDF, **no es un enlace normal**.

El archivo está detrás de la misma compuerta, y la sesión dura una hora (12 en modo token).
Con la pestaña abierta más tiempo que eso, el servidor contesta el **HTML de la compuerta** y el
navegador lo guarda con nombre de PDF. El usuario abre un archivo corrupto y no sabe por qué.

El botón:

1. Pide el archivo.
2. Comprueba que lo que volvió **sea** un PDF: código de respuesta **y** `content-type`,
   porque la compuerta también puede contestar 200 con HTML.
3. Sólo entonces lo guarda.
4. Si la sesión caducó, lo dice y recarga. En MAIA eso lo regresa por el SSO; en modo token la
   liga ya no trae su `?token=` (el 302 se lo quitó), así que sale la pantalla que pide la liga
   completa, y se vuelve a abrir la que le compartieron.

Y el nombre del archivo **se busca en su carpeta al construir**, no se escribe a mano: trae
fecha y folio, así que clavarlo deja el botón apuntando a un archivo que ya no existe en la
próxima exportación, sin ningún error hasta que alguien le da clic.
