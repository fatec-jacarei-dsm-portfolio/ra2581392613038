import {
    initSEO,
    renderHeader,
    renderHero,
    renderAbout,
    renderSkills,
    renderProjectsSection,
    renderExperienceSection,
    renderAcademicSection,
    renderContactSection,
    renderFooter,
    injectStructuredData,
} from "./modules/render.js";

import {
    setupTheme,
    setupMobileMenu,
    setupProjectModal,
    setupScrollProgress,
    setupBackToTop,
    setupActiveNav,
} from "./modules/interactions.js";

/**
 * Inicializa todo o portfólio assim que o DOM está pronto:
 * primeiro popula o conteúdo (SEO + seções + rodapé + JSON-LD) e
 * em seguida liga os listeners de interação (tema, menu, modal,
 * scroll, navegação ativa, voltar ao topo).
 */
function bootstrap() {
    // Renderização de todas as seções a partir de `portfolioData`.
    initSEO();
    renderHeader();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjectsSection();
    renderExperienceSection();
    renderAcademicSection();
    renderContactSection();
    renderFooter();
    injectStructuredData();

    // Listeners e comportamentos dinâmicos.
    setupTheme();
    setupMobileMenu();
    setupProjectModal();
    setupScrollProgress();
    setupBackToTop();
    setupActiveNav();
}

// Tudo que o `main.js` precisa já foi importado no topo do arquivo.
// O sistema de módulos ES garante a ordem de carregamento, então se
// `data.js` estiver ausente o erro aparece no próprio `import` acima.
document.addEventListener("DOMContentLoaded", bootstrap);
