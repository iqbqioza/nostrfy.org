<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # Ubuntu：ubuntu@<public-ip>
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
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="部署到 AWS"
	description="在 AWS EC2、Lightsail 或 ECS/Fargate 上部署 nostrfy — 分步说明，含 systemd、反向代理后的 TLS 和生产检查清单。"
/>

<div class="doc-body">
	<p>
		选项：<strong>EC2</strong>（VM，推荐）、<strong>Lightsail</strong>（更简单的 VM），或
		<strong>ECS/Fargate</strong>（容器）。
	</p>

	<h2>选项 1：EC2（推荐）</h2>
	<ol>
		<li>
			<strong>启动实例</strong>：Amazon Linux 2023 或 Ubuntu 24.04 LTS，
			<code>t3.small</code>（2 GB RAM）起步足够。选择离用户近的区域。
		</li>
		<li>
			<strong>安全组</strong>：允许入站 TCP <code>8080</code>（以及 <code>443</code> 用于
			TLS）。将 SSH 规则限制为你的 IP。
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
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）或带 ACM 证书的 Application/Network Load Balancer
			— 然后设置 <code>relay.public_url</code> 并重启。
		</li>
	</ol>

	<h2>选项 2：Lightsail</h2>
	<p>
		Lightsail 实例的工作方式与 EC2 指南完全相同 — <strong>networking 选项卡</strong>中有
		防火墙规则：开放 TCP <code>8080</code>。
	</p>

	<h2>选项 3：ECS / Fargate（容器）</h2>
	<p>
		仓库的 <code>Dockerfile</code> 在构建时下载预编译的发布二进制：
	</p>
	<ol>
		<li>
			将镜像推送到 ECR：
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			创建 ECS 服务（Fargate，1 个任务），并<strong>在
			<code>/data</code> 挂载 EFS 卷</strong>（LMDB 持久化 — 没有它，重新部署时数据会丢失）。
		</li>
		<li>
			暴露端口 <code>8080</code>；用 ALB + ACM 证书为其前端提供 TLS。
		</li>
		<li>
			烘焙的 <code>deploy/nostrfy.container.toml</code> 配置可以通过在
			<code>/etc/nostrfy/nostrfy.toml</code> 挂载你自己的 <code>nostrfy.toml</code> 来覆盖（例如一个
			将其复制到镜像中的分支）。
		</li>
	</ol>

	<h2>弹性 IP</h2>
	<p>
		如果会停止/启动实例，请附加<strong>弹性 IP</strong> — 否则公网
		IP 会变化，<code>public_url</code> 会失效。
	</p>

	<Callout type="note" title="TLS 由你的代理或提供商终止">
		中继本身在 8080 上提供普通 WebSocket 并遵循 X-Forwarded-Proto。
	</Callout>
</div>
