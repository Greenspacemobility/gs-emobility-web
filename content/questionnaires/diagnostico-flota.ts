import type { QuestionnaireTemplate } from './types'

/** Diagnóstico de electrificación de flota.
 *  Fuente: cuestionario GSEM de levantamiento operativo y energético (oct 2026).
 *  Las preguntas conservan la numeración del documento original. */
export const diagnosticoFlota: QuestionnaireTemplate = {
  id: 'diagnostico-flota',
  title: 'Diagnóstico de electrificación',
  intro:
    'Este cuestionario recopila la información necesaria para evaluar la factibilidad técnica, el ahorro económico y el despliegue de unidades eléctricas, y para definir la infraestructura de carga en su base y, cuando sea viable, en los CEDIS de sus clientes. Es una solicitud de información: no presupone compatibilidad con ninguna marca o modelo en particular.',
  confidentiality:
    'Uso confidencial. La información se emplea únicamente para preparar el diagnóstico y la propuesta de Greenspace E-mobility. Sus respuestas se guardan automáticamente: puede cerrar esta página y continuar después con el mismo enlace.',

  sections: [
    {
      id: 'generales',
      title: 'Datos generales y alcance',
      fields: [
        { id: 'empresa', label: 'Empresa / razón social', type: 'texto', required: true },
        { id: 'contacto_operaciones', label: 'Responsable de operaciones (nombre, cargo, correo, teléfono)', type: 'parrafo', required: true },
        { id: 'contacto_energia', label: 'Responsable de mantenimiento y energía (nombre, cargo, correo, teléfono)', type: 'parrafo' },
        { id: 'bases', label: 'Base(s) operativa(s): dirección y coordenadas', type: 'parrafo', required: true },
        { id: 'fecha_respuesta', label: 'Fecha de respuesta', type: 'fecha' },
        { id: 'periodo_datos', label: 'Periodo de los datos que reporta', type: 'texto', help: 'Por ejemplo: julio–septiembre 2026' },
      ],
    },
    {
      id: 'unidades',
      title: '1. Perfil de las unidades',
      fields: [
        { id: 'q01', label: '¿Qué configuración tienen las unidades: tractocamiones, rígidos, quinta rueda, rabones, torton u otra? Indique cantidad por tipo.', type: 'parrafo', required: true },
        { id: 'q02', label: 'Por unidad: marca, modelo, año, combustible, kilometraje acumulado, norma de emisiones y fecha prevista de reemplazo.', type: 'parrafo', help: 'Si lo tiene en Excel, puede resumir aquí y adjuntar el archivo más abajo.' },
        { id: 'q03', label: '¿Cuál es la configuración de carga: número de ejes, peso bruto vehicular/combinado, remolque, dimensiones y capacidad útil?', type: 'parrafo' },
        { id: 'q04', label: '¿Cuál es el peso transportado real típico y máximo por viaje? ¿Qué porcentaje de viajes va vacío y con retorno?', type: 'parrafo' },
        { id: 'q05', label: '¿Usan equipos auxiliares que consuman energía (refrigeración, toma de fuerza, elevador, aire acondicionado estacionario)?', type: 'parrafo' },
        { id: 'q06', label: '¿Hay restricciones operativas para incorporar un modelo eléctrico (maniobrabilidad, altura, rampas, carga por eje)?', type: 'parrafo' },
      ],
    },
    {
      id: 'rutas',
      title: '2. Rutas, kilometraje y patrones de despacho',
      fields: [
        { id: 'q07', label: '¿Cuál es el origen y destino habitual por viaje? Comparta clientes, CEDIS y domicilios, al menos con alcaldía/municipio.', type: 'parrafo', required: true },
        { id: 'q08', label: '¿Qué rutas o circuitos opera cada unidad? Indique recorridos reales y retorno a base.', type: 'parrafo' },
        { id: 'q09', label: '¿Cuántos km diarios promedio, máximo y percentil 90 realiza cada unidad? ¿Cuántos km por viaje o ciclo?', type: 'parrafo', required: true },
        { id: 'q10', label: '¿Cuántos viajes, entregas, recolecciones y paradas hace cada unidad por turno y por día?', type: 'parrafo' },
        { id: 'q11', label: '¿Cuántos días por semana y turnos por día opera? ¿Hay picos por temporada, día de la semana o cliente?', type: 'parrafo' },
        { id: 'q12', label: '¿Qué proporción del recorrido es urbana, periférica y carretera? ¿Qué pendientes y vialidades críticas se presentan?', type: 'parrafo' },
        { id: 'q13', label: '¿Qué kilómetros de reposicionamiento o vacío y qué desvíos se realizan normalmente?', type: 'parrafo' },
        { id: 'q14', label: '¿Es posible entregar 30–60 días de GPS por unidad (fecha/hora, distancia, velocidad, paradas y ubicación)?', type: 'si-no', help: 'Es el dato que más precisión aporta al dimensionamiento.' },
      ],
    },
    {
      id: 'ventanas',
      title: '3. Ventanas, tiempos y disponibilidad para carga',
      intro: 'Esta sección define si la carga puede hacerse de noche en base, de oportunidad en ruta, o ambas. Es la que más condiciona el diseño.',
      fields: [
        { id: 'q15', label: '¿A qué hora sale y regresa cada unidad a base, por turno? ¿Cuánto permanece estacionada entre ciclos?', type: 'parrafo', required: true },
        { id: 'q16', label: '¿Cuáles son las ventanas obligatorias de entrega y recolección por cliente? ¿Qué penalizaciones aplican por atrasos?', type: 'parrafo' },
        { id: 'q17', label: '¿Cuánto duran carga, descarga, fila, espera, validación, descanso y tránsito en cada sitio?', type: 'parrafo' },
        { id: 'q18', label: '¿Cuánto tiempo sin movimiento hay en base y en cada CEDIS? Indique por franjas horarias.', type: 'parrafo', required: true },
        { id: 'q19', label: '¿Las unidades regresan siempre a la misma base o pernoctan fuera? ¿Hay doble turno o intercambio de conductores?', type: 'parrafo' },
        { id: 'q20', label: '¿Cuáles son los picos de despacho simultáneo y cuántas unidades deben estar listas a la misma hora?', type: 'parrafo', required: true },
        { id: 'q21', label: '¿Los horarios o secuencias podrían ajustarse para aprovechar carga nocturna o de oportunidad sin afectar el SLA?', type: 'parrafo' },
      ],
    },
    {
      id: 'costos',
      title: '4. Combustible, rendimiento y costos actuales',
      intro: 'Con esta sección se construye la comparación económica contra la operación actual.',
      fields: [
        { id: 'q22', label: '¿Cuál es el rendimiento real por unidad (km/L diésel o km/kg GNV) en operación urbana y mixta?', type: 'parrafo', required: true },
        { id: 'q23', label: '¿Cuál es el consumo mensual de combustible por unidad y el precio promedio pagado, con impuestos y descuentos?', type: 'parrafo', required: true },
        { id: 'q24', label: '¿Cuántas horas de ralentí por turno se registran y cuál es el consumo aproximado en ralentí?', type: 'parrafo' },
        { id: 'q25', label: '¿Cuáles son los gastos de mantenimiento correctivo y preventivo, llantas y refacciones por unidad (mensuales y por km)?', type: 'parrafo' },
        { id: 'q26', label: '¿Cuál es el costo actual de propiedad, renta o leasing, seguros, tenencia y disponibilidad mecánica?', type: 'parrafo' },
        { id: 'q27', label: '¿Qué meta económica mínima justificaría sustituir las unidades (TCO, ahorro mensual, costo/km, plazo de recuperación)?', type: 'parrafo', required: true },
      ],
    },
    {
      id: 'infraestructura',
      title: '5. Infraestructura eléctrica en patio y CEDIS',
      intro: 'Determina cuántos cargadores caben, con qué potencia y qué obra eléctrica hace falta.',
      fields: [
        { id: 'q28', label: '¿Cuál es la dirección, superficie y régimen de ocupación de la base? ¿Cuántos cajones y qué radios de giro existen?', type: 'parrafo', required: true },
        { id: 'q29', label: '¿Hay acometida eléctrica disponible? Indique tarifa, demanda máxima (kW), consumo (kWh), tensión y capacidad contratada.', type: 'parrafo', required: true, help: 'Si puede adjuntar los recibos del último año, mucho mejor.' },
        { id: 'q30', label: '¿Existen transformadores, subestación, alimentadores y capacidad remanente documentada por un electricista?', type: 'parrafo' },
        { id: 'q31', label: '¿Cuántas posiciones podrían instalarse con cargadores DC? ¿Hay espacio para canalizaciones, gabinetes, transformadores y protección civil?', type: 'parrafo' },
        { id: 'q32', label: '¿Existe energía solar, generación de respaldo o un proyecto fotovoltaico? ¿Hay limitaciones de interconexión?', type: 'parrafo' },
        { id: 'q33', label: '¿En qué CEDIS de clientes se podría instalar recarga? ¿Quién autoriza obra, acceso, permanencia y consumo eléctrico?', type: 'parrafo' },
        { id: 'q34', label: '¿Requieren recarga exclusiva en patio, de oportunidad en CEDIS o una combinación? ¿Se permiten equipos compartidos y carga secuenciada?', type: 'parrafo' },
        { id: 'q35', label: '¿Hay restricciones por horarios, acceso, seguridad, incendios, arrendamiento o continuidad de la operación?', type: 'parrafo' },
      ],
    },
    {
      id: 'proyecto',
      title: '6. Operación del proyecto y criterios de decisión',
      fields: [
        { id: 'q36', label: '¿Buscan compra directa, arrendamiento, Truck-as-a-Service o un contrato de servicio integral por unidad?', type: 'opcion', options: ['Compra directa', 'Arrendamiento', 'Truck-as-a-Service', 'Contrato de servicio integral', 'Aún por definir'], required: true },
        { id: 'q37', label: '¿Quién financiaría y sería propietario de cargadores, conexión, obra civil, baterías y posible generación solar?', type: 'parrafo', required: true },
        { id: 'q38', label: '¿Quién pagaría la energía y con qué mecanismo se repartirían los consumos en instalaciones de terceros?', type: 'parrafo' },
        { id: 'q39', label: '¿Qué nivel de disponibilidad mínimo, capacidad de respaldo y autonomía de contingencia exigen?', type: 'parrafo' },
        { id: 'q40', label: '¿Qué sistemas de gestión y telemetría usan (TMS, GPS, combustible, mantenimiento) y qué datos pueden compartir?', type: 'parrafo' },
        { id: 'q41', label: '¿Cuál es la fecha objetivo para el piloto, la adopción completa y la duración del contrato? ¿Quién toma la decisión final?', type: 'parrafo', required: true },
        { id: 'q42', label: '¿Qué indicadores reportarán a su cliente (CO₂ evitado, costo/km, servicio a tiempo, energía, utilización, incidencias)?', type: 'parrafo' },
      ],
    },
  ],

  grids: [
    {
      id: 'matriz_unidades',
      title: 'Anexo A · Matriz por unidad',
      intro: 'Complete con promedios y máximos de los últimos 30–90 días. Si tiene telemetría, puede adjuntar el Excel o CSV en la sección de documentos y dejar esta tabla incompleta.',
      columns: [
        { id: 'tipo', label: 'Tipo / combustible', type: 'texto' },
        { id: 'km', label: 'km/día prom. / máx.', type: 'texto' },
        { id: 'viajes', label: 'Viajes/día', type: 'texto' },
        { id: 'carga', label: 'Carga útil (t)', type: 'texto' },
        { id: 'horario', label: 'Sale / regresa', type: 'texto' },
        { id: 'parqueada', label: 'Horas parqueada', type: 'texto' },
      ],
      fixedRows: ['U01','U02','U03','U04','U05','U06','U07','U08','U09','U10','U11','U12','U13'],
    },
    {
      id: 'rutas_cedis',
      title: 'Anexo B · Registro de ruta / cliente',
      intro: 'Añada una fila por ruta o CEDIS relevante.',
      columns: [
        { id: 'ruta', label: 'Ruta / CEDIS', type: 'texto' },
        { id: 'unidades', label: 'Unidad(es)', type: 'texto' },
        { id: 'km', label: 'Km ida/vuelta', type: 'texto' },
        { id: 'ventana', label: 'Ventana de entrega', type: 'texto' },
        { id: 'espera', label: 'Espera / parada (min)', type: 'texto' },
        { id: 'carga', label: 'Opción de carga', type: 'texto' },
      ],
      addRowLabel: 'Añadir ruta',
    },
  ],

  documentsTitle: 'Documentación solicitada',
  documentsIntro: 'No es obligatoria para enviar el cuestionario, pero cada documento reduce los supuestos del diagnóstico y acerca la propuesta a la realidad de su operación.',
  documents: [
    { id: 'gps', label: 'Bitácora GPS por unidad (30–90 días) con rutas, tiempos, paradas y kilometraje' },
    { id: 'combustible', label: 'Consumo y facturas de combustible, mantenimiento y disponibilidad (ideal: 12 meses)' },
    { id: 'rutas_doc', label: 'Listado de rutas, carga útil, horarios, SLA y ubicaciones de bases y CEDIS' },
    { id: 'electrico', label: 'Plano del patio, foto de la acometida o subestación, recibos de electricidad y diagrama unifilar' },
    { id: 'permisos', label: 'Permisos de acceso o carta de interés del cliente para evaluar cargadores en CEDIS' },
  ],

  deliverablesTitle: 'Qué entrega Greenspace a partir de sus respuestas',
  deliverables: [
    'Diagnóstico de compatibilidad por ruta y configuración de vehículo, con dimensionamiento energético (kWh/día, kWh/km) y márgenes de operación.',
    'Arquitectura de recarga: número y potencia de cargadores, esquema de carga nocturna y de oportunidad, potencia simultánea y fases de instalación, sujetas a estudio eléctrico.',
    'Caso económico comparativo por unidad y para la flota completa: CAPEX, OPEX, costo/km, TCO, opciones contractuales y estimación de emisiones evitadas.',
  ],
  closingNote:
    'Los resultados dependerán de mediciones reales, de las especificaciones del vehículo que se seleccione, de la disponibilidad de red, de las tarifas eléctricas, de los permisos y de las condiciones de sus clientes.',
}
