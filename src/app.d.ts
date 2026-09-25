import type { Locale } from '$lib/i18n/locale';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface PageData {
			locale?: Locale;
		}
	}
}

export {};
