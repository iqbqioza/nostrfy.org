<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-quick-start/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-quick-start/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-quick-start/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-quick-start/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-quick-start/ru.svelte';
	import De from '$lib/i18n/pages/docs-quick-start/de.svelte';
	import Fr from '$lib/i18n/pages/docs-quick-start/fr.svelte';
	import Es from '$lib/i18n/pages/docs-quick-start/es.svelte';
	import Pt from '$lib/i18n/pages/docs-quick-start/pt.svelte';
	import It from '$lib/i18n/pages/docs-quick-start/it.svelte';
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
