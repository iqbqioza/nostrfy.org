<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const faqs = [
		{
			q: 'Was ist nostrfy?',
			a: 'nostrfy ist eine All-in-One-Nostr-Relay-Server-Engine in Rust. Sie speichert Events von Nostr-Clients und liefert sie auf Abonnements hin aus — mit allen Relay-seitigen NIPs plus optionalem Blossom-Mediaserver, schreibgeschützter REST-API und NIP-86-Verwaltungs-API, alles in einem Binary.'
		},
		{
			q: 'Ist nostrfy kostenlos und quelloffen?',
			a: 'Ja. nostrfy ist freie Software, dual lizenziert unter MIT oder Apache-2.0, nach Ihrer Wahl. Der Quellcode liegt auf GitHub, ohne Bezahlstufen, Telemetrie oder Lock-in.'
		},
		{
			q: 'Was brauche ich, um nostrfy zu betreiben?',
			a: 'Ein einzelnes statisches Binary läuft auf Linux (x86_64 und aarch64) und FreeBSD (x86_64). Es wurde auf einem VPS mit 0,25 vCPU / 512 MB verifiziert. Der Speicher ist eine lokale LMDB-Datenbank — ein externer Datenbankserver ist nicht nötig.'
		},
		{
			q: 'Wie installiere ich nostrfy?',
			a: 'Eine Zeile: curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. Das Skript erkennt Ihr Betriebssystem und Ihre Architektur, lädt das passende vorgebaute Binary, verifiziert dessen Prüfsumme und legt es in den PATH. Alternativ können Sie mit Cargo aus dem Quellcode bauen oder eine fertige Konfigurationsvorlage kopieren.'
		},
		{
			q: 'Wie wird nostrfy konfiguriert?',
			a: 'Alles liegt in einer vollständig kommentierten nostrfy.toml — Relay-Identität, Limits, Speicher, Zugriffskontrolle, Blossom und RPC. nostrfy check validiert sie vor dem Start, und die meisten Einstellungen werden bei SIGHUP ohne Neustart neu geladen.'
		},
		{
			q: 'Welche NIPs unterstützt nostrfy?',
			a: 'nostrfy implementiert 36 NIPs, darunter NIP-01, NIP-09-Löschung, NIP-29-Gruppen, NIP-42-Authentifizierung, NIP-50-Suche, NIP-57-Zaps, NIP-59-Gift-Wrap, NIP-65-Relay-Listen, NIP-77-Negentropy, NIP-86-Verwaltung und NIP-98-HTTP-Authentifizierung. Die supported_nips-Liste in NIP-11 ist dynamisch: Ein NIP verschwindet, wenn die benötigten Kinds blockiert oder deaktiviert werden.'
		},
		{
			q: 'Hostet nostrfy Mediendateien?',
			a: 'Ja. Der eingebaute Blossom-Dateiserver hostet inhaltsadressierte Uploads unter eigenem Hostnamen — auf lokaler Festplatte oder in einem S3-kompatiblen Bucket wie AWS S3 oder Cloudflare R2. Uploads werden mit signierten Kind-24242-Events autorisiert und können auf eine Allowlist beschränkt werden.'
		},
		{
			q: 'Kann ich von strfry migrieren?',
			a: 'Ja. nostrfy migrate-strfry importiert eine strfry-Datenbank oder einen JSONL-Export direkt, wendet Replaceable-/Addressable-Semantik, NIP-09-Löschungen und NIP-29-Moderationsnebenwirkungen an und kann passende strfry-Einstellungen in nostrfy.toml übernehmen. Die Migration ist offline, dry-run-fähig und sicher wiederholbar.'
		},
		{
			q: 'Läuft nostrfy hinter einem Reverse-Proxy oder Cloudflare?',
			a: 'Ja. Konfigurieren Sie server.trusted_proxies mit den Proxy-Adressen (Loopback für nginx oder Caddy auf demselben Host, der Bereich des Load Balancers in der Cloud), damit IP-Limits, blockip und Logs die echte Client-Adresse sehen. TLS wird vom Proxy oder Tunnel beendet; nostrfy dahinter bietet normales HTTP und WebSocket.'
		},
		{
			q: 'Hat nostrfy eine REST-API?',
			a: 'Ja — ein schreibgeschütztes /api/v1 auf demselben Port wie das WebSocket-Relay, in einem eigenen Reader-Thread, sodass REST-Verkehr Abonnenten nie blockiert. Es fragt Events per npub, nevent oder naddr ab und bietet Zähler, Autorenstatistiken, Tages-/Monatsaufschlüsselungen und Volltextsuche.'
		},
		{
			q: 'Wie bleibt nostrfy unter Last oder Missbrauch online?',
			a: 'Überlastschutz, dedizierte Reader-Threads, Panic-Isolierung und strikte Ressourcengrenzen. Begrenzte Warteschlangen schlagen schnell fehl, statt den Speicher zu erschöpfen; Verbindungslimits pro IP stoppen Socket-Floods, und eine hängende Festplatte blockiert das Lesen nicht. Subsysteme sind isoliert, das Relay läuft weiter.'
		},
		{
			q: 'Wie verwalte ich Nutzer, Bans und Rollen?',
			a: 'Über die NIP-86-JSON-RPC-Verwaltungs-API mit Bearer-Token oder NIP-98-Admin-Schlüssel: Pubkeys bannen, IPs blockieren, Kind-Allowlists, Rollen und Einladungscodes verwalten. Method-Grants erlauben die Delegation der Moderation an andere Pubkeys, ohne vollständige Admin-Rechte.'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'de',
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
	title="Häufige Fragen"
	description="Antworten zu nostrfy: Installation, Konfiguration, NIP-Unterstützung, Blossom-Medien, Migration von strfry, Reverse-Proxys, Lizenz und Verwaltung."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Häufige Fragen</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Kurze Antworten zum Betrieb von nostrfy. Alles unten ist in die
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">Dokumentation</a> verlinkt — und wenn Sie möchten, können Sie es
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">mit strfry vergleichen</a>.
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
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				nostrfy installieren <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Quellcode ansehen
			</a>
		</div>
	</div>
</div>
