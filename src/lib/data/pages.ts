export interface PageEntry {
	/** Absolute path on the English (default) tree, with a trailing slash. */
	path: string;
	priority: string;
	changefreq?: string;
}

/** Single source of truth for the sitemap and prerender coverage. */
export const pages: PageEntry[] = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/about/', priority: '0.6' },
	{ path: '/faq/', priority: '0.6' },
	{ path: '/compare/strfry/', priority: '0.7' },
	{ path: '/donate/', priority: '0.5' },
	{ path: '/docs/', priority: '0.9', changefreq: 'weekly' },
	{ path: '/docs/introduction/', priority: '0.8' },
	{ path: '/docs/installation/', priority: '0.8' },
	{ path: '/docs/quick-start/', priority: '0.8' },
	{ path: '/docs/configuration/', priority: '0.8' },
	{ path: '/docs/commands/', priority: '0.7' },
	{ path: '/docs/operation/', priority: '0.7' },
	{ path: '/docs/migrating-from-strfry/', priority: '0.7' },
	{ path: '/docs/nips/', priority: '0.7' },
	{ path: '/docs/rest-api/', priority: '0.7' },
	{ path: '/docs/groups/', priority: '0.7' },
	{ path: '/docs/livekit/', priority: '0.6' },
	{ path: '/docs/blossom/', priority: '0.7' },
	{ path: '/docs/management/', priority: '0.7' },
	{ path: '/docs/troubleshooting/', priority: '0.7' },
	{ path: '/docs/deploy/', priority: '0.7' },
	{ path: '/docs/deploy/vps/', priority: '0.6' },
	{ path: '/docs/deploy/aws/', priority: '0.6' },
	{ path: '/docs/deploy/gcp/', priority: '0.6' },
	{ path: '/docs/deploy/azure/', priority: '0.6' },
	{ path: '/docs/deploy/digitalocean/', priority: '0.6' },
	{ path: '/docs/deploy/fly/', priority: '0.6' }
];

/** Bump when page content changes across the site. */
export const siteLastmod = '2026-09-25';

export const siteUrl = 'https://nostrfy.org';
