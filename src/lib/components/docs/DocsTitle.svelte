<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import { docsNav } from '$lib/data/docs-nav';
	import { page } from '$app/stores';
	import { site } from '$lib/data/site';
	import { basePath, localePath, localeForPathname, type Locale } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';
	import Icon from '$lib/components/Icon.svelte';

	let {
		title,
		description
	}: {
		title: string;
		description: string;
	} = $props();

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
	const t = $derived(ui[locale]);

	const current = $derived.by(() => {
		const base = basePath($page.url.pathname);
		return base.endsWith('/') ? base : base + '/';
	});
	const group = $derived(docsNav.find((g) => g.items.some((i) => i.href === current))?.label);
	const groupLabel = $derived(group ? (t.navGroups[group] ?? group) : undefined);
	const pageUrl = $derived(`https://${site.domain}${localePath(locale, current)}`);

	const breadcrumbs = $derived.by(() => {
		const items: { name: string; url?: string }[] = [
			{ name: t.docs.home, url: `https://${site.domain}${localePath(locale, '/')}` },
			{ name: t.docs.breadcrumb, url: `https://${site.domain}${localePath(locale, '/docs/')}` }
		];
		if (groupLabel && groupLabel !== title) items.push({ name: groupLabel });
		items.push({ name: title, url: pageUrl });
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
			mainEntityOfPage: pageUrl,
			inLanguage: locale,
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
	<nav class="flex items-center gap-1.5 text-xs text-zinc-500" aria-label={t.docs.breadcrumbAria}>
		<a href={localePath(locale, '/docs/')} class="transition-colors hover:text-zinc-300">
			{t.docs.breadcrumb}
		</a>
		<span class="text-zinc-700">/</span>
		{#if groupLabel && groupLabel !== title}
			<span class="text-zinc-500">{groupLabel}</span>
			<span class="text-zinc-700">/</span>
		{/if}
		<span class="text-zinc-300">{title}</span>
	</nav>
	<h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
	<p class="mt-3 max-w-2xl text-base text-zinc-400">{description}</p>
</div>
