<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Language', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'License', nostrfy: 'MIT or Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Storage', nostrfy: 'LMDB (no external database)', strfry: 'LMDB (no external database)' },
		{ label: 'Configuration', nostrfy: 'One nostrfy.toml, hot reload (SIGHUP)', strfry: 'strfry.conf, hot reload' },
		{ label: 'Advertised NIPs', nostrfy: '34 (36 implemented, incl. opt-in)', strfry: '11 core NIPs' },
		{ label: 'NIP-29 groups + LiveKit', nostrfy: 'Built in', strfry: '—' },
		{ label: 'Blossom file server', nostrfy: 'Built in (local disk or S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: 'Built in at /api/v1', strfry: '—' },
		{ label: 'Management API', nostrfy: 'NIP-86 JSON-RPC, delegated admins', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Yes', strfry: 'Yes — strfry originated it' },
		{ label: 'Write policies / plugins', nostrfy: 'Built-in allow/deny lists + NIP-86', strfry: 'Write-policy plugin interface' },
		{ label: 'Migration tooling', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/compare/strfry/`,
		description:
			'An honest comparison of nostrfy and strfry for self-hosted Nostr relays — features, licensing, operations, and how to migrate from strfry in one command.',
		inLanguage: 'en',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry: Nostr relay comparison"
	description="An honest comparison of nostrfy and strfry for self-hosted Nostr relays — features, licensing, operations, and how to migrate from strfry in one command."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Comparison</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Both are single-binary Nostr relays that store events in LMDB and speak the same protocol.
			They make different trade-offs: <strong class="text-zinc-200">strfry</strong> is the mature C++
			relay with a write-policy plugin system, while
			<strong class="text-zinc-200">nostrfy</strong> is a Rust engine that ships the operator
			features — groups, media, REST, management — in one binary and one config file.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">At a glance</h2>
		<div class="mt-5 overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>nostrfy</th>
						<th>strfry</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.label)}
						<tr>
							<td class="text-zinc-500">{row.label}</td>
							<td class="text-zinc-200">{row.nostrfy}</td>
							<td class="text-zinc-400">{row.strfry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Licensing</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry is licensed under <strong class="text-zinc-200">GPL-3.0</strong>, which requires
			derivative works to be released under the same terms. nostrfy is dual-licensed under
			<strong class="text-zinc-200">MIT or Apache-2.0</strong>, so it can be embedded in
			closed-source products and relicensed freely. If your relay is part of a commercial or
			otherwise licensed stack, this is often the deciding difference.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Configuration and operations</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy is configured by a single, fully-commented <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					>: identity, limits, storage, access control, Blossom and RPC in one place. Most settings
					hot reload on SIGHUP.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Every option is validated by <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> before the relay starts — wrong types, impossible limits and lockout combinations are
					reported with fixes.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					The daemon ships with log rotation, live statistics, a health endpoint and Prometheus
					metrics; the CLI manages access lists, upgrades and migrations.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Built-in features</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Instead of bolting on sidecars, nostrfy includes the services a public relay usually needs:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'NIP-29 groups + LiveKit', 'Relay-enforced groups, moderation events and relay-signed group metadata, plus audio/video rooms via LiveKit.'],
				['database', 'Blossom file server', 'Content-addressed uploads on their own hostname, backed by local disk or an S3-compatible bucket (AWS S3, Cloudflare R2).'],
				['server', 'REST API', 'A read-only /api/v1 on its own reader thread — query events by npub, nevent or naddr, with counts, stats and search.'],
				['lock', 'NIP-86 management', 'A JSON-RPC management API with Bearer or NIP-98 auth, delegated method grants and invite codes.']
			] as [icon, title, body] (title)}
				<div class="rounded-xl border border-line bg-surface/50 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
				</div>
			{/each}
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Where strfry shines</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry remains an excellent choice: it originated the negentropy protocol, supports zero-downtime
			restarts and optional WebSocket compression, and its write-policy plugin interface lets you run
			arbitrary logic on every publish. If you need a plugin sandbox and nothing else on this list,
			strfry is a great fit. If you would rather have groups, media, REST and management in the box —
			or need a permissive license — nostrfy is the shorter path.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Migrating from strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			You do not have to start over. <code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> reads strfry's own export format, verifies every event, and imports the whole database —
			including NIP-09 deletions, NIP-29 moderation side effects and first-seen timestamps. It is
			offline, dry-runnable and safe to repeat.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href="/docs/migrating-from-strfry/"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Read the migration guide <Icon name="arrow-right" size={16} />
			</a>
			<a
				href="/docs/quick-start/"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Quick start <Icon name="arrow-right" size={16} />
			</a>
			<a
				href="/docs/nips/"
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Full NIP reference
			</a>
		</div>
	</div>
</div>
