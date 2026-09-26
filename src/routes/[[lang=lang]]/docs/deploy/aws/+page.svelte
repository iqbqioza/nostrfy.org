<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy-aws/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy-aws/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy-aws/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy-aws/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy-aws/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy-aws/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy-aws/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy-aws/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy-aws/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy-aws/it.svelte';
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
