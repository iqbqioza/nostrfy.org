<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Fällt nie aus',
			body: 'Überlastschutz, dedizierte Reader-Threads, Panic-Isolierung und strikte Ressourcengrenzen. Ein Relay zählt nur, wenn es läuft.'
		},
		{
			icon: 'layers',
			title: 'Vollständig Spec-konform',
			body: 'Alle Relay-seitigen NIPs implementiert und gegen die offiziellen Spezifikationen verifiziert — einschließlich Suche, Gruppen, Medien und Verwaltungs-API.'
		},
		{
			icon: 'box',
			title: 'Ein Binary',
			body: 'Ein einzelnes statisches Rust-Binary erledigt alles: Relay, REST-API, Blossom-Dateiserver, NIP-86-Verwaltung, Daemon, Log-Rotation und Statistik.'
		},
		{
			icon: 'cpu',
			title: 'Von Natur aus schlank',
			body: 'Läuft komfortabel auf einem VPS mit 0,25 vCPU / 512 MB. Die LMDB-Map ist eine dünne virtuelle Reservierung; der Speicher bleibt konstant, während die Datenbank wächst.'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'Über nostrfy',
		url: `${base}/de/about/`,
		description:
			'nostrfy ist eine quelloffene Nostr-Relay-Server-Engine in Rust, dual unter MIT oder Apache-2.0 lizenziert. Erfahren Sie mehr über das Projekt und seine Designprinzipien.',
		inLanguage: 'de',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` },
		mainEntity: {
			'@type': 'SoftwareApplication',
			name: 'nostrfy',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Linux, FreeBSD',
			license: [
				'https://opensource.org/licenses/MIT',
				'https://www.apache.org/licenses/LICENSE-2.0'
			]
		}
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${aboutJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Über das nostrfy-Projekt"
	description="nostrfy ist eine quelloffene Nostr-Relay-Server-Engine in Rust, dual unter MIT oder Apache-2.0 lizenziert. Erfahren Sie mehr über das Projekt und seine Designprinzipien."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Über nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">All-in-One-Nostr-Relay-Server-Engine</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> ist ein Relay-Server für das
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				-Protokoll, geschrieben in Rust. Es speichert Events von Clients (Amethyst, Damus, Iris und anderen) und liefert sie auf Abonnements hin aus — mit einem Bruchteil der Ressourcen eines typischen Relays.
			</p>
			<p>
				Das Projekt begann als Experiment: Was, wenn ein Relay <strong class="text-zinc-200">durch eine einzige Konfigurationsdatei definiert werden könnte</strong>, auf dem kleinsten mietbaren Server liefe und trotzdem jeden Relay-seitigen NIP umsetzte — plus Dateiserver, REST-API und Verwaltungsoberfläche? nostrfy ist die Antwort, und es ist kostenlos: lizenziert unter MIT oder Apache-2.0.
			</p>
			<p>
				nostrfy betreibt das offizielle Relay des Projekts, und dasselbe Binary wurde auf Linux (x86_64 und aarch64) und FreeBSD verifiziert — vom 512-MB-VPS bis zum einzelnen Host mit Hunderttausenden Verbindungen.
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
				<Icon name="github" size={16} /> Quellcode auf GitHub ansehen
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
