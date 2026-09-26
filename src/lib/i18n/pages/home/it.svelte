<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'Versione specifica',
		'System-wide': 'Installa per tutto il sistema',
		'Overwrite existing': 'Sovrascrivi l’esistente',
		'Build from source': 'Compila dai sorgenti'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'Client social Nostr open source',
			quote:
				'Ditto usa davvero questi NIP — ricerca NIP-50, commenti in thread NIP-22, zap NIP-57, media NIP-94 e statistiche NIP-85 fanno parte del suo quotidiano — e ognuno corrisponde a una funzione del relay nostrfy.'
		},
		Nostrich: {
			tagline: 'Client Nostr gratuito per web, iOS, Android e Mac',
			quote:
				'Un client completo che usa davvero questi NIP — ricerca NIP-50, messaggi privati NIP-17/59, zap NIP-57, sondaggi NIP-88 e media Blossom funzionano con il tuo relay.'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: 'Completamente conforme',
			body: 'Tutti i NIP lato relay implementati e verificati rispetto alle specifiche ufficiali — oltre 36 NIP più il file server Blossom.'
		},
		{
			icon: 'shield',
			title: 'Non cade mai',
			body: 'Protezione dal sovraccarico, thread di lettura dedicati, isolamento dei panic e limiti rigorosi delle risorse mantengono il relay in servizio sotto abusi prolungati.'
		},
		{
			icon: 'server',
			title: 'Server multimediale Blossom',
			body: 'Upload indirizzati tramite SHA-256 su un hostname dedicato — disco locale o bucket compatibili S3 (AWS S3, Cloudflare R2), con cancellazione firmata dal proprietario.'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: 'Un’API /api/v1 in sola lettura per interrogare gli eventi per npub1, nevent1 o naddr1 — il suo thread di lettura dedicato impedisce al traffico REST di bloccare gli abbonati WebSocket.'
		},
		{
			icon: 'database',
			title: 'Persistenza LMDB',
			body: 'Archiviazione durevole e a prova di crash tramite heed. La mappa di memoria è riservata in modo sparso fino al limite — nessun ridimensionamento a runtime e ingombro fisico minimo.'
		},
		{
			icon: 'wrench',
			title: 'Tutto configurabile',
			body: 'Tutte le impostazioni sono in nostrfy.toml — nessuna opzione di compilazione. Modifica, SIGHUP, fatto. Limiti, interruttori NIP, archiviazione e altro.'
		},
		{
			icon: 'network',
			title: 'Funziona dietro proxy TLS',
			body: 'nginx, Caddy, Cloudflare Tunnel — gli upgrade WebSocket e X-Forwarded-Proto sono rispettati, quindi wss:// funziona dietro qualsiasi proxy.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'Un unico binario Rust statico per Linux x86_64, Linux aarch64 e FreeBSD x86_64 — verificato su un VPS da 0,25 vCPU / 512 MB.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'eventi/s in ingresso', note: 'una connessione' },
		{ value: '100%', label: 'Distribuzione live', note: '10.000 / 10.000 consegne' },
		{ value: '0.32s', label: 'query memorizzata', note: '20.000 eventi' },
		{ value: '0.26s', label: 'ricerca NIP-50', note: '10.000 risultati' },
		{ value: '7.9 MB', label: 'RSS privato', note: 'con un database da 252 MB' }
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
			'Motore di server relay Nostr tutto-in-uno scritto in Rust. Completamente conforme alle specifiche, progettato per non cadere mai e configurabile da nostrfy.toml.',
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
		installUrl: 'https://nostrfy.org/it/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'it'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Il relay Nostr che non cade mai"
	description="nostrfy è un motore di server relay Nostr tutto-in-uno scritto in Rust. Completamente conforme alle specifiche, progettato per non cadere mai e configurabile da nostrfy.toml."
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
				Rust · MIT o Apache-2.0 · ultima versione
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			Il relay Nostr che
			<span class="text-accent-gradient">non cade mai.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> è un motore di server relay Nostr tutto-in-uno. Veloce per progettazione, leggero per natura, potente di default. Installazione in una riga, configurazione in un unico file TOML ed esecuzione su praticamente qualsiasi VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				Installa nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Avvio rapido
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				Vedi il codice sorgente
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> oltre 36 NIP lato relay
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · container
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> Un binario, nessuna dipendenza
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
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Relay attivo</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Copia l’URL del relay" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Installazione in una riga</h2>
			<p class="mt-3 text-zinc-400">
				Lo script di installazione rileva il sistema operativo e l’architettura, scarica il binario precompilato corrispondente, ne verifica il checksum sha256 e lo rende disponibile nel <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>. Niente clone, niente compilazione, niente sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'Senza sudo', 'Installa in ~/.local/bin, ~/bin o ~/.cargo/bin — il primo già presente nel PATH.'],
				['cpu', 'Linux + FreeBSD', 'Binari precompilati per Linux x86_64 e aarch64, più FreeBSD x86_64.'],
				['wrench', 'Checksum verificato', 'Il checksum della release viene recuperato e verificato prima che il binario tocchi il disco.']
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
					<h3 class="text-sm font-semibold text-zinc-100">Stai migrando da strfry?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Porta i tuoi eventi esistenti con un solo comando — offline, verificato e sicuro da ripetere.
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Guida alla migrazione <Icon name="arrow-right" size={15} />
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
					Operativo in meno di un minuto
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy include un demone, un validatore di configurazione, statistiche in tempo reale, rotazione dei log e ricaricamento a caldo — tutto ciò che serve a un operatore, in un unico binario.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init scrive un nostrfy.toml predefinito completamente commentato',
						'nostrfy check convalida la configurazione prima dell’avvio',
						'SIGHUP ricarica la maggior parte delle impostazioni senza riavvio',
						'nostrfy upgrade aggiorna il binario all’ultima versione'
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
					Apri la guida di avvio rapido
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# scrive un nostrfy.toml predefinito ed esce'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# avvia il relay come demone'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# connessioni, eventi, dimensione del database'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Punta il tuo client Nostr su ws://<host>:8080 — fatto."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Per relay in produzione</h2>
			<p class="mt-3 text-zinc-400">
				Ogni funzione risponde a due obiettivi: non cadere mai ed essere completamente conforme alle specifiche. Il risultato è un relay che sopravvive ad abusi, dischi bloccati e host con poca memoria.
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
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Prestazioni misurate</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Build release, database nuovo, laptop a 8 thread. La velocità di scrittura è limitata da un unico thread di scrittura LMDB e da commit in batch senza fsync; i lettori non lo bloccano mai.
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
			Riproducibile con i benchmark inclusi — vedi
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">note sulle prestazioni</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Supporto completo dei NIP secondo la specifica</h2>
				<p class="mt-3 text-zinc-400">
					Ogni NIP lato relay è implementato e verificato. La lista pubblicata in NIP-11 è dinamica — un NIP scompare automaticamente quando i suoi kind vengono bloccati.
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Riferimento completo dei NIP <Icon name="arrow-right" size={15} />
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
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Un ecosistema di ottimi client</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy parla gli standard NIP aperti su cui i client fanno affidamento — le migliori app Nostr si collegano e ottengono l’esperienza completa. Qualsiasi client conforme agli NIP funziona con il tuo relay.
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
			Sviluppi su Nostr? Punta qualsiasi client verso il tuo relay — vedi
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">Riferimento completo dei NIP</a>.
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
			Esegui il tuo relay in pochi minuti
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			Dal VPS più piccolo a una flotta globale — il binario precompilato, il validatore di configurazione e le guide di distribuzione rendono tutto indolore.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Installa ora
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Guide di distribuzione <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Sostieni lo sviluppo
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			Domande? Leggi le <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">FAQ</a> oppure <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">il confronto tra nostrfy e strfry</a> — e <a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">migra con un solo comando</a>.
		</p>
	</div>
</section>
