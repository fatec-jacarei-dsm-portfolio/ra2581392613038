import { portfolioData } from "../data.js";
import { escapeHtml, $, setText, setLinkProperties, state } from "./utils.js";
import {
    ICONS,
    SKILL_CATEGORY_ICONS,
    buildTechnologyIcon,
} from "./icons.js";

/**
 * Atualiza `<title>`, `<meta name="description">`, `<meta name="keywords">`
 * e as tags Open Graph a partir de `portfolioData.seo`. Cria as metas
 * dinamicamente se elas ainda não existirem no `<head>`.
 */
export function initSEO() {
    if (!portfolioData.seo) return;

    document.title = portfolioData.seo.title || "Portfólio";

    setMetaContent("description", portfolioData.seo.description);
    if (portfolioData.seo.keywords && portfolioData.seo.keywords.length > 0) {
        setMetaContent("keywords", portfolioData.seo.keywords.join(", "));
    }

    setOpenGraph("og:title", portfolioData.seo.title);
    setOpenGraph("og:description", portfolioData.seo.description);
    setOpenGraph("og:image", portfolioData.seo.image);
    setOpenGraph("og:type", "profile");
    setOpenGraph("og:locale", "pt_BR");
}

/**
 * Cria ou atualiza uma meta tag `<meta name="...">` no `<head>`.
 *
 * @param {string} name - Atributo `name` da meta tag.
 * @param {string} content - Valor a ser definido em `content`.
 */
function setMetaContent(name, content) {
    if (!content) return;
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
}

/**
 * Cria ou atualiza uma meta tag Open Graph (`<meta property="og:...">`).
 *
 * @param {string} property - Atributo `property` da meta tag (ex.: "og:title").
 * @param {string} content - Valor a ser definido em `content`.
 */
function setOpenGraph(property, content) {
    if (!content) return;
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
}

/* -------------------------------------------------------------------
 * 2. Cabeçalho
 * ------------------------------------------------------------------- */

/**
 * Preenche o logo do cabeçalho com o primeiro nome da pessoa,
 * seguido de um "." colorido via CSS.
 */
export function renderHeader() {
    const logo = document.getElementById("header-logo");
    if (!logo || !portfolioData.personal.name) return;

    const firstName = escapeHtml(portfolioData.personal.name.split(" ")[0]);
    logo.innerHTML = `${firstName}<span>.</span>`;
}

/* -------------------------------------------------------------------
 * 3. Herói
 * ------------------------------------------------------------------- */

/**
 * Renderiza a seção "herói": nome, cargo, localização, descrição,
 * botões de ação e avatar (foto ou, na falta dela, iniciais).
 */
export function renderHero() {
    const p = portfolioData.personal;
    if (!p) return;

    setText("#hero-name", p.name);
    setText("#hero-role", p.role);
    setText("#hero-description", p.description);

    // Localização é opcional: esconde o wrapper caso não esteja preenchida.
    const locationWrapper = document.getElementById("hero-location-wrapper");
    if (p.location) {
        setText("#hero-location", p.location);
    } else if (locationWrapper) {
        locationWrapper.style.display = "none";
    }

    // Botões de GitHub/LinkedIn são ocultados quando não há URL.
    setLinkProperties("#hero-github", p.github);
    setLinkProperties("#hero-linkedin", p.linkedin);

    const avatarContainer = document.getElementById("hero-avatar");
    if (!avatarContainer) return;

    if (p.profileImage) {
        // Usa a foto de perfil quando estiver configurada.
        avatarContainer.innerHTML = `<img src="${escapeHtml(p.profileImage)}" alt="Foto de perfil de ${escapeHtml(p.name)}">`;
    } else {
        // Fallback elegante: iniciais com gradiente (PH, JS, etc.).
        const initials = escapeHtml(
            p.name
                .split(" ")
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join("")
                .toUpperCase(),
        );
        avatarContainer.innerHTML = `<div class="profile-avatar-fallback" aria-hidden="true">${initials}</div>`;
    }
}

/* -------------------------------------------------------------------
 * 4. Sobre
 * ------------------------------------------------------------------- */

/**
 * Renderiza a seção "Sobre mim": descrição em parágrafos, pills de
 * interesses e objetivos profissionais. Esconde as seções de
 * interesses/objetivos quando seus respectivos arrays estiverem vazios.
 */
export function renderAbout() {
    const about = portfolioData.about;
    if (!about) return;

    // Descrição quebra em múltiplos parágrafos a cada "\n" duplo.
    const descContainer = document.getElementById("about-description");
    if (descContainer && about.description) {
        const paragraphs = about.description
            .split("\n")
            .map((para) => para.trim())
            .filter((para) => para.length > 0)
            .map((para) => `<p class="text-lead">${escapeHtml(para)}</p>`)
            .join("");
        descContainer.innerHTML = paragraphs;
    }

    // Pills de interesses — bloco some se a lista estiver vazia.
    const interestsContainer = document.getElementById("about-interests");
    if (interestsContainer) {
        if (about.interests && about.interests.length > 0) {
            interestsContainer.innerHTML = about.interests
                .map(
                    (interest) =>
                        `<span class="pill">${escapeHtml(interest)}</span>`,
                )
                .join("");
        } else {
            const section = document.getElementById("interests-section");
            if (section) section.style.display = "none";
        }
    }

    // Objetivos profissionais — bloco some se a lista estiver vazia.
    const objectivesContainer = document.getElementById("about-objectives");
    if (objectivesContainer) {
        if (about.objectives && about.objectives.length > 0) {
            objectivesContainer.innerHTML = about.objectives
                .map(
                    (obj) =>
                        `<div class="objective-item">${escapeHtml(obj)}</div>`,
                )
                .join("");
        } else {
            const section = document.getElementById("objectives-section");
            if (section) section.style.display = "none";
        }
    }
}

/* -------------------------------------------------------------------
 * 5. Habilidades
 * ------------------------------------------------------------------- */

/**
 * Renderiza a grade de habilidades por categoria (Linguagens, Front-end,
 * Back-end, Banco de Dados, Ferramentas). Cada skill exibe um SVG
 * local da tecnologia (ou um fallback com a inicial) e o nome.
 */
export function renderSkills() {
    const grid = document.getElementById("skills-grid");
    if (!grid || !portfolioData.skills) return;

    // Mapeia a chave do `portfolioData.skills` para o rótulo exibido.
    const categories = {
        languages: "Linguagens",
        frontend: "Front-end",
        backend: "Back-end",
        database: "Banco de Dados",
        tools: "Ferramentas",
    };

    const cards = Object.entries(categories)
        .filter(
            ([key]) =>
                Array.isArray(portfolioData.skills[key]) &&
                portfolioData.skills[key].length > 0,
        )
        .map(([key, label]) => {
            const items = portfolioData.skills[key]
                .map((skill) => {
                    const safeName = escapeHtml(skill.name);
                    const iconHtml = skill.icon
                        ? buildTechnologyIcon(skill.icon)
                        : `<span class="skill-item-icon-fallback" aria-hidden="true">${escapeHtml((skill.name || "?").charAt(0).toUpperCase())}</span>`;
                    return `
                        <li class="skill-item">
                            ${iconHtml}
                            <span class="skill-item-name">${safeName}</span>
                        </li>
                    `;
                })
                .join("");

            return `
                <div class="skill-card">
                    <div class="skill-card-header">
                        <span class="skill-category-icon" aria-hidden="true">${SKILL_CATEGORY_ICONS[key] || ""}</span>
                        <h3 class="skill-category-title">${escapeHtml(label)}</h3>
                    </div>
                    <ul class="skill-list">${items}</ul>
                </div>
            `;
        })
        .join("");

    grid.innerHTML = cards;

    // Bloco "Em aprendizado contínuo" fica dentro da mesma seção.
    renderLearning();
}

/**
 * Renderiza a lista de tecnologias que estão sendo estudadas atualmente.
 * Esconde toda a seção quando o array `learning` estiver vazio.
 */
function renderLearning() {
    const container = document.getElementById("learning-list");
    if (!container) return;
    const items = Array.isArray(portfolioData.learning)
        ? portfolioData.learning
        : [];
    if (items.length === 0) {
        const section = document.getElementById("learning-section");
        if (section) section.style.display = "none";
        return;
    }

    container.innerHTML = items
        .map((item) => {
            const safeName = escapeHtml(item.name);
            const iconHtml = item.icon
                ? buildTechnologyIcon(item.icon).replace(
                      'class="skill-item-icon"',
                      'class="learning-tag-icon"',
                  )
                : "";
            return `<span class="learning-tag">${iconHtml}<span>${safeName}</span></span>`;
        })
        .join("");
}

/* -------------------------------------------------------------------
 * 6. Projetos
 * ------------------------------------------------------------------- */

/**
 * Renderiza a barra de filtros (gerada a partir dos `type` de cada
 * projeto) e a grade inicial de cards. O handler de clique dos
 * filtros é registrado apenas na primeira chamada.
 */
export function renderProjectsSection() {
    const grid = document.getElementById("projects-grid");
    const filterBar = document.getElementById("filter-bar");
    const projects = portfolioData.projects;
    if (!grid || !projects) return;

    if (filterBar) {
        // Coleta os tipos únicos para gerar um botão por categoria.
        const types = new Set();
        projects.forEach((p) => {
            if (p.type) types.add(p.type);
        });

        const buttons = [
            `<button class="filter-btn active" data-filter="all" role="tab" aria-selected="true" aria-controls="projects-grid">Todos</button>`,
        ];
        types.forEach((type) => {
            buttons.push(
                `<button class="filter-btn" data-filter="${escapeHtml(type)}" role="tab" aria-selected="false" aria-controls="projects-grid">${escapeHtml(type)}</button>`,
            );
        });
        filterBar.innerHTML = buttons.join("");

        // Liga o handler de clique uma única vez, mesmo que a função
        // seja chamada várias vezes (defesa contra re-renderizações).
        if (!state.projectFilterHandlersBound) {
            filterBar.addEventListener("click", (e) => {
                const btn = e.target.closest(".filter-btn");
                if (!btn) return;

                filterBar.querySelectorAll(".filter-btn").forEach((b) => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
                state.activeFilter = btn.getAttribute("data-filter");
                filterAndRenderProjects();
            });
            state.projectFilterHandlersBound = true;
        }
    }

    filterAndRenderProjects();
}

/**
 * Re-renderiza a grade de projetos aplicando o filtro ativo no estado.
 * Quando não há projetos para o filtro, mostra uma mensagem amigável.
 */
export function filterAndRenderProjects() {
    const grid = document.getElementById("projects-grid");
    const projects = portfolioData.projects;
    if (!grid || !projects) return;

    const filtered =
        state.activeFilter === "all"
            ? projects
            : projects.filter((p) => p.type === state.activeFilter);

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px 0;">Nenhum projeto encontrado nesta categoria.</p>`;
        return;
    }

    grid.innerHTML = filtered
        .map((project) => {
            // Usa o índice original para que o modal sempre referencie o
            // projeto correto, mesmo após a filtragem.
            const originalIndex = projects.indexOf(project);

            let imageHtml = "";
            if (project.image) {
                imageHtml = `<img src="${escapeHtml(project.image)}" alt="Capa de ${escapeHtml(project.title)}" class="project-image" loading="lazy">`;
            } else {
                // Placeholder estilizado quando o projeto não tem capa.
                const firstTech = escapeHtml(
                    project.technologies?.[0] || "Code",
                );
                imageHtml = `
                <div class="project-image-fallback">
                    <div class="project-image-fallback-icon" aria-hidden="true">&lt;/&gt;</div>
                    <span class="text-muted" style="font-size: 0.8rem; font-family: var(--font-mono);">${firstTech}</span>
                </div>
            `;
            }

            // Mostra até 3 tags no card + contador "+N" para as restantes.
            const allTags = Array.isArray(project.technologies)
                ? project.technologies
                : [];
            const cardTags = allTags.slice(0, 3);
            const remainingTagsCount = allTags.length - cardTags.length;

            return `
            <article class="project-card" data-index="${originalIndex}" tabindex="0" role="button" aria-haspopup="dialog" aria-label="Ver detalhes de ${escapeHtml(project.title)}">
                <div class="project-image-container">
                    ${imageHtml}
                    <div class="project-card-meta">
                        <span class="project-badge project-badge-semester">${escapeHtml(project.semester || "")}</span>
                    </div>
                </div>
                <div class="project-card-body">
                    <h3 class="project-card-title">${escapeHtml(project.title)}</h3>
                    <p class="project-card-description">${escapeHtml(project.description)}</p>
                    <div class="project-card-footer">
                        <div class="project-card-tags">
                            ${cardTags.map((t) => `<span class="project-card-tag">#${escapeHtml(t)}</span>`).join(" ")}
                            ${remainingTagsCount > 0 ? `<span class="project-card-tag">+${remainingTagsCount}</span>` : ""}
                        </div>
                        <span class="project-card-arrow" aria-hidden="true">${ICONS.arrowRight}</span>
                    </div>
                </div>
            </article>
        `;
        })
        .join("");

    // Reanexa os handlers de clique e teclado em cada card.
    grid.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("click", () => {
            const idx = parseInt(card.getAttribute("data-index"), 10);
            if (!Number.isNaN(idx)) openProjectModal(idx, card);
        });
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const idx = parseInt(card.getAttribute("data-index"), 10);
                if (!Number.isNaN(idx)) openProjectModal(idx, card);
            }
        });
    });
}

// Importação tardia para evitar dependência circular entre render
// e interações (o handler dos cards precisa abrir o modal).
import { openProjectModal } from "./interactions.js";

/* -------------------------------------------------------------------
 * 7. Experiência profissional
 * ------------------------------------------------------------------- */

/**
 * Renderiza a timeline de experiências profissionais. Caso
 * `portfolioData.experience` esteja vazio, esconde toda a seção
 * e o link de navegação correspondente.
 */
export function renderExperienceSection() {
    const section = document.getElementById("experience");
    const timeline = document.getElementById("experience-timeline");
    const navItem = document.getElementById("nav-item-experience");
    const exp = portfolioData.experience;
    if (!section) return;

    if (!exp || exp.length === 0) {
        section.style.display = "none";
        if (navItem) navItem.style.display = "none";
        return;
    }

    if (navItem) navItem.style.display = "";
    section.style.display = "";

    if (timeline) {
        timeline.innerHTML = exp
            .map(
                (item) => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <span class="timeline-period">${escapeHtml(item.period)}</span>
                <h3 class="timeline-title">${escapeHtml(item.company)}</h3>
                <h4 class="timeline-subtitle">${escapeHtml(item.role)}</h4>
                <p class="timeline-description">${escapeHtml(item.description)}</p>
            </div>
        `,
            )
            .join("");
    }
}

/* -------------------------------------------------------------------
 * 8. Formação acadêmica e cursos
 * ------------------------------------------------------------------- */

/**
 * Renderiza o card com o curso principal e a timeline de
 * certificações/cursos complementares.
 */
export function renderAcademicSection() {
    const mainInfo = document.getElementById("main-academic-info");
    const timeline = document.getElementById("education-timeline");
    const ac = portfolioData.academic;
    const ed = portfolioData.education;

    if (mainInfo && ac) {
        mainInfo.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-dot" style="border-color: var(--accent);"></div>
                <span class="timeline-period">${escapeHtml(ac.startYear)} - Presente</span>
                <h3 class="timeline-title">${escapeHtml(ac.course)}</h3>
                <h4 class="timeline-subtitle">${escapeHtml(ac.institution)}</h4>
                <p class="timeline-description">
                    <strong>Semestre Atual:</strong> ${escapeHtml(ac.semester)}<br>
                    <strong>Status:</strong> ${escapeHtml(ac.status)}
                </p>
            </div>
        `;
    }

    if (timeline && Array.isArray(ed) && ed.length > 0) {
        timeline.innerHTML = ed
            .map(
                (item) => `
            <div class="timeline-item">
                <div class="timeline-dot"></div>
                <span class="timeline-period">${escapeHtml(item.period)}</span>
                <h3 class="timeline-title">${escapeHtml(item.course)}</h3>
                <h4 class="timeline-subtitle">${escapeHtml(item.institution)}</h4>
            </div>
        `,
            )
            .join("");
    }
}

/* -------------------------------------------------------------------
 * 9. Contato
 * ------------------------------------------------------------------- */

/**
 * Renderiza os cards de contato (e-mail, GitHub, LinkedIn) a partir
 * dos campos preenchidos em `portfolioData.personal`. Links sem URL
 * são simplesmente omitidos.
 */
export function renderContactSection() {
    const container = document.getElementById("contact-links-grid");
    const p = portfolioData.personal;
    if (!container || !p) return;

    const links = [];
    if (p.email) {
        links.push({
            label: "E-mail Profissional",
            value: p.email,
            url: `mailto:${p.email}`,
            icon: ICONS.email,
        });
    }
    if (p.github) {
        links.push({
            label: "GitHub",
            value: p.github.replace(/^https?:\/\//, ""),
            url: p.github,
            icon: ICONS.github,
        });
    }
    if (p.linkedin) {
        links.push({
            label: "LinkedIn",
            value: p.linkedin.replace(/^https?:\/\//, ""),
            url: p.linkedin,
            icon: ICONS.linkedin,
        });
    }

    container.innerHTML = links
        .map(
            (link) => `
        <a href="${escapeHtml(link.url)}" class="contact-link" target="_blank" rel="noopener" aria-label="${escapeHtml(link.label)}: ${escapeHtml(link.value)}">
            <div class="contact-icon" aria-hidden="true">${link.icon}</div>
            <div class="contact-link-details">
                <span class="contact-link-label">${escapeHtml(link.label)}</span>
                <span class="contact-link-value">${escapeHtml(link.value)}</span>
            </div>
        </a>
    `,
        )
        .join("");
}

/* -------------------------------------------------------------------
 * 10. Rodapé
 * ------------------------------------------------------------------- */

/**
 * Renderiza o rodapé: logo, copyright dinâmico e ícones de redes sociais.
 */
export function renderFooter() {
    const logo = document.getElementById("footer-logo");
    const copyright = document.getElementById("footer-copyright");
    const socialLinks = document.getElementById("footer-social-links");
    const p = portfolioData.personal;
    if (!p) return;

    if (logo) {
        const firstName = escapeHtml((p.name || "").split(" ")[0]);
        logo.innerHTML = `${firstName}<span>.</span>`;
    }

    if (copyright) {
        copyright.textContent = `© ${new Date().getFullYear()} ${p.name}. Todos os direitos reservados.`;
    }

    if (socialLinks) {
        const parts = [];
        if (p.github) {
            parts.push(
                `<a href="${escapeHtml(p.github)}" class="footer-social-link" target="_blank" rel="noopener" aria-label="Visitar GitHub">${ICONS.github}</a>`,
            );
        }
        if (p.linkedin) {
            parts.push(
                `<a href="${escapeHtml(p.linkedin)}" class="footer-social-link" target="_blank" rel="noopener" aria-label="Visitar LinkedIn">${ICONS.linkedin}</a>`,
            );
        }
        socialLinks.innerHTML = parts.join("");
    }
}

/* -------------------------------------------------------------------
 * Dados estruturados (JSON-LD) para SEO
 * ------------------------------------------------------------------- */

/**
 * Injeta no `<script id="ld-person">` um payload JSON-LD do tipo
 * `Person` (schema.org) com os dados pessoais e as habilidades.
 * Melhora a forma como mecanismos de busca entendem o portfólio.
 */
export function injectStructuredData() {
    const slot = document.getElementById("ld-person");
    if (!slot || !portfolioData.personal) return;

    const p = portfolioData.personal;
    const sameAs = [p.github, p.linkedin].filter(Boolean);

    const payload = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: p.name,
        jobTitle: p.role,
        description: p.description,
        email: p.email ? `mailto:${p.email}` : undefined,
        address: p.location
            ? { "@type": "PostalAddress", addressLocality: p.location }
            : undefined,
        url: window.location.href,
        sameAs: sameAs.length ? sameAs : undefined,
        knowsAbout: portfolioData.skills
            ? Object.values(portfolioData.skills)
                  .flat()
                  .map((s) => s.name)
                  .filter(Boolean)
            : undefined,
    };

    // Remove chaves com `undefined` para um JSON limpo.
    Object.keys(payload).forEach(
        (k) => payload[k] === undefined && delete payload[k],
    );

    slot.textContent = JSON.stringify(payload, null, 2);
}

// Mantém o `$` importado usado internamente (algumas checagens
// poderiam utilizá-lo em extensões futuras).
void $;
