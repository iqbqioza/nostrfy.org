<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. nostrfy リレーを停止します（移行にはデータベースディレクトリが必要です）
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. ドライラン — すべてのイベントを解析・検証し、何も書き込みません
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. インポートします
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. 起動します — インポートしたイベントから NIP-29 グループと NIP-43 ロールが再構築されます
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # NIP-42/62/98 と NIP-29 メタデータに必要です
private_key = "..."                       # NIP-29/43 のリレー署名メタデータに必要です

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# 選択肢 A — nostrfy が \`strfry export\` 自体を実行します（strfry が PATH にある場合）
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# 選択肢 B — ファイルにエクスポート済みの場合
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# 選択肢 C — パイプ（stdin が既定の入力です）
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # nak 用（WebSocket）です
H=https://relay.example.com    # curl 用（HTTP）です

nak relay "$R"                              # リレーが応答して対応 NIP を通知します
curl -s "$H/api/v1/query?limit=1"           # イベントが配信されることを確認します
nak req -i <deleted-event-id> "$R"          # 削除済みイベントが消えたままであることを確認します
nak req -k 39000 "$R"                       # NIP-29 グループメタデータです（移行済みの場合）
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # NIP-43 メンバーシップです（AUTH）`;
</script>

<DocsTitle
	title="strfry からの移行"
	description="既存の strfry リレーのイベントを1つのコマンドで nostrfy に移行 — 準備、ドライラン、移行、検証、ロールバック。"
/>

<div class="doc-body">
	<h2>概要</h2>
	<p>
		<code>nostrfy migrate-strfry</code> は
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		独自のエクスポート形式(JSONL、1行に1つの NIP-01 イベント)を読み取るため、strfry のデータベースバージョンを問わず動作し、strfry
		内部の LMDB スキーマに依存しません。strfry データベースへの書き込みは一切行いません。
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>移行されるもの</th>
					<th>移行されないもの</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>すべての保存済みイベント(リプレーサブル／アドレス指定可能セマンティクスを適用)</td>
					<td>nostrfy に相当機能がない strfry 設定(マージ報告に理由付きで一覧表示)</td>
				</tr>
				<tr>
					<td>NIP-40 有効期限 — 期限切れイベントはスキップ</td>
					<td>Blossom メディアと所有者マッピング(strfry には Blossom サーバーがない)</td>
				</tr>
				<tr>
					<td>NIP-09 削除(strfry が既に削除したイベントの再公開ブロックを含む)</td>
					<td>アクセスリスト(NIP-86 ban、リレーの公開鍵リスト、Blossom 許可リスト)</td>
				</tr>
				<tr>
					<td>NIP-29 <code>9005</code>/<code>9008</code> モデレーション副作用</td>
					<td>NIP-43 招待コード(<code>createclaim</code> で新規発行)</td>
				</tr>
				<tr>
					<td>初見タイムスタンプ(新規公開鍵ゲート設定時)</td>
					<td>NIP-62 vanish 要求(<code>--apply-vanish</code> 指定時のみ)</td>
				</tr>
				<tr>
					<td>NIP-29 グループ、NIP-43 ロールとリレー署名メタデータ(初回起動時に再構築)</td>
					<td>リレー自身の識別情報／鍵(<code>nostrfy.toml</code> に格納)</td>
				</tr>
				<tr>
					<td>等価の strfry 設定(<code>nostrfy.toml</code> へのマージを提案、任意)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		要約で想定されるスキップ:<strong>エフェメラルイベント</strong>(kind 20000-29999、nostrfy は保存しません)と
		<strong>期限切れイベント</strong>です。
	</p>

	<h2>クイックスタート</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="移行はオフラインです">
		<code>database.path</code> に直接書き込むため、nostrfy デーモン(または他の移行)がデータベースディレクトリを保持している間は実行を拒否します。<strong>先にリレーを停止してください。</strong>
		strfry 自体は実行したままで構いません — <code>strfry export</code> は一貫性のあるスナップショットを読み取ります。
	</Callout>

	<h2>要件</h2>
	<ul>
		<li>
			<code>strfry</code> バイナリ(<code>--strfry-db</code> 用)、または自分でエクスポートした JSONL ファイル。
		</li>
		<li>nostrfy v0.1.15 以降(<code>migrate-strfry</code> サブコマンド)。</li>
		<li>移行先リレーの nostrfy 設定(<code>database.path</code>、<code>public_url</code>、<code>private_key</code> を設定)。</li>
		<li>
			空きディスク容量:strfry エクスポートとそのインデックス分程度。NIP-50 単語インデックスでさらに増加します。容量が厳しい場合は無効化し(<code>database.search_index = false</code>)、移行後に再度有効化できます(インデックスは起動時に再構築されます)。
		</li>
		<li>移行先の <code>database.path</code> 上で実行中の nostrfy インスタンスがないこと。</li>
	</ul>

	<h2>設定の準備</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		リレー鍵をお持ちでない場合は <code>nostrfy genkey</code> で生成し、次のコマンドで検証してください:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>strfry 設定のマージ(任意)</h3>
	<p>
		データベースを開く前に、<code>migrate-strfry</code> は strfry の設定を探します(<code>--strfry-config</code>、次に
		<code>$STRFRY_CONFIG</code>、<code>/etc/strfry.conf</code>、<code>./strfry.conf</code>)。nostrfy
		の等価設定があり、<code>nostrfy.toml</code> と異なるものを表示し、マージするか確認します。一覧表示されたキーのみが書き換えられます —
		コメントと他のすべての行は保持され、設定を無効にする値は理由付きでスキップされ、残りはマージされます。
	</p>
	<ul>
		<li><code>--merge-config</code> は確認なしで適用(スクリプト用)。<code>--no-merge-config</code> はこの手順をスキップします。</li>
		<li>端末がない場合、提案は表示されますが、<code>--merge-config</code> がなければマージはスキップされます。</li>
		<li><code>--dry-run</code> は提案を表示しますが書き込みは行いません。</li>
	</ul>

	<h2>ドライラン</h2>
	<p>まず確認してから実行 — ドライランはデータベースに触れずにエクスポート全体を解析・検証します:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		<code>bad signature</code> 件数が 0 でない場合、エクスポートには strfry が検証なしで受け入れたイベントが含まれており、スキップされます。信頼できる場合は
		<code>--no-verify</code> を付けてインポートしてください。
	</p>

	<h2>移行</h2>
	<p>3つの入力モードから1つを選択 — 結果はすべて同じです:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>フラグ</th>
					<th>理由</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry が <code>PATH</code> にない</td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>再開／追い越し:この <code>created_at</code> 以降のイベント(含む)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>エクスポート内の NIP-62 vanish 要求を尊重(既定では無効)</td></tr>
				<tr><td><code>--no-verify</code></td><td>信頼できるダンプ用に署名検証をスキップ(高速)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>トランザクションあたりのイベント数(既定 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>解析と検証のみ</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		移行は<strong>安全に再実行できます</strong>:重複はスキップされ、削除副作用は再適用されるため、中断した実行は単に繰り返す(または
		<code>--since</code> で再開する)だけで構いません。
	</p>

	<h2>起動と検証</h2>
	<p>
		初回起動では、インポートしたイベントから NIP-29 グループストアと NIP-43 ロールストアを再構築し、リレー署名メタデータ(グループごとの
		<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>、<code>13534</code>
		メンバーシップリスト)を再公開します。大規模データベースでは時間がかかる場合があります。ログを確認してください。
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		正確な件数比較には、<code>strfry scan '&#123;&#125;' | wc -l</code> から移行サマリーが報告したエフェメラル／期限切れイベントを差し引いた数が、クライアントが取得できる数と等しくなるはずです。
	</p>

	<h2>中断した移行の再開</h2>
	<Callout type="warning" title="再実行前にリレーを起動しないでください">
		NIP-29 グループ副作用(<code>9005</code>/<code>9008</code>)はインポート後に適用されます。中断した実行ではそれらのイベントは保存されていますが削除はまだのため、初回起動時に削除対象のグループ履歴を提供してしまう可能性があります。まず移行を再実行してください —
		副作用を完了します(パージは冪等です) — その後リレーを起動してください。
	</Callout>
	<ul>
		<li>
			<strong>ファイルにエクスポート／パイプした場合:</strong>同じコマンドを再実行してください。重複はスキップされ、削除ブロックは再適用されます。
		</li>
		<li>
			<strong><code>--strfry-db</code> を使用した場合:</strong>サマリーに再開ヒントが出力されます。その
			<code>--since</code> を付けて再実行してください(含むため、境界秒は再インポートされ重複排除されます)。
		</li>
		<li>
			<code>database writer unavailable</code> で失敗した場合は、空き容量と <code>database.map_size</code> を確認して再実行してください。
		</li>
	</ul>

	<h2>ロールバック</h2>
	<p>移行は nostrfy データベースにのみ書き込みます。ロールバックするには、リレーを停止し、移行前のデータベースを復元するか削除してください:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # or restore the pre-migration backup'} lang="sh" />

	<h2>トラブルシューティング</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>メッセージ</th>
					<th>原因／対処</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>nostrfy デーモン(または他の移行)がディレクトリを保持しています:先に <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> は <code>data.mdb</code> を含むディレクトリを指定する必要があります</td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>strfry をインストールするか、<code>--strfry-bin</code> を設定するか、<code>--input</code> を使用してください</td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>ライタースレッドが停止したかキューが過負荷です:ディスク／マップサイズを確認し、再実行してください(安全です)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>パージが中断されました:移行を再実行してください</td>
				</tr>
				<tr>
					<td>高い <code>bad signature</code> 件数</td>
					<td>strfry DB に未検証イベントが含まれています:確認し、送信元を信頼できる場合のみ <code>--no-verify</code> でインポートしてください</td>
				</tr>
				<tr>
					<td>起動後に NIP-29 メタデータがありません</td>
					<td><code>relay.private_key</code> がありません:<code>nostrfy genkey</code> を実行して再起動してください</td>
				</tr>
				<tr>
					<td>設定マージが提案されません</td>
					<td>strfry の設定が見つかりませんでした:<code>--strfry-config /etc/strfry.conf</code> を指定してください</td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>チェックリスト</h2>
	<ul>
		<li>nostrfy リレーを停止済み</li>
		<li>strfry データベースと nostrfy 設定をバックアップ済み</li>
		<li><code>nostrfy check</code> が成功</li>
		<li>strfry 設定をマージ済み(または報告を確認済み)</li>
		<li>ドライランを確認済み(予期しない不正署名なし)</li>
		<li>移行がエラーなく完了</li>
		<li>リレーが起動し、グループ／ロール再構築がログに記録</li>
		<li>イベント件数が一致(エフェメラル／期限切れを除く)</li>
		<li>削除済みイベントが消えたまま(再公開が拒否される)</li>
		<li>プライベートグループの可視性を匿名とメンバーとして確認</li>
		<li>リバースプロキシ／DNS／クライアントのリレーリストを更新</li>
	</ul>

	<Callout type="tip" title="strfry を実行したままですか？">
		エクスポート中に strfry が稼働していた場合、切り替え準備ができたら追い越し実行を行ってください:nostrfy を停止し、<code>--since &lt;last created_at&gt;</code>
		付きで移行を再実行してから、再度起動します。
	</Callout>
</div>
