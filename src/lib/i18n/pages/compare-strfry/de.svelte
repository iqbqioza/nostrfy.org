<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Sprache', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'Lizenz', nostrfy: 'MIT oder Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Speicher', nostrfy: 'LMDB (keine externe Datenbank)', strfry: 'LMDB (keine externe Datenbank)' },
		{ label: 'Konfiguration', nostrfy: 'Eine nostrfy.toml, Hot-Reload (SIGHUP)', strfry: 'Eine strfry.conf, Hot-Reload' },
		{ label: 'Beworbene NIPs', nostrfy: '34 (36 implementiert, inkl. Opt-in)', strfry: '11 Kern-NIPs' },
		{ label: 'NIP-29-Gruppen + LiveKit', nostrfy: 'Integriert', strfry: '—' },
		{ label: 'Blossom-Mediaserver', nostrfy: 'Integriert (lokale Festplatte oder S3/R2)', strfry: '—' },
		{ label: 'REST-API', nostrfy: 'Integriertes /api/v1', strfry: '—' },
		{ label: 'Verwaltungs-API', nostrfy: 'NIP-86 JSON-RPC mit delegierten Administratoren', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Ja', strfry: 'Ja — strfry hat es hervorgebracht' },
		{ label: 'Write-Policies / Plugins', nostrfy: 'Integrierte Allow/Deny-Listen + NIP-86', strfry: 'Write-Policy-Plugin-Schnittstelle' },
		{ label: 'Migrationswerkzeug', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/de/compare/strfry/`,
		description:
			'Ein ehrlicher Vergleich von nostrfy und strfry für selbst gehostete Nostr-Relays — Funktionen, Lizenzierung, Betrieb und die Migration von strfry mit einem Befehl.',
		inLanguage: 'de',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry: Nostr-Relay-Vergleich"
	description="Ein ehrlicher Vergleich von nostrfy und strfry für selbst gehostete Nostr-Relays — Funktionen, Lizenzierung, Betrieb und die Migration von strfry mit einem Befehl."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Vergleich</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Beide sind Nostr-Relays, jeweils als einzelnes Binary, speichern Events in LMDB und sprechen dasselbe Protokoll. Sie treffen jedoch unterschiedliche Kompromisse:
			<strong class="text-zinc-200">strfry</strong> ist das ausgereifte C++-Relay mit Write-Policy-Plugin-System, während
			<strong class="text-zinc-200">nostrfy</strong> eine Rust-Engine ist, die die Operator-Funktionen — Gruppen, Medien, REST, Verwaltung — in einem Binary und einer Konfigurationsdatei bündelt.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Auf einen Blick</h2>
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Lizenz</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry steht unter der <strong class="text-zinc-200">GPL-3.0</strong>-Lizenz, die verlangt, dass abgeleitete Werke unter denselben Bedingungen erscheinen. nostrfy steht unter der <strong class="text-zinc-200">MIT- oder Apache-2.0</strong>-Lizenz, sodass es in Closed-Source-Produkte eingebettet und frei neu lizenziert werden kann. Ist Ihr Relay Teil eines kommerziellen oder anderweitig lizenzierten Stacks, ist das oft der entscheidende Unterschied.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Konfiguration und Betrieb</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy wird durch eine einzige, vollständig kommentierte <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code>-Konfiguration gesteuert: Identität, Limits, Speicher, Zugriffskontrolle, Blossom und RPC an einem Ort. Die meisten Einstellungen laden bei SIGHUP neu.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Jede Option wird vor dem Start des Relays von <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> validiert — falsche Typen, unmögliche Limits und Aussperrkombinationen werden mit Korrekturvorschlägen gemeldet.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Der Daemon bringt Log-Rotation, Live-Statistiken, einen Health-Endpunkt und Prometheus-Metriken mit; die CLI verwaltet Zugriffslisten, Upgrades und Migrationen.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Integrierte Funktionen</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Statt Zusatzdienste anzubinden, bringt nostrfy die Dienste mit, die ein öffentliches Relay üblicherweise braucht:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'NIP-29-Gruppen + LiveKit', 'Relay-erzwungene Gruppen, Moderationsereignisse und Relay-signierte Gruppenmetadaten, plus Audio/Video-Räume über LiveKit.'],
				['database', 'Blossom-Mediaserver', 'Inhaltsadressierte Uploads laufen unter eigenem Hostnamen, auf lokaler Festplatte oder in einem S3-kompatiblen Bucket (AWS S3, Cloudflare R2).'],
				['server', 'REST-API', 'Schreibgeschütztes /api/v1 in einem eigenen Reader-Thread: Events per npub, nevent oder naddr abfragen, mit Zählern, Statistiken und Suche.'],
				['lock', 'NIP-86-Verwaltung', 'JSON-RPC-Verwaltungs-API mit Bearer- oder NIP-98-Authentifizierung, delegierten Method-Grants und Einladungscodes.']
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Wo strfry glänzt</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry bleibt eine hervorragende Wahl: Es hat das Negentropy-Protokoll hervorgebracht, unterstützt Neustarts ohne Ausfallzeit und optionale WebSocket-Kompression, und seine Write-Policy-Plugin-Schnittstelle erlaubt beliebige Logik bei jeder Veröffentlichung. Wenn Sie eine Plugin-Sandbox und sonst nichts aus dieser Liste brauchen, ist strfry ideal. Wenn Sie Gruppen, Medien, REST und Verwaltung ab Werk bevorzugen — oder eine permissive Lizenz benötigen — ist nostrfy der kürzere Weg.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Migration von strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Sie müssen nicht bei null anfangen. <code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> liest strfrys eigenes Exportformat, verifiziert jedes Event und importiert die gesamte Datenbank — einschließlich NIP-09-Löschungen, NIP-29-Moderationsnebenwirkungen und First-Seen-Zeitstempeln. Es ist offline, dry-run-fähig und sicher wiederholbar.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Migrationsanleitung lesen <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Schnellstart <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Vollständige NIP-Referenz
			</a>
		</div>
	</div>
</div>
