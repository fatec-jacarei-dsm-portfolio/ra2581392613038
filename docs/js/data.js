/**
 * Objeto central com todas as informações exibidas no portfólio:
 * dados pessoais, SEO, habilidades, formação, projetos etc.
 */
export const portfolioData = {
    /* --- SEO (title, description, Open Graph) --- */
    seo: {
        title: "Pedro Henrique — Desenvolvedor de Software Multiplataforma",
        description:
            "Portfólio acadêmico e profissional de Pedro Henrique, estudante de DSM na Fatec Jacareí. Projetos de software, tecnologias e experiências.",
        image: "assets/images/profile/profile.png",
        keywords: [
            "Fatec",
            "Jacareí",
            "DSM",
            "Desenvolvimento de Software Multiplataforma",
            "Dev",
            "Full Stack",
        ],
    },

    /* --- Dados pessoais exibidos no herói, contato e rodapé --- */
    personal: {
        name: "Pedro Henrique",
        role: "Desenvolvedor Back-end",
        location: "Jacareí, SP",
        description:
            "Desenvolvo APIs e aplicações com TypeScript, Node.js e PostgreSQL. Nos projetos da Fatec Jacareí e nos meus projetos pessoais, transformo problemas em soluções com código organizado e trabalho em equipe.",
        // Deixe "" para testar o fallback de iniciais ("PH").
        profileImage: "assets/images/profile/profile.png",
        github: "https://github.com/phjsilva",
        linkedin: "https://www.linkedin.com/in/pedrohjose/",
    },

    /* --- Sobre, interesses e objetivos profissionais --- */
    about: {
        title: "Sobre mim",
        description:
            "Minha formação em Desenvolvimento de Software Multiplataforma (DSM) na Fatec Jacareí orienta meu interesse por tecnologia. Meu foco principal está em projetar e construir aplicações web modernas, seguras e bem estruturadas. Tenho grande interesse na cultura DevOps, boas práticas de código (Clean Code) e metodologias ágeis.",
        interests: [
            "Arquitetura de Software",
            "Desenvolvimento Full Stack",
            "Desenvolvimento Back-End",
        ],
        objectives: [
            "Conquistar uma oportunidade de estágio ou júnior em desenvolvimento de software.",
            "Aprofundar conhecimentos em ecossistemas de microsserviços e APIs RESTful.",
        ],
    },

    /* --- Habilidades agrupadas por categoria --- */
    skills: {
        languages: [
            { name: "JavaScript (ES6+)", icon: "javascript" },
            { name: "TypeScript", icon: "typescript" },
            { name: "SQL", icon: "azuresqldatabase" },
            { name: "Python", icon: "python" },
        ],
        frontend: [
            { name: "React", icon: "react" },
            { name: "Tailwind CSS", icon: "tailwindcss" },
            { name: "NextJs", icon: "nextjs" },
            { name: "Vite", icon: "vite" },
        ],
        backend: [
            { name: "Node.js", icon: "nodejs" },
            { name: "Express", icon: "express" },
        ],
        database: [{ name: "PostgreSQL", icon: "postgresql" }],
        tools: [
            { name: "Git", icon: "git" },
            { name: "GitHub", icon: "github" },
            { name: "Docker", icon: "docker" },
            { name: "Figma", icon: "figma" },
        ],
    },

    // Tecnologias em estudo — demonstra mentalidade de crescimento.
    learning: [
        { name: "Prisma ORM", icon: "prisma" },
        { name: "Testes Automatizados", icon: "jest" },
        { name: "fastApi", icon: "fastapi" },
        { name: "Java", icon: "java" },
    ],

    /* --- Curso principal em andamento --- */
    academic: {
        course: "Desenvolvimento de Software Multiplataforma",
        institution: "Fatec Jacareí",
        semester: "2º Semestre",
        startYear: "2025",
        status: "Em andamento",
    },

    experience: [
        /* {
            company: "",
            role: "",
            period: "",
            description: "",
        }, 
        */
    ],

    /* --- Cursos e certificações complementares --- */
    education: [
        {
            course: "IT Essentials",
            institution: "CISCO",
            period: "2026",
        },
        {
            course: "Curso Completo de Git e GitHub (12h)",
            institution: "Cursa",
            period: "2026",
        },
        {
            course: "Criação de Página Web com Marketing Digital",
            institution: "SENAI",
            period: "2024",
        },
    ],

    /* --- Projetos exibidos na grade (com filtros automáticos por `type`) --- */
    projects: [
        {
            title: "GreenER — ABP 2DSM",
            description:
                "Aplicação web desenvolvida em equipe para monitorar recursos de serviços digitais e estimar consumo de energia e emissões de CO₂e. Reúne histórico de coletas, comparação entre serviços, rankings e painéis de monitoramento para apoiar análises de sustentabilidade.",
            contribution:
                "Atuei principalmente no back-end, integrando dados de métricas e intensidade de carbono, implementando a coleta e a persistência no PostgreSQL e criando endpoints de histórico e status do monitoramento. Também contribuí com autenticação, configuração do ambiente com Docker Compose, documentação técnica e ajustes na interface.",
            technologies: [
                "TypeScript",
                "Node.js",
                "Express",
                "PostgreSQL",
                "React",
                "Zod",
                "Docker",
            ],
            semester: "2DSM",
            type: "Acadêmico",
            github: "https://github.com/Team-Zero-DSM/GreenER",
            demo: "",
            image: "assets/images/projects/greener.jpg",
        },
        {
            title: "Portal Scrum — ABP 1DSM",
            description:
                "Plataforma para aprender e se certificar em Scrum. O aluno faz provas por níveis, acompanha sua evolução e, ao concluir todos, recebe um certificado com a nota final. Projeto em grupo, desenvolvido em 3 sprints aplicando Scrum na prática.",
            contribution:
                "Desenvolvi boa parte do back-end (API, regras de negócio e banco de dados), refatorei para arquitetura em camadas (Controller, Service e Repositories) e atuei como Product Owner, apoiando o time.",
            technologies: [
                "JavaScript",
                "Node.js",
                "Express",
                "PostgreSQL",
                "HTML5",
                "CSS3",
            ],
            semester: "1DSM",
            type: "Acadêmico",
            github: "https://github.com/TeamStacked/PortalScrum",
            demo: "https://portal-scrum.vercel.app",
            // Deixe "" para usar o fallback visual estilizado do card.
            image: "assets/images/projects/portal-scrum.png",
        },
        {
            title: "MasterKey — Catálogo de jogos",
            description:
                "Projeto pessoal full stack para descobrir e cadastrar jogos. O catálogo oferece busca por nome ou estúdio, filtros por gênero e plataforma, ordenação, paginação e páginas de detalhes, com uma API REST e persistência em banco relacional.",
            contribution:
                "Desenvolvi a interface com Next.js, React e TypeScript e a API com Node.js e Express. Organizei o back-end em camadas, modelei os dados com Prisma e PostgreSQL e implementei busca, filtros, cadastro e validação. Também configurei o Docker Compose e os testes automatizados do catálogo, formulário e API.",
            technologies: [
                "TypeScript",
                "Next.js",
                "React",
                "Tailwind CSS",
                "JavaScript",
                "Node.js",
                "Express",
                "PostgreSQL",
                "Prisma",
                "Docker",
            ],
            semester: "Projeto pessoal",
            type: "Pessoal",
            github: "https://github.com/phjsilva/masterkey-game",
            demo: "",
            image: "assets/images/projects/masterkey.jpg",
        },
    ],
};
