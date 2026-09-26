<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="nostrfy 簡介"
	description="nostrfy 是什麼、開箱即用的功能，以及這款以 Rust 撰寫的一體化 Nostr 中繼引擎背後的設計理念。"
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> 是
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a> 協定的中繼伺服器。
		它儲存用戶端傳送的事件（貼文、反應、個人檔案……），並依訂閱請求將它們投遞。
	</p>

	<h2>核心特色</h2>
	<ul>
		<li><strong>簡單穩定</strong> — 以 Rust 撰寫；一個二進位檔完成一切。</li>
		<li>
			<strong>快速儲存與搜尋</strong> — LMDB 資料庫，附全文搜尋索引（NIP-50）。
		</li>
		<li>
			<strong>廣泛的 NIP 支援</strong> — 實作 36 個 NIP，外加 Blossom 檔案伺服器：
			刪除、工作量證明、委派、群組、搜尋與管理 API。
		</li>
		<li>
			<strong>易於維運</strong> — 常駐程式模式、日誌輪替、設定熱重載
			（SIGHUP）、即時統計、REST API 與 Prometheus 指標。
		</li>
		<li>
			<strong>易於遷移</strong> — 一行指令匯入現有的
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			資料庫，支援 dry-run、設定合併與安全重複執行
			（<a href={p('/docs/migrating-from-strfry/')}>遷移指南</a>）。
		</li>
	</ul>

	<h2>開箱即用的功能</h2>
	<p>
		單一 <code>nostrfy</code> 二進位檔在一個連接埠上提供：
	</p>
	<ul>
		<li><strong>WebSocket 中繼</strong>與 NIP-11 資訊文件。</li>
		<li>唯讀 <strong>REST API</strong>，位於 <code>/api/v1/...</code> — 在獨立的讀取執行緒上執行，因此 REST 流量永遠不會阻塞 WebSocket 訂閱者。</li>
		<li><strong>Blossom 檔案伺服器</strong>（媒體託管），執行於獨立主機名稱。</li>
		<li><strong>NIP-86 管理 RPC</strong>、健康檢查與 Prometheus <code>/metrics</code>。</li>
	</ul>

	<h2>資源佔用</h2>
	<p>
		nostrfy 已驗證可在 <strong>0.25 vCPU / 512 MB VPS</strong> 上執行。LMDB 記憶體映射是
		1 TiB 的稀疏虛擬保留 — 實體磁碟只隨真實資料成長 — 處理程序記憶體保持平穩：
		資料庫 252 MB 的中繼僅佔用 <strong>7.9 MB 私有 RSS</strong>。
	</p>

	<h2>快速體驗</h2>
	<p>三行指令完成安裝、初始化與啟動：</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>然後驗證中繼已啟動：</p>
	<CodeBlock code={health} lang="bash" />
	<p>並取得它的 NIP-11 文件：</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="下一步">
		依照<a href={p('/docs/quick-start/')}>快速開始</a>完成首次執行，或直接跳到
		<a href={p('/docs/configuration/')}>設定參考</a>來調整中繼。
	</Callout>
</div>
