<script lang="ts">
	import { page } from '$app/stores';
	import { site } from '$lib/data/site';

	let {
		title,
		description,
		image = '/og-image.png',
		type = 'website'
	}: {
		title?: string;
		description?: string;
		image?: string;
		type?: string;
	} = $props();

	const fullTitle = $derived(title ? `${title} · nostrfy` : 'nostrfy — All-in-one Nostr relay server engine');
	const desc = $derived(
		description ?? site.description
	);
	const url = $derived(`https://${site.domain}${$page.url.pathname}`);
	const ogImage = $derived(`https://${site.domain}${image}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="nostrfy" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="theme-color" content="#09090b" />
</svelte:head>