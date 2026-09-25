<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import { docsNav } from '$lib/data/docs-nav';
	import { page } from '$app/stores';
	import { site } from '$lib/data/site';
	import Icon from '$lib/components/Icon.svelte';

	let {
		title,
		description
	}: {
		title: string;
		description: string;
	} = $props();

	const current = $derived($page.url.pathname.endsWith('/') ? $page.url.pathname : $page.url.pathname + '/');
	const group = $derived(
		docsNav.find((g) => g.items.some((i) => i.href === current))?.label
	);

	const breadcrumbs = $derived.by(() => {
		const items: { name: string; url?: string }[] = [
			{ name: 'Home', url: `https://${site.domain}/` },
			{ name: 'Docs', url: `https://${site.domain}/docs/` }
		];
		if (group && group !== title) items.push({ name: group });
		items.push({ name: title, url: `https://${site.domain}${current}` });
		return items;
	});

	const breadcrumbJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: breadcrumbs.map((item, i) => ({
				'@type': 'ListItem',
				position: i + 1,
				name: item.name,
				...(item.url ? { item: item.url } : {})
			}))
		})
	);

	const articleJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'TechArticle',
			headline: title,
			description,
			mainEntityOfPage: `https://${site.domain}${current}`,
			inLanguage: 'en',
			isPartOf: {
				'@type': 'WebSite',
				name: 'nostrfy',
				url: `https://${site.domain}/`
			},
			publisher: {
				'@type': 'Organization',
				name: 'nostrfy',
				url: `https://${site.domain}/`,
				logo: {
					'@type': 'ImageObject',
					url: `https://${site.domain}/logo.png`
				}
			}
		})
	);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${breadcrumbJsonLd}</script>`}
	{@html `<script type="application/ld+json">${articleJsonLd}</script>`}
</svelte:head>

<PageMeta {title} {description} type="article" />

<div class="mb-8">
	<nav class="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
		<a href="/docs/" class="transition-colors hover:text-zinc-300">Docs</a>
		<span class="text-zinc-700">/</span>
		{#if group && group !== title}
			<span class="text-zinc-500">{group}</span>
			<span class="text-zinc-700">/</span>
		{/if}
		<span class="text-zinc-300">{title}</span>
	</nav>
	<h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
	<p class="mt-3 max-w-2xl text-base text-zinc-400">{description}</p>
</div>