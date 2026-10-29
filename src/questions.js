// Banco de preguntas de seguridad vial y comunitaria para niños
// Diseñadas pedagógicamente para educar con valor real en el trayecto colegio - casa.

export const QUESTION_BANK = {
  start: [
    {
      id: 'start_1',
      badge: '🏫 Salida de la Escuela',
      question: (name) => `¡Hola ${name}! La campana sonó y las clases terminaron, pero la persona que te recoge aún no llega. ¿Qué debes hacer?`,
      options: [
        'Irme caminando solo apurado para ganar tiempo',
        'Quedarme dentro del colegio con mi profesora o el encargado y esperar con calma',
        'Irme con cualquier persona que me diga que me conoce'
      ],
      answer: 1,
      celebration: '¡Excelente decisión! La escuela es un lugar seguro para esperar.',
      explanation: 'Si mamá o papá se retrasan, nunca salgas solo. Quedarte con tu profesora o en la portería del colegio garantiza que estés protegido hasta que lleguen por ti.'
    },
    {
      id: 'start_2',
      badge: '🎒 Inicio de la Ruta',
      question: (name) => `Un adulto desconocido se te acerca en la puerta y te dice: "Tu mamá me mandó a recogerte rápido, ven". ¿Qué haces, ${name}?`,
      options: [
        '¡Digo NO con firmeza, retrocedo y aviso de inmediato a un profesor o policía escolar!',
        'Le creo y me subo a su auto o moto',
        'Me voy con él si me promete comprarme un dulce'
      ],
      answer: 0,
      celebration: '¡Súper explorador alerta! Tienes una regla de oro de seguridad.',
      explanation: 'Mamá nunca enviará a un desconocido sin avisarte con una clave secreta familiar. Si alguien insiste, pide ayuda fuerte a los profesores.'
    }
  ],

  cruce: [
    {
      id: 'cruce_1',
      badge: '🚦 Cruce con Semáforo',
      question: (name) => `Llegaste a una esquina concurrida con semáforo peatonal. ¿Cuándo es el momento seguro para cruzar?`,
      options: [
        'Cuando el muñequito peatonal esté en VERDE y los autos se hayan detenido por completo',
        'Cuando el muñequito peatonal esté en ROJO pero no vea ningún auto cerca',
        'Correr cuando el muñeco verde parpadee rápido antes de que cambie'
      ],
      answer: 0,
      celebration: '¡Bien visto! Siempre esperamos la luz verde y confirmamos que los autos pararon.',
      explanation: 'Aunque el muñequito esté en verde, siempre debemos mirar a la izquierda y derecha para verificar que ningún carro doble de sorpresa.'
    },
    {
      id: 'cruce_2',
      badge: '🚸 Cruce Peatonal',
      question: (name) => `Tu pelota o un juguete rueda hacia la pista mientras caminas por la vereda. ¿Qué es lo más seguro?`,
      options: [
        'Correr detrás del juguete rápido antes de que lo pise un carro',
        'Detenerme en la vereda, NO bajar a la pista y pedirle ayuda a un adulto responsable',
        'Empujar a un compañero para que lo recoja'
      ],
      answer: 1,
      celebration: '¡Muy inteligente! Las cosas se pueden reemplazar, tu vida y seguridad son lo primero.',
      explanation: 'Los conductores no siempre pueden ver a un niño pequeño agachándose en la pista. Quédate en la vereda y pide ayuda a un adulto.'
    },
    {
      id: 'cruce_3',
      badge: '👀 Atención en la Calle',
      question: (name) => `Vas a cruzar una calle donde no hay semáforo pero sí paso de cebra (líneas blancas). ¿Cómo cruzas seguro?`,
      options: [
        'Cruzar mirando la pantalla del celular o jugando distraído',
        'Mirar a la izquierda, luego a la derecha, y otra vez a la izquierda, caminando con paso firme',
        'Cruzar en diagonal corriendo con los ojos cerrados'
      ],
      answer: 1,
      celebration: '¡Visión de águila! La regla de mirar a ambos lados te protege siempre.',
      explanation: 'Caminar atentos y mirar dos veces nos permite escuchar y ver motos, bicicletas o autos antes de cruzar la calzada.'
    }
  ],

  bodega: [
    {
      id: 'bodega_1',
      badge: '🛒 Bodega Amiga del Barrio',
      question: (name) => `Estás pasando por la bodega de confianza. Si notas que alguien sospechoso te sigue o te sientes inseguro en la calle, ¿qué haces?`,
      options: [
        'Entrar a la bodega de inmediato, saludar al bodeguero y pedirle que te ayude a llamar a mamá',
        'Esconderme en un callejón oscuro y solitario',
        'Echarme a correr sin rumbo gritando'
      ],
      answer: 0,
      celebration: '¡Gran estrategia! Los comercios concurridos y vecinos conocidos son escudos de protección.',
      explanation: 'Las bodegas tienen personas que conocen a los vecinos y a tu familia. Es un espacio iluminado y seguro para pedir auxilio.'
    },
    {
      id: 'bodega_2',
      badge: '🛒 Punto de Apoyo',
      question: (name) => `¿Por qué mamá eligió esta bodega como un punto de referencia en tu camino, ${name}?`,
      options: [
        'Porque es un lugar conocido y transitado donde siempre hay personas de confianza si necesito ayuda',
        'Solo para que gaste mis propinas en dulces',
        'Para quedarme jugando horas en la puerta'
      ],
      answer: 0,
      celebration: '¡Correcto! Los puntos de referencia nos ayudan a orientarnos y sentirnos acompañados.',
      explanation: 'Tener tiendas amigas en el mapa ayuda a que nunca te sientas desorientado en el trayecto.'
    }
  ],

  farmacia: [
    {
      id: 'farmacia_1',
      badge: '💊 Farmacia o Botica',
      question: (name) => `La farmacia cuenta con buena iluminación, personal visible y teléfono. Si necesitas comunicarte con tu mamá urgentemente, ¿a quién le pides ayuda?`,
      options: [
        'Al personal uniformado que atiende en el mostrador de la farmacia',
        'A un desconocido que esté afuera mirando hacia los lados',
        'A nadie, me quedo sentado llorando afuera'
      ],
      answer: 0,
      celebration: '¡Exacto! El personal de salud y atención es formal y te brindará apoyo inmediato.',
      explanation: 'El personal de las farmacias está identificado con uniforme y puede prestar su teléfono fijo o llamar al número de mamá que te sabes de memoria.'
    }
  ],

  parque: [
    {
      id: 'parque_1',
      badge: '🌳 Parque Vecinal',
      question: (name) => `Al caminar por el parque de regreso a casa, ¿por qué camino es mejor y más seguro transitar?`,
      options: [
        'Por la vereda principal iluminada donde pasean familias y vecinos',
        'Por detrás de los arbustos tupidos y zonas oscuras donde no hay nadie',
        'Por donde no haya luz para que nadie me vea'
      ],
      answer: 0,
      celebration: '¡Muy bien pensado! La visibilidad y la compañía de la comunidad son tu mayor seguridad.',
      explanation: 'Las zonas despejadas e iluminadas evitan tropiezos y permiten que las personas alrededor puedan ayudarte ante cualquier eventualidad.'
    },
    {
      id: 'parque_2',
      badge: '🌳 Amabilidad y Cuidado',
      question: (name) => `En el parque, un desconocido amable te ofrece llevarte a ver unos perritos cachorros a su casa. ¿Qué debes hacer?`,
      options: [
        'Decir: "No gracias, voy directo a mi casa con mi familia" y mantenerme cerca de otras personas',
        'Ir con él porque los cachorros son tiernos',
        'Aceptarle caramelos y guardar el secreto'
      ],
      answer: 0,
      celebration: '¡Brillante! Nunca nos desviamos de la ruta segura acordada con mamá.',
      explanation: 'Nadie debe pedirte secretos ni invitarte a lugares fuera de tu ruta. Tu misión principal es llegar a casa.'
    }
  ],

  seguro: [
    {
      id: 'seguro_1',
      badge: '🛡️ Punto Seguro Familiar',
      question: (name) => `¡Llegaste a un Punto Seguro marcado por mamá! Si en el camino sientes que te perdiste, ¿qué debes hacer?`,
      options: [
        'Llegar a este punto seguro conocido, respirar con calma y pedir a la persona a cargo que llame a mamá',
        'Seguir caminando a ver si de casualidad llego a algún lado',
        'Ponerme a llorar sin pedir ayuda'
      ],
      answer: 0,
      celebration: '¡Magnífica memoria! Para esto mamá y tú planearon este Punto Seguro.',
      explanation: 'Un punto seguro es como tu "base secreta": ahí te conocen, saben quién eres y podrán contactar a tu familia en minutos.'
    }
  ],

  camino: [
    {
      id: 'camino_1',
      badge: '👣 En Pleno Camino',
      question: (name) => `Estás a mitad de camino y tienes dudas sobre si debías doblar a la izquierda o derecha. ¿Qué haces?`,
      options: [
        'Me detengo en una vereda amplia frente a una casa o tienda, reviso mi mapa o pregunto en un negocio seguro',
        'Comienzo a correr asustado a cualquier dirección',
        'Me siento en la pista a esperar'
      ],
      answer: 0,
      celebration: '¡Actitud de explorador sabio! Detenerse y ubicarse con calma evita desorientarse.',
      explanation: 'Cuando tenemos dudas, parar un momento y mirar los puntos conocidos del mapa nos devuelve la confianza.'
    }
  ],

  fin: [
    {
      id: 'fin_1',
      badge: '🏠 ¡Llegada a Casa!',
      question: (name) => `¡Bravo ${name}! Has llegado a tu meta y destino seguro. ¿Qué es lo primero y más importante al entrar a casa?`,
      options: [
        'Avisar con un abrazo que ya llegué sano y salvo, y lavarme las manos',
        'Dejar la puerta abierta de par en par e irme a dormir',
        'Salir corriendo otra vez a la calle sin avisar'
      ],
      answer: 0,
      celebration: '¡Misión Cumplida con honores! Llegaste como todo un campeón.',
      explanation: 'Confirmar tu llegada llena de tranquilidad el corazón de mamá y de toda la familia.'
    }
  ]
};

// Obtiene una pregunta contextual adecuada para el hito
export function getQuestionForPoi(poiType, childName = 'campeón', questionIndex = 0) {
  const pool = QUESTION_BANK[poiType] || QUESTION_BANK.camino;
  const item = pool[questionIndex % pool.length];
  return {
    badge: item.badge,
    question: item.question(childName),
    options: item.options,
    answer: item.answer,
    celebration: item.celebration,
    explanation: item.explanation
  };
}
