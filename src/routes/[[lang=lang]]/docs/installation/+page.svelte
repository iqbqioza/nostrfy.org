<script lang="ts">
	import { page } from '$app/stores';
	import { localeForPathname, type Locale } from '$lib/i18n/locale';
	import En from '$lib/i18n/pages/docs-installation/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-installation/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-installation/zh-Hant.svelte';

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
</script>

{#if locale === 'zh-Hans'}
	<ZhHans />
{:else if locale === 'zh-Hant'}
	<ZhHant />
{:else}
	<En />
{/if}
