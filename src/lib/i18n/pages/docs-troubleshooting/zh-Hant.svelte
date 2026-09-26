<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# 在設定檔中將 port = 8080 改掉，然後：
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# 如果 nostrfy 正在執行，重新啟動它
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# 如果存在過期的 pid 檔案，刪除它
rm -f nostrfy.pid`;
	const tomlExample = `# 正確範例
name = "my relay"        # 字串用 " 包起來
port = 8080              # 數字直接寫
enabled_nips = [1, 50]   # 清單用 [ ] 包裹`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# 從外部（使用伺服器的 IP/連接埠）
curl http://YOUR_SERVER_IP:8080/health

# 檢查防火牆（範例：ufw）
sudo ufw status
# 如需要，開放連接埠
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" 以位元組為單位`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# 使用本機 Blossom 儲存時，也要備份 [blossom].local_path。
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="疑難排解"
	description="你最可能遇到的錯誤 — 連接埠、權限、TLS、缺少 NIP、發布與逾時 — 附逐步修正方法。"
/>

<div class="doc-body">
	<p><strong>首先檢查三件事：</strong></p>
	<ul>
		<li><code>nostrfy check</code> 驗證你的設定（大多數錯誤是設定錯誤）。</li>
		<li><code>tail -f nostrfy.log</code> 顯示日誌 — 原因幾乎總在那裡。</li>
		<li><code>nostrfy restart</code> 乾淨地重新啟動常駐程式。</li>
	</ul>

	<h2 id="cannot-start">無法啟動</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>原因：</strong>80 連接埠只能由 root 綁定。</p>
	<p><strong>修正：</strong>用 <code>sudo</code> 執行，或將連接埠改為 8080 之類。</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>原因：</strong>另一個處理程序（舊的 nostrfy 或不同的伺服器）已經佔用了
		該連接埠。
	</p>
	<p><strong>修正：</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>原因：</strong>nostrfy 已在執行；<code>start</code> 拒絕啟動第二個
		執行個體。
	</p>
	<p><strong>修正：</strong>使用 <code>nostrfy restart</code>，或直接使用正在執行的執行個體。</p>

	<h3><code>nostrfy stop</code> 卡住 / <code>did not stop in time</code></h3>
	<p><strong>原因：</strong>常駐程式卡住或無回應。</p>
	<p><strong>修正：</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>原因：</strong>設定檔不是有效的 TOML。常見錯誤：忘記給字串加引號，
		或同一個鍵寫了兩次。
	</p>
	<p><strong>修正：</strong>錯誤訊息包含行號。檢查並修正該行。</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>原因：</strong>設定檔不存在。</p>
	<p><strong>修正：</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>原因：</strong><code>relay.private_key</code> 不是有效的 64 字元十六進位金鑰。
	</p>
	<p>
		<strong>修正：</strong>執行 <code>nostrfy genkey</code> 產生正確的金鑰（或設定
		<code>private_key = ""</code>）。
	</p>

	<h3>啟動時日誌中有大量警告</h3>
	<p><code>[WARN]</code> 日誌行告訴你設定問題。主要的：</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>警告</th>
				<th>意義與修正</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					未設定 <code>public_url</code> — NIP-42 認證、NIP-62 消除與 NIP-98 管理認證
					將無法運作。設定 <code>wss://your-public-url</code>。
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>群組需要金鑰。執行 <code>nostrfy genkey</code>。</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>設定中有未使用的舊版鍵（或拼寫錯誤）。檢查鍵名。</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					區段名稱拼寫錯誤（例如 <code>[serve]</code> 而不是 <code>[server]</code>）。
					修正它。
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>這個組合會把所有人鎖在外面。變更其中之一。</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					PoW 要求太高，沒人能發布。降低 <code>require_pow</code>。
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">無法連線或行為異常</h2>

	<h3>用戶端收到 <code>connection refused</code></h3>
	<p>
		<strong>原因：</strong>中繼未執行，或防火牆封鎖了連接埠。
	</p>
	<p><strong>修正：</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>外部用戶端無法連線，本機可以</h3>
	<p>
		<strong>原因：</strong><code>server.host</code> 仍是 <code>127.0.0.1</code>（預設），
		它只接受本機連線。
	</p>
	<p>
		<strong>修正：</strong>在設定中設定 <code>host = "0.0.0.0"</code> 並重新啟動。
	</p>

	<h3>無法透過 Cloudflare Tunnel 連線</h3>
	<p>使用 Cloudflare Tunnel 時：</p>
	<ul>
		<li>
			中繼執行明文 HTTP；Cloudflare 終止 TLS，因此用戶端使用 <code>wss://</code>。在中繼上設定
			<code>public_url = "wss://..."</code>（這使 NIP-42 認證正常運作）。
		</li>
		<li>
			Cloudflare 會加入 <code>X-Forwarded-Proto</code> 標頭。nostrfy 對
			<code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> 值一視同仁，因此通常
			無需額外設定。
		</li>
	</ul>

	<h3><code>error: message too large</code> 且連線關閉</h3>
	<p>
		<strong>原因：</strong>單一訊息超過 <code>max_ws_message_bytes</code>（預設 1 MB）。
	</p>
	<p>
		<strong>修正：</strong>如果需要更大的事件，提高 <code>limits.max_ws_message_bytes</code> — 但
		也要檢查用戶端自己的限制。
	</p>

	<h3><code>too many subscriptions</code> / <code>too many filters</code> 錯誤</h3>
	<p>
		<strong>原因：</strong>達到了每連線上限（訂閱預設 20，過濾器
		預設 20）。
	</p>
	<p>
		<strong>修正：</strong>提高 <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code>（並檢查用戶端設定）。
	</p>

	<h3>負載下新連線被拒絕</h3>
	<p>
		<strong>原因：</strong>達到了 <code>max_connections</code>（預設 10000）、觸發了按 IP 上限
		（<code>max_connections_per_ip</code>，預設 64），或每秒連線速率限制
		（<code>max_connections_per_sec_per_ip</code>）拒絕了突發。這些上限適用於每個連線 —
		WebSocket 與明文 HTTP 一樣。
	</p>
	<p>
		<strong>修正：</strong>檢查並調整設定。<code>max_connections_per_ip = 0</code> 停用
		按 IP 上限；<code>max_connections_per_sec_per_ip = 0</code> 停用速率限制。這三項
		設定需要重新啟動。
	</p>

	<h3>連線一段時間後中斷</h3>
	<p>
		<strong>原因：</strong>如果設定了 <code>ws_idle_timeout_secs</code>，閒置連線會被關閉。
		健康的用戶端會用 PONG 回應中繼的 PING 並保持連線；只有死掉的一端會被清理。
	</p>
	<p>
		<strong>修正：</strong>這是有意為之 — 預設 300 秒。設定
		<code>ws_idle_timeout_secs = 0</code> 完全停用它。
	</p>

	<h3>訂閱以 <code>CLOSED ... response too large</code> 結束</h3>
	<p>
		<strong>原因：</strong>一個 REQ 的已儲存事件超過了 <code>max_req_response_bytes</code>
		（預設 32 MiB）。只在事件非常大或過濾器非常寬時發生。
	</p>
	<p>
		<strong>修正：</strong>縮小過濾器（更嚴格的 <code>since</code>/<code>until</code>、更低的
		<code>limit</code>）或提高 <code>max_req_response_bytes</code>（0 停用預算）。
	</p>

	<h3>NIP-11 <code>supported_nips</code> 清單中缺少某個 NIP</h3>
	<p>
		<strong>原因：</strong>公佈的清單是動態的 — 當某個 NIP 定義的所有類型都被
		拒絕時它會被隱藏：它們都在 <code>blocked_kinds</code> 中、都不在
		<code>allowed_kinds</code> 中，或它們是 <code>reject_ephemeral</code> 拒絕的臨時類型。
		NIP-29/43/66 還需要 <code>relay.private_key</code>，NIP-86 需要
		<code>rpc.management_token</code> 或 <code>rpc.admin_pubkey</code>。
	</p>
	<p>
		<strong>修正：</strong>檢查使用中的存取清單 — NIP-86 <code>listallowedkinds</code> 顯示
		類型允許清單，<code>GET /</code> 立即顯示生效的 <code>supported_nips</code>。
		移除封鎖的類型或 <code>reject_ephemeral</code> 設定。
	</p>

	<h2 id="publishing">發布時的錯誤</h2>
	<p>
		發布失敗時，<code>OK</code> 訊息的第 4 個元素解釋原因。常見的：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>錯誤</th>
				<th>意義與修正</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>事件簽章無效（可能是用戶端金鑰損壞）。</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					內容超過 <code>max_content_bytes</code>（預設 64K 字元）。縮短它或
					提高限制。
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>標籤數超過 <code>max_tags</code>（預設 2000）。</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					時間戳過於超前（超過 <code>max_created_at_future_secs</code>）。
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					內容或標籤包含類似 nsec 的字串。
					<strong>切勿發布金鑰。</strong>移除該字串後事件會被接受。
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>同一事件已儲存（正常）。</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>該公鑰被封鎖（<code>banpubkey</code>）或在允許清單之外。</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>此類型被禁止。</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					該公鑰超過了 <code>max_events_per_min_per_pubkey</code>（滑動 60 秒
					視窗）。等一分鐘再試，或提高/停用該限制。
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>該事件 id 被封鎖。</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>重新發布已刪除的事件。</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					需要認證（當 <code>relay.require_auth</code> 開啟時）。
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					帳號建立時間在 <code>new_pubkey_min_age_secs</code> 之內。等待並重試。
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>群組不存在（先建立它）。</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					群組是 <code>closed</code>；沒有邀請碼的加入請求不會被處理。
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Blossom 檔案伺服器</h2>

	<h3>上傳失敗並傳回 <code>401</code></h3>
	<p>上傳授權事件（kind 24242）被拒絕。檢查：</p>
	<ul>
		<li>
			權杖的 <code>expiration</code> 標籤<strong>存在</strong>且設定為未來的 unix 時間戳，
		</li>
		<li>對於 upload/media/delete，權杖帶有包含 blob 的 sha256 的 <code>x</code> 標籤，</li>
		<li>
			<code>server</code> 標籤（如果存在）正好是設定的 <code>blossom.host</code>
			（僅主機名稱，無 scheme/path），
		</li>
		<li>權杖是在最近 10 分鐘內簽章的（防止重放的新鮮度視窗），</li>
		<li>且簽章金鑰是上傳者自己的。</li>
	</ul>

	<h3>上傳失敗並傳回 <code>403</code></h3>
	<p>
		設定了 <code>blossom.restrict_uploads = true</code> 且該公鑰不在允許清單中 — 用
		<code>nostrfy blossom allow npub1...</code> 加入它（常駐程式會自動重載）。如果清單看起來
		不對，<code>nostrfy blossom list</code> 會顯示它。
	</p>

	<h3>上傳失敗並傳回 <code>409</code></h3>
	<p>
		用戶端傳送的 <code>X-SHA-256</code> 標頭與實際請求主體不符（
		宣告的雜湊是在不同位元組上計算的 — 例如檔案在雜湊與傳送之間發生了變化）。
		用戶端可以完全省略該標頭。
	</p>

	<h3>媒體主機上的 <code>GET /</code> 傳回 NIP-11 文件</h3>
	<p>
		請求沒有帶著 Blossom Host 標頭到達中繼。在反向代理中將 <code>media.example.com</code>
		（或 <code>blossom.host</code> 設定的值）指向同一連接埠，然後
		<code>nostrfy restart</code>。
	</p>

	<h3>blob 在上傳後立即 404</h3>
	<p>
		檔案以其 SHA-256 內容定址：使用上傳回應中傳回的確切雜湊取得它
		（<code>/&lt;sha256&gt;</code> 或 <code>/&lt;sha256&gt;.&lt;ext&gt;</code>）。不符意味著
		用戶端請求的雜湊與它傳送的位元組不同。
	</p>

	<h2 id="search-groups-auth">搜尋、群組與認證</h2>

	<h3>搜尋傳回 0 筆結果 / 意外結果</h3>
	<p>nostrfy 搜尋比對<strong>全詞</strong>。注意：</p>
	<ul>
		<li>
			<code>search = "rust"</code> 比對包含單詞 "rust" 的事件，但 <code>"ru"</code>
			不會作為子字串比對 "rust"。
		</li>
		<li>只搜尋事件內容中的單詞。</li>
		<li>如果 <code>search_index = false</code>，搜尋仍然可用但較慢。</li>
		<li>
			如果 NIP-50 被停用（<code>disabled_nips = [50]</code>），<code>search</code> 被忽略
			（會傳送 NOTICE）。
		</li>
	</ul>

	<h3>群組中繼資料（39000-39005）沒有產生</h3>
	<p>
		<strong>原因：</strong>未設定 <code>relay.private_key</code>。群組快照由
		中繼自己的金鑰簽章，因此沒有它就不會產生任何東西。
	</p>
	<p><strong>修正：</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> 拒絕群組事件</h3>
	<p>
		<strong>原因：</strong>群組不存在。在 NIP-29 中，管理事件與加入請求
		（9021）不能在群組建立（kind 9007）之前針對它。
	</p>
	<p><strong>修正：</strong>先用一個 9007 事件建立群組。</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>原因：</strong>管理操作（新增成員等）需要管理員（帶角色的成員）。
		建立者是管理員。
	</p>
	<p><strong>修正：</strong>請管理員授予你角色，或建立你自己的群組。</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>原因：</strong>群組是 <code>closed</code>；沒有邀請碼的加入請求
		不會被自動批准。
	</p>
	<p><strong>修正：</strong>向管理員索取邀請碼（9009）並用 <code>code</code> 標籤加入。</p>

	<h3>不小心離開了群組，或群組沒有管理員</h3>
	<p>
		<strong>原因：</strong>NIP-29 離開請求（kind 9022）對任何成員都被處理 — 包括
		群組的最後一位管理員，他離開後不會留下管理員。沒有管理員，就沒人能傳送管理事件
		（9000/9001/9002/9008）了。
	</p>
	<p>
		<strong>修正：</strong>用中繼自己的金鑰（<code>relay.private_key</code>，
		即 NIP-11 <code>self</code> 公佈的公鑰）簽署一條管理事件。根據 NIP-29，管理事件可以來自
		「中繼主金鑰或……群組管理員」，因此即使群組沒有管理員，中繼也接受由自己的金鑰簽章的群組管理事件。
		例如，用 <code>kind:9000</code> 還原一位管理員：
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		用中繼金鑰簽章並發布它。或者，用中繼簽章的
		<code>kind:9008</code> 刪除群組（其儲存的事件被清除），然後用 <code>kind:9007</code> 重新建立。
		此復原需要設定 <code>relay.private_key</code>。
	</p>

	<h3>受保護事件被 <code>auth-required</code> 拒絕</h3>
	<p>
		<strong>原因：</strong>NIP-70 受保護事件（帶 <code>-</code> 標籤）只能由
		已認證的作者<strong>在同一連線上</strong>發布。
	</p>
	<p><strong>修正：</strong>發布前在用戶端啟用 NIP-42 認證。</p>

	<h3>AUTH（NIP-42）傳回 <code>false</code></h3>
	<p>常見原因：</p>
	<ol>
		<li>
			未設定或錯誤設定 <code>relay.public_url</code> — AUTH 事件的 <code>relay</code> 標籤與
			中繼的 URL 不符。設定 <code>wss://...</code> 並重新啟動。
		</li>
		<li>挑戰過期 — 你在不同的連線上傳送了 AUTH，或重用了舊的挑戰。</li>
		<li>
			用戶端時鐘偏差 — AUTH 事件的 <code>created_at</code> 必須在
			現在的 ±10 分鐘內。
		</li>
	</ol>

	<h3>NIP-86 管理 API 傳回 <code>401 unauthorized</code></h3>
	<p><strong>原因：</strong>憑證缺失或錯誤。</p>
	<p><strong>修正：</strong></p>
	<ul>
		<li>設定 <code>management_token</code> 並傳送 <code>Authorization: Bearer &lt;token&gt;</code>。</li>
		<li>
			或設定 <code>admin_pubkey</code> 並傳送 NIP-98 認證事件（<code>u</code> 標籤必須與
			中繼 URL 完全相符；需要 <code>payload</code> 標籤）。
		</li>
		<li>如果兩者都未設定，管理 API 完全停用。</li>
	</ul>

	<h3>NIP-98 認證事件因 scheme 或連接埠不同被拒絕</h3>
	<p>
		NIP-98 規範說 <code>u</code> 標籤必須與絕對請求 URL <em>完全</em>相同，因此
		nostrfy 從 <code>relay.public_url</code> 推導期望的 URL：其 authority 加上
		從 WebSocket scheme 映射的 HTTP scheme（<code>wss://</code> → <code>https://</code>，
		<code>ws://</code> → <code>http://</code>，去掉 <code>nostr+</code>）。沒有
		<code>public_url</code> 時，中繼期望它提供的明文 <code>http://host:port</code>。帶有
		其他 scheme、不同/省略連接埠，或不同路徑或查詢的標籤會被拒絕 — 將
		<code>relay.public_url</code> 設定為用戶端簽章的公開位址。每個認證事件也是
		<strong>一次性</strong>的：在其 60 秒
		有效視窗內重放同一個 <code>Authorization</code> 標頭會被拒絕。
	</p>

	<h2 id="db-disk">資料庫與磁碟</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>原因：</strong>達到了 LMDB 記憶體映射上限（預設 1 TB 虛擬位址空間；實際
		磁碟使用隨資料成長）— 實際上就是資料庫滿了。
	</p>
	<p><strong>修正：</strong>提高 <code>database.max_map_size</code> 並重新啟動。</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>原因：</strong>可用磁碟空間少於 32 MB。寫入停止（以保護資料）；讀取
		繼續。
	</p>
	<p>
		<strong>修正：</strong>釋放磁碟空間。一旦有空間，寫入會自動恢復。
		（<code>df -h /path/to/data</code>）
	</p>

	<h3><code>nostrfy check</code> 回報 <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>原因：</strong><code>database.map_size</code> 大於 <code>max_map_size</code>。
	</p>
	<p>
		<strong>修正：</strong>將 <code>map_size</code> 設定為等於或低於 <code>max_map_size</code>（預設值
		就沒問題）。
	</p>

	<h3>檢查資料庫大小</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>備份 / 移動資料庫</h3>
	<p>
		所有資料都在 <code>database.path</code> 目錄中。
		<strong>複製前先停止中繼</strong>（複製使用中的資料庫可能損壞它）。
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">常駐程式操作</h2>

	<h3><code>nostrfy stats</code> 顯示 <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>原因：</strong>統計檔案不存在 — 常駐程式未執行，或它在幾
		秒前才啟動。
	</p>
	<p><strong>修正：</strong>執行 <code>nostrfy start</code>，等幾秒，然後重試。</p>

	<h3>日誌無限成長</h3>
	<p>
		<strong>原因：</strong><code>max_log_size_bytes</code> 為 0（輪替已停用）。
	</p>
	<p>
		<strong>修正：</strong>設定 <code>max_log_size_bytes = 52428800</code>（50 MB）與
		<code>max_log_files = 5</code>。輪替自動進行。
	</p>

	<h3>重載後設定變更沒有生效</h3>
	<p>
		<strong>原因：</strong>你重載（SIGHUP）了啟動時固定的設定：
		<code>private_key</code>、<code>api_host</code>、<code>metrics_enabled</code>、LiveKit 設定，以及
		NIP 啟用/停用清單。
	</p>
	<p>
		<strong>修正：</strong>使用 <code>nostrfy restart</code>。這種情況下日誌包含 "a restart is required"
		警告。
	</p>

	<h3>中繼不斷自行掛掉</h3>
	<p><strong>原因：</strong>機器重新啟動了，或中繼記憶體不足（OOM）。</p>
	<p><strong>修正：</strong></p>
	<ol>
		<li>檢查日誌末尾：<code>tail -50 nostrfy.log</code>。</li>
		<li>
			檢查機器是否重新啟動：<code>uptime</code>（非常短的運行時間意味著重新啟動）。
		</li>
		<li>檢查記憶體：<code>free -h</code>。</li>
		<li>再次啟動中繼：<code>nostrfy start</code>。</li>
	</ol>
	<Callout type="tip" title="提示">
		要在開機時自動啟動 nostrfy，將它註冊為 systemd 服務，以中繼的啟動
		指令作為 <code>ExecStart</code>。
	</Callout>

	<h3>systemd 無法在 80 連接埠啟動中繼</h3>
	<p>
		以 root 執行的 systemd 服務可以綁定 80 連接埠。如果你把 <code>User=</code> 設為一般使用者，
		要嘛使用更高的連接埠（例如 8080），要嘛向單元加入
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code>。
	</p>

	<h2 id="still-not-solved">仍未解決？</h2>
	<ol>
		<li>
			<strong>檢查日誌</strong>：<code>tail -100 nostrfy.log</code> — 它通常會指出直接
			原因。
		</li>
		<li>
			<strong>重新驗證設定</strong>：<code>nostrfy check</code> — 顯示警告與錯誤。
		</li>
		<li>
			<strong>收集重現細節</strong>：你在做什麼、哪個用戶端、確切的錯誤。
		</li>
		<li>
			<strong>在專案倉庫提問</strong>：
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — 提交
			issue 時，附上重現步驟與日誌。
		</li>
	</ol>
</div>
