<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. ferma il relay nostrfy (la migrazione richiede la directory del database)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry-run — analizza e verifica ogni evento, non scrive nulla
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. importazione
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. avvia — i gruppi NIP-29 e i ruoli NIP-43 vengono ricostruiti dagli eventi importati
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # necessario per NIP-42/62/98 e i metadati NIP-29
private_key = "..."                       # necessario per i metadati NIP-29/43 firmati dal relay

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Opzione A — nostrfy esegue \`strfry export\` direttamente (strfry in PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Opzione B — hai già esportato in un file
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Opzione C — pipe (stdin è l'input predefinito)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # per nak (WebSocket)
H=https://relay.example.com    # per curl (HTTP)

nak relay "$R"                              # il relay risponde e annuncia i suoi NIP
curl -s "$H/api/v1/query?limit=1"           # gli eventi vengono serviti
nak req -i <deleted-event-id> "$R"          # un evento eliminato resta eliminato
nak req -k 39000 "$R"                       # metadati dei gruppi NIP-29 (se migrati)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # appartenenza NIP-43 (AUTH)`;
</script>

<DocsTitle
	title="Migrazione da strfry"
	description="Sposta gli eventi di un relay strfry esistente in nostrfy con un comando — preparazione, dry run, migrazione, verifica e rollback."
/>

<div class="doc-body">
	<h2>A colpo d’occhio</h2>
	<p>
		<code>nostrfy migrate-strfry</code> legge il formato di export proprio di
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		(JSONL, un evento NIP-01 per riga), quindi funziona tra versioni del database strfry e non dipende dallo schema
		LMDB interno di strfry. Non scrive mai nel database strfry.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Migrato</th>
					<th>Non migrato</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Ogni evento memorizzato (semantica sostituibile/indirizzabile applicata)</td>
					<td>Impostazioni strfry senza equivalente nostrfy (il report di merge le elenca con motivo)</td>
				</tr>
				<tr>
					<td>Scadenza NIP-40 — gli eventi già scaduti vengono saltati</td>
					<td>Media Blossom e mapping proprietari (strfry non ha server Blossom)</td>
				</tr>
				<tr>
					<td>Cancellazioni NIP-09, inclusi blocchi di ripubblicazione per eventi già eliminati da strfry</td>
					<td>Liste di accesso (ban NIP-86, liste pubkey del relay, allowlist Blossom)</td>
				</tr>
				<tr>
					<td>Effetti collaterali di moderazione NIP-29 <code>9005</code>/<code>9008</code></td>
					<td>Codici invito NIP-43 (emettine di nuovi con <code>createclaim</code>)</td>
				</tr>
				<tr>
					<td>Timestamp first-seen (quando è configurato il gate nuove pubkey)</td>
					<td>Richieste vanish NIP-62 a meno che <code>--apply-vanish</code> sia dato</td>
				</tr>
				<tr>
					<td>Gruppi NIP-29, ruoli NIP-43 e i loro metadati firmati dal relay, ricostruiti al primo avvio</td>
					<td>Identità/chiavi proprie del relay (vivono in <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>Le impostazioni strfry equivalenti, offerte per il merge in <code>nostrfy.toml</code> (opzionale)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Skip attesi nel riepilogo: <strong>eventi effimeri</strong> (kind 20000-29999, che nostrfy non memorizza
		mai) ed <strong>eventi già scaduti</strong>.
	</p>

	<h2>Avvio rapido</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="La migrazione è offline">
		Scrive direttamente in <code>database.path</code> e rifiuta di girare mentre un demone nostrfy (o un’altra
		migrazione) tiene la directory del database. <strong>Ferma prima il relay.</strong> strfry può restare
		in esecuzione — <code>strfry export</code> legge uno snapshot consistente.
	</Callout>

	<h2>Requisiti</h2>
	<ul>
		<li>
			Il binario <code>strfry</code> (per <code>--strfry-db</code>), o un file JSONL esportato da te.
		</li>
		<li>nostrfy v0.1.15 o superiore (sottocomando <code>migrate-strfry</code>).</li>
		<li>La config nostrfy del relay di destinazione, con <code>database.path</code>, <code>public_url</code> e <code>private_key</code> impostati.</li>
		<li>
			Spazio libero: circa la dimensione dell’export strfry più i suoi indici. L’indice parole NIP-50 aggiunge
			altro; su disco molto stretto puoi disabilitarlo (<code>database.search_index = false</code>),
			migrare e riabilitarlo dopo (l’indice è ricostruito all’avvio).
		</li>
		<li>Nessuna istanza nostrfy in esecuzione sul <code>database.path</code> di destinazione.</li>
	</ul>

	<h2>Preparare la config</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Genera la chiave del relay con <code>nostrfy genkey</code> se non ne hai una, poi valida:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>Merge delle impostazioni strfry (opzionale)</h3>
	<p>
		Prima di aprire il database, <code>migrate-strfry</code> cerca la config di strfry (<code>--strfry-config</code>, poi
		<code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>, <code>./strfry.conf</code>), stampa le impostazioni che hanno
		un equivalente nostrfy e differiscono dal tuo <code>nostrfy.toml</code>, e chiede se unirle. Solo le chiavi elencate
		vengono riscritte — commenti e ogni altra riga preservati, e un valore che renderebbe la config invalida viene saltato con
		motivo mentre il resto viene unito.
	</p>
	<ul>
		<li><code>--merge-config</code> applica senza chiedere (per script); <code>--no-merge-config</code> salta il passo.</li>
		<li>Senza terminale, le proposte sono stampate e il merge è saltato a meno che non venga passato <code>--merge-config</code>.</li>
		<li><code>--dry-run</code> stampa le proposte ma non scrive mai.</li>
	</ul>

	<h2>Dry run</h2>
	<p>Guarda prima di saltare — un dry run analizza e verifica l’intero export senza toccare il database:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		Un conteggio <code>bad signature</code> diverso da zero significa che l’export contiene eventi accettati da strfry senza
		verifica; saranno saltati. Se ti fidi, passa <code>--no-verify</code> per importarli comunque.
	</p>

	<h2>Migrazione</h2>
	<p>Scegli una delle tre modalità di input — producono tutte lo stesso risultato:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Flag</th>
					<th>Perché</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry non è in <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Ripresa/recupero: eventi con questo <code>created_at</code> o più nuovi (inclusivo)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>Onora le richieste vanish NIP-62 trovate nell’export (disattivo di default)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Salta la verifica firme per dump fidati (più veloce)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Eventi per transazione database (default 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Solo analisi e verifica</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		La migrazione è <strong>sicura da rieseguire</strong>: i duplicati vengono saltati e gli effetti di cancellazione
		riapplicati, quindi un’esecuzione interrotta può essere semplicemente ripetuta (o ripresa con <code>--since</code>).
	</p>

	<h2>Avvio e verifica</h2>
	<p>
		Il primo avvio ricostruisce lo store gruppi NIP-29 e lo store ruoli NIP-43 dagli eventi importati e
		ripubblica i metadati firmati dal relay (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		per gruppo, la lista membri <code>13534</code>). Su un database grande può volerci un momento; guarda il log.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		Per un confronto esatto, <code>strfry scan '&#123;&#125;' | wc -l</code> meno gli eventi effimeri/scaduti
		riportati dal riepilogo dovrebbe eguagliare ciò che i client possono recuperare.
	</p>

	<h2>Riprendere una migrazione interrotta</h2>
	<Callout type="warning" title="Non avviare il relay prima di rieseguire">
		Gli effetti collaterali gruppo NIP-29 (<code>9005</code>/<code>9008</code>) sono applicati dopo l’import; un’esecuzione
		interrotta ha memorizzato quegli eventi ma non ancora le loro cancellazioni, quindi il primo avvio potrebbe servire
		storico che la cancellazione doveva rimuovere. Riesegui prima la migrazione — completa gli effetti (il purge è
		idempotente) — poi avvia il relay.
	</Callout>
	<ul>
		<li>
			<strong>Esportato su file / via pipe:</strong> riesegui lo stesso comando. I duplicati vengono saltati e i
			blocchi di cancellazione riapplicati.
		</li>
		<li>
			<strong>Usato <code>--strfry-db</code>:</strong> il riepilogo stampa un suggerimento di ripresa; riesegui con quel
			<code>--since</code> (inclusivo, il secondo al confine è reimportato e deduplicato).
		</li>
		<li>
			Se fallisce con <code>database writer unavailable</code>, controlla spazio libero e <code>database.map_size</code>, poi riesegui.
		</li>
	</ul>

	<h2>Rollback</h2>
	<p>La migrazione scrive solo nel database nostrfy. Per tornare indietro, ferma il relay e ripristina il database pre-migrazione o rimuovilo:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # o ripristina il backup pre-migrazione'} lang="sh" />

	<h2>Risoluzione dei problemi</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Messaggio</th>
					<th>Causa / fix</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>Un demone nostrfy (o un’altra migrazione) tiene la directory: prima <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> deve nominare la directory che contiene <code>data.mdb</code></td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>Installa strfry, imposta <code>--strfry-bin</code>, o usa <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>Il thread writer si è fermato o la coda è sovraccarica: controlla disco/dimensione map, riesegui (sicuro)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>Il purge è stato interrotto: riesegui la migrazione</td>
				</tr>
				<tr>
					<td>Conteggio <code>bad signature</code> alto</td>
					<td>Il DB strfry contiene eventi non verificati: ispezionali; importa con <code>--no-verify</code> solo se ti fidi della fonte</td>
				</tr>
				<tr>
					<td>Metadati NIP-29 mancanti dopo l’avvio</td>
					<td>Nessun <code>relay.private_key</code>: esegui <code>nostrfy genkey</code> e riavvia</td>
				</tr>
				<tr>
					<td>Il merge impostazioni non è offerto</td>
					<td>Config strfry non trovata: passa <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Checklist</h2>
	<ul>
		<li>Relay nostrfy fermato</li>
		<li>Database strfry e config nostrfy salvati</li>
		<li><code>nostrfy check</code> passa</li>
		<li>Impostazioni strfry unite (o report revisionato)</li>
		<li>Dry run revisionato (nessuna bad signature inattesa)</li>
		<li>Migrazione completata senza errori</li>
		<li>Relay avviato; rebuild gruppi/ruoli loggato</li>
		<li>Conteggi eventi corrispondono (meno effimeri/scaduti)</li>
		<li>Eventi cancellati restano via (ripubblicazione rifiutata)</li>
		<li>Visibilità gruppi privati verificata anonimamente e come membro</li>
		<li>Reverse proxy / DNS / liste relay client aggiornati</li>
	</ul>

	<Callout type="tip" title="strfry ancora in esecuzione?">
		Se strfry è rimasto live durante l’export, fai un giro di catch-up quando sei pronto a passare: ferma nostrfy,
		riesegui la migrazione con <code>--since &lt;last created_at&gt;</code>, poi avvia di nuovo.
	</Callout>
</div>
