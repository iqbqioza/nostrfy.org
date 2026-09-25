export interface DocsEntry {
	title: string;
	href: string;
}

export interface DocsGroup {
	label: string;
	items: DocsEntry[];
}

export const docsNav: DocsGroup[] = [
	{
		label: 'Getting started',
		items: [
			{ title: 'Introduction', href: '/docs/introduction/' },
			{ title: 'Installation', href: '/docs/installation/' },
			{ title: 'Quick start', href: '/docs/quick-start/' }
		]
	},
	{
		label: 'Operations',
		items: [
			{ title: 'Configuration', href: '/docs/configuration/' },
			{ title: 'Commands', href: '/docs/commands/' },
			{ title: 'Running the relay', href: '/docs/operation/' },
			{ title: 'Migrating from strfry', href: '/docs/migrating-from-strfry/' }
		]
	},
	{
		label: 'Features',
		items: [
			{ title: 'Supported NIPs', href: '/docs/nips/' },
			{ title: 'REST API', href: '/docs/rest-api/' },
			{ title: 'NIP-29 Groups', href: '/docs/groups/' },
			{ title: 'LiveKit rooms', href: '/docs/livekit/' },
			{ title: 'Blossom file server', href: '/docs/blossom/' },
			{ title: 'NIP-86 management', href: '/docs/management/' }
		]
	},
	{
		label: 'Deployment',
		items: [
			{ title: 'Overview', href: '/docs/deploy/' },
			{ title: 'Fly.io', href: '/docs/deploy/fly/' },
			{ title: 'Any VPS', href: '/docs/deploy/vps/' },
			{ title: 'Digital Ocean', href: '/docs/deploy/digitalocean/' },
			{ title: 'AWS', href: '/docs/deploy/aws/' },
			{ title: 'Google Cloud', href: '/docs/deploy/gcp/' },
			{ title: 'Azure', href: '/docs/deploy/azure/' }
		]
	},
	{
		label: 'Help',
		items: [{ title: 'Troubleshooting', href: '/docs/troubleshooting/' }]
	}
];

export function flattenDocsNav(): DocsEntry[] {
	return docsNav.flatMap((g) => g.items);
}