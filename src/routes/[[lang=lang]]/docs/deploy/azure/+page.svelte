<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy-azure/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy-azure/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy-azure/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy-azure/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy-azure/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy-azure/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy-azure/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy-azure/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy-azure/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy-azure/it.svelte';
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
