<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Linguaggio', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'Licenza', nostrfy: 'MIT o Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Archiviazione', nostrfy: 'LMDB (nessun database esterno)', strfry: 'LMDB (nessun database esterno)' },
		{ label: 'Configurazione', nostrfy: 'Un unico nostrfy.toml, ricaricamento a caldo (SIGHUP)', strfry: 'strfry.conf, ricaricamento a caldo' },
		{ label: 'NIP annunciati', nostrfy: '34 (36 implementati, incl. opzionali)', strfry: '11 NIP principali' },
		{ label: 'Gruppi NIP-29 + LiveKit', nostrfy: 'Integrato', strfry: '—' },
		{ label: 'Server multimediale Blossom', nostrfy: 'Integrato (disco locale o S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: '/api/v1 integrato', strfry: '—' },
		{ label: 'API di gestione', nostrfy: 'NIP-86 JSON-RPC con amministratori delegati', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Sì', strfry: 'Sì — strfry lo ha creato' },
		{ label: 'Politiche di scrittura / plugin', nostrfy: 'Liste allow/deny integrate + NIP-86', strfry: 'Interfaccia di plugin write-policy' },
		{ label: 'Strumento di migrazione', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/it/compare/strfry/`,
		description:
			'Un confronto onesto tra nostrfy e strfry per relay Nostr autogestiti — funzionalità, licenze, gestione e come migrare da strfry con un solo comando.',
		inLanguage: 'it',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry: confronto tra relay Nostr"
	description="Un confronto onesto tra nostrfy e strfry per relay Nostr autogestiti — funzionalità, licenze, gestione e come migrare da strfry con un solo comando."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Confronto</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Entrambi sono relay Nostr in un unico binario, memorizzano gli eventi in LMDB e parlano lo stesso protocollo. Ma fanno scelte diverse:
			<strong class="text-zinc-200">strfry</strong> è il maturo relay C++ con sistema di plugin write-policy, mentre
			<strong class="text-zinc-200">nostrfy</strong> è un motore scritto in Rust che raccoglie le funzioni necessarie all’operatore — gruppi, media, REST, gestione — in un unico binario e un unico file di configurazione.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">A colpo d’occhio</h2>
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Licenza</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry è sotto <strong class="text-zinc-200">GPL-3.0</strong>, che impone che le opere derivate siano pubblicate con gli stessi termini. nostrfy ha la doppia licenza <strong class="text-zinc-200">MIT o Apache-2.0</strong>, quindi può essere incorporato in prodotti closed-source e relicenziato liberamente. Se il tuo relay fa parte di uno stack commerciale o con licenza, spesso è la differenza decisiva.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Configurazione e gestione</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy si configura tramite un unico <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					> : identità, limiti, archiviazione, controllo degli accessi, Blossom e RPC in un unico posto. La maggior parte delle impostazioni si ricarica a caldo con SIGHUP.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
				Ogni opzione è convalidata da <code
					class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
				> prima dell’avvio del relay — tipi errati, limiti impossibili e combinazioni che bloccano l’accesso vengono segnalati con correzioni.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Il demone include rotazione dei log, statistiche in tempo reale, endpoint per il controllo dello stato e metriche Prometheus; la CLI gestisce liste di accesso, aggiornamenti e migrazioni.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Funzionalità integrate</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Invece di aggiungere servizi esterni, nostrfy include ciò che un relay pubblico di solito richiede:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'Gruppi NIP-29 + LiveKit', 'Gruppi imposti dal relay, eventi di moderazione e metadati di gruppo firmati dal relay, più stanze audio/video via LiveKit.'],
				['database', 'Server multimediale Blossom', 'Gli upload indirizzati per contenuto usano un hostname dedicato, su disco locale o in un bucket compatibile S3 (AWS S3, Cloudflare R2).'],
				['server', 'REST API', 'Un’API /api/v1 in sola lettura su un thread di lettura dedicato: interroga gli eventi per npub, nevent o naddr, con conteggi, statistiche e ricerca.'],
				['lock', 'Gestione NIP-86', 'API di gestione JSON-RPC con autenticazione Bearer o NIP-98, concessioni di metodi delegate e codici di invito.']
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Dove strfry eccelle</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry resta un’ottima scelta: ha creato il protocollo negentropy, supporta riavvii senza downtime e compressione WebSocket opzionale, e la sua interfaccia di plugin write-policy consente di eseguire logica arbitraria a ogni pubblicazione. Se ti serve una sandbox di plugin e nient’altro di questa lista, strfry è perfetto. Se preferisci gruppi, media, REST e gestione integrati — o ti serve una licenza permissiva — nostrfy è la strada più breve.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Migrazione da strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
		Non devi ricominciare da zero. <code
			class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> legge il formato di export di strfry, verifica ogni evento e importa l’intero database — incluse eliminazioni NIP-09, effetti collaterali di moderazione NIP-29 e timestamp di prima apparizione. È offline, supporta il dry-run ed è sicuro da ripetere.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Leggi la guida alla migrazione <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Avvio rapido <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Riferimento completo dei NIP
			</a>
		</div>
	</div>
</div>
