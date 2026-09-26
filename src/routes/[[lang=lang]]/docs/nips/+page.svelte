<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-nips/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-nips/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-nips/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-nips/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-nips/ru.svelte';
	import De from '$lib/i18n/pages/docs-nips/de.svelte';
	import Fr from '$lib/i18n/pages/docs-nips/fr.svelte';
	import Es from '$lib/i18n/pages/docs-nips/es.svelte';
	import Pt from '$lib/i18n/pages/docs-nips/pt.svelte';
	import It from '$lib/i18n/pages/docs-nips/it.svelte';
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
