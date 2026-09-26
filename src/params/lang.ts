import { locales, defaultLocale } from '$lib/i18n/locale';

/** Restricts `[[lang=lang]]` to the prefixed locales; English lives at the root. */
export function match(param: string): boolean {
	return (locales as readonly string[]).filter((l) => l !== defaultLocale).includes(param);
}
