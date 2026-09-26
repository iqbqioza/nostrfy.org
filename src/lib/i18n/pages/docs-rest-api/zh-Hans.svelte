<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32 字节十六进制事件 id",
      "pubkey": "32 字节十六进制公钥",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64 字节十六进制签名"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # 第 1 页
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # 第 2 页（当 more 为 true 时）`;
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
	title="REST API 参考"
	description="用于在 GET /api/v1/... 查询已存储 Nostr 事件的只读 HTTP API — 端点、参数、分页、可见性规则和错误。"
/>

<div class="doc-body">
	<h2>基础 URL</h2>
	<p>
		API 在 <code>/api/v1</code> 下提供，与 WebSocket 中继同一端口：
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>主机路由（<code>server.api_host</code>）</h2>
	<p>
		配置 <code>server.api_host</code>（例如 <code>api.example.com</code>）后，API 和中继
		按 Host 头拆分：<code>api.example.com</code> 获得 <code>/api/v1</code>、
		<code>/health</code> 和 <code>/metrics</code>；任何其他主机获得 WebSocket 中继和 NIP-11。
		没有 <code>api_host</code> 时，API 在每个主机上提供。只支持 GET — 到
		<code>/api/v1</code> 的 WebSocket 升级请求会以 403 拒绝。
	</p>

	<h2>端点</h2>
	<h3>基于标识符的路径</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>路径</th>
				<th>返回</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>最新的 kind-0 个人资料事件</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>具有此 id 的单个事件</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>该地址的事件（kind + 作者 + d 标签）</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>按公钥、按类型过滤的事件（接受 npub1... 或 nprofile1...；否则 400）</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		作者标识符在每个端点上接受 <code>npub1...</code>、<code>nprofile1...</code> 或 64 字符十六进制公钥
		（不区分大小写）。
	</p>
	<h3>查询和聚合端点</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — 不带标识符的通用过滤器查询。</li>
		<li><code>GET /api/v1/count</code> — 相同过滤器参数的总计数（NIP-45 语义）。</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — 作者按类型的事件计数，最常用的
			在前。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — 某个月的按日计数；
			month 必须为 1-12，每天都以零填充报告到最后一天（每个条目和
			总计都带 <code>approximate</code> 标志）。
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — 按其 64 字符十六进制 id 获取单个事件（拒绝前缀）。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — 作者摘要（总计、首次/最后活动、类型
			细分）；没有可见事件时 <code>first_seen</code>/<code>last_seen</code>/月份为 <code>null</code>。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — 某一天的按小时计数；全部 24
			小时都报告，零填充（与 daily 相同的 <code>approximate</code> 标志）。
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — 引用该事件的回复（#e）和引用（#q）；
			路径 id 在匹配前会转换为小写，<code>e</code> 查询参数会 OR 到
			#e 一侧。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — 作者最新的 kind-3 关注列表。
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — 中继上最常见的类型（有界、可见性过滤的样本；<code>approximate</code> 和 <code>filtered</code> 标志）。</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — 中继上最活跃的作者（有界、
			可见性过滤的样本；<code>approximate</code> 和 <code>filtered</code> 标志）。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — 作者最新的 NIP-65 中继列表
			（kind 10002）。
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — 按月计数，在 since/until
			范围内零填充（默认：整个期间；上限 120 个月）。
		</li>
	</ul>

	<h2>查询参数</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>参数</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>最大结果数（默认 100，受 max_api_limit 限制）</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>跳过的可见结果数（分页）</td>
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
				<td><code>asc</code>/<code>ascending</code> 表示最旧在前；默认最新在前</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>NIP-50 全文搜索（全词匹配）</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>按 #e / #p / #t / #d 标签过滤</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					排除携带该标签的事件 — 在分页前应用，因此被排除的事件永远不会
					占用 limit 槽位或 offset 步数
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>响应格式</h2>
	<p>成功的响应返回 <code>200 OK</code> 和以下 JSON 正文：</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>字段</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>本页的事件（默认最新在前）</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>本页的事件数</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td>存在更多页时为 true（用 offset 获取它们）</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>分页</h2>
	<p>
		分页通过 <code>offset</code> 和 <code>more</code> 标志完成，在
		<strong>可见</strong>序列上计算 — 隐藏事件永远不会跳过或重复一页：
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="端点怪癖">
		单例端点（个人资料、<code>/ids/&#123;hex&#125;</code>、关注、中继列表）仍接受
		<code>offset</code> — <code>?offset=1</code> 会跳过唯一的事件并返回 <code>[]</code>。
		<code>authors</code>/<code>kinds</code> 查询参数只过滤通用的
		<code>/query</code> 端点：在 kind 端点上它们被静默忽略（两者都已预填），而在
		id 端点上它们被 AND 组合。<code>stats</code> 的类型细分按类型排序，不同于
		<code>/kinds</code>（按计数优先）。
	</Callout>

	<h2>可见性规则</h2>
	<p>API 未认证，因此它会保留与匿名 WebSocket 连接相同的事件：</p>
	<ul>
		<li>NIP-70 受保护事件（携带 <code>-</code> 标签）</li>
		<li>NIP-59 礼物包装（kind 1059）</li>
		<li>NIP-29 私密/隐藏群组内容（仅成员可见）</li>
	</ul>

	<h2>错误与状态码</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>代码</th>
				<th>含义</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>成功</td>
			</tr>
			<tr>
				<td>400</td>
				<td>无效的标识符或查询参数</td>
			</tr>
			<tr>
				<td>403</td>
				<td>对 /api/v1 的 WebSocket 升级尝试</td>
			</tr>
			<tr>
				<td>404</td>
				<td>未知路径，或 API 的 Host 错误（配置了 api_host）</td>
			</tr>
			<tr>
				<td>503</td>
				<td>达到 API 并发限制 — 请稍后重试</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>示例</h2>
	<p>获取用户的笔记（最新在前）：</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>分页和排序：</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>按 id 获取单个事件（note1... 或 nevent1... 都可用）：</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>获取可寻址事件（naddr1...）：</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>搜索：</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>标签过滤：</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
