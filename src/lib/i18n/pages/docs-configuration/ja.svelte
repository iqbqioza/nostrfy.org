<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="設定リファレンス"
	description="nostrfy.toml の完全リファレンス:すべてのキー、その型、既定値、正確な動作 — 制限、データベース、デーモン、アクセス制御、Blossom。"
/>

<div class="doc-body">
	<h2>基本</h2>
	<p>
		設定は <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a> ファイルで、既定の名前は
		<code>nostrfy.toml</code> です。<code>init</code> で作成します:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>検証してください(起動のたびに推奨):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>すべてのコマンドは <code>--config &lt;path&gt;</code> を受け付けます(既定値 <code>nostrfy.toml</code>)。</p>
	<p>一般的な構文:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>設定セクション</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>セクション</th>
				<th>目的</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>[relay]</code></td>
				<td>識別情報、URL、NIP の切り替え</td>
			</tr>
			<tr>
				<td><code>[server]</code></td>
				<td>ネットワークバインド、API 分離、メトリクス</td>
			</tr>
			<tr>
				<td><code>[rpc]</code></td>
				<td>NIP-86 管理 RPC(認証、本体サイズ上限)</td>
			</tr>
			<tr>
				<td><code>[limits]</code></td>
				<td>すべての制限と過負荷保護</td>
			</tr>
			<tr>
				<td><code>[database]</code></td>
				<td>LMDB ストレージ、検索インデックス、キュー上限</td>
			</tr>
			<tr>
				<td><code>[daemon]</code></td>
				<td>PID、ログ、統計ファイルとローテーション</td>
			</tr>
			<tr>
				<td><code>[access]</code></td>
				<td>初期アクセス制御リスト(実行時に変更可能)</td>
			</tr>
			<tr>
				<td><code>[blossom]</code></td>
				<td>Blossom ファイルサーバー(メディアホスティング)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>すべてのキーは省略可能です。指定のないキーは既定値が使われます。</p>

	<h2>セクション [relay] — リレー識別情報</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>name</code></td>
				<td>string</td>
				<td><code>"nostrfy"</code></td>
				<td>NIP-11 経由でクライアントに表示されるリレー名</td>
			</tr>
			<tr>
				<td><code>description</code></td>
				<td>string</td>
				<td><code>"A minimal and stable Nostr relay"</code></td>
				<td>リレーの説明(NIP-11)</td>
			</tr>
			<tr>
				<td><code>pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>管理者の公開鍵(NIP-11 の pubkey フィールド)</td>
			</tr>
			<tr>
				<td><code>contact</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>管理者の連絡先 URI(mailto: または https://)</td>
			</tr>
			<tr>
				<td><code>icon</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>リレーアイコンの画像 URL</td>
			</tr>
			<tr>
				<td><code>post_policy</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>リレーの投稿ポリシーを指す URL</td>
			</tr>
			<tr>
				<td><code>private_key</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>リレー自身の秘密鍵。NIP-29 グループに必要</td>
			</tr>
			<tr>
				<td><code>public_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>公開 URL(例: wss://relay.example.com)</td>
			</tr>
			<tr>
				<td><code>livekit_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>NIP-29 音声・映像ルーム用の LiveKit サーバー URL</td>
			</tr>
			<tr>
				<td><code>livekit_api_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit API キー</td>
			</tr>
			<tr>
				<td><code>livekit_api_secret</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit API シークレット(JWT の署名に使用)</td>
			</tr>
			<tr>
				<td><code>enabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>明示的な NIP 許可リスト</td>
			</tr>
			<tr>
				<td><code>disabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>無効化する NIP(enabled_nips が空でない場合は無視)</td>
			</tr>
			<tr>
				<td><code>reject_ephemeral</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>NIP-01 のエフェメラルイベント(kind 20000-29999)を拒否</td>
			</tr>
			<tr>
				<td><code>enabled_git</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>NIP-34 git イベントを受け入れ(kind 1617-1633、30617/30618)</td>
			</tr>
			<tr>
				<td><code>require_pow</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>要求するプルーフ・オブ・ワークの先頭ゼロビット数</td>
			</tr>
			<tr>
				<td><code>new_pubkey_min_age_secs</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>これより新しい公開鍵からのイベントを拒否(秒。0 = 無効)</td>
			</tr>
			<tr>
				<td><code>max_events_per_min_per_pubkey</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>公開鍵ごとの投稿レート制限(1分あたり。0 = 無制限)</td>
			</tr>
			<tr>
				<td><code>max_groups</code></td>
				<td>integer</td>
				<td><code>1000</code></td>
				<td>インメモリ NIP-29 グループストアの上限</td>
			</tr>
			<tr>
				<td><code>require_auth</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>REQ/EVENT/COUNT/NEG に NIP-42 認証を要求</td>
			</tr>
			<tr>
				<td><code>send_auth_challenge</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>接続時に AUTH チャレンジを送信</td>
			</tr>
			<tr>
				<td><code>enabled_nip78_auth</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>kind 78/30078 イベントの受信前に NIP-42 AUTH を要求</td>
			</tr>
			<tr>
				<td><code>enabled_command_events</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>管理者公開鍵が署名した kind:1 運用コマンドを実行</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>キーの詳細</h3>
	<ul>
		<li>
			<strong>private_key</strong> — リレー自身の秘密鍵で、リレー生成イベントの署名に使用します:NIP-29 グループ
			メタデータ(39000-39005)と NIP-43 のロール／メンバーシップイベント。<code>nostrfy genkey</code> で生成し、厳重に
			保管してください。起動時に一度だけ読み込まれるため、変更には再起動が必要です。
		</li>
		<li>
			<strong>public_url</strong> — クライアント由来の URL 付きタグの検証に使用します:NIP-42 AUTH、NIP-62 vanish、
			NIP-98 管理認証。空の場合、リレーは <code>host:port</code> にフォールバックしますが、<code>0.0.0.0</code> や
			<code>127.0.0.1</code> にバインドしている場合は実際のクライアント URL と一致せず(警告が記録されます)。
			<strong>必ず設定してください。</strong>
		</li>
		<li>
			<strong>enabled_nips と disabled_nips</strong> — 許可リストが優先されます:<code>enabled_nips</code> が
			空でない場合、その NIP のみが広告され、<code>disabled_nips</code> は無視されます。どちらも再起動が必要です。
		</li>
		<li>
			<strong>reject_ephemeral</strong> — kind 20000-29999 は拒否されますが、NIP が転送を要求する除外 kind は引き続き
			転送されます:22242、27235、28934/28935/28936、24133、23194/23195、24242、21059。SIGHUP で適用されます。
		</li>
		<li>
			<strong>enabled_git</strong> — オプトインの NIP-34:kind 1617-1633 および 30617/30618 を受け入れ、NIP-34 を広告します。
			パッチペイロードが大きくなる可能性があるため既定では無効です。SIGHUP で適用されます。
		</li>
	</ul>

	<h2>セクション [server] — サーバー設定</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>"127.0.0.1"</code></td>
				<td>バインドアドレス。0.0.0.0 はどこからでも接続を受け付けます</td>
			</tr>
			<tr>
				<td><code>port</code></td>
				<td>integer</td>
				<td><code>8080</code></td>
				<td>ポート(1-65535)。ポート 80 には root が必要</td>
			</tr>
			<tr>
				<td><code>api_host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>REST API 専用のホスト名</td>
			</tr>
			<tr>
				<td><code>metrics_enabled</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>/metrics で Prometheus メトリクスを提供</td>
			</tr>
			<tr>
				<td><code>ws_paths</code></td>
				<td>string</td>
				<td><code>"root"</code></td>
				<td>WebSocket エンドポイントのパス:root、inbox-outbox、all</td>
			</tr>
			<tr>
				<td><code>inbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>/inbox への書き込み許可:"any" または "relay"(イベントには p タグが必須)</td>
			</tr>
			<tr>
				<td><code>outbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>/outbox への書き込み許可:"any"(NIP-42 認証済み公開鍵自身のイベント)または "relay"</td>
			</tr>
			<tr>
				<td><code>trusted_proxies</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>X-Forwarded-For を信頼するリバースプロキシのアドレス／CIDR(空 = プロキシを信頼しない)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>キーの詳細</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> はすべての IPv4 インターフェースにバインドします。<code>127.0.0.1</code> はローカルのみです。</li>
		<li><strong>port</strong> — 1-65535。ポート 80 には root が必要です。この 1 つのポートで WebSocket リレー、NIP-11 文書、REST API、NIP-86 RPC をまとめて提供します。</li>
		<li>
			<strong>api_host</strong> — REST API を単一ホスト名に専用化し、リバースプロキシ配下で API とリレーが1つのポートを共有できるようにします。起動時に固定 — 再起動が必要です。
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> は / のみ、<code>inbox-outbox</code> は /inbox と /outbox のみ、<code>all</code>
			は両方を提供します。起動時に固定 — 再起動が必要です。
		</li>
		<li>
			<strong>trusted_proxies</strong> — プロキシ自身のアドレスのみを列挙します(同一ホストの nginx/Caddy ならループバック、クラウドなら
			バランサーの送信元範囲)。設定すると、クライアント IP は信頼できない最後の <code>X-Forwarded-For</code>
			エントリから導出され、IP ごとの上限、レート制限、<code>blockip</code>、ログに使用されます。クライアントが直接到達できるアドレスは
			絶対に追加しないでください — ヘッダーを偽装して IP ごとの制限を回避される恐れがあります。起動時に固定 — 再起動が必要です。
		</li>
	</ul>

	<h2>セクション [rpc] — NIP-86 管理</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>management_token</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>管理 API 用の Bearer トークン</td>
			</tr>
			<tr>
				<td><code>admin_pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>NIP-98 管理認証用の管理者公開鍵</td>
			</tr>
			<tr>
				<td><code>max_admin_body_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>NIP-86 管理 RPC の本体サイズ上限</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		NIP-86 RPC はリレーの公開 <code>POST /</code> ルートにマウントされます — 専用の管理ポートはありません。<code>management_token</code>
		と <code>admin_pubkey</code> が古いガイドで <code>[server]</code> 配下に記載されることがありますが、これらはこの <code>[rpc]</code>
		キーの旧来の別名です。
	</p>

	<h2>セクション [limits] — 制限と保護</h2>
	<h3>接続とメッセージ</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_connections</code></td>
				<td>integer</td>
				<td><code>10000</code></td>
				<td>最大同時接続数</td>
			</tr>
			<tr>
				<td><code>max_connections_per_ip</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>送信元 IP ごとの最大接続数</td>
			</tr>
			<tr>
				<td><code>max_ws_message_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>WebSocket メッセージ／フレームあたりの最大バイト数</td>
			</tr>
			<tr>
				<td><code>socket_recv_buffer_kb</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>接続ごとのカーネル受信バッファ(KiB)</td>
			</tr>
			<tr>
				<td><code>max_out_queue_bytes</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>接続ごとの送信キュー上限(バイト)</td>
			</tr>
			<tr>
				<td><code>ws_idle_timeout_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>アイドル接続をこの時間後に切断</td>
			</tr>
			<tr>
				<td><code>http_read_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>HTTP リクエストヘッドのタイムアウト(slow-loris 対策)</td>
			</tr>
			<tr>
				<td><code>max_connections_per_sec_per_ip</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>送信元 IP ごとの1秒あたりの最大新規接続数</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>サブスクリプションとクエリ</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_filters</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>REQ あたりの最大フィルター数</td>
			</tr>
			<tr>
				<td><code>max_subscriptions</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>接続あたりの最大サブスクリプション数</td>
			</tr>
			<tr>
				<td><code>max_limit</code></td>
				<td>integer</td>
				<td><code>500</code></td>
				<td>REQ limit の上限</td>
			</tr>
			<tr>
				<td><code>max_count</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>COUNT 結果の上限</td>
			</tr>
			<tr>
				<td><code>max_sub_id_len</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>サブスクリプション ID の最大長(バイトではなく文字数)</td>
			</tr>
			<tr>
				<td><code>max_sub_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>接続あたりのサブスクリプションフィルター合計バイト数</td>
			</tr>
			<tr>
				<td><code>max_req_response_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>1回の REQ 応答が送信できる合計バイト数の上限</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>イベント</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_content_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>イベントコンテンツの最大文字数</td>
			</tr>
			<tr>
				<td><code>max_tags</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>イベントあたりの最大タグ数</td>
			</tr>
			<tr>
				<td><code>max_tag_value_bytes</code></td>
				<td>integer</td>
				<td><code>1024</code></td>
				<td>タグ値1つあたりの最大バイト数</td>
			</tr>
			<tr>
				<td><code>max_created_at_future_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>created_at の未来方向の許容ずれ</td>
			</tr>
			<tr>
				<td><code>group_late_publish_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>NIP-29 グループ管理イベントの許容遅延(秒)</td>
			</tr>
			<tr>
				<td><code>max_neg_items</code></td>
				<td>integer</td>
				<td><code>100000</code></td>
				<td>NIP-77 negentropy 同期あたりの最大レコード数</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		旧来の別名:<code>limits.require_pow</code>、<code>limits.new_pubkey_min_age_secs</code>、
		<code>limits.max_indexed_words</code> は引き続き <code>relay.require_pow</code>、
		<code>relay.new_pubkey_min_age_secs</code>、<code>database.max_indexed_words</code> の別名として受け付けられます。
	</p>
	<h3>REST API</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_api_concurrent</code></td>
				<td>integer</td>
				<td><code>8</code></td>
				<td>/api/v1 リクエストの最大同時実行数</td>
			</tr>
			<tr>
				<td><code>max_api_limit</code></td>
				<td>integer</td>
				<td><code>5000</code></td>
				<td>API limit パラメータの上限</td>
			</tr>
			<tr>
				<td><code>max_api_offset</code></td>
				<td>integer</td>
				<td><code>50000</code></td>
				<td>API offset パラメータの上限</td>
			</tr>
			<tr>
				<td><code>max_api_fetch</code></td>
				<td>integer</td>
				<td><code>55001</code></td>
				<td>offset クエリの最大オーバーフェッチ幅 — max_api_offset + max_api_limit + 1 をカバーする必要があります(0 = 上限なし)</td>
			</tr>
			<tr>
				<td><code>max_api_search_bytes</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>API search パラメータの最大バイト数</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>ライブファンアウト</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>live_batch_interval_ms</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>ライブイベントのフラッシュ間隔(ミリ秒)</td>
			</tr>
			<tr>
				<td><code>live_batch_size</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>ライブバッチあたりの最大イベント数</td>
			</tr>
			<tr>
				<td><code>live_buffer</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>ライブファンアウトのキューサイズ</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>セクション [database] — データベース</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>path</code></td>
				<td>string</td>
				<td><code>"./data"</code></td>
				<td>データベースディレクトリ(LMDB)</td>
			</tr>
			<tr>
				<td><code>max_dbs</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>LMDB の最大名前付きデータベース数</td>
			</tr>
			<tr>
				<td><code>max_readers</code></td>
				<td>integer</td>
				<td><code>128</code></td>
				<td>LMDB の最大同時リーダー数</td>
			</tr>
			<tr>
				<td><code>map_size</code></td>
				<td>integer</td>
				<td><code>1073741824</code> (1 GB)</td>
				<td>メモリマップサイズの下限(バイト)</td>
			</tr>
			<tr>
				<td><code>max_map_size</code></td>
				<td>integer</td>
				<td><code>1099511627776</code> (1 TB)</td>
				<td>メモリマップの上限(バイト)</td>
			</tr>
			<tr>
				<td><code>purge_interval_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>NIP-40 パージ間隔(秒)</td>
			</tr>
			<tr>
				<td><code>search_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>NIP-50 単語インデックスを有効化</td>
			</tr>
			<tr>
				<td><code>reader_threads</code></td>
				<td>integer</td>
				<td><code>2</code></td>
				<td>スキャン専用スレッド数</td>
			</tr>
			<tr>
				<td><code>max_indexed_words</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>各イベントの content のうち検索用に索引付けする単語数</td>
			</tr>
			<tr>
				<td><code>meta_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>スキャンの事前フィルターが使うイベントごとのメタデータヘッダーを書き込む</td>
			</tr>
			<tr>
				<td><code>disabled_fsync</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>書き込みバッチごとの同期ディスクフラッシュを省略</td>
			</tr>
			<tr>
				<td><code>db_buffer_size</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>接続ごとの初期 WebSocket バッファ(バイト)</td>
			</tr>
			<tr>
				<td><code>db_request_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>データベース要求が失敗するまで待機できる時間</td>
			</tr>
			<tr>
				<td><code>max_db_queue_msgs</code></td>
				<td>integer</td>
				<td><code>4096</code></td>
				<td>高速失敗までにキューできる保留メッセージの上限</td>
			</tr>
			<tr>
				<td><code>max_db_queue_events</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>高速失敗までにキュー済みバッチ内に収められるイベントの上限</td>
			</tr>
			<tr>
				<td><code>max_db_queue_bytes</code></td>
				<td>integer</td>
				<td><code>268435456</code> (256 MiB)</td>
				<td>高速失敗までにキューできるデータベース要求のバイト数上限(0 = バイト上限なし)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>キーの詳細</h3>
	<ul>
		<li>
			<strong>map_size</strong> — メモリマップの下限です。マップは常に最低でもこのサイズで開かれます。
		</li>
		<li>
			<strong>max_map_size</strong> — 上限で、スパースな仮想予約として開かれます。物理ディスクは実際に書き込まれたデータ分だけ
			増加します。<code>database map is full</code> が出たら引き上げてください。
		</li>
		<li>
			<strong>search_index = false</strong> — 検索は引き続き動作します(content に対する完全一致スキャン)が、スキャンは
			遅くなります。小規模 VPS ではデータベースが半分程度になります。小規模インスタンスにおすすめです。
		</li>
		<li>
			<strong>disabled_fsync</strong> — 耐久性とスループットのトレードオフです。書き込みは OS のページキャッシュにコミットされ、
			電源喪失時には直近の書き込みが失われる可能性があります。
		</li>
	</ul>

	<h2>セクション [daemon] — デーモン</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>pid_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.pid"</code></td>
				<td>PID ファイルのパス</td>
			</tr>
			<tr>
				<td><code>log_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.log"</code></td>
				<td>ログファイルのパス</td>
			</tr>
			<tr>
				<td><code>stats_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.stats.json"</code></td>
				<td>統計ファイルのパス</td>
			</tr>
			<tr>
				<td><code>stats_interval_secs</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>統計の書き込み間隔(秒)</td>
			</tr>
			<tr>
				<td><code>max_log_size_bytes</code></td>
				<td>integer</td>
				<td><code>52428800</code> (50 MB)</td>
				<td>ログローテーションのサイズ(0 = ローテーションなし)</td>
			</tr>
			<tr>
				<td><code>max_log_files</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>保持するローテーション済みログの世代数</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>パスは設定ファイルのあるディレクトリを基準に解決されるため、デーモンが作業ディレクトリを変更した後も有効です。</p>

	<h2>セクション [access] — アクセス制御</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>restrict_relay</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>許可リストの公開鍵のみ投稿可能</td>
			</tr>
			<tr>
				<td><code>blocked_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>拒否する kind</td>
			</tr>
			<tr>
				<td><code>allowed_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>kind 許可リスト。空でない場合はこれらの kind のみ受け入れ</td>
			</tr>
			<tr>
				<td><code>blocked_ips</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>接続時に拒否する IP アドレス</td>
			</tr>
			<tr>
				<td><code>method_grants</code></td>
				<td>table: pubkey → array of strings</td>
				<td><code>&#123;&#125;</code></td>
				<td>非管理者公開鍵への NIP-86 メソッド許可(実行時は <code>assignmethod</code> で管理)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		公開鍵の許可／拒否リストは設定キー<strong>ではありません</strong> — リレーデータベース(LMDB)に格納され、実行時に管理します:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — 許可リストの公開鍵のみが<strong>投稿</strong>できますが、読み取りは全員に開放されたままです
			(どのクライアントも購読・取得できます)。
		</li>
		<li>拒否された公開鍵は、投稿時は常に拒否され、読み取り時にも決して提供されません。</li>
		<li>
			<strong>method_grants</strong> — 非管理者公開鍵への NIP-86 メソッド許可(公開鍵 → メソッド名。例:モデレーターに <code>banevent</code>
			と <code>listbannedevents</code> を許可)。初回起動時に設定から投入し、以後は NIP-86 の <code>assignmethod</code>／<code>unassignmethod</code>
			で実行時に管理します(<code>listmethodassignees</code> で確認)。付与可能なのはモデレーション系と読み取り系メソッドのみです —
			権限・ロール・招待・リレー識別情報の管理は管理者のみで、BAN 済み公開鍵は許可があっても拒否されます。詳しくは
			<a href={p('/docs/management/')}>管理 API</a> を参照してください。
		</li>
	</ul>

	<h2>セクション [blossom] — Blossom ファイルサーバー</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>キー</th>
				<th>型</th>
				<th>既定値</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Blossom サーバーのホスト名(空 = 無効)</td>
			</tr>
			<tr>
				<td><code>storage</code></td>
				<td>string</td>
				<td><code>"local"</code></td>
				<td>バックエンド:"local"(local_path)または "s3"(S3 互換バケット)</td>
			</tr>
			<tr>
				<td><code>local_path</code></td>
				<td>string</td>
				<td><code>"/var/lib/nostrfy/images"</code></td>
				<td>メディアファイルのローカルストレージルート</td>
			</tr>
			<tr>
				<td><code>max_upload_bytes</code></td>
				<td>integer</td>
				<td><code>20971520</code> (20 MB)</td>
				<td>メディアファイルの最大サイズ</td>
			</tr>
			<tr>
				<td><code>min_free_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>これを下回るとアップロードを拒否する空き容量</td>
			</tr>
			<tr>
				<td><code>s3_endpoint</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 互換エンドポイント(例: R2)</td>
			</tr>
			<tr>
				<td><code>s3_region</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 リージョン(R2 は "auto")</td>
			</tr>
			<tr>
				<td><code>s3_bucket</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 バケット名</td>
			</tr>
			<tr>
				<td><code>s3_access_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 アクセスキー</td>
			</tr>
			<tr>
				<td><code>s3_secret_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 シークレットキー</td>
			</tr>
			<tr>
				<td><code>restrict_uploads</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>許可リストの公開鍵のみアップロード可能</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>実行時のリロード(SIGHUP)</h2>
	<p>
		ファイルを編集して <code>kill -HUP $(cat nostrfy.pid)</code> を送ると、設定を<strong>再起動なしで</strong>リロードします。
		ほとんどの設定は即時に反映されますが、一部は起動時に固定されます:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>SIGHUP で適用</th>
				<th>再起動が必要</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td>
				<td>relay.private_key</td>
			</tr>
			<tr>
				<td>reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>relay.livekit_*, enabled_nips / disabled_nips</td>
			</tr>
			<tr>
				<td>[limits] のほとんど</td>
				<td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, daemon サイズ, 上限値, blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] はリロードでは適用されません — リストは起動時に一度だけ投入され、以後は NIP-86 経由で実行時に管理します。
		再起動が必要な設定が変更された場合はログに警告が出ますが、起動時に取り込んだ一部設定はリロードのチェック対象外です。
	</p>

	<Callout type="warning" title="よくある間違い">
				<div class="overflow-x-auto">
			<table>
			<thead>
				<tr>
					<th>間違い</th>
					<th>修正</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>public_url 未設定</td>
					<td><code>wss://...</code> を設定</td>
				</tr>
				<tr>
					<td>host が 127.0.0.1 のまま</td>
					<td>外部クライアントは接続できません</td>
				</tr>
				<tr>
					<td>NIP-29 で private_key 未設定</td>
					<td><code>nostrfy genkey</code> を実行＋再起動</td>
				</tr>
				<tr>
					<td>restrict_relay が true で許可リストが空</td>
					<td>全員締め出しになります</td>
				</tr>
				<tr>
					<td>再起動専用キーを変更して SIGHUP のみ送信</td>
					<td><code>nostrfy restart</code> を使用</td>
				</tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
