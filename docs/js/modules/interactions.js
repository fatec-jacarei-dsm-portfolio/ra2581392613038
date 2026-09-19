import { portfolioData } from "../data.js";
import { escapeHtml, $, setText, ScrollLock, state } from "./utils.js";
import { ICONS } from "./icons.js";

/**
 * Liga o botão de alternar tema. Aplica o tema oposto ao atual
 * e persiste a escolha no `localStorage`.
 */
export function setupTheme() {
    const btn = document.getElementById("theme-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
    });
}

/**
 * Aplica o tema no `<html>` e persiste a escolha no `localStorage`.
 * Tolerante a falhas de armazenamento (modo anônimo etc.).
 *
 * @param {"light"|"dark"} theme - Tema a ser aplicado.
 */
function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
    try {
        localStorage.setItem("theme", theme);
    } catch (_) {
        // Armazenamento pode estar indisponível no modo anônimo — ignora.
    }
}

/**
 * Configura a abertura/fechamento do menu mobile: troca o ícone
 * (hambúrguer ↔ X), bloqueia o scroll do `<body>` enquanto aberto
 * e fecha automaticamente ao clicar em qualquer link.
 */
export function setupMobileMenu() {
    const btn = document.getElementById("menu-btn");
    const nav = document.getElementById("navigation");
    const links = document.querySelectorAll(".nav-link");
    if (!btn || !nav) return;

    btn.addEventListener("click", () => {
        if (nav.classList.contains("active")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Qualquer clique em um link fecha o menu.
    links.forEach((link) => {
        link.addEventListener("click", () => closeMenu());
    });

    function openMenu() {
        nav.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
        btn.setAttribute("aria-label", "Fechar menu de navegação");
        btn.innerHTML = ICONS.menuClose;
        ScrollLock.acquire("mobile-menu");
    }

    function closeMenu() {
        nav.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Abrir menu de navegação");
        btn.innerHTML = ICONS.menuOpen;
        ScrollLock.release("mobile-menu");
    }
}

/**
 * Configura os listeners de fechamento do modal: clique no botão X,
 * clique no backdrop e tecla `Escape`.
 */
export function setupProjectModal() {
    const modal = document.getElementById("project-modal");
    const closeBtn = document.getElementById("modal-close");
    if (!modal || !closeBtn) return;

    closeBtn.addEventListener("click", closeProjectModal);

    // Fecha ao clicar diretamente no overlay (não no conteúdo).
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeProjectModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeProjectModal();
        }
    });
}

/**
 * Abre o modal de detalhes do projeto e preenche todos os campos
 * a partir do objeto `portfolioData.projects[index]`. Ativa o
 * focus trap, bloqueia o scroll e devolve o foco ao elemento
 * que abriu o modal ao fechar.
 *
 * @param {number} index - Índice do projeto em `portfolioData.projects`.
 * @param {Element} [triggerElement] - Elemento que disparou a abertura
 *   (usado para devolver o foco ao fechar).
 */
export function openProjectModal(index, triggerElement) {
    const modal = document.getElementById("project-modal");
    const project = portfolioData.projects?.[index];
    if (!modal || !project) return;

    state.lastFocusedElement = triggerElement || null;

    // Imagem do modal: sempre reinicia o `src` para que a imagem do
    // projeto anterior não vaze para o próximo.
    const modalImg = document.getElementById("modal-image");
    if (modalImg) {
        if (project.image) {
            modalImg.src = project.image;
            modalImg.alt = `Capa de ${project.title}`;
            modalImg.style.display = "block";
        } else {
            modalImg.removeAttribute("src");
            modalImg.alt = "";
            modalImg.style.display = "none";
        }
    }

    setText("#modal-title", project.title);
    setText("#modal-desc", project.description);
    setText("#modal-contrib", project.contribution);

    // Linha de badges (semestre + tipo) no topo do modal.
    const metaRow = document.getElementById("modal-meta");
    if (metaRow) {
        metaRow.innerHTML = `
            <span class="project-badge project-badge-semester">${escapeHtml(project.semester || "")}</span>
            <span class="project-badge" style="background: var(--badge-bg); color: var(--badge-text); border: 1px solid var(--border-color);">${escapeHtml(project.type || "")}</span>
        `;
    }

    // Grid de tags com as tecnologias usadas no projeto.
    const tagsGrid = document.getElementById("modal-tags");
    if (tagsGrid) {
        const techs = Array.isArray(project.technologies)
            ? project.technologies
            : [];
        tagsGrid.innerHTML = techs
            .map(
                (tech) =>
                    `<span class="pill" style="font-family: var(--font-mono); font-size: 0.8rem;">${escapeHtml(tech)}</span>`,
            )
            .join("");
    }

    // Botões de ação (repositório e/ou demo) — só aparecem se existirem.
    const actionsContainer = document.getElementById("modal-actions-container");
    if (actionsContainer) {
        const actionButtons = [];
        if (project.github) {
            actionButtons.push(`
                <a href="${escapeHtml(project.github)}" class="btn btn-primary" target="_blank" rel="noopener">
                    ${ICONS.github}
                    Acessar Repositório
                </a>
            `);
        }
        if (project.demo) {
            actionButtons.push(`
                <a href="${escapeHtml(project.demo)}" class="btn btn-secondary" target="_blank" rel="noopener">
                    ${ICONS.globe}
                    Visualizar Demonstração
                </a>
            `);
        }
        actionsContainer.innerHTML = actionButtons.join("");
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    ScrollLock.acquire("project-modal");

    // Liga o focus trap uma única vez por instância do modal.
    if (!modal._focusTrapBound) {
        modal.addEventListener("keydown", trapFocus);
        modal._focusTrapBound = true;
    }

    // Move o foco para o primeiro elemento focável após a transição.
    setTimeout(() => {
        const first = modal.querySelector("a[href], button:not([disabled])");
        if (first) first.focus();
    }, 50);
}

/**
 * Implementa o "focus trap": mantém o foco preso dentro do modal
 * enquanto ele estiver aberto, alternando entre o primeiro e o
 * último elemento focável ao usar `Tab`/`Shift+Tab`.
 *
 * @param {KeyboardEvent} e - Evento de keydown.
 */
function trapFocus(e) {
    if (e.key !== "Tab") return;
    const modal = document.getElementById("project-modal");
    if (!modal || !modal.classList.contains("active")) return;

    const focusable = Array.from(
        modal.querySelectorAll("a[href], button:not([disabled])"),
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
    }
}

/**
 * Fecha o modal, libera o scroll e devolve o foco ao elemento
 * que o abriu.
 */
export function closeProjectModal() {
    const modal = document.getElementById("project-modal");
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    ScrollLock.release("project-modal");

    if (state.lastFocusedElement) {
        state.lastFocusedElement.focus();
        state.lastFocusedElement = null;
    }
}

/**
 * Atualiza a largura da barra de progresso de scroll no topo da
 * página, com `requestAnimationFrame` para evitar reflows excessivos.
 */
export function setupScrollProgress() {
    const bar = document.getElementById("scroll-progress-bar");
    if (!bar) return;

    let ticking = false;
    function update() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const max =
            document.documentElement.scrollHeight - window.innerHeight || 1;
        const pct = Math.max(0, Math.min(100, (scrollTop / max) * 100));
        bar.style.width = `${pct}%`;
        ticking = false;
    }
    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        },
        { passive: true },
    );
    update();
}

/**
 * Mostra o botão de voltar ao topo depois que o usuário rola além
 * do hero, e faz scroll suave até o topo ao clicar.
 */
export function setupBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    let ticking = false;
    function update() {
        // Aparece após rolar ~60% da altura do hero.
        const hero = document.getElementById("home");
        const trigger = hero ? hero.offsetHeight * 0.6 : 400;
        btn.classList.toggle("visible", window.scrollY > trigger);
        ticking = false;
    }
    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        },
        { passive: true },
    );

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    update();
}

/**
 * Destaca o link de navegação correspondente à seção que está
 * visível na viewport. Usa `IntersectionObserver` quando disponível
 * e cai para um cálculo simples de scrollY em navegadores antigos.
 */
export function setupActiveNav() {
    const links = Array.from(document.querySelectorAll(".nav-link"));
    if (links.length === 0) return;

    const linkByHash = new Map(
        links
            .map((a) => [a.getAttribute("href"), a])
            .filter(([h]) => h && h.startsWith("#")),
    );

    // Fallback para navegadores sem IntersectionObserver.
    if (!("IntersectionObserver" in window)) {
        window.addEventListener(
            "scroll",
            () => {
                let active = null;
                links.forEach((a) => {
                    const id = a.getAttribute("href");
                    if (!id || !id.startsWith("#")) return;
                    const el = document.getElementById(id.slice(1));
                    if (el && el.getBoundingClientRect().top <= 120) active = a;
                });
                links.forEach((a) => a.classList.remove("active"));
                if (active) active.classList.add("active");
            },
            { passive: true },
        );
        return;
    }

    // RootMargin negativa para que o link mude quando a seção
    // cruzar a faixa superior da viewport.
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = `#${entry.target.id}`;
                links.forEach((a) =>
                    a.classList.toggle("active", a.getAttribute("href") === id),
                );
            });
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    // Observa apenas as seções que têm um link correspondente.
    linkByHash.forEach((_link, hash) => {
        const section = document.getElementById(hash.slice(1));
        if (section) observer.observe(section);
    });
}

// Mantém o `$` importado (reservado para extensões futuras).
void $;
