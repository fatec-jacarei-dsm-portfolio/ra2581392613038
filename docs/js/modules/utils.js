/**
 * Faz o escape de uma string para que ela possa ser inserida com segurança
 * como conteúdo de texto em HTML, evitando XSS quando valores vindos do
 * `portfolioData` (ou de qualquer outra fonte) são interpolados no DOM.
 *
 * @param {*} value - Valor a ser escapado. Aceita qualquer tipo.
 * @returns {string} String HTML-safe (ou string vazia para null/undefined).
 */
export function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Atalho para `document.querySelector` que retorna `null` quando o
 * seletor não corresponde a nenhum elemento, evitando exceções nos
 * renderizadores.
 *
 * @param {string} selector - Seletor CSS.
 * @returns {Element|null} Elemento encontrado ou `null`.
 */
export function $(selector) {
    return document.querySelector(selector);
}

/**
 * Define o `textContent` de um elemento a partir de um seletor CSS.
 * Caso o elemento não exista, a função é um no-op silencioso.
 *
 * @param {string} selector - Seletor CSS do elemento alvo.
 * @param {string} text - Texto a ser inserido (string vazia por padrão).
 */
export function setText(selector, text) {
    const el = $(selector);
    if (el) el.textContent = text || "";
}

/**
 * Mostra ou esconde um elemento `<a>` com base na presença de uma URL.
 * Usado para os botões de GitHub/LinkedIn do herói, que ficam ocultos
 * quando o usuário não preenche esses campos.
 *
 * @param {string} selector - Seletor CSS do link.
 * @param {string} url - URL de destino. Vazio/falsy esconde o link.
 */
export function setLinkProperties(selector, url) {
    const el = $(selector);
    if (!el) return;
    if (url) {
        el.href = url;
        el.style.display = "inline-flex";
    } else {
        el.style.display = "none";
    }
}

/**
 * Gerenciador de bloqueio de scroll do `<body>`.
 *
 * Vários recursos (menu mobile, modal) podem solicitar o bloqueio do
 * scroll ao mesmo tempo. A classe `modal-open` só é removida do `<body>`
 * quando todos os solicitantes liberam o lock. Isso evita que, por
 * exemplo, abrir o modal dentro do menu mobile "destranque" o scroll
 * prematuramente.
 */
export const ScrollLock = (() => {
    // Conjunto de "razões" que estão atualmente segurando o lock.
    const holders = new Set();

    return {
        /** Solicita o bloqueio de scroll usando uma `reason` única. */
        acquire(reason) {
            holders.add(reason);
            document.body.classList.add("modal-open");
        },
        /** Libera o bloqueio de uma `reason`. Só destrava quando todas saírem. */
        release(reason) {
            holders.delete(reason);
            if (holders.size === 0) {
                document.body.classList.remove("modal-open");
            }
        },
        /** Indica se existe algum bloqueio ativo. */
        isLocked() {
            return holders.size > 0;
        },
    };
})();

/**
 * Estado global compartilhado entre os módulos de render e interação.
 *
 * - `activeFilter`: filtro atual da grade de projetos.
 * - `lastFocusedElement`: elemento que tinha foco antes do modal abrir,
 *    para devolver o foco ao fechar (boas práticas de acessibilidade).
 * - `projectFilterHandlersBound`: garante que o handler de clique da
 *    barra de filtros seja registrado uma única vez, mesmo que
 *    `renderProjectsSection` seja chamado várias vezes.
 */
export const state = {
    activeFilter: "all",
    lastFocusedElement: null,
    projectFilterHandlersBound: false,
};
