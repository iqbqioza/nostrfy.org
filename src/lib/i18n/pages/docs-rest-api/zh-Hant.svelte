<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32 位元組十六進位事件 id",
      "pubkey": "32 位元組十六進位公鑰",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64 位元組十六進位簽章"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # 第 1 頁
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # 第 2 頁（當 more 為 true 時）`;
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
	title="REST API 參考"
	description="用於在 GET /api/v1/... 查詢已儲存 Nostr 事件的唯讀 HTTP API — 端點、參數、分頁、可見性規則與錯誤。"
/>

<div class="doc-body">
	<h2>基礎 URL</h2>
	<p>
		API 在 <code>/api/v1</code> 下提供，與 WebSocket 中繼同一連接埠：
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>主機路由（<code>server.api_host</code>）</h2>
	<p>
		設定 <code>server.api_host</code>（例如 <code>api.example.com</code>）後，API 與中繼
		按 Host 標頭拆分：<code>api.example.com</code> 取得 <code>/api/v1</code>、
		<code>/health</code> 與 <code>/metrics</code>；任何其他主機取得 WebSocket 中繼與 NIP-11。
		沒有 <code>api_host</code> 時，API 在每個主機上提供。只支援 GET — 到
		<code>/api/v1</code> 的 WebSocket 升級請求會以 403 拒絕。
	</p>

	<h2>端點</h2>
	<h3>基於識別碼的路徑</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>路徑</th>
				<th>傳回</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>最新的 kind-0 個人檔案事件</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>具有此 id 的單一事件</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>該位址的事件（kind + 作者 + d 標籤）</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>依公鑰、依類型過濾的事件（接受 npub1... 或 nprofile1...；否則 400）</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		作者識別碼在每個端點上接受 <code>npub1...</code>、<code>nprofile1...</code> 或 64 位十六進位公鑰
		（不分大小寫）。
	</p>
	<h3>查詢與聚合端點</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — 不帶識別碼的通用過濾器查詢。</li>
		<li><code>GET /api/v1/count</code> — 相同過濾器參數的總計數（NIP-45 語意）。</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — 作者依類型的事件計數，最常用的
			在前。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — 某個月的按日計數；
			month 必須為 1-12，每天都以零填充回報到最後一天（每個條目與
			總計都帶 <code>approximate</code> 旗標）。
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — 依其 64 位十六進位 id 取得單一事件（拒絕前綴）。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — 作者摘要（總計、首次/最後活動、類型
			細分）；沒有可見事件時 <code>first_seen</code>/<code>last_seen</code>/月份為 <code>null</code>。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — 某一天的按小時計數；全部 24
			小時都回報，零填充（與 daily 相同的 <code>approximate</code> 旗標）。
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — 參照該事件的回覆（#e）與引用（#q）；
			路徑 id 在比對前會轉為小寫，<code>e</code> 查詢參數會 OR 到
			#e 一側。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — 作者最新的 kind-3 關注清單。
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — 中繼上最常見的類型（有界、可見性過濾的樣本；<code>approximate</code> 與 <code>filtered</code> 旗標）。</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — 中繼上最活躍的作者（有界、
			可見性過濾的樣本；<code>approximate</code> 與 <code>filtered</code> 旗標）。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — 作者最新的 NIP-65 中繼清單
			（kind 10002）。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — 按月計數，在 since/until
			範圍內零填充（預設：整個期間；上限 120 個月）。
		</li>
	</ul>

	<h2>查詢參數</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>參數</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>最大結果數（預設 100，受 max_api_limit 限制）</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>略過的可見結果數（分頁）</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>只包含 created_at &gt;= since 的事件</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>只包含 created_at &lt;= until 的事件</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> 表示最舊在前；預設最新在前</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>NIP-50 全文搜尋（全詞比對）</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>依 #e / #p / #t / #d 標籤過濾</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					排除攜帶該標籤的事件 — 在分頁前套用，因此被排除的事件永遠不會
					佔用 limit 槽位或 offset 步數
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>回應格式</h2>
	<p>成功的回應傳回 <code>200 OK</code> 與以下 JSON 主體：</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>欄位</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>本頁的事件（預設最新在前）</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>本頁的事件數</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td>存在更多頁時為 true（用 offset 取得它們）</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>分頁</h2>
	<p>
		分頁透過 <code>offset</code> 與 <code>more</code> 旗標完成，在
		<strong>可見</strong>序列上計算 — 隱藏事件永遠不會略過或重複一頁：
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="端點的特殊行為">
		單例端點（個人檔案、<code>/ids/&#123;hex&#125;</code>、關注、中繼清單）仍接受
		<code>offset</code> — <code>?offset=1</code> 會略過唯一的事件並傳回 <code>[]</code>。
		<code>authors</code>/<code>kinds</code> 查詢參數只過濾通用的
		<code>/query</code> 端點：在 kind 端點上它們被靜默忽略（兩者都已預填），而在
		id 端點上它們被 AND 組合。<code>stats</code> 的類型細分依類型排序，不同於
		<code>/kinds</code>（依計數優先）。
	</Callout>

	<h2>可見性規則</h2>
	<p>API 未認證，因此它會保留與匿名 WebSocket 連線相同的事件：</p>
	<ul>
		<li>NIP-70 受保護事件（攜帶 <code>-</code> 標籤）</li>
		<li>NIP-59 禮物包裝（kind 1059）</li>
		<li>NIP-29 私密/隱藏群組內容（僅成員可見）</li>
	</ul>

	<h2>錯誤與狀態碼</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>代碼</th>
				<th>意義</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>成功</td>
			</tr>
			<tr>
				<td>400</td>
				<td>無效的識別碼或查詢參數</td>
			</tr>
			<tr>
				<td>403</td>
				<td>對 /api/v1 的 WebSocket 升級嘗試</td>
			</tr>
			<tr>
				<td>404</td>
				<td>未知路徑，或 API 的 Host 錯誤（設定了 api_host）</td>
			</tr>
			<tr>
				<td>503</td>
				<td>達到 API 並行限制 — 請稍後重試</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>範例</h2>
	<p>取得使用者的貼文（最新在前）：</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>分頁與排序：</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>依 id 取得單一事件（note1... 或 nevent1... 都可用）：</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>取得可定址事件（naddr1...）：</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>搜尋：</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>標籤過濾：</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
