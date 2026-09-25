<script lang="ts">
	import { page } from '$app/stores';
	import { localePath, localeForPathname, type Locale } from '$lib/i18n/locale';

	let {
		size = 26,
		class: className = '',
		withWordmark = true,
		label = 'nostrfy home'
	}: { size?: number; class?: string; withWordmark?: boolean; label?: string } = $props();

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
</script>

<a href={localePath(locale, '/')} class="inline-flex items-center gap-2.5 {className}" aria-label={label}>
	<img src="/logo.png" width={size} height={size} alt="" class="rounded-[30%]" />
	{#if withWordmark}
		<span class="text-[17px] font-semibold tracking-tight text-zinc-50">nostrfy</span>
	{/if}
</a>
