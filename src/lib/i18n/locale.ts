export const locales = ['en', 'zh-Hans', 'zh-Hant'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

const LOCALE_RE = /^\/(zh-Hans|zh-Hant)(?=\/|$)/;

export function isLocale(value: string | undefined | null): value is Locale {
	return value === 'en' || value === 'zh-Hans' || value === 'zh-Hant';
}

export function toLocale(value: string | undefined | null): Locale {
	return isLocale(value) ? value : defaultLocale;
}

/** Strips a locale prefix from a pathname: `/zh-Hans/docs/` → `/docs/`. */
export function basePath(pathname: string): string {
	const match = pathname.match(LOCALE_RE);
	if (!match) return pathname;
	return pathname.slice(match[0].length) || '/';
}

/** Prefixes a pathname for a locale. English stays at the root. */
export function localePath(locale: Locale, pathname: string): string {
	const base = basePath(pathname);
	if (locale === 'en') return base;
	return `/${locale}${base === '/' ? '/' : base}`;
}

export function localeForPathname(pathname: string): Locale {
	const match = pathname.match(LOCALE_RE);
	return match ? (match[1] as Locale) : 'en';
}

export const htmlLang: Record<Locale, string> = {
	en: 'en',
	'zh-Hans': 'zh-Hans',
	'zh-Hant': 'zh-Hant'
};

export const ogLocale: Record<Locale, string> = {
	en: 'en_US',
	'zh-Hans': 'zh_CN',
	'zh-Hant': 'zh_TW'
};

/** Native language names shown in the switcher. */
export const localeNames: Record<Locale, string> = {
	en: 'English',
	'zh-Hans': '简体中文',
	'zh-Hant': '繁體中文'
};

/** Short labels for the collapsed switcher button. */
export const localeShort: Record<Locale, string> = {
	en: 'EN',
	'zh-Hans': '简',
	'zh-Hant': '繁'
};
