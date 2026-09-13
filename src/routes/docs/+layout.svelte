<script lang="ts">
	import DocsNav from '$lib/components/docs/DocsNav.svelte';
	import DocsPager from '$lib/components/docs/DocsPager.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children?: Snippet;
	} = $props();

	let open = $state(false);
</script>

<div class="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:flex lg:items-start lg:gap-10">
	<aside class="relative hidden lg:sticky lg:top-24 lg:block lg:w-60 lg:shrink-0">
		<div class="max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-2">
			<DocsNav />
		</div>
	</aside>

	<div class="min-w-0 flex-1">
		<div class="mb-6 lg:hidden">
			<button
				type="button"
				class="inline-flex w-full items-center justify-between rounded-xl border border-line bg-surface/50 px-4 py-3 text-sm font-medium text-zinc-200"
				onclick={() => (open = !open)}
				aria-expanded={open}
			>
				<span class="inline-flex items-center gap-2">
					<Icon name="book" size={16} class="text-accent-400" /> Documentation
				</span>
				<Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} class="text-zinc-500" />
			</button>
			{#if open}
				<div class="mt-3 rounded-xl border border-line bg-surface/50 p-4">
					<DocsNav />
				</div>
			{/if}
		</div>

		<div class="mx-auto max-w-3xl">
			{@render children?.()}
			<DocsPager />
		</div>
	</div>
</div>