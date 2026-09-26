<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy-gcp/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy-gcp/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy-gcp/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy-gcp/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy-gcp/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy-gcp/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy-gcp/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy-gcp/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy-gcp/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy-gcp/it.svelte';
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
