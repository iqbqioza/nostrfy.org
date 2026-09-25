<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath, localeForPathname, ogLocale, type Locale } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

	const status = $derived($page.status || 404);
	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
	const t = $derived(ui[locale]);
</script>

<svelte:head>
	<title>{status} — nostrfy</title>
	<meta name="robots" content="noindex" />
	<meta property="og:locale" content={ogLocale[locale]} />
	<meta name="theme-color" content="#09090b" />
</svelte:head>

<div class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
	<p class="font-mono text-6xl font-bold text-accent-500">{status}</p>
	<h1 class="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
		{status === 404 ? t.error.notFound : t.error.generic}
	</h1>
	<p class="mt-3 max-w-md text-zinc-400">
		{status === 404 ? t.error.notFoundBody : t.error.genericBody}
	</p>
	<a
		href={localePath(locale, '/')}
		class="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
	>
		<Icon name="arrow-left" size={16} /> {t.error.home}
	</a>
</div>
