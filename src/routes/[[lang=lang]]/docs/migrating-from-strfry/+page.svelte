<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-migrating/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-migrating/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-migrating/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-migrating/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-migrating/ru.svelte';
	import De from '$lib/i18n/pages/docs-migrating/de.svelte';
	import Fr from '$lib/i18n/pages/docs-migrating/fr.svelte';
	import Es from '$lib/i18n/pages/docs-migrating/es.svelte';
	import Pt from '$lib/i18n/pages/docs-migrating/pt.svelte';
	import It from '$lib/i18n/pages/docs-migrating/it.svelte';
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
