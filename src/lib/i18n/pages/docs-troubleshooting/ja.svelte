<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# 設定ファイルで port = 8080 を変更してから実行します：
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# nostrfy が実行中の場合は再起動します
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# 古い pid ファイルがあれば削除します
rm -f nostrfy.pid`;
	const tomlExample = `# 正しい例：
name = "my relay"        # 文字列は " で囲みます
port = 8080              # 数値はそのまま書きます
enabled_nips = [1, 50]   # リストは [ ] で囲みます`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# 外部から確認します（サーバーの IP/ポートを使います）
curl http://YOUR_SERVER_IP:8080/health

# ファイアウォールを確認します（例：ufw）
sudo ufw status
# 必要であればポートを開きます
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" をバイト単位で取得します`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# ローカルの Blossom ストレージ使用時は [blossom].local_path もバックアップします。
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="トラブルシューティング"
	description="発生しやすいエラー(ポート、権限、TLS、不足している NIP、パブリッシュ、タイムアウト)と段階的な修正方法をまとめています。"
/>

<div class="doc-body">
	<p><strong>最初に確認すべき3つのこと:</strong></p>
	<ul>
		<li><code>nostrfy check</code> は設定を検証します(ほとんどのエラーは設定ミスです)。</li>
		<li><code>tail -f nostrfy.log</code> でログを確認します — 原因はほぼ必ずそこにあります。</li>
		<li><code>nostrfy restart</code> はデーモンをクリーンに再起動します。</li>
	</ul>

	<h2 id="cannot-start">起動できない</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>原因:</strong> ポート 80 は root のみがバインドできます。</p>
	<p><strong>修正:</strong> <code>sudo</code> で実行するか、ポート 8080 のような高いポートに変更してください。</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>原因:</strong> 別のプロセス(古い nostrfy や別のサーバー)がすでにそのポートを使用しています。
	</p>
	<p><strong>修正:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>原因:</strong> nostrfy はすでに実行中です。<code>start</code> は2つ目のインスタンスの起動を拒否します。
	</p>
	<p><strong>修正:</strong> <code>nostrfy restart</code> を使うか、実行中のインスタンスをそのまま使ってください。</p>

	<h3><code>nostrfy stop</code> がハングする / <code>did not stop in time</code></h3>
	<p><strong>原因:</strong> デーモンが停止しているか、応答していません。</p>
	<p><strong>修正:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>原因:</strong> 設定ファイルが正しい TOML ではありません。よくあるミス:文字列の引用符の付け忘れや、同じキーの重複です。
	</p>
	<p><strong>修正:</strong> エラーメッセージに行番号が含まれています。その行を確認して修正してください。</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>原因:</strong> 設定ファイルが存在しません。</p>
	<p><strong>修正:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>原因:</strong> <code>relay.private_key</code> が有効な64文字の16進キーではありません。
	</p>
	<p>
		<strong>修正:</strong> <code>nostrfy genkey</code> を実行して正しいキーを生成してください(または
		<code>private_key = ""</code> を設定します)。
	</p>

	<h3>起動時にログに大量の警告が出る</h3>
	<p><code>[WARN]</code> ログ行は設定上の問題を知らせます。主なもの:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>警告</th>
				<th>意味と修正方法</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> が未設定です — NIP-42 認証、NIP-62 vanish、NIP-98 管理者認証が動作しません。<code>wss://your-public-url</code> を設定してください。
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>グループには秘密キーが必要です。<code>nostrfy genkey</code> を実行してください。</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>設定内の未使用の古いキー(またはタイプミス)です。キー名を確認してください。</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					セクション名のタイプミスです(例:<code>[server]</code> ではなく <code>[serve]</code>)。修正してください。
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>この組み合わせでは全員が締め出されます。どちらか一方を変更してください。</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					PoW 要件が高すぎて誰も投稿できません。<code>require_pow</code> を下げてください。
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">接続できない・動作がおかしい</h2>

	<h3>クライアントが <code>connection refused</code> を受け取る</h3>
	<p>
		<strong>原因:</strong> リレーが実行されていないか、ファイアウォールがポートをブロックしています。
	</p>
	<p><strong>修正:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>外部クライアントは接続できず、ローカルは接続できる</h3>
	<p>
		<strong>原因:</strong> <code>server.host</code> が既定の <code>127.0.0.1</code> のままで、ローカル接続のみを受け付けています。
	</p>
	<p>
		<strong>修正:</strong> 設定で <code>host = "0.0.0.0"</code> に設定して再起動してください。
	</p>

	<h3>Cloudflare トンネル経由で接続できない</h3>
	<p>Cloudflare Tunnel を使う場合:</p>
	<ul>
		<li>
			リレーはプレーンな HTTP で動作し、Cloudflare が TLS を終端するため、クライアントは <code>wss://</code> を使います。リレー側で
			<code>public_url = "wss://..."</code> を設定してください(NIP-42 認証が動作するようになります)。
		</li>
		<li>
			Cloudflare は <code>X-Forwarded-Proto</code> ヘッダーを追加します。nostrfy は
			<code>ws</code> / <code>wss</code> / <code>http</code> / <code>https</code> の値を同じものとして扱うため、通常は追加設定は不要です。
		</li>
	</ul>

	<h3><code>error: message too large</code> で接続が切れる</h3>
	<p>
		<strong>原因:</strong> 単一メッセージが <code>max_ws_message_bytes</code>(既定 1 MB)を超えています。
	</p>
	<p>
		<strong>修正:</strong> より大きなイベントが必要なら <code>limits.max_ws_message_bytes</code> を引き上げてください — ただしクライアント側の制限も確認してください。
	</p>

	<h3><code>too many subscriptions</code> / <code>too many filters</code> エラー</h3>
	<p>
		<strong>原因:</strong> 接続ごとの上限に達しました(サブスクリプション既定 20、フィルター既定 20)。
	</p>
	<p>
		<strong>修正:</strong> <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> を引き上げてください(クライアント設定も確認してください)。
	</p>

	<h3>負荷が高いと新しい接続が拒否される</h3>
	<p>
		<strong>原因:</strong> <code>max_connections</code>(既定 10000)に達したか、IP ごとの上限
		(<code>max_connections_per_ip</code>、既定 64)が働いたか、秒間接続レート制限
		(<code>max_connections_per_sec_per_ip</code>)がバーストを拒否しました。これらの上限は WebSocket とプレーン HTTP のすべての接続に適用されます。
	</p>
	<p>
		<strong>修正:</strong> 設定を見直して調整してください。<code>max_connections_per_ip = 0</code> で IP ごとの上限を無効化し、<code>max_connections_per_sec_per_ip = 0</code> でレート制限を無効化します。これら3つの設定には再起動が必要です。
	</p>

	<h3>しばらくすると接続が切れる</h3>
	<p>
		<strong>原因:</strong> <code>ws_idle_timeout_secs</code> が設定されていると、アイドル接続は閉じられます。正常なクライアントはリレーの PING に PONG で応答して接続を維持し、死んだピアのみが刈り取られます。
	</p>
	<p>
		<strong>修正:</strong> これは意図的な動作です — 既定は 300 秒です。完全に無効にするには
		<code>ws_idle_timeout_secs = 0</code> に設定してください。
	</p>

	<h3>サブスクリプションが <code>CLOSED ... response too large</code> で終わる</h3>
	<p>
		<strong>原因:</strong> 1つの REQ の保存済みイベントが <code>max_req_response_bytes</code>(既定 32 MiB)を超えました。非常に大きなイベントや非常に広いフィルターでのみ発生します。
	</p>
	<p>
		<strong>修正:</strong> フィルターを狭めてください(<code>since</code> / <code>until</code> を厳しく、<code>limit</code> を小さく)か、<code>max_req_response_bytes</code> を引き上げてください(0 で上限を無効化)。
	</p>

	<h3>NIP-11 の <code>supported_nips</code> 一覧に NIP がない</h3>
	<p>
		<strong>原因:</strong> 公開リストは動的です — 定義する kind がすべて拒否されると NIP は非表示になります:すべてが <code>blocked_kinds</code> にある、<code>allowed_kinds</code> に含まれていない、または <code>reject_ephemeral</code> で一時的 kind が拒否されている場合です。NIP-29/43/66 にはさらに <code>relay.private_key</code> が必要で、NIP-86 には
		<code>rpc.management_token</code> または <code>rpc.admin_pubkey</code> が必要です。
	</p>
	<p>
		<strong>修正:</strong> 有効なアクセスリストを確認してください — NIP-86 の <code>listallowedkinds</code> で kind 許可リストが、<code>GET /</code> で有効な <code>supported_nips</code> がすぐ確認できます。ブロックしている kind や <code>reject_ephemeral</code> 設定を取り除いてください。
	</p>

	<h2 id="publishing">パブリッシュ時のエラー</h2>
	<p>
		パブリッシュに失敗した場合、<code>OK</code> メッセージの4番目の要素が理由を示します。よくあるもの:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>エラー</th>
				<th>意味と修正方法</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>イベント署名が無効です(クライアントのキーが壊れている可能性もあります)。</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					本文が <code>max_content_bytes</code>(既定 64K 文字)を超えています。短くするか上限を引き上げてください。
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>タグが <code>max_tags</code>(既定 2000)より多いです。</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					タイムスタンプが未来すぎます(<code>max_created_at_future_secs</code> を超過)。
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					本文やタグに nsec らしい文字列が含まれています。<strong>秘密キーを投稿しないでください。</strong>その文字列を取り除けば受け付けられます。
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>同じイベントがすでに保存されています(正常です)。</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>公開鍵が禁止されている(<code>banpubkey</code>)か、許可リストの範囲外です。</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>この kind は許可されていません。</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					公開鍵が <code>max_events_per_min_per_pubkey</code> を超過しました(60秒のスライディングウィンドウ)。1分待って再試行するか、制限を引き上げ／無効化してください。
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>イベント ID が禁止されています。</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>削除済みイベントの再パブリッシュです。</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					認証が必要です(<code>relay.require_auth</code> がオンの場合)。
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					アカウントが <code>new_pubkey_min_age_secs</code> 以内に作成されました。待ってから再試行してください。
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>グループが存在しません(先に作成してください)。</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					グループは <code>closed</code> です。招待コードなしの参加リクエストは承認されません。
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Blossom ファイルサーバー</h2>

	<h3>アップロードが <code>401</code> で失敗する</h3>
	<p>アップロード認証イベント(kind 24242)が拒否されました。以下を確認してください:</p>
	<ul>
		<li>
			トークンの <code>expiration</code> タグが<strong>存在し</strong>、未来の unix タイムスタンプに設定されていること、
		</li>
		<li>upload/media/delete ではトークンが blob の sha256 を持つ <code>x</code> タグを含んでいること、</li>
		<li>
			<code>server</code> タグ(ある場合)が設定済みの <code>blossom.host</code> と正確に一致していること(ホスト名のみ、スキームやパスなし)、
		</li>
		<li>トークンが過去 10 分以内に署名されたものであること(リプレイ対策の鮮度ウィンドウ)、</li>
		<li>署名キーがアップローダー本人のものであること。</li>
	</ul>

	<h3>アップロードが <code>403</code> で失敗する</h3>
	<p>
		<code>blossom.restrict_uploads = true</code> が設定され、公開鍵が許可リストにありません — <code>nostrfy blossom allow npub1...</code> で追加してください(デーモンは自動的に再読み込みします)。リストがおかしい場合は <code>nostrfy blossom list</code> で確認できます。
	</p>

	<h3>アップロードが <code>409</code> で失敗する</h3>
	<p>
		クライアントが送った <code>X-SHA-256</code> ヘッダーが実際のリクエスト本文と一致しません(宣言したハッシュが異なるバイト列から計算されています — 例:ハッシュ計算後にファイルが変更された)。クライアントはヘッダーを省略できます。
	</p>

	<h3>メディアホストへの <code>GET /</code> が NIP-11 文書を返す</h3>
	<p>
		リクエストが Blossom Host ヘッダー付きでリレーに届いていません。<code>media.example.com</code>(または <code>blossom.host</code> に設定したもの)をリバースプロキシで同じポートに向けてから
		<code>nostrfy restart</code> してください。
	</p>

	<h3>アップロード直後に blob が 404 になる</h3>
	<p>
		ファイルは SHA-256 によるコンテンツアドレスです。アップロード応答で返された正確なハッシュで取得してください(<code>/&lt;sha256&gt;</code> または <code>/&lt;sha256&gt;.&lt;ext&gt;</code>)。不一致は、送信したバイト列と異なるハッシュをクライアントが要求したことを意味します。
	</p>

	<h2 id="search-groups-auth">検索・グループ・認証</h2>

	<h3>検索結果が 0 件になる / 想定外の結果になる</h3>
	<p>nostrfy の検索は<strong>単語単位</strong>で一致します。注意点:</p>
	<ul>
		<li>
			<code>search = "rust"</code> は「rust」という単語を含むイベントに一致しますが、<code>"ru"</code> は「rust」の部分文字列としては一致しません。
		</li>
		<li>検索対象はイベント本文内の単語のみです。</li>
		<li><code>search_index = false</code> でも検索は動作しますが遅くなります。</li>
		<li>
			NIP-50 が無効な場合(<code>disabled_nips = [50]</code>)、<code>search</code> は無視されます(NOTICE が送られます)。
		</li>
	</ul>

	<h3>グループメタデータ(39000-39005)が生成されない</h3>
	<p>
		<strong>原因:</strong> <code>relay.private_key</code> が未設定です。グループスナップショットはリレー自身のキーで署名されるため、それがないと何も生成されません。
	</p>
	<p><strong>修正:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> でグループイベントが拒否される</h3>
	<p>
		<strong>原因:</strong> グループが存在しません。NIP-29 では、モデレーションイベントや参加リクエスト(9021)は、kind 9007 で作成される前のグループを対象にできません。
	</p>
	<p><strong>修正:</strong> 先に 9007 イベントでグループを作成してください。</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>原因:</strong> モデレーション(メンバー追加など)には管理者(役割を持つメンバー)が必要です。作成者は管理者です。
	</p>
	<p><strong>修正:</strong> 管理者に役割の付与を依頼するか、自分でグループを作成してください。</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>原因:</strong> グループは <code>closed</code> です。招待コードなしの参加リクエストは自動承認されません。
	</p>
	<p><strong>修正:</strong> 管理者に招待コード(9009)をもらい、<code>code</code> タグ付きで参加してください。</p>

	<h3>誤ってグループを抜けた、またはグループに管理者がいない</h3>
	<p>
		<strong>原因:</strong> NIP-29 の退出リクエスト(kind 9022)はメンバーなら誰でも尊重されます — 最後の管理者が抜けて管理者不在になる場合も含みます。管理者がいないと、モデレーションイベント(9000/9001/9002/9008)を誰も送れなくなります。
	</p>
	<p>
		<strong>修正:</strong> リレー自身のキー(<code>relay.private_key</code>、NIP-11 の <code>self</code> として公開される公開鍵)でモデレーションイベントに署名してください。NIP-29 ではモデレーションイベントは「リレーマスターキーまたはグループ管理者」から送れるとされており、管理者がいなくても自身のキーで署名されたグループモデレーションをリレーは受け付けます。例えば <code>kind:9000</code> で管理者を復元します:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		リレーキーで署名してパブリッシュしてください。あるいは、リレー署名の
		<code>kind:9008</code> でグループを削除し(保存済みイベントは消去されます)、<code>kind:9007</code> で作り直す方法もあります。この復旧には <code>relay.private_key</code> の設定が必要です。
	</p>

	<h3>保護イベントが <code>auth-required</code> で拒否される</h3>
	<p>
		<strong>原因:</strong> NIP-70 の保護イベント(<code>-</code> タグ付き)は、認証済みの作成者本人が<strong>同一接続上</strong>でのみパブリッシュできます。
	</p>
	<p><strong>修正:</strong> パブリッシュ前にクライアントで NIP-42 認証を有効にしてください。</p>

	<h3>AUTH(NIP-42)が <code>false</code> を返す</h3>
	<p>よくある原因:</p>
	<ol>
		<li>
			<code>relay.public_url</code> が未設定か誤っている — AUTH イベントの <code>relay</code> タグがリレーの URL と一致しません。<code>wss://...</code> を設定して再起動してください。
		</li>
		<li>古いチャレンジ — 別の接続で AUTH を送ったか、古いチャレンジを再利用しました。</li>
		<li>
			クライアントの時計がずれている — AUTH イベントの <code>created_at</code> は現在時刻の ±10 分以内である必要があります。
		</li>
	</ol>

	<h3>NIP-86 管理 API が <code>401 unauthorized</code> を返す</h3>
	<p><strong>原因:</strong> 認証情報がないか誤っています。</p>
	<p><strong>修正:</strong></p>
	<ul>
		<li><code>management_token</code> を設定し、<code>Authorization: Bearer &lt;token&gt;</code> を送ります。</li>
		<li>
			または <code>admin_pubkey</code> を設定し、NIP-98 認証イベントを送ります(<code>u</code> タグはリレー URL と完全一致が必要で、<code>payload</code> タグが必須です)。
		</li>
		<li>どちらも未設定の場合、管理 API は完全に無効です。</li>
	</ul>

	<h3>NIP-98 認証イベントがスキームやポートの違いで拒否される</h3>
	<p>
		NIP-98 仕様では <code>u</code> タグは絶対リクエスト URL と<em>完全一致</em>でなければならず、nostrfy は期待 URL を <code>relay.public_url</code> から導出します:WebSocket スキームに対応する HTTP スキームへの対応付けによる権威部分(<code>wss://</code> → <code>https://</code>、<code>ws://</code> → <code>http://</code>、<code>nostr+</code> 除去)。<code>public_url</code> がない場合、リレーは提供中のプレーンな <code>http://host:port</code> を期待します。異なるスキーム・異なる／省略されたポート・異なるパスやクエリのタグは拒否されます — クライアントが署名する公開アドレスを
		<code>relay.public_url</code> に設定してください。各認証イベントは<strong>使い捨て</strong>でもあります:60秒の有効期間内に同じ <code>Authorization</code> ヘッダーを再送すると拒否されます。
	</p>

	<h2 id="db-disk">データベースとディスク</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>原因:</strong> LMDB のメモリマップ上限(既定で仮想アドレス空間 1 TB。実際のディスク使用量はデータとともに増加)に達しました — 実質的にデータベースがいっぱいです。
	</p>
	<p><strong>修正:</strong> <code>database.max_map_size</code> を引き上げて再起動してください。</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>原因:</strong> 空きディスク容量が 32 MB 未満です。書き込みは停止します(データを保護するため)。読み取りは継続します。
	</p>
	<p>
		<strong>修正:</strong> ディスク容量を空けてください。空きができれば書き込みは自動的に再開します。(<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> が <code>map_size must not exceed max_map_size</code> を報告する</h3>
	<p>
		<strong>原因:</strong> <code>database.map_size</code> が <code>max_map_size</code> より大きいです。
	</p>
	<p>
		<strong>修正:</strong> <code>map_size</code> を <code>max_map_size</code> 以下に設定してください(既定値で問題ありません)。
	</p>

	<h3>データベースサイズの確認</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>データベースのバックアップ / 移行</h3>
	<p>
		すべてのデータは <code>database.path</code> ディレクトリにあります。<strong>コピー前にリレーを停止してください</strong>(稼働中のデータベースのコピーは破損する恐れがあります)。
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">デーモンの運用</h2>

	<h3><code>nostrfy stats</code> が <code>nostrfy is not running (no stats file)</code> と表示する</h3>
	<p>
		<strong>原因:</strong> stats ファイルが存在しません — デーモンが実行されていないか、起動から数秒以内です。
	</p>
	<p><strong>修正:</strong> <code>nostrfy start</code> を実行し、数秒待ってから再試行してください。</p>

	<h3>ログが際限なく増える</h3>
	<p>
		<strong>原因:</strong> <code>max_log_size_bytes</code> が 0 です(ローテーション無効)。
	</p>
	<p>
		<strong>修正:</strong> <code>max_log_size_bytes = 52428800</code>(50 MB)と
		<code>max_log_files = 5</code> を設定してください。ローテーションは自動です。
	</p>

	<h3>リロード後に設定変更が反映されない</h3>
	<p>
		<strong>原因:</strong> 起動時に固定される設定をリロード(SIGHUP)しました:<code>private_key</code>、<code>api_host</code>、<code>metrics_enabled</code>、LiveKit 設定、NIP 有効／無効リストです。
	</p>
	<p>
		<strong>修正:</strong> <code>nostrfy restart</code> を使ってください。この場合ログに「a restart is required」という警告が出ます。
	</p>

	<h3>リレーが勝手に停止する</h3>
	<p><strong>原因:</strong> マシンが再起動したか、リレーがメモリ不足(OOM)になりました。</p>
	<p><strong>修正:</strong></p>
	<ol>
		<li>ログの末尾を確認:<code>tail -50 nostrfy.log</code>。</li>
		<li>
			マシンが再起動したか確認:<code>uptime</code>(稼働時間が非常に短ければ再起動しています)。
		</li>
		<li>メモリを確認:<code>free -h</code>。</li>
		<li>リレーを再起動:<code>nostrfy start</code>。</li>
	</ol>
	<Callout type="tip" title="ヒント">
		起動時に nostrfy を自動起動するには、リレーの起動コマンドを <code>ExecStart</code> とする systemd サービスとして登録してください。
	</Callout>

	<h3>systemd がポート 80 でリレーを起動できない</h3>
	<p>
		root で動作する systemd サービスはポート 80 をバインドできます。<code>User=</code> に一般ユーザーを設定した場合は、高いポート(例:8080)を使うか、ユニットに
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> を追加してください。
	</p>

	<h2 id="still-not-solved">まだ解決しない場合</h2>
	<ol>
		<li>
			<strong>ログを確認</strong>:<code>tail -100 nostrfy.log</code> — 直接の原因が書かれていることが多いです。
		</li>
		<li>
			<strong>設定を再検証</strong>:<code>nostrfy check</code> — 警告とエラーを表示します。
		</li>
		<li>
			<strong>再現情報を集める</strong>:何をしていたか、どのクライアントか、正確なエラーは何か。
		</li>
		<li>
			<strong>プロジェクトリポジトリで質問する</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — issue を立てる際は再現手順とログを含めてください。
		</li>
	</ol>
</div>
