<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/home/en.svelte';
	import ZhHans from '$lib/i18n/pages/home/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/home/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/home/ja.svelte';
	import Ru from '$lib/i18n/pages/home/ru.svelte';
	import De from '$lib/i18n/pages/home/de.svelte';
	import Fr from '$lib/i18n/pages/home/fr.svelte';
	import Es from '$lib/i18n/pages/home/es.svelte';
	import Pt from '$lib/i18n/pages/home/pt.svelte';
	import It from '$lib/i18n/pages/home/it.svelte';
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
