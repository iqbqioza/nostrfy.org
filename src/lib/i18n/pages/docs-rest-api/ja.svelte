<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32-byte hex event id",
      "pubkey": "32-byte hex pubkey",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64-byte hex signature"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # 1 ページ目です
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # 2 ページ目です（more が true の場合）`;
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc';
	const notesEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1"`;
	const paginateEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?limit=10&offset=10&sort=asc"`;
	const byIdEx = `curl "http://127.0.0.1:8080/api/v1/note1..."
curl "http://127.0.0.1:8080/api/v1/nevent1..."`;
	const naddrEx = `curl "http://127.0.0.1:8080/api/v1/naddr1..."`;
	const searchEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?search=rust"`;
	const tagEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/7?e=<event-id>&limit=100"`;
</script>

<DocsTitle
	title="REST API リファレンス"
	description="保存済み Nostr イベントを GET /api/v1/... でクエリする読み取り専用 HTTP API — エンドポイント、パラメータ、ページネーション、可視性ルール、エラー。"
/>

<div class="doc-body">
	<h2>ベース URL</h2>
	<p>
		API は WebSocket リレーと同じポートの <code>/api/v1</code> 配下で提供されます:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>ホストルーティング (<code>server.api_host</code>)</h2>
	<p>
		<code>server.api_host</code>(例: <code>api.example.com</code>)が設定されている場合、API とリレーは Host ヘッダーで分離されます: <code>api.example.com</code> は <code>/api/v1</code>、
		<code>/health</code> および <code>/metrics</code> を受け付け、それ以外のホストは WebSocket リレーと NIP-11 を受け付けます。
		<code>api_host</code> がない場合、API はすべてのホストで提供されます。GET のみ対応 — <code>/api/v1</code> への WebSocket アップグレード要求は 403 で拒否されます。
	</p>

	<h2>エンドポイント</h2>
	<h3>識別子ベースのパス</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>パス</th>
				<th>返却内容</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>最新の kind-0 プロフィールイベント</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>この ID を持つ単一のイベント</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>アドレスのイベント(kind + 作成者 + d タグ)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>公開鍵によるイベントを kind でフィルタ(npub1... または nprofile1... を受け付け、それ以外は 400)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		作成者識別子はすべてのエンドポイントで <code>npub1...</code>、<code>nprofile1...</code> または 64 文字 hex 公開鍵(大文字・小文字不問)を受け付けます。
	</p>
	<h3>クエリおよび集計エンドポイント</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — 識別子なしの汎用フィルタクエリ。</li>
		<li><code>GET /api/v1/count</code> — 同じフィルタパラメータに対する総件数(NIP-45 セマンティクス)。</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — 作成者ごとの kind 別イベント件数、使用頻度の高い順。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — 1 か月分の日別件数。
			月は 1〜12 を指定します。すべての日は最終日までゼロ埋めで報告されます(各エントリと合計に <code>approximate</code> フラグ付き)。
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — 64 文字 hex ID による単一イベント(プレフィックスは拒否)。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — 作成者サマリー(合計、最初/最後のアクティビティ、kind 内訳);可視イベントがない場合 <code>first_seen</code>/<code>last_seen</code>/月は <code>null</code>。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — 1 日分の時間別件数;24 時間すべてがゼロ埋めで報告されます(daily と同じ <code>approximate</code> フラグ)。
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — イベントを参照するリプライ(#e)と引用(#q);パス ID は照合前に小文字化され、<code>e</code> クエリパラメータは #e 側に OR 結合されます。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — 作成者の最新の kind-3 フォローリスト。
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — リレー上で最も一般的な kind(上限あり、可視性フィルタ済みサンプル;<code>approximate</code> および <code>filtered</code> フラグ)。</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — リレー上で最もアクティブな作成者(上限あり、可視性フィルタ済みサンプル;<code>approximate</code> および <code>filtered</code> フラグ)。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — 作成者の最新 NIP-65 リレーリスト(kind 10002)。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — since/until 範囲に対する月別件数、ゼロ埋め(既定: 全期間;最大 120 か月)。
		</li>
	</ul>

	<h2>クエリパラメータ</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>パラメータ</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>最大件数(既定 100、max_api_limit が上限)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>スキップする可視結果の件数(ページネーション)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>created_at &gt;= since のイベントのみ</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>created_at &lt;= until のイベントのみ</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td>古い順は <code>asc</code>／<code>ascending</code>。既定は新しい順</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>NIP-50 全文検索(完全一致)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>#e / #p / #t / #d タグでフィルタ</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					そのタグを持つイベントを除外 — ページネーションの前に適用されるため、除外されたイベントは limit 枠や offset 歩数を消費しません
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>レスポンス形式</h2>
	<p>成功レスポンスは <code>200 OK</code> と以下の JSON ボディを返します:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>フィールド</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>このページのイベント(既定は新しい順)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>このページのイベント件数</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td>後続ページがある場合は true(offset で取得)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>ページネーション</h2>
	<p>
		ページネーションは <code>offset</code> と <code>more</code> フラグで行い、<strong>可視</strong>シーケンス上で計算されます — 非表示イベントによってページが飛んだり重複したりすることはありません:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="エンドポイントの注意点">
		シングルトンエンドポイント(プロフィール、<code>/ids/&#123;hex&#125;</code>、follows、relays)でも <code>offset</code> を受け付けます — <code>?offset=1</code> は唯一のイベントをスキップして <code>[]</code> を返します。
		<code>authors</code>/<code>kinds</code> クエリパラメータは汎用 <code>/query</code> エンドポイントのみをフィルタします: kind エンドポイントでは暗黙に無視され(両方とも事前入力済み)、ID エンドポイントでは AND 結合されます。<code>stats</code> の kind 内訳は kind 順であり、<code>/kinds</code>(件数順)とは異なります。
	</Callout>

	<h2>可視性ルール</h2>
	<p>API は認証なしのため、匿名 WebSocket 接続と同じイベントを秘匿します:</p>
	<ul>
		<li>NIP-70 保護イベント(<code>-</code> タグ付き)</li>
		<li>NIP-59 ギフトラップ(kind 1059)</li>
		<li>NIP-29 プライベート/非公開グループコンテンツ(メンバーのみ可視)</li>
	</ul>

	<h2>エラーとステータスコード</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>コード</th>
				<th>意味</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>成功</td>
			</tr>
			<tr>
				<td>400</td>
				<td>無効な識別子またはクエリパラメータ</td>
			</tr>
			<tr>
				<td>403</td>
				<td>/api/v1 への WebSocket アップグレード試行</td>
			</tr>
			<tr>
				<td>404</td>
				<td>不明なパス、または API に対する誤った Host(api_host 設定時)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>API 同時実行数上限に達しました — しばらくして再試行してください</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>例</h2>
	<p>ユーザーのノートを取得(新しい順):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>ページネーションとソート:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>ID で単一イベントを取得(note1... も nevent1... も可):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>アドレス指定可能イベントを取得(naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>検索:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>タグフィルタ:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
