<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. nostrfy-Relay stoppen (die Migration benötigt das Datenbankverzeichnis)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. Dry-Run — parst und verifiziert jedes Event, schreibt nichts
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. Import
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. Start — NIP-29-Gruppen und NIP-43-Rollen werden aus den importierten Events neu aufgebaut
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # benötigt für NIP-42/62/98 und NIP-29-Metadaten
private_key = "..."                       # benötigt für relay-signierte NIP-29/43-Metadaten

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Option A — nostrfy führt \`strfry export\` selbst aus (strfry im PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Option B — Sie haben in eine Datei exportiert
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Option C — Pipe (stdin ist die Standardeingabe)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # für nak (WebSocket)
H=https://relay.example.com    # für curl (HTTP)

nak relay "$R"                              # Relay antwortet und kündigt seine NIPs an
curl -s "$H/api/v1/query?limit=1"           # Events werden ausgeliefert
nak req -i <deleted-event-id> "$R"          # ein gelöschtes Event bleibt gelöscht
nak req -k 39000 "$R"                       # NIP-29-Gruppenmetadaten (falls migriert)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # NIP-43-Mitgliedschaft (AUTH)`;
</script>

<DocsTitle
	title="Migration von strfry"
	description="Events eines bestehenden strfry-Relays mit einem Befehl nach nostrfy umziehen — Vorbereitung, Dry-Run, Migration, Verifizierung und Rollback."
/>

<div class="doc-body">
	<h2>Überblick</h2>
	<p>
		<code>nostrfy migrate-strfry</code> liest das eigene Exportformat von
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		(JSONL, ein NIP-01-Event pro Zeile), funktioniert daher über strfry-Datenbankversionen hinweg und hängt nicht vom
		internen LMDB-Schema von strfry ab. Es schreibt niemals in die strfry-Datenbank.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Migriert</th>
					<th>Nicht migriert</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Jedes gespeicherte Event (Replaceable/Addressable-Semantik angewendet)</td>
					<td>strfry-Einstellungen ohne nostrfy-Entsprechung (der Merge-Bericht listet jede mit Grund)</td>
				</tr>
				<tr>
					<td>NIP-40-Ablauf — bereits abgelaufene Events werden übersprungen</td>
					<td>Blossom-Medien und Owner-Mappings (strfry hat keinen Blossom-Server)</td>
				</tr>
				<tr>
					<td>NIP-09-Löschungen, inkl. Re-Publish-Sperren für bereits von strfry gelöschte Events</td>
					<td>Zugriffslisten (NIP-86-Bans, Relay-Pubkey-Listen, Blossom-Allowlist)</td>
				</tr>
				<tr>
					<td>NIP-29 <code>9005</code>/<code>9008</code>-Moderationsnebeneffekte</td>
					<td>NIP-43-Einladungscodes (neue mit <code>createclaim</code> ausstellen)</td>
				</tr>
				<tr>
					<td>First-Seen-Zeitstempel (wenn das New-Pubkey-Gate konfiguriert ist)</td>
					<td>NIP-62-Vanish-Requests, außer mit <code>--apply-vanish</code></td>
				</tr>
				<tr>
					<td>NIP-29-Gruppen, NIP-43-Rollen und ihre Relay-signierten Metadaten, beim ersten Start neu aufgebaut</td>
					<td>Eigene Identität/Schlüssel des Relays (liegen in <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>Die äquivalenten strfry-Einstellungen, zum Merge in <code>nostrfy.toml</code> angeboten (optional)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Erwartete Skips in der Zusammenfassung: <strong>ephemere Events</strong> (Kinds 20000-29999, die nostrfy nie
		speichert) und <strong>bereits abgelaufene Events</strong>.
	</p>

	<h2>Schnellstart</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="Die Migration ist offline">
		Sie schreibt direkt in <code>database.path</code> und verweigert die Ausführung, solange ein nostrfy-Daemon (oder eine
		andere Migration) das Datenbankverzeichnis hält. <strong>Stoppen Sie zuerst das Relay.</strong> strfry selbst darf
		weiterlaufen — <code>strfry export</code> liest einen konsistenten Snapshot.
	</Callout>

	<h2>Voraussetzungen</h2>
	<ul>
		<li>
			Das <code>strfry</code>-Binary (für <code>--strfry-db</code>) oder eine selbst exportierte JSONL-Datei.
		</li>
		<li>nostrfy v0.1.15 oder neuer (das Unterkommando <code>migrate-strfry</code>).</li>
		<li>Die nostrfy-Konfiguration für das Ziel-Relay mit gesetztem <code>database.path</code>, <code>public_url</code> und <code>private_key</code>.</li>
		<li>
			Freier Plattenplatz: etwa Größe des strfry-Exports plus Indizes. Der NIP-50-Wortindex kommt
			hinzu; bei sehr knappem Platz deaktivieren (<code>database.search_index = false</code>),
			migrieren und später wieder aktivieren (der Index wird beim Start neu aufgebaut).
		</li>
		<li>Keine laufende nostrfy-Instanz auf dem Ziel-<code>database.path</code>.</li>
	</ul>

	<h2>Konfiguration vorbereiten</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Erzeugen Sie den Relay-Schlüssel mit <code>nostrfy genkey</code>, falls keiner vorhanden ist, dann validieren:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>strfry-Einstellungen zusammenführen (optional)</h3>
	<p>
		Vor dem Öffnen der Datenbank sucht <code>migrate-strfry</code> nach der strfry-Konfiguration
		(<code>--strfry-config</code>, dann <code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>,
		<code>./strfry.conf</code>), zeigt Einstellungen mit nostrfy-Entsprechung, die von Ihrer
		<code>nostrfy.toml</code> abweichen, und fragt, ob sie zusammengeführt werden sollen. Nur die gelisteten Schlüssel
		werden neu geschrieben — Kommentare und alle anderen Zeilen bleiben erhalten; ein Wert, der die Konfiguration ungültig
		machen würde, wird mit Grund übersprungen, der Rest wird trotzdem zusammengeführt.
	</p>
	<ul>
		<li><code>--merge-config</code> wendet ohne Nachfrage an (für Skripte); <code>--no-merge-config</code> überspringt den Schritt.</li>
		<li>Ohne Terminal werden Vorschläge gedruckt und der Merge übersprungen, außer <code>--merge-config</code> ist angegeben.</li>
		<li><code>--dry-run</code> zeigt Vorschläge, schreibt aber nie.</li>
	</ul>

	<h2>Dry-Run</h2>
	<p>Erst schauen, dann springen — ein Dry-Run parst und verifiziert den gesamten Export, ohne die Datenbank zu berühren:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		Eine <code>bad signature</code>-Zahl ungleich null bedeutet, dass der Export Events enthält, die strfry ohne
		Verifizierung akzeptiert hat; sie werden übersprungen. Wenn Sie ihnen vertrauen, mit <code>--no-verify</code> trotzdem importieren.
	</p>

	<h2>Migrieren</h2>
	<p>Einen von drei Eingabemodi wählen — alle liefern dasselbe Ergebnis:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Flag</th>
					<th>Warum</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry ist nicht im <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Fortsetzen/Aufholen: Events mit diesem <code>created_at</code> oder neuer (inklusive)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>NIP-62-Vanish-Requests aus dem Export beachten (standardmäßig aus)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Signaturprüfung für vertrauenswürdige Dumps überspringen (schneller)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Events pro DB-Transaktion (Standard 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Nur parsen und verifizieren</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		Die Migration ist <strong>sicher erneut ausführbar</strong>: Duplikate werden übersprungen und die Lösch-Nebeneffekte
		neu angewendet, sodass ein unterbrochener Lauf einfach wiederholt werden kann (oder mit <code>--since</code> fortgesetzt).
	</p>

	<h2>Starten und verifizieren</h2>
	<p>
		Der erste Start baut den NIP-29-Gruppenstore und den NIP-43-Rollenstore aus den importierten Events neu auf und
		republiziert die Relay-signierten Metadaten (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		pro Gruppe, die <code>13534</code>-Mitgliedsliste). Bei großer Datenbank kann das dauern; Log beachten.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		Für exakten Zahlenvergleich sollte <code>strfry scan '&#123;&#125;' | wc -l</code> minus die in der Migrationszusammenfassung
		gemeldeten ephemeren/abgelaufenen Events dem entsprechen, was Clients abrufen können.
	</p>

	<h2>Unterbrochene Migration fortsetzen</h2>
	<Callout type="warning" title="Relay vor erneutem Ausführen nicht starten">
		Die NIP-29-Gruppennebeneffekte (<code>9005</code>/<code>9008</code>) werden nach dem Import angewendet; ein
		unterbrochener Lauf hat diese Events gespeichert, aber ihre Löschungen noch nicht, sodass der erste Start Gruppenhistorie
		ausliefern könnte, die die Löschung entfernen sollte. Erst die Migration erneut ausführen — sie schließt die Nebeneffekte
		ab (der Purge ist idempotent) — dann das Relay starten.
	</Callout>
	<ul>
		<li>
			<strong>In Datei exportiert / gepiped:</strong> denselben Befehl erneut ausführen. Duplikate werden übersprungen und die
			Löschsperren neu angewendet.
		</li>
		<li>
			<strong><code>--strfry-db</code> verwendet:</strong> die Zusammenfassung druckt einen Resume-Hinweis; mit diesem
			<code>--since</code> erneut ausführen (inklusive, die Grenzsekunde wird reimportiert und dedupliziert).
		</li>
		<li>
			Bei Fehler <code>database writer unavailable</code> freien Platz und <code>database.map_size</code> prüfen, dann erneut ausführen.
		</li>
	</ul>

	<h2>Rollback</h2>
	<p>Die Migration schreibt nur in die nostrfy-Datenbank. Für Rollback Relay stoppen und die Pre-Migrations-Datenbank wiederherstellen oder entfernen:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # or restore the pre-migration backup'} lang="sh" />

	<h2>Fehlerbehebung</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Meldung</th>
					<th>Ursache / Fix</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>Ein nostrfy-Daemon (oder eine andere Migration) hält das Verzeichnis: zuerst <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> muss das Verzeichnis mit <code>data.mdb</code> benennen</td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>strfry installieren, <code>--strfry-bin</code> setzen oder <code>--input</code> nutzen</td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>Writer-Thread gestoppt oder Queue überlastet: Platte/Map-Größe prüfen, erneut ausführen (sicher)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>Der Purge wurde unterbrochen: Migration erneut ausführen</td>
				</tr>
				<tr>
					<td>Hohe <code>bad signature</code>-Zahl</td>
					<td>Die strfry-DB enthält unverifizierte Events: prüfen; nur bei vertrauenswürdiger Quelle mit <code>--no-verify</code> importieren</td>
				</tr>
				<tr>
					<td>NIP-29-Metadaten fehlen nach dem Start</td>
					<td>Kein <code>relay.private_key</code>: <code>nostrfy genkey</code> ausführen und neu starten</td>
				</tr>
				<tr>
					<td>Der Einstellungs-Merge wird nicht angeboten</td>
					<td>strfry-Konfiguration nicht gefunden: <code>--strfry-config /etc/strfry.conf</code> übergeben</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Checkliste</h2>
	<ul>
		<li>nostrfy-Relay gestoppt</li>
		<li>strfry-Datenbank und nostrfy-Konfiguration gesichert</li>
		<li><code>nostrfy check</code> besteht</li>
		<li>strfry-Einstellungen zusammengeführt (oder Bericht geprüft)</li>
		<li>Dry-Run geprüft (keine unerwarteten Bad Signatures)</li>
		<li>Migration fehlerfrei abgeschlossen</li>
		<li>Relay startet; Gruppen-/Rollen-Rebuild geloggt</li>
		<li>Event-Zahlen stimmen (minus ephemer/abgelaufen)</li>
		<li>Gelöschte Events bleiben weg (Re-Publish abgelehnt)</li>
		<li>Private-Gruppen-Sichtbarkeit anonym und als Mitglied geprüft</li>
		<li>Reverse-Proxy / DNS / Client-Relay-Listen aktualisiert</li>
	</ul>

	<Callout type="tip" title="Läuft strfry noch?">
		Falls strfry während des Exports live blieb, bei Wechselbereitschaft einen Catch-up-Lauf machen: nostrfy stoppen,
		Migration mit <code>--since &lt;last created_at&gt;</code> erneut ausführen, dann wieder starten.
	</Callout>
</div>
