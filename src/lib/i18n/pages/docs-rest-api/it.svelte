<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32-byte hex event id",
      "pubkey": "32-byte hex pubkey",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64-byte hex signature"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # pagina 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # pagina 2 (quando more era true)`;
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc';
	const notesEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1"`;
	const paginateEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?limit=10&offset=10&sort=asc"`;
	const byIdEx = `curl "http://127.0.0.1:8080/api/v1/note1..."
curl "http://127.0.0.1:8080/api/v1/nevent1..."`;
	const naddrEx = `curl "http://127.0.0.1:8080/api/v1/naddr1..."`;
	const searchEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?search=rust"`;
	const tagEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/7?e=<event-id>&limit=100"`;
</script>

<DocsTitle
	title="Riferimento API REST"
	description="API HTTP in sola lettura per interrogare gli eventi Nostr archiviati su GET /api/v1/... — endpoint, parametri, paginazione, regole di visibilità ed errori."
/>

<div class="doc-body">
	<h2>URL di base</h2>
	<p>
		L’API è servita sotto <code>/api/v1</code> sulla stessa porta del relay WebSocket:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Routing per host (<code>server.api_host</code>)</h2>
	<p>
		Quando <code>server.api_host</code> (es. <code>api.example.com</code>) è configurato, API e relay sono separati dall’header Host: <code>api.example.com</code> riceve <code>/api/v1</code>,
		<code>/health</code> e <code>/metrics</code>; qualsiasi altro host riceve il relay WebSocket e NIP-11.
		Senza <code>api_host</code> l’API è servita su ogni host. È supportato solo GET — le richieste di upgrade WebSocket a <code>/api/v1</code> sono rifiutate con 403.
	</p>

	<h2>Endpoint</h2>
	<h3>Percorsi basati su identificatore</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Percorso</th>
				<th>Restituisce</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>L’ultimo evento profilo kind-0</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>Il singolo evento con questo id</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>Eventi dell’indirizzo (kind + autore + tag d)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>Eventi per pubkey, filtrati per kind (accetta npub1... o nprofile1...; altrimenti 400)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Gli identificatori autore accettano <code>npub1...</code>, <code>nprofile1...</code> o una pubkey esadecimale da 64 caratteri (senza distinzione tra maiuscole e minuscole) su ogni endpoint.
	</p>
	<h3>Endpoint di query e aggregazione</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — query generica con filtro senza identificatore.</li>
		<li><code>GET /api/v1/count</code> — conteggio totale per gli stessi parametri di filtro (semantica NIP-45).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — conteggi eventi per kind per un autore, prima i più usati.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — conteggi giornalieri per un mese;
			il mese deve essere 1–12, e ogni giorno è riportato con riempimento a zero fino all’ultimo giorno (ogni voce e il totale portano un flag <code>approximate</code>).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — un singolo evento dal suo id esadecimale da 64 caratteri (prefissi rifiutati).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — riepilogo autore (totale, prima/ultima attività, suddivisione per kind); <code>first_seen</code>/<code>last_seen</code>/i mesi sono <code>null</code> quando non esistono eventi visibili.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — conteggi orari per un giorno; tutte le 24 ore sono riportate con riempimento a zero (stessi flag <code>approximate</code> di daily).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — risposte (#e) e citazioni (#q) che fanno riferimento all’evento; l’id del percorso è convertito in minuscolo prima del confronto, e un parametro di query <code>e</code> è combinato in OR nel lato #e.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — l’ultima lista seguiti kind-3 dell’autore.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — i kind più comuni sul relay (campione limitato, filtrato per visibilità; flag <code>approximate</code> e <code>filtered</code>).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — gli autori più attivi sul relay (campione limitato, filtrato per visibilità; flag <code>approximate</code> e <code>filtered</code>).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — l’ultima lista relay NIP-65 dell’autore (kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — conteggi mensili, con riempimento a zero sull’intervallo since/until (predefinito: l’intero periodo; massimo 120 mesi).
		</li>
	</ul>

	<h2>Parametri di query</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Parametro</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Risultati max (predefinito 100, limitato da max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Numero di risultati visibili da saltare (paginazione)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Solo eventi con created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Solo eventi con created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> per i meno recenti prima; predefinito: i più recenti prima</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>Ricerca full-text NIP-50 (corrispondenza di parole intere)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Filtra per tag #e / #p / #t / #d</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Escludi gli eventi con quel tag — applicato prima della paginazione, quindi gli eventi esclusi non consumano mai slot di limit né passi di offset
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Formato di risposta</h2>
	<p>Le risposte riuscite restituiscono <code>200 OK</code> con il seguente corpo JSON:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Campo</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>Gli eventi di questa pagina (i più recenti prima per impostazione predefinita)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>Il numero di eventi in questa pagina</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td>«true» quando esistono altre pagine (usa offset per recuperarle)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Paginazione</h2>
	<p>
		La paginazione avviene con <code>offset</code> e il flag <code>more</code>, calcolati sulla sequenza <strong>visibile</strong> — gli eventi nascosti non saltano né duplicano mai una pagina:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="Peculiarità degli endpoint">
		Gli endpoint singleton (profilo, <code>/ids/&#123;hex&#125;</code>, follows, relays) accettano comunque <code>offset</code> — <code>?offset=1</code> salta l’unico evento e restituisce <code>[]</code>.
		I parametri di query <code>authors</code>/<code>kinds</code> filtrano solo l’endpoint generico <code>/query</code>: sugli endpoint kind sono silenziosamente ignorati (entrambi precompilati), mentre sugli endpoint id sono combinati in AND. La suddivisione per kind di <code>stats</code> è ordinata per kind, a differenza di <code>/kinds</code> (prima per conteggio).
	</Callout>

	<h2>Regole di visibilità</h2>
	<p>L’API non è autenticata, quindi trattiene gli stessi eventi di una connessione WebSocket anonima:</p>
	<ul>
		<li>Eventi protetti NIP-70 (con tag <code>-</code>)</li>
		<li>Gift wrap NIP-59 (kind 1059)</li>
		<li>Contenuto di gruppo privato/nascosto NIP-29 (visibile solo ai membri)</li>
	</ul>

	<h2>Errori e codici di stato</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Codice</th>
				<th>Significato</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Successo</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Identificatore o parametro di query non valido</td>
			</tr>
			<tr>
				<td>403</td>
				<td>Tentativo di upgrade WebSocket a /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Percorso sconosciuto, o Host errato per l’API (api_host configurato)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>Limite di concorrenza API raggiunto — riprova tra poco</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Esempi</h2>
	<p>Recupera le note di un utente (prima le più recenti):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Pagina e ordina:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Recupera un singolo evento per id (funzionano sia note1... sia nevent1...):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Recupera un evento indirizzabile (naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Cerca:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Filtro per tag:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
