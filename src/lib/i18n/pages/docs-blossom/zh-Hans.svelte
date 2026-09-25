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
	title="Blossom 文件服务器"
	description="运行在独立主机名上的媒体托管：内容寻址上传、本地或 S3 兼容存储，以及 kind-24242 认证。"
/>

<div class="doc-body">
	<h2>概览</h2>
	<p>
		nostrfy 可以作为 Blossom blob 服务器：客户端上传以其 SHA-256 哈希寻址的文件，
		中继将它们提供回去。与 REST API 一样，它运行在同一端口上的专用主机名。
	</p>

	<h2>配置</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		在反向代理中将 <code>media.example.com</code> 指向同一端口，然后重启。该主机上的
		GET / 会返回 Blossom 服务器信息文档。使用 <code>storage = "s3"</code> 时，
		端点必须是 HTTPS，除非主机是回环地址（例如用于测试的本地 MinIO）。
	</p>

	<h2>存储布局</h2>
	<p>两种后端都使用 <code>&lt;npub1...&gt;</code> 层级，以文件的 SHA-256 为键：</p>
	<ul>
		<li>
			<strong>local</strong> — 文件位于 <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — 配置的存储桶中的对象 <code>&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
	</ul>
	<p>
		Blob 字节从不进入中继数据库 — LMDB 只保存 sha256 → 所有者映射和上传
		白名单。
	</p>

	<h2>端点</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方法</th>
				<th>路径</th>
				<th>认证</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Blossom 服务器信息</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>获取 / 探测 blob（字节范围，206）</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>上传 blob — 201 新建，200 已存在</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>BUD-06 预检 — 上传会被接受吗？</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 媒体上传（原样存储）</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 预检 — 上传会被接受吗？</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>由请求公钥上传的 blob（游标 + limit）</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>删除 blob（仅上传者）</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>安全说明</h2>
	<ul>
		<li>用户上传的字节以 <code>X-Content-Type-Options: nosniff</code> 提供。</li>
		<li>
			HTML/SVG/XML/JavaScript 还会附加 <code>Content-Disposition: attachment</code> 和
			沙箱 CSP，因此媒体源不能用于存储型 XSS。
		</li>
		<li>
			令牌接受规范中的 base64url（无填充）形式和带填充的标准形式
			（BUD-11）。
		</li>
		<li>
			<code>X-SHA-256</code> 头会与实际字节校验 — 不匹配返回 409。
		</li>
		<li>文件以 ETag、Cache-Control: immutable 和存储的内容类型提供。</li>
		<li>被 NIP-86 <code>banpubkey</code> 封禁的公钥在每个端点上都会被拒绝。</li>
	</ul>

	<h2>示例</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>限制上传</h2>
	<p>在 <code>[blossom]</code> 段中设置 <code>restrict_uploads = true</code>：</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		白名单存储在中继数据库（LMDB）中，用专用命令管理 — 无需重启，
		守护进程会自动重载：
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>未列入白名单的公钥上传会被 403 拒绝。</p>

	<h2>备份与迁移</h2>
	<p>
		备份配置的 blob 存储和 <code>database.path</code>，以保留完整的
		清单和授权状态。sha256 → 所有者映射持久化在 LMDB 中，因此重启是
		瞬时的，无需内存索引或启动扫描 — 查找直接从数据库读取映射。升级后的首次启动会
		自动执行一次性迁移，从旧 blob 重建映射；标记会跳过后续重启。
	</p>
</div>
