<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # required — enables the feature
storage = "local"                   # "local" or "s3"
local_path = "./data/images"        # local storage root
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # refuse uploads when the disk has less free space
restrict_uploads = false            # only allow-listed pubkeys may upload

# For S3 / Cloudflare R2:
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Server info
curl https://media.example.com/

# Upload (auth event from your Blossom client, e.g. via nak or the nostr-tools blossom helper)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Fetch
curl https://media.example.com/<sha256>

# List your own uploads (auth event with t=list; the path pubkey must be yours)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Delete (auth event with t=delete and x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # allow a pubkey (npub1... or hex)
nostrfy blossom deny npub1...           # revoke a pubkey
nostrfy blossom list                    # show the list and restrict_uploads`;
</script>

<DocsTitle
	title="Blossom file server"
	description="Media hosting on its own hostname: content-addressed uploads, local or S3 storage, signed by kind-24242 auth."
/>

<div class="doc-body">
	<h2>Overview</h2>
	<p>
		nostrfy can act as a Blossom blob server: clients upload files addressed by their SHA-256 hash, and
		the relay serves them back. Like the REST API, it lives on a dedicated hostname on the same port.
	</p>

	<h2>Configuration</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Point <code>media.example.com</code> at the same port in your reverse proxy, then restart. GET /
		on that host answers with the Blossom server info document. With <code>storage = "s3"</code> the
		endpoint must be HTTPS unless the host is loopback (e.g. a local MinIO for testing).
	</p>

	<h2>Storage layout</h2>
	<p>Both backends use the <code>&lt;npub1...&gt;</code> hierarchy, keyed by the file's SHA-256:</p>
	<ul>
		<li>
			<strong>local</strong> — files under <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — objects <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> in the configured
			bucket
		</li>
	</ul>
	<p>
		Blob bytes never touch the relay database — LMDB holds only the sha256 → owner mapping and the upload
		allowlist.
	</p>

	<h2>Endpoints</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Method</th>
				<th>Path</th>
				<th>Auth</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Blossom server info</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Fetch / probe a blob (byte ranges, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Upload a blob — 201 new, 200 already exists</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>BUD-06 pre-flight — would the upload be accepted?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 media upload (stored verbatim)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 pre-flight — would the upload be accepted?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Blobs uploaded by the requesting pubkey (cursor + limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Delete a blob (uploader only)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Security notes</h2>
	<ul>
		<li>User-uploaded bytes are served with <code>X-Content-Type-Options: nosniff</code>.</li>
		<li>
			HTML/SVG/XML/JavaScript additionally get <code>Content-Disposition: attachment</code> and a
			sandbox CSP, so the media origin cannot be used for stored XSS.
		</li>
		<li>
			Tokens are accepted in the spec's base64url (no padding) form and in the padded standard form
			(BUD-11).
		</li>
		<li>
			The <code>X-SHA-256</code> header is verified against the actual bytes — a mismatch returns 409.
		</li>
		<li>Files are served with ETag, Cache-Control: immutable and the stored content type.</li>
		<li>A pubkey banned with NIP-86 <code>banpubkey</code> is refused on every endpoint.</li>
	</ul>

	<h2>Example</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Restricting uploads</h2>
	<p>Set <code>restrict_uploads = true</code> in the <code>[blossom]</code> section:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		The allowlist lives in the relay database (LMDB), managed with dedicated commands — no restart
		needed, the daemon reloads automatically:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Uploads from unlisted pubkeys are rejected with 403.</p>

	<h2>Backups and migration</h2>
	<p>
		Back up both the configured blob storage and <code>database.path</code> to preserve the complete
		inventory and authorization state. The sha256 → owner mapping is persisted in LMDB, so restarts are
		instant and no in-memory index or startup scan is needed — lookups read the mapping directly from
		the database. An automatic one-time migration rebuilds the mapping from legacy blobs on the first
		start after an upgrade; a marker skips later restarts.
	</p>
</div>