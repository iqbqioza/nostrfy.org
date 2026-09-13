<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	const websiteJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: 'nostrfy',
		url: 'https://nostrfy.org/',
		description: 'All-in-one Nostr relay server engine written in Rust'
	});

	const organizationJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'nostrfy',
		url: 'https://nostrfy.org/',
		logo: 'https://nostrfy.org/logo.png',
		sameAs: ['https://github.com/iqbqioza/nostrfy']
	});
</script>

<svelte:head>
	<meta property="og:locale" content="en_US" />
	{@html `<script type="application/ld+json">${websiteJsonLd}</script>`}
	{@html `<script type="application/ld+json">${organizationJsonLd}</script>`}
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>