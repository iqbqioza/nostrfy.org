import type { RequestHandler } from './$types';
import { locales, localePath } from '$lib/i18n/locale';
import { isTranslated } from '$lib/i18n/translated';
import { pages, siteLastmod, siteUrl } from '$lib/data/pages';

export const prerender = true;

export const GET: RequestHandler = () => {
	const entries: string[] = [];

	for (const page of pages) {
		const available = locales.filter((locale) => locale === 'en' || isTranslated(locale, page.path));
		const alternates = [
			...available.map((locale) => ({
				hreflang: locale,
				href: `${siteUrl}${localePath(locale, page.path)}`
			})),
			{ hreflang: 'x-default', href: `${siteUrl}${localePath('en', page.path)}` }
		];

		for (const locale of available) {
			const lines = [
				'\t<url>',
				`\t\t<loc>${siteUrl}${localePath(locale, page.path)}</loc>`,
				`\t\t<lastmod>${siteLastmod}</lastmod>`,
				page.changefreq ? `\t\t<changefreq>${page.changefreq}</changefreq>` : null,
				`\t\t<priority>${page.priority}</priority>`,
				...alternates.map(
					(alt) =>
						`\t\t<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`
				),
				'\t</url>'
			].filter((line): line is string => line !== null);
			entries.push(lines.join('\n'));
		}
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
};
