<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="執行中繼"
	description="針對你的 nostrfy 中繼：啟動與停止、日誌與統計、設定熱重載、多執行個體與大規模調校。"
/>

<div class="doc-body">
	<h2>啟動與停止</h2>
	<p>以背景常駐程式方式啟動中繼：</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>或在終端機中前景執行：</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>停止：</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>驗證已啟動：</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>日誌與統計</h2>
	<p>
		常駐程式寫入 <code>daemon.log_file</code>。當檔案超過 <code>max_log_size_bytes</code> 時會
		自動輪替（<code>nostrfy.log.1</code>、<code>.2</code>……最多 <code>max_log_files</code> 代）：
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>日誌等級由 <code>RUST_LOG</code> 環境變數控制（例如 <code>RUST_LOG=debug</code>）。</p>
	<h3>統計</h3>
	<p>從 CLI 取得即時統計：</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>或透過 HTTP：</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>顯示連線數、接受/拒絕的事件、資料庫大小等。</p>
	<h3>Prometheus 指標</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>熱重載（SIGHUP）</h2>
	<p>編輯設定檔後，無需重新啟動即可重載：</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>重載時生效</th>
				<th>需要重新啟動</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>中繼身分、public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>大部分 [limits]、reject_ephemeral、enabled_git、enabled_nip78_auth</td>
				<td>api_host、metrics_enabled、LiveKit 設定</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips、server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.*（含 search_index）、blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>當需要重新啟動的設定發生變化時，日誌會發出警告。</p>

	<h2>執行多個執行個體</h2>
	<p>
		nostrfy 支援在同一台伺服器上執行多個獨立中繼（不同連接埠）。每個執行個體需要自己的
		<code>server.port</code>、<code>[daemon]</code> 的
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		（共用值會讓第二個執行個體以 <code>already running</code> 拒絕啟動）、
		<code>database.path</code>，以及（如使用）各自的 <code>api_host</code> / <code>blossom.host</code>：
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>每個執行個體用各自的設定管理：<code>nostrfy --config /etc/nostrfy/a.toml start</code> 等。</p>

	<h2>大規模部署</h2>
	<p>
		該中繼設計為可在單一主機上擴展到數十萬連線 — 即時投遞只喚醒能符合事件的訂閱者，
		且每連線記憶體佔用很小。推向百萬級需要主機級調校：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>設定</th>
				<th>值</th>
				<th>原因</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 目標連線數的 2 倍（+1000）</td>
				<td>每個連線佔用一個 fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>連線突發時的待處理 accept 佇列</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>較低（例如 10）</td>
				<td>更快回收 TIME_WAIT 通訊端</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 或 2</td>
				<td>LMDB 映射是大型稀疏虛擬保留</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		在 FreeBSD 上，對應的參數是 <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> 加
		<code>ulimit -n</code>，並用 <code>kern.ipc.somaxconn</code> 替代 <code>net.core.somaxconn</code>。
		每連線的核心記憶體約 80 KiB、使用者空間約 10 KiB，因此一百萬連線在資料庫之外大約需要 90 GiB 的
		核心 + 使用者記憶體。
	</p>

	<h2 id="throughput">輸送量（每秒事件數）</h2>
	<p>
		事件寫入受兩項成本約束：Schnorr 簽章驗證（每個事件約 30-50 µs）和 LMDB 寫入器在每個提交批次後
		執行的同步磁碟清除。兩者都可以在 <code>nostrfy.toml</code> 中調整：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>設定</th>
				<th>原因</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>提交到作業系統頁快取（微秒級）；斷電只會遺失上次清除以來的寫入 — 從這裡開始</td>
			</tr>
			<tr>
				<td>CPU 核心 ≥ 8 vCPU</td>
				<td>批次 EVENT 路徑跨核心平行驗證簽章</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>為寫入密集型執行個體去掉每事件的 NIP-50 詞索引寫入</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		平行簽章驗證在待處理批次中一次驗證所有簽章，使用工作執行緒池
		（上限 8；少於 16 個事件的批次內聯驗證）。每個事件的廉價檢查仍然先行，因此拒絕
		原因文字與循序路徑完全相同 — 只有 Schnorr 工作分散到各核心。單執行緒
		建置保持循序執行。
	</p>

	<h2>固定的反濫用界線</h2>
	<p>
		為保持中繼在濫用下仍能回應，有幾項硬性界線是固定的（不可設定）：
	</p>
	<ul>
		<li>
			單一過濾器最多攜帶 <strong>512</strong> 個 <code>ids</code>、<code>authors</code> 或
			<code>kinds</code> 條目；<code>#...</code> 標籤值每個過濾器共享單獨的 <strong>512</strong>
			值預算。更大的過濾器會被拒絕（<code>CLOSED invalid: ...</code>）。
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> 最多追蹤 10,000 個來源 IP；滿時，未見過的
			IP 會被拒絕（fail closed）。
		</li>
		<li>
			<code>ids</code> 過濾器中的事件 id 可以是前綴，但只有完整的 32 位元組 id 和偶數長度
			前綴才能符合（奇數長度/空條目在歷史與即時投遞中都會被忽略）。
		</li>
		<li>
			過長的索引鍵（標籤值、內容詞、超出 LMDB 鍵大小限制的 <code>d</code> 標籤）在
			索引時會被跳過；事件仍會被儲存。
		</li>
	</ul>
</div>
