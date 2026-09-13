<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import { docsNav, flattenDocsNav } from '$lib/data/docs-nav';
	import { page } from '$app/stores';
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
</script>

<PageMeta {title} {description} />

<div class="mb-8">
	<nav class="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Breadcrumb">
		<a href="/docs/" class="transition-colors hover:text-zinc-300">Docs</a>
		<span class="text-zinc-700">/</span>
		{#if group}
			<span class="text-zinc-500">{group}</span>
			<span class="text-zinc-700">/</span>
		{/if}
		<span class="text-zinc-300">{title}</span>
	</nav>
	<h1 class="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
	<p class="mt-3 max-w-2xl text-base text-zinc-400">{description}</p>
</div>