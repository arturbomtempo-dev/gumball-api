import type { Dictionary } from './en';

function commonFields(of: string, path: string) {
    return {
        id: `El id único ${of}.`,
        slug: `Identificador único y apto para URLs ${of}.`,
        url: `La ruta ${of} en la API, como \`${path}/1\`.`,
        createdAt: 'Cuándo se agregó el elemento a la API, en ISO 8601.',
        updatedAt: 'Cuándo se actualizó el elemento por última vez, en ISO 8601.',
    };
}

const searchByName = 'Búsqueda parcial por nombre, sin distinguir mayúsculas de minúsculas.';
const searchByTitle = 'Búsqueda parcial por título, sin distinguir mayúsculas de minúsculas.';
const idsFilter = 'Lista de ids separados por comas, hasta 100.';
const firstAppearanceFilter = 'Id del episodio en el que aparece por primera vez.';

export const es = {
    meta: {
        title: 'Gumball API · La API REST de El Increíble Mundo de Gumball',
        description:
            'Una API REST gratuita y de solo lectura sobre El Increíble Mundo de Gumball: personajes, lugares, episodios, temporadas, canciones, juegos y medios del universo de la serie.',
        docsTitle: 'Documentación',
        docsDescription:
            'Aprende a usar la Gumball API: URL base, paginación, filtros, ordenamiento, errores y todos los recursos, con solicitudes reales que puedes ejecutar desde la página.',
        contactTitle: 'Contacto',
        contactDescription:
            '¿Preguntas, ideas o una corrección de datos para la Gumball API? Envía un mensaje o apoya el proyecto.',
        notFoundTitle: 'Página no encontrada',
    },
    ui: {
        skipToContent: 'Saltar al contenido',
        nav: {
            home: 'Inicio',
            docs: 'Documentación',
            contact: 'Contacto',
            main: 'Principal',
            mobile: 'Navegación móvil',
            footer: 'Pie de página',
            homeLink: 'Página de inicio de la Gumball API',
            github: 'Código fuente en GitHub',
            viewOnGithub: 'Ver en GitHub',
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
        },
        theme: {
            dark: 'Cambiar al tema oscuro',
            light: 'Cambiar al tema claro',
        },
        language: {
            label: 'Idioma',
            change: 'Cambiar idioma',
        },
        copy: {
            copy: 'Copiar',
            copied: 'Copiado',
            code: 'Copiar código',
            baseUrl: 'Copiar URL base',
            endpoint: 'Copiar URL del endpoint',
            requestUrl: 'Copiar URL de la solicitud',
        },
        codeExamples: 'Ejemplos de código',
        tryIt: {
            toggle: 'Probar',
            required: 'obligatorio',
            any: 'Cualquiera',
            send: 'Enviar solicitud',
            sending: 'Enviando',
            reset: 'Limpiar',
            response: 'Respuesta',
            networkError:
                'No se pudo completar la solicitud. Revisa tu conexión e inténtalo de nuevo.',
        },
        docsNav: {
            label: 'Documentación',
            onThisPage: 'En esta página',
        },
        toast: {
            region: 'Notificaciones',
            dismiss: 'Cerrar notificación',
        },
        contactForm: {
            name: 'Nombre',
            namePlaceholder: 'Tu nombre',
            email: 'Correo electrónico',
            emailPlaceholder: 'tu@ejemplo.com',
            subject: 'Asunto',
            subjectPlaceholder: 'Elige un asunto',
            message: 'Mensaje',
            messagePlaceholder: 'Cuéntame qué tienes en mente...',
            honeypot: 'Sitio web',
            privacy: 'Tus datos solo se usan para responder a tu mensaje.',
            submit: 'Enviar mensaje',
            submitting: 'Enviando...',
            subjects: {
                general: 'Pregunta general',
                'data-correction': 'Corrección de datos',
                'bug-report': 'Reporte de error',
                'feature-request': 'Sugerencia de funcionalidad',
                partnership: 'Colaboración o patrocinio',
                other: 'Otro',
            },
            errors: {
                nameRequired: 'Ingresa tu nombre.',
                nameTooLong: 'Tu nombre debe tener como máximo {max} caracteres.',
                emailInvalid: 'Ingresa una dirección de correo válida.',
                subjectRequired: 'Elige un asunto.',
                messageTooShort: 'Tu mensaje debe tener al menos {min} caracteres.',
                messageTooLong: 'Tu mensaje debe tener como máximo {max} caracteres.',
            },
            toasts: {
                invalidTitle: 'Revisa el formulario',
                invalidDescription: 'Algunos campos necesitan tu atención antes de enviar.',
                successTitle: 'Mensaje enviado',
                successDescription: 'Gracias por escribir. Te responderé pronto.',
                unavailableTitle: 'Mensaje no enviado',
                unavailableDescription:
                    'El envío de mensajes desde este formulario todavía no está disponible. Mientras tanto, escribe a {email}.',
            },
        },
    },
    footer: {
        disclaimer:
            'Un proyecto de fans no oficial. El Increíble Mundo de Gumball y sus personajes son marcas registradas de Warner Bros. Discovery.',
        madeBy: 'Hecho por',
    },
    notFound: {
        title: 'Esta página se perdió',
        description:
            'Como casi todo en Elmore, no está donde esperabas. Consulta la documentación o vuelve al inicio.',
        home: 'Volver al inicio',
        docs: 'Leer la documentación',
    },
    home: {
        title: 'La API de El Increíble Mundo de Gumball',
        description:
            'Personajes, lugares, episodios, temporadas, canciones, juegos y medios de Elmore, listos para usar en tu próximo proyecto a través de una API REST sencilla.',
        readDocs: 'Leer la documentación',
        firstRequest: 'Hacer la primera solicitud',
        logoAlt: 'Gumball saludando sobre el logo de la Gumball API',
        resources: {
            eyebrow: 'Recursos',
            title: 'Siete recursos, una API coherente',
            description:
                'Todos los recursos ofrecen paginación, filtros, ordenamiento, búsqueda por id o slug y selección aleatoria.',
        },
        quickStart: {
            eyebrow: 'Primeros pasos',
            title: 'Tu primera solicitud en segundos',
            description:
                'Sin registro, sin claves y sin SDK. Envía una solicitud GET desde cualquier lenguaje y recibe JSON como respuesta.',
            response: 'Respuesta',
        },
        characters: {
            eyebrow: 'Personajes',
            title: 'Conoce a los habitantes de Elmore',
            description: 'Una selección aleatoria de la API, actualizada cada hora.',
            explore: 'Explorar personajes',
            firstSeenIn: 'Visto por primera vez en {title}',
            status: {
                alive: 'Vivo',
                deceased: 'Fallecido',
                undead: 'No muerto',
                unknown: 'Desconocido',
            },
        },
        features: {
            open: {
                title: 'Gratuita y abierta',
                description:
                    'Sin autenticación y con CORS habilitado para cualquier origen. Úsala desde el navegador, un servidor o la terminal.',
            },
            connected: {
                title: 'Datos conectados',
                description:
                    'Personajes, canciones y lugares enlazan con los episodios en los que aparecen, para que sigas la historia entre recursos.',
            },
            predictable: {
                title: 'Predecible por diseño',
                description:
                    'La misma paginación, los mismos filtros, el mismo ordenamiento y el mismo formato de error en todas las rutas, todo documentado con ejemplos reales.',
            },
        },
    },
    contact: {
        eyebrow: 'Contacto',
        title: 'Ponte en contacto',
        intro: '¿Encontraste un dato incorrecto, te falta algún personaje o tienes una idea para la API? Envía un mensaje y te responderé. Para dudas sobre rutas y parámetros, revisa primero la {docs}.',
        docsLink: 'documentación',
        social: {
            email: 'Correo electrónico',
            linkedin: 'LinkedIn',
            instagram: 'Instagram',
            github: 'GitHub',
        },
        sponsor: {
            eyebrow: 'Apoya el proyecto',
            title: 'Gratuita para todos, hecha con cuidado',
            description:
                'La Gumball API es gratuita y de código abierto, y seguirá siéndolo. Investigar y escribir datos originales para cientos de elementos, preparar cada imagen y mantener los servidores en línea requiere tiempo y dinero. Si la API te resulta útil, considera patrocinar su desarrollo. Cada aporte ayuda a mantenerla en línea, precisa y en crecimiento.',
            sponsor: 'Patrocinar en GitHub',
            star: 'Dar una estrella al repositorio',
            footnote:
                '¿No puedes patrocinar? Dar una estrella al repositorio, reportar datos incorrectos y compartir la API con otros desarrolladores ayuda igual.',
        },
    },
    docs: {
        eyebrow: 'Documentación',
        groups: {
            gettingStarted: 'Primeros pasos',
            resources: 'Recursos',
        },
        sections: {
            introduction: 'Introducción',
            baseUrl: 'URL base',
            rateLimit: 'Límite de solicitudes y caché',
            pagination: 'Información y paginación',
            sorting: 'Ordenamiento',
            filtering: 'Filtros',
            references: 'Recursos relacionados',
            images: 'Imágenes',
            errors: 'Errores',
        },
        table: {
            key: 'Clave',
            header: 'Encabezado',
            parameter: 'Parámetro',
            type: 'Tipo',
            description: 'Descripción',
            status: 'Estado',
            meaning: 'Significado',
        },
        baseUrlLabel: 'URL base',
        introduction: [
            'La Gumball API es una API REST gratuita y de solo lectura con datos sobre El Increíble Mundo de Gumball y The Wonderfully Weird World of Gumball. Ofrece personajes, lugares, episodios, temporadas, canciones, juegos y medios del universo de la serie en formato JSON.',
            'No hay autenticación, clave de API ni registro. Todas las rutas son solicitudes `GET`, así que puedes llamarlas desde el navegador, un servidor o la terminal. Abre cualquier panel `Probar` de esta página para enviar una solicitud real y ver la respuesta.',
        ],
        contentLanguage:
            'El contenido que devuelve la API, como nombres, títulos y descripciones, está en inglés.',
        baseUrl:
            'Todas las solicitudes comienzan con la URL base de abajo. Su raíz enumera todos los recursos disponibles, por lo que es una excelente primera solicitud.',
        rateLimit: {
            description:
                'Cada dirección IP puede hacer hasta 100 solicitudes por minuto. Cada respuesta informa tu consumo actual en los encabezados de abajo. Al alcanzar el límite, la API responde con `429 Too Many Requests` hasta que se reinicie la ventana.',
            caching:
                'Las listas y los elementos individuales se guardan en caché durante 5 minutos con `Cache-Control: public`, así que las solicitudes repetidas son rápidas. Las rutas aleatorias nunca usan caché. Siempre que sea posible, guarda las respuestas en caché de tu lado también.',
            headers: {
                'X-RateLimit-Limit': 'Solicitudes permitidas por minuto.',
                'X-RateLimit-Remaining': 'Solicitudes restantes en la ventana actual.',
                'X-RateLimit-Reset': 'Segundos hasta que se reinicie la ventana.',
            },
        },
        pagination: {
            description:
                'Las rutas de listado devuelven 20 elementos por página de forma predeterminada. Usa `page` y `limit` para recorrer los resultados. Además de los elementos en `data`, cada respuesta de listado incluye `meta`, con los totales, y `links`, con rutas listas para usar hacia las demás páginas.',
            parameters: {
                page: 'La página que se devuelve, a partir de 1.',
                limit: 'Elementos por página, de 1 a 100. El valor predeterminado es 20.',
            },
            fields: {
                data: 'Los elementos de la página actual.',
                'meta.page': 'La página actual, a partir de 1.',
                'meta.limit': 'La cantidad de elementos por página.',
                'meta.totalItems': 'El total de elementos.',
                'meta.totalPages': 'El total de páginas.',
                'meta.hasNextPage': 'Indica si existe una página siguiente.',
                'meta.hasPreviousPage': 'Indica si existe una página anterior.',
                'links.self': 'La ruta de la página actual.',
                'links.first': 'La ruta de la primera página.',
                'links.previous': 'La ruta de la página anterior, si existe.',
                'links.next': 'La ruta de la página siguiente, si existe.',
                'links.last': 'La ruta de la última página.',
            },
        },
        sorting:
            'Usa el parámetro `sort` con el nombre de un campo para orden ascendente, o agrega `-` delante para orden descendente. Los elementos sin valor en ese campo siempre aparecen al final. Cada recurso documenta los campos por los que se puede ordenar.',
        filtering: {
            description:
                'Todas las rutas de listado aceptan filtros como query parameters, y se pueden combinar libremente. Algunas reglas se aplican a todos los recursos:',
            rules: [
                '`search` hace una búsqueda parcial por nombre o título, sin distinguir mayúsculas de minúsculas.',
                'Los valores de enum van en minúsculas y en kebab-case, como `stop-motion` o `school-facility`.',
                '`ids` recibe una lista separada por comas, como `ids=1,2,3`, para obtener varios elementos a la vez.',
                'Los parámetros desconocidos o inválidos se rechazan con `400 Bad Request`, así que ningún error de escritura pasa desapercibido.',
            ],
        },
        references: {
            description:
                'Los recursos se enlazan entre sí mediante pequeños objetos de referencia en lugar de ids sueltos. Cada referencia incluye una `url` con la ruta al elemento completo.',
            fields: {
                EpisodeReference: {
                    id: 'El id del episodio.',
                    slug: 'El slug del episodio.',
                    title: 'El título del episodio.',
                    code: 'Código de temporada y episodio, como `S01E01`.',
                    url: 'La ruta del episodio.',
                },
                CharacterReference: {
                    id: 'El id del personaje.',
                    slug: 'El slug del personaje.',
                    name: 'El nombre del personaje.',
                    url: 'La ruta del personaje.',
                },
                LocationReference: {
                    id: 'El id del lugar.',
                    slug: 'El slug del lugar.',
                    name: 'El nombre del lugar.',
                    url: 'La ruta del lugar.',
                },
            },
        },
        images: 'Las imágenes se sirven en formato WebP desde una CDN pública, en el campo `image` de cada elemento. Son de alta calidad y la mayoría de las imágenes de personajes tienen fondo transparente, así que combinan con cualquier color.',
        errors: {
            description:
                'Los errores usan los códigos de estado HTTP estándar y siempre devuelven el mismo formato de JSON.',
            fields: {
                statusCode: 'El código de estado HTTP.',
                error: 'El texto del estado HTTP.',
                message: 'Qué salió mal. Los errores de validación enumeran todos los problemas.',
                path: 'La ruta solicitada.',
                timestamp: 'Cuándo ocurrió el error.',
            },
            statusCodes: {
                200: 'La solicitud se completó correctamente.',
                400: 'Un id, slug o query parameter no es válido.',
                404: 'El elemento o la ruta no existe.',
                429: 'Se superó el límite de solicitudes. Espera a que se reinicie la ventana.',
                500: 'Algo salió mal de nuestro lado.',
            },
        },
        endpoints: {
            all: 'Devuelve una lista paginada de {plural}, con 20 por página de forma predeterminada.',
            single: 'Devuelve {one} por su id numérico.',
            slug: 'Los slugs son identificadores estables y legibles, ideales para las URLs de tu propia app.',
            random: 'Devuelve una selección aleatoria de {plural}. Las respuestas aleatorias nunca usan caché, así que cada solicitud trae un resultado diferente.',
            filter: 'Combina cualquiera de estos query parameters entre sí, con la paginación y con el ordenamiento.',
            sort: 'Campo por el que se ordena. Agrega `-` delante para orden descendente. El valor predeterminado es `{default}`.',
            count: 'Cuántos elementos devolver, de 1 a {max}. El valor predeterminado es 1.',
            available: '{count} {plural} disponibles.',
        },
        resources: {
            characters: {
                title: 'Personajes',
                plural: 'personajes',
                one: 'un personaje',
                summary:
                    'Todos los personajes con nombre de la serie, desde la familia Watterson hasta los habitantes de Elmore que aparecen en un solo episodio.',
                sections: {
                    schema: 'Esquema de personaje',
                    all: 'Obtener todos los personajes',
                    single: 'Obtener un personaje',
                    slug: 'Obtener un personaje por slug',
                    random: 'Obtener personajes aleatorios',
                    filter: 'Filtrar personajes',
                },
                fields: {
                    ...commonFields('del personaje', '/characters'),
                    name: 'El nombre por el que se conoce al personaje.',
                    fullName: 'El nombre completo, cuando se conoce.',
                    aliases: 'Apodos y nombres alternativos.',
                    description: 'Una descripción breve.',
                    species: 'La especie o el tipo de ser, como `Cat` o `Fish`.',
                    gender: 'El género del personaje.',
                    age: 'La edad en años, cuando se menciona en la serie.',
                    occupation: 'La ocupación principal.',
                    role: 'La importancia del personaje en la serie.',
                    status: 'Si el personaje está vivo.',
                    animationStyle: 'Cómo está animado el personaje.',
                    voiceActors: 'Los actores que dieron voz al personaje.',
                    firstAppearance: 'El episodio en el que el personaje aparece por primera vez.',
                    colors: 'Los colores principales del personaje, en hexadecimal.',
                    image: 'URL de la imagen del personaje (WebP).',
                },
                filters: {
                    search: 'Búsqueda parcial por nombre y nombre completo, sin distinguir mayúsculas de minúsculas.',
                    species: 'Especie exacta, sin distinguir mayúsculas de minúsculas.',
                    gender: 'Filtra por género.',
                    role: 'Filtra por importancia en la serie.',
                    status: 'Filtra por estado.',
                    animationStyle: 'Filtra por estilo de animación.',
                    voiceActor: 'Nombre exacto de uno de los actores de voz.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
            locations: {
                title: 'Lugares',
                plural: 'lugares',
                one: 'un lugar',
                summary:
                    'Los lugares del universo de Gumball, organizados en jerarquía: un aula pertenece a una escuela, que pertenece a Elmore.',
                sections: {
                    schema: 'Esquema de lugar',
                    all: 'Obtener todos los lugares',
                    single: 'Obtener un lugar',
                    slug: 'Obtener un lugar por slug',
                    random: 'Obtener lugares aleatorios',
                    filter: 'Filtrar lugares',
                },
                fields: {
                    ...commonFields('del lugar', '/locations'),
                    name: 'El nombre del lugar.',
                    description: 'Una descripción breve.',
                    type: 'El tipo de lugar.',
                    parent: 'El lugar que contiene a este.',
                    firstAppearance: 'El episodio en el que el lugar aparece por primera vez.',
                    image: 'URL de la imagen del lugar (WebP).',
                },
                filters: {
                    search: searchByName,
                    type: 'Filtra por tipo.',
                    parentId: 'Id del lugar que contiene a este.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
            episodes: {
                title: 'Episodios',
                plural: 'episodios',
                one: 'un episodio',
                summary:
                    'Todos los episodios, especiales, cortos y pilotos, con fechas de emisión, créditos y enlaces al episodio anterior y al siguiente.',
                sections: {
                    schema: 'Esquema de episodio',
                    all: 'Obtener todos los episodios',
                    single: 'Obtener un episodio',
                    slug: 'Obtener un episodio por slug',
                    random: 'Obtener episodios aleatorios',
                    filter: 'Filtrar episodios',
                },
                fields: {
                    ...commonFields('del episodio', '/episodes'),
                    title: 'El título del episodio.',
                    description: 'Una sinopsis breve.',
                    series: 'La serie a la que pertenece el episodio.',
                    type: 'El tipo de episodio.',
                    status: 'Si el episodio se estrenó.',
                    season: 'El número de la temporada.',
                    episodeNumber: 'El número del episodio dentro de su temporada.',
                    overallNumber: 'El número del episodio en toda la serie.',
                    code: 'Código de temporada y episodio, como `S01E01`.',
                    productionCode: 'El código de producción.',
                    usAirDate: 'Fecha de la primera emisión en EE. UU.',
                    ukAirDate: 'Fecha de la primera emisión en el Reino Unido.',
                    writers: 'Los guionistas del episodio.',
                    storyboardArtists: 'Los artistas de storyboard del episodio.',
                    previous: 'El episodio anterior en orden.',
                    next: 'El episodio siguiente en orden.',
                    image: 'URL de la imagen del episodio (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    series: 'Filtra por serie.',
                    type: 'Filtra por tipo.',
                    status: 'Filtra por estado.',
                    season: 'Número de la temporada.',
                    writer: 'Nombre exacto de uno de los guionistas.',
                    storyboardArtist: 'Nombre exacto de uno de los artistas de storyboard.',
                    airedFrom: 'Emitido en EE. UU. desde esta fecha (`YYYY-MM-DD`).',
                    airedTo: 'Emitido en EE. UU. hasta esta fecha (`YYYY-MM-DD`).',
                    ids: idsFilter,
                },
            },
            seasons: {
                title: 'Temporadas',
                plural: 'temporadas',
                one: 'una temporada',
                summary:
                    'Las seis temporadas de El Increíble Mundo de Gumball y las temporadas de The Wonderfully Weird World of Gumball.',
                sections: {
                    schema: 'Esquema de temporada',
                    all: 'Obtener todas las temporadas',
                    single: 'Obtener una temporada',
                    slug: 'Obtener una temporada por slug',
                    random: 'Obtener temporadas aleatorias',
                    filter: 'Filtrar temporadas',
                },
                fields: {
                    ...commonFields('de la temporada', '/seasons'),
                    number: 'El número de la temporada considerando ambas series.',
                    title: 'El título de la temporada.',
                    description: 'Un resumen breve.',
                    series: 'La serie a la que pertenece la temporada.',
                    seriesSeasonNumber: 'El número de la temporada dentro de su serie.',
                    status: 'Si la temporada terminó, está en emisión o aún no se estrena.',
                    episodeCount: 'La cantidad prevista de episodios.',
                    releasedEpisodeCount: 'La cantidad de episodios ya estrenados.',
                    networks: 'Los canales que la emitieron.',
                    usPremiereDate: 'Fecha de estreno en EE. UU.',
                    usFinaleDate: 'Fecha del último episodio en EE. UU.',
                    ukPremiereDate: 'Fecha de estreno en el Reino Unido.',
                    ukFinaleDate: 'Fecha del último episodio en el Reino Unido.',
                    episodes: 'Ruta que enumera los episodios de la temporada.',
                    image: 'URL de la imagen de la temporada (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    series: 'Filtra por serie.',
                    status: 'Filtra por estado.',
                    ids: idsFilter,
                },
            },
            songs: {
                title: 'Canciones',
                plural: 'canciones',
                one: 'una canción',
                summary:
                    'Las canciones interpretadas en la serie, desde el tema de apertura hasta los números musicales de cada episodio.',
                sections: {
                    schema: 'Esquema de canción',
                    all: 'Obtener todas las canciones',
                    single: 'Obtener una canción',
                    slug: 'Obtener una canción por slug',
                    random: 'Obtener canciones aleatorias',
                    filter: 'Filtrar canciones',
                },
                fields: {
                    ...commonFields('de la canción', '/songs'),
                    title: 'El título de la canción.',
                    description: 'Una descripción breve.',
                    type: 'El tipo de canción.',
                    episode: 'El episodio en el que se interpreta la canción.',
                    characters: 'Los personajes que la cantan.',
                    vocalists: 'Los intérpretes reales.',
                    genres: 'Géneros musicales.',
                    duration: 'Duración con formato `m:ss`.',
                    durationSeconds: 'Duración en segundos.',
                    musicalKey: 'La tonalidad musical.',
                    image: 'URL de la imagen de la canción (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    type: 'Filtra por tipo.',
                    episodeId: 'Id del episodio.',
                    season: 'Número de temporada del episodio.',
                    characterId: 'Id de un personaje que la canta.',
                    vocalist: 'Nombre exacto de uno de los intérpretes.',
                    genre: 'Nombre exacto de uno de los géneros.',
                    ids: idsFilter,
                },
            },
            games: {
                title: 'Juegos',
                plural: 'juegos',
                one: 'un juego',
                summary:
                    'Juegos oficiales ambientados exclusivamente en el universo de Gumball, desde juegos de navegador hasta apps móviles.',
                sections: {
                    schema: 'Esquema de juego',
                    all: 'Obtener todos los juegos',
                    single: 'Obtener un juego',
                    slug: 'Obtener un juego por slug',
                    random: 'Obtener juegos aleatorios',
                    filter: 'Filtrar juegos',
                },
                fields: {
                    ...commonFields('del juego', '/games'),
                    title: 'El título del juego.',
                    description: 'Una descripción breve.',
                    platforms: 'Las plataformas en las que se lanzó el juego.',
                    status: 'Si el juego sigue disponible.',
                    releaseDate: 'La fecha de lanzamiento.',
                    releaseYear: 'El año de lanzamiento.',
                    developers: 'Los estudios detrás del juego.',
                    image: 'URL de la imagen del juego (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    platform: 'Filtra por plataforma.',
                    status: 'Filtra por estado.',
                    developer: 'Nombre exacto de uno de los estudios.',
                    releaseYear: 'Año de lanzamiento.',
                    ids: idsFilter,
                },
            },
            media: {
                title: 'Medios',
                plural: 'medios',
                one: 'un medio',
                summary:
                    'Películas, series, libros y juegos que existen dentro del universo de Gumball, muchos de ellos parodias de obras reales.',
                sections: {
                    schema: 'Esquema de medio',
                    all: 'Obtener todos los medios',
                    single: 'Obtener un medio',
                    slug: 'Obtener un medio por slug',
                    random: 'Obtener medios aleatorios',
                    filter: 'Filtrar medios',
                },
                fields: {
                    ...commonFields('del medio', '/media'),
                    title: 'El título del medio.',
                    description: 'Una descripción breve.',
                    type: 'El tipo de medio.',
                    parodyOf: 'La obra real que parodia.',
                    firstAppearance: 'El episodio en el que aparece por primera vez.',
                    image: 'URL de la imagen del medio (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    type: 'Filtra por tipo.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
        },
    },
} satisfies Dictionary;
