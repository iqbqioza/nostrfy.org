<script lang="ts">
	import { page } from '$app/stores';
	import { setContext, type Component } from 'svelte';
	import { basePath, localeForPathname, toLocale, type Locale } from '$lib/i18n/locale';
	import { isTranslated } from '$lib/i18n/translated';

	let { bodies }: { bodies: Partial<Record<Locale, Component>> } = $props();

	const locale = $derived<Locale>(
		toLocale($page.data.locale ?? localeForPathname($page.url.pathname))
	);
	const Body = $derived(bodies[locale] ?? bodies.en);
	const hasTranslation = $derived(isTranslated(locale, basePath($page.url.pathname)));

	setContext('nostrfy:page-translated', () => hasTranslation);
</script>

{#if Body}
	<Body />
{/if}
