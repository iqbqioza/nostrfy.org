<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Never goes down',
			body: 'Overload protection, dedicated reader threads, panic containment and strict resource bounds. A relay only matters if it is up.'
		},
		{
			icon: 'layers',
			title: 'Spec-complete',
			body: 'Every relay-side NIP implemented and verified against the official specifications — including search, groups, media and a management API.'
		},
		{
			icon: 'box',
			title: 'One binary',
			body: 'A single static Rust binary does everything: relay, REST API, Blossom file server, NIP-86 management, daemon, log rotation and statistics.'
		},
		{
			icon: 'cpu',
			title: 'Lean by nature',
			body: 'A 0.25 vCPU / 512 MB VPS runs it comfortably. The LMDB map is a sparse virtual reservation; memory stays flat as the database grows.'
		}
	];
</script>

<PageMeta
	title="About"
	description="nostrfy is an open-source, MIT-licensed Nostr relay server engine written in Rust. Learn about the project and its design principles."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">About nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">An all-in-one Nostr relay server engine</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> is a relay server for the
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				protocol, written in Rust. It stores events sent by clients (Amethyst, Damus, Iris and
				others) and delivers them in response to subscriptions — at a fraction of the resources a
				typical relay needs.
			</p>
			<p>
				The project started as an experiment: what if a relay could be
				<strong class="text-zinc-200">specified by a single config file</strong>, run on the smallest
				server you can rent, and still implement every relay-side NIP — plus a file server, a REST
				API and a management interface? nostrfy is the result, and it is free: released under the
				MIT license.
			</p>
			<p>
				nostrfy runs the official relay of the project, and the same binary has been verified on
				Linux (x86_64 and aarch64) and FreeBSD, from a 512 MB VPS to single hosts serving hundreds
				of thousands of connections.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			{#each principles as p (p.title)}
				<div class="rounded-xl border border-line bg-surface/40 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={p.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{p.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{p.body}</p>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex flex-wrap gap-3">
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Source on GitHub
			</a>
			{#each site.relays as relay (relay.url)}
				<a
					href={relay.url}
					class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-mono text-sm text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
					{relay.url}
				</a>
			{/each}
		</div>
	</div>
</div>