export const locales = [
	'en',
	'zh-Hans',
	'zh-Hant',
	'ja',
	'ru',
	'de',
	'fr',
	'es',
	'pt',
	'it'
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

const PREFIXED = locales.filter((locale) => locale !== 'en');

const LOCALE_RE = new RegExp(`^/(${PREFIXED.map((l) => l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?=/|$)`);

export function isLocale(value: string | undefined | null): value is Locale {
	return typeof value === 'string' && (locales as readonly string[]).includes(value);
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
	'zh-Hant': 'zh-Hant',
	ja: 'ja',
	ru: 'ru',
	de: 'de',
	fr: 'fr',
	es: 'es',
	pt: 'pt',
	it: 'it'
};

export const ogLocale: Record<Locale, string> = {
	en: 'en_US',
	'zh-Hans': 'zh_CN',
	'zh-Hant': 'zh_TW',
	ja: 'ja_JP',
	ru: 'ru_RU',
	de: 'de_DE',
	fr: 'fr_FR',
	es: 'es_ES',
	pt: 'pt_BR',
	it: 'it_IT'
};

/** Native language names shown in the switcher. */
export const localeNames: Record<Locale, string> = {
	en: 'English',
	'zh-Hans': '简体中文',
	'zh-Hant': '繁體中文',
	ja: '日本語',
	ru: 'Русский',
	de: 'Deutsch',
	fr: 'Français',
	es: 'Español',
	pt: 'Português',
	it: 'Italiano'
};

/** Short labels for the collapsed switcher button. */
export const localeShort: Record<Locale, string> = {
	en: 'EN',
	'zh-Hans': '简',
	'zh-Hant': '繁',
	ja: '日',
	ru: 'RU',
	de: 'DE',
	fr: 'FR',
	es: 'ES',
	pt: 'PT',
	it: 'IT'
};
