<script lang="ts">
	import '../../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';
	import { locales, localePath, ogLocale, type Locale } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';
	import type { Snippet } from 'svelte';

	let {
		data,
		children
	}: {
		data: { locale: Locale };
		children?: Snippet;
	} = $props();

	const locale = $derived<Locale>(data.locale);
	const t = $derived(ui[locale]);

	const SITE = 'https://nostrfy.org';
	const href = (target: Locale) => `${SITE}${localePath(target, $page.url.pathname)}`;

	const websiteJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: 'nostrfy',
			url: `${SITE}/`,
			description: t.meta.defaultDescription,
			inLanguage: locale
		})
	);

	const organizationJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'nostrfy',
		url: `${SITE}/`,
		logo: `${SITE}/logo.png`,
		sameAs: ['https://github.com/iqbqioza/nostrfy']
	});
</script>

<svelte:head>
	<meta property="og:locale" content={ogLocale[locale]} />
	{#each locales.filter((l) => l !== locale) as alt (alt)}
		<meta property="og:locale:alternate" content={ogLocale[alt]} />
	{/each}
	{#each locales as alt (alt)}
		<link rel="alternate" hreflang={alt} href={href(alt)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={href('en')} />
	{@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
	{@html `<script type="application/ld+json">${organizationJsonLd}</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
</div>
