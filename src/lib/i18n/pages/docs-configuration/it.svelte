<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="Riferimento di configurazione"
	description="Riferimento completo per nostrfy.toml: ogni chiave, il suo tipo, il suo valore predefinito ed esattamente cosa fa — limiti, database, demone, controllo degli accessi e Blossom."
/>

<div class="doc-body">
	<h2>Nozioni di base</h2>
	<p>
		La configurazione è un file <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a>, per impostazione predefinita chiamato <code>nostrfy.toml</code>. Crealo con <code>init</code>:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Convalidalo (consigliato prima di ogni avvio):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Ogni comando accetta <code>--config &lt;path&gt;</code> (predefinito <code>nostrfy.toml</code>).</p>
	<p>Sintassi generale:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Sezioni di configurazione</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Sezione</th><th>Scopo</th></tr></thead>
		<tbody>
			<tr><td><code>[relay]</code></td><td>Identità, URL e interruttori NIP</td></tr>
			<tr><td><code>[server]</code></td><td>Binding di rete, separazione API, metriche</td></tr>
			<tr><td><code>[rpc]</code></td><td>RPC di gestione NIP-86 (autenticazione, limite del corpo)</td></tr>
			<tr><td><code>[limits]</code></td><td>Tutti i limiti e le protezioni contro il sovraccarico</td></tr>
			<tr><td><code>[database]</code></td><td>Archiviazione LMDB, indice di ricerca, limiti di coda</td></tr>
			<tr><td><code>[daemon]</code></td><td>File PID, di log e di statistiche e rotazione</td></tr>
			<tr><td><code>[access]</code></td><td>Elenchi iniziali di controllo degli accessi (modificabili a runtime)</td></tr>
			<tr><td><code>[blossom]</code></td><td>Server di file Blossom (hosting multimediale)</td></tr>
		</tbody>
	</table>
	</div>
	<p>Ogni chiave è facoltativa; una chiave mancante usa il suo valore predefinito.</p>

	<h2>Sezione [relay] — identità del relay</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>name</code></td><td>string</td><td><code>"nostrfy"</code></td><td>Nome del relay mostrato ai client tramite NIP-11</td></tr>
			<tr><td><code>description</code></td><td>string</td><td><code>"A minimal and stable Nostr relay"</code></td><td>Descrizione del relay (NIP-11)</td></tr>
			<tr><td><code>pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Chiave pubblica dell’amministratore (campo pubkey di NIP-11)</td></tr>
			<tr><td><code>contact</code></td><td>string</td><td><code>""</code></td><td>URI di contatto dell’amministratore (mailto: o https://)</td></tr>
			<tr><td><code>icon</code></td><td>string</td><td><code>""</code></td><td>URL dell’immagine icona del relay</td></tr>
			<tr><td><code>post_policy</code></td><td>string</td><td><code>""</code></td><td>URL che punta alla policy di pubblicazione del relay</td></tr>
			<tr><td><code>private_key</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Chiave segreta propria del relay; richiesta per i gruppi NIP-29</td></tr>
			<tr><td><code>public_url</code></td><td>string</td><td><code>""</code></td><td>URL pubblico, es. wss://relay.example.com</td></tr>
			<tr><td><code>livekit_url</code></td><td>string</td><td><code>""</code></td><td>URL del server LiveKit per stanze audio/video NIP-29</td></tr>
			<tr><td><code>livekit_api_key</code></td><td>string</td><td><code>""</code></td><td>Chiave API di LiveKit</td></tr>
			<tr><td><code>livekit_api_secret</code></td><td>string</td><td><code>""</code></td><td>Segreto API di LiveKit (usato per firmare i JWT)</td></tr>
			<tr><td><code>enabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>Allowlist esplicita di NIP</td></tr>
			<tr><td><code>disabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>NIP da disabilitare (ignorato quando enabled_nips non è vuoto)</td></tr>
			<tr><td><code>reject_ephemeral</code></td><td>boolean</td><td><code>false</code></td><td>Rifiuta eventi effimeri NIP-01 (kind 20000-29999)</td></tr>
			<tr><td><code>enabled_git</code></td><td>boolean</td><td><code>false</code></td><td>Accetta eventi git NIP-34 (kind 1617-1633, 30617/30618)</td></tr>
			<tr><td><code>require_pow</code></td><td>integer</td><td><code>0</code></td><td>Proof-of-work richiesta in bit zero iniziali</td></tr>
			<tr><td><code>new_pubkey_min_age_secs</code></td><td>integer</td><td><code>0</code></td><td>Rifiuta eventi da pubkey più recenti di questo valore (secondi; 0 = disattivato)</td></tr>
			<tr><td><code>max_events_per_min_per_pubkey</code></td><td>integer</td><td><code>0</code></td><td>Limite di pubblicazione per pubkey (al minuto; 0 = nessun limite)</td></tr>
			<tr><td><code>max_groups</code></td><td>integer</td><td><code>1000</code></td><td>Limite dell’archivio gruppi NIP-29 in memoria</td></tr>
			<tr><td><code>require_auth</code></td><td>boolean</td><td><code>false</code></td><td>Richiedi autenticazione NIP-42 per REQ/EVENT/COUNT/NEG</td></tr>
			<tr><td><code>send_auth_challenge</code></td><td>boolean</td><td><code>true</code></td><td>Invia la challenge AUTH alla connessione</td></tr>
			<tr><td><code>enabled_nip78_auth</code></td><td>boolean</td><td><code>true</code></td><td>Richiedi AUTH NIP-42 prima di accettare eventi kind 78/30078</td></tr>
			<tr><td><code>enabled_command_events</code></td><td>boolean</td><td><code>false</code></td><td>Esegui comandi operatore kind:1 firmati dalla pubkey dell’admin</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Dettagli delle chiavi</h3>
	<ul>
		<li>
			<strong>private_key</strong> — la chiave segreta propria del relay, usata per firmare eventi generati dal relay: metadati dei gruppi NIP-29 (39000-39005) ed eventi di ruolo/membri NIP-43. Generala con <code>nostrfy genkey</code>; tienila segreta. Viene letta una volta all’avvio, quindi modificarla richiede un riavvio.
		</li>
		<li>
			<strong>public_url</strong> — usata per convalidare i tag con URL dai client: AUTH NIP-42, vanish NIP-62 e auth admin NIP-98. Quando è vuota, il relay ripiega su <code>host:port</code>, che non corrisponde mai a una URL reale del client quando si usa il binding <code>0.0.0.0</code> o <code>127.0.0.1</code> (viene registrato un avviso). <strong>Impostala sempre.</strong>
		</li>
		<li>
			<strong>enabled_nips vs disabled_nips</strong> — l’allowlist vince: quando <code>enabled_nips</code> non è vuoto, vengono annunciati solo i suoi NIP e <code>disabled_nips</code> viene ignorato. Entrambi richiedono un riavvio.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — i kind 20000-29999 vengono rifiutati, ma i kind esenti che i NIP richiedono di inoltrare vengono comunque inoltrati: 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 e 21059. Si applica con SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — NIP-34 facoltativo: accetta i kind 1617-1633 e 30617/30618 e annuncia NIP-34. Disattivato per impostazione predefinita perché i payload delle patch possono essere grandi. Si applica con SIGHUP.
		</li>
	</ul>

	<h2>Sezione [server] — impostazioni del server</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>"127.0.0.1"</code></td><td>Indirizzo di binding; 0.0.0.0 accetta connessioni da ovunque</td></tr>
			<tr><td><code>port</code></td><td>integer</td><td><code>8080</code></td><td>Porta (1-65535); la porta 80 richiede root</td></tr>
			<tr><td><code>api_host</code></td><td>string</td><td><code>""</code></td><td>Hostname dedicato all’API REST</td></tr>
			<tr><td><code>metrics_enabled</code></td><td>boolean</td><td><code>true</code></td><td>Serve metriche Prometheus su /metrics</td></tr>
			<tr><td><code>ws_paths</code></td><td>string</td><td><code>"root"</code></td><td>Percorsi dell’endpoint WebSocket: root, inbox-outbox o all</td></tr>
			<tr><td><code>inbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>Chi può scrivere su /inbox: "any" o "relay" (gli eventi devono comunque avere un tag p)</td></tr>
			<tr><td><code>outbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>Chi può scrivere su /outbox: "any" (i propri eventi della pubkey autenticata NIP-42) o "relay"</td></tr>
			<tr><td><code>trusted_proxies</code></td><td>array of strings</td><td><code>[]</code></td><td>Indirizzi/CIDR dei reverse proxy il cui X-Forwarded-For è attendibile (vuoto = nessun proxy attendibile)</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Dettagli delle chiavi</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> collega tutte le interfacce IPv4; <code>127.0.0.1</code> è solo locale.</li>
		<li><strong>port</strong> — 1-65535; la porta 80 richiede root. Questa singola porta serve insieme il relay WebSocket, il documento NIP-11, l’API REST e l’RPC NIP-86.</li>
		<li>
			<strong>api_host</strong> — dedica l’API REST a un singolo hostname così API e relay possono condividere una porta dietro un reverse proxy. Fisso all’avvio — richiede un riavvio.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> serve solo /, <code>inbox-outbox</code> serve solo /inbox e /outbox, <code>all</code> serve entrambi. Fisso all’avvio — richiede un riavvio.
		</li>
		<li>
			<strong>trusted_proxies</strong> — elenca solo gli indirizzi propri del proxy (loopback per nginx/Caddy sullo stesso host, l’intervallo di origine del bilanciatore nel cloud). Se impostato, l’IP del client è derivato dall’ultima voce non attendibile di <code>X-Forwarded-For</code> per i limiti per IP, il rate limit, <code>blockip</code> e i log. Non aggiungere mai un indirizzo raggiungibile direttamente dai client — potrebbero falsificare l’header e aggirare i limiti per IP. Fisso all’avvio — richiede un riavvio.
		</li>
	</ul>

	<h2>Sezione [rpc] — gestione NIP-86</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>management_token</code></td><td>string</td><td><code>""</code></td><td>Token Bearer per le API di gestione</td></tr>
			<tr><td><code>admin_pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Pubkey dell’amministratore per l’auth di gestione NIP-98</td></tr>
			<tr><td><code>max_admin_body_bytes</code></td><td>integer</td><td><code>65536</code></td><td>Limite del corpo per l’RPC di gestione NIP-86</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		L’RPC NIP-86 è montato sulle route pubbliche <code>POST /</code> del relay — non esiste una porta di gestione separata. <code>management_token</code> e <code>admin_pubkey</code> a volte compaiono sotto <code>[server]</code> nelle vecchie guide; quelle grafie sono alias legacy di queste chiavi <code>[rpc]</code>.
	</p>

	<h2>Sezione [limits] — limiti e protezioni</h2>
	<h3>Connessioni e messaggi</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>max_connections</code></td><td>integer</td><td><code>10000</code></td><td>Connessioni simultanee massime</td></tr>
			<tr><td><code>max_connections_per_ip</code></td><td>integer</td><td><code>64</code></td><td>Connessioni massime per IP di origine</td></tr>
			<tr><td><code>max_ws_message_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>Byte massimi per messaggio/frame WebSocket</td></tr>
			<tr><td><code>socket_recv_buffer_kb</code></td><td>integer</td><td><code>64</code></td><td>Buffer di ricezione del kernel per connessione (KiB)</td></tr>
			<tr><td><code>max_out_queue_bytes</code></td><td>integer</td><td><code>262144</code></td><td>Limite della coda di uscita per connessione (byte)</td></tr>
			<tr><td><code>ws_idle_timeout_secs</code></td><td>integer</td><td><code>300</code></td><td>Chiudi le connessioni inattive dopo questo tempo</td></tr>
			<tr><td><code>http_read_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>Timeout dell’header HTTP (difesa slow-loris)</td></tr>
			<tr><td><code>max_connections_per_sec_per_ip</code></td><td>integer</td><td><code>0</code></td><td>Nuove connessioni massime al secondo per IP di origine</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Sottoscrizioni e query</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>max_filters</code></td><td>integer</td><td><code>20</code></td><td>Filtri massimi per REQ</td></tr>
			<tr><td><code>max_subscriptions</code></td><td>integer</td><td><code>20</code></td><td>Sottoscrizioni massime per connessione</td></tr>
			<tr><td><code>max_limit</code></td><td>integer</td><td><code>500</code></td><td>Tetto per il limit di REQ</td></tr>
			<tr><td><code>max_count</code></td><td>integer</td><td><code>2000</code></td><td>Tetto per i risultati COUNT</td></tr>
			<tr><td><code>max_sub_id_len</code></td><td>integer</td><td><code>64</code></td><td>Lunghezza massima dell’id di sottoscrizione (caratteri, non byte)</td></tr>
			<tr><td><code>max_sub_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>Byte totali dei filtri di sottoscrizione per connessione</td></tr>
			<tr><td><code>max_req_response_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>Tetto dei byte totali che una singola risposta REQ può inviare</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Eventi</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>max_content_bytes</code></td><td>integer</td><td><code>65536</code></td><td>Lunghezza massima del contenuto dell’evento in caratteri</td></tr>
			<tr><td><code>max_tags</code></td><td>integer</td><td><code>2000</code></td><td>Tag massimi per evento</td></tr>
			<tr><td><code>max_tag_value_bytes</code></td><td>integer</td><td><code>1024</code></td><td>Byte massimi per valore di tag</td></tr>
			<tr><td><code>max_created_at_future_secs</code></td><td>integer</td><td><code>3600</code></td><td>Scostamento futuro tollerato di created_at</td></tr>
			<tr><td><code>group_late_publish_secs</code></td><td>integer</td><td><code>3600</code></td><td>Ritardo tollerato per eventi admin dei gruppi NIP-29 (secondi)</td></tr>
			<tr><td><code>max_neg_items</code></td><td>integer</td><td><code>100000</code></td><td>Record massimi per sincronizzazione negentropy NIP-77</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Alias legacy: <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> e <code>limits.max_indexed_words</code> sono ancora accettati come alias di <code>relay.require_pow</code>, <code>relay.new_pubkey_min_age_secs</code> e <code>database.max_indexed_words</code>.
	</p>
	<h3>API REST</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>max_api_concurrent</code></td><td>integer</td><td><code>8</code></td><td>Richieste /api/v1 simultanee massime</td></tr>
			<tr><td><code>max_api_limit</code></td><td>integer</td><td><code>5000</code></td><td>Tetto per il parametro limit dell’API</td></tr>
			<tr><td><code>max_api_offset</code></td><td>integer</td><td><code>50000</code></td><td>Tetto per il parametro offset dell’API</td></tr>
			<tr><td><code>max_api_fetch</code></td><td>integer</td><td><code>55001</code></td><td>Finestra massima di over-fetch per query con offset — deve coprire max_api_offset + max_api_limit + 1 (0 = nessun limite)</td></tr>
			<tr><td><code>max_api_search_bytes</code></td><td>integer</td><td><code>2048</code></td><td>Byte massimi del parametro search dell’API</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Fan-out live</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>live_batch_interval_ms</code></td><td>integer</td><td><code>20</code></td><td>Frequenza di flush degli eventi live (ms)</td></tr>
			<tr><td><code>live_batch_size</code></td><td>integer</td><td><code>32</code></td><td>Eventi massimi per batch live</td></tr>
			<tr><td><code>live_buffer</code></td><td>integer</td><td><code>65536</code></td><td>Dimensione della coda di fan-out live</td></tr>
		</tbody>
	</table>
	</div>

	<h2>Sezione [database] — database</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>path</code></td><td>string</td><td><code>"./data"</code></td><td>Directory del database (LMDB)</td></tr>
			<tr><td><code>max_dbs</code></td><td>integer</td><td><code>32</code></td><td>Massimo di database nominati LMDB</td></tr>
			<tr><td><code>max_readers</code></td><td>integer</td><td><code>128</code></td><td>Massimo di lettori simultanei LMDB</td></tr>
			<tr><td><code>map_size</code></td><td>integer</td><td><code>1073741824</code> (1 GB)</td><td>Base della dimensione della mappa di memoria (byte)</td></tr>
			<tr><td><code>max_map_size</code></td><td>integer</td><td><code>1099511627776</code> (1 TB)</td><td>Tetto della mappa di memoria (byte)</td></tr>
			<tr><td><code>purge_interval_secs</code></td><td>integer</td><td><code>300</code></td><td>Intervallo di purge NIP-40 (secondi)</td></tr>
			<tr><td><code>search_index</code></td><td>boolean</td><td><code>true</code></td><td>Abilita l’indice delle parole NIP-50</td></tr>
			<tr><td><code>reader_threads</code></td><td>integer</td><td><code>2</code></td><td>Thread dedicati alla scansione</td></tr>
			<tr><td><code>max_indexed_words</code></td><td>integer</td><td><code>32</code></td><td>Parole del contenuto di ogni evento indicizzate per la ricerca</td></tr>
			<tr><td><code>meta_index</code></td><td>boolean</td><td><code>true</code></td><td>Scrivi l’header di metadati per evento usato dal prefiltro di scansione</td></tr>
			<tr><td><code>disabled_fsync</code></td><td>boolean</td><td><code>false</code></td><td>Salta il flush sincrono su disco dopo ogni batch di scrittura</td></tr>
			<tr><td><code>db_buffer_size</code></td><td>integer</td><td><code>2048</code></td><td>Buffer WebSocket iniziale per connessione (byte)</td></tr>
			<tr><td><code>db_request_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>Tempo massimo che una richiesta al database può attendere prima di fallire</td></tr>
			<tr><td><code>max_db_queue_msgs</code></td><td>integer</td><td><code>4096</code></td><td>Messaggi massimi in coda prima di fallire in fretta</td></tr>
			<tr><td><code>max_db_queue_events</code></td><td>integer</td><td><code>262144</code></td><td>Eventi massimi nei batch in coda prima di fallire in fretta</td></tr>
			<tr><td><code>max_db_queue_bytes</code></td><td>integer</td><td><code>268435456</code> (256 MiB)</td><td>Byte massimi di richieste al database in coda prima di fallire in fretta (0 = nessun limite di byte)</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Dettagli delle chiavi</h3>
	<ul>
		<li>
			<strong>map_size</strong> — la base della mappa di memoria: la mappa viene sempre aperta almeno con questa dimensione.
		</li>
		<li>
			<strong>max_map_size</strong> — il tetto, aperto come prenotazione virtuale sparsa: il disco fisico cresce solo con i dati effettivamente scritti. Aumentalo quando vedi <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — la ricerca funziona ancora (corrispondenza di parole intere contro il contenuto) ma le scansioni sono più lente; su un piccolo VPS dimezza il database. Consigliato su istanze piccole.
		</li>
		<li>
			<strong>disabled_fsync</strong> — scambia durabilità per throughput: le scritture vengono confermate nella page cache del SO e una perdita di alimentazione può perdere le scritture più recenti.
		</li>
	</ul>

	<h2>Sezione [daemon] — demone</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>pid_file</code></td><td>string</td><td><code>"./nostrfy.pid"</code></td><td>Percorso del file PID</td></tr>
			<tr><td><code>log_file</code></td><td>string</td><td><code>"./nostrfy.log"</code></td><td>Percorso del file di log</td></tr>
			<tr><td><code>stats_file</code></td><td>string</td><td><code>"./nostrfy.stats.json"</code></td><td>Percorso del file di statistiche</td></tr>
			<tr><td><code>stats_interval_secs</code></td><td>integer</td><td><code>5</code></td><td>Intervallo di scrittura delle statistiche (secondi)</td></tr>
			<tr><td><code>max_log_size_bytes</code></td><td>integer</td><td><code>52428800</code> (50 MB)</td><td>Dimensione di rotazione del log (0 = nessuna rotazione)</td></tr>
			<tr><td><code>max_log_files</code></td><td>integer</td><td><code>5</code></td><td>Generazioni di log ruotati da conservare</td></tr>
		</tbody>
	</table>
	</div>
	<p>I percorsi sono risolti rispetto alla directory del file di configurazione, quindi restano validi dopo che il demone cambia la sua directory di lavoro.</p>

	<h2>Sezione [access] — controllo degli accessi</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>restrict_relay</code></td><td>boolean</td><td><code>false</code></td><td>Solo le pubkey in allowlist possono pubblicare</td></tr>
			<tr><td><code>blocked_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>Kind da rifiutare</td></tr>
			<tr><td><code>allowed_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>Allowlist di kind; solo questi kind sono accettati quando non è vuota</td></tr>
			<tr><td><code>blocked_ips</code></td><td>array of strings</td><td><code>[]</code></td><td>Indirizzi IP rifiutati al momento della connessione</td></tr>
			<tr><td><code>method_grants</code></td><td>table: pubkey → array of strings</td><td><code>&#123;&#125;</code></td><td>Concessioni di metodi NIP-86 per pubkey non admin (gestite a runtime con <code>assignmethod</code>)</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Gli elenchi allow/deny delle pubkey <strong>non</strong> sono chiavi di configurazione — vivono nel database del relay (LMDB) e sono gestiti a runtime:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — solo le pubkey in allowlist possono <strong>pubblicare</strong>, mentre la lettura resta aperta a tutti (qualsiasi client può ancora sottoscrivere e recuperare dati).
		</li>
		<li>Una pubkey negata viene sempre rifiutata in pubblicazione e mai servita in lettura.</li>
		<li>
			<strong>method_grants</strong> — concessioni di metodi NIP-86 per pubkey non admin (pubkey → nomi di metodo, es. un moderatore con <code>banevent</code> e <code>listbannedevents</code>). Inizializzate dalla configurazione alla prima esecuzione, poi gestite a runtime con <code>assignmethod</code>/<code>unassignmethod</code> di NIP-86 (ispezionate con <code>listmethodassignees</code>). Solo i metodi di moderazione e lettura sono delegabili — la gestione di permessi, ruoli, inviti e identità del relay resta solo admin, e una pubkey bannata viene rifiutata anche con concessioni. Vedi l'<a href={p('/docs/management/')}>API di gestione</a>.
		</li>
	</ul>

	<h2>Sezione [blossom] — server di file Blossom</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chiave</th><th>Tipo</th><th>Predefinito</th><th>Descrizione</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>""</code></td><td>Hostname per il server Blossom (vuoto = disabilitato)</td></tr>
			<tr><td><code>storage</code></td><td>string</td><td><code>"local"</code></td><td>Backend: "local" (local_path) o "s3" (bucket compatibile S3)</td></tr>
			<tr><td><code>local_path</code></td><td>string</td><td><code>"/var/lib/nostrfy/images"</code></td><td>Radice di archiviazione locale per file multimediali</td></tr>
			<tr><td><code>max_upload_bytes</code></td><td>integer</td><td><code>20971520</code> (20 MB)</td><td>Dimensione massima del file multimediale</td></tr>
			<tr><td><code>min_free_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>Spazio su disco sotto il quale gli upload vengono rifiutati</td></tr>
			<tr><td><code>s3_endpoint</code></td><td>string</td><td><code>""</code></td><td>Endpoint compatibile S3 (es. R2)</td></tr>
			<tr><td><code>s3_region</code></td><td>string</td><td><code>""</code></td><td>Regione S3 (R2 usa "auto")</td></tr>
			<tr><td><code>s3_bucket</code></td><td>string</td><td><code>""</code></td><td>Nome del bucket S3</td></tr>
			<tr><td><code>s3_access_key</code></td><td>string</td><td><code>""</code></td><td>Chiave di accesso S3</td></tr>
			<tr><td><code>s3_secret_key</code></td><td>string</td><td><code>""</code></td><td>Chiave segreta S3</td></tr>
			<tr><td><code>restrict_uploads</code></td><td>boolean</td><td><code>false</code></td><td>Solo le pubkey in allowlist possono caricare file</td></tr>
		</tbody>
	</table>
	</div>

	<h2>Ricarica a runtime (SIGHUP)</h2>
	<p>
		Modificare il file e inviare <code>kill -HUP $(cat nostrfy.pid)</code> ricarica la configurazione <strong>senza riavvio</strong>. La maggior parte delle impostazioni ha effetto immediato; alcune sono fisse all’avvio:
	</p>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Si applica con SIGHUP</th><th>Richiede riavvio</th></tr></thead>
		<tbody>
			<tr><td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td><td>relay.private_key</td></tr>
			<tr><td>reject_ephemeral, enabled_git, enabled_nip78_auth</td><td>relay.livekit_*, enabled_nips / disabled_nips</td></tr>
			<tr><td>la maggior parte di [limits]</td><td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, dimensioni del demone, tetti dei limiti, blossom.*</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] non viene applicato da una ricarica — gli elenchi vengono inizializzati una volta all’avvio e poi gestiti a runtime via NIP-86. Il log avvisa quando cambia un’impostazione che richiede il riavvio, e alcune impostazioni acquisite all’avvio non sono verificate dalla ricarica.
	</p>

	<Callout type="warning" title="Errori comuni">
		<div class="overflow-x-auto">
		<table>
			<thead><tr><th>Errore</th><th>Soluzione</th></tr></thead>
			<tbody>
				<tr><td>public_url non impostato</td><td>imposta <code>wss://...</code></td></tr>
				<tr><td>host lasciato a 127.0.0.1</td><td>i client esterni non possono connettersi</td></tr>
				<tr><td>private_key non impostata con NIP-29</td><td>esegui <code>nostrfy genkey</code> + riavvia</td></tr>
				<tr><td>restrict_relay true con allowlist vuota</td><td>tutti bloccati</td></tr>
				<tr><td>modificare chiavi solo-riavvio e fare solo SIGHUP</td><td>usa <code>nostrfy restart</code></td></tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
