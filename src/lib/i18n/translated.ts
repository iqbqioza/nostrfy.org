import type { Locale } from './locale';

/**
 * Base paths that have a real translation per locale.
 *
 * `'all'` means every page in `$lib/data/pages`. Add a path here when its
 * locale body exists in `src/lib/i18n/pages/<page>/<locale>.svelte` — until
 * then the page falls back to English and is marked `noindex`, and it is
 * excluded from the sitemap and hreflang alternates.
 */
export const translated: Record<Locale, string[] | 'all'> = {
	en: 'all',
	'zh-Hans': 'all',
	'zh-Hant': 'all',
	ja: 'all',
	ru: 'all',
	de: 'all',
	fr: 'all',
	es: 'all',
	pt: 'all',
	it: 'all'
};

export function isTranslated(locale: Locale, path: string): boolean {
	const entry = translated[locale];
	if (entry === 'all') return true;
	const base = path.endsWith('/') ? path : path + '/';
	return entry.includes(base);
}
