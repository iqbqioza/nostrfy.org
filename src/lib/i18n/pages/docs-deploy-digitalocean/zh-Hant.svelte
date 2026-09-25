<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # 設定 name、public_url、private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="部署到 DigitalOcean"
	description="在 DigitalOcean Droplet 或 App Platform 上部署 nostrfy — 逐步說明，含 systemd、TLS 與生產就緒的設定。"
/>

<div class="doc-body">
	<p>
		兩種選擇：<strong>Droplet</strong>（VM，最簡單）或 <strong>App Platform</strong>
		（容器）。
	</p>

	<h2>選項 1：Droplet（推薦）</h2>
	<ol>
		<li>
			<strong>建立 Droplet</strong>：Ubuntu 24.04 LTS，任意大小（1 GB RAM 起步足夠）。位於
			離使用者近的區域的 Droplet 可降低延遲。
		</li>
		<li>
			<strong>SSH 登入</strong>並依照通用
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>操作：
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>開放連接埠</strong>：在 Droplet 防火牆中（推薦使用
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				Digital Ocean Cloud Firewall</a
			>）：允許入站 TCP <code>8080</code>（如果加入 TLS 則還有 <code>443</code>）。
		</li>
		<li>
			<strong>驗證</strong>：
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>加入 TLS（<code>wss://</code>）</strong>用 certbot + nginx，或
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Digital Ocean 的託管負載平衡器</a
			>加憑證 — 然後設定
			<code>relay.public_url = "wss://relay.example.com"</code> 並重新啟動。
		</li>
	</ol>

	<h2>選項 2：App Platform（容器）</h2>
	<p>
		App Platform 從倉庫的 <code>Dockerfile</code> 建置（它會下載預編譯的
		發行二進位檔）：
	</p>
	<ol>
		<li><strong>連接你的 GitHub 倉庫</strong>並從中建立應用。</li>
		<li>
			<strong>連接埠</strong>：將 HTTP 連接埠設為 <code>8080</code>（中繼在那裡監聽）。
		</li>
		<li>
			<strong>持久磁碟</strong>：在 <code>/data</code> 掛載磁碟區（LMDB 資料在那裡 —
			沒有它，每次部署都會遺失資料）。
		</li>
		<li>
			<strong>環境</strong>：烘焙到映像中的 <code>deploy/nostrfy.container.toml</code> 可以透過
			在 <code>/etc/nostrfy/nostrfy.toml</code> 掛載你自己的設定來替換（建立一個複製它的
			分支，或在你自己的倉庫中使用 Dockerfile <code>COPY</code>）。
		</li>
		<li>
			<strong>TLS</strong>：App Platform 會為應用網域自動提供 <code>https://</code>
			— 相應地設定 <code>relay.public_url</code>。
		</li>
	</ol>

	<h2>兩種選項通用</h2>
	<ul>
		<li>
			更新：重新執行 <code>install.sh</code> + <code>systemctl restart nostrfy</code>（Droplet），或
			推送到已連接的倉庫（App Platform）。
		</li>
		<li>
			所有設定都記錄在
			<a href={p('/docs/configuration/')}>設定參考</a>中。
		</li>
	</ul>
</div>
