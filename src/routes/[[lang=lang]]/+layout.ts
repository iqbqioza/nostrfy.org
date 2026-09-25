import type { LayoutLoad } from './$types';
import { toLocale } from '$lib/i18n/locale';

export const prerender = true;
export const trailingSlash = 'always';

export const load: LayoutLoad = ({ params }) => {
	return { locale: toLocale(params.lang) };
};
