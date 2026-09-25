<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const commonBlock = `# 1. 安装最新的发布二进制（安装本身无需 sudo）
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. 获取配置模板并编辑（无需克隆仓库）
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # 设置 name、public_url、private_key

# 3. 获取 systemd 单元并启动服务
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. 在提供商的防火墙中开放端口（通常是 8080）并验证
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # NIP-42 AUTH / NIP-62 / NIP-98 需要
private_key = ""                          # 运行 'nostrfy genkey' 并粘贴密钥`;
</script>

<DocsTitle
	title="部署概览"
	description="nostrfy 如何分发以及如何部署 — Fly.io、AWS、Google Cloud、Azure、DigitalOcean 或任意 VPS，含 TLS、systemd 和容器说明。"
/>

<div class="doc-body">
	<h2>一个二进制，多个平台</h2>
	<p>
		nostrfy 提供 <strong>x86_64</strong> 和 <strong>aarch64</strong> 的预编译二进制（GitHub
		发布资产，由 <code>install.sh</code> 校验和验证）、一个
		<strong>下载这些二进制</strong>的容器镜像（无需编译），以及主要平台的部署指南。
	</p>

	<h2>平台</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>平台</th>
				<th>类型</th>
				<th>指南</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>托管平台（容器、卷、TLS）</td>
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
				<td>普通 Ubuntu/Debian 服务器</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>VM 的通用模式</h2>
	<p>所有 VM 指南（Digital Ocean、AWS EC2、GCP、Azure、任意 VPS）都遵循相同的模式：</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>上线之前</h2>
	<p>
		每个部署都使用相同的 <code>nostrfy.toml</code> 选项。上线之前，至少设置：
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM 还是容器？</h2>
	<ul>
		<li>
			<strong>VM（systemd）</strong>：最简单、最便宜、完全可控。大多数中继
			部署推荐。
		</li>
		<li>
			<strong>容器</strong>：在 Fly.io、Digital Ocean App Platform、AWS ECS、GCP Cloud Run 或 Azure
			Container Apps 上使用仓库的 <code>Dockerfile</code>（构建时下载发布
			二进制）。LMDB 数据需要持久存储（<code>/data</code>）。
		</li>
	</ul>

	<h2>Blossom 媒体主机</h2>
	<p>
		如果设置了 <code>blossom.host</code>，也在 TLS 代理中将该主机名指向同一端口（nginx/Caddy
		配置块见<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）。
	</p>

	<Callout type="warning" title="TLS 由你的代理或提供商终止">
		中继本身在 8080 上提供普通 WebSocket 并遵循 X-Forwarded-Proto。
	</Callout>
</div>
