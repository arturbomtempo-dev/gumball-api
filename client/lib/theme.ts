export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'gumball-api-theme';

const THEME_COLORS: Record<Theme, string> = {
    light: '#ffffff',
    dark: '#0e0e10',
};

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})()`;

export function getTheme(): Theme {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function getServerTheme(): Theme {
    return 'light';
}

export function subscribeToTheme(listener: () => void): () => void {
    const observer = new MutationObserver(listener);

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
}

export function syncThemeColor(theme: Theme) {
    document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', THEME_COLORS[theme]);
}

function applyTheme(theme: Theme) {
    document.documentElement.dataset.theme = theme;
    syncThemeColor(theme);

    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        return;
    }
}

export function setTheme(theme: Theme) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reducedMotion && typeof document.startViewTransition === 'function') {
        document.startViewTransition(() => applyTheme(theme));
        return;
    }

    const style = document.createElement('style');
    style.textContent = '*,*::before,*::after{transition:none!important}';
    document.head.appendChild(style);

    applyTheme(theme);

    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
}
