<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { docsNav } from '$lib/data/docs-nav';
	import { site } from '$lib/data/site';

	const icons: Record<string, string> = {
		'Getting started': 'rocket',
		Operations: 'wrench',
		Features: 'layers',
		Deployment: 'server',
		Help: 'activity'
	};
</script>

<PageMeta
	title="nostrfy documentation and manual"
	description="The complete nostrfy manual: installation, configuration, NIP support, REST API, deployment guides and troubleshooting for the all-in-one Nostr relay engine."
/>

<div class="mx-auto max-w-3xl pb-20 pt-12">
	<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Documentation</h1>
	<p class="mt-3 max-w-2xl text-base text-zinc-400">
		Everything you need to install, configure, run and scale a nostrfy relay — with the full
		feature reference and a troubleshooting guide maintained against the relay's actual behavior.
	</p>

	<div class="mt-12">
		<div class="flex flex-wrap gap-2">
			{#each docsNav as group (group.label)}
				<a
					href={group.items[0].href}
					class="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/50 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
				>
					<Icon name={icons[group.label]} size={13} class="text-accent-400" />
					{group.label}
				</a>
			{/each}
		</div>
	</div>

	<div class="mt-8 space-y-8">
		{#each docsNav as group (group.label)}
			<section>
				<h2 class="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-100">
					<Icon name={icons[group.label]} size={18} class="text-accent-400" />
					{group.label}
				</h2>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each group.items as item (item.href)}
						<a
							href={item.href}
							class="group rounded-xl border border-line bg-surface/40 p-5 transition-colors hover:border-line-2 hover:bg-surface/70"
						>
							<span class="flex items-center justify-between">
								<span class="text-sm font-semibold text-zinc-100 group-hover:text-white">
									{item.title}
								</span>
								<Icon name="arrow-right" size={15} class="shrink-0 text-zinc-600 group-hover:text-accent-400" />
							</span>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<div class="mt-12 rounded-xl border border-line bg-surface/40 p-5 text-sm text-zinc-400">
		Need help? Open an issue on
		<a href={site.github} target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">
			GitHub</a
		>
		with the reproduction steps and the log — the docs are maintained against the actual relay
		behavior, and fixes are welcome.
	</div>
</div>