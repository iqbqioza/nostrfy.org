<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-groups/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-groups/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-groups/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-groups/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-groups/ru.svelte';
	import De from '$lib/i18n/pages/docs-groups/de.svelte';
	import Fr from '$lib/i18n/pages/docs-groups/fr.svelte';
	import Es from '$lib/i18n/pages/docs-groups/es.svelte';
	import Pt from '$lib/i18n/pages/docs-groups/pt.svelte';
	import It from '$lib/i18n/pages/docs-groups/it.svelte';
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
