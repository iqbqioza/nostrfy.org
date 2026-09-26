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
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # Seite 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # Seite 2 (wenn more true war)`;
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
	title="REST-API-Referenz"
	description="Schreibgeschützte HTTP-API zum Abfragen gespeicherter Nostr-Events über GET /api/v1/... — Endpunkte, Parameter, Paginierung, Sichtbarkeitsregeln und Fehler."
/>

<div class="doc-body">
	<h2>Basis-URL</h2>
	<p>
		Die API wird unter <code>/api/v1</code> auf demselben Port wie das WebSocket-Relay bereitgestellt:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Host-Routing (<code>server.api_host</code>)</h2>
	<p>
		Wenn <code>server.api_host</code> (z. B. <code>api.example.com</code>) konfiguriert ist, werden API und Relay per Host-Header getrennt: <code>api.example.com</code> erhält <code>/api/v1</code>,
		<code>/health</code> und <code>/metrics</code>; jeder andere Host erhält das WebSocket-Relay und NIP-11.
		Ohne <code>api_host</code> wird die API auf jedem Host bereitgestellt. Nur GET wird unterstützt — WebSocket-Upgrade-Anfragen an <code>/api/v1</code> werden mit 403 abgelehnt.
	</p>

	<h2>Endpunkte</h2>
	<h3>Identifikatorbasierte Pfade</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Pfad</th>
				<th>Gibt zurück</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>Neuestes Kind-0-Profil-Event</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>Das einzelne Event mit dieser ID</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>Events der Adresse (Kind + Autor + d-Tag)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>Events nach Pubkey, gefiltert nach Kind (akzeptiert npub1... oder nprofile1...; sonst 400)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Autor-Identifikatoren akzeptieren auf jedem Endpunkt <code>npub1...</code>, <code>nprofile1...</code> oder einen 64-Hex-Pubkey (unabhängig von Groß-/Kleinschreibung).
	</p>
	<h3>Abfrage- und Aggregat-Endpunkte</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — generische Filterabfrage ohne Identifikator.</li>
		<li><code>GET /api/v1/count</code> — Gesamtanzahl für dieselben Filterparameter (NIP-45-Semantik).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — Event-Anzahlen pro Kind für einen Autor, meistgenutzte zuerst.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — Tagesanzahlen für einen Monat;
			Monat muss 1–12 sein, und jeder Tag wird mit Nullen aufgefüllt bis zum letzten Tag gemeldet (jeder Eintrag und die Summe tragen ein <code>approximate</code>-Flag).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — ein einzelnes Event anhand seiner 64-Hex-ID (Präfixe abgelehnt).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — Autor-Zusammenfassung (gesamt, erste/letzte Aktivität, Kind-Aufschlüsselung); <code>first_seen</code>/<code>last_seen</code>/Monate sind <code>null</code>, wenn keine sichtbaren Events existieren.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — Stundenanzahlen für einen Tag; alle 24 Stunden werden mit Nullen aufgefüllt gemeldet (dieselben <code>approximate</code>-Flags wie bei daily).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — Antworten (#e) und Zitate (#q), die auf das Event verweisen; die Pfad-ID wird vor dem Abgleich kleingeschrieben, und ein <code>e</code>-Abfrageparameter wird per OR in die #e-Seite einbezogen.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — die neueste Kind-3-Folgeliste des Autors.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — die häufigsten Kinds auf dem Relay (begrenzte, sichtbarkeitsgefilterte Stichprobe; <code>approximate</code>- und <code>filtered</code>-Flags).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — die aktivsten Autoren auf dem Relay (begrenzte, sichtbarkeitsgefilterte Stichprobe; <code>approximate</code>- und <code>filtered</code>-Flags).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — die neueste NIP-65-Relay-Liste des Autors (Kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — Monatsanzahlen, mit Nullen aufgefüllt über den since/until-Bereich (Standard: der gesamte Zeitraum; begrenzt auf 120 Monate).
		</li>
	</ul>

	<h2>Abfrageparameter</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Max. Ergebnisse (Standard 100, begrenzt durch max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Anzahl zu überspringender sichtbarer Ergebnisse (Paginierung)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Nur Events mit created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Nur Events mit created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> für älteste zuerst; Standard ist neueste zuerst</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>NIP-50-Volltextsuche (Ganzwortübereinstimmung)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Nach #e- / #p- / #t- / #d-Tags filtern</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Events mit diesem Tag ausschließen — wird vor der Paginierung angewendet, sodass ausgeschlossene Events niemals Limit-Slots oder Offset-Schritte verbrauchen
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Antwortformat</h2>
	<p>Erfolgreiche Antworten geben <code>200 OK</code> mit folgendem JSON-Body zurück:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Feld</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>Die Events dieser Seite (Standard: neueste zuerst)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>Die Anzahl der Events auf dieser Seite</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td><code>true</code>, wenn weitere Seiten existieren (mit Offset abrufen)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Paginierung</h2>
	<p>
		Paginierung erfolgt mit <code>offset</code> und dem <code>more</code>-Flag, berechnet über die <strong>sichtbare</strong> Sequenz — verborgene Events überspringen oder duplizieren niemals eine Seite:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="Endpunkt-Eigenheiten">
		Singleton-Endpunkte (Profil, <code>/ids/&#123;hex&#125;</code>, follows, relays) akzeptieren trotzdem <code>offset</code> — <code>?offset=1</code> überspringt das einzige Event und gibt <code>[]</code> zurück.
		Die Abfrageparameter <code>authors</code>/<code>kinds</code> filtern nur den generischen <code>/query</code>-Endpunkt: Auf Kind-Endpunkten werden sie stillschweigend ignoriert (beide sind vorbefüllt), während sie auf ID-Endpunkten per AND verknüpft werden. Die Kind-Aufschlüsselung von <code>stats</code> ist nach Kind geordnet, im Gegensatz zu <code>/kinds</code> (zuerst nach Anzahl).
	</Callout>

	<h2>Sichtbarkeitsregeln</h2>
	<p>Die API ist nicht authentifiziert und hält daher dieselben Events zurück wie eine anonyme WebSocket-Verbindung:</p>
	<ul>
		<li>NIP-70-geschützte Events (mit <code>-</code>-Tag)</li>
		<li>NIP-59-Gift-Wraps (Kind 1059)</li>
		<li>Private/verborgene NIP-29-Gruppeninhalte (nur für Mitglieder sichtbar)</li>
	</ul>

	<h2>Fehler und Statuscodes</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Code</th>
				<th>Bedeutung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Erfolg</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Ungültiger Identifikator oder Abfrageparameter</td>
			</tr>
			<tr>
				<td>403</td>
				<td>WebSocket-Upgrade-Versuch an /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Unbekannter Pfad oder falscher Host für die API (api_host konfiguriert)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>API-Nebenläufigkeitslimit erreicht — bitte gleich erneut versuchen</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Beispiele</h2>
	<p>Notes eines Benutzers abrufen (neueste zuerst):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Paginieren und sortieren:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Ein einzelnes Event per ID abrufen (note1... oder nevent1... funktionieren beide):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Ein adressierbares Event abrufen (naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Suche:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Tag-Filter:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
