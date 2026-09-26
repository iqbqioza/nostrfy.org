<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Non cade mai',
			body: 'Protezione dal sovraccarico, thread di lettura dedicati, isolamento dei panic e limiti rigorosi delle risorse. Un relay conta solo se è in esecuzione.'
		},
		{
			icon: 'layers',
			title: 'Completamente conforme',
			body: 'Tutti i NIP lato relay implementati e verificati rispetto alle specifiche ufficiali — inclusi ricerca, gruppi, media e API di gestione.'
		},
		{
			icon: 'box',
			title: 'Un unico binario',
			body: 'Un unico binario Rust statico fa tutto: relay, API REST, file server Blossom, gestione NIP-86, demone, rotazione dei log e statistiche.'
		},
		{
			icon: 'cpu',
			title: 'Leggero per natura',
			body: 'Funziona comodamente su un VPS da 0,25 vCPU / 512 MB. La mappa LMDB è una prenotazione virtuale sparsa; la memoria resta stabile mentre il database cresce.'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'Informazioni su nostrfy',
		url: `${base}/it/about/`,
		description:
			'nostrfy è un motore di server relay Nostr open source scritto in Rust, con doppia licenza MIT o Apache-2.0. Scopri il progetto e i suoi principi di progettazione.',
		inLanguage: 'it',
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
	title="Informazioni sul progetto nostrfy"
	description="nostrfy è un motore di server relay Nostr open source scritto in Rust, con doppia licenza MIT o Apache-2.0. Scopri il progetto e i suoi principi di progettazione."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Informazioni su nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">Motore di server relay Nostr tutto-in-uno</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> è un server relay per il protocollo
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				, scritto in Rust. Memorizza gli eventi inviati dai client (Amethyst, Damus, Iris e altri) e li distribuisce in risposta alle sottoscrizioni — con una frazione delle risorse di un relay tipico.
			</p>
			<p>
				Il progetto è nato come esperimento: e se un relay potesse <strong class="text-zinc-200">essere definito da un unico file di configurazione</strong>, sul server più piccolo che puoi noleggiare, implementando comunque ogni NIP lato relay — più file server, API REST e interfaccia di gestione? nostrfy è la risposta, ed è gratuito: con licenza MIT o Apache-2.0.
			</p>
			<p>
				nostrfy gestisce il relay ufficiale del progetto, e lo stesso binario è stato verificato su Linux (x86_64 e aarch64) e FreeBSD — da un VPS da 512 MB a un singolo host che serve centinaia di migliaia di connessioni.
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
				<Icon name="github" size={16} /> Vedi il codice sorgente su GitHub
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
