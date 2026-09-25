<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # 设置 name、public_url、private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="部署到 Google Cloud"
	description="在 Google Cloud Compute Engine 或 Cloud Run 上部署 nostrfy — 分步说明，含 systemd、TLS 和缩容到零的注意事项。"
/>

<div class="doc-body">
	<p>
		选项：<strong>Compute Engine</strong>（VM，推荐）或 <strong>Cloud Run</strong>
		（容器）。
	</p>

	<h2>选项 1：Compute Engine（推荐）</h2>
	<ol>
		<li>
			<strong>创建 VM</strong>：Ubuntu 24.04 LTS（或 Debian），<code>e2-small</code>（2 GB）
			起步足够。选择离用户近的区域。
		</li>
		<li>
			<strong>防火墙规则</strong>：允许入站 TCP <code>8080</code>（以及 <code>443</code> 用于
			TLS）。在 <strong>Network → Firewall</strong> 下，用你分配给 VM 的目标标签创建规则。
		</li>
		<li>
			<strong>SSH 登录</strong>（控制台的 SSH 按钮即可）并按照通用
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>操作：
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>预留静态 IP</strong>（External IP → Reserve），使 <code>public_url</code> 在
			重启后仍然有效。
		</li>
		<li>
			<strong>验证</strong>：
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>添加 TLS（<code>wss://</code>）</strong>用 certbot + nginx（如
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）或带托管证书的 GCP 负载均衡器。
		</li>
	</ol>

	<h2>选项 2：Cloud Run（容器）</h2>
	<p>
		Cloud Run 从仓库的 <code>Dockerfile</code> 构建（它会下载预编译的发布
		二进制）：
	</p>
	<ol>
		<li>
			<strong>从 GitHub 仓库创建服务</strong>（或将镜像推送到 Artifact
			Registry）。
		</li>
		<li>
			<strong>端口</strong>：将容器端口设置为 <code>8080</code>。
		</li>
		<li>
			<strong>分配内存</strong>：至少 512 MB（LMDB + 异步运行时）。
		</li>
		<li>
			<strong>持久存储</strong>：在 <code>/data</code> 附加 <strong>Cloud Run 卷（filestore/gcsfuse）</strong>
			— LMDB 需要文件系统，因此在 <code>/data</code> 挂载 GCS FUSE 可实现持久化。
		</li>
		<li>
			<strong>TLS</strong>：Cloud Run 自动提供 <code>https://</code> — 设置
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code>（或你的自定义域）。
		</li>
	</ol>

	<Callout type="note" title="Cloud Run 默认缩容到零">
		对于中继，设置 <strong>min instances = 1</strong> 使其永不变冷。烘焙到镜像中的
		<code>deploy/nostrfy.container.toml</code> 可以通过在 <code>/etc/nostrfy/nostrfy.toml</code>
		挂载你自己的 <code>nostrfy.toml</code> 来替换。
	</Callout>
</div>
