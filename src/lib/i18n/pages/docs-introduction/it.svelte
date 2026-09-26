<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Introduzione a nostrfy"
	description="Cos’è nostrfy, cosa fa di serie e le idee alla base del motore relay Nostr tutto-in-uno scritto in Rust."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> è un server relay per il protocollo
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a>. Memorizza gli eventi inviati dai client (post, reazioni, profili…) e li distribuisce in risposta alle sottoscrizioni.
	</p>

	<h2>Funzionalità principali</h2>
	<ul>
		<li><strong>Semplice e stabile</strong>  — scritto in Rust; un unico binario fa tutto.</li>
		<li>
			<strong>Archiviazione e ricerca rapide</strong>  — database LMDB con indice di ricerca full-text (NIP-50).
		</li>
		<li>
			<strong>Ampio supporto NIP</strong>  — 36 NIP implementati, più il file server Blossom: eliminazione, proof-of-work, delega, gruppi, ricerca e un’API di gestione.
		</li>
		<li>
			<strong>Facile da gestire</strong>  — modalità demone, rotazione dei log, ricaricamento a caldo della configurazione (SIGHUP), statistiche in tempo reale, API REST e metriche Prometheus.
		</li>
		<li>
			<strong>Migrazione facile</strong>  — un comando importa un
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			database: dry-run, unione delle impostazioni e ripetizioni sicure (<a href={p('/docs/migrating-from-strfry/')}>guida alla migrazione</a>).
		</li>
	</ul>

	<h2>Cosa ottieni di serie</h2>
	<p>
		Un unico binario <code>nostrfy</code> su un’unica porta fornisce:
	</p>
	<ul>
		<li>Il <strong>relay WebSocket</strong> e il documento informativo NIP-11.</li>
		<li>Un’<strong>API REST</strong> in sola lettura su <code>/api/v1/...</code> — il suo thread di lettura dedicato garantisce che il traffico REST non blocchi mai gli abbonati WebSocket.</li>
		<li>Il <strong>file server Blossom</strong> (hosting multimediale) su un hostname dedicato.</li>
		<li>L’<strong>RPC di gestione NIP-86</strong>, il controllo dello stato e Prometheus <code>/metrics</code>.</li>
	</ul>

	<h2>Profilo delle risorse</h2>
	<p>
		nostrfy è stato verificato su un <strong>0.25 vCPU / 512 MB VPS</strong>. La mappa di memoria LMDB è una prenotazione virtuale sparsa da 1 TiB — il disco fisico cresce solo con i dati reali — e la memoria del processo resta stabile: un relay con un database da 252 MB occupava <strong>7,9 MB di RSS privato</strong>.
	</p>

	<h2>Un assaggio rapido</h2>
	<p>Tre comandi per installare, inizializzare e avviare:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Poi verifica che il relay sia attivo:</p>
	<CodeBlock code={health} lang="bash" />
	<p>Poi recupera il documento NIP-11:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Passi successivi">
		Segui la <a href={p('/docs/quick-start/')}>guida di avvio rapido</a> per la prima esecuzione, oppure passa direttamente al
		<a href={p('/docs/configuration/')}>riferimento di configurazione</a> per regolare il relay.
	</Callout>
</div>
