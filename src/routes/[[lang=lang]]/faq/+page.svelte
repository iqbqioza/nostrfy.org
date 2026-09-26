<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/faq/en.svelte';
	import ZhHans from '$lib/i18n/pages/faq/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/faq/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/faq/ja.svelte';
	import Ru from '$lib/i18n/pages/faq/ru.svelte';
	import De from '$lib/i18n/pages/faq/de.svelte';
	import Fr from '$lib/i18n/pages/faq/fr.svelte';
	import Es from '$lib/i18n/pages/faq/es.svelte';
	import Pt from '$lib/i18n/pages/faq/pt.svelte';
	import It from '$lib/i18n/pages/faq/it.svelte';
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
