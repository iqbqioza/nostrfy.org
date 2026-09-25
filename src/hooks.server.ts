import type { Handle } from '@sveltejs/kit';
import { localeForPathname } from '$lib/i18n/locale';

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', localeForPathname(event.url.pathname))
	});
};
