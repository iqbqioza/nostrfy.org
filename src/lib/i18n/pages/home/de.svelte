<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'Bestimmte Version',
		'System-wide': 'Systemweit',
		'Overwrite existing': 'Vorhandene überschreiben',
		'Build from source': 'Aus dem Quellcode bauen'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'Open-Source-Nostr-Social-Client',
			quote:
				'Ditto nutzt diese NIPs tatsächlich — NIP-50-Suche, NIP-22-Thread-Kommentare, NIP-57-Zaps, NIP-94-Medien und NIP-85-Statistiken gehören zum Alltag — und jede davon entspricht einer Relay-Funktion von nostrfy.'
		},
		Nostrich: {
			tagline: 'Kostenloser Nostr-Client für Web, iOS, Android und Mac',
			quote:
				'Ein voll ausgestatteter Client, der diese NIPs tatsächlich nutzt — NIP-50-Suche, NIP-17/59-Direktnachrichten, NIP-57-Zaps, NIP-88-Umfragen und Blossom-Medien funktionieren mit Ihrem Relay.'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: 'Vollständig Spec-konform',
			body: 'Alle Relay-seitigen NIPs implementiert und gegen die offiziellen Spezifikationen verifiziert — 36+ NIPs plus der Blossom-Dateiserver.'
		},
		{
			icon: 'shield',
			title: 'Fällt nie aus',
			body: 'Überlastschutz, dedizierte Reader-Threads, Panic-Isolierung und strikte Ressourcengrenzen halten das Relay auch unter Dauerlast am Laufen.'
		},
		{
			icon: 'server',
			title: 'Blossom-Mediaserver',
			body: 'SHA-256-adressierte Uploads auf eigenem Hostnamen — lokale Festplatte oder S3-kompatible Buckets (AWS S3, Cloudflare R2), mit vom Eigentümer signierten Löschvorgängen.'
		},
		{
			icon: 'database',
			title: 'REST-API',
			body: 'Ein schreibgeschütztes /api/v1 für Abfragen per npub1, nevent1 oder naddr1 — durch einen eigenen Reader-Thread kann REST-Verkehr WebSocket-Abonnenten nie blockieren.'
		},
		{
			icon: 'database',
			title: 'LMDB-Persistenz',
			body: 'Langlebiger, absturzsicherer Speicher über heed. Die Speicherzuordnung wird bis zur Obergrenze dünn reserviert — keine Größenänderung zur Laufzeit, winziger physischer Fußabdruck.'
		},
		{
			icon: 'wrench',
			title: 'Alles konfigurierbar',
			body: 'Jede Einstellung liegt in nostrfy.toml — keine Kompilierungsoptionen. Bearbeiten, SIGHUP, fertig. Limits, NIP-Schalter, Speicher und mehr.'
		},
		{
			icon: 'network',
			title: 'Läuft hinter TLS-Proxys',
			body: 'nginx, Caddy, Cloudflare Tunnel — WebSocket-Upgrades und X-Forwarded-Proto werden berücksichtigt, wss:// funktioniert hinter jedem Proxy.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'Ein einzelnes statisches Rust-Binary für Linux x86_64, Linux aarch64 und FreeBSD x86_64 — verifiziert auf einem VPS mit 0,25 vCPU / 512 MB.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'Events/s Aufnahme', note: 'eine Verbindung' },
		{ value: '100%', label: 'Live-Verteilung', note: '10.000 / 10.000 Zustellungen' },
		{ value: '0.32s', label: 'gespeicherte Abfrage', note: '20.000 Events' },
		{ value: '0.26s', label: 'NIP-50-Suche', note: '10.000 Ergebnisse' },
		{ value: '7.9 MB', label: 'privates RSS', note: 'bei 252 MB Datenbank' }
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
			'All-in-One-Nostr-Relay-Server-Engine in Rust. Vollständig Spec-konform, gebaut um nie auszufallen, konfigurierbar über nostrfy.toml.',
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
		installUrl: 'https://nostrfy.org/de/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'de'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Das Nostr-Relay, das nie ausfällt"
	description="nostrfy ist eine All-in-One-Nostr-Relay-Server-Engine in Rust. Vollständig Spec-konform, gebaut um nie auszufallen, konfigurierbar über nostrfy.toml."
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
				Rust · MIT oder Apache-2.0 · neueste Version
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			Das Nostr-Relay, das
			<span class="text-accent-gradient">nie ausfällt.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> ist eine All-in-One-Nostr-Relay-Server-Engine. Blitzschnell per Design, schlank von Natur aus, leistungsstark als Standard. Installation in einer Zeile, Konfiguration über eine einzige TOML-Datei und Betrieb auf praktisch jedem VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				nostrfy installieren
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Schnellstart
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				Quellcode ansehen
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> 36+ Relay-seitige NIPs
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · Container
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> Ein Binary, keine Abhängigkeiten
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
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Aktives Relay</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Relay-URL kopieren" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Installation in einer Zeile</h2>
			<p class="mt-3 text-zinc-400">
				Das Installationsskript erkennt Ihr Betriebssystem und Ihre Architektur, lädt das passende vorgefertigte Binary herunter, verifiziert dessen sha256-Prüfsumme und legt es in <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code> ab. Kein Klonen, kein Bauen, kein sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'ohne sudo', 'Installiert nach ~/.local/bin, ~/bin oder ~/.cargo/bin — das erste davon, das bereits im PATH liegt.'],
				['cpu', 'Linux + FreeBSD', 'Vorgebaute Binaries für x86_64- und aarch64-Linux sowie FreeBSD x86_64.'],
				['wrench', 'Prüfsummenverifiziert', 'Die Release-Prüfsumme wird abgerufen und verifiziert, bevor das Binary die Festplatte berührt.']
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
					<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{installLabels[variant.title] ?? variant.title}</div>
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
					<h3 class="text-sm font-semibold text-zinc-100">Migration von strfry?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Bringen Sie Ihre vorhandenen Events mit einem Befehl mit — offline, verifiziert und gefahrlos wiederholbar.
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Migrationsanleitung <Icon name="arrow-right" size={15} />
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
					In unter einer Minute einsatzbereit
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy liefert einen Daemon, einen Konfigurationsvalidator, Live-Statistiken, Log-Rotation und Hot-Reload — alles, was ein Relay-Betreiber braucht, in einem Binary.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init schreibt eine vollständig kommentierte Standard-nostrfy.toml',
						'nostrfy check validiert die Konfiguration vor dem Start',
						'SIGHUP lädt die meisten Einstellungen ohne Neustart neu',
						'nostrfy upgrade aktualisiert das Binary auf die neueste Version'
					] as line (line)}
						<li class="flex gap-3 text-sm text-zinc-300">
							<Icon name="check" size={16} class="mt-0.5 shrink-0 text-accent-400" />
							{line}
						</li>
					{/each}
				</ul>
				<a
					href={p('/docs/quick-start/')}
					class="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
				>
					Schnellstartanleitung öffnen
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# schreibt eine Standard-nostrfy.toml und beendet sich'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# startet das Relay als Daemon'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# Verbindungen, Events, Datenbankgröße'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Richten Sie Ihren Nostr-Client auf ws://<host>:8080 — fertig."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Für Relays im echten Betrieb</h2>
			<p class="mt-3 text-zinc-400">
				Jede Funktion folgt zwei Zielen: nie auszufallen und vollständig Spec-konform zu sein. Das Ergebnis ist ein Relay, das Angriffe, hängende Festplatten und speicherarme Hosts übersteht.
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
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Gemessene Leistung</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Release-Build, frische Datenbank, Laptop mit 8 Threads. Die Schreibgeschwindigkeit wird von einem einzigen LMDB-Writer-Thread und gebündelten, fsync-freien Commits begrenzt; Reader blockieren ihn nie.
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
			Mit den mitgelieferten Benchmarks reproduzierbar — siehe
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">Leistungshinweise</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Vollständige NIP-Unterstützung nach Spezifikation</h2>
				<p class="mt-3 text-zinc-400">
					Jeder Relay-seitige NIP ist implementiert und verifiziert. Die in NIP-11 veröffentlichte Liste ist dynamisch — ein NIP fällt automatisch heraus, wenn seine Kinds blockiert werden.
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Vollständige NIP-Referenz <Icon name="arrow-right" size={15} />
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
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Ein Ökosystem großartiger Clients</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy spricht die offenen NIP-Standards, auf die sich Clients verlassen — die besten Nostr-Apps werden einfach angeschlossen und erhalten das volle Erlebnis. Jeder NIP-konforme Client funktioniert mit Ihrem Relay.
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each displayClients as client (client.name)}
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
			Entwickeln Sie auf Nostr? Richten Sie jeden Client auf Ihr Relay — siehe
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">Vollständige NIP-Referenz</a>.
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
			Betreiben Sie Ihr eigenes Relay in Minuten
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			Vom winzigen VPS bis zum globalen Verbund — das vorgefertigte Binary, der Konfigurationsvalidator und die Bereitstellungsanleitungen machen es mühelos.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Jetzt installieren
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Bereitstellungsanleitungen <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Entwicklung unterstützen
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			Fragen? <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">FAQ</a> oder <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">den Vergleich von nostrfy mit strfry</a> — und <a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">migrieren Sie mit einem Befehl</a>.
		</p>
	</div>
</section>
