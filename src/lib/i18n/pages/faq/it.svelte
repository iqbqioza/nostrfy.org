<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const faqs = [
		{
			q: 'Cos’è nostrfy?',
			a: 'nostrfy è un motore di server relay Nostr tutto-in-uno scritto in Rust. Memorizza gli eventi dei client Nostr e li distribuisce in risposta alle sottoscrizioni, implementando tutti i NIP lato relay, più un server multimediale Blossom opzionale, un’API REST in sola lettura e un’API di gestione NIP-86 — tutto in un unico binario.'
		},
		{
			q: 'nostrfy è gratuito e open source?',
			a: 'Sì. nostrfy è software libero, con doppia licenza MIT o Apache-2.0, a tua scelta. Il codice sorgente è su GitHub e non ci sono livelli a pagamento, telemetria o lock-in.'
		},
		{
			q: 'Cosa serve per eseguire nostrfy?',
			a: 'Un unico binario statico gira su Linux (x86_64 e aarch64) e FreeBSD (x86_64). È stato verificato su un VPS da 0,25 vCPU / 512 MB. L’archiviazione è un database LMDB locale — nessun server di database esterno è richiesto.'
		},
		{
			q: 'Come installo nostrfy?',
			a: 'Una riga: curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. Lo script rileva il sistema operativo e l’architettura, scarica il binario precompilato corrispondente, ne verifica il checksum e lo colloca nel PATH. Puoi anche compilare dai sorgenti con Cargo o copiare un modello di configurazione pronto.'
		},
		{
			q: 'Come si configura nostrfy?',
			a: 'Tutto risiede in un unico nostrfy.toml completamente commentato — identità del relay, limiti, archiviazione, controllo degli accessi, Blossom e RPC. nostrfy check lo convalida prima dell’avvio e la maggior parte delle impostazioni si ricarica a caldo con SIGHUP senza riavvio.'
		},
		{
			q: 'Quali NIP supporta nostrfy?',
			a: 'nostrfy implementa 36 NIP, tra cui NIP-01, eliminazione NIP-09, gruppi NIP-29, autenticazione NIP-42, ricerca NIP-50, zap NIP-57, gift wrap NIP-59, liste di relay NIP-65, negentropy NIP-77, gestione NIP-86 e autenticazione HTTP NIP-98. La lista supported_nips di NIP-11 è dinamica: un NIP scompare quando i kind necessari vengono bloccati o disattivati.'
		},
		{
			q: 'nostrfy ospita file multimediali?',
			a: 'Sì. Il file server Blossom integrato ospita upload indirizzati per contenuto su un hostname dedicato — disco locale o bucket compatibile S3 come AWS S3 o Cloudflare R2. Gli upload sono autorizzati con eventi kind-24242 firmati e possono essere limitati a una allowlist.'
		},
		{
			q: 'Posso migrare da strfry?',
			a: 'Sì. nostrfy migrate-strfry importa direttamente un database strfry o un export JSONL, applicando la semantica degli eventi sostituibili/indirizzabili, le eliminazioni NIP-09 e gli effetti collaterali di moderazione NIP-29, e può unire le impostazioni strfry equivalenti in nostrfy.toml. La migrazione è offline, supporta il dry-run ed è sicura da ripetere.'
		},
		{
			q: 'nostrfy può girare dietro un proxy inverso o Cloudflare?',
			a: 'Sì. Configura server.trusted_proxies con gli indirizzi del proxy (loopback per nginx o Caddy sullo stesso host, l’intervallo del load balancer nel cloud) così i limiti per IP, blockip e i log vedono l’indirizzo reale del client. Il TLS è terminato dal proxy o dal tunnel; nostrfy serve dietro HTTP e WebSocket normali.'
		},
		{
			q: 'nostrfy ha un’API REST?',
			a: 'Sì — un’API /api/v1 in sola lettura sulla stessa porta del relay WebSocket, in un thread di lettura dedicato, quindi il traffico REST non blocca mai gli abbonati. Interroga gli eventi per npub, nevent o naddr e offre conteggi, statistiche autore, ripartizioni per giorno/mese e ricerca full-text.'
		},
		{
			q: 'Come resta online nostrfy sotto carico o abusi?',
			a: 'Protezione dal sovraccarico, thread di lettura dedicati, isolamento dei panic e limiti rigorosi delle risorse. Le code limitate falliscono rapidamente invece di esaurire la memoria; i limiti di connessioni per IP fermano i flood di socket, e un disco bloccato non blocca le letture. I sottosistemi sono isolati e il relay continua a servire.'
		},
		{
			q: 'Come gestisco utenti, ban e ruoli?',
			a: 'Tramite l’API di gestione JSON-RPC NIP-86 con un token Bearer o una chiave admin NIP-98: bannare chiavi, bloccare IP, gestire allowlist dei kind, ruoli e codici di invito. Le concessioni dei metodi permettono di delegare la moderazione ad altre chiavi senza concedere pieni permessi di amministratore.'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'it',
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
	title="Domande frequenti"
	description="Risposte su nostrfy: installazione, configurazione, supporto NIP, media Blossom, migrazione da strfry, proxy inversi, licenza e gestione."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Domande frequenti</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Risposte brevi su come gestire nostrfy. Tutto qui sotto rimanda alla
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">documentazione</a> — e se preferisci, puoi
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">confrontarlo con strfry</a>.
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
				Installa nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Vedi il codice sorgente
			</a>
		</div>
	</div>
</div>
