<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # reload the config without a restart`;
</script>

<DocsTitle
	title="快速開始指南"
	description="從安裝到執行中的 Nostr 中繼只需幾分鐘：撰寫設定、驗證、啟動常駐程式並執行首次健康檢查。"
/>

<div class="doc-body">
	<h2>1. 建立設定</h2>
	<p>
		<code>nostrfy init</code> 會寫入一份帶完整註解的預設 <code>nostrfy.toml</code>：
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>用文字編輯器開啟並調整 — 每個選項都有註解。</p>

	<h2>2. 驗證設定</h2>
	<p>
		<code>nostrfy check</code> 強烈建議在啟動前執行；如果哪裡有問題，它會準確回報問題所在。
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. 啟動中繼</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="以常駐程式方式執行。加上 --foreground 可在終端機中執行。"
	/>
	<p>然後用健康端點驗證中繼已啟動：</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. 將用戶端指向它</h2>
	<p>
		在同一台機器上，連線到 <code>ws://&lt;host&gt;:8080</code>。預設主機是
		<code>127.0.0.1</code>，只接受本機連線。要從其他機器存取中繼，
		請在設定中設定 <code>server.host = "0.0.0.0"</code>：
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		要使用 <code>wss://</code>，需要在前端部署終止 TLS 的代理（nginx 或 Caddy）— 參閱
		<a href={p('/docs/deploy/')}>部署</a>文件。
	</p>

	<h2>5. 停止與重新啟動</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart 會重新讀取設定；SIGHUP 無需重新啟動即可重載大部分設定。"
	/>

	<h2>有效維運</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> 顯示即時統計 — 也可透過 HTTP 以
			<code>/relay/stats</code> 與 <code>/metrics</code> 取得。
		</li>
		<li>日誌寫入 <code>daemon.log_file</code> 並自動輪替。</li>
		<li>
			<code>RUST_LOG</code> 控制日誌等級（例如 <code>RUST_LOG=nostrfy=debug</code>）。
		</li>
	</ul>

	<Callout type="warning" title="外部用戶端無法連線？">
		server.host 預設為 127.0.0.1。設定為 host = "0.0.0.0" 並重新啟動。
	</Callout>

	<Callout type="tip" title="下一步">
		在<a href={p('/docs/configuration/')}>設定參考</a>中調整中繼的每一個面向。
	</Callout>
</div>
