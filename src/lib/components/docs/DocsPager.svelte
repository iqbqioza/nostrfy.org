<script lang="ts">
	import Icon from '../Icon.svelte';
	import { flattenDocsNav } from '$lib/data/docs-nav';
	import { page } from '$app/stores';

	const flat = flattenDocsNav();
	const current = $derived(
		$page.url.pathname.endsWith('/') ? $page.url.pathname : $page.url.pathname + '/'
	);
	const idx = $derived(flat.findIndex((i) => i.href === current));
	const prev = $derived(idx > 0 ? flat[idx - 1] : null);
	const next = $derived(idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null);
</script>

{#if prev || next}
	<nav class="mt-12 grid gap-3 border-t border-line/70 pt-6 sm:grid-cols-2" aria-label="Pagination">
		{#if prev}
			<a
				href={prev.href}
				class="group rounded-xl border border-line bg-surface/40 p-4 transition-colors hover:border-line-2"
			>
				<span class="flex items-center gap-1 text-xs text-zinc-500">
					<Icon name="arrow-left" size={12} /> Previous
				</span>
				<span class="mt-1.5 block text-sm font-medium text-zinc-200 group-hover:text-white">
					{prev.title}
				</span>
			</a>
		{/if}
		{#if next}
			<a
				href={next.href}
				class="group rounded-xl border border-line bg-surface/40 p-4 text-right transition-colors hover:border-line-2 sm:col-start-2"
			>
				<span class="flex items-center justify-end gap-1 text-xs text-zinc-500">
					Next <Icon name="arrow-right" size={12} />
				</span>
				<span class="mt-1.5 block text-sm font-medium text-zinc-200 group-hover:text-white">
					{next.title}
				</span>
			</a>
		{/if}
	</nav>
{/if}