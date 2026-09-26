<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # requis — active la fonctionnalité
storage = "local"                   # "local" ou "s3"
local_path = "./data/images"        # racine du stockage local
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # refuse les téléversements quand l’espace disque libre est insuffisant
restrict_uploads = false            # seules les clés de la liste d’autorisation peuvent téléverser

# Pour S3 / Cloudflare R2 :
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Infos du serveur
curl https://media.example.com/

# Téléversement (événement d’authentification depuis votre client Blossom, par ex. via nak ou l’assistant blossom de nostr-tools)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Récupération
curl https://media.example.com/<sha256>

# Listez vos propres téléversements (événement d’authentification avec t=list ; la clé du chemin doit être la vôtre)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Suppression (événement d’authentification avec t=delete et x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # autorisez une clé (npub1... ou hex)
nostrfy blossom deny npub1...           # révoquez une clé
nostrfy blossom list                    # affichez la liste et restrict_uploads`;
</script>

<DocsTitle
	title="Serveur de fichiers Blossom"
	description="Hébergement média sur son propre nom d’hôte : téléversements adressés par contenu, stockage local ou compatible S3, et authentification kind-24242 pour votre relais Nostr."
/>

<div class="doc-body">
	<h2>Aperçu</h2>
	<p>
		nostrfy peut agir comme serveur de blobs Blossom : les clients téléversent des fichiers adressés par leur hachage SHA-256, et
		le relais les ressert. Comme l’API REST, il vit sur un nom d’hôte dédié sur le même port.
	</p>

	<h2>Configuration</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Pointez <code>media.example.com</code> vers le même port dans votre proxy inverse, puis redémarrez. GET /
		sur cet hôte répond avec le document d’information du serveur Blossom. Avec <code>storage = "s3"</code>,
		le point de terminaison doit être en HTTPS sauf si l’hôte est loopback (p. ex. un MinIO local pour les tests).
	</p>

	<h2>Organisation du stockage</h2>
	<p>Les deux backends utilisent la hiérarchie <code>&lt;npub1...&gt;</code>, indexée par le SHA-256 du fichier :</p>
	<ul>
		<li>
			<strong>local</strong> — fichiers sous <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — objets <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> dans le bucket
			configuré
		</li>
	</ul>
	<p>
		Les octets des blobs ne touchent jamais la base de données du relais — LMDB ne contient que la correspondance sha256 → propriétaire et la
		liste d’autorisation de téléversement.
	</p>

	<h2>Points de terminaison</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Méthode</th>
				<th>Chemin</th>
				<th>Auth</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Informations du serveur Blossom</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Récupérer / sonder un blob (plages d’octets, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Téléverser un blob — 201 nouveau, 200 existe déjà</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Pré-vol BUD-06 — le téléversement serait-il accepté ?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Téléversement média BUD-05 (stocké tel quel)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Pré-vol BUD-05 — le téléversement serait-il accepté ?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Blobs téléversés par la clé publique demanderesse (curseur + limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Supprimer un blob (téléverseur uniquement)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Notes de sécurité</h2>
	<ul>
		<li>Les octets téléversés par les utilisateurs sont servis avec <code>X-Content-Type-Options: nosniff</code>.</li>
		<li>
			HTML/SVG/XML/JavaScript reçoivent en plus <code>Content-Disposition: attachment</code> et une
			CSP sandbox, de sorte que l’origine média ne peut pas servir au XSS stocké.
		</li>
		<li>
			Les jetons sont acceptés sous la forme base64url de la spécification (sans padding) et sous la forme standard avec padding
			(BUD-11).
		</li>
		<li>
			L’en-tête <code>X-SHA-256</code> est vérifié par rapport aux octets réels — une discordance renvoie 409.
		</li>
		<li>Les fichiers sont servis avec ETag, Cache-Control: immutable et le type de contenu stocké.</li>
		<li>Une clé publique bannie via NIP-86 <code>banpubkey</code> est refusée sur chaque point de terminaison.</li>
	</ul>

	<h2>Exemple</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Restreindre les téléversements</h2>
	<p>Définissez <code>restrict_uploads = true</code> dans la section <code>[blossom]</code> :</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		La liste d’autorisation vit dans la base de données du relais (LMDB), gérée avec des commandes dédiées — aucun redémarrage
		requis, le démon recharge automatiquement :
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Les téléversements des clés publiques non listées sont rejetés avec 403.</p>

	<h2>Sauvegardes et migration</h2>
	<p>
		Sauvegardez à la fois le stockage de blobs configuré et <code>database.path</code> pour préserver l’inventaire complet
		et l’état d’autorisation. La correspondance sha256 → propriétaire est persistée dans LMDB, donc les redémarrages sont
		instantanés et aucun index en mémoire ni balayage au démarrage n’est nécessaire — les recherches lisent la correspondance directement depuis
		la base de données. Une migration automatique unique reconstruit la correspondance à partir des blobs hérités au premier
		démarrage après une mise à niveau ; un marqueur ignore les redémarrages suivants.
	</p>
</div>
