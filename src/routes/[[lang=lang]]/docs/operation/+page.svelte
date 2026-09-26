<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-operation/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-operation/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-operation/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-operation/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-operation/ru.svelte';
	import De from '$lib/i18n/pages/docs-operation/de.svelte';
	import Fr from '$lib/i18n/pages/docs-operation/fr.svelte';
	import Es from '$lib/i18n/pages/docs-operation/es.svelte';
	import Pt from '$lib/i18n/pages/docs-operation/pt.svelte';
	import It from '$lib/i18n/pages/docs-operation/it.svelte';
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
