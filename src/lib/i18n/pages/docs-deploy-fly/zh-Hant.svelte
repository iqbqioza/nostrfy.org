<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # 透過 NIP-11 向用戶端顯示
description = "A friendly relay for everyone"
private_key = "..."                            # NIP-29 群組需要
public_url = "wss://<your-app-name>.fly.dev"   # NIP-42/62/98 需要`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# 日誌行："relay listening on ws://0.0.0.0:8080"
fly logs

# 透過公開位址取得 NIP-11 資訊文件
curl https://<your-app-name>.fly.dev/

# 將你的 Nostr 用戶端指向 wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="部署到 Fly.io"
	description="用現成範本在幾分鐘內將 nostrfy 部署到 Fly.io — 磁碟區、機器、TLS 終止與簡單更新。"
/>

<div class="doc-body">
	<h2>倉庫中提供的內容</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>檔案</th>
				<th>用途</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					容器映像 — 從 GitHub 發行資產<strong>下載預編譯的發行二進位檔</strong>
					（x86_64 / aarch64，依建置架構選擇）並驗證其
					sha256 校驗和。Fly 上不會發生編譯
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Fly 應用設定：8080 連接埠的 HTTP 服務、健康檢查、
					<code>/data</code> 磁碟區掛載、常開機器
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					烘焙到映像中 <code>/etc/nostrfy/nostrfy.toml</code> 的中繼設定
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>前置條件</h2>
	<ul>
		<li>一個 Fly.io 帳號</li>
		<li>flyctl CLI（<code>fly version</code>）</li>
		<li>已登入：<code>fly auth login</code></li>
	</ul>

	<h2>四步部署</h2>

	<h3>1. 啟動應用（暫不部署）</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> 在 Fly 上必須唯一（它成為中繼 URL 的一部分：
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>）
		</li>
		<li>
			<code>&lt;region&gt;</code>：例如 <code>nrt</code>（東京）、<code>fra</code>、
			<code>iad</code>、<code>sjc</code> — 選擇離你的使用者最近的區域
		</li>
		<li>
			這可能會覆寫範本的 <code>fly.toml</code> 值（應用名稱、區域）— 沒問題
		</li>
	</ul>

	<h3>2. 建立持久磁碟區</h3>
	<p>LMDB 資料庫位於掛載到 <code>/data</code> 的 Fly 磁碟區上：</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB 起步足夠（資料庫隨使用成長）。之後可以調整大小，或一開始就建立更大的
		磁碟區。
	</p>

	<h3>3. 設定中繼</h3>
	<p>部署前編輯 <code>deploy/nostrfy.container.toml</code>：</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>：在本機用 <code>nostrfy genkey</code>（針對暫時設定）產生並貼上金鑰，或用任何 Nostr 工具產生
		</li>
		<li>
			<code>public_url</code> <strong>必須</strong>與你的應用名稱相符 — 沒有它，NIP-42 AUTH、
			NIP-62 消除與 NIP-86 管理 API 將無法運作
		</li>
		<li>其他一切保持預設即可</li>
	</ul>

	<h3>4. 部署</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly 建置映像（幾分鐘 — 二進位檔下載很快，映像很小），建立
		機器並對 <code>/health</code> 執行健康檢查。
	</p>

	<h2>驗證</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>擴縮與更新</h2>
	<ul>
		<li>
			<strong>更新中繼</strong>：編輯 <code>deploy/nostrfy.container.toml</code> 並
			再次 <code>fly deploy</code> — 映像總是下載<strong>最新</strong>的 GitHub
			發行二進位檔，因此更新只是簡單的重新部署
		</li>
		<li>
			<strong>固定版本</strong>：<code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code>
			或變更 Dockerfile 中的 <code>ARG</code>
		</li>
		<li>
			<strong>擴充</strong>：中繼預設是單一機器。
			<code>fly machines clone &lt;id&gt;</code> 建立第二台機器；兩者共用磁碟區（Fly
			磁碟區支援同一區域的多台機器）
		</li>
		<li>
			<strong>指標</strong>：Fly 收集 <code>/metrics</code> 端點（見
			<code>fly.toml</code> 中的 <code>[metrics]</code>）並在 Fly 儀表板的 Metrics 下顯示
		</li>
	</ul>

	<h2>自訂設定</h2>
	<p>
		映像讀取 <code>/etc/nostrfy/nostrfy.toml</code>，它由
		<code>deploy/nostrfy.container.toml</code> 烘焙而來。兩種自訂方式：
	</p>
	<ol>
		<li>
			<strong>在倉庫中編輯 <code>deploy/nostrfy.container.toml</code></strong> 並重新部署
			（最簡單）
		</li>
		<li>
			<strong>掛載你自己的設定</strong>：建置一個映像分支，將你的設定檔
			複製到 <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>每個選項都記錄在<a href={p('/docs/configuration/')}>設定參考</a>中。</p>

	<h2>說明</h2>
	<ul>
		<li>
			<strong>設計為常開</strong>：<code>fly.toml</code> 中的
			<code>auto_stop_machines = false</code> — 中繼絕不應在閒置期間被停止
		</li>
		<li>
			容器以<strong>前景模式</strong>執行中繼
			（<code>nostrfy start --foreground</code>）；日誌寫入 stdout/stderr 並由 Fly 收集
		</li>
		<li>
			TLS 由 Fly 終止；中繼本身在 8080 連接埠提供明文 WebSocket
		</li>
		<li>
			<strong>Blossom 媒體主機</strong>：要同時提供 Blossom 伺服器，請在設定中設定
			<code>blossom.host = "media.example.com"</code>，將
			<code>media.example.com</code> 加入為同一 Fly 應用的<strong>附加主機名稱</strong>
			（<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> 或
			<code>fly hostnames</code>），並在 Fly
			儀表板中加入 <code>media.</code> TLS 憑證 — 中繼在內部拆分主機（類似 <code>server.api_host</code>）
		</li>
	</ul>

	<Callout type="note" title="TLS 由 Fly 終止">
		中繼本身在 8080 連接埠提供明文 WebSocket。
	</Callout>
</div>
