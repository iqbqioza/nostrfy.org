<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/donate/en.svelte';
	import ZhHans from '$lib/i18n/pages/donate/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/donate/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/donate/ja.svelte';
	import Ru from '$lib/i18n/pages/donate/ru.svelte';
	import De from '$lib/i18n/pages/donate/de.svelte';
	import Fr from '$lib/i18n/pages/donate/fr.svelte';
	import Es from '$lib/i18n/pages/donate/es.svelte';
	import Pt from '$lib/i18n/pages/donate/pt.svelte';
	import It from '$lib/i18n/pages/donate/it.svelte';
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
