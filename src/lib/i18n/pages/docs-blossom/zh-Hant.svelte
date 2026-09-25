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
	title="Blossom 檔案伺服器"
	description="執行於獨立主機名稱上的媒體託管：內容定址上傳、本機或 S3 相容儲存，以及 kind-24242 認證。"
/>

<div class="doc-body">
	<h2>概觀</h2>
	<p>
		nostrfy 可以作為 Blossom blob 伺服器：用戶端上傳以其 SHA-256 雜湊定址的檔案，
		中繼將它們提供回去。與 REST API 一樣，它執行在同一連接埠上的專用主機名稱。
	</p>

	<h2>設定</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		在反向代理中將 <code>media.example.com</code> 指向同一連接埠，然後重新啟動。該主機上的
		GET / 會傳回 Blossom 伺服器資訊文件。使用 <code>storage = "s3"</code> 時，
		端點必須是 HTTPS，除非主機是回環位址（例如用於測試的本機 MinIO）。
	</p>

	<h2>儲存配置</h2>
	<p>兩種後端都使用 <code>&lt;npub1...&gt;</code> 階層，以檔案的 SHA-256 為鍵：</p>
	<ul>
		<li>
			<strong>local</strong> — 檔案位於 <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — 設定的儲存桶中的物件 <code>&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
	</ul>
	<p>
		Blob 位元組從不進入中繼資料庫 — LMDB 只保存 sha256 → 擁有者對應與上傳
		允許清單。
	</p>

	<h2>端點</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方法</th>
				<th>路徑</th>
				<th>認證</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Blossom 伺服器資訊</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>取得 / 探測 blob（位元組範圍，206）</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>上傳 blob — 201 新建，200 已存在</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>BUD-06 預檢 — 上傳會被接受嗎？</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 媒體上傳（原樣儲存）</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 預檢 — 上傳會被接受嗎？</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>由請求公鑰上傳的 blob（游標 + limit）</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>刪除 blob（僅上傳者）</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>安全說明</h2>
	<ul>
		<li>使用者上傳的位元組以 <code>X-Content-Type-Options: nosniff</code> 提供。</li>
		<li>
			HTML/SVG/XML/JavaScript 還會附加 <code>Content-Disposition: attachment</code> 與
			沙箱 CSP，因此媒體來源不能用於儲存型 XSS。
		</li>
		<li>
			權杖接受規範中的 base64url（無填充）形式與帶填充的標準形式
			（BUD-11）。
		</li>
		<li>
			<code>X-SHA-256</code> 標頭會與實際位元組驗證 — 不符時傳回 409。
		</li>
		<li>檔案以 ETag、Cache-Control: immutable 與儲存的內容類型提供。</li>
		<li>被 NIP-86 <code>banpubkey</code> 封鎖的公鑰在每個端點上都會被拒絕。</li>
	</ul>

	<h2>範例</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>限制上傳</h2>
	<p>在 <code>[blossom]</code> 區段中設定 <code>restrict_uploads = true</code>：</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		允許清單儲存在中繼資料庫（LMDB）中，用專用指令管理 — 無需重新啟動，
		常駐程式會自動重載：
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>未列入允許清單的公鑰上傳會被 403 拒絕。</p>

	<h2>備份與遷移</h2>
	<p>
		備份設定的 blob 儲存與 <code>database.path</code>，以保留完整的
		清單與授權狀態。sha256 → 擁有者對應持久化在 LMDB 中，因此重新啟動是
		瞬時的，無需記憶體索引或啟動掃描 — 查找直接從資料庫讀取對應。升級後的首次啟動會
		自動執行一次性遷移，從舊 blob 重建對應；標記會跳過後續重新啟動。
	</p>
</div>
