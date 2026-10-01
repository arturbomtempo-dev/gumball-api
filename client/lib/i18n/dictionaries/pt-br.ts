import type { Dictionary } from './en';

function commonFields(of: string, path: string) {
    return {
        id: `O id único ${of}.`,
        slug: `Identificador único e amigável para URLs ${of}.`,
        url: `O caminho ${of} na API, como \`${path}/1\`.`,
        createdAt: 'Quando o item foi adicionado à API, em ISO 8601.',
        updatedAt: 'Quando o item foi atualizado pela última vez, em ISO 8601.',
    };
}

const searchByName = 'Busca parcial pelo nome, sem diferenciar maiúsculas de minúsculas.';
const searchByTitle = 'Busca parcial pelo título, sem diferenciar maiúsculas de minúsculas.';
const idsFilter = 'Lista de ids separados por vírgula, até 100.';
const firstAppearanceFilter = 'Id do episódio em que aparece pela primeira vez.';

export const ptBr = {
    meta: {
        title: 'Gumball API · A API REST de O Incrível Mundo de Gumball',
        description:
            'Uma API REST gratuita e somente leitura sobre O Incrível Mundo de Gumball: personagens, lugares, episódios, temporadas, músicas, jogos e mídias do universo da série.',
        docsTitle: 'Documentação',
        docsDescription:
            'Aprenda a usar a Gumball API: URL base, paginação, filtros, ordenação, erros e todos os recursos, com requisições reais que você executa direto na página.',
        contactTitle: 'Contato',
        contactDescription:
            'Dúvidas, ideias ou uma correção de dados para a Gumball API? Envie uma mensagem ou apoie o projeto.',
        notFoundTitle: 'Página não encontrada',
    },
    ui: {
        skipToContent: 'Pular para o conteúdo',
        nav: {
            home: 'Início',
            docs: 'Documentação',
            contact: 'Contato',
            main: 'Principal',
            mobile: 'Navegação móvel',
            footer: 'Rodapé',
            homeLink: 'Página inicial da Gumball API',
            github: 'Código-fonte no GitHub',
            viewOnGithub: 'Ver no GitHub',
            openMenu: 'Abrir menu',
            closeMenu: 'Fechar menu',
        },
        theme: {
            dark: 'Mudar para o tema escuro',
            light: 'Mudar para o tema claro',
        },
        language: {
            label: 'Idioma',
            change: 'Mudar idioma',
        },
        copy: {
            copy: 'Copiar',
            copied: 'Copiado',
            code: 'Copiar código',
            baseUrl: 'Copiar URL base',
            endpoint: 'Copiar URL do endpoint',
            requestUrl: 'Copiar URL da requisição',
        },
        codeExamples: 'Exemplos de código',
        tryIt: {
            toggle: 'Testar',
            required: 'obrigatório',
            any: 'Qualquer',
            send: 'Enviar requisição',
            sending: 'Enviando',
            reset: 'Limpar',
            response: 'Resposta',
            networkError:
                'Não foi possível concluir a requisição. Verifique sua conexão e tente novamente.',
        },
        docsNav: {
            label: 'Documentação',
            onThisPage: 'Nesta página',
        },
        toast: {
            region: 'Notificações',
            dismiss: 'Fechar notificação',
        },
        contactForm: {
            name: 'Nome',
            namePlaceholder: 'Seu nome',
            email: 'E-mail',
            emailPlaceholder: 'voce@exemplo.com',
            subject: 'Assunto',
            subjectPlaceholder: 'Escolha um assunto',
            message: 'Mensagem',
            messagePlaceholder: 'Conte o que você tem em mente...',
            honeypot: 'Site',
            privacy: 'Seus dados são usados apenas para responder à sua mensagem.',
            submit: 'Enviar mensagem',
            submitting: 'Enviando...',
            subjects: {
                general: 'Dúvida geral',
                'data-correction': 'Correção de dados',
                'bug-report': 'Relato de bug',
                'feature-request': 'Sugestão de funcionalidade',
                partnership: 'Parceria ou patrocínio',
                other: 'Outro',
            },
            errors: {
                nameRequired: 'Informe seu nome.',
                nameTooLong: 'Seu nome deve ter no máximo {max} caracteres.',
                emailInvalid: 'Informe um endereço de e-mail válido.',
                subjectRequired: 'Escolha um assunto.',
                messageTooShort: 'Sua mensagem deve ter pelo menos {min} caracteres.',
                messageTooLong: 'Sua mensagem deve ter no máximo {max} caracteres.',
            },
            toasts: {
                invalidTitle: 'Revise o formulário',
                invalidDescription: 'Alguns campos precisam de atenção antes do envio.',
                successTitle: 'Mensagem enviada',
                successDescription:
                    'Obrigado pelo contato! Sua mensagem foi enviada e responderei no seu e-mail o quanto antes.',
                errorTitle: 'Mensagem não enviada',
                errorDescription:
                    'Algo deu errado ao enviar sua mensagem. Tente novamente em instantes ou escreva para {email}.',
            },
        },
    },
    footer: {
        disclaimer:
            'Um projeto de fã não oficial. O Incrível Mundo de Gumball e seus personagens são marcas registradas da Warner Bros. Discovery.',
        madeBy: 'Feito por',
    },
    notFound: {
        title: 'Esta página se perdeu',
        description:
            'Como quase tudo em Elmore, ela não está onde você esperava. Confira a documentação ou volte para o início.',
        home: 'Voltar ao início',
        docs: 'Ler a documentação',
    },
    home: {
        title: 'A API de O Incrível Mundo de Gumball',
        description:
            'Personagens, lugares, episódios, temporadas, músicas, jogos e mídias de Elmore, prontos para usar no seu próximo projeto por meio de uma API REST simples.',
        readDocs: 'Ler a documentação',
        firstRequest: 'Fazer a primeira requisição',
        logoAlt: 'Gumball acenando acima do logo da Gumball API',
        resources: {
            eyebrow: 'Recursos',
            title: 'Sete recursos, uma API consistente',
            description:
                'Todos os recursos oferecem paginação, filtros, ordenação, busca por id ou slug e seleção aleatória.',
        },
        quickStart: {
            eyebrow: 'Primeiros passos',
            title: 'Sua primeira requisição em segundos',
            description:
                'Sem cadastro, sem chaves e sem SDK. Envie uma requisição GET de qualquer linguagem e receba JSON de volta.',
            response: 'Resposta',
        },
        characters: {
            eyebrow: 'Personagens',
            title: 'Conheça os moradores de Elmore',
            description: 'Uma seleção aleatória da API, atualizada a cada hora.',
            explore: 'Explorar personagens',
            firstSeenIn: 'Visto pela primeira vez em {title}',
            status: {
                alive: 'Vivo',
                deceased: 'Falecido',
                undead: 'Morto-vivo',
                unknown: 'Desconhecido',
            },
        },
        features: {
            open: {
                title: 'Gratuita e aberta',
                description:
                    'Sem autenticação e com CORS liberado para qualquer origem. Use no navegador, em um servidor ou no terminal.',
            },
            connected: {
                title: 'Dados conectados',
                description:
                    'Personagens, músicas e lugares apontam para os episódios em que aparecem, para você acompanhar a história entre os recursos.',
            },
            predictable: {
                title: 'Previsível por design',
                description:
                    'A mesma paginação, os mesmos filtros, a mesma ordenação e o mesmo formato de erro em todas as rotas, tudo documentado com exemplos reais.',
            },
        },
    },
    contact: {
        eyebrow: 'Contato',
        title: 'Entre em contato',
        intro: 'Encontrou uma informação errada, sentiu falta de algum personagem ou tem uma ideia para a API? Envie uma mensagem e eu respondo. Para dúvidas sobre rotas e parâmetros, confira antes a {docs}.',
        docsLink: 'documentação',
        social: {
            email: 'E-mail',
            linkedin: 'LinkedIn',
            instagram: 'Instagram',
            github: 'GitHub',
        },
        sponsor: {
            eyebrow: 'Apoie o projeto',
            title: 'Gratuita para todos, feita com cuidado',
            description:
                'A Gumball API é gratuita e de código aberto, e vai continuar assim. Pesquisar e escrever dados originais para centenas de itens, preparar cada imagem e manter os servidores no ar exige tempo e dinheiro. Se a API é útil para você, considere patrocinar o desenvolvimento. Cada contribuição ajuda a mantê-la no ar, precisa e em crescimento.',
            sponsor: 'Patrocinar no GitHub',
            star: 'Dar estrela no repositório',
            footnote:
                'Não pode patrocinar? Dar uma estrela no repositório, relatar dados errados e compartilhar a API com outros desenvolvedores ajudam tanto quanto.',
        },
    },
    docs: {
        eyebrow: 'Documentação',
        groups: {
            gettingStarted: 'Primeiros passos',
            resources: 'Recursos',
        },
        sections: {
            introduction: 'Introdução',
            baseUrl: 'URL base',
            rateLimit: 'Limite de requisições e cache',
            pagination: 'Informações e paginação',
            sorting: 'Ordenação',
            filtering: 'Filtros',
            references: 'Recursos relacionados',
            images: 'Imagens',
            errors: 'Erros',
        },
        table: {
            key: 'Chave',
            header: 'Cabeçalho',
            parameter: 'Parâmetro',
            type: 'Tipo',
            description: 'Descrição',
            status: 'Status',
            meaning: 'Significado',
        },
        baseUrlLabel: 'URL base',
        introduction: [
            'A Gumball API é uma API REST gratuita e somente leitura com dados sobre O Incrível Mundo de Gumball e The Wonderfully Weird World of Gumball. Ela disponibiliza personagens, lugares, episódios, temporadas, músicas, jogos e mídias do universo da série em JSON.',
            'Não há autenticação, chave de API nem cadastro. Todas as rotas são requisições `GET`, então você pode chamá-las pelo navegador, por um servidor ou pelo terminal. Abra qualquer painel `Testar` desta página para enviar uma requisição real e ver a resposta.',
        ],
        contentLanguage:
            'O conteúdo retornado pela API, como nomes, títulos e descrições, está em inglês.',
        baseUrl:
            'Todas as requisições começam pela URL base abaixo. A raiz dela lista todos os recursos disponíveis, o que faz dela uma ótima primeira requisição.',
        rateLimit: {
            description:
                'Cada endereço IP pode fazer até 100 requisições por minuto. Toda resposta informa o seu consumo atual nos cabeçalhos abaixo. Ao atingir o limite, a API responde com `429 Too Many Requests` até a janela ser reiniciada.',
            caching:
                'Listas e itens individuais ficam em cache por 5 minutos com `Cache-Control: public`, então requisições repetidas são rápidas. As rotas aleatórias nunca usam cache. Sempre que possível, faça cache das respostas do seu lado também.',
            headers: {
                'X-RateLimit-Limit': 'Requisições permitidas por minuto.',
                'X-RateLimit-Remaining': 'Requisições restantes na janela atual.',
                'X-RateLimit-Reset': 'Segundos até a janela ser reiniciada.',
            },
        },
        pagination: {
            description:
                'As rotas de listagem retornam 20 itens por página por padrão. Use `page` e `limit` para navegar pelos resultados. Além dos itens em `data`, toda resposta de listagem inclui `meta`, com os totais, e `links`, com caminhos prontos para as outras páginas.',
            parameters: {
                page: 'A página a ser retornada, a partir de 1.',
                limit: 'Itens por página, de 1 a 100. O padrão é 20.',
            },
            fields: {
                data: 'Os itens da página atual.',
                'meta.page': 'A página atual, a partir de 1.',
                'meta.limit': 'A quantidade de itens por página.',
                'meta.totalItems': 'O total de itens.',
                'meta.totalPages': 'O total de páginas.',
                'meta.hasNextPage': 'Indica se existe uma próxima página.',
                'meta.hasPreviousPage': 'Indica se existe uma página anterior.',
                'links.self': 'O caminho da página atual.',
                'links.first': 'O caminho da primeira página.',
                'links.previous': 'O caminho da página anterior, se houver.',
                'links.next': 'O caminho da próxima página, se houver.',
                'links.last': 'O caminho da última página.',
            },
        },
        sorting:
            'Use o parâmetro `sort` com o nome de um campo para ordem crescente, ou adicione `-` antes dele para ordem decrescente. Itens sem valor nesse campo sempre aparecem por último. Cada recurso documenta os campos que podem ser ordenados.',
        filtering: {
            description:
                'Todas as rotas de listagem aceitam filtros como query parameters, que podem ser combinados livremente. Algumas regras valem para todos os recursos:',
            rules: [
                '`search` faz uma busca parcial pelo nome ou título, sem diferenciar maiúsculas de minúsculas.',
                'Os valores de enum são minúsculos e em kebab-case, como `stop-motion` ou `school-facility`.',
                '`ids` recebe uma lista separada por vírgulas, como `ids=1,2,3`, para buscar vários itens de uma vez.',
                'Parâmetros desconhecidos ou inválidos são rejeitados com `400 Bad Request`, então nenhum erro de digitação passa despercebido.',
            ],
        },
        references: {
            description:
                'Os recursos se conectam por meio de pequenos objetos de referência, em vez de ids soltos. Cada referência inclui uma `url` com o caminho para o item completo.',
            fields: {
                EpisodeReference: {
                    id: 'O id do episódio.',
                    slug: 'O slug do episódio.',
                    title: 'O título do episódio.',
                    code: 'Código de temporada e episódio, como `S01E01`.',
                    url: 'O caminho do episódio.',
                },
                CharacterReference: {
                    id: 'O id do personagem.',
                    slug: 'O slug do personagem.',
                    name: 'O nome do personagem.',
                    url: 'O caminho do personagem.',
                },
                LocationReference: {
                    id: 'O id do lugar.',
                    slug: 'O slug do lugar.',
                    name: 'O nome do lugar.',
                    url: 'O caminho do lugar.',
                },
            },
        },
        images: 'As imagens são servidas em WebP por uma CDN pública, no campo `image` de cada item. Elas têm alta qualidade e a maioria das imagens de personagens tem fundo transparente, então combinam com qualquer cor.',
        errors: {
            description:
                'Os erros usam os códigos de status HTTP padrão e sempre retornam o mesmo formato de JSON.',
            fields: {
                statusCode: 'O código de status HTTP.',
                error: 'O texto do status HTTP.',
                message: 'O que deu errado. Erros de validação listam todos os problemas.',
                path: 'O caminho requisitado.',
                timestamp: 'Quando o erro aconteceu.',
            },
            statusCodes: {
                200: 'A requisição foi concluída com sucesso.',
                400: 'Um id, slug ou query parameter é inválido.',
                404: 'O item ou a rota não existe.',
                429: 'O limite de requisições foi excedido. Aguarde a janela ser reiniciada.',
                500: 'Algo deu errado do nosso lado.',
            },
        },
        endpoints: {
            all: 'Retorna uma lista paginada de {plural}, com 20 por página por padrão.',
            single: 'Retorna {one} pelo id numérico.',
            slug: 'Slugs são identificadores estáveis e legíveis, ideais para as URLs do seu próprio app.',
            random: 'Retorna uma seleção aleatória de {plural}. As respostas aleatórias nunca usam cache, então cada requisição traz um resultado diferente.',
            filter: 'Combine qualquer um destes query parameters entre si, com a paginação e com a ordenação.',
            sort: 'Campo usado na ordenação. Adicione `-` antes dele para ordem decrescente. O padrão é `{default}`.',
            count: 'Quantos itens retornar, de 1 a {max}. O padrão é 1.',
            available: '{count} {plural} disponíveis.',
        },
        resources: {
            characters: {
                title: 'Personagens',
                plural: 'personagens',
                one: 'um personagem',
                summary:
                    'Todos os personagens com nome da série, da família Watterson aos moradores de Elmore que aparecem em um único episódio.',
                sections: {
                    schema: 'Schema de personagem',
                    all: 'Listar todos os personagens',
                    single: 'Buscar um personagem',
                    slug: 'Buscar um personagem pelo slug',
                    random: 'Buscar personagens aleatórios',
                    filter: 'Filtrar personagens',
                },
                fields: {
                    ...commonFields('do personagem', '/characters'),
                    name: 'O nome pelo qual o personagem é mais conhecido.',
                    fullName: 'O nome completo, quando conhecido.',
                    aliases: 'Apelidos e nomes alternativos.',
                    description: 'Uma breve descrição.',
                    species: 'A espécie ou o tipo de ser, como `Cat` ou `Fish`.',
                    gender: 'O gênero do personagem.',
                    age: 'A idade em anos, quando mencionada na série.',
                    occupation: 'A ocupação principal.',
                    role: 'A importância do personagem na série.',
                    status: 'Se o personagem está vivo.',
                    animationStyle: 'Como o personagem é animado.',
                    voiceActors: 'Os atores que dublaram o personagem.',
                    firstAppearance: 'O episódio em que o personagem aparece pela primeira vez.',
                    colors: 'As cores principais do personagem, em hexadecimal.',
                    image: 'URL da imagem do personagem (WebP).',
                },
                filters: {
                    search: 'Busca parcial pelo nome e pelo nome completo, sem diferenciar maiúsculas de minúsculas.',
                    species: 'Espécie exata, sem diferenciar maiúsculas de minúsculas.',
                    gender: 'Filtra pelo gênero.',
                    role: 'Filtra pela importância na série.',
                    status: 'Filtra pelo status.',
                    animationStyle: 'Filtra pelo estilo de animação.',
                    voiceActor: 'Nome exato de um dos dubladores.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
            locations: {
                title: 'Lugares',
                plural: 'lugares',
                one: 'um lugar',
                summary:
                    'Os lugares do universo de Gumball, organizados em hierarquia: uma sala de aula pertence a uma escola, que pertence a Elmore.',
                sections: {
                    schema: 'Schema de lugar',
                    all: 'Listar todos os lugares',
                    single: 'Buscar um lugar',
                    slug: 'Buscar um lugar pelo slug',
                    random: 'Buscar lugares aleatórios',
                    filter: 'Filtrar lugares',
                },
                fields: {
                    ...commonFields('do lugar', '/locations'),
                    name: 'O nome do lugar.',
                    description: 'Uma breve descrição.',
                    type: 'O tipo de lugar.',
                    parent: 'O lugar que contém este.',
                    firstAppearance: 'O episódio em que o lugar aparece pela primeira vez.',
                    image: 'URL da imagem do lugar (WebP).',
                },
                filters: {
                    search: searchByName,
                    type: 'Filtra pelo tipo.',
                    parentId: 'Id do lugar que contém este.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
            episodes: {
                title: 'Episódios',
                plural: 'episódios',
                one: 'um episódio',
                summary:
                    'Todos os episódios, especiais, curtas e pilotos, com datas de exibição, créditos e links para o episódio anterior e o próximo.',
                sections: {
                    schema: 'Schema de episódio',
                    all: 'Listar todos os episódios',
                    single: 'Buscar um episódio',
                    slug: 'Buscar um episódio pelo slug',
                    random: 'Buscar episódios aleatórios',
                    filter: 'Filtrar episódios',
                },
                fields: {
                    ...commonFields('do episódio', '/episodes'),
                    title: 'O título do episódio.',
                    description: 'Uma breve sinopse.',
                    series: 'A série à qual o episódio pertence.',
                    type: 'O tipo de episódio.',
                    status: 'Se o episódio foi lançado.',
                    season: 'O número da temporada.',
                    episodeNumber: 'O número do episódio na temporada.',
                    overallNumber: 'O número do episódio considerando a série inteira.',
                    code: 'Código de temporada e episódio, como `S01E01`.',
                    productionCode: 'O código de produção.',
                    usAirDate: 'Data da primeira exibição nos EUA.',
                    ukAirDate: 'Data da primeira exibição no Reino Unido.',
                    writers: 'Os roteiristas do episódio.',
                    storyboardArtists: 'Os artistas de storyboard do episódio.',
                    previous: 'O episódio anterior na ordem.',
                    next: 'O próximo episódio na ordem.',
                    image: 'URL da imagem do episódio (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    series: 'Filtra pela série.',
                    type: 'Filtra pelo tipo.',
                    status: 'Filtra pelo status.',
                    season: 'Número da temporada.',
                    writer: 'Nome exato de um dos roteiristas.',
                    storyboardArtist: 'Nome exato de um dos artistas de storyboard.',
                    airedFrom: 'Exibido nos EUA a partir desta data (`YYYY-MM-DD`).',
                    airedTo: 'Exibido nos EUA até esta data (`YYYY-MM-DD`).',
                    ids: idsFilter,
                },
            },
            seasons: {
                title: 'Temporadas',
                plural: 'temporadas',
                one: 'uma temporada',
                summary:
                    'As seis temporadas de O Incrível Mundo de Gumball e as temporadas de The Wonderfully Weird World of Gumball.',
                sections: {
                    schema: 'Schema de temporada',
                    all: 'Listar todas as temporadas',
                    single: 'Buscar uma temporada',
                    slug: 'Buscar uma temporada pelo slug',
                    random: 'Buscar temporadas aleatórias',
                    filter: 'Filtrar temporadas',
                },
                fields: {
                    ...commonFields('da temporada', '/seasons'),
                    number: 'O número da temporada considerando as duas séries.',
                    title: 'O título da temporada.',
                    description: 'Um breve resumo.',
                    series: 'A série à qual a temporada pertence.',
                    seriesSeasonNumber: 'O número da temporada dentro da série.',
                    status: 'Se a temporada foi concluída, está no ar ou ainda vai estrear.',
                    episodeCount: 'A quantidade planejada de episódios.',
                    releasedEpisodeCount: 'A quantidade de episódios já lançados.',
                    networks: 'Os canais que exibiram a temporada.',
                    usPremiereDate: 'Data de estreia nos EUA.',
                    usFinaleDate: 'Data do último episódio nos EUA.',
                    ukPremiereDate: 'Data de estreia no Reino Unido.',
                    ukFinaleDate: 'Data do último episódio no Reino Unido.',
                    episodes: 'Caminho que lista os episódios da temporada.',
                    image: 'URL da imagem da temporada (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    series: 'Filtra pela série.',
                    status: 'Filtra pelo status.',
                    ids: idsFilter,
                },
            },
            songs: {
                title: 'Músicas',
                plural: 'músicas',
                one: 'uma música',
                summary:
                    'As músicas cantadas na série, do tema de abertura aos números musicais de cada episódio.',
                sections: {
                    schema: 'Schema de música',
                    all: 'Listar todas as músicas',
                    single: 'Buscar uma música',
                    slug: 'Buscar uma música pelo slug',
                    random: 'Buscar músicas aleatórias',
                    filter: 'Filtrar músicas',
                },
                fields: {
                    ...commonFields('da música', '/songs'),
                    title: 'O título da música.',
                    description: 'Uma breve descrição.',
                    type: 'O tipo de música.',
                    episode: 'O episódio em que a música é cantada.',
                    characters: 'Os personagens que cantam a música.',
                    vocalists: 'Os intérpretes reais.',
                    genres: 'Gêneros musicais.',
                    duration: 'Duração no formato `m:ss`.',
                    durationSeconds: 'Duração em segundos.',
                    musicalKey: 'A tonalidade musical.',
                    image: 'URL da imagem da música (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    type: 'Filtra pelo tipo.',
                    episodeId: 'Id do episódio.',
                    season: 'Número da temporada do episódio.',
                    characterId: 'Id de um personagem que canta a música.',
                    vocalist: 'Nome exato de um dos intérpretes.',
                    genre: 'Nome exato de um dos gêneros.',
                    ids: idsFilter,
                },
            },
            games: {
                title: 'Jogos',
                plural: 'jogos',
                one: 'um jogo',
                summary:
                    'Jogos oficiais ambientados exclusivamente no universo de Gumball, de jogos de navegador a apps para celular.',
                sections: {
                    schema: 'Schema de jogo',
                    all: 'Listar todos os jogos',
                    single: 'Buscar um jogo',
                    slug: 'Buscar um jogo pelo slug',
                    random: 'Buscar jogos aleatórios',
                    filter: 'Filtrar jogos',
                },
                fields: {
                    ...commonFields('do jogo', '/games'),
                    title: 'O título do jogo.',
                    description: 'Uma breve descrição.',
                    platforms: 'As plataformas em que o jogo foi lançado.',
                    status: 'Se o jogo ainda está disponível.',
                    releaseDate: 'A data de lançamento.',
                    releaseYear: 'O ano de lançamento.',
                    developers: 'Os estúdios responsáveis pelo jogo.',
                    image: 'URL da imagem do jogo (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    platform: 'Filtra pela plataforma.',
                    status: 'Filtra pelo status.',
                    developer: 'Nome exato de um dos estúdios.',
                    releaseYear: 'Ano de lançamento.',
                    ids: idsFilter,
                },
            },
            media: {
                title: 'Mídias',
                plural: 'mídias',
                one: 'uma mídia',
                summary:
                    'Filmes, séries, livros e jogos que existem dentro do universo de Gumball, muitos deles paródias de obras reais.',
                sections: {
                    schema: 'Schema de mídia',
                    all: 'Listar todas as mídias',
                    single: 'Buscar uma mídia',
                    slug: 'Buscar uma mídia pelo slug',
                    random: 'Buscar mídias aleatórias',
                    filter: 'Filtrar mídias',
                },
                fields: {
                    ...commonFields('da mídia', '/media'),
                    title: 'O título da mídia.',
                    description: 'Uma breve descrição.',
                    type: 'O tipo de mídia.',
                    parodyOf: 'A obra real que ela parodia.',
                    firstAppearance: 'O episódio em que aparece pela primeira vez.',
                    image: 'URL da imagem da mídia (WebP).',
                },
                filters: {
                    search: searchByTitle,
                    type: 'Filtra pelo tipo.',
                    firstAppearanceId: firstAppearanceFilter,
                    ids: idsFilter,
                },
            },
        },
    },
} satisfies Dictionary;
