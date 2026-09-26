<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. 停止 nostrfy 中繼（遷移需要資料庫目錄）
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry run — 解析並驗證每個事件，不寫入任何內容
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. 匯入
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. 啟動 — NIP-29 群組與 NIP-43 角色從匯入的事件重建
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # NIP-42/62/98 與 NIP-29 中繼資料需要
private_key = "..."                       # NIP-29/43 中繼簽章中繼資料需要

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# 選項 A — nostrfy 自己執行 \`strfry export\`（strfry 在 PATH 中）
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# 選項 B — 你自己匯出到檔案
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# 選項 C — 管線（stdin 是預設輸入）
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # 用於 nak（WebSocket）
H=https://relay.example.com    # 用於 curl（HTTP）

nak relay "$R"                              # 中繼回應並公佈其 NIP
curl -s "$H/api/v1/query?limit=1"           # 事件可被提供
nak req -i <deleted-event-id> "$R"          # 已刪除的事件保持消失
nak req -k 39000 "$R"                       # NIP-29 群組中繼資料（如已遷移）
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # NIP-43 成員清單（AUTH）`;
</script>

<DocsTitle
	title="從 strfry 遷移"
	description="用一行指令將現有 strfry 中繼的事件遷移到 nostrfy — 準備、dry-run、遷移、驗證與復原。"
/>

<div class="doc-body">
	<h2>一覽</h2>
	<p>
		<code>nostrfy migrate-strfry</code> 讀取
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		自己的匯出格式（JSONL，每行一個 NIP-01 事件），因此可跨 strfry 資料庫版本，且不依賴 strfry
		內部的 LMDB schema。它從不寫入 strfry 資料庫。
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>已遷移</th>
					<th>未遷移</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>每個已儲存的事件（套用可替換/可定址語意）</td>
					<td>沒有 nostrfy 等效項的 strfry 設定（合併報告會列出每一項及原因）</td>
				</tr>
				<tr>
					<td>NIP-40 過期 — 已過期的事件被跳過</td>
					<td>Blossom 媒體及其擁有者對應（strfry 沒有 Blossom 伺服器）</td>
				</tr>
				<tr>
					<td>NIP-09 刪除，包括 strfry 已實際刪除的事件的重新發布阻擋</td>
					<td>存取清單（NIP-86 封鎖、中繼公鑰清單、Blossom 允許清單）</td>
				</tr>
				<tr>
					<td>NIP-29 <code>9005</code>/<code>9008</code> 管理副作用</td>
					<td>NIP-43 邀請碼（用 <code>createclaim</code> 簽發新的）</td>
				</tr>
				<tr>
					<td>首次出現時間戳（設定新公鑰門檻時）</td>
					<td>NIP-62 消除請求，除非給出 <code>--apply-vanish</code></td>
				</tr>
				<tr>
					<td>NIP-29 群組、NIP-43 角色及其中繼簽章中繼資料，在首次啟動時重建</td>
					<td>中繼本身的身分/金鑰（它們位於 <code>nostrfy.toml</code>）</td>
				</tr>
				<tr>
					<td>等效的 strfry 設定，可選擇合併到 <code>nostrfy.toml</code></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		摘要中的預期跳過：<strong>臨時事件</strong>（類型 20000-29999，nostrfy 從不儲存）與
		<strong>已過期事件</strong>。
	</p>

	<h2>快速開始</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="遷移是離線的">
		它直接寫入 <code>database.path</code>，當 nostrfy 常駐程式（或另一個遷移）佔用資料庫目錄時會拒絕執行。
		<strong>請先停止中繼。</strong>strfry 本身可以繼續執行 — <code>strfry export</code> 讀取一致的快照。
	</Callout>

	<h2>環境需求</h2>
	<ul>
		<li>
			<code>strfry</code> 二進位檔（用於 <code>--strfry-db</code>），或你自己匯出的 JSONL 檔案。
		</li>
		<li>nostrfy v0.1.15 或更高版本（<code>migrate-strfry</code> 子指令）。</li>
		<li>目標中繼的 nostrfy 設定，已設定 <code>database.path</code>、<code>public_url</code> 與
			<code>private_key</code>。</li>
		<li>
			可用磁碟空間：大約為 strfry 匯出加上其索引的大小。NIP-50 詞索引會增加
			一些；磁碟非常緊張時可先停用（<code>database.search_index = false</code>），
			遷移後再啟用（索引在啟動時重建）。
		</li>
		<li>目標 <code>database.path</code> 上沒有執行中的 nostrfy 執行個體。</li>
	</ul>

	<h2>準備設定</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		如果沒有中繼金鑰，用 <code>nostrfy genkey</code> 產生，然後驗證：
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>合併 strfry 設定（選用）</h3>
	<p>
		在開啟資料庫之前，<code>migrate-strfry</code> 會尋找 strfry 的設定
		（<code>--strfry-config</code>，然後 <code>$STRFRY_CONFIG</code>、<code>/etc/strfry.conf</code>、
		<code>./strfry.conf</code>），列印有 nostrfy 等效項且與你的
		<code>nostrfy.toml</code> 不同的設定，並詢問是否合併。只重寫列出的鍵 — 註解
		和所有其他行都保留，會導致設定無效的值會被跳過並說明原因，其餘仍然合併。
	</p>
	<ul>
		<li><code>--merge-config</code> 不經詢問直接套用（用於腳本）；<code>--no-merge-config</code> 跳過該步驟。</li>
		<li>沒有終端機時，會列印建議，除非給出 <code>--merge-config</code>，否則跳過合併。</li>
		<li><code>--dry-run</code> 列印建議但從不寫入。</li>
	</ul>

	<h2>Dry run</h2>
	<p>先看再跳 — dry run 解析並驗證整個匯出，而不觸碰資料庫：</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		非零的 <code>bad signature</code> 計數意味著匯出包含 strfry 未經
		驗證就接受的事件；它們會被跳過。如果信任它們，傳 <code>--no-verify</code> 仍然匯入。
	</p>

	<h2>遷移</h2>
	<p>選擇三種輸入模式之一 — 結果完全相同：</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>旗標</th>
					<th>用途</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry 不在 <code>PATH</code> 中</td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>續傳/追趕：<code>created_at</code> 為該值或更新的事件（含邊界）</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>處理匯出中發現的 NIP-62 消除請求（預設關閉）</td></tr>
				<tr><td><code>--no-verify</code></td><td>對可信傾印跳過簽章驗證（更快）</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>每個資料庫交易的事件數（預設 512）</td></tr>
				<tr><td><code>--dry-run</code></td><td>只解析和驗證</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		遷移<strong>可安全重複執行</strong>：重複項被跳過，刪除副作用會
		重新套用，因此中斷的執行可以直接重跑（或用 <code>--since</code> 續傳）。
	</p>

	<h2>啟動與驗證</h2>
	<p>
		首次啟動會從匯入的事件重建 NIP-29 群組儲存與 NIP-43 角色儲存，並
		重新發布中繼簽章的中繼資料（每個群組的 <code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>，
		以及 <code>13534</code> 成員清單）。大型資料庫可能需要一會兒；請觀察日誌。
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		如需精確的數量對比，<code>strfry scan '&#123;&#125;' | wc -l</code> 減去遷移摘要中報告的臨時/過期事件
		應等於用戶端能取回的數量。
	</p>

	<h2>恢復中斷的遷移</h2>
	<Callout type="warning" title="重新執行前不要啟動中繼">
		NIP-29 群組副作用（<code>9005</code>/<code>9008</code>）在匯入之後套用；中斷的執行
		已儲存這些事件但尚未執行刪除，因此首次啟動可能會提供刪除本應移除的群組
		歷史。請先重新執行遷移 — 它會完成副作用（清除是幂等的）— 然後再啟動中繼。
	</Callout>
	<ul>
		<li>
			<strong>匯出到檔案/管線：</strong>重新執行同一指令。重複項被跳過，刪除
			阻擋會重新套用。
		</li>
		<li>
			<strong>使用了 <code>--strfry-db</code>：</strong>摘要會列印續傳提示；用那個
			<code>--since</code> 重新執行（含邊界，邊界秒會重新匯入並去重）。
		</li>
		<li>
			如果執行失敗並顯示 <code>database writer unavailable</code>，檢查可用磁碟空間和
			<code>database.map_size</code>，然後重跑。
		</li>
	</ul>

	<h2>復原</h2>
	<p>遷移只寫入 nostrfy 資料庫。要復原，停止中繼並還原遷移前的資料庫，或將其刪除：</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # 或還原遷移前的備份'} lang="sh" />

	<h2>疑難排解</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>訊息</th>
					<th>原因 / 修正</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>nostrfy 常駐程式（或另一個遷移）佔用了目錄：先 <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> 必須指向包含 <code>data.mdb</code> 的目錄</td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>安裝 strfry、設定 <code>--strfry-bin</code>，或使用 <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>寫入執行緒停止或佇列過載：檢查磁碟/映射大小，重跑（安全）</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>清除被中斷：重新執行遷移</td>
				</tr>
				<tr>
					<td>高 <code>bad signature</code> 計數</td>
					<td>strfry 資料庫包含未驗證的事件：檢查它們；僅當信任來源時才用 <code>--no-verify</code> 匯入</td>
				</tr>
				<tr>
					<td>啟動後缺少 NIP-29 中繼資料</td>
					<td>沒有 <code>relay.private_key</code>：執行 <code>nostrfy genkey</code> 並重新啟動</td>
				</tr>
				<tr>
					<td>未提供設定合併</td>
					<td>未找到 strfry 的設定：傳 <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>檢查清單</h2>
	<ul>
		<li>nostrfy 中繼已停止</li>
		<li>strfry 資料庫與 nostrfy 設定已備份</li>
		<li><code>nostrfy check</code> 通過</li>
		<li>strfry 設定已合併（或報告已審閱）</li>
		<li>dry run 已審閱（無意外的壞簽章）</li>
		<li>遷移無錯誤完成</li>
		<li>中繼啟動；群組/角色重建已記錄</li>
		<li>事件數量相符（減去臨時/過期）</li>
		<li>已刪除的事件保持消失（重新發布被拒絕）</li>
		<li>以匿名和成員身分檢查了私密群組可見性</li>
		<li>反向代理 / DNS / 用戶端中繼清單已更新</li>
	</ul>

	<Callout type="tip" title="strfry 還在執行？">
		如果匯出期間 strfry 保持上線，在準備切換時做一次追趕執行：停止 nostrfy，
		用 <code>--since &lt;last created_at&gt;</code> 重新執行遷移，然後再次啟動。
	</Callout>
</div>
