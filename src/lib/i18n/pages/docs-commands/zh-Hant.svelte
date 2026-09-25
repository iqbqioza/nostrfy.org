<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# 先 dry-run — 驗證每個事件，不寫入任何內容
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# 匯入（先停止 nostrfy 中繼）
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="指令參考"
	description="所有 nostrfy 指令：init、start、stop、stats、upgrade 與 migrate-strfry，外加 CLI 存取清單和 inbox/outbox 訂閱過濾器。"
/>

<div class="doc-body">
	<h2>概觀</h2>
	<p>所有指令都接受 <code>--config &lt;path&gt;</code>（預設 <code>nostrfy.toml</code>）。</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>指令</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>寫入預設 nostrfy.toml 並結束；檔案以 0600 權限建立</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>為 NIP-29 群組產生金鑰，寫入 relay.private_key，將設定設為 0600 並列印公開金鑰；當檔案在讀取後發生變化時中止而不寫入</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>驗證設定（啟動前執行）</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>以常駐程式方式啟動；<code>--foreground</code> 在終端機中執行</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>停止正在執行的常駐程式</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>停止並重新啟動（重新讀取設定）</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>顯示即時統計</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>將二進位檔更新到最新 GitHub 發行版（或指定版本）；下載相符平台的資產，驗證其 sha256 校驗和並執行 <code>--version</code> 探測，然後原子替換二進位檔；並行執行透過鎖定檔序列化；除非指定版本，否則不會降級；<code>--force</code> 重新安裝</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>從 strfry 中繼匯入事件 — 可透過 <code>--strfry-db</code> 執行 <code>strfry export</code>，用 <code>--input</code> 讀取 JSONL 檔案，或透過 stdin 管線輸入；可重複執行，支援 <code>--dry-run</code>、<code>--since</code> 與選用的設定合併</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>管理存取清單</h2>
	<p>
		中繼公鑰允許/拒絕清單與 Blossom 上傳允許清單儲存在 LMDB 中並立即生效 —
		執行中的常駐程式會自動重載：
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>被拒絕的公鑰在發布時始終被拒絕，讀取時也永遠不會被提供。</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> 從持久化的 NIP-86 被封鎖 IP 清單中移除一個 IP
		（自我鎖定復原）；重新啟動常駐程式以生效。
	</p>

	<h2>Inbox/outbox 訂閱過濾器</h2>
	<p>
		nostrfy 為 inbox/outbox 路由模型擴充了 REQ 過濾器語法，增加了兩個便利鍵 — 這是 nostrfy
		擴充，不屬於任何 NIP。<code>"outbox"</code> 展開為 <code>"authors"</code>：只包含<em>由</em>該公鑰<em>創作</em>的事件。
		<code>"inbox"</code> 展開為 <code>"#p"</code>：只包含<em>發給</em>該公鑰的事件（提及、回覆、Zap 與私訊）。
		值可以是 64 位十六進位或 <code>npub1</code> 編碼，也可以是與現有 <code>authors</code>/<code>#p</code>
		鍵合併的陣列；無效的公鑰會拒絕該訂閱：
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		端點也有寫入限制：<code>/outbox</code> 只接受由連線的 NIP-42 認證公鑰創作的事件
		（<code>server.outbox_write_policy = "any"</code>），或僅接受中繼自身的事件（<code>"relay"</code>）；
		<code>/inbox</code> 只接受帶有 <code>p</code> 標籤的事件。
	</p>

	<h2>從 strfry 遷移</h2>
	<p>
		用一行指令匯入現有 strfry 中繼的事件。遷移是離線的（先停止 nostrfy 中繼 — 資料庫被佔用時它會拒絕執行），
		讀取 strfry 自己的匯出格式，且可安全重複執行：重複項被跳過，刪除副作用會重新套用。
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		它也會提議將等效的 strfry 設定合併到 <code>nostrfy.toml</code>，並可在中斷後用 <code>--since</code>
		續傳。NIP-29 群組與 NIP-43 角色會在首次啟動時從匯入的事件重建。完整操作手冊見
		<a href={p('/docs/migrating-from-strfry/')}>遷移指南</a>。
	</p>

	<Callout type="tip" title="逐步說明">
		大多數指令在<a href={p('/docs/quick-start/')}>快速開始指南</a>中也有逐步說明。
	</Callout>
</div>
