const LANGS = ['zh-Hans', 'zh-Hant'];

/** Restricts `[[lang=lang]]` to the two Chinese prefixes; English lives at the root. */
export function match(param: string): boolean {
	return LANGS.includes(param);
}
