<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';

	const features = [
		{
			icon: 'layers',
			title: 'Spec-complete',
			body: 'All relay-side NIPs implemented and verified against the official specifications — 36+ NIPs plus the Blossom file server.'
		},
		{
			icon: 'shield',
			title: 'Never goes down',
			body: 'Overload protection, dedicated reader threads, panic containment and strict resource bounds keep the relay serving under sustained abuse.'
		},
		{
			icon: 'server',
			title: 'Blossom media server',
			body: 'SHA-256-addressed uploads on their own hostname — local disk or S3-compatible buckets (AWS S3, Cloudflare R2), with owner-signed deletes.'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: 'A read-only /api/v1 for querying events by npub1, nevent1 or naddr1 — its own reader thread means REST traffic can never stall WebSocket subscribers.'
		},
		{
			icon: 'database',
			title: 'LMDB persistence',
			body: 'Durable, crash-safe storage via heed. The memory map is a sparse reservation opened at its ceiling — no runtime resize, tiny physical footprint.'
		},
		{
			icon: 'wrench',
			title: 'Everything configurable',
			body: 'Every setting lives in nostrfy.toml — no compile-time options. Edit, SIGHUP, done. Limits, NIP toggles, storage and more.'
		},
		{
			icon: 'network',
			title: 'Works behind TLS proxies',
			body: 'nginx, Caddy, Cloudflare Tunnel — WebSocket upgrades and X-Forwarded-Proto are honored, so wss:// just works in front of any proxy.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'A single static Rust binary for Linux x86_64, Linux aarch64 and FreeBSD x86_64 — verified to run on a 0.25 vCPU / 512 MB VPS.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'events/sec ingest', note: 'single connection' },
		{ value: '100%', label: 'live fan-out', note: '10,000 / 10,000 deliveries' },
		{ value: '0.32s', label: 'stored query', note: '20,000 events' },
		{ value: '0.26s', label: 'NIP-50 search', note: '10,000 results' },
		{ value: '7.9 MB', label: 'private RSS', note: 'with a 252 MB database' }
	];

	const nips = [
		'1', '9', '11', '13', '17', '22', '26', '28', '29', '32', '33', '34', '40', '42', '43',
		'45', '46', '47', '50', '57', '59', '62', '65', '66', '67', '70', '77', '78', '84', '85',
		'86', '87', '88', '94', '98', 'A3', 'Blossom'
	];

	const softwareJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'nostrfy',
		description:
			'All-in-one Nostr relay server engine written in Rust. Spec-complete, built to never go down, configurable from nostrfy.toml.',
		url: 'https://nostrfy.org/',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Linux, FreeBSD',
		license: ['https://opensource.org/licenses/MIT', 'https://www.apache.org/licenses/LICENSE-2.0'],
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		softwareVersion: '0.1.16',
		installUrl: 'https://nostrfy.org/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'en'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="The Nostr relay that never goes down"
	description="nostrfy is an all-in-one Nostr relay server engine written in Rust. Spec-complete, built to never go down, and configurable entirely from nostrfy.toml."
/>

<!-- ===== Hero ===== -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true"></div>
	<div
		class="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
		<img
			src="/logo.png"
			width={220}
			height={220}
			alt=""
			class="mx-auto rounded-[2.5rem]"
		/>
		<div
			class="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs text-zinc-400"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true"></span>
			<span>
				Rust · MIT or Apache-2.0 · latest release
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			The Nostr relay that
			<span class="text-accent-gradient">never goes down.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> is an all-in-one Nostr relay server engine.
			Blazing fast by design. Lean by nature. Powerful by default. Install in one line, configure
			from a single TOML file, and run it on virtually any VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				Install nostrfy
			</a>
			<a
				href="/docs/quick-start/"
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Quick start
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				View source
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> 36+ relay-side NIPs
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · containers
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> One binary, no dependencies
			</span>
		</div>
	</div>
</section>

<!-- ===== Live relays ===== -->
<section class="relative border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
		<div class="mx-auto flex max-w-6xl justify-center">
			{#each site.relays as relay (relay.url)}
				<div class="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-line bg-bg/60 p-5">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"></span>
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Live relay</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Copy relay URL" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Install in one line</h2>
			<p class="mt-3 text-zinc-400">
				The install script detects your OS and architecture, downloads the matching pre-built
				binary, verifies its sha256 checksum and puts it on your <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>. No
				clone, no build, no sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'Works without sudo', 'Installs into ~/.local/bin, ~/bin or ~/.cargo/bin — the first one already on PATH.'],
				['cpu', 'Linux + FreeBSD', 'Pre-built binaries for x86_64 and aarch64 Linux, plus FreeBSD x86_64.'],
				['wrench', 'Checksum-verified', 'The release checksum is fetched and verified before the binary touches disk.']
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

		<div class="mt-8 grid gap-3 md:grid-cols-2">
			{#each installVariants as variant (variant.title)}
				<div class="min-w-0">
					<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{variant.title}</div>
					<CodeBlock code={variant.command} lang="bash" />
				</div>
			{/each}
		</div>

		<div class="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface/50 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg">
					<Icon name="database" size={17} class="text-accent-400" />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-zinc-100">Migrating from strfry?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Bring your existing events over with one command — offline, verified and safe to re-run.
					</p>
				</div>
			</div>
			<a
				href="/docs/migrating-from-strfry/"
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Migration guide <Icon name="arrow-right" size={15} />
			</a>
		</div>
	</div>
</section>

<!-- ===== Quick start ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
					Up and running in under a minute
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy ships a daemon, a config validator, live statistics, log rotation and hot
					reloading — everything a relay operator needs, in one binary.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init writes a default, fully-commented nostrfy.toml',
						'nostrfy check validates the config before you start',
						'SIGHUP reloads most settings without a restart',
						'nostrfy upgrade updates the binary to the latest release'
					] as line (line)}
						<li class="flex gap-3 text-sm text-zinc-300">
							<Icon name="check" size={16} class="mt-0.5 shrink-0 text-accent-400" />
							{line}
						</li>
					{/each}
				</ul>
				<a
					href="/docs/quick-start/"
					class="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
				>
					Open the quick start guide
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# writes a default nostrfy.toml and exits'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# runs the relay as a daemon'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# live connections, events, database size'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Point any Nostr client at ws://<host>:8080 — done."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Built for real-world relays</h2>
			<p class="mt-3 text-zinc-400">
				Every feature is designed around two goals: never go down, and be spec-complete. The
				result is a relay that survives abuse, stalled disks and memory-constrained hosts.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div class="group rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:border-line-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg transition-colors group-hover:border-accent-500/40">
						<Icon name={feature.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{feature.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Performance ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Measured performance</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Release build, fresh database, 8-thread laptop. Publish speed is bounded by a single LMDB
			writer thread and batched, fsync-free commits; readers never block it.
		</p>
		<div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each benchmarks as b (b.label)}
				<div class="rounded-xl border border-line bg-bg/60 p-5 text-center">
					<div class="text-2xl font-bold tracking-tight text-accent-300">{b.value}</div>
					<div class="mt-1 text-xs font-medium text-zinc-300">{b.label}</div>
					<div class="mt-0.5 text-[11px] text-zinc-600">{b.note}</div>
				</div>
			{/each}
		</div>
		<p class="mt-6 text-center text-xs text-zinc-600">
			Reproduce with the bundled benchmarks — see the
			<a href="/docs/operation/#throughput" class="text-zinc-400 hover:text-accent-300">performance notes</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Spec-complete NIP support</h2>
				<p class="mt-3 text-zinc-400">
					Every relay-side NIP is implemented and verified. The advertised NIP-11 list is
					dynamic — dropped automatically when a NIP's kinds are blocked.
				</p>
			</div>
			<a
				href="/docs/nips/"
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Full NIP reference <Icon name="arrow-right" size={15} />
			</a>
		</div>

		<div class="mt-8 flex flex-wrap gap-2">
			{#each nips as nip (nip)}
				<span class="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs text-zinc-300">
					{nip}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Clients ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">An ecosystem of great clients</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy speaks the open NIP standards clients rely on — so the best Nostr apps plug in
				and get the full experience. Any NIP-compliant client works with your relay.
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each clients as client (client.name)}
				<a
					href={client.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group rounded-xl border border-line bg-bg/60 p-5 transition-colors hover:border-line-2"
				>
					<div class="flex items-center gap-3">
						{#if client.icon}
							<img
								src={client.icon}
								alt=""
								width={40}
								height={40}
								class="rounded-lg"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-accent-300"
							>
								{client.name.charAt(0)}
							</div>
						{/if}
						<div class="min-w-0">
							<div class="flex items-center gap-1.5 text-sm font-semibold text-zinc-100 group-hover:text-white">
								{client.name}
								<Icon name="arrow-up-right" size={13} class="text-zinc-500 group-hover:text-accent-300" />
							</div>
							<div class="truncate text-xs text-zinc-500">{client.tagline}</div>
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">{client.quote}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each client.features as feature (feature)}
							<span
								class="rounded-md border border-line bg-surface/50 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
								{feature}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>

		<p class="mt-6 text-center text-xs text-zinc-600">
			Building on Nostr? Point any client at your relay — see the
			<a href="/docs/nips/" class="text-zinc-400 hover:text-accent-300">full NIP reference</a>.
		</p>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="relative overflow-hidden">
	<div
		class="absolute inset-x-0 bottom-0 h-72 bg-accent-500/10 blur-[100px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6">
		<h2 class="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight">
			Run your own relay in minutes
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			From a tiny VPS to a global fleet — the pre-built binary, the config validator and the
			deployment guides make it painless.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Install now
			</a>
			<a
				href="/docs/deploy/"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Deployment guides <Icon name="arrow-right" size={16} />
			</a>
			<a href="/donate/" class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Support development
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			Questions? Read the <a href="/faq/" class="text-zinc-300 hover:text-accent-300">FAQ</a> or see how
			nostrfy <a href="/compare/strfry/" class="text-zinc-300 hover:text-accent-300">compares with strfry</a> —
			and <a href="/docs/migrating-from-strfry/" class="text-zinc-300 hover:text-accent-300">migrate in one command</a>.
		</p>
	</div>
</section>