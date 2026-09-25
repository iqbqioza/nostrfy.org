<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # 設定 name、public_url、private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="部署到 Azure"
	description="在 Azure VM 或 Azure Container Apps 上部署 nostrfy — 逐步說明，含 systemd、TLS 與動態公開 IP 的注意事項。"
/>

<div class="doc-body">
	<p>
		選項：<strong>VM</strong>（推薦），或 <strong>Container Apps</strong>。
	</p>

	<h2>選項 1：虛擬機器（推薦）</h2>
	<ol>
		<li>
			<strong>建立 VM</strong>：Ubuntu 24.04 LTS，<code>Standard_B1s</code>（1 GB）或
			<code>Standard_B2s</code>（2 GB）起步。選擇離使用者近的區域。
		</li>
		<li>
			<strong>網路安全性群組（NSG）</strong>：為 TCP <code>8080</code>
			（以及 <code>443</code> 用於 TLS）加入入站規則。將 SSH 規則限制為你的 IP。
		</li>
		<li>
			<strong>SSH 登入</strong>並依照通用 <a href={p('/docs/deploy/vps/')}>VPS 指南</a>操作：
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>驗證</strong>：
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>加入 TLS（<code>wss://</code>）</strong>用 certbot + nginx（如
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）或帶憑證的 Azure Application Gateway。
		</li>
	</ol>

	<Callout type="note" title="Azure VM 的公開 IP 在解除配置時可能會變">
		使用<strong>靜態公開 IP</strong>，使 <code>relay.public_url</code> 保持有效。
	</Callout>

	<h2>選項 2：Azure Container Apps</h2>
	<p>
		Container Apps 從倉庫的 <code>Dockerfile</code> 建置（它會下載預編譯的
		發行二進位檔）：
	</p>
	<ol>
		<li>
			<strong>從 GitHub 倉庫建立 Container App</strong>（或將映像推送到 ACR）。
		</li>
		<li>
			<strong>連接埠</strong>：將容器連接埠設為 <code>8080</code>。
		</li>
		<li>
			<strong>記憶體</strong>：至少 1 GB。
		</li>
		<li>
			<strong>持久儲存</strong>：在 <code>/data</code> 掛載 <strong>Azure Storage 檔案共用</strong>
			以存放 LMDB 資料。
		</li>
		<li>
			<strong>TLS</strong>：Container Apps 在應用 URL 上提供 <code>https://</code> — 設定
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code>（或
			自訂網域）。
		</li>
	</ol>

	<Callout type="note" title="中繼絕不能縮容至零">
		設定 <strong>min replicas = 1</strong>。烘焙的 <code>deploy/nostrfy.container.toml</code> 可以
		透過在 <code>/etc/nostrfy/nostrfy.toml</code> 掛載你自己的 <code>nostrfy.toml</code> 來
		替換。
	</Callout>
</div>
