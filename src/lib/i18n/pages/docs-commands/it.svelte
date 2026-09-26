<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# prima un dry-run — verifica ogni evento e non scrive nulla
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# importazione (ferma prima il relay nostrfy)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="Riferimento dei comandi"
	description="Tutti i comandi nostrfy: init, start, stop, stats, upgrade e migrate-strfry, più le liste di accesso della CLI e i filtri di sottoscrizione inbox/outbox."
/>

<div class="doc-body">
	<h2>Panoramica</h2>
	<p>Tutti i comandi accettano <code>--config &lt;path&gt;</code>(predefinito <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Comando</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Scrive un nostrfy.toml predefinito ed esce; il file viene creato con permessi 0600</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Genera una chiave segreta per i gruppi NIP-29, la scrive in relay.private_key, imposta la configurazione su 0600 e stampa la chiave pubblica; se il file è cambiato dopo la lettura, interrompe senza scrivere</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Convalida la configurazione (da eseguire prima dell’avvio)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Avvia come demone; <code>--foreground</code> per restare nel terminale</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Arresta il demone in esecuzione</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Arresta e riavvia (rilegge la configurazione)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Mostra statistiche in tempo reale</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Aggiorna il binario all’ultima release GitHub (o alla versione indicata); scarica l’asset della piattaforma, verifica il suo checksum sha256 ed esegue una prova con <code>--version</code>, poi sostituisce il binario in modo atomico; le esecuzioni concorrenti sono serializzate da un file di lock; senza versione indicata non esegue mai downgrade; <code>--force</code> reinstalla</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>Importa eventi da un relay strfry — con <code>--strfry-db</code> esegue <code>strfry export</code>, con <code>--input</code> legge un file JSONL o accetta input da stdin; ripetibile, con <code>--dry-run</code>, <code>--since</code> e l’unione opzionale delle impostazioni</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Gestire le liste di accesso</h2>
	<p>
		Le liste allow/deny del relay e la allowlist di upload Blossom risiedono in LMDB e si applicano subito — il demone in esecuzione viene ricaricato automaticamente:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>Una chiave negata è sempre rifiutata in pubblicazione e mai servita in lettura.</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> rimuove un IP dalla lista persistente di IP bloccati NIP-86 (recupero in caso di auto-blocco); riavvia il demone per applicarla.
	</p>

	<h2>Filtri di sottoscrizione inbox/outbox</h2>
	<p>
		nostrfy estende la sintassi dei filtri REQ con due chiavi comode per il modello di routing inbox/outbox — un’estensione nostrfy, non parte di alcun NIP. <code>"outbox"</code> si espande in <code>"authors"</code>: solo gli eventi <em>creati da</em> quella chiave. <code>"inbox"</code> si espande in <code>"#p"</code>: solo gli eventi <em>indirizzati a</em> quella chiave (menzioni, risposte, zap e DM). I valori possono essere esadecimali di 64 caratteri o codici <code>npub1</code>, oppure array uniti a una chiave esistente <code>authors</code>/<code>#p</code>; una chiave non valida fa rifiutare la sottoscrizione:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		Anche gli endpoint hanno restrizioni in scrittura: <code>/outbox</code> accetta solo eventi creati dalla chiave autenticata con NIP-42 della connessione (<code>server.outbox_write_policy = "any"</code>), oppure solo gli eventi del relay stesso (<code>"relay"</code>);
		<code>/inbox</code> accetta solo eventi che portano il tag <code>p</code>.
	</p>

	<h2>Migrazione da strfry</h2>
	<p>
		Un solo comando trasferisce gli eventi di un relay strfry esistente. La migrazione è offline (ferma prima il relay nostrfy — rifiuta di partire con il database occupato), legge il formato di export di strfry ed è sicura da ripetere: i duplicati vengono saltati e gli effetti delle eliminazioni riapplicati.
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		Propone inoltre di unire le impostazioni strfry equivalenti in <code>nostrfy.toml</code>, e dopo un’interruzione con <code>--since</code>
		riprendere. I gruppi NIP-29 e i ruoli NIP-43 vengono ricostruiti dagli eventi importati al primo avvio. Il manuale completo è nella
		<a href={p('/docs/migrating-from-strfry/')}>guida alla migrazione</a>.
	</p>

	<Callout type="tip" title="Passo passo">
		La maggior parte dei comandi è spiegata passo passo anche nella <a href={p('/docs/quick-start/')}>guida di avvio rapido</a>.
	</Callout>
</div>
