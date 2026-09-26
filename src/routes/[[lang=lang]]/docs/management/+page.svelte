<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-management/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-management/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-management/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-management/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-management/ru.svelte';
	import De from '$lib/i18n/pages/docs-management/de.svelte';
	import Fr from '$lib/i18n/pages/docs-management/fr.svelte';
	import Es from '$lib/i18n/pages/docs-management/es.svelte';
	import Pt from '$lib/i18n/pages/docs-management/pt.svelte';
	import It from '$lib/i18n/pages/docs-management/it.svelte';
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
