<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="Gestire il relay"
	description="Per il tuo relay nostrfy: avvio e arresto, log e statistiche, ricaricamento a caldo della configurazione, istanze multiple e ottimizzazione su larga scala."
/>

<div class="doc-body">
	<h2>Avvio e arresto</h2>
	<p>Avvia il relay come demone in background:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>Oppure eseguilo in primo piano nel terminale:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Arresta:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Verifica che sia attivo:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Log e statistiche</h2>
	<p>
		Il demone scrive in <code>daemon.log_file</code>. Quando il file supera <code>max_log_size_bytes</code> viene ruotato automaticamente (<code>nostrfy.log.1</code>, <code>.2</code>…fino a <code>max_log_files</code> generazioni):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>Il livello di log è controllato dalla variabile d’ambiente <code>RUST_LOG</code> (ad esempio, <code>RUST_LOG=debug</code>).</p>
	<h3>Statistiche</h3>
	<p>Statistiche in tempo reale dalla CLI:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>Oppure via HTTP:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Mostra connessioni, eventi accettati/rifiutati, dimensione del database e altro.</p>
	<h3>Metriche Prometheus</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Ricaricamento a caldo (SIGHUP)</h2>
	<p>Dopo aver modificato il file di configurazione, ricaricalo senza riavvio:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Si applica alla ricarica</th>
				<th>Richiede riavvio</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Identità del relay, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>la maggior parte di [limits], reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, impostazioni LiveKit</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* (incluso search_index), blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Il log avverte quando cambia un’impostazione che richiede il riavvio.</p>

	<h2>Eseguire più istanze</h2>
	<p>
		nostrfy supporta più relay indipendenti su un solo server (porte diverse). Ogni istanza necessita di propri
		<code>server.port</code>, propri <code>pid_file</code>/<code>log_file</code>/<code>stats_file</code> della sezione
		<code>[daemon]</code>
		(valori condivisi fanno sì che la seconda istanza rifiuti l’avvio con <code>already running</code>),
		<code>database.path</code>, nonché (se usati) i propri <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Ogni istanza è gestita con la propria configurazione: <code>nostrfy --config /etc/nostrfy/a.toml start</code> ecc.</p>

	<h2>Distribuzioni su larga scala</h2>
	<p>
		Il relay è progettato per scalare a centinaia di migliaia di connessioni su un singolo host — la consegna live risveglia solo gli abbonati che possono corrispondere a un evento e la memoria per connessione resta contenuta. Per milioni serve una messa a punto a livello di host:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Impostazione</th>
				<th>Valore</th>
				<th>Motivo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× le connessioni obiettivo (+1000)</td>
				<td>ogni connessione occupa un fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>Coda di accept in attesa nei picchi di connessioni</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>basso (ad esempio, 10)</td>
				<td>Libera più rapidamente i socket TIME_WAIT</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 o 2</td>
				<td>La mappa LMDB è una grande prenotazione virtuale sparsa</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Su FreeBSD i parametri corrispondenti sono <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> più
		<code>ulimit -n</code>, nonché <code>kern.ipc.somaxconn</code> sostituisce <code>net.core.somaxconn</code>. La memoria kernel per connessione è di circa 80 KiB, quella utente di circa 10 KiB, quindi un milione di connessioni richiede circa 90 GiB di memoria kernel e utente oltre al database.
	</p>

	<h2 id="throughput">Throughput (eventi al secondo)</h2>
	<p>
		La scrittura degli eventi è limitata da due costi: la verifica della firma Schnorr (circa 30–50 µs per evento) e il flush sincrono su disco che lo scrittore LMDB esegue dopo ogni batch di commit. Entrambi si regolano nel file <code>nostrfy.toml</code>:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Impostazione</th>
				<th>Motivo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>Commit nella page cache del SO (microsecondi); un’interruzione di corrente perde solo le scritture dall’ultimo flush — inizia da qui</td>
			</tr>
			<tr>
				<td>Core CPU ≥ 8 vCPU</td>
				<td>Il percorso EVENT in batch verifica le firme in parallelo sui core</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>Elimina la scrittura dell’indice parole NIP-50 per evento nelle istanze a scrittura intensa</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		La verifica parallela delle firme convalida tutte le firme di un batch in attesa in una volta sola, su un pool di thread (massimo 8; i batch con meno di 16 eventi sono verificati inline). I controlli economici di ogni evento restano i primi, quindi il testo di rifiuto è identico al percorso sequenziale — solo il lavoro Schnorr è distribuito tra i core. Una build single-thread resta sequenziale.
	</p>

	<h2>Limiti anti-abuso fissi</h2>
	<p>
		Alcuni limiti rigidi sono fissi (non configurabili) per mantenere il relay reattivo sotto abusi:
	</p>
	<ul>
		<li>
			Un filtro contiene al massimo <strong>512</strong> voci tra <code>ids</code>, <code>authors</code> o
			<code>kinds</code>; i valori dei tag <code>#...</code> usano un budget separato di <strong>512</strong>
			valori. I filtri più grandi vengono rifiutati (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> tiene traccia di al massimo 10.000 IP di origine; quando è pieno, gli IP mai visti vengono rifiutati (con blocco in caso di saturazione).
		</li>
		<li>
			Gli <code>ids</code> dei filtri possono essere prefissi, ma corrispondono solo a id completi di 32 byte e a prefissi di lunghezza pari (le voci dispari o vuote sono ignorate sia nella cronologia sia nella consegna live).
		</li>
		<li>
			Chiavi di indice troppo lunghe (valori dei tag, parole del contenuto, tag <code>d</code> oltre il limite di dimensione delle chiavi LMDB) vengono saltate all’indicizzazione; l’evento viene comunque memorizzato.
		</li>
	</ul>
</div>
