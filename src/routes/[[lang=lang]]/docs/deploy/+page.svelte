<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy/it.svelte';
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
