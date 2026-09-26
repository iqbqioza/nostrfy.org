<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # 必須 — 機能を有効にします
storage = "local"                   # "local" または "s3"
local_path = "./data/images"        # ローカルストレージのルートです
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # 空き容量がこれを下回るとアップロードを拒否します
restrict_uploads = false            # 許可リストに登録された公開鍵のみアップロードできます

# S3 / Cloudflare R2 の場合：
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# サーバー情報
curl https://media.example.com/

# アップロード（Blossom クライアントからの認証イベント。例：nak や nostr-tools の blossom ヘルパー）
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# 取得
curl https://media.example.com/<sha256>

# 自分のアップロード一覧（t=list の認証イベント。パスの公開鍵は自分のものである必要があります）
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# 削除（t=delete かつ x=<sha256> の認証イベントです）
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # 公開鍵を許可します（npub1... または hex）
nostrfy blossom deny npub1...           # 公開鍵を取り消します
nostrfy blossom list                    # リストと restrict_uploads を表示します`;
</script>

<DocsTitle
	title="Blossom ファイルサーバー"
	description="独自ホスト名でのメディアホスティング:コンテンツアドレス指定のアップロード、ローカルまたはS3互換ストレージ、Nostrリレー向けのkind-24242認証。"
/>

<div class="doc-body">
	<h2>概要</h2>
	<p>
		nostrfy は Blossom の Blob サーバーとして動作できます。クライアントはSHA-256ハッシュでアドレス指定されたファイルをアップロードし、リレーがそれを配信します。REST
		APIと同様に、同じポート上の専用ホスト名で動作します。
	</p>

	<h2>設定</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		リバースプロキシで <code>media.example.com</code> を同じポートに向けてから再起動してください。そのホストへの GET
		/ は Blossom サーバー情報ドキュメントを返します。<code>storage = "s3"</code>
		の場合、ホストがループバック(例:テスト用のローカル MinIO)でない限り、エンドポイントは HTTPS である必要があります。
	</p>

	<h2>ストレージ構成</h2>
	<p>どちらのバックエンドも、ファイルの SHA-256 をキーとする <code>&lt;npub1...&gt;</code> 階層を使用します:</p>
	<ul>
		<li>
			<strong>local</strong> — <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code> 配下のファイル
		</li>
		<li>
			<strong>s3 / R2</strong> — 設定済みバケット内のオブジェクト <code>&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
	</ul>
	<p>
		Blob のバイト列がリレーデータベースに格納されることはありません — LMDB には sha256→所有者のマッピングとアップロード許可リストのみが保持されます。
	</p>

	<h2>エンドポイント</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>メソッド</th>
				<th>パス</th>
				<th>認証</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Blossom サーバー情報</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Blob の取得／確認(バイトレンジ、206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Blob のアップロード — 201 は新規、200 は既存</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>BUD-06 プリフライト — アップロードが受け入れられるか確認</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 メディアアップロード(そのまま保存)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>BUD-05 プリフライト — アップロードが受け入れられるか確認</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>要求した公開鍵がアップロードした Blob 一覧(カーソル＋limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Blob の削除(アップロード者のみ)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>セキュリティ上の注意</h2>
	<ul>
		<li>ユーザーがアップロードしたバイト列は <code>X-Content-Type-Options: nosniff</code> 付きで配信されます。</li>
		<li>
			HTML/SVG/XML/JavaScriptには追加で <code>Content-Disposition: attachment</code> とサンドボックスCSPが付与されるため、メディアオリジンを保存型XSSに悪用できません。
		</li>
		<li>
			トークンは仕様のbase64url(パディングなし)形式と、パディング付きの標準形式(BUD-11)の両方が受け入れられます。
		</li>
		<li>
			<code>X-SHA-256</code> ヘッダーは実際のバイト列と照合されます — 不一致の場合は 409 が返ります。
		</li>
		<li>ファイルはETag、Cache-Control: immutable、および保存時のコンテンツタイプ付きで配信されます。</li>
		<li>NIP-86 の <code>banpubkey</code> で禁止された公開鍵は、すべてのエンドポイントで拒否されます。</li>
	</ul>

	<h2>例</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>アップロードの制限</h2>
	<p><code>[blossom]</code> セクションで <code>restrict_uploads = true</code> を設定します:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		許可リストはリレーデータベース(LMDB)に格納され、専用コマンドで管理します — 再起動は不要で、デーモンが自動的に再読み込みします:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>リストにない公開鍵からのアップロードは403で拒否されます。</p>

	<h2>バックアップと移行</h2>
	<p>
		完全なインベントリと認可状態を保持するため、設定済みの Blob ストレージと <code>database.path</code>
		の両方をバックアップしてください。sha256→所有者のマッピングは LMDB に保存されるため、再起動は即時で、インメモリインデックスや起動時スキャンは不要です
		— 参照はデータベースから直接マッピングを読み取ります。アップグレード後の初回起動時に、レガシーBlobからマッピングを再構築する自動のワンタイム移行が実行されます。以降の再起動ではマーカーによりスキップされます。
	</p>
</div>
