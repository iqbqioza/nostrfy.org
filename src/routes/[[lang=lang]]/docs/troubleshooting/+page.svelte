<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-troubleshooting/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-troubleshooting/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-troubleshooting/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-troubleshooting/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-troubleshooting/ru.svelte';
	import De from '$lib/i18n/pages/docs-troubleshooting/de.svelte';
	import Fr from '$lib/i18n/pages/docs-troubleshooting/fr.svelte';
	import Es from '$lib/i18n/pages/docs-troubleshooting/es.svelte';
	import Pt from '$lib/i18n/pages/docs-troubleshooting/pt.svelte';
	import It from '$lib/i18n/pages/docs-troubleshooting/it.svelte';
</script>

<LocaleBody
	bodies={{
		'en': En,
		'zh-Hans': ZhHans,
		'zh-Hant': ZhHant,
		'ja': Ja,
		'ru': Ru,
		'de': De,
		'fr': Fr,
		'es': Es,
		'pt': Pt,
		'it': It,
	}}
/>
