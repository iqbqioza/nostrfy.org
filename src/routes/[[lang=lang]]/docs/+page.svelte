<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-index/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-index/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-index/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-index/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-index/ru.svelte';
	import De from '$lib/i18n/pages/docs-index/de.svelte';
	import Fr from '$lib/i18n/pages/docs-index/fr.svelte';
	import Es from '$lib/i18n/pages/docs-index/es.svelte';
	import Pt from '$lib/i18n/pages/docs-index/pt.svelte';
	import It from '$lib/i18n/pages/docs-index/it.svelte';
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
		'it': It
	}}
/>
