<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # obligatorio — activa la función
storage = "local"                   # "local" o "s3"
local_path = "./data/images"        # raíz del almacenamiento local
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # rechaza subidas cuando al disco le queda menos espacio libre
restrict_uploads = false            # solo las pubkeys de la lista de permitidos pueden subir

# Para S3 / Cloudflare R2:
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Información del servidor
curl https://media.example.com/

# Subida (evento de auth de tu cliente Blossom, p. ej. con nak o el helper blossom de nostr-tools)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Obtener
curl https://media.example.com/<sha256>

# Lista tus propias subidas (evento de auth con t=list; la pubkey de la ruta debe ser la tuya)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Eliminar (evento de auth con t=delete y x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # permite una pubkey (npub1... o hex)
nostrfy blossom deny npub1...           # revoca una pubkey
nostrfy blossom list                    # muestra la lista y restrict_uploads`;
</script>

<DocsTitle
	title="Servidor de archivos Blossom"
	description="Alojamiento multimedia en su propio nombre de host: subidas direccionadas por contenido, almacenamiento local o compatible con S3, y autenticación kind-24242 para tu relé Nostr."
/>

<div class="doc-body">
	<h2>Resumen</h2>
	<p>
		nostrfy puede actuar como servidor de blobs Blossom: los clientes suben archivos direccionados por su hash SHA-256, y
		el relé los sirve de vuelta. Como la API REST, vive en un nombre de host dedicado en el mismo puerto.
	</p>

	<h2>Configuración</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Apunta <code>media.example.com</code> al mismo puerto en tu proxy inverso y reinicia. GET /
		en ese host responde con el documento de información del servidor Blossom. Con <code>storage = "s3"</code> el
		endpoint debe ser HTTPS a menos que el host sea loopback (p. ej. un MinIO local para pruebas).
	</p>

	<h2>Diseño del almacenamiento</h2>
	<p>Ambos backends usan la jerarquía <code>&lt;npub1...&gt;</code>, indexada por el SHA-256 del archivo:</p>
	<ul>
		<li>
			<strong>local</strong> — archivos bajo <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — objetos <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> en el bucket
			configurado
		</li>
	</ul>
	<p>
		Los bytes de los blobs nunca tocan la base de datos del relé — LMDB solo guarda el mapeo sha256 → propietario y la
		lista de permitidos de subida.
	</p>

	<h2>Endpoints</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Método</th>
				<th>Ruta</th>
				<th>Auth</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Información del servidor Blossom</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Obtener / sondear un blob (rangos de bytes, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Subir un blob — 201 nuevo, 200 ya existe</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Pre-vuelo BUD-06 — ¿se aceptaría la subida?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Subida multimedia BUD-05 (almacenada tal cual)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Pre-vuelo BUD-05 — ¿se aceptaría la subida?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Blobs subidos por la pubkey solicitante (cursor + limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Eliminar un blob (solo el que lo subió)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Notas de seguridad</h2>
	<ul>
		<li>Los bytes subidos por usuarios se sirven con <code>X-Content-Type-Options: nosniff</code>.</li>
		<li>
			HTML/SVG/XML/JavaScript reciben además <code>Content-Disposition: attachment</code> y un
			CSP sandbox, para que el origen multimedia no pueda usarse para XSS almacenado.
		</li>
		<li>
			Los tokens se aceptan tanto en la forma base64url de la especificación (sin relleno) como en la forma estándar con relleno
			(BUD-11).
		</li>
		<li>
			La cabecera <code>X-SHA-256</code> se verifica contra los bytes reales — una discrepancia devuelve 409.
		</li>
		<li>Los archivos se sirven con ETag, Cache-Control: immutable y el tipo de contenido almacenado.</li>
		<li>Una pubkey vetada con NIP-86 <code>banpubkey</code> es rechazada en cada endpoint.</li>
	</ul>

	<h2>Ejemplo</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Restringir subidas</h2>
	<p>Establece <code>restrict_uploads = true</code> en la sección <code>[blossom]</code>:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		La lista de permitidos vive en la base de datos del relé (LMDB), gestionada con comandos dedicados — sin reinicio
		necesario, el demonio recarga automáticamente:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Las subidas de pubkeys no listadas se rechazan con 403.</p>

	<h2>Copias de seguridad y migración</h2>
	<p>
		Respalda tanto el almacenamiento de blobs configurado como <code>database.path</code> para preservar el inventario completo
		y el estado de autorización. El mapeo sha256 → propietario persiste en LMDB, así que los reinicios son
		instantáneos y no se necesita índice en memoria ni escaneo de inicio — las búsquedas leen el mapeo directamente de
		la base de datos. Una migración automática única reconstruye el mapeo desde los blobs heredados en el primer
		arranque tras una actualización; un marcador omite reinicios posteriores.
	</p>
</div>
