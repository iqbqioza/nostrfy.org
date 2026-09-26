<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # erforderlich — aktiviert die Funktion
storage = "local"                   # "local" oder "s3"
local_path = "./data/images"        # lokales Speicherverzeichnis
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # Uploads ablehnen, wenn weniger freier Speicherplatz vorhanden ist
restrict_uploads = false            # nur Allowlist-Pubkeys dürfen hochladen

# Für S3 / Cloudflare R2:
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Serverinfo
curl https://media.example.com/

# Upload (Auth-Event Ihres Blossom-Clients, z. B. via nak oder dem nostr-tools-Blossom-Helper)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Abrufen
curl https://media.example.com/<sha256>

# Eigene Uploads auflisten (Auth-Event mit t=list; der Pubkey im Pfad muss Ihrer sein)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Löschen (Auth-Event mit t=delete und x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # Pubkey freigeben (npub1... oder hex)
nostrfy blossom deny npub1...           # Pubkey entziehen
nostrfy blossom list                    # Liste und restrict_uploads anzeigen`;
</script>

<DocsTitle
	title="Blossom-Dateiserver"
	description="Medienhosting auf eigenem Hostnamen: inhaltsadressierte Uploads, lokaler oder S3-kompatibler Speicher und Kind-24242-Auth für Ihr Nostr-Relay."
/>

<div class="doc-body">
	<h2>Überblick</h2>
	<p>
		nostrfy kann als Blossom-Blob-Server agieren: Clients laden Dateien hoch, die über ihren SHA-256-Hash adressiert werden, und
		das Relay liefert sie wieder aus. Wie die REST-API lebt er auf einem eigenen Hostnamen auf demselben Port.
	</p>

	<h2>Konfiguration</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Leiten Sie <code>media.example.com</code> in Ihrem Reverse-Proxy auf denselben Port und starten Sie neu. GET /
		auf diesem Host antwortet mit dem Blossom-Serverinfodokument. Mit <code>storage = "s3"</code> muss der
		Endpunkt HTTPS sein, es sei denn, der Host ist Loopback (z. B. ein lokales MinIO zum Testen).
	</p>

	<h2>Speicherlayout</h2>
	<p>Beide Backends verwenden die <code>&lt;npub1...&gt;</code>-Hierarchie mit der SHA-256 der Datei als Schlüssel:</p>
	<ul>
		<li>
			<strong>local</strong> — Dateien unter <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — Objekte <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> im konfigurierten
			Bucket
		</li>
	</ul>
	<p>
		Blob-Bytes berühren nie die Relay-Datenbank — LMDB hält nur das sha256→Owner-Mapping und die Upload-
		Allowlist.
	</p>

	<h2>Endpunkte</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Methode</th>
				<th>Pfad</th>
				<th>Auth</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Blossom-Serverinfo</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Blob abrufen / prüfen (Byte-Ranges, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Blob hochladen — 201 neu, 200 existiert bereits</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>BUD-06-Pre-Flight — würde der Upload akzeptiert?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05-Medienupload (unverändert gespeichert)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05-Pre-Flight — würde der Upload akzeptiert?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Vom anfragenden Pubkey hochgeladene Blobs (Cursor + Limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Blob löschen (nur Uploader)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Sicherheitshinweise</h2>
	<ul>
		<li>Vom Nutzer hochgeladene Bytes werden mit <code>X-Content-Type-Options: nosniff</code> ausgeliefert.</li>
		<li>
			HTML/SVG/XML/JavaScript erhalten zusätzlich <code>Content-Disposition: attachment</code> und ein
			Sandbox-CSP, sodass der Medien-Origin nicht für gespeichertes XSS genutzt werden kann.
		</li>
		<li>
			Token werden sowohl in der Base64url-Form der Spezifikation (ohne Padding) als auch in der gepaddeten Standardform
			akzeptiert (BUD-11).
		</li>
		<li>
			Der <code>X-SHA-256</code>-Header wird gegen die tatsächlichen Bytes geprüft — bei Abweichung folgt 409.
		</li>
		<li>Dateien werden mit ETag, Cache-Control: immutable und dem gespeicherten Inhaltstyp ausgeliefert.</li>
		<li>Ein per NIP-86 <code>banpubkey</code> gebannter Pubkey wird auf jedem Endpunkt abgewiesen.</li>
	</ul>

	<h2>Beispiel</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Uploads einschränken</h2>
	<p>Setzen Sie <code>restrict_uploads = true</code> im Abschnitt <code>[blossom]</code>:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		Die Allowlist liegt in der Relay-Datenbank (LMDB) und wird mit eigenen Befehlen verwaltet — kein Neustart
		nötig, der Daemon lädt automatisch neu:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Uploads von nicht gelisteten Pubkeys werden mit 403 abgelehnt.</p>

	<h2>Backups und Migration</h2>
	<p>
		Sichere sowohl den konfigurierten Blob-Speicher als auch <code>database.path</code>, um das vollständige
		Inventar und den Autorisierungszustand zu erhalten. Das sha256→Owner-Mapping liegt persistent in LMDB, daher sind
		Neustarts sofort und kein In-Memory-Index oder Startscan nötig — Lookups lesen das Mapping direkt aus
		der Datenbank. Eine automatische einmalige Migration baut das Mapping aus Legacy-Blobs beim ersten
		Start nach einem Upgrade neu auf; ein Marker überspringt spätere Neustarts.
	</p>
</div>
