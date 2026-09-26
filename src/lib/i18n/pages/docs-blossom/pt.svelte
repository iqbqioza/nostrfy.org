<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # obrigatório — ativa o recurso
storage = "local"                   # "local" ou "s3"
local_path = "./data/images"        # raiz do armazenamento local
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # recusar uploads quando o disco tiver menos espaço livre
restrict_uploads = false            # só pubkeys na allowlist podem enviar

# Para S3 / Cloudflare R2:
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Informações do servidor
curl https://media.example.com/

# Upload (evento de auth do seu cliente Blossom, ex. via nak ou o helper blossom do nostr-tools)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Baixar
curl https://media.example.com/<sha256>

# Listar seus próprios uploads (evento de auth com t=list; a pubkey do caminho precisa ser a sua)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Excluir (evento de auth com t=delete e x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # permitir uma pubkey (npub1... ou hex)
nostrfy blossom deny npub1...           # remover uma pubkey
nostrfy blossom list                    # mostrar a lista e o restrict_uploads`;
</script>

<DocsTitle
	title="Servidor de arquivos Blossom"
	description="Hospedagem de mídia no seu próprio hostname: uploads endereçados por conteúdo, armazenamento local ou compatível com S3 e autenticação kind-24242 para o seu relay Nostr."
/>

<div class="doc-body">
	<h2>Visão geral</h2>
	<p>
		O nostrfy pode atuar como servidor de blobs Blossom: os clientes enviam arquivos endereçados pelo hash SHA-256, e
		o relay os serve de volta. Como a API REST, ele fica em um hostname dedicado na mesma porta.
	</p>

	<h2>Configuração</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Aponte <code>media.example.com</code> para a mesma porta no seu proxy reverso e reinicie. Um GET /
		nesse host responde com o documento de informações do servidor Blossom. Com <code>storage = "s3"</code> o
		endpoint precisa ser HTTPS, a menos que o host seja loopback (por ex. um MinIO local para testes).
	</p>

	<h2>Esquema de armazenamento</h2>
	<p>Ambos os backends usam a hierarquia <code>&lt;npub1...&gt;</code>, indexada pelo SHA-256 do arquivo:</p>
	<ul>
		<li>
			<strong>local</strong> — arquivos em <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — objetos <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> no bucket
			configurado
		</li>
	</ul>
	<p>
		Os bytes dos blobs nunca passam pelo banco de dados do relay — o LMDB guarda apenas o mapeamento sha256 → dono e a
		allowlist de upload.
	</p>

	<h2>Endpoints</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Método</th>
				<th>Caminho</th>
				<th>Auth</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Informação do servidor Blossom</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Buscar / sondar um blob (faixas de bytes, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Enviar um blob — 201 novo, 200 se já existe</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Pré-verificação BUD-06 — o upload seria aceito?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Upload de mídia BUD-05 (armazenado como recebido)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Pré-verificação BUD-05 — o upload seria aceito?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Blobs enviados pela pubkey solicitante (cursor + limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Excluir um blob (só quem enviou)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Notas de segurança</h2>
	<ul>
		<li>Os bytes enviados pelos usuários são servidos com <code>X-Content-Type-Options: nosniff</code>.</li>
		<li>
			HTML/SVG/XML/JavaScript recebem ainda <code>Content-Disposition: attachment</code> e uma
			CSP de sandbox, então a origem de mídia não pode ser usada para XSS armazenado.
		</li>
		<li>
			Os tokens são aceitos tanto na forma base64url da especificação (sem preenchimento) quanto na forma padrão com preenchimento
			(BUD-11).
		</li>
		<li>
			O cabeçalho <code>X-SHA-256</code> é comparado aos bytes reais — uma divergência retorna 409.
		</li>
		<li>Os arquivos são servidos com ETag, Cache-Control: immutable e o tipo de conteúdo armazenado.</li>
		<li>Uma pubkey banida com NIP-86 <code>banpubkey</code> é recusada em todos os endpoints.</li>
	</ul>

	<h2>Exemplo</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Restringir uploads</h2>
	<p>Defina <code>restrict_uploads = true</code> na seção <code>[blossom]</code>:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		A allowlist fica no banco de dados do relay (LMDB) e é gerenciada com comandos dedicados — sem precisar reiniciar,
		o daemon recarrega automaticamente:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Uploads de pubkeys fora da lista são recusados com 403.</p>

	<h2>Backups e migração</h2>
	<p>
		Faça backup do armazenamento de blobs configurado e de <code>database.path</code> para preservar o inventário completo
		e o estado de autorização. O mapeamento sha256 → dono é persistido em LMDB, então as reinicializações são
		instantâneas e não é preciso índice em memória nem varredura na inicialização — as buscas leem o mapeamento direto do
		banco de dados. Uma migração automática única reconstrói o mapeamento a partir dos blobs antigos na primeira
		inicialização após uma atualização; um marcador evita repetições nas reinicializações seguintes.
	</p>
</div>
