<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const commonBlock = `# 1. 安裝最新的發行二進位檔（安裝本身無需 sudo）
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. 取得設定範本並編輯（無需複製倉庫）
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # 設定 name、public_url、private_key

# 3. 取得 systemd 單元並啟動服務
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. 在供應商的防火牆中開放連接埠（通常是 8080）並驗證
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # NIP-42 AUTH / NIP-62 / NIP-98 需要
private_key = ""                          # 執行 'nostrfy genkey' 並貼上金鑰`;
</script>

<DocsTitle
	title="部署總覽"
	description="nostrfy 如何發行以及如何部署 — Fly.io、AWS、Google Cloud、Azure、DigitalOcean 或任意 VPS，含 TLS、systemd 與容器說明。"
/>

<div class="doc-body">
	<h2>一個二進位檔，多個平台</h2>
	<p>
		nostrfy 提供 <strong>x86_64</strong> 與 <strong>aarch64</strong> 的預編譯二進位檔（GitHub
		發行資產，由 <code>install.sh</code> 校驗和驗證）、一個
		<strong>下載這些二進位檔</strong>的容器映像（無需編譯），以及主要平台的部署指南。
	</p>

	<h2>平台</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>平台</th>
				<th>類型</th>
				<th>指南</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>託管平台（容器、磁碟區、TLS）</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet（VM）或 App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2（VM）、Lightsail 或 ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine（VM）或 Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM 或 Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>任意 VPS</strong></td>
				<td>一般 Ubuntu/Debian 伺服器</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>VM 的通用模式</h2>
	<p>所有 VM 指南（Digital Ocean、AWS EC2、GCP、Azure、任意 VPS）都遵循相同的模式：</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>上線之前</h2>
	<p>
		每個部署都使用相同的 <code>nostrfy.toml</code> 選項。上線之前，至少設定：
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM 還是容器？</h2>
	<ul>
		<li>
			<strong>VM（systemd）</strong>：最簡單、最便宜、完全可控。大多數中繼
			部署推薦。
		</li>
		<li>
			<strong>容器</strong>：在 Fly.io、Digital Ocean App Platform、AWS ECS、GCP Cloud Run 或 Azure
			Container Apps 上使用倉庫的 <code>Dockerfile</code>（建置時下載發行
			二進位檔）。LMDB 資料需要持久儲存（<code>/data</code>）。
		</li>
	</ul>

	<h2>Blossom 媒體主機</h2>
	<p>
		如果設定了 <code>blossom.host</code>，也在 TLS 代理中將該主機名稱指向同一連接埠（nginx/Caddy
		設定區塊見<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）。
	</p>

	<Callout type="warning" title="TLS 由你的代理或供應商終止">
		中繼本身在 8080 上提供明文 WebSocket 並遵循 X-Forwarded-Proto。
	</Callout>
</div>
