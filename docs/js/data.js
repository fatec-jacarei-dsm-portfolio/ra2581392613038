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
        role: "Desenvolvedor de Software",
        location: "Jacareí, SP",
        description:
            "Estudante de Desenvolvimento de Software Multiplataforma na Fatec Jacareí. Apaixonado por solucionar problemas através de código limpo, arquitetura escalável e interfaces elegantes.",
        // Deixe "" para testar o fallback de iniciais ("PH").
        profileImage: "assets/images/profile/profile.png",
        email: "pedrohjose01@gmail.com",
        github: "https://github.com/phjsilva",
        linkedin: "https://www.linkedin.com/in/pedrohjose/",
    },

    /* --- Sobre, interesses e objetivos profissionais --- */
    about: {
        title: "Sobre mim",
        description:
            "Atualmente curso o 2º semestre de Desenvolvimento de Software Multiplataforma (DSM) na Fatec Jacareí. Meu foco principal está em projetar e construir aplicações web modernas, seguras e bem estruturadas. Tenho grande interesse na cultura DevOps, boas práticas de código (Clean Code) e metodologias ágeis.",
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
            title: "ABP1-Portal Scrum",
            description:
                "Plataforma para aprender e se certificar em Scrum.O aluno faz provas por níveis, acompanha sua evolução e, ao concluir todos, recebe um certificado com a nota final. Projeto em grupo, desenvolvido em 3 sprints aplicando Scrum na prática.",
            contribution: 
                "Desenvolvi boa parte do backen(API, regras de negócio e banco de dados), refatorei para arquitetura em camadas (Controller, Service e Repositories) e atuei como Product Owner, apoiando o time.",
            technologies: ["HTML5", "CSS3", "JavaScript", "SQL", "PostgreSQL"],
            semester: "1º Semestre",
            type: "Acadêmico",
            github: "https://github.com/TeamStacked/PortalScrum",
            demo: "https://portal-scrum.vercel.app",
            // Deixe "" para usar o fallback visual estilizado do card.
            image: "assets/images/projects/portal-scrum.png",
        }
    ],
};
