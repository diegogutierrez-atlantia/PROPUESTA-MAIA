import { Copyright, CreditCard, Database, FileSearch, FileX, Languages, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Moneda } from "@/lib/propuesta/tipos";

/**
 * Los términos y condiciones de Atlantia. Es TEXTO LEGAL: vive aquí una sola
 * vez y ninguna propuesta lo vuelve a escribir.
 *
 * ── DE DÓNDE SALE ──────────────────────────────────────────────────────────
 *
 * Del documento "Términos y condiciones del proyecto" (cuatro hojas, en
 * `documentacion/propuesta/terminos-y-condiciones.pdf`), palabra por palabra y
 * en su orden. Las negritas del documento van entre `**`. `pnpm terminos`
 * compara cada cláusula contra el PDF y revienta si una no está.
 *
 * Antes cada propuesta lo transcribía de imágenes. En una de las cinco
 * primeras se cayó la palabra "publicarla" de la cláusula de mora; en un texto
 * contractual eso no es un detalle. Por eso aquí y en ningún otro lado.
 *
 * ── LO ÚNICO QUE CAMBIA ENTRE PROPUESTAS ───────────────────────────────────
 *
 * La moneda de la primera cláusula de pago. Una propuesta en dólares dice
 * "Precios en USD…" (lo aprobó el área comercial, 2026-10). Nada más
 * se toca: si el área comercial cambia una cláusula, se cambia el PDF y luego
 * aquí, nunca al revés.
 */
export interface SeccionDeTerminos {
  subtitulo?: string;
  parrafos: string[];
}

export interface BloqueDeTerminos {
  titulo: string;
  icono: LucideIcon;
  secciones: SeccionDeTerminos[];
}

export function terminosYCondiciones(moneda: Moneda): BloqueDeTerminos[] {
  return [
    {
      titulo: "Términos de Pago",
      icono: CreditCard,
      secciones: [
        {
          parrafos: [
            `Precios en ${moneda} no incluyen IVA u otros impuestos aplicables dependientes del país.`,
            "Para estudios de **one shot o solicitud única** los términos de pago serán **50% de anticipo y 50% previo a la entrega**.",
            "Para estudios de **trackers mensuales y proyectos por olas** los términos de pago serán **prepago 100% en cada ola.**",
            "La presente cotización tiene una validez de 30 días; fuera de ese periodo podría necesitar recotización.",
          ],
        },
      ],
    },
    {
      titulo: "Términos y Condiciones de Cancelación y Mora",
      icono: FileX,
      secciones: [
        {
          subtitulo: "Proyectos One Shot (cuantitativos y cualitativos)",
          parrafos: [
            "En caso de cancelación del proyecto o postergación de más de 30 días del mismo, se cobrará lo equivalente a su etapa de desarrollo, es decir, 20% del monto total antes del diseño de herramientas y/o programación, 30% cuando la programación o el manual de contenidos está diseñado, 50% después de ser iniciado el campo y 100% una vez terminado el campo.",
            "El proceso de **cancelación deberá ser por notificación escrita.** Posterior a esta cancelación y en caso de que el monto del anticipo no cubra el porcentaje de la cláusula anterior, Atlantia generará una **factura por el valor restante que deberá pagarse en los siguientes 15 días**.",
            "En caso de haberse realizado un descuento por compra conjunta de proyectos y cancelar este proyecto, el cliente deberá cubrir el total original sin descuento por compra conjunta o restante pendiente sin el descuento por compra conjunta.",
          ],
        },
        {
          subtitulo: "Proyectos de Suscripción o Múltiples Olas",
          parrafos: [
            "En caso de cancelación de proyectos anuales, suscripciones o con más de una ola previo al cumplimiento total del estudio, el cliente deberá cubrir el costo del mes corriente o la ola completa, además de los costos de inversión en los que se haya incurrido para todo el proyecto. Estos se detallarán en un porcentaje del proyecto durante el “Inicio del Proyecto” del mismo y serán divididos entre el número de periodos.",
            "En caso de haberse realizado un **descuento por compra conjunta de proyectos y cancelar este proyecto,** el cliente deberá cubrir el total original sin descuento por compra conjunta o restante pendiente sin el descuento por compra conjunta.",
          ],
        },
        {
          subtitulo: "Mora o Retrasos en Pagos",
          parrafos: [
            "A la generación de la factura se acordará por correo electrónico una fecha de pago por parte del cliente; en caso de incumplimiento de esta fecha se aplicarán intereses moratorios del 0.5% diario del remanente de pago que se ejecutará a través de una factura emitida el día posterior a la fecha de pago efectivo de la factura y que deberá pagarse en un periodo no mayor a 15 días.",
            "En caso de **impago o mora superior a 60 días** sin acuerdo por las partes, Atlantia procederá legalmente para la ejecución del pago de dicha factura, en este caso la información pasará a ser propiedad de Atlantia y podrá usarla, publicarla, promocionarla o venderla como Atlantia desee.",
            "El **inicio del proyecto, las fechas de entrega y los entregables del mismo están condicionados a los tiempos de pago definidos,** en caso de cualquier variación en éstos puede implicar variaciones en las fechas y alcances.",
          ],
        },
      ],
    },
    {
      titulo: "Términos y Condiciones sobre los Alcances de Proyectos basados en Entrevistas (CAWI, CATI, CAPI)",
      icono: FileSearch,
      secciones: [
        {
          subtitulo: "Generales:",
          parrafos: [
            "El alcance en términos de tamaño de la muestra, perfil, filtros, alcance geográfico, método de captura/levantamiento, metodología, módulos, etcétera, es solo el definido en esta cotización, en la opción aprobada de esta. Cualquier cambio o modificación a estos alcances requiere una recotización de tiempos y costos, incluyendo nuevas especificaciones o precisiones adicionales, que deberán ser aceptados por escrito por parte del cliente antes de que Atlantia realice los cambios.",
            "Los alcances en términos de análisis, cruces, revisiones, presentaciones físicas o virtuales, potenciales modificaciones a la visualización y ajustes a la presentación están también incluidos en la propuesta. Cualquier cambio o modificación a estos alcances requiere de una recotización de tiempos y costos que deberán ser aceptados por escrito por parte del cliente antes de que Atlantia realice los cambios.",
            "En caso de necesitar **un ajuste por parte del cliente de las fechas establecidas en el timeline**, se deberá revisar, en primer lugar y por parte de Atlantia, la factibilidad de las mismas. En caso positivo, Atlantia determinará si tiene **impacto en los costos del proyecto** y el cliente **deberá aceptar las implicaciones por escrito** antes de que Atlantia realice los cambios.",
            "Ninguno de nuestros proyectos incluye en el presupuesto **ninguna presentación ni análisis intermedios,** salvo los incluidos por defecto en los productos, como reportes flash o dashboards, que son predeterminados por Atlantia y no aceptan modificaciones. Si este servicio se requiere, se cotizará y se definirá su alcance aparte.",
          ],
        },
        {
          subtitulo: "Proyectos Ad-hoc basados en Entrevistas:",
          parrafos: [
            "Una vez que el proyecto esté en campo, no podrán realizarse cambios al perfil, al cuestionario o a la muestra; en caso de requerir cambios se ofrecerán dos alternativas: la cancelación del campo con las penalizaciones y los costos que suponen (que dependen del avance de muestra), o la contratación de un booster adicional.",
          ],
        },
        {
          subtitulo: "Proyectos Estandarizados basados en Entrevistas:",
          parrafos: [
            "Los productos estandarizados no permiten modificaciones al cuestionario, y solo se pueden añadir las preguntas extra incluidas en la propuesta. Cualquier cambio al cuestionario, algoritmos, KPIs, modelos, etcétera, cambia automáticamente el producto estandarizado a un producto Ad-hoc, por lo que deberá cotizarse nuevamente.",
          ],
        },
      ],
    },
    {
      titulo: "Términos y Condiciones sobre Bases de datos y Paneles",
      icono: Database,
      secciones: [
        {
          parrafos: [
            "Los perfiles incluidos en la cotización son de la base de datos de Atlantia; si el cliente solicita el uso de una **base de datos diferente** podría impactar en el tiempo y costo del proyecto.",
            "Si el cliente decide **cambiar el uso de bases de Atlantia por otras del cliente o de terceros,** se realizará una **recotización de tiempos, costos y alcances** que deberá aceptarse por escrito por parte del cliente antes de que Atlantia realice los cambios.",
            "En caso de bases de datos aportadas por el cliente o de terceras partes, Atlantia no se compromete a un número de muestra determinado, sino a un conjunto de esfuerzos y acciones a realizar. Una vez terminadas estas acciones, se analizarán los datos con la muestra obtenida. En caso de que el cliente necesite una muestra mayor a la obtenida, se recotizarán tiempos y costos de las acciones y deberán aprobarse por escrito previo a su ejecución.",
            "La tasa de respuesta depende de la efectividad de la base de datos del cliente o de terceros y está fuera de control de Atlantia, por lo cual ésta última no puede garantizar ningún volumen de respuestas ni ninguna tasa de respuesta efectiva. Atlantia, basándose en su experiencia, podrá hacer estimaciones, pero EN NINGÚN CASO se compromete a un resultado final en volumen o tasa de respuesta de dichas bases.",
          ],
        },
      ],
    },
    {
      titulo: "Términos y Condiciones de los Estudios Cualitativos",
      icono: MessagesSquare,
      secciones: [
        {
          parrafos: [
            "Una vez iniciado, en proceso o terminado el reclutamiento de personas, cualquier cambio y/o modificación del perfil después de los acuerdos en el filtro inicial requerirá el pago del 100% del importe del reclutamiento y se volverá a iniciar la etapa. Atlantia facturará el costo como un monto aparte del proyecto y deberá pagarse 15 días después de emitida la factura.",
            "En caso de rechazo de un perfil, se solicitarán detalles del rechazo para evitar contratiempos en el reclutamiento y duplicidad de trabajo.",
            "En caso de haber **modificación o cambio de perfiles**, los tiempos de entrega de reporte se aplazarán y se ajustará la cotización.",
            "El tiempo máximo de cancelación o ajuste de fecha de dinámicas cualitativas será de 1 semana antes de iniciar el reclutamiento, de lo contrario, será cobrado el 100% del reclutamiento, el 100% de la plataforma o cámara, según aplique, y el 50% de los incentivos, derivado de los costos ya comprometidos al momento de la cancelación o ajuste. Los costos ya comprometidos se facturarán bajo los términos descritos anteriormente.",
            "Las evidencias de entrevistas, sesiones grupales o de visitas de mystery shopper son de **uso interno para el cliente**, se entregarán únicamente para **verificación y/o consulta** y no podrán usarse para fines promocionales y de publicidad. Queda estrictamente **prohibido contactar a los participantes** y, de ninguna forma, revelar la identidad y otros datos personales de los participantes.",
            "El **tiempo de las entrevistas o sesiones estará definido en la cotización** y no será posible ampliarlo o extenderlo durante la ejecución del proyecto.",
          ],
        },
      ],
    },
    {
      titulo: "Términos y Condiciones sobre Autoría de contenido de la Propuesta de trabajo y Cotización",
      icono: Copyright,
      secciones: [
        {
          parrafos: [
            "Esta propuesta es de uso estricto y exclusivo para fines de licitación de un proyecto o por solicitud específica de parte del cliente, y para la cual explícitamente se elaboró.",
            "Toda **la información contenida** en esta propuesta **es propiedad de Atlantia,** su autor y quien en todo momento se reserva el derecho. Por tanto, el RECEPTOR de esta propuesta **se obliga expresamente a no compartir ni replicar, parcial o totalmente,** los detalles de dicha propuesta y su cotización con terceros.",
          ],
        },
      ],
    },
    {
      titulo: "Términos y Condiciones sobre servicio de Traducción",
      icono: Languages,
      secciones: [
        {
          parrafos: [
            "Todos nuestros **reportes de resultados** se entregan en **idioma español** para clientes en Iberoamérica.",
            "En caso de requerir la traducción a otro idioma, deberá solicitarse e incluirse el costo extra correspondiente en la etapa de cotización. Dicho monto podrá ser ajustado una vez terminado el proyecto debido a una mayor extensión del reporte resultante y deberá ser aceptado por escrito por parte del cliente antes de que Atlantia realice la traducción.",
            "La traducción se realizará una vez que el reporte final en español esté aprobado al 100%. Si existiera algún ajuste al reporte final en español posterior al inicio de la traducción, se contemplarán dos opciones: el cliente cubre el costo extra por el ajuste pudiendo modificarse también los tiempos de entrega, u omite esos ajustes en la traducción final.",
            "Si se requiere la **traducción de material adicional al reporte de resultados,** como resumen ejecutivo, documento de una página, base de datos u otro formato derivado del proyecto, se incluirá en los costos extra de traducción al inicio o al final del proyecto según corresponda a la solicitud del cliente. De igual forma, el monto de la traducción de materiales adicionales deberá aceptarse por escrito por parte del cliente antes de que Atlantia realice la traducción.",
          ],
        },
      ],
    },
  ];
}

/** La línea de pie de toda cotización: sale de los términos de pago. */
export function pieDeCotizacion(moneda: Moneda) {
  return `Precios en ${moneda}, no incluyen IVA. La presente cotización tiene una validez de 30 días; fuera de ese periodo podría necesitar recotización.`;
}

/**
 * Cómo se rotula la moneda junto a cada monto. En pesos va "+ IVA"; en
 * dólares va sola, como lo aprobó el área comercial (2026-10): la cotización
 * en dólares es para clientes fuera de México.
 */
export function rotuloDeMoneda(moneda: Moneda) {
  return moneda === "MXN" ? "MXN + IVA" : moneda;
}
