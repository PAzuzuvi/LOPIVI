import { QuizQuestion } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'LOPIVI y Definiciones',
    icon: '⚖️',
    question: 'Según la Ley Orgánica 8/2021 (LOPIVI), ¿cómo se define la violencia contra la infancia y la adolescencia?',
    options: {
      a: 'Solo la acción física intencionada que una persona adulta ejerce contra un menor de edad.',
      b: 'Toda acción, omisión o trato negligente que priva al menor de sus derechos y bienestar o interfiere su desarrollo, sea cual sea su forma o medio.',
      c: 'Únicamente las conductas que estén tipificadas como delito en el Código Penal contra menores.',
      d: 'Todo acto producido en el ámbito familiar que cause lesiones físicas o psíquicas acreditadas al menor.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'La LOPIVI adopta un concepto amplio: incluye acciones, omisiones y trato negligente, con independencia de la forma y del medio de comisión, también el digital. Las otras opciones restringen el concepto a la violencia física, a la penal o a la familiar, cuando la ley abarca todos los ámbitos.'
  },
  {
    id: 2,
    category: 'Buen Trato',
    icon: '🌱',
    question: '¿Cuál de las siguientes descripciones corresponde al concepto de «buen trato» que sirve de punto de partida de la LOPIVI?',
    options: {
      a: 'El que se limita a evitar cualquier agresión física y a sancionar a quien la comete.',
      b: 'El que sustituye la participación del menor por la decisión de las personas adultas responsables.',
      c: 'El que se centra en la corrección de conductas mediante normas disciplinarias estrictas.',
      d: 'El que respeta los derechos fundamentales y promueve el respeto mutuo, la dignidad, la convivencia democrática y la solución pacífica de conflictos.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'El buen trato es un enfoque activo y positivo, basado en los derechos fundamentales de niños, niñas y adolescentes, la igualdad de oportunidades y la no discriminación. No se reduce a evitar agresiones ni a disciplinar, ni excluye la participación del menor.'
  },
  {
    id: 3,
    category: 'Deber de Comunicación',
    icon: '📢',
    question: 'Según el artículo 15 de la LOPIVI, ¿quién está obligado a comunicar los indicios de una situación de violencia sobre una persona menor de edad?',
    options: {
      a: 'Toda persona que advierta esos indicios, de forma inmediata y a la autoridad competente.',
      b: 'Solo los profesionales sanitarios y docentes que atiendan al menor en su trabajo.',
      c: 'Únicamente los progenitores o representantes legales del menor afectado.',
      d: 'Las personas que tengan certeza plena de que los hechos son constitutivos de delito.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'El deber de comunicación general recae sobre toda la ciudadanía y basta con advertir indicios, no hace falta certeza. Si los hechos pudieran ser delito, se comunica a las Fuerzas y Cuerpos de Seguridad, al Ministerio Fiscal o a la autoridad judicial, sin perjuicio de atender de inmediato a la víctima.'
  },
  {
    id: 4,
    category: 'Ámbito Escolar y Protección',
    icon: '🏫',
    question: 'Una orientadora de un centro escolar detecta indicios de una posible situación de violencia hacia un alumno. Conforme al deber de comunicación cualificado, ¿qué debe hacer?',
    options: {
      a: 'Esperar a confirmar los hechos con una investigación interna antes de informar a nadie.',
      b: 'Informar únicamente a la dirección del centro, que decidirá si lo comunica fuera.',
      c: 'Comunicarlo de inmediato a los servicios sociales competentes y, si la salud o seguridad del menor está amenazada, a las Fuerzas y Cuerpos de Seguridad y/o al Ministerio Fiscal.',
      d: 'Comunicarlo a la familia y esperar a que esta decida si presenta denuncia.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'El artículo 16 exige a quienes trabajan con menores comunicar de forma inmediata a los servicios sociales y, ante riesgo para la salud o seguridad, también a las Fuerzas y Cuerpos de Seguridad y/o al Ministerio Fiscal. No se puede demorar la comunicación ni dejarla en manos de terceros.'
  },
  {
    id: 5,
    category: 'Protección de Datos',
    icon: '🔒',
    question: 'Un profesional que trabaja con menores advierte una posible infracción de la normativa de protección de datos personales de un niño. ¿A quién debe comunicarlo de forma inmediata?',
    options: {
      a: 'Al Defensor del Pueblo.',
      b: 'A la Agencia Española de Protección de Datos.',
      c: 'Al Consejo General del Poder Judicial.',
      d: 'Al Observatorio de la Infancia.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'El artículo 16 de la LOPIVI establece que las posibles infracciones de la normativa de protección de datos de personas menores de edad se comunican de inmediato a la Agencia Española de Protección de Datos. Los otros organismos existen, pero no son el destinatario previsto para este supuesto.'
  },
  {
    id: 6,
    category: 'Voz y Derechos del Menor',
    icon: '🗣️',
    question: 'Según el artículo 17 de la LOPIVI, ¿cómo pueden comunicar una situación de violencia los propios niños, niñas y adolescentes que la sufren o la presencian?',
    options: {
      a: 'Solo a través de sus representantes legales y con su autorización expresa.',
      b: 'Únicamente ante el Ministerio Fiscal y una vez cumplidos los catorce años.',
      c: 'Solo en el ámbito del centro escolar, ante el coordinador de bienestar.',
      d: 'Personalmente o a través de sus representantes legales, ante servicios sociales, Fuerzas y Cuerpos de Seguridad, Ministerio Fiscal o autoridad judicial.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'La ley reconoce al menor la posibilidad de comunicar por sí mismo, sin depender de un adulto, y obliga a las administraciones a ofrecer mecanismos seguros, accesibles y adaptados, como líneas telefónicas gratuitas de ayuda. No fija edad mínima ni limita el canal a un único organismo.'
  },
  {
    id: 7,
    category: 'Entorno Digital e Internet',
    icon: '🌐',
    question: 'Una persona descubre en Internet un contenido que constituye una forma de violencia contra un menor. Según el artículo 18 de la LOPIVI, ¿qué obligación tiene?',
    options: {
      a: 'Borrarlo por su cuenta y no hacer ninguna otra comunicación.',
      b: 'Compartirlo en redes para que otros usuarios puedan denunciarlo.',
      c: 'Comunicarlo a la autoridad competente y, si pudiera ser delito, a las Fuerzas y Cuerpos de Seguridad, al Ministerio Fiscal o a la autoridad judicial.',
      d: 'Guardarlo y esperar a que lo reclame el menor afectado.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'La obligación alcanza a cualquier persona, física o jurídica, que advierta contenidos ilícitos en Internet. Difundirlos o actuar por cuenta propia puede aumentar el daño a la víctima y entorpecer la investigación.'
  },
  {
    id: 8,
    category: 'Servicios Sociales',
    icon: '🛡️',
    question: '¿Qué condición tiene el personal funcionario de los servicios sociales cuando ejerce sus funciones de protección de niños, niñas y adolescentes?',
    options: {
      a: 'La de agente de la autoridad, pudiendo solicitar la colaboración de las Fuerzas y Cuerpos de Seguridad y de los servicios sanitarios.',
      b: 'La de mero auxiliar administrativo sin capacidad de pedir colaboración a otros servicios.',
      c: 'La de representante legal del menor mientras dure la intervención.',
      d: 'La de perito judicial con facultad para dictar medidas cautelares.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'La LOPIVI otorga la condición de agente de la autoridad a este personal funcionario, lo que le permite solicitar apoyo policial, sanitario o de cualquier servicio público necesario. No es representante legal del menor ni dicta medidas judiciales.'
  },
  {
    id: 9,
    category: 'Equipos Multidisciplinares',
    icon: '👥',
    question: '¿Cómo deben estar constituidos preferentemente los equipos de intervención de los servicios sociales que trabajan en violencia sobre personas menores de edad?',
    options: {
      a: 'Por profesionales de la medicina, la enfermería y la farmacia.',
      b: 'Por profesionales de la educación social, la psicología y el trabajo social y, cuando sea necesario, la abogacía.',
      c: 'Por profesionales de la criminología, la sociología y la economía.',
      d: 'Por personal voluntario de entidades del tercer sector coordinado por la policía.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'La ley prevé equipos multidisciplinares y especializados, formados preferentemente por educación social, psicología y trabajo social, con apoyo jurídico cuando sea necesario. La salud interviene como ámbito coordinado, no como núcleo de estos equipos.'
  },
  {
    id: 10,
    category: 'Registros y Estadísticas',
    icon: '📊',
    question: '¿Cómo se denomina el registro en el que se incorporan los datos estadísticos de casos de violencia contra la infancia procedentes de los servicios sociales y de las entidades públicas de protección?',
    options: {
      a: 'Registro Central de Penados.',
      b: 'Registro Civil de Menores.',
      c: 'Registro Unificado de Violencia Escolar.',
      d: 'Registro Unificado de Servicios Sociales sobre Violencia contra la Infancia (RUSSVI).'
    },
    correctAnswer: 'd',
    didacticExplanation: 'El RUSSVI es el antiguo Registro Unificado de Maltrato Infantil, que pasó a esta denominación con la LOPIVI. Los demás registros existen, pero tienen otra finalidad (antecedentes penales, estado civil o ámbito escolar).'
  },
  {
    id: 11,
    category: 'Detección Precoz',
    icon: '🔍',
    question: 'Cuando un profesional detecta precozmente una situación de violencia sobre una persona menor de edad, ¿a quién debe comunicárselo en primer lugar según la LOPIVI?',
    options: {
      a: 'A los progenitores o a quienes ejerzan la tutela, guarda o acogimiento, salvo que haya indicios de que ellos ejercen la violencia.',
      b: 'A los progenitores en todos los casos, sin excepción alguna, incluso si son sospechosos.',
      c: 'Únicamente al centro escolar, que decidirá si informa a la familia.',
      d: 'A los medios de comunicación locales, para sensibilizar a la comunidad sobre el caso.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'La detección precoz debe comunicarse a quienes ejercen la tutela, guarda o acogimiento, pero existe una excepción clave: si hay indicios de que la violencia proviene de ellos, no se les informa, para no poner en riesgo al menor. Informar a los medios vulneraría la confidencialidad.'
  },
  {
    id: 12,
    category: 'Parentalidad Positiva',
    icon: '👨‍👩‍👧',
    question: '¿Qué se entiende por parentalidad positiva a los efectos de la LOPIVI?',
    options: {
      a: 'El ejercicio de la patria potestad basado en la autoridad indiscutible de los progenitores.',
      b: 'La imposición de la custodia compartida cuando existe conflicto entre los progenitores.',
      c: 'El comportamiento parental basado en el interés superior del menor, que le permite crecer en un entorno afectivo y sin violencia y ser oído en lo que le afecta.',
      d: 'La delegación de la crianza en profesionales para evitar conflictos familiares.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'La parentalidad positiva se centra en el interés superior del menor, el afecto, la ausencia de violencia y el derecho a expresar su opinión y participar. La propia ley aclara que no debe usarse en conflictos entre progenitores ni para imponer una custodia compartida no acordada.'
  },
  {
    id: 13,
    category: 'Centros de Protección',
    icon: '🚫',
    question: 'En los centros de protección de menores, ¿qué tipo de contención está expresamente prohibida?',
    options: {
      a: 'La contención verbal mediante técnicas de desescalada.',
      b: 'La interposición física entre el menor y la persona en peligro.',
      c: 'La restricción de espacios cuando existe un riesgo grave e inminente.',
      d: 'La contención mecánica, que consiste en sujetar al menor a una cama articulada o a un objeto fijo.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'La ley prohíbe la contención mecánica. La desescalada es la primera respuesta prevista, y la contención física (interposición, restricción de espacios o movimientos y, en última instancia, inmovilización) solo se admite de forma excepcional y como último recurso.'
  },
  {
    id: 14,
    category: 'Límites de Actuación',
    icon: '⏱️',
    question: '¿Cuál es el límite máximo de duración del aislamiento provisional de un menor en un centro de protección?',
    options: {
      a: 'Seis horas, siempre que el menor esté acompañado.',
      b: 'Tres horas consecutivas, sin perjuicio de su derecho al descanso.',
      c: 'Veinticuatro horas, si lo autoriza la dirección del centro.',
      d: 'No existe límite temporal si se aplica como medida disciplinaria.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'El aislamiento no puede exceder de tres horas consecutivas, se aplica solo para prevenir actos violentos, autolesiones o daños graves, y nunca como medida disciplinaria. Durante todo ese tiempo el menor debe estar acompañado o supervisado de forma continua.'
  },
  {
    id: 15,
    category: 'Señales de Alerta',
    icon: '⚠️',
    question: 'Según las orientaciones sobre señales de alerta, ¿por qué es un error considerar menos graves los síntomas que el menor dirige hacia su interior (interiorización)?',
    options: {
      a: 'Porque el daño suele ser mayor y mucho más difícil de detectar, aunque cause menos molestias al entorno.',
      b: 'Porque los síntomas interiorizados siempre desaparecen solos con el paso del tiempo.',
      c: 'Porque solo los síntomas exteriorizados permiten confirmar que ha existido violencia.',
      d: 'Porque los síntomas interiorizados afectan únicamente al rendimiento escolar del menor.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'Las personas adultas y el sistema de protección tienden a valorar más las conductas exteriorizadoras porque afectan al entorno, pero cuando el menor vuelca el malestar hacia dentro (por ejemplo, autolesiones o aislamiento) el daño es mayor y más difícil de ver. Por eso hay que atender a ambas tendencias.'
  },
  {
    id: 16,
    category: 'Salud y Garantías Médicas',
    icon: '🩺',
    question: 'Cuando en un centro de protección se ha usado la fuerza al aplicar una medida de contención, ¿qué exige la ley en relación con la salud del menor?',
    options: {
      a: 'Una valoración de la propia educadora del centro en un plazo de una semana.',
      b: 'Una exploración médica solo si el menor la solicita expresamente.',
      c: 'La exploración física por un facultativo médico en un máximo de 48 horas, con el correspondiente parte médico.',
      d: 'Una revisión psicológica en el plazo máximo de un mes.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'Siempre que se haga uso de la fuerza, la exploración por un médico en un máximo de 48 horas es obligatoria y no depende de que el menor la pida. La medida también debe comunicarse de inmediato a la Entidad Pública y al Ministerio Fiscal y anotarse en el Libro Registro de Incidencias.'
  },
  {
    id: 17,
    category: 'Registro Central de Delincuentes Sexuales',
    icon: '📋',
    question: 'En relación con el Registro Central de Delincuentes Sexuales y de Trata de Seres Humanos, ¿qué ocurre con los antecedentes que figuran como cancelados?',
    options: {
      a: 'Impiden de forma definitiva el acceso a profesiones con contacto habitual con menores.',
      b: 'Deben comunicarse a la entidad empleadora durante cinco años más.',
      c: 'Obligan a cambiar al trabajador a un puesto sin contacto con menores.',
      d: 'No se toman en consideración para limitar el acceso y ejercicio de esas profesiones, oficios y actividades.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'La ley limita el acceso a quien tenga antecedentes vigentes por delitos contra la libertad e indemnidad sexuales o de trata, pero los antecedentes cancelados no se tienen en cuenta. Los antecedentes vigentes sí impiden la contratación en actividades con contacto habitual con menores.'
  },
  {
    id: 18,
    category: 'Estrategia Nacional',
    icon: '🏛️',
    question: '¿Quién aprueba la Estrategia nacional para la erradicación de la violencia sobre la infancia y la adolescencia y a propuesta de qué órgano?',
    options: {
      a: 'El Congreso de los Diputados, a propuesta del Defensor del Pueblo.',
      b: 'El Gobierno, a propuesta de la Conferencia Sectorial de Infancia y Adolescencia.',
      c: 'El Ministerio Fiscal, a propuesta del Consejo General del Poder Judicial.',
      d: 'Cada comunidad autónoma, a propuesta de su entidad pública de protección.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'La Estrategia, de carácter plurianual, la aprueba el Gobierno a propuesta de la Conferencia Sectorial de Infancia y Adolescencia y se acompaña de una memoria económica. Se elabora con la participación de niños, niñas y adolescentes a través del Consejo Estatal de Participación de la Infancia y de la Adolescencia.'
  },
  {
    id: 19,
    category: 'Diligencia Debida',
    icon: '⚖️',
    question: '¿Qué principio de la Estrategia obliga a los poderes públicos a prevenir, investigar, castigar y reparar los actos de violencia hacia la infancia, también en el contexto de actividades empresariales?',
    options: {
      a: 'Diligencia debida.',
      b: 'Accesibilidad universal.',
      c: 'Participación y protagonismo.',
      d: 'Igualdad y no discriminación.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'La diligencia debida exige actuar con rigor para prevenir, investigar, castigar y reparar la violencia. La accesibilidad universal se refiere a que los entornos y servicios sean accesibles para todos, la participación a escuchar al menor y la igualdad a no discriminar.'
  },
  {
    id: 20,
    category: 'Ámbito Laboral y Menores',
    icon: '🤝',
    question: 'A los efectos de la LOPIVI, ¿qué se consideran profesiones, oficios y actividades que implican contacto habitual con personas menores de edad?',
    options: {
      a: 'Solo las retribuidas que se desarrollan en centros educativos o sanitarios.',
      b: 'Las que se ejercen de forma ocasional pero con alta responsabilidad sobre los menores.',
      c: 'Las retribuidas o no que conllevan un trato repetido, directo y regular, y no meramente ocasional, con menores, o que los tienen como destinatarios principales.',
      d: 'Solo aquellas que exigen una titulación universitaria vinculada a la infancia.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'Lo decisivo es la naturaleza del trato (repetido, directo y regular), no el carácter remunerado ni la titulación. Esto incluye el voluntariado y el ámbito deportivo o de ocio, de modo que quienes participan en ellos deben acreditar la ausencia de antecedentes por delitos sexuales o de trata.'
  },
  {
    id: 21,
    category: 'Coordinador de Bienestar',
    icon: '🏫',
    question: '¿Cuál es una de las funciones de la persona coordinadora de bienestar y protección del alumnado en un centro educativo?',
    options: {
      a: 'Investigar por su cuenta los casos de violencia y sancionar a los alumnos implicados.',
      b: 'Promover planes de formación sobre prevención, detección precoz y protección dirigidos al personal del centro y al alumnado.',
      c: 'Sustituir a los servicios sociales en la valoración del riesgo de los menores.',
      d: 'Decidir si se comunica o no a las autoridades una sospecha de violencia.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'El coordinador es un referente para las comunicaciones y promueve la formación, priorizando al profesorado que ejerce la tutoría y al alumnado. No sustituye a los servicios sociales ni puede decidir si se comunica una sospecha, porque ese deber recae en todo el personal.'
  },
  {
    id: 22,
    category: 'Child Grooming y Código Penal',
    icon: '📱',
    question: 'Según el Código Penal, el delito de contacto con un menor a través de internet, teléfono u otra tecnología («child grooming») se refiere a menores de qué edad?',
    options: {
      a: 'Menores de trece años.',
      b: 'Menores de catorce años.',
      c: 'Menores de dieciocho años.',
      d: 'Menores de dieciséis años.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'El Código Penal castiga a quien contacta por medios tecnológicos con un menor de dieciséis años y propone un encuentro para atentar contra su libertad sexual, acompañado de actos materiales de acercamiento. También castiga embaucarle para obtener material pornográfico o que le muestre imágenes de ese tipo.'
  },
  {
    id: 23,
    category: 'Definición de Abuso Sexual',
    icon: '⚠️',
    question: '¿Qué dos criterios se utilizan habitualmente en España para definir las conductas de abuso sexual infantil?',
    options: {
      a: 'La existencia de coerción en la conducta impuesta al menor y la asimetría de edad.',
      b: 'La existencia de contacto físico y la reiteración de los episodios.',
      c: 'La denuncia previa de los hechos y la confesión del agresor.',
      d: 'El parentesco entre agresor y víctima y la existencia de lesiones.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'Los criterios son la coerción (amenazas, autoridad, presión, engaño) y la asimetría de edad, que implica una diferencia de expectativas, conocimientos y experiencias que compromete la libertad del menor para consentir. Puede haber abuso sin contacto físico, sin lesiones y sin vínculo familiar.'
  },
  {
    id: 24,
    category: 'Clasificación de Violencia Sexual',
    icon: '🔄',
    question: 'Una niña sufre abusos sexuales repetidos durante meses por parte de una persona conocida de su entorno. Según la frecuencia de los episodios, ¿cómo se clasifica esta violencia sexual?',
    options: {
      a: 'Aguda.',
      b: 'Extrafamiliar.',
      c: 'Crónica.',
      d: 'Sin contacto físico.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'La violencia sexual crónica se produce en más de una ocasión, generalmente por personas conocidas, y puede prolongarse durante largos periodos. La aguda es un episodio único, normalmente de un agresor desconocido. «Extrafamiliar» y «sin contacto físico» responden a otras clasificaciones (ámbito y tipo de contacto).'
  },
  {
    id: 25,
    category: 'Victimización Secundaria',
    icon: '🏛️',
    question: '¿Cuál de estos ejemplos corresponde a victimización secundaria?',
    options: {
      a: 'El daño psicológico directo que causa la agresión sufrida por la víctima.',
      b: 'Obligar a la víctima a relatar los hechos en repetidas ocasiones ante policía, juzgado y peritos.',
      c: 'El malestar que sufre la madre al conocer la agresión a su hija.',
      d: 'La estigmatización del agresor por parte de su entorno social.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'La victimización secundaria deriva de la intervención de las instituciones: repetir el relato, cuestionar la credibilidad, demorar los procedimientos o no atender a la víctima en espacios adecuados. El daño directo del hecho es victimización primaria y el de familiares o allegados, terciaria.'
  },
  {
    id: 26,
    category: 'Victimización Terciaria',
    icon: '💔',
    question: '¿A qué se refiere la victimización terciaria?',
    options: {
      a: 'Al daño que causa el propio hecho delictivo a la víctima directa.',
      b: 'Al sufrimiento causado por la actuación poco cuidadosa de las instituciones.',
      c: 'A la repetición de la violencia por un mismo agresor a lo largo del tiempo.',
      d: 'A la victimización que sufren otras personas distintas de la víctima directa, como familiares y amistades.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'La victimización terciaria alcanza a quienes rodean a la víctima, por ejemplo una madre que, tras la denuncia, atraviesa una ruptura de pareja y un fuerte malestar. Las otras opciones describen la victimización primaria, la secundaria y la reiteración de los abusos.'
  },
  {
    id: 27,
    category: 'Niveles de Prevención',
    icon: '🛡️',
    question: 'En el marco de la prevención de la violencia sexual hacia la infancia, ¿qué caracteriza a la prevención secundaria?',
    options: {
      a: 'Se dirige a toda la sociedad con campañas informativas generales.',
      b: 'Se aplica una vez ocurrido el abuso para tratar sus secuelas.',
      c: 'Se dirige a población con riesgo específico o mayor vulnerabilidad, para actuar antes de que se produzcan los abusos.',
      d: 'Se limita a sancionar penalmente a quienes cometen los abusos.'
    },
    correctAnswer: 'c',
    didacticExplanation: 'La prevención secundaria actúa sobre grupos con mayor riesgo antes de que haya violencia. La primaria informa y sensibiliza a toda la sociedad, y las medidas que actúan una vez producido el daño corresponden a la atención y reparación, no a esta prevención.'
  },
  {
    id: 28,
    category: 'Perfil del Agresor (Datos ANAR)',
    icon: '📈',
    question: 'Según el estudio de la Fundación ANAR citado en el material, ¿qué perfil predomina entre las personas agresoras sexuales de menores?',
    options: {
      a: 'Personas del círculo de confianza del menor, en casi el 81 % de los casos.',
      b: 'Personas desconocidas para el menor, en más del 80 % de los casos.',
      c: 'Personas con trastornos mentales diagnosticados, en la mayoría de los casos.',
      d: 'Mujeres adultas del entorno escolar, en la mayoría de los casos.'
    },
    correctAnswer: 'a',
    didacticExplanation: 'Casi el 81 % de los agresores pertenece al círculo de confianza (49,2 % familiares), y el 95,8 % son varones. Esto desmonta el mito del agresor desconocido; además, el material insiste en que no existe un perfil único de agresor.'
  },
  {
    id: 29,
    category: 'Pautas de Escucha Activa',
    icon: '👂',
    question: 'Un niño cuenta espontáneamente a su tutora que ha sufrido abusos sexuales. ¿Cuál es una pauta de actuación adecuada?',
    options: {
      a: 'Hacerle preguntas detalladas para aclarar todos los hechos cuanto antes.',
      b: 'Escucharle con atención y sin interrumpir, sin forzar el relato, y anotar después sus palabras literalmente, sin su presencia.',
      c: 'Explicarle las consecuencias que tendrá la denuncia para el agresor y para su familia.',
      d: 'Restar importancia a lo ocurrido para que no se sienta más angustiado.'
    },
    correctAnswer: 'b',
    didacticExplanation: 'Lo adecuado es la escucha activa, actuar con normalidad, no interrogar, desculpabilizar al menor y registrar literalmente lo dicho. Preguntar mucho puede confundirle o alterar su recuerdo; anticipar consecuencias o minimizar el sufrimiento también son errores que hay que evitar.'
  },
  {
    id: 30,
    category: 'Actuación en Agresión Presenciada',
    icon: '🚨',
    question: 'Un profesional presencia directamente una agresión sexual a un menor. Según las pautas del material, ¿qué debe hacer?',
    options: {
      a: 'Esperar a que el menor se lo cuente para valorar si es necesario intervenir.',
      b: 'Reunir primero a otros compañeros para decidir en equipo cómo proceder.',
      c: 'Interrogar al menor en el lugar para obtener todos los detalles y aportarlos a la policía.',
      d: 'Separar de inmediato al menor del agresor, llevarlo a un lugar tranquilo, avisar a la policía en el 112 y seguir sus indicaciones.'
    },
    correctAnswer: 'd',
    didacticExplanation: 'Ante una agresión presenciada la prioridad es proteger: separar al menor del agresor, ubicarlo en un espacio tranquilo sin otras personas, llamar al 112 y seguir las indicaciones del técnico, y después presentar denuncia. Esperar, deliberar o interrogar retrasa la protección y puede aumentar el daño.'
  }
];
