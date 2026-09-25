<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const lowSpecConfig = `[database]
search_index = false   # halves the database size and saves CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="安裝指南"
	description="環境需求、從原始碼建置、安裝預編譯二進位檔、校驗和驗證，以及在 FreeBSD 上執行 nostrfy 的注意事項。"
/>

<div class="doc-body">
	<h2>環境需求</h2>
	<ul>
		<li>較新的穩定版 Rust 工具鏈（僅在建置中繼時需要）。</li>
		<li>Linux 機器。</li>
		<li>建議 2 GB 或更多記憶體 — 0.25 vCPU / 512 MB VPS 請參閱下方的低規格說明。</li>
	</ul>

	<h3>低規格 VPS（0.25 vCPU / 512 MB）</h3>
	<p>
		即使資料庫超過記憶體，nostrfy 也已驗證可穩定執行。LMDB 映射是
		<strong>稀疏的 1 TiB 虛擬保留</strong> — 實體磁碟只隨寫入的資料成長 —
		處理程序記憶體保持平穩：資料庫 252 MB 的中繼僅佔用 <strong>7.9 MB 私有 RSS</strong>
		（其餘是可回收的檔案快取，核心會在壓力下逐出）。
	</p>
	<p>對於微型 VPS，一項設定影響最大：</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>設定</th>
				<th>效果</th>
				<th>實測</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					停用 NIP-50 詞索引 — 搜尋仍可用（全詞比對）但較慢
				</td>
				<td>每 10,000 事件 41.8 MB → 20.5 MB</td>
			</tr>
			<tr>
				<td>預設值</td>
				<td>已針對低記憶體調校</td>
				<td>512 MB 無需變更</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>從原始碼建置</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>建置完成後，二進位檔位於 <code>target/release/nostrfy</code>。</p>

	<h2>安裝預編譯二進位檔</h2>
	<p>
		發行工作流程附帶 <strong>Linux x86_64</strong>、<strong>Linux aarch64</strong> 與
		<strong>FreeBSD x86_64</strong> 的預編譯二進位檔。同一個
		<code>install.sh</code> 在兩個系統上都能使用 — 它會偵測平台、下載相符的二進位檔並驗證其校驗和：
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy 可在 FreeBSD 13.x 與 14.x（amd64）上建置與執行。安裝 Rust 並建置：</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>平台說明：</p>
	<ul>
		<li>
			<code>start</code>/<code>stop</code>/<code>restart</code> 使用的處理程序存活檢查在 FreeBSD 上透過
			<code>kern.proc.pid.&lt;pid&gt;.comm</code> sysctl 讀取處理程序名稱（在 Linux 上使用
			<code>/proc/&lt;pid&gt;/comm</code>），因此兩個平台都能偵測到 pid 被其他程式重複使用的過期 pid 檔案。
		</li>
		<li>
			<code>nostrfy start</code> 像在 Linux 上一樣常駐化；標準的雙 fork 常駐程式可與預設的
			<code>rc</code> 整合（<code>service nostrfy start</code>）搭配使用。
		</li>
		<li>
			Blossom 的 <code>min_free_bytes</code> 檢查使用 <code>statvfs</code>，兩個系統都提供；沒有
			使用其他平台特定程式碼（中繼本身只是基於 tokio 的純非同步 Rust）。
		</li>
	</ul>

	<h3>在 80 連接埠上執行</h3>
	<p>
		一般使用者無法綁定 80 連接埠。要嘛用 <code>sudo</code> 執行，要嘛使用 8080 等較高的連接埠。
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="範例：在 8080 連接埠執行（一般使用者即可；請先在設定中變更連接埠）。"
	/>

	<Callout type="tip" title="下一步">
		nostrfy 已安裝完成，請依照<a href={p('/docs/quick-start/')}>快速開始</a>指南操作。
	</Callout>
</div>
