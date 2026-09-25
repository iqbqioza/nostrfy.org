<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

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
	title="設定參考"
	description="nostrfy.toml 的完整參考：每個鍵、類型、預設值及其確切作用 — 限制、資料庫、常駐程式、存取控制與 Blossom。"
/>

<div class="doc-body">
	<h2>基礎</h2>
	<p>
		設定是一個 <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a> 檔案，預設名為 <code>nostrfy.toml</code>。用 <code>init</code> 建立它：
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>驗證它（建議每次啟動前都執行）：</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>每個指令都接受 <code>--config &lt;path&gt;</code>（預設 <code>nostrfy.toml</code>）。</p>
	<p>一般語法：</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>設定區段</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>區段</th><th>用途</th></tr></thead>
		<tbody>
			<tr><td><code>[relay]</code></td><td>身分、URL 與 NIP 切換</td></tr>
			<tr><td><code>[server]</code></td><td>網路綁定、API 拆分、指標</td></tr>
			<tr><td><code>[rpc]</code></td><td>NIP-86 管理 RPC（認證、請求主體限制）</td></tr>
			<tr><td><code>[limits]</code></td><td>所有限制與過載保護</td></tr>
			<tr><td><code>[database]</code></td><td>LMDB 儲存、搜尋索引、佇列上限</td></tr>
			<tr><td><code>[daemon]</code></td><td>PID、日誌與統計檔案及輪替</td></tr>
			<tr><td><code>[access]</code></td><td>初始存取控制清單（執行階段可變更）</td></tr>
			<tr><td><code>[blossom]</code></td><td>Blossom 檔案伺服器（媒體託管）</td></tr>
		</tbody>
	</table>
	</div>
	<p>每個鍵都是選用的；缺少的鍵使用其預設值。</p>

	<h2>[relay] 區段 — 中繼身分</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>name</code></td><td>string</td><td><code>"nostrfy"</code></td><td>透過 NIP-11 向用戶端顯示的中繼名稱</td></tr>
			<tr><td><code>description</code></td><td>string</td><td><code>"A minimal and stable Nostr relay"</code></td><td>中繼說明（NIP-11）</td></tr>
			<tr><td><code>pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>管理員公鑰（NIP-11 pubkey 欄位）</td></tr>
			<tr><td><code>contact</code></td><td>string</td><td><code>""</code></td><td>管理員聯絡 URI（mailto: 或 https://）</td></tr>
			<tr><td><code>icon</code></td><td>string</td><td><code>""</code></td><td>中繼圖示圖片 URL</td></tr>
			<tr><td><code>post_policy</code></td><td>string</td><td><code>""</code></td><td>指向中繼發布政策的 URL</td></tr>
			<tr><td><code>private_key</code></td><td>string (64 hex)</td><td><code>""</code></td><td>中繼本身的金鑰；NIP-29 群組需要</td></tr>
			<tr><td><code>public_url</code></td><td>string</td><td><code>""</code></td><td>公開 URL，例如 wss://relay.example.com</td></tr>
			<tr><td><code>livekit_url</code></td><td>string</td><td><code>""</code></td><td>用於 NIP-29 影音房間的 LiveKit 伺服器 URL</td></tr>
			<tr><td><code>livekit_api_key</code></td><td>string</td><td><code>""</code></td><td>LiveKit API key</td></tr>
			<tr><td><code>livekit_api_secret</code></td><td>string</td><td><code>""</code></td><td>LiveKit API secret（用於簽發 JWT）</td></tr>
			<tr><td><code>enabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>明確的 NIP 允許清單</td></tr>
			<tr><td><code>disabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>要停用的 NIP（enabled_nips 非空時忽略）</td></tr>
			<tr><td><code>reject_ephemeral</code></td><td>boolean</td><td><code>false</code></td><td>拒絕 NIP-01 臨時事件（類型 20000-29999）</td></tr>
			<tr><td><code>enabled_git</code></td><td>boolean</td><td><code>false</code></td><td>接受 NIP-34 git 事件（類型 1617-1633、30617/30618）</td></tr>
			<tr><td><code>require_pow</code></td><td>integer</td><td><code>0</code></td><td>要求的工作量證明前導零位數</td></tr>
			<tr><td><code>new_pubkey_min_age_secs</code></td><td>integer</td><td><code>0</code></td><td>拒絕來自比該值更「年輕」的公鑰的事件（秒；0 = 關閉）</td></tr>
			<tr><td><code>max_events_per_min_per_pubkey</code></td><td>integer</td><td><code>0</code></td><td>每個公鑰的發布速率限制（每分鐘；0 = 無限制）</td></tr>
			<tr><td><code>max_groups</code></td><td>integer</td><td><code>1000</code></td><td>記憶體中 NIP-29 群組儲存的上限</td></tr>
			<tr><td><code>require_auth</code></td><td>boolean</td><td><code>false</code></td><td>對 REQ/EVENT/COUNT/NEG 要求 NIP-42 認證</td></tr>
			<tr><td><code>send_auth_challenge</code></td><td>boolean</td><td><code>true</code></td><td>連線時傳送 AUTH 挑戰</td></tr>
			<tr><td><code>enabled_nip78_auth</code></td><td>boolean</td><td><code>true</code></td><td>接受 kind 78/30078 事件前要求 NIP-42 AUTH</td></tr>
			<tr><td><code>enabled_command_events</code></td><td>boolean</td><td><code>false</code></td><td>執行由管理員公鑰發布的 kind:1 維運指令</td></tr>
		</tbody>
	</table>
	</div>
	<h3>鍵的詳細說明</h3>
	<ul>
		<li>
			<strong>private_key</strong> — 中繼本身的金鑰，用於簽署中繼產生的事件：NIP-29 群組中繼資料（39000-39005）與 NIP-43 角色/成員事件。用 <code>nostrfy genkey</code> 產生；請保密。它只在啟動時讀取一次，因此變更它需要重新啟動。
		</li>
		<li>
			<strong>public_url</strong> — 用於驗證用戶端送來的帶 URL 標籤：NIP-42 AUTH、NIP-62 消除與 NIP-98 管理認證。為空時，中繼回退到 <code>host:port</code>，而綁定 <code>0.0.0.0</code> 或 <code>127.0.0.1</code> 時它永遠不會符合真實用戶端 URL（會記錄警告）。<strong>務必設定它。</strong>
		</li>
		<li>
			<strong>enabled_nips 與 disabled_nips</strong> — 允許清單優先：當 <code>enabled_nips</code> 非空時，只公佈其中的 NIP，<code>disabled_nips</code> 被忽略。兩者都需要重新啟動。
		</li>
		<li>
			<strong>reject_ephemeral</strong> — 類型 20000-29999 被拒絕，但 NIP 要求轉送的豁免類型仍會轉送：22242、27235、28934/28935/28936、24133、23194/23195、24242 與 21059。SIGHUP 時生效。
		</li>
		<li>
			<strong>enabled_git</strong> — 選用的 NIP-34：接受類型 1617-1633 與 30617/30618 並公佈 NIP-34。預設關閉，因為修補程式負載可能很大。SIGHUP 時生效。
		</li>
	</ul>

	<h2>[server] 區段 — 伺服器設定</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>"127.0.0.1"</code></td><td>綁定位址；0.0.0.0 接受來自任何位置的連線</td></tr>
			<tr><td><code>port</code></td><td>integer</td><td><code>8080</code></td><td>連接埠（1-65535）；80 連接埠需要 root</td></tr>
			<tr><td><code>api_host</code></td><td>string</td><td><code>""</code></td><td>專用於 REST API 的主機名稱</td></tr>
			<tr><td><code>metrics_enabled</code></td><td>boolean</td><td><code>true</code></td><td>在 /metrics 提供 Prometheus 指標</td></tr>
			<tr><td><code>ws_paths</code></td><td>string</td><td><code>"root"</code></td><td>WebSocket 端點路徑：root、inbox-outbox 或 all</td></tr>
			<tr><td><code>inbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>誰可以寫入 /inbox："any" 或 "relay"（事件仍須帶 p 標籤）</td></tr>
			<tr><td><code>outbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>誰可以寫入 /outbox："any"（NIP-42 認證公鑰自己的事件）或 "relay"</td></tr>
			<tr><td><code>trusted_proxies</code></td><td>array of strings</td><td><code>[]</code></td><td>其 X-Forwarded-For 受信任的反向代理位址/CIDR（空 = 不信任任何代理）</td></tr>
		</tbody>
	</table>
	</div>
	<h3>鍵的詳細說明</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> 綁定所有 IPv4 介面；<code>127.0.0.1</code> 僅本機。</li>
		<li><strong>port</strong> — 1-65535；80 連接埠需要 root。這一個連接埠同時提供 WebSocket 中繼、NIP-11 文件、REST API 與 NIP-86 RPC。</li>
		<li>
			<strong>api_host</strong> — 將 REST API 專用於單一主機名稱，使 API 與中繼可以在反向代理後共用一個連接埠。啟動時固定 — 需要重新啟動。
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> 只提供 /，<code>inbox-outbox</code> 只提供 /inbox 與 /outbox，<code>all</code> 兩者都提供。啟動時固定 — 需要重新啟動。
		</li>
		<li>
			<strong>trusted_proxies</strong> — 只列出代理本身的位址（同主機上 nginx/Caddy 用回環位址，雲端用負載平衡器的來源網段）。設定後，用戶端 IP 從最後一個不受信任的 <code>X-Forwarded-For</code> 條目推導，用於按 IP 的上限、速率限制、<code>blockip</code> 與日誌。切勿加入用戶端能直接存取的位址 — 它們可以偽造該標頭並繞過按 IP 限制。啟動時固定 — 需要重新啟動。
		</li>
	</ul>

	<h2>[rpc] 區段 — NIP-86 管理</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>management_token</code></td><td>string</td><td><code>""</code></td><td>管理 API 的 Bearer token</td></tr>
			<tr><td><code>admin_pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>用於 NIP-98 管理認證的管理員公鑰</td></tr>
			<tr><td><code>max_admin_body_bytes</code></td><td>integer</td><td><code>65536</code></td><td>NIP-86 管理 RPC 的請求主體限制</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		NIP-86 RPC 掛載在中繼的公開 <code>POST /</code> 路由上 — 沒有單獨的管理連接埠。舊指南中 <code>management_token</code> 與 <code>admin_pubkey</code> 有時出現在 <code>[server]</code> 下；那些寫法是這些 <code>[rpc]</code> 鍵的舊版別名。
	</p>

	<h2>[limits] 區段 — 限制與保護</h2>
	<h3>連線與訊息</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>max_connections</code></td><td>integer</td><td><code>10000</code></td><td>最大並行連線數</td></tr>
			<tr><td><code>max_connections_per_ip</code></td><td>integer</td><td><code>64</code></td><td>每個來源 IP 的最大連線數</td></tr>
			<tr><td><code>max_ws_message_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>每則 WebSocket 訊息/框架的最大位元組數</td></tr>
			<tr><td><code>socket_recv_buffer_kb</code></td><td>integer</td><td><code>64</code></td><td>每連線核心接收緩衝區（KiB）</td></tr>
			<tr><td><code>max_out_queue_bytes</code></td><td>integer</td><td><code>262144</code></td><td>每連線出站佇列上限（位元組）</td></tr>
			<tr><td><code>ws_idle_timeout_secs</code></td><td>integer</td><td><code>300</code></td><td>閒置連線在此時間後關閉</td></tr>
			<tr><td><code>http_read_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>HTTP 請求標頭逾時（slow-loris 防禦）</td></tr>
			<tr><td><code>max_connections_per_sec_per_ip</code></td><td>integer</td><td><code>0</code></td><td>每個來源 IP 每秒最大新連線數</td></tr>
		</tbody>
	</table>
	</div>
	<h3>訂閱與查詢</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>max_filters</code></td><td>integer</td><td><code>20</code></td><td>每個 REQ 的最大過濾器數</td></tr>
			<tr><td><code>max_subscriptions</code></td><td>integer</td><td><code>20</code></td><td>每連線的最大訂閱數</td></tr>
			<tr><td><code>max_limit</code></td><td>integer</td><td><code>500</code></td><td>REQ limit 的上限</td></tr>
			<tr><td><code>max_count</code></td><td>integer</td><td><code>2000</code></td><td>COUNT 結果的上限</td></tr>
			<tr><td><code>max_sub_id_len</code></td><td>integer</td><td><code>64</code></td><td>訂閱 id 最大長度（字元，非位元組）</td></tr>
			<tr><td><code>max_sub_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>每連線的訂閱過濾器總位元組數</td></tr>
			<tr><td><code>max_req_response_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>單一 REQ 回應可傳送的總位元組上限</td></tr>
		</tbody>
	</table>
	</div>
	<h3>事件</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>max_content_bytes</code></td><td>integer</td><td><code>65536</code></td><td>事件內容最大字元數</td></tr>
			<tr><td><code>max_tags</code></td><td>integer</td><td><code>2000</code></td><td>每個事件的最大標籤數</td></tr>
			<tr><td><code>max_tag_value_bytes</code></td><td>integer</td><td><code>1024</code></td><td>每個標籤值的最大位元組數</td></tr>
			<tr><td><code>max_created_at_future_secs</code></td><td>integer</td><td><code>3600</code></td><td>容忍的 created_at 未來偏移</td></tr>
			<tr><td><code>group_late_publish_secs</code></td><td>integer</td><td><code>3600</code></td><td>容忍的 NIP-29 群組管理事件延遲（秒）</td></tr>
			<tr><td><code>max_neg_items</code></td><td>integer</td><td><code>100000</code></td><td>每次 NIP-77 negentropy 同步的最大記錄數</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		舊版別名：<code>limits.require_pow</code>、<code>limits.new_pubkey_min_age_secs</code> 與 <code>limits.max_indexed_words</code> 仍被接受為 <code>relay.require_pow</code>、<code>relay.new_pubkey_min_age_secs</code> 與 <code>database.max_indexed_words</code> 的別名。
	</p>
	<h3>REST API</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>max_api_concurrent</code></td><td>integer</td><td><code>8</code></td><td>最大並行 /api/v1 請求數</td></tr>
			<tr><td><code>max_api_limit</code></td><td>integer</td><td><code>5000</code></td><td>API limit 參數的上限</td></tr>
			<tr><td><code>max_api_offset</code></td><td>integer</td><td><code>50000</code></td><td>API offset 參數的上限</td></tr>
			<tr><td><code>max_api_fetch</code></td><td>integer</td><td><code>55001</code></td><td>offset 查詢的最大預取視窗 — 必須涵蓋 max_api_offset + max_api_limit + 1（0 = 無限制）</td></tr>
			<tr><td><code>max_api_search_bytes</code></td><td>integer</td><td><code>2048</code></td><td>API search 參數的最大位元組數</td></tr>
		</tbody>
	</table>
	</div>
	<h3>即時扇出</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>live_batch_interval_ms</code></td><td>integer</td><td><code>20</code></td><td>即時事件重新整理頻率（毫秒）</td></tr>
			<tr><td><code>live_batch_size</code></td><td>integer</td><td><code>32</code></td><td>每個即時批次的最大事件數</td></tr>
			<tr><td><code>live_buffer</code></td><td>integer</td><td><code>65536</code></td><td>即時扇出佇列大小</td></tr>
		</tbody>
	</table>
	</div>

	<h2>[database] 區段 — 資料庫</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>path</code></td><td>string</td><td><code>"./data"</code></td><td>資料庫目錄（LMDB）</td></tr>
			<tr><td><code>max_dbs</code></td><td>integer</td><td><code>32</code></td><td>LMDB 最大具名資料庫數</td></tr>
			<tr><td><code>max_readers</code></td><td>integer</td><td><code>128</code></td><td>LMDB 最大並行讀取者數</td></tr>
			<tr><td><code>map_size</code></td><td>integer</td><td><code>1073741824</code> (1 GB)</td><td>記憶體映射大小的下限（位元組）</td></tr>
			<tr><td><code>max_map_size</code></td><td>integer</td><td><code>1099511627776</code> (1 TB)</td><td>記憶體映射上限（位元組）</td></tr>
			<tr><td><code>purge_interval_secs</code></td><td>integer</td><td><code>300</code></td><td>NIP-40 清除間隔（秒）</td></tr>
			<tr><td><code>search_index</code></td><td>boolean</td><td><code>true</code></td><td>啟用 NIP-50 詞索引</td></tr>
			<tr><td><code>reader_threads</code></td><td>integer</td><td><code>2</code></td><td>專用掃描執行緒</td></tr>
			<tr><td><code>max_indexed_words</code></td><td>integer</td><td><code>32</code></td><td>每個事件內容被索引的單詞數</td></tr>
			<tr><td><code>meta_index</code></td><td>boolean</td><td><code>true</code></td><td>寫入掃描預過濾使用的每事件中繼資料標頭</td></tr>
			<tr><td><code>disabled_fsync</code></td><td>boolean</td><td><code>false</code></td><td>跳過每個寫入批次後的同步磁碟清除</td></tr>
			<tr><td><code>db_buffer_size</code></td><td>integer</td><td><code>2048</code></td><td>每連線 WebSocket 初始緩衝區（位元組）</td></tr>
			<tr><td><code>db_request_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>資料庫請求在失敗前可等待的時長</td></tr>
			<tr><td><code>max_db_queue_msgs</code></td><td>integer</td><td><code>4096</code></td><td>快速失敗前排隊的待處理訊息上限</td></tr>
			<tr><td><code>max_db_queue_events</code></td><td>integer</td><td><code>262144</code></td><td>快速失敗前排隊批次內的事件上限</td></tr>
			<tr><td><code>max_db_queue_bytes</code></td><td>integer</td><td><code>268435456</code> (256 MiB)</td><td>快速失敗前排隊的資料庫請求位元組上限（0 = 無位元組上限）</td></tr>
		</tbody>
	</table>
	</div>
	<h3>鍵的詳細說明</h3>
	<ul>
		<li>
			<strong>map_size</strong> — 記憶體映射的下限：映射始終至少以該大小開啟。
		</li>
		<li>
			<strong>max_map_size</strong> — 上限，以稀疏虛擬保留方式開啟：實體磁碟只隨實際寫入的資料成長。當遇到 <code>database map is full</code> 時提高它。
		</li>
		<li>
			<strong>search_index = false</strong> — 搜尋仍可用（針對內容的全詞比對）但掃描會更慢；在微型 VPS 上它可將資料庫減半。小型執行個體推薦。
		</li>
		<li>
			<strong>disabled_fsync</strong> — 以持久性換取輸送量：寫入提交到作業系統頁快取，斷電可能遺失最近的寫入。
		</li>
	</ul>

	<h2>[daemon] 區段 — 常駐程式</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>pid_file</code></td><td>string</td><td><code>"./nostrfy.pid"</code></td><td>PID 檔案路徑</td></tr>
			<tr><td><code>log_file</code></td><td>string</td><td><code>"./nostrfy.log"</code></td><td>日誌檔案路徑</td></tr>
			<tr><td><code>stats_file</code></td><td>string</td><td><code>"./nostrfy.stats.json"</code></td><td>統計檔案路徑</td></tr>
			<tr><td><code>stats_interval_secs</code></td><td>integer</td><td><code>5</code></td><td>統計寫入間隔（秒）</td></tr>
			<tr><td><code>max_log_size_bytes</code></td><td>integer</td><td><code>52428800</code> (50 MB)</td><td>日誌輪替大小（0 = 不輪替）</td></tr>
			<tr><td><code>max_log_files</code></td><td>integer</td><td><code>5</code></td><td>保留的輪替日誌代數</td></tr>
		</tbody>
	</table>
	</div>
	<p>路徑相對於設定檔所在目錄解析，因此常駐程式變更工作目錄後它們仍然有效。</p>

	<h2>[access] 區段 — 存取控制</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>restrict_relay</code></td><td>boolean</td><td><code>false</code></td><td>只有允許清單中的公鑰可以發布</td></tr>
			<tr><td><code>blocked_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>要拒絕的類型</td></tr>
			<tr><td><code>allowed_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>類型允許清單；非空時只接受這些類型</td></tr>
			<tr><td><code>blocked_ips</code></td><td>array of strings</td><td><code>[]</code></td><td>連線時拒絕的 IP 位址</td></tr>
			<tr><td><code>method_grants</code></td><td>table: pubkey → array of strings</td><td><code>&#123;&#125;</code></td><td>非管理員公鑰的 NIP-86 方法授權（執行階段用 <code>assignmethod</code> 管理）</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		公鑰允許/拒絕清單<strong>不是</strong>設定鍵 — 它們位於中繼資料庫（LMDB）中並在執行階段管理：
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — 只有允許清單中的公鑰可以<strong>發布</strong>，而讀取對所有人保持開放（任何用戶端仍可訂閱與取得）。
		</li>
		<li>被拒絕的公鑰在發布時始終被拒絕，讀取時也永遠不會被提供。</li>
		<li>
			<strong>method_grants</strong> — 非管理員公鑰的 NIP-86 方法授權（公鑰 → 方法名稱，例如允許版主使用 <code>banevent</code> 與 <code>listbannedevents</code>）。首次執行時從設定初始化，之後在執行階段用 NIP-86 <code>assignmethod</code>/<code>unassignmethod</code> 管理（用 <code>listmethodassignees</code> 檢視）。只有審核與讀取方法可被授權 — 權限、角色、邀請碼與中繼身分管理保持僅管理員，且被封鎖的公鑰即使有授權也會被拒絕。參閱<a href={p('/docs/management/')}>管理 API</a>。
		</li>
	</ul>

	<h2>[blossom] 區段 — Blossom 檔案伺服器</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>鍵</th><th>類型</th><th>預設值</th><th>說明</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>""</code></td><td>Blossom 伺服器的主機名稱（空 = 停用）</td></tr>
			<tr><td><code>storage</code></td><td>string</td><td><code>"local"</code></td><td>後端："local"（local_path）或 "s3"（S3 相容儲存桶）</td></tr>
			<tr><td><code>local_path</code></td><td>string</td><td><code>"/var/lib/nostrfy/images"</code></td><td>媒體檔案的本機儲存根目錄</td></tr>
			<tr><td><code>max_upload_bytes</code></td><td>integer</td><td><code>20971520</code> (20 MB)</td><td>媒體檔案最大大小</td></tr>
			<tr><td><code>min_free_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>低於該磁碟空間時拒絕上傳</td></tr>
			<tr><td><code>s3_endpoint</code></td><td>string</td><td><code>""</code></td><td>S3 相容端點（例如 R2）</td></tr>
			<tr><td><code>s3_region</code></td><td>string</td><td><code>""</code></td><td>S3 區域（R2 使用 "auto"）</td></tr>
			<tr><td><code>s3_bucket</code></td><td>string</td><td><code>""</code></td><td>S3 儲存桶名稱</td></tr>
			<tr><td><code>s3_access_key</code></td><td>string</td><td><code>""</code></td><td>S3 access key</td></tr>
			<tr><td><code>s3_secret_key</code></td><td>string</td><td><code>""</code></td><td>S3 secret key</td></tr>
			<tr><td><code>restrict_uploads</code></td><td>boolean</td><td><code>false</code></td><td>只有允許清單中的公鑰可以上傳</td></tr>
		</tbody>
	</table>
	</div>

	<h2>執行階段重載（SIGHUP）</h2>
	<p>
		編輯檔案並傳送 <code>kill -HUP $(cat nostrfy.pid)</code> 會<strong>無需重新啟動</strong>重載設定。大多數設定立即生效；少數在啟動時固定：
	</p>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>SIGHUP 時生效</th><th>需要重新啟動</th></tr></thead>
		<tbody>
			<tr><td>relay.name、description、pubkey、contact、icon、post_policy、public_url</td><td>relay.private_key</td></tr>
			<tr><td>reject_ephemeral、enabled_git、enabled_nip78_auth</td><td>relay.livekit_*、enabled_nips / disabled_nips</td></tr>
			<tr><td>大部分 [limits]</td><td>api_host、trusted_proxies、metrics_enabled、ws_paths、database.*、daemon 大小、限制上限、blossom.*</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] 不會由重載套用 — 清單在啟動時初始化一次，之後透過 NIP-86 在執行階段管理。當需要重新啟動的設定發生變化時日誌會警告，少數啟動時擷取的設定不會被重載檢查。
	</p>

	<Callout type="warning" title="常見錯誤">
		<div class="overflow-x-auto">
		<table>
			<thead><tr><th>錯誤</th><th>修正</th></tr></thead>
			<tbody>
				<tr><td>未設定 public_url</td><td>設定 <code>wss://...</code></td></tr>
				<tr><td>host 保持 127.0.0.1</td><td>外部用戶端無法連線</td></tr>
				<tr><td>啟用 NIP-29 但未設定 private_key</td><td>執行 <code>nostrfy genkey</code> + 重新啟動</td></tr>
				<tr><td>restrict_relay 為 true 但允許清單為空</td><td>所有人被鎖定</td></tr>
				<tr><td>變更僅重新啟動生效的鍵卻只送 SIGHUP</td><td>使用 <code>nostrfy restart</code></td></tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
