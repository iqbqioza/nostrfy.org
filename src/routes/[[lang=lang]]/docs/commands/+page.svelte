<script lang="ts">
	import LocaleBody from '$lib/i18n/LocaleBody.svelte';
	import En from '$lib/i18n/pages/docs-commands/en.svelte';
	import ZhHans from '$lib/i18n/pages/docs-commands/zh-Hans.svelte';
	import ZhHant from '$lib/i18n/pages/docs-commands/zh-Hant.svelte';
	import Ja from '$lib/i18n/pages/docs-commands/ja.svelte';
	import Ru from '$lib/i18n/pages/docs-commands/ru.svelte';
	import De from '$lib/i18n/pages/docs-commands/de.svelte';
	import Fr from '$lib/i18n/pages/docs-commands/fr.svelte';
	import Es from '$lib/i18n/pages/docs-commands/es.svelte';
	import Pt from '$lib/i18n/pages/docs-commands/pt.svelte';
	import It from '$lib/i18n/pages/docs-commands/it.svelte';
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
