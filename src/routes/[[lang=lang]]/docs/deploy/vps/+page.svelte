<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy-vps/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy-vps/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy-vps/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy-vps/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy-vps/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy-vps/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy-vps/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy-vps/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy-vps/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy-vps/it.svelte';
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
