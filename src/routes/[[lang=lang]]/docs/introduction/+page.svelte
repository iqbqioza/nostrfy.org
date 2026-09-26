<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-introduction/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-introduction/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-introduction/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-introduction/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-introduction/ru.svelte';
	import De from '$lib/i18n/pages/docs-introduction/de.svelte';
	import Fr from '$lib/i18n/pages/docs-introduction/fr.svelte';
	import Es from '$lib/i18n/pages/docs-introduction/es.svelte';
	import Pt from '$lib/i18n/pages/docs-introduction/pt.svelte';
	import It from '$lib/i18n/pages/docs-introduction/it.svelte';
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
