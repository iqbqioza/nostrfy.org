<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# Cambia port = 8080 nel file di configurazione, poi:
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# Se nostrfy è in esecuzione, riavvialo
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Rimuovi il file pid obsoleto se presente
rm -f nostrfy.pid`;
	const tomlExample = `# Esempi corretti
name = "my relay"        # le stringhe vanno tra virgolette con "
port = 8080              # i numeri vanno senza virgolette
enabled_nips = [1, 50]   # le liste vanno tra [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# Dall'esterno (usando IP/porta del server)
curl http://YOUR_SERVER_IP:8080/health

# Controlla il firewall (esempio: ufw)
sudo ufw status
# Apri la porta se necessario
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" in byte`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Fai anche il backup di [blossom].local_path se usi lo storage Blossom locale.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Risoluzione dei problemi"
	description="Gli errori più probabili — porte, permessi, TLS, NIP mancanti, pubblicazione e timeout — con soluzioni passo passo."
/>

<div class="doc-body">
	<p><strong>Tre cose da controllare prima:</strong></p>
	<ul>
		<li><code>nostrfy check</code> convalida la configurazione (la maggior parte degli errori sono errori di configurazione).</li>
		<li><code>tail -f nostrfy.log</code> mostra il log — la causa è quasi sempre lì.</li>
		<li><code>nostrfy restart</code> riavvia il demone in modo pulito.</li>
	</ul>

	<h2 id="cannot-start">Impossibile avviare</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Causa:</strong> Solo l’utente root può fare bind sulla porta 80.</p>
	<p><strong>Correzione:</strong> Esegui con <code>sudo</code> oppure cambia la porta con una come 8080.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Causa:</strong> Un altro processo (un vecchio nostrfy o un altro server) sta già usando
		la porta.
	</p>
	<p><strong>Correzione:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Causa:</strong> nostrfy è già in esecuzione; <code>start</code> si rifiuta di avviare una seconda
		istanza.
	</p>
	<p><strong>Correzione:</strong> Usa <code>nostrfy restart</code> oppure usa semplicemente l’istanza in esecuzione.</p>

	<h3><code>nostrfy stop</code> si blocca / <code>did not stop in time</code></h3>
	<p><strong>Causa:</strong> Il demone è bloccato o non risponde.</p>
	<p><strong>Correzione:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Causa:</strong> Il file di configurazione non è TOML valido. Errori comuni: dimenticare le virgolette
		intorno a una stringa o scrivere due volte la stessa chiave.
	</p>
	<p><strong>Correzione:</strong> Il messaggio di errore include un numero di riga. Controlla e correggi quella riga.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Causa:</strong> Il file di configurazione non esiste.</p>
	<p><strong>Correzione:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Causa:</strong> <code>relay.private_key</code> non è una chiave esadecimale valida di 64 caratteri.
	</p>
	<p>
		<strong>Correzione:</strong> Esegui <code>nostrfy genkey</code> per generare una chiave corretta (oppure imposta
		<code>private_key = ""</code>).
	</p>

	<h3>Molti avvisi nel log all’avvio</h3>
	<p>Le righe di log <code>[WARN]</code> segnalano problemi di configurazione. Le principali:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Avviso</th>
				<th>Significato e soluzione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> non è impostato — l’autenticazione NIP-42, NIP-62 vanish e l’autenticazione
					admin NIP-98 non funzioneranno. Imposta <code>wss://your-public-url</code>.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>I gruppi hanno bisogno di una chiave segreta. Esegui <code>nostrfy genkey</code>.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>Una chiave legacy inutilizzata (o un refuso) nella configurazione. Controlla il nome della chiave.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					Un refuso nel nome di una sezione (es. <code>[serve]</code> invece di <code>[server]</code>).
					Correggilo.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>Questa combinazione blocca fuori tutti. Cambia una delle due.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					Il requisito PoW è così alto che nessuno può pubblicare. Abbassa <code>require_pow</code>.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">Impossibile connettersi o comportamento anomalo</h2>

	<h3>Il client riceve <code>connection refused</code></h3>
	<p>
		<strong>Causa:</strong> Il relay non è in esecuzione oppure un firewall sta bloccando la porta.
	</p>
	<p><strong>Correzione:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>I client esterni non si connettono, quelli locali sì</h3>
	<p>
		<strong>Causa:</strong> <code>server.host</code> è ancora <code>127.0.0.1</code> (il valore predefinito),
		che accetta solo connessioni locali.
	</p>
	<p>
		<strong>Correzione:</strong> Imposta <code>host = "0.0.0.0"</code> nella configurazione e riavvia.
	</p>

	<h3>Impossibile connettersi tramite un tunnel Cloudflare</h3>
	<p>Quando si usa Cloudflare Tunnel:</p>
	<ul>
		<li>
			Il relay funziona in HTTP in chiaro; Cloudflare termina TLS, quindi i client usano <code>wss://</code>. Imposta
			<code>public_url = "wss://..."</code> sul relay (così l’autenticazione NIP-42 funziona).
		</li>
		<li>
			Cloudflare aggiunge un’intestazione <code>X-Forwarded-Proto</code>. nostrfy tratta
			i valori <code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> allo stesso modo, quindi
			normalmente non è necessaria alcuna configurazione aggiuntiva.
		</li>
	</ul>

	<h3><code>error: message too large</code> e la connessione si chiude</h3>
	<p>
		<strong>Causa:</strong> Un singolo messaggio supera <code>max_ws_message_bytes</code> (predefinito 1 MB).
	</p>
	<p>
		<strong>Correzione:</strong> Aumenta <code>limits.max_ws_message_bytes</code> se ti servono eventi più grandi — ma
		controlla anche i limiti del client.
	</p>

	<h3>Errori <code>too many subscriptions</code> / <code>too many filters</code></h3>
	<p>
		<strong>Causa:</strong> Sono stati raggiunti i limiti per connessione (sottoscrizioni predefinite 20, filtri
		predefiniti 20).
	</p>
	<p>
		<strong>Correzione:</strong> Aumenta <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> (e controlla le impostazioni del client).
	</p>

	<h3>Le nuove connessioni vengono rifiutate sotto carico</h3>
	<p>
		<strong>Causa:</strong> È stato raggiunto <code>max_connections</code> (predefinito 10000), è scattato il limite per IP
		(<code>max_connections_per_ip</code>, predefinito 64), oppure il limite di connessioni al secondo per IP
		(<code>max_connections_per_sec_per_ip</code>) ha rifiutato il picco. I limiti si applicano a ogni connessione —
		WebSocket e HTTP in chiaro allo stesso modo.
	</p>
	<p>
		<strong>Correzione:</strong> Rivedi e regola le impostazioni. <code>max_connections_per_ip = 0</code> disabilita
		il limite per IP; <code>max_connections_per_sec_per_ip = 0</code> disabilita il limite di frequenza. Queste tre
		impostazioni richiedono un riavvio.
	</p>

	<h3>Le connessioni cadono dopo un po’</h3>
	<p>
		<strong>Causa:</strong> Se <code>ws_idle_timeout_secs</code> è impostato, le connessioni inattive vengono chiuse.
		I client sani rispondono al PING del relay con un PONG e restano connessi; solo i peer morti vengono rimossi.
	</p>
	<p>
		<strong>Correzione:</strong> È intenzionale — il valore predefinito è 300 secondi. Imposta
		<code>ws_idle_timeout_secs = 0</code> per disabilitarlo del tutto.
	</p>

	<h3>Una sottoscrizione termina con <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Causa:</strong> Gli eventi memorizzati di una REQ hanno superato <code>max_req_response_bytes</code>
		(predefinito 32 MiB). Succede solo con eventi molto grandi o filtri molto ampi.
	</p>
	<p>
		<strong>Correzione:</strong> Restringi il filtro (<code>since</code>/<code>until</code> più stretti, un
		<code>limit</code> più basso) oppure aumenta <code>max_req_response_bytes</code> (0 disabilita il budget).
	</p>

	<h3>Un NIP manca dall’elenco NIP-11 <code>supported_nips</code></h3>
	<p>
		<strong>Causa:</strong> L’elenco annunciato è dinamico — un NIP viene nascosto quando tutti i kind che
		definisce sono rifiutati: sono tutti in <code>blocked_kinds</code>, nessuno di essi è in
		<code>allowed_kinds</code>, oppure sono kind effimeri rifiutati da <code>reject_ephemeral</code>.
		NIP-29/43/66 richiedono inoltre <code>relay.private_key</code> e NIP-86 richiede
		<code>rpc.management_token</code> o <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Correzione:</strong> Controlla le liste di accesso attive — NIP-86 <code>listallowedkinds</code> mostra la
		allowlist dei kind, e <code>GET /</code> mostra immediatamente il <code>supported_nips</code> effettivo.
		Rimuovi il kind bloccante o l’impostazione <code>reject_ephemeral</code>.
	</p>

	<h2 id="publishing">Errori durante la pubblicazione</h2>
	<p>
		Quando la pubblicazione fallisce, il 4° elemento del messaggio <code>OK</code> spiega il motivo. I più comuni:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Errore</th>
				<th>Significato e soluzione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>La firma dell’evento non è valida (forse una chiave client danneggiata).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					Il contenuto supera <code>max_content_bytes</code> (predefinito 64K caratteri). Accorcialo oppure
					aumenta il limite.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>Più tag rispetto a <code>max_tags</code> (predefinito 2000).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Timestamp troppo nel futuro (oltre <code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>Il contenuto o i tag contengono una stringa che assomiglia a un nsec.
					<strong>Non pubblicare mai chiavi segrete.</strong> Rimuovi la stringa e l’evento verrà accettato.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>Lo stesso evento è già memorizzato (normale).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>La pubkey è bannata (<code>banpubkey</code>) o fuori dalla allowlist.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>Questo kind non è consentito.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					La pubkey ha superato <code>max_events_per_min_per_pubkey</code> (finestra scorrevole di 60
					secondi). Aspetta un minuto e riprova, oppure aumenta/disabilita il limite.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>L’id dell’evento è bannato.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Ripubblicazione di un evento eliminato.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					È richiesta l’autenticazione (quando <code>relay.require_auth</code> è attivo).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					L’account è stato creato entro <code>new_pubkey_min_age_secs</code>. Aspetta e riprova.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>Il gruppo non esiste (crealo prima).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					Il gruppo è <code>closed</code>; le richieste di partecipazione senza codice di invito non vengono accolte.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Server di file Blossom</h2>

	<h3>Caricamento non riuscito con <code>401</code></h3>
	<p>L’evento di autorizzazione al caricamento (kind 24242) è stato rifiutato. Verifica che:</p>
	<ul>
		<li>
			il tag <code>expiration</code> del token sia <strong>presente</strong> e impostato a un timestamp unix
			futuro,
		</li>
		<li>per upload/media/delete il token contenga un tag <code>x</code> con lo sha256 del blob,</li>
		<li>
			il tag <code>server</code> (quando presente) indichi esattamente il <code>blossom.host</code>
			configurato (solo hostname, senza schema/percorso),
		</li>
		<li>il token sia stato firmato negli ultimi 10 minuti (una finestra di freschezza contro il replay),</li>
		<li>e la chiave di firma sia quella dell’uploader stesso.</li>
	</ul>

	<h3>Caricamento non riuscito con <code>403</code></h3>
	<p>
		<code>blossom.restrict_uploads = true</code> è impostato e la pubkey non è nella allowlist — aggiungila
		con <code>nostrfy blossom allow npub1...</code> (il demone ricarica automaticamente). Se l’elenco sembra
		sbagliato, <code>nostrfy blossom list</code> lo mostra.
	</p>

	<h3>Caricamento non riuscito con <code>409</code></h3>
	<p>
		Il client ha inviato un’intestazione <code>X-SHA-256</code> che non corrisponde al corpo effettivo della richiesta (l’hash
		dichiarato è stato calcolato su byte diversi — ad es. il file è cambiato tra il calcolo dell’hash e l’invio).
		I client possono omettere del tutto l’intestazione.
	</p>

	<h3><code>GET /</code> sull’host multimediale serve il documento NIP-11</h3>
	<p>
		La richiesta non ha raggiunto il relay con l’intestazione Blossom Host. Punta <code>media.example.com</code>
		(o qualunque sia il <code>blossom.host</code> impostato) alla stessa porta nel reverse proxy, poi
		<code>nostrfy restart</code>.
	</p>

	<h3>Un blob dà 404 subito dopo il caricamento</h3>
	<p>
		Il file è indirizzato per contenuto tramite il suo SHA-256: recuperalo con l’hash esatto restituito nella risposta
		di caricamento (<code>/&lt;sha256&gt;</code> oppure <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). Una mancata corrispondenza significa
		che il client ha richiesto un hash diverso dai byte inviati.
	</p>

	<h2 id="search-groups-auth">Ricerca, gruppi e autenticazione</h2>

	<h3>La ricerca restituisce 0 risultati / risultati inattesi</h3>
	<p>La ricerca di nostrfy corrisponde a <strong>parole intere</strong>. Nota che:</p>
	<ul>
		<li>
			<code>search = "rust"</code> corrisponde agli eventi contenenti la parola "rust", ma <code>"ru"</code>
			NON corrisponde a "rust" come sottostringa.
		</li>
		<li>Vengono cercate solo le parole nel contenuto dell’evento.</li>
		<li>Se <code>search_index = false</code>, la ricerca funziona comunque ma è più lenta.</li>
		<li>
			Se NIP-50 è disabilitato (<code>disabled_nips = [50]</code>), <code>search</code> viene ignorato
			(viene inviato un NOTICE).
		</li>
	</ul>

	<h3>Metadati del gruppo (39000-39005) non generati</h3>
	<p>
		<strong>Causa:</strong> <code>relay.private_key</code> non è impostato. Gli snapshot dei gruppi sono firmati dalla
		chiave stessa del relay, quindi senza di essa non viene generato nulla.
	</p>
	<p><strong>Correzione:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> rifiuta gli eventi di gruppo</h3>
	<p>
		<strong>Causa:</strong> Il gruppo non esiste. In NIP-29, gli eventi di moderazione e le richieste di partecipazione
		(9021) non possono fare riferimento a un gruppo prima che sia stato creato (kind 9007).
	</p>
	<p><strong>Correzione:</strong> Crea prima il gruppo con un evento 9007.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Causa:</strong> La moderazione (aggiunta di membri, ecc.) richiede un admin (un membro con un ruolo).
		Il creatore è un admin.
	</p>
	<p><strong>Correzione:</strong> Chiedi a un admin di assegnarti un ruolo oppure crea il tuo gruppo.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Causa:</strong> Il gruppo è <code>closed</code>; le richieste di partecipazione senza codice di invito non
		vengono approvate automaticamente.
	</p>
	<p><strong>Correzione:</strong> Chiedi a un admin un codice di invito (9009) e partecipa con un tag <code>code</code>.</p>

	<h3>Uscita accidentale da un gruppo, oppure il gruppo non ha admin</h3>
	<p>
		<strong>Causa:</strong> Le richieste di uscita NIP-29 (kind 9022) vengono onorate per qualsiasi membro — incluso l’ultimo
		admin del gruppo, che non lascia admin dietro di sé. Senza admin, nessuno può più inviare eventi di moderazione
		(9000/9001/9002/9008).
	</p>
	<p>
		<strong>Correzione:</strong> Firma un evento di moderazione con la chiave stessa del relay (<code>relay.private_key</code>,
		la pubkey annunciata come <code>self</code> di NIP-11). Secondo NIP-29, gli eventi di moderazione possono venire dalla "chiave
		master del relay o ... dagli admin del gruppo", quindi il relay accetta la moderazione firmata dalla propria chiave anche
		quando il gruppo non ha admin. Per esempio, ripristina un admin con un <code>kind:9000</code>:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Firmalo e pubblicalo con la chiave del relay. In alternativa, elimina il gruppo con un
		<code>kind:9008</code> firmato dal relay (i suoi eventi memorizzati vengono eliminati) e ricrealo con <code>kind:9007</code>.
		Questo ripristino richiede che <code>relay.private_key</code> sia configurato.
	</p>

	<h3>Gli eventi protetti vengono rifiutati con <code>auth-required</code></h3>
	<p>
		<strong>Causa:</strong> Gli eventi protetti NIP-70 (con tag <code>-</code>) possono essere pubblicati solo dall’autore
		autenticato <strong>sulla stessa connessione</strong>.
	</p>
	<p><strong>Correzione:</strong> Abilita l’autenticazione NIP-42 nel client prima di pubblicare.</p>

	<h3>AUTH (NIP-42) restituisce <code>false</code></h3>
	<p>Cause comuni:</p>
	<ol>
		<li>
			<code>relay.public_url</code> non impostato o errato — il tag <code>relay</code> dell’evento AUTH non
			corrisponde all’URL del relay. Imposta <code>wss://...</code> e riavvia.
		</li>
		<li>Challenge scaduta — hai inviato AUTH su una connessione diversa oppure hai riutilizzato una vecchia challenge.</li>
		<li>
			L’orologio del client è sballato — il <code>created_at</code> dell’evento AUTH deve essere entro ±10 minuti da
			adesso.
		</li>
	</ol>

	<h3>L’API di gestione NIP-86 restituisce <code>401 unauthorized</code></h3>
	<p><strong>Causa:</strong> Credenziali mancanti o errate.</p>
	<p><strong>Correzione:</strong></p>
	<ul>
		<li>Imposta <code>management_token</code> e invia <code>Authorization: Bearer &lt;token&gt;</code>.</li>
		<li>
			Oppure imposta <code>admin_pubkey</code> e invia un evento di autenticazione NIP-98 (il tag <code>u</code> deve corrispondere
			esattamente all’URL del relay; è richiesto un tag <code>payload</code>).
		</li>
		<li>Se nessuno dei due è impostato, l’API di gestione è del tutto disabilitata.</li>
	</ul>

	<h3>Gli eventi di autenticazione NIP-98 vengono rifiutati per schema o porta diversi</h3>
	<p>
		La specifica NIP-98 dice che il tag <code>u</code> deve essere <em>esattamente</em> uguale all’URL assoluto della
		richiesta, quindi nostrfy deriva l’URL atteso da <code>relay.public_url</code>: la sua authority più lo
		schema HTTP mappato dallo schema WebSocket (<code>wss://</code> → <code>https://</code>,
		<code>ws://</code> → <code>http://</code>, <code>nostr+</code> rimosso). Senza
		<code>public_url</code> il relay si aspetta il semplice <code>http://host:port</code> che serve. Un tag con
		un altro schema, una porta diversa/omessa, oppure un percorso o una query diversi viene rifiutato — imposta
		<code>relay.public_url</code> all’indirizzo pubblico firmato dai client. Ogni evento di autenticazione è inoltre
		<strong>monouso</strong>: ripetere la stessa intestazione <code>Authorization</code> entro la sua finestra di validità di 60
		secondi viene rifiutato.
	</p>

	<h2 id="db-disk">Database e disco</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Causa:</strong> Il limite di memory-map di LMDB (predefinito 1 TB di spazio di indirizzi virtuali; l’uso reale
		del disco cresce con i dati) è stato raggiunto — in pratica, il database è pieno.
	</p>
	<p><strong>Correzione:</strong> Aumenta <code>database.max_map_size</code> e riavvia.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Causa:</strong> Meno di 32 MB di spazio libero su disco. Le scritture si fermano (per proteggere i dati); le letture
		continuano.
	</p>
	<p>
		<strong>Correzione:</strong> Libera spazio su disco. Le scritture riprendono automaticamente quando c’è spazio disponibile.
		(<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> riporta <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Causa:</strong> <code>database.map_size</code> è maggiore di <code>max_map_size</code>.
	</p>
	<p>
		<strong>Correzione:</strong> Imposta <code>map_size</code> pari o inferiore a <code>max_map_size</code> (i valori predefiniti
		vanno bene).
	</p>

	<h3>Controllo della dimensione del database</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Backup / spostamento del database</h3>
	<p>
		Tutti i dati si trovano nella directory <code>database.path</code>.
		<strong>Ferma il relay prima di copiare</strong> (copiare un database attivo può corromperlo).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Funzionamento del demone</h2>

	<h3><code>nostrfy stats</code> dice <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Causa:</strong> Il file delle statistiche non esiste — il demone non è in esecuzione oppure è stato avviato da
		meno di qualche secondo.
	</p>
	<p><strong>Correzione:</strong> Esegui <code>nostrfy start</code>, aspetta qualche secondo e riprova.</p>

	<h3>Il log cresce senza limiti</h3>
	<p>
		<strong>Causa:</strong> <code>max_log_size_bytes</code> è 0 (rotazione disabilitata).
	</p>
	<p>
		<strong>Correzione:</strong> Imposta <code>max_log_size_bytes = 52428800</code> (50 MB) e
		<code>max_log_files = 5</code>. La rotazione è automatica.
	</p>

	<h3>Le modifiche alla configurazione non hanno effetto dopo il ricaricamento</h3>
	<p>
		<strong>Causa:</strong> Hai ricaricato (SIGHUP) impostazioni fissate all’avvio:
		<code>private_key</code>, <code>api_host</code>, <code>metrics_enabled</code>, impostazioni LiveKit e
		le liste di abilitazione/disabilitazione dei NIP.
	</p>
	<p>
		<strong>Correzione:</strong> Usa <code>nostrfy restart</code>. Il log segnala in questo caso che «è necessario un riavvio».
	</p>

	<h3>Il relay continua a morire da solo</h3>
	<p><strong>Causa:</strong> La macchina si è riavviata oppure il relay ha esaurito la memoria (OOM).</p>
	<p><strong>Correzione:</strong></p>
	<ol>
		<li>Controlla la fine del log: <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Controlla se la macchina si è riavviata: <code>uptime</code> (un uptime molto breve significa un riavvio).
		</li>
		<li>Controlla la memoria: <code>free -h</code>.</li>
		<li>Avvia di nuovo il relay: <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Suggerimento">
		Per avviare nostrfy automaticamente all’avvio, registralo come servizio systemd con il comando di
		avvio del relay come <code>ExecStart</code>.
	</Callout>

	<h3>systemd non riesce ad avviare il relay sulla porta 80</h3>
	<p>
		Un servizio systemd in esecuzione come root può associare la porta 80. Se hai impostato <code>User=</code> a un utente normale,
		usa una porta più alta (es. 8080) oppure aggiungi
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> all’unità.
	</p>

	<h2 id="still-not-solved">Ancora non risolto?</h2>
	<ol>
		<li>
			<strong>Controlla il log</strong>: <code>tail -100 nostrfy.log</code> — di solito indica la causa
			diretta.
		</li>
		<li>
			<strong>Riconvalida la configurazione</strong>: <code>nostrfy check</code> — mostra avvisi ed errori.
		</li>
		<li>
			<strong>Raccogli i dettagli di riproduzione</strong>: cosa stavi facendo, quale client, quale errore esatto.
		</li>
		<li>
			<strong>Chiedi nel repository del progetto</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — quando apri
			una issue, includi i passaggi di riproduzione e il log.
		</li>
	</ol>
</div>
