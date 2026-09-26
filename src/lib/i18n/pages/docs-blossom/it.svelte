<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # obbligatorio — abilita la funzione
storage = "local"                   # "local" o "s3"
local_path = "./data/images"        # radice dello storage locale
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # rifiuta gli upload quando il disco ha poco spazio libero
restrict_uploads = false            # solo le pubkey nella allowlist possono caricare

# Per S3 / Cloudflare R2:
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Info sul server
curl https://media.example.com/

# Upload (evento di autenticazione dal tuo client Blossom, ad es. tramite nak o l'helper blossom di nostr-tools)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Recupero
curl https://media.example.com/<sha256>

# Elenca i tuoi upload (evento di autenticazione con t=list; la pubkey nel percorso deve essere la tua)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Elimina (evento di autenticazione con t=delete e x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # autorizza una pubkey (npub1... o hex)
nostrfy blossom deny npub1...           # revoca una pubkey
nostrfy blossom list                    # mostra la lista e restrict_uploads`;
</script>

<DocsTitle
	title="File server Blossom"
	description="Hosting multimediale sul proprio hostname: upload indirizzati per contenuto, storage locale o compatibile S3 e autenticazione kind-24242 per il tuo relay Nostr."
/>

<div class="doc-body">
	<h2>Panoramica</h2>
	<p>
		nostrfy può fungere da server blob Blossom: i client caricano file indirizzati tramite il loro hash SHA-256, e
		il relay li restituisce. Come l’API REST, vive su un hostname dedicato sulla stessa porta.
	</p>

	<h2>Configurazione</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Indirizza <code>media.example.com</code> alla stessa porta nel tuo reverse proxy, poi riavvia. GET /
		su quell’host risponde con il documento informativo del server Blossom. Con <code>storage = "s3"</code>
		l’endpoint deve essere HTTPS a meno che l’host sia loopback (p. es. un MinIO locale per i test).
	</p>

	<h2>Layout dello storage</h2>
	<p>Entrambi i backend usano la gerarchia <code>&lt;npub1...&gt;</code>, indicizzata dallo SHA-256 del file:</p>
	<ul>
		<li>
			<strong>local</strong> — file sotto <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — oggetti <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> nel bucket
			configurato
		</li>
	</ul>
	<p>
		I byte dei blob non toccano mai il database del relay — LMDB contiene solo la mappatura sha256 → proprietario e la
		allowlist degli upload.
	</p>

	<h2>Endpoint</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Metodo</th>
				<th>Percorso</th>
				<th>Auth</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Informazioni sul server Blossom</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Recupero / verifica di un blob (intervalli di byte, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Caricamento di un blob — 201 nuovo, 200 già esistente</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Controllo preliminare BUD-06 — l’upload verrebbe accettato?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Upload multimediale BUD-05 (memorizzato così com’è)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Controllo preliminare BUD-05 — l’upload verrebbe accettato?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Blob caricati dalla pubkey richiedente (cursore + limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Eliminazione di un blob (solo chi l’ha caricato)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Note di sicurezza</h2>
	<ul>
		<li>I byte caricati dagli utenti sono serviti con <code>X-Content-Type-Options: nosniff</code>.</li>
		<li>
			HTML/SVG/XML/JavaScript ricevono inoltre <code>Content-Disposition: attachment</code> e una
			CSP sandbox, così l’origine multimediale non può essere usata per XSS persistente.
		</li>
		<li>
			I token sono accettati sia nella forma base64url della specifica (senza padding) sia nella forma standard con padding
			(BUD-11).
		</li>
		<li>
			L’header <code>X-SHA-256</code> è verificato rispetto ai byte reali — una mancata corrispondenza restituisce 409.
		</li>
		<li>I file sono serviti con ETag, Cache-Control: immutable e il content type memorizzato.</li>
		<li>Una pubkey bannata con NIP-86 <code>banpubkey</code> è rifiutata su ogni endpoint.</li>
	</ul>

	<h2>Esempio</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Limitare gli upload</h2>
	<p>Imposta <code>restrict_uploads = true</code> nella sezione <code>[blossom]</code>:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		La allowlist vive nel database del relay (LMDB), gestita con comandi dedicati — nessun riavvio
		necessario, il demone ricarica automaticamente:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Gli upload da pubkey non in lista sono rifiutati con 403.</p>

	<h2>Backup e migrazione</h2>
	<p>
		Esegui il backup sia dello storage blob configurato sia di <code>database.path</code> per preservare l’inventario completo
		e lo stato di autorizzazione. La mappatura sha256 → proprietario è persistita in LMDB, quindi i riavvii sono
		istantanei e non servono indici in memoria né scansioni all’avvio — le ricerche leggono la mappatura direttamente dal
		database. Una migrazione automatica una tantum ricostruisce la mappatura dai blob legacy al primo
		avvio dopo un aggiornamento; un marcatore salta i riavvii successivi.
	</p>
</div>
