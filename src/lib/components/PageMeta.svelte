<script lang="ts">
	import { page } from '$app/stores';
	import { site } from '$lib/data/site';
	import { localeForPathname, type Locale } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

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

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
	const t = $derived(ui[locale]);

	const fullTitle = $derived(
		title
			? title.toLowerCase().includes('nostrfy')
				? title
				: `${title} · nostrfy`
			: t.meta.homeTitle
	);
	const desc = $derived(description ?? t.meta.defaultDescription);
	const url = $derived(`https://${site.domain}${$page.url.pathname}`);
	const ogImage = $derived(`https://${site.domain}${image}`);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
	<meta
		name="robots"
		content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
	/>
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="nostrfy" />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content={t.meta.ogImageAlt} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={desc} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="theme-color" content="#09090b" />
</svelte:head>
