<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # 设置 name、public_url、private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="部署到 Azure"
	description="在 Azure VM 或 Azure Container Apps 上部署 nostrfy — 分步说明，含 systemd、TLS 和动态公网 IP 的注意事项。"
/>

<div class="doc-body">
	<p>
		选项：<strong>VM</strong>（推荐），或 <strong>Container Apps</strong>。
	</p>

	<h2>选项 1：虚拟机（推荐）</h2>
	<ol>
		<li>
			<strong>创建 VM</strong>：Ubuntu 24.04 LTS，<code>Standard_B1s</code>（1 GB）或
			<code>Standard_B2s</code>（2 GB）起步。选择离用户近的区域。
		</li>
		<li>
			<strong>网络安全组（NSG）</strong>：为 TCP <code>8080</code>
			（以及 <code>443</code> 用于 TLS）添加入站规则。将 SSH 规则限制为你的 IP。
		</li>
		<li>
			<strong>SSH 登录</strong>并按照通用 <a href={p('/docs/deploy/vps/')}>VPS 指南</a>操作：
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>验证</strong>：
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>添加 TLS（<code>wss://</code>）</strong>用 certbot + nginx（如
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）或带证书的 Azure Application Gateway。
		</li>
	</ol>

	<Callout type="note" title="Azure VM 的公网 IP 在解除分配时可能会变">
		使用<strong>静态公网 IP</strong>，使 <code>relay.public_url</code> 保持有效。
	</Callout>

	<h2>选项 2：Azure Container Apps</h2>
	<p>
		Container Apps 从仓库的 <code>Dockerfile</code> 构建（它会下载预编译的
		发布二进制）：
	</p>
	<ol>
		<li>
			<strong>从 GitHub 仓库创建 Container App</strong>（或将镜像推送到 ACR）。
		</li>
		<li>
			<strong>端口</strong>：将容器端口设置为 <code>8080</code>。
		</li>
		<li>
			<strong>内存</strong>：至少 1 GB。
		</li>
		<li>
			<strong>持久存储</strong>：在 <code>/data</code> 挂载 <strong>Azure Storage 文件共享</strong>
			以存放 LMDB 数据。
		</li>
		<li>
			<strong>TLS</strong>：Container Apps 在应用 URL 上提供 <code>https://</code> — 设置
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code>（或
			自定义域）。
		</li>
	</ol>

	<Callout type="note" title="中继绝不能缩容到零">
		设置 <strong>min replicas = 1</strong>。烘焙的 <code>deploy/nostrfy.container.toml</code> 可以
		通过在 <code>/etc/nostrfy/nostrfy.toml</code> 挂载你自己的 <code>nostrfy.toml</code> 来
		替换。
	</Callout>
</div>
