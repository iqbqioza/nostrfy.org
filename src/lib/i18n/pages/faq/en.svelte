<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const faqs = [
		{
			q: 'What is nostrfy?',
			a: 'nostrfy is an all-in-one Nostr relay server engine written in Rust. It stores events from Nostr clients and serves them in response to subscriptions, implementing every relay-side NIP plus an optional Blossom file server, a read-only REST API and a NIP-86 management API — all in one binary.'
		},
		{
			q: 'Is nostrfy free and open source?',
			a: 'Yes. nostrfy is free software, dual-licensed under MIT or Apache-2.0, at your option. The source code is on GitHub and there are no paid tiers, telemetry or lock-in.'
		},
		{
			q: 'What do I need to run nostrfy?',
			a: 'A single static binary runs on Linux (x86_64 and aarch64) and FreeBSD (x86_64). It has been verified on a 0.25 vCPU / 512 MB VPS. Storage is a local LMDB database — no external database server is required.'
		},
		{
			q: 'How do I install nostrfy?',
			a: 'One line: curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. The script detects your OS and architecture, downloads the matching pre-built binary, verifies its checksum and puts it on your PATH. You can also build from source with Cargo or copy a ready-made config template.'
		},
		{
			q: 'How is nostrfy configured?',
			a: 'Everything lives in one fully-commented nostrfy.toml file — relay identity, limits, storage, access control, Blossom and RPC. nostrfy check validates it before the relay starts, and most settings reload at runtime on SIGHUP without a restart.'
		},
		{
			q: 'Which NIPs does nostrfy support?',
			a: 'nostrfy implements 36 NIPs, including NIP-01, NIP-09 deletion, NIP-29 groups, NIP-42 auth, NIP-50 search, NIP-57 zaps, NIP-59 gift wrap, NIP-65 relay lists, NIP-77 negentropy, NIP-86 management and NIP-98 HTTP auth. The NIP-11 supported_nips list is dynamic: a NIP disappears when the kinds it needs are blocked or disabled.'
		},
		{
			q: 'Does nostrfy host media files?',
			a: 'Yes. The built-in Blossom file server hosts content-addressed uploads on its own hostname, either on local disk or in an S3-compatible bucket such as AWS S3 or Cloudflare R2. Uploads are authorized with signed kind 24242 events and can be restricted to an allowlist.'
		},
		{
			q: 'Can I migrate from strfry?',
			a: 'Yes. nostrfy migrate-strfry imports a strfry database or JSONL export directly, applying replaceable/addressable semantics, NIP-09 deletions and NIP-29 moderation side effects, and optionally merging equivalent strfry settings into nostrfy.toml. The migration is offline, dry-runnable and safe to re-run.'
		},
		{
			q: 'Can nostrfy run behind a reverse proxy or Cloudflare?',
			a: 'Yes. Configure server.trusted_proxies with your proxy addresses (loopback for nginx or Caddy on the same host, the balancer range in the cloud) so per-IP limits, blockip and the logs see the real client address. TLS is terminated by your proxy or tunnel; nostrfy serves plain HTTP and WebSocket behind it.'
		},
		{
			q: 'Does nostrfy have a REST API?',
			a: 'Yes — a read-only /api/v1 served on the same port as the WebSocket relay, running on its own reader thread so REST traffic can never stall subscribers. It can query events by npub, nevent or naddr and provides counts, author statistics, per-day/monthly breakdowns and full-text search.'
		},
		{
			q: 'How does nostrfy stay up under load or abuse?',
			a: 'Overload protection, dedicated reader threads, panic containment and strict resource bounds. Bounded queues fail fast instead of exhausting memory, per-IP connection caps stop socket floods, and a stalled disk cannot block reads. The relay keeps serving while subsystems are isolated.'
		},
		{
			q: 'How do I manage users, bans and roles?',
			a: 'Through the NIP-86 JSON-RPC management API with a Bearer token or NIP-98 admin key: ban pubkeys, block IPs, manage kind allowlists, roles and invite codes. Method grants let you delegate moderation to other pubkeys without giving them full admin access.'
		}
	];

	const base = 'https://nostrfy.org';
	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Frequently asked questions"
	description="Answers about nostrfy: installation, configuration, NIP support, Blossom media, migrating from strfry, reverse proxies, licensing and management."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Frequently asked questions</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Short answers about running nostrfy. Everything below links into the
			<a href="/docs/" class="text-accent-300 hover:text-accent-200">documentation</a> — and if you
			prefer, you can <a href="/compare/strfry/" class="text-accent-300 hover:text-accent-200">compare it with strfry</a>.
		</p>

		<div class="mt-10 space-y-3">
			{#each faqs as faq (faq.q)}
				<details class="group rounded-xl border border-line bg-surface/50 p-5">
					<summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-zinc-100">
						{faq.q}
						<Icon
							name="chevron-down"
							size={16}
							class="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
						/>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
				</details>
			{/each}
		</div>

		<div class="mt-12 flex flex-wrap items-center gap-3">
			<a
				href="/docs/quick-start/"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Install nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> View source
			</a>
		</div>
	</div>
</div>
