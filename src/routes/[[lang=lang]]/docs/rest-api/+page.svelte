<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-rest-api/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-rest-api/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-rest-api/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-rest-api/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-rest-api/ru.svelte';
	import De from '$lib/i18n/pages/docs-rest-api/de.svelte';
	import Fr from '$lib/i18n/pages/docs-rest-api/fr.svelte';
	import Es from '$lib/i18n/pages/docs-rest-api/es.svelte';
	import Pt from '$lib/i18n/pages/docs-rest-api/pt.svelte';
	import It from '$lib/i18n/pages/docs-rest-api/it.svelte';
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
