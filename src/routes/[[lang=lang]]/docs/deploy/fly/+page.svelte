<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy-fly/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy-fly/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy-fly/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy-fly/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy-fly/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy-fly/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy-fly/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy-fly/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy-fly/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy-fly/it.svelte';
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
