<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

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
	title="Konfigurationsreferenz"
	description="Vollständige Referenz für nostrfy.toml: jeder Schlüssel, sein Typ, sein Standardwert und genau was er bewirkt — Limits, Datenbank, Daemon, Zugriffskontrolle und Blossom."
/>

<div class="doc-body">
	<h2>Grundlagen</h2>
	<p>
		Die Konfiguration ist eine <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a>-Datei,
		standardmäßig <code>nostrfy.toml</code> genannt. Erstellen Sie sie mit <code>init</code>:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Validieren Sie sie (vor jedem Start empfohlen):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Jeder Befehl akzeptiert <code>--config &lt;path&gt;</code> (Standard <code>nostrfy.toml</code>).</p>
	<p>Allgemeine Syntax:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Konfigurationsabschnitte</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Abschnitt</th>
				<th>Zweck</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>[relay]</code></td>
				<td>Identität, URLs und NIP-Schalter</td>
			</tr>
			<tr>
				<td><code>[server]</code></td>
				<td>Netzwerk-Bindung, API-Trennung, Metriken</td>
			</tr>
			<tr>
				<td><code>[rpc]</code></td>
				<td>NIP-86-Verwaltungs-RPC (Auth, Body-Limit)</td>
			</tr>
			<tr>
				<td><code>[limits]</code></td>
				<td>Alle Limits und Überlastschutzmaßnahmen</td>
			</tr>
			<tr>
				<td><code>[database]</code></td>
				<td>LMDB-Speicher, Suchindex, Queue-Begrenzungen</td>
			</tr>
			<tr>
				<td><code>[daemon]</code></td>
				<td>PID-, Log- und Statistikdateien sowie Rotation</td>
			</tr>
			<tr>
				<td><code>[access]</code></td>
				<td>Initiale Zugriffskontrolllisten (zur Laufzeit änderbar)</td>
			</tr>
			<tr>
				<td><code>[blossom]</code></td>
				<td>Blossom-Dateiserver (Medien-Hosting)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Jeder Schlüssel ist optional; ein fehlender Schlüssel verwendet seinen Standardwert.</p>

	<h2>Abschnitt [relay] — Relay-Identität</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>name</code></td>
				<td>string</td>
				<td><code>"nostrfy"</code></td>
				<td>Relay-Name, der Clients per NIP-11 angezeigt wird</td>
			</tr>
			<tr>
				<td><code>description</code></td>
				<td>string</td>
				<td><code>"A minimal and stable Nostr relay"</code></td>
				<td>Relay-Beschreibung (NIP-11)</td>
			</tr>
			<tr>
				<td><code>pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Öffentlicher Schlüssel des Administrators (NIP-11-pubkey-Feld)</td>
			</tr>
			<tr>
				<td><code>contact</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Kontakt-URI des Administrators (mailto: oder https://)</td>
			</tr>
			<tr>
				<td><code>icon</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Relay-Icon-Bild-URL</td>
			</tr>
			<tr>
				<td><code>post_policy</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL zur Posting-Richtlinie des Relays</td>
			</tr>
			<tr>
				<td><code>private_key</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Der eigene geheime Schlüssel des Relays; erforderlich für NIP-29-Gruppen</td>
			</tr>
			<tr>
				<td><code>public_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Öffentliche URL, z. B. wss://relay.example.com</td>
			</tr>
			<tr>
				<td><code>livekit_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit-Server-URL für NIP-29-Audio-/Videoräume</td>
			</tr>
			<tr>
				<td><code>livekit_api_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit-API-Schlüssel</td>
			</tr>
			<tr>
				<td><code>livekit_api_secret</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit-API-Secret (zum Signieren von JWTs)</td>
			</tr>
			<tr>
				<td><code>enabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Explizite NIP-Allowlist</td>
			</tr>
			<tr>
				<td><code>disabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Zu deaktivierende NIPs (ignoriert, wenn enabled_nips nicht leer ist)</td>
			</tr>
			<tr>
				<td><code>reject_ephemeral</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>NIP-01-ephemere Events ablehnen (Kinds 20000–29999)</td>
			</tr>
			<tr>
				<td><code>enabled_git</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>NIP-34-Git-Events akzeptieren (Kinds 1617–1633, 30617/30618)</td>
			</tr>
			<tr>
				<td><code>require_pow</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Erforderlicher Proof-of-Work in führenden Null-Bits</td>
			</tr>
			<tr>
				<td><code>new_pubkey_min_age_secs</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Events von Pubkeys ablehnen, die jünger sind als dieser Wert (Sekunden; 0 = aus)</td>
			</tr>
			<tr>
				<td><code>max_events_per_min_per_pubkey</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Veröffentlichungs-Ratenlimit pro Pubkey (pro Minute; 0 = kein Limit)</td>
			</tr>
			<tr>
				<td><code>max_groups</code></td>
				<td>integer</td>
				<td><code>1000</code></td>
				<td>Obergrenze für den In-Memory-NIP-29-Gruppenspeicher</td>
			</tr>
			<tr>
				<td><code>require_auth</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>NIP-42-Authentifizierung für REQ/EVENT/COUNT/NEG erfordern</td>
			</tr>
			<tr>
				<td><code>send_auth_challenge</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>AUTH-Challenge bei Verbindung senden</td>
			</tr>
			<tr>
				<td><code>enabled_nip78_auth</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>NIP-42-AUTH vor Annahme von Kind-78/30078-Events erfordern</td>
			</tr>
			<tr>
				<td><code>enabled_command_events</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Kind:1-Operatorbefehle ausführen, die vom Admin-Pubkey verfasst wurden</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Details zu Schlüsseln</h3>
	<ul>
		<li>
			<strong>private_key</strong> — der eigene geheime Schlüssel des Relays, verwendet zum Signieren Relay-generierter Events: NIP-29-Gruppenmetadaten (39000–39005) und NIP-43-Rollen-/Mitgliedschafts-Events. Generieren Sie ihn mit <code>nostrfy genkey</code>; halten Sie ihn geheim. Er wird einmal beim Start gelesen, daher erfordert eine Änderung einen Neustart.
		</li>
		<li>
			<strong>public_url</strong> — wird zur Validierung URL-tragender Tags von Clients verwendet: NIP-42-AUTH, NIP-62-Vanish und NIP-98-Admin-Auth. Wenn leer, fällt das Relay auf <code>host:port</code> zurück, was niemals mit einer echten Client-URL übereinstimmt, wenn <code>0.0.0.0</code> oder <code>127.0.0.1</code> gebunden ist (eine Warnung wird geloggt).
			<strong>Immer setzen.</strong>
		</li>
		<li>
			<strong>enabled_nips vs disabled_nips</strong> — die Allowlist gewinnt: wenn <code>enabled_nips</code>
			nicht leer ist, werden nur deren NIPs beworben und <code>disabled_nips</code> wird ignoriert. Beides erfordert einen Neustart.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — Kinds 20000–29999 werden abgelehnt, aber die ausgenommenen Kinds, die laut NIPs weitergeleitet werden müssen, werden weiterhin weitergeleitet: 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 und 21059. Gilt bei SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — Opt-in für NIP-34: akzeptiert Kinds 1617–1633 und 30617/30618 und bewirbt NIP-34.
			Standardmäßig aus, da Patch-Payloads groß sein können. Gilt bei SIGHUP.
		</li>
	</ul>

	<h2>Abschnitt [server] — Servereinstellungen</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>"127.0.0.1"</code></td>
				<td>Bind-Adresse; 0.0.0.0 akzeptiert Verbindungen von überall</td>
			</tr>
			<tr>
				<td><code>port</code></td>
				<td>integer</td>
				<td><code>8080</code></td>
				<td>Port (1–65535); Port 80 erfordert Root</td>
			</tr>
			<tr>
				<td><code>api_host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Hostname, der ausschließlich für die REST-API vorgesehen ist</td>
			</tr>
			<tr>
				<td><code>metrics_enabled</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Prometheus-Metriken unter /metrics bereitstellen</td>
			</tr>
			<tr>
				<td><code>ws_paths</code></td>
				<td>string</td>
				<td><code>"root"</code></td>
				<td>WebSocket-Endpunktpfade: root, inbox-outbox oder all</td>
			</tr>
			<tr>
				<td><code>inbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Wer nach /inbox schreiben darf: „any“ oder „relay“ (Events müssen weiterhin einen p-Tag tragen)</td>
			</tr>
			<tr>
				<td><code>outbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Wer nach /outbox schreiben darf: „any“ (eigene Events des NIP-42-authentifizierten Pubkeys) oder „relay“</td>
			</tr>
			<tr>
				<td><code>trusted_proxies</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>Reverse-Proxy-Adressen/CIDRs, deren X-Forwarded-For vertraut wird (leer = keinem Proxy vertrauen)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Details zu Schlüsseln</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> bindet alle IPv4-Schnittstellen; <code>127.0.0.1</code> ist nur lokal.</li>
		<li><strong>port</strong> — 1–65535; Port 80 erfordert Root. Dieser eine Port bedient gemeinsam das WebSocket-Relay, das NIP-11-Dokument, die REST-API und die NIP-86-RPC.</li>
		<li>
			<strong>api_host</strong> — widmet die REST-API einem einzigen Hostnamen, sodass sich API und Relay einen
			Port hinter einem Reverse-Proxy teilen können. Beim Start fixiert — erfordert einen Neustart.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> bedient nur /, <code>inbox-outbox</code> bedient nur /inbox und
			/outbox, <code>all</code> bedient beides. Beim Start fixiert — erfordert einen Neustart.
		</li>
		<li>
			<strong>trusted_proxies</strong> — listen Sie nur die eigenen Adressen des Proxys auf (Loopback für nginx/Caddy auf demselben
			Host, Quellbereich des Load-Balancers in der Cloud). Wenn gesetzt, wird die Client-IP aus dem letzten nicht vertrauenswürdigen
			<code>X-Forwarded-For</code>-Eintrag abgeleitet für die Pro-IP-Begrenzungen, das Ratenlimit, <code>blockip</code> und die Logs. Fügen Sie niemals
			eine Adresse hinzu, die Clients direkt erreichen können — sie könnten den Header fälschen und die Pro-IP-Limits umgehen.
			Beim Start fixiert — erfordert einen Neustart.
		</li>
	</ul>

	<h2>Abschnitt [rpc] — NIP-86-Verwaltung</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>management_token</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Bearer-Token für die Verwaltungs-APIs</td>
			</tr>
			<tr>
				<td><code>admin_pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Administrator-Pubkey für NIP-98-Verwaltungsauth</td>
			</tr>
			<tr>
				<td><code>max_admin_body_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Body-Limit für die NIP-86-Verwaltungs-RPC</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Die NIP-86-RPC ist auf den öffentlichen <code>POST /</code>-Routen des Relays eingebunden — es gibt keinen separaten Verwaltungsport.
		<code>management_token</code> und <code>admin_pubkey</code> erscheinen in alten Anleitungen manchmal unter <code>[server]</code>;
		diese Schreibweisen sind veraltete Aliase dieser <code>[rpc]</code>-Schlüssel.
	</p>

	<h2>Abschnitt [limits] — Limits und Schutzmaßnahmen</h2>
	<h3>Verbindungen und Nachrichten</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_connections</code></td>
				<td>integer</td>
				<td><code>10000</code></td>
				<td>Maximale gleichzeitige Verbindungen</td>
			</tr>
			<tr>
				<td><code>max_connections_per_ip</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Max. Verbindungen pro Quell-IP</td>
			</tr>
			<tr>
				<td><code>max_ws_message_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Max. Bytes pro WebSocket-Nachricht/Frame</td>
			</tr>
			<tr>
				<td><code>socket_recv_buffer_kb</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Kernel-Empfangspuffer pro Verbindung (KiB)</td>
			</tr>
			<tr>
				<td><code>max_out_queue_bytes</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Begrenzung der Ausgangsqueue pro Verbindung (Bytes)</td>
			</tr>
			<tr>
				<td><code>ws_idle_timeout_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>Untätige Verbindungen nach dieser Zeit schließen</td>
			</tr>
			<tr>
				<td><code>http_read_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>HTTP-Request-Head-Timeout (Slow-Loris-Abwehr)</td>
			</tr>
			<tr>
				<td><code>max_connections_per_sec_per_ip</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Max. neue Verbindungen pro Sekunde pro Quell-IP</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Abonnements und Abfragen</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_filters</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Max. Filter pro REQ</td>
			</tr>
			<tr>
				<td><code>max_subscriptions</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Max. Abonnements pro Verbindung</td>
			</tr>
			<tr>
				<td><code>max_limit</code></td>
				<td>integer</td>
				<td><code>500</code></td>
				<td>Obergrenze für das REQ-Limit</td>
			</tr>
			<tr>
				<td><code>max_count</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Obergrenze für COUNT-Ergebnisse</td>
			</tr>
			<tr>
				<td><code>max_sub_id_len</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Max. Abonnement-ID-Länge (Zeichen, nicht Bytes)</td>
			</tr>
			<tr>
				<td><code>max_sub_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Gesamte Abonnement-Filterbytes pro Verbindung</td>
			</tr>
			<tr>
				<td><code>max_req_response_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>Obergrenze für die Gesamtbytes, die eine einzelne REQ-Antwort senden darf</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Events</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_content_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Max. Event-Inhaltslänge in Zeichen</td>
			</tr>
			<tr>
				<td><code>max_tags</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Max. Tags pro Event</td>
			</tr>
			<tr>
				<td><code>max_tag_value_bytes</code></td>
				<td>integer</td>
				<td><code>1024</code></td>
				<td>Max. Bytes pro Tag-Wert</td>
			</tr>
			<tr>
				<td><code>max_created_at_future_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Tolerierte Zukunftsabweichung von created_at</td>
			</tr>
			<tr>
				<td><code>group_late_publish_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Tolerierte Verzögerung für NIP-29-Gruppenadmin-Events (Sekunden)</td>
			</tr>
			<tr>
				<td><code>max_neg_items</code></td>
				<td>integer</td>
				<td><code>100000</code></td>
				<td>Max. Datensätze pro NIP-77-Negentropy-Sync</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Veraltete Aliase: <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> und
		<code>limits.max_indexed_words</code> werden weiterhin als Aliase von <code>relay.require_pow</code>,
		<code>relay.new_pubkey_min_age_secs</code> und <code>database.max_indexed_words</code> akzeptiert.
	</p>
	<h3>REST-API</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_api_concurrent</code></td>
				<td>integer</td>
				<td><code>8</code></td>
				<td>Max. gleichzeitige /api/v1-Anfragen</td>
			</tr>
			<tr>
				<td><code>max_api_limit</code></td>
				<td>integer</td>
				<td><code>5000</code></td>
				<td>Obergrenze für den API-limit-Parameter</td>
			</tr>
			<tr>
				<td><code>max_api_offset</code></td>
				<td>integer</td>
				<td><code>50000</code></td>
				<td>Obergrenze für den API-offset-Parameter</td>
			</tr>
			<tr>
				<td><code>max_api_fetch</code></td>
				<td>integer</td>
				<td><code>55001</code></td>
				<td>Max. Over-Fetch-Fenster für Offset-Abfragen — muss max_api_offset + max_api_limit + 1 abdecken (0 = keine Begrenzung)</td>
			</tr>
			<tr>
				<td><code>max_api_search_bytes</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Max. Bytes des API-search-Parameters</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Live-Fan-out</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>live_batch_interval_ms</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Wie oft Live-Events geflusht werden (ms)</td>
			</tr>
			<tr>
				<td><code>live_batch_size</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Max. Events pro Live-Batch</td>
			</tr>
			<tr>
				<td><code>live_buffer</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Live-Fan-out-Queue-Größe</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Abschnitt [database] — Datenbank</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>path</code></td>
				<td>string</td>
				<td><code>"./data"</code></td>
				<td>Datenbankverzeichnis (LMDB)</td>
			</tr>
			<tr>
				<td><code>max_dbs</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>LMDB-max. benannte Datenbanken</td>
			</tr>
			<tr>
				<td><code>max_readers</code></td>
				<td>integer</td>
				<td><code>128</code></td>
				<td>LMDB-max. gleichzeitige Leser</td>
			</tr>
			<tr>
				<td><code>map_size</code></td>
				<td>integer</td>
				<td><code>1073741824</code> (1 GB)</td>
				<td>Untergrenze für die Memory-Map-Größe (Bytes)</td>
			</tr>
			<tr>
				<td><code>max_map_size</code></td>
				<td>integer</td>
				<td><code>1099511627776</code> (1 TB)</td>
				<td>Obergrenze der Memory-Map (Bytes)</td>
			</tr>
			<tr>
				<td><code>purge_interval_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>NIP-40-Bereinigungsintervall (Sekunden)</td>
			</tr>
			<tr>
				<td><code>search_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>NIP-50-Wortindex aktivieren</td>
			</tr>
			<tr>
				<td><code>reader_threads</code></td>
				<td>integer</td>
				<td><code>2</code></td>
				<td>Dedizierte Scan-Threads</td>
			</tr>
			<tr>
				<td><code>max_indexed_words</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Wörter jedes Event-Inhalts, die für die Suche indexiert werden</td>
			</tr>
			<tr>
				<td><code>meta_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Metadaten-Header pro Event schreiben, der vom Scan-Prefilter verwendet wird</td>
			</tr>
			<tr>
				<td><code>disabled_fsync</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Synchronen Disk-Flush nach jedem Schreibbatch überspringen</td>
			</tr>
			<tr>
				<td><code>db_buffer_size</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Initialer WebSocket-Puffer pro Verbindung (Bytes)</td>
			</tr>
			<tr>
				<td><code>db_request_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>Wie lange eine Datenbankanfrage warten darf, bevor sie fehlschlägt</td>
			</tr>
			<tr>
				<td><code>max_db_queue_msgs</code></td>
				<td>integer</td>
				<td><code>4096</code></td>
				<td>Max. wartende Nachrichten in der Queue vor Fail-Fast</td>
			</tr>
			<tr>
				<td><code>max_db_queue_events</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Max. Events in wartenden Batches vor Fail-Fast</td>
			</tr>
			<tr>
				<td><code>max_db_queue_bytes</code></td>
				<td>integer</td>
				<td><code>268435456</code> (256 MiB)</td>
				<td>Max. Bytes wartender Datenbankanfragen vor Fail-Fast (0 = keine Byte-Begrenzung)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Details zu Schlüsseln</h3>
	<ul>
		<li>
			<strong>map_size</strong> — die Untergrenze für die Memory-Map: die Map wird immer mindestens so groß geöffnet.
		</li>
		<li>
			<strong>max_map_size</strong> — die Obergrenze, geöffnet als spärliche virtuelle Reservierung: physischer Speicher wächst nur
			mit den tatsächlich geschriebenen Daten. Erhöhen Sie sie bei <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — die Suche funktioniert weiterhin (Ganzwortsuche im Inhalt), aber Scans
			werden langsamer; auf einem winzigen VPS halbiert es die Datenbank. Für kleine Instanzen empfohlen.
		</li>
		<li>
			<strong>disabled_fsync</strong> — tauscht Haltbarkeit gegen Durchsatz: Schreibvorgänge landen im OS-Page-Cache und
			bei Stromausfall können die neuesten Schreibvorgänge verloren gehen.
		</li>
	</ul>

	<h2>Abschnitt [daemon] — Daemon</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>pid_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.pid"</code></td>
				<td>PID-Dateipfad</td>
			</tr>
			<tr>
				<td><code>log_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.log"</code></td>
				<td>Log-Dateipfad</td>
			</tr>
			<tr>
				<td><code>stats_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.stats.json"</code></td>
				<td>Statistikdateipfad</td>
			</tr>
			<tr>
				<td><code>stats_interval_secs</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Statistik-Schreibintervall (Sekunden)</td>
			</tr>
			<tr>
				<td><code>max_log_size_bytes</code></td>
				<td>integer</td>
				<td><code>52428800</code> (50 MB)</td>
				<td>Log-Rotationsgröße (0 = keine Rotation)</td>
			</tr>
			<tr>
				<td><code>max_log_files</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Aufzubewahrende rotierte Log-Generationen</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Pfade werden relativ zum Verzeichnis der Konfigurationsdatei aufgelöst, sodass sie gültig bleiben, nachdem der Daemon sein Arbeitsverzeichnis wechselt.</p>

	<h2>Abschnitt [access] — Zugriffskontrolle</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>restrict_relay</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Nur allow-gelistete Pubkeys dürfen veröffentlichen</td>
			</tr>
			<tr>
				<td><code>blocked_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Abzulehnende Kinds</td>
			</tr>
			<tr>
				<td><code>allowed_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Kind-Allowlist; nur diese Kinds werden akzeptiert, wenn nicht leer</td>
			</tr>
			<tr>
				<td><code>blocked_ips</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>IP-Adressen, die beim Verbindungsaufbau abgewiesen werden</td>
			</tr>
			<tr>
				<td><code>method_grants</code></td>
				<td>table: pubkey → array of strings</td>
				<td><code>&#123;&#125;</code></td>
				<td>NIP-86-Methodengrants für Nicht-Admin-Pubkeys (zur Laufzeit mit <code>assignmethod</code> verwaltet)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Die Pubkey-Allow-/Deny-Listen sind <strong>keine</strong> Konfigurationsschlüssel — sie leben in der Relay-Datenbank (LMDB) und werden
		zur Laufzeit verwaltet:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — nur die allow-gelisteten Pubkeys dürfen <strong>veröffentlichen</strong>, während
			das Lesen für alle offen bleibt (jeder Client kann weiterhin abonnieren und abrufen).
		</li>
		<li>Ein denied Pubkey wird beim Veröffentlichen immer abgewiesen und beim Lesen nie bedient.</li>
		<li>
			<strong>method_grants</strong> — NIP-86-Methodengrants für Nicht-Admin-Pubkeys (Pubkey → Methodennamen, z. B. ein
			Moderator mit <code>banevent</code> und <code>listbannedevents</code>). Beim ersten Start aus der Konfiguration initialisiert,
			dann zur Laufzeit mit NIP-86 <code>assignmethod</code>/<code>unassignmethod</code> verwaltet
			(prüfbar mit <code>listmethodassignees</code>). Nur Moderations- und Lesemethoden sind übertragbar —
			Berechtigungs-, Rollen-, Invite-Claim- und Relay-Identitätsverwaltung bleiben Admin-only, und ein gebannter Pubkey wird
			auch mit Grants abgewiesen. Siehe die
			<a href={p('/docs/management/')}>Verwaltungs-API</a>.
		</li>
	</ul>

	<h2>Abschnitt [blossom] — Blossom-Dateiserver</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Schlüssel</th>
				<th>Typ</th>
				<th>Standard</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Hostname für den Blossom-Server (leer = deaktiviert)</td>
			</tr>
			<tr>
				<td><code>storage</code></td>
				<td>string</td>
				<td><code>"local"</code></td>
				<td>Backend: „local“ (local_path) oder „s3“ (S3-kompatibler Bucket)</td>
			</tr>
			<tr>
				<td><code>local_path</code></td>
				<td>string</td>
				<td><code>"/var/lib/nostrfy/images"</code></td>
				<td>Lokales Speicherverzeichnis für Mediendateien</td>
			</tr>
			<tr>
				<td><code>max_upload_bytes</code></td>
				<td>integer</td>
				<td><code>20971520</code> (20 MB)</td>
				<td>Max. Mediendateigröße</td>
			</tr>
			<tr>
				<td><code>min_free_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>Festplattenspeicher, unterhalb dessen Uploads abgelehnt werden</td>
			</tr>
			<tr>
				<td><code>s3_endpoint</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-kompatibler Endpunkt (z. B. R2)</td>
			</tr>
			<tr>
				<td><code>s3_region</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-Region (R2 verwendet „auto“)</td>
			</tr>
			<tr>
				<td><code>s3_bucket</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-Bucket-Name</td>
			</tr>
			<tr>
				<td><code>s3_access_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-Zugangsschlüssel</td>
			</tr>
			<tr>
				<td><code>s3_secret_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-Geheimschlüssel</td>
			</tr>
			<tr>
				<td><code>restrict_uploads</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Nur allow-gelistete Pubkeys dürfen hochladen</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Neuladen zur Laufzeit (SIGHUP)</h2>
	<p>
		Das Bearbeiten der Datei und Senden von <code>kill -HUP $(cat nostrfy.pid)</code> lädt die Konfiguration <strong>ohne
		Neustart</strong> neu. Die meisten Einstellungen wirken sofort; einige sind beim Start fixiert:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Gilt bei SIGHUP</th>
				<th>Erfordert Neustart</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td>
				<td>relay.private_key</td>
			</tr>
			<tr>
				<td>reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>relay.livekit_*, enabled_nips / disabled_nips</td>
			</tr>
			<tr>
				<td>der Großteil von [limits]</td>
				<td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, Daemon-Größen, Limit-Obergrenzen, blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] wird durch ein Neuladen nicht angewendet — die Listen werden einmal beim Start initialisiert und dann zur Laufzeit per NIP-86 verwaltet.
		Das Log warnt, wenn sich eine neustartpflichtige Einstellung geändert hat, und einige beim Start erfasste Einstellungen werden beim
		Neuladen nicht geprüft.
	</p>

	<Callout type="warning" title="Häufige Fehler">
				<div class="overflow-x-auto">
			<table>
			<thead>
				<tr>
					<th>Fehler</th>
					<th>Lösung</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>public_url nicht gesetzt</td>
					<td>setzen Sie <code>wss://...</code></td>
				</tr>
				<tr>
					<td>host auf 127.0.0.1 belassen</td>
					<td>externe Clients können sich nicht verbinden</td>
				</tr>
				<tr>
					<td>private_key nicht gesetzt bei NIP-29</td>
					<td><code>nostrfy genkey</code> ausführen + Neustart</td>
				</tr>
				<tr>
					<td>restrict_relay true mit leerer Allowlist</td>
					<td>alle ausgesperrt</td>
				</tr>
				<tr>
					<td>neustartpflichtige Schlüssel geändert und nur SIGHUP gesendet</td>
					<td>nutzen Sie <code>nostrfy restart</code></td>
				</tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
