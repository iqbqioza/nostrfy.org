<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-blossom/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-blossom/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-blossom/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-blossom/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-blossom/ru.svelte';
	import De from '$lib/i18n/pages/docs-blossom/de.svelte';
	import Fr from '$lib/i18n/pages/docs-blossom/fr.svelte';
	import Es from '$lib/i18n/pages/docs-blossom/es.svelte';
	import Pt from '$lib/i18n/pages/docs-blossom/pt.svelte';
	import It from '$lib/i18n/pages/docs-blossom/it.svelte';
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
