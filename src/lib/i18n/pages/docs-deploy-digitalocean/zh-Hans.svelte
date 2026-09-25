<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # 设置 name、public_url、private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="部署到 DigitalOcean"
	description="在 DigitalOcean Droplet 或 App Platform 上部署 nostrfy — 分步说明，含 systemd、TLS 和生产就绪的配置。"
/>

<div class="doc-body">
	<p>
		两种选择：<strong>Droplet</strong>（VM，最简单）或 <strong>App Platform</strong>
		（容器）。
	</p>

	<h2>选项 1：Droplet（推荐）</h2>
	<ol>
		<li>
			<strong>创建 Droplet</strong>：Ubuntu 24.04 LTS，任意大小（1 GB RAM 起步足够）。位于
			离用户近的区域的 Droplet 可降低延迟。
		</li>
		<li>
			<strong>SSH 登录</strong>并按照通用
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>操作：
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>开放端口</strong>：在 Droplet 防火墙中（推荐使用
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				Digital Ocean Cloud Firewall</a
			>）：允许入站 TCP <code>8080</code>（如果添加 TLS 则还有 <code>443</code>）。
		</li>
		<li>
			<strong>验证</strong>：
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>添加 TLS（<code>wss://</code>）</strong>用 certbot + nginx，或
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Digital Ocean 的托管负载均衡器</a
			>加证书 — 然后设置
			<code>relay.public_url = "wss://relay.example.com"</code> 并重启。
		</li>
	</ol>

	<h2>选项 2：App Platform（容器）</h2>
	<p>
		App Platform 从仓库的 <code>Dockerfile</code> 构建（它会下载预编译的
		发布二进制）：
	</p>
	<ol>
		<li><strong>连接你的 GitHub 仓库</strong>并从中创建应用。</li>
		<li>
			<strong>端口</strong>：将 HTTP 端口设置为 <code>8080</code>（中继在那里监听）。
		</li>
		<li>
			<strong>持久磁盘</strong>：在 <code>/data</code> 挂载卷（LMDB 数据在那里 —
			没有它，每次部署都会丢失数据）。
		</li>
		<li>
			<strong>环境</strong>：烘焙到镜像中的 <code>deploy/nostrfy.container.toml</code> 可以通过
			在 <code>/etc/nostrfy/nostrfy.toml</code> 挂载你自己的配置来替换（创建一个复制它的
			分支，或在你自己的仓库中使用 Dockerfile <code>COPY</code>）。
		</li>
		<li>
			<strong>TLS</strong>：App Platform 会为应用域自动提供 <code>https://</code>
			— 相应地设置 <code>relay.public_url</code>。
		</li>
	</ol>

	<h2>两种选项通用</h2>
	<ul>
		<li>
			更新：重新运行 <code>install.sh</code> + <code>systemctl restart nostrfy</code>（Droplet），或
			推送到已连接的仓库（App Platform）。
		</li>
		<li>
			所有配置都记录在
			<a href={p('/docs/configuration/')}>配置参考</a>中。
		</li>
	</ul>
</div>
