<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/compare-strfry/en.svelte';
	import ZhHans from '$lib/i18n/pages/compare-strfry/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/compare-strfry/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/compare-strfry/ja.svelte';
	import Ru from '$lib/i18n/pages/compare-strfry/ru.svelte';
	import De from '$lib/i18n/pages/compare-strfry/de.svelte';
	import Fr from '$lib/i18n/pages/compare-strfry/fr.svelte';
	import Es from '$lib/i18n/pages/compare-strfry/es.svelte';
	import Pt from '$lib/i18n/pages/compare-strfry/pt.svelte';
	import It from '$lib/i18n/pages/compare-strfry/it.svelte';
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
