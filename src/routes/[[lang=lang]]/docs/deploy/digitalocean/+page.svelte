<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-deploy-digitalocean/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-deploy-digitalocean/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-deploy-digitalocean/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-deploy-digitalocean/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-deploy-digitalocean/ru.svelte';
	import De from '$lib/i18n/pages/docs-deploy-digitalocean/de.svelte';
	import Fr from '$lib/i18n/pages/docs-deploy-digitalocean/fr.svelte';
	import Es from '$lib/i18n/pages/docs-deploy-digitalocean/es.svelte';
	import Pt from '$lib/i18n/pages/docs-deploy-digitalocean/pt.svelte';
	import It from '$lib/i18n/pages/docs-deploy-digitalocean/it.svelte';
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
