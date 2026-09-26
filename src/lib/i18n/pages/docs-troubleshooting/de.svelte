<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# port = 8080 in der Konfigurationsdatei ändern, dann:
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# Wenn nostrfy läuft, neu starten
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Veraltete Pid-Datei entfernen, falls vorhanden
rm -f nostrfy.pid`;
	const tomlExample = `# Korrekte Beispiele
name = "my relay"        # Strings werden mit " zitiert
port = 8080              # Zahlen stehen ohne Anführungszeichen
enabled_nips = [1, 50]   # Listen stehen in [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# Von außen (mit IP/Port des Servers)
curl http://YOUR_SERVER_IP:8080/health

# Firewall prüfen (Beispiel: ufw)
sudo ufw status
# Port bei Bedarf öffnen
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" in Bytes`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Auch [blossom].local_path sichern, bei lokalem Blossom-Speicher.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Fehlerbehebung"
	description="Die Fehler, denen Sie am wahrscheinlichsten begegnen — Ports, Berechtigungen, TLS, fehlende NIPs, Veröffentlichen und Timeouts — mit Schritt-für-Schritt-Lösungen."
/>

<div class="doc-body">
	<p><strong>Drei Dinge zuerst prüfen:</strong></p>
	<ul>
		<li><code>nostrfy check</code> validiert Ihre Konfiguration (die meisten Fehler sind Konfigurationsfehler).</li>
		<li><code>tail -f nostrfy.log</code> zeigt das Protokoll — die Ursache steht fast immer dort.</li>
		<li><code>nostrfy restart</code> startet den Daemon sauber neu.</li>
	</ul>

	<h2 id="cannot-start">Startet nicht</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Ursache:</strong> Port 80 kann nur von root gebunden werden.</p>
	<p><strong>Lösung:</strong> Mit <code>sudo</code> ausführen oder den Port z. B. auf 8080 ändern.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Ursache:</strong> Ein anderer Prozess (ein altes nostrfy oder ein anderer Server) verwendet den Port bereits.
	</p>
	<p><strong>Lösung:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Ursache:</strong> nostrfy läuft bereits; <code>start</code> verweigert den Start einer zweiten Instanz.
	</p>
	<p><strong>Lösung:</strong> <code>nostrfy restart</code> verwenden oder einfach die laufende Instanz nutzen.</p>

	<h3><code>nostrfy stop</code> hängt / <code>did not stop in time</code></h3>
	<p><strong>Ursache:</strong> Der Daemon hängt fest oder antwortet nicht.</p>
	<p><strong>Lösung:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Ursache:</strong> Die Konfigurationsdatei ist kein gültiges TOML. Typische Fehler: vergessene Anführungszeichen um einen String oder derselbe Schlüssel doppelt geschrieben.
	</p>
	<p><strong>Lösung:</strong> Die Fehlermeldung enthält eine Zeilennummer. Diese Zeile prüfen und korrigieren.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Ursache:</strong> Die Konfigurationsdatei existiert nicht.</p>
	<p><strong>Lösung:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Ursache:</strong> <code>relay.private_key</code> ist kein gültiger 64-stelliger Hex-Schlüssel.
	</p>
	<p>
		<strong>Lösung:</strong> <code>nostrfy genkey</code> ausführen, um einen korrekten Schlüssel zu erzeugen (oder
		<code>private_key = ""</code> setzen).
	</p>

	<h3>Viele Warnungen im Protokoll beim Start</h3>
	<p><code>[WARN]</code>-Zeilen weisen auf Konfigurationsprobleme hin. Die wichtigsten:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Warnung</th>
				<th>Bedeutung und Lösung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> ist nicht gesetzt — NIP-42-Auth, NIP-62-Vanish und NIP-98-Admin-Auth funktionieren nicht. <code>wss://your-public-url</code> setzen.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>Gruppen brauchen einen geheimen Schlüssel. <code>nostrfy genkey</code> ausführen.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>Ein ungenutzter Legacy-Schlüssel (oder Tippfehler) in der Konfiguration. Schlüsselnamen prüfen.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					Tippfehler in einem Abschnittsnamen (z. B. <code>[serve]</code> statt <code>[server]</code>). Korrigieren.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>Diese Kombination sperrt alle aus. Einen der beiden Werte ändern.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					Die PoW-Anforderung ist so hoch, dass niemand posten kann. <code>require_pow</code> senken.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">Kann nicht verbinden oder verhält sich seltsam</h2>

	<h3>Client erhält <code>connection refused</code></h3>
	<p>
		<strong>Ursache:</strong> Das Relay läuft nicht oder eine Firewall blockiert den Port.
	</p>
	<p><strong>Lösung:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>Externe Clients können nicht verbinden, lokale schon</h3>
	<p>
		<strong>Ursache:</strong> <code>server.host</code> steht noch auf <code>127.0.0.1</code> (Standard) und akzeptiert nur lokale Verbindungen.
	</p>
	<p>
		<strong>Lösung:</strong> In der Konfiguration <code>host = "0.0.0.0"</code> setzen und neu starten.
	</p>

	<h3>Keine Verbindung über einen Cloudflare-Tunnel</h3>
	<p>Bei Verwendung von Cloudflare Tunnel:</p>
	<ul>
		<li>
			Das Relay läuft mit plain HTTP; Cloudflare terminiert TLS, daher verwenden Clients <code>wss://</code>. Auf dem Relay
			<code>public_url = "wss://..."</code> setzen (damit funktioniert NIP-42-Auth).
		</li>
		<li>
			Cloudflare fügt einen <code>X-Forwarded-Proto</code>-Header hinzu. nostrfy behandelt die Werte
			<code>ws</code> / <code>wss</code> / <code>http</code> / <code>https</code> gleich, daher ist normalerweise keine zusätzliche Konfiguration nötig.
		</li>
	</ul>

	<h3><code>error: message too large</code>, und die Verbindung schließt sich</h3>
	<p>
		<strong>Ursache:</strong> Eine einzelne Nachricht überschreitet <code>max_ws_message_bytes</code> (Standard 1 MB).
	</p>
	<p>
		<strong>Lösung:</strong> <code>limits.max_ws_message_bytes</code> erhöhen, wenn größere Events nötig sind — aber auch die Limits des Clients prüfen.
	</p>

	<h3>Fehler <code>too many subscriptions</code> / <code>too many filters</code></h3>
	<p>
		<strong>Ursache:</strong> Die Caps pro Verbindung wurden erreicht (Subscriptions Standard 20, Filter Standard 20).
	</p>
	<p>
		<strong>Lösung:</strong> <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> erhöhen (und die Client-Einstellungen prüfen).
	</p>

	<h3>Neue Verbindungen werden unter Last abgewiesen</h3>
	<p>
		<strong>Ursache:</strong> <code>max_connections</code> (Standard 10000) wurde erreicht, das Cap pro IP
		(<code>max_connections_per_ip</code>, Standard 64) hat gegriffen, oder das Verbindungsratenlimit pro Sekunde und IP
		(<code>max_connections_per_sec_per_ip</code>) hat den Burst abgewiesen. Die Caps gelten für jede Verbindung — WebSocket wie plain HTTP.
	</p>
	<p>
		<strong>Lösung:</strong> Die Einstellungen prüfen und anpassen. <code>max_connections_per_ip = 0</code> deaktiviert das Cap pro IP; <code>max_connections_per_sec_per_ip = 0</code> deaktiviert das Ratenlimit. Diese drei Einstellungen erfordern einen Neustart.
	</p>

	<h3>Verbindungen brechen nach einer Weile ab</h3>
	<p>
		<strong>Ursache:</strong> Wenn <code>ws_idle_timeout_secs</code> gesetzt ist, werden untätige Verbindungen geschlossen. Gesunde Clients beantworten das PING des Relays mit PONG und bleiben verbunden; nur tote Peers werden entfernt.
	</p>
	<p>
		<strong>Lösung:</strong> Das ist beabsichtigt — Standard sind 300 Sekunden. Mit
		<code>ws_idle_timeout_secs = 0</code> ganz deaktivieren.
	</p>

	<h3>Eine Subscription endet mit <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Ursache:</strong> Die gespeicherten Events eines REQ haben <code>max_req_response_bytes</code> überschritten (Standard 32 MiB). Passiert nur bei sehr großen Events oder sehr breiten Filtern.
	</p>
	<p>
		<strong>Lösung:</strong> Den Filter einengen (strengeres <code>since</code> / <code>until</code>, kleineres
		<code>limit</code>) oder <code>max_req_response_bytes</code> erhöhen (0 deaktiviert das Budget).
	</p>

	<h3>Ein NIP fehlt in der NIP-11-Liste <code>supported_nips</code></h3>
	<p>
		<strong>Ursache:</strong> Die annoncierte Liste ist dynamisch — ein NIP wird ausgeblendet, wenn alle von ihm definierten Kinds abgelehnt werden: alle stehen in <code>blocked_kinds</code>, keiner steht in
		<code>allowed_kinds</code>, oder es sind ephemere Kinds, die per <code>reject_ephemeral</code> abgelehnt werden.
		NIP-29/43/66 erfordern zusätzlich <code>relay.private_key</code>, und NIP-86 erfordert
		<code>rpc.management_token</code> oder <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Lösung:</strong> Die aktiven Zugriffslisten prüfen — NIP-86-<code>listallowedkinds</code> zeigt die Kind-Allowlist, und <code>GET /</code> zeigt sofort die effektiven <code>supported_nips</code>.
		Den blockierenden Kind oder die <code>reject_ephemeral</code>-Einstellung entfernen.
	</p>

	<h2 id="publishing">Fehler beim Veröffentlichen</h2>
	<p>
		Wenn das Veröffentlichen fehlschlägt, erklärt das 4. Element der <code>OK</code>-Nachricht den Grund. Die häufigsten:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Fehler</th>
				<th>Bedeutung und Lösung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>Die Event-Signatur ist ungültig (möglicherweise ein defekter Client-Schlüssel).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					Der Inhalt überschreitet <code>max_content_bytes</code> (Standard 64K Zeichen). Kürzen oder das Limit erhöhen.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>Mehr Tags als <code>max_tags</code> (Standard 2000).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Zeitstempel liegt zu weit in der Zukunft (jenseits von <code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					Inhalt oder Tags enthalten einen nsec-artigen String.
					<strong>Niemals geheime Schlüssel posten.</strong> Den String entfernen, dann wird das Event akzeptiert.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>Dasselbe Event ist bereits gespeichert (normal).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>Der Pubkey ist gebannt (<code>banpubkey</code>) oder außerhalb der Allowlist.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>Dieser Kind ist nicht erlaubt.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					Der Pubkey hat <code>max_events_per_min_per_pubkey</code> überschritten (gleitendes 60-Sekunden-Fenster). Eine Minute warten und erneut versuchen oder das Limit erhöhen/deaktivieren.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>Die Event-ID ist gebannt.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Erneutes Veröffentlichen eines gelöschten Events.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					Authentifizierung ist erforderlich (wenn <code>relay.require_auth</code> aktiv ist).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					Das Konto wurde innerhalb von <code>new_pubkey_min_age_secs</code> erstellt. Warten und erneut versuchen.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>Die Gruppe existiert nicht (zuerst erstellen).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					Die Gruppe ist <code>closed</code>; Beitrittsanfragen ohne Einladungscode werden nicht honoriert.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Blossom-Dateiserver</h2>

	<h3>Upload schlägt mit <code>401</code> fehl</h3>
	<p>Das Upload-Autorisierungs-Event (Kind 24242) wurde abgelehnt. Prüfen, ob:</p>
	<ul>
		<li>
			der <code>expiration</code>-Tag des Tokens <strong>vorhanden</strong> ist und auf einen Unix-Zeitstempel in der Zukunft gesetzt ist,
		</li>
		<li>für upload/media/delete das Token einen <code>x</code>-Tag mit dem sha256 des Blobs trägt,</li>
		<li>
			der <code>server</code>-Tag (falls vorhanden) genau den konfigurierten <code>blossom.host</code> nennt (nur Hostname, ohne Schema/Pfad),
		</li>
		<li>das Token innerhalb der letzten 10 Minuten signiert wurde (Frische-Fenster gegen Replay),</li>
		<li>und der Signierschlüssel dem Uploader selbst gehört.</li>
	</ul>

	<h3>Upload schlägt mit <code>403</code> fehl</h3>
	<p>
		<code>blossom.restrict_uploads = true</code> ist gesetzt und der Pubkey steht nicht auf der Allowlist — mit <code>nostrfy blossom allow npub1...</code> hinzufügen (der Daemon lädt automatisch neu). Wenn die Liste falsch aussieht, zeigt <code>nostrfy blossom list</code> sie an.
	</p>

	<h3>Upload schlägt mit <code>409</code> fehl</h3>
	<p>
		Der Client hat einen <code>X-SHA-256</code>-Header gesendet, der nicht zum tatsächlichen Request-Body passt (der deklarierte Hash wurde über andere Bytes berechnet — z. B. hat sich die Datei zwischen Hashing und Senden geändert).
		Clients können den Header ganz weglassen.
	</p>

	<h3><code>GET /</code> auf dem Media-Host liefert das NIP-11-Dokument</h3>
	<p>
		Die Anfrage hat das Relay nicht mit dem Blossom-Host-Header erreicht. <code>media.example.com</code> (oder was als <code>blossom.host</code> gesetzt ist) im Reverse-Proxy auf denselben Port zeigen lassen, dann
		<code>nostrfy restart</code>.
	</p>

	<h3>Ein Blob gibt direkt nach dem Upload 404</h3>
	<p>
		Die Datei ist per SHA-256 inhaltsadressiert: sie über den exakten Hash aus der Upload-Antwort abrufen (<code>/&lt;sha256&gt;</code> oder <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). Eine Abweichung bedeutet,
		dass der Client einen anderen Hash angefordert hat als die gesendeten Bytes.
	</p>

	<h2 id="search-groups-auth">Suche, Gruppen und Auth</h2>

	<h3>Suche liefert 0 Ergebnisse / unerwartete Ergebnisse</h3>
	<p>Die nostrfy-Suche trifft <strong>ganze Wörter</strong>. Beachten, dass:</p>
	<ul>
		<li>
			<code>search = "rust"</code> Events mit dem Wort „rust“ trifft, aber <code>"ru"</code>
			trifft „rust“ NICHT als Substring.
		</li>
		<li>Nur Wörter im Event-Inhalt werden durchsucht.</li>
		<li>Falls <code>search_index = false</code>, funktioniert die Suche trotzdem, ist aber langsamer.</li>
		<li>
			Falls NIP-50 deaktiviert ist (<code>disabled_nips = [50]</code>), wird <code>search</code> ignoriert (es wird ein NOTICE gesendet).
		</li>
	</ul>

	<h3>Gruppen-Metadaten (39000-39005) werden nicht erzeugt</h3>
	<p>
		<strong>Ursache:</strong> <code>relay.private_key</code> ist nicht gesetzt. Gruppen-Snapshots werden mit dem eigenen Schlüssel des Relays signiert, ohne ihn wird nichts erzeugt.
	</p>
	<p><strong>Lösung:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> weist Gruppen-Events ab</h3>
	<p>
		<strong>Ursache:</strong> Die Gruppe existiert nicht. In NIP-29 können Moderations-Events und Beitrittsanfragen (9021) keine Gruppe adressieren, bevor sie per Kind 9007 erstellt wurde.
	</p>
	<p><strong>Lösung:</strong> Zuerst die Gruppe mit einem 9007-Event erstellen.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Ursache:</strong> Moderation (Mitglieder hinzufügen usw.) erfordert einen Admin (ein Mitglied mit Rolle). Der Ersteller ist Admin.
	</p>
	<p><strong>Lösung:</strong> Einen Admin um eine Rolle bitten oder eine eigene Gruppe erstellen.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Ursache:</strong> Die Gruppe ist <code>closed</code>; Beitrittsanfragen ohne Einladungscode werden nicht automatisch genehmigt.
	</p>
	<p><strong>Lösung:</strong> Einen Admin um einen Einladungscode (9009) bitten und mit einem <code>code</code>-Tag beitreten.</p>

	<h3>Versehentlich eine Gruppe verlassen, oder die Gruppe hat keine Admins</h3>
	<p>
		<strong>Ursache:</strong> NIP-29-Austrittsanfragen (Kind 9022) werden für jedes Mitglied honoriert — auch für den letzten Admin der Gruppe, der keine Admins hinterlässt. Ohne Admin kann niemand mehr Moderations-Events (9000/9001/9002/9008) senden.
	</p>
	<p>
		<strong>Lösung:</strong> Ein Moderations-Event mit dem eigenen Schlüssel des Relays signieren (<code>relay.private_key</code>,
		der Pubkey, der als NIP-11-<code>self</code> annonciert wird). Per NIP-29 dürfen Moderations-Events vom „Relay-Master-Key oder … Gruppen-Admins“ kommen, daher akzeptiert das Relay Gruppenmoderation, die mit seinem eigenen Schlüssel signiert ist, selbst wenn die Gruppe keine Admins hat. Zum Beispiel einen Admin mit <code>kind:9000</code> wiederherstellen:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Mit dem Relay-Schlüssel signieren und veröffentlichen. Alternativ die Gruppe mit Relay-signiertem
		<code>kind:9008</code> löschen (ihre gespeicherten Events werden gelöscht) und mit <code>kind:9007</code> neu erstellen.
		Diese Wiederherstellung braucht ein konfiguriertes <code>relay.private_key</code>.
	</p>

	<h3>Geschützte Events werden mit <code>auth-required</code> abgewiesen</h3>
	<p>
		<strong>Ursache:</strong> Geschützte NIP-70-Events (mit <code>-</code>-Tag) dürfen nur vom authentifizierten Autor <strong>auf derselben Verbindung</strong> veröffentlicht werden.
	</p>
	<p><strong>Lösung:</strong> Vor dem Veröffentlichen NIP-42-Auth im Client aktivieren.</p>

	<h3>AUTH (NIP-42) gibt <code>false</code> zurück</h3>
	<p>Häufige Ursachen:</p>
	<ol>
		<li>
			<code>relay.public_url</code> ist nicht gesetzt oder falsch — der <code>relay</code>-Tag des AUTH-Events passt nicht zur Relay-URL. <code>wss://...</code> setzen und neu starten.
		</li>
		<li>Veraltete Challenge — AUTH wurde auf einer anderen Verbindung gesendet oder eine alte Challenge wiederverwendet.</li>
		<li>
			Die Client-Uhr geht falsch — <code>created_at</code> des AUTH-Events muss innerhalb von ±10 Minuten um jetzt liegen.
		</li>
	</ol>

	<h3>NIP-86-Verwaltungs-API gibt <code>401 unauthorized</code> zurück</h3>
	<p><strong>Ursache:</strong> Fehlende oder falsche Credentials.</p>
	<p><strong>Lösung:</strong></p>
	<ul>
		<li><code>management_token</code> setzen und <code>Authorization: Bearer &lt;token&gt;</code> senden.</li>
		<li>
			Oder <code>admin_pubkey</code> setzen und ein NIP-98-Auth-Event senden (der <code>u</code>-Tag muss exakt zur Relay-URL passen; ein <code>payload</code>-Tag ist erforderlich).
		</li>
		<li>Falls beides nicht gesetzt ist, ist die Verwaltungs-API ganz deaktiviert.</li>
	</ul>

	<h3>NIP-98-Auth-Events werden wegen anderem Schema oder Port abgewiesen</h3>
	<p>
		Die NIP-98-Spezifikation sagt, der <code>u</code>-Tag muss <em>exakt</em> derselbe wie die absolute Request-URL sein, daher leitet nostrfy die erwartete URL aus <code>relay.public_url</code> ab: ihren Authority-Teil plus das HTTP-Schema, abgebildet aus dem WebSocket-Schema (<code>wss://</code> → <code>https://</code>,
		<code>ws://</code> → <code>http://</code>, <code>nostr+</code>-Präfix entfernt). Ohne
		<code>public_url</code> erwartet das Relay das plain <code>http://host:port</code>, das es bedient. Ein Tag mit anderem Schema, anderem/weggelassenem Port oder anderem Pfad bzw. Query wird abgewiesen — <code>relay.public_url</code> auf die öffentliche Adresse setzen, die Clients signieren. Jedes Auth-Event ist außerdem <strong>einmalig verwendbar</strong>: das Wiederholen desselben <code>Authorization</code>-Headers innerhalb seines 60-Sekunden-Gültigkeitsfensters wird abgewiesen.
	</p>

	<h2 id="db-disk">Datenbank und Festplatte</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Ursache:</strong> Die LMDB-Memory-Map-Obergrenze (Standard 1 TB virtueller Adressraum; die tatsächliche Plattennutzung wächst mit den Daten) wurde erreicht — die Datenbank ist faktisch voll.
	</p>
	<p><strong>Lösung:</strong> <code>database.max_map_size</code> erhöhen und neu starten.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Ursache:</strong> Weniger als 32 MB freier Plattenplatz. Schreibvorgänge stoppen (zum Schutz der Daten); Lesevorgänge laufen weiter.
	</p>
	<p>
		<strong>Lösung:</strong> Plattenplatz freigeben. Schreibvorgänge werden automatisch fortgesetzt, sobald Platz verfügbar ist.
		(<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> meldet <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Ursache:</strong> <code>database.map_size</code> ist größer als <code>max_map_size</code>.
	</p>
	<p>
		<strong>Lösung:</strong> <code>map_size</code> auf oder unter <code>max_map_size</code> setzen (die Standards sind in Ordnung).
	</p>

	<h3>Datenbankgröße prüfen</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Datenbank sichern / umziehen</h3>
	<p>
		Alle Daten liegen im Verzeichnis <code>database.path</code>.
		<strong>Das Relay vor dem Kopieren stoppen</strong> (das Kopieren einer Live-Datenbank kann sie korrumpieren).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Daemon-Betrieb</h2>

	<h3><code>nostrfy stats</code> sagt <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Ursache:</strong> Die Stats-Datei existiert nicht — der Daemon läuft nicht oder ist erst vor wenigen Sekunden gestartet.
	</p>
	<p><strong>Lösung:</strong> <code>nostrfy start</code> ausführen, ein paar Sekunden warten und erneut versuchen.</p>

	<h3>Das Protokoll wächst unbegrenzt</h3>
	<p>
		<strong>Ursache:</strong> <code>max_log_size_bytes</code> ist 0 (Rotation deaktiviert).
	</p>
	<p>
		<strong>Lösung:</strong> <code>max_log_size_bytes = 52428800</code> (50 MB) und
		<code>max_log_files = 5</code> setzen. Die Rotation ist automatisch.
	</p>

	<h3>Änderungen an der Konfiguration wirken nach Reload nicht</h3>
	<p>
		<strong>Ursache:</strong> Sie haben (per SIGHUP) Einstellungen neu geladen, die beim Start fixiert sind:
		<code>private_key</code>, <code>api_host</code>, <code>metrics_enabled</code>, LiveKit-Einstellungen und die NIP-Aktivierungs-/Deaktivierungslisten.
	</p>
	<p>
		<strong>Lösung:</strong> <code>nostrfy restart</code> verwenden. Das Protokoll enthält in diesem Fall eine Warnung „a restart is required“.
	</p>

	<h3>Das Relay stirbt von selbst</h3>
	<p><strong>Ursache:</strong> Die Maschine wurde neu gestartet oder dem Relay ging der Speicher aus (OOM).</p>
	<p><strong>Lösung:</strong></p>
	<ol>
		<li>Ende des Protokolls prüfen: <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Prüfen, ob die Maschine neu gestartet wurde: <code>uptime</code> (eine sehr kurze Uptime bedeutet einen Neustart).
		</li>
		<li>Speicher prüfen: <code>free -h</code>.</li>
		<li>Das Relay erneut starten: <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Tipp">
		Um nostrfy automatisch beim Booten zu starten, als systemd-Service registrieren, mit dem Startbefehl des Relays als <code>ExecStart</code>.
	</Callout>

	<h3>systemd kann das Relay auf Port 80 nicht starten</h3>
	<p>
		Ein als root laufender systemd-Service kann Port 80 binden. Wenn <code>User=</code> auf einen regulären Benutzer gesetzt ist,
		entweder einen höheren Port (z. B. 8080) verwenden oder
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> zur Unit hinzufügen.
	</p>

	<h2 id="still-not-solved">Immer noch nicht gelöst?</h2>
	<ol>
		<li>
			<strong>Protokoll prüfen</strong>: <code>tail -100 nostrfy.log</code> — es nennt meist die direkte Ursache.
		</li>
		<li>
			<strong>Konfiguration erneut validieren</strong>: <code>nostrfy check</code> — zeigt Warnungen und Fehler.
		</li>
		<li>
			<strong>Reproduktionsdetails sammeln</strong>: was getan wurde, welcher Client, welcher exakte Fehler.
		</li>
		<li>
			<strong>Im Projekt-Repository fragen</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — beim Erstellen eines Issues Reproduktionsschritte und Protokoll beifügen.
		</li>
	</ol>
</div>
