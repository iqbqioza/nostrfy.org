<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # Ubuntu：ubuntu@<public-ip>
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
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="部署到 AWS"
	description="在 AWS EC2、Lightsail 或 ECS/Fargate 上部署 nostrfy — 逐步說明，含 systemd、反向代理後的 TLS 與生產檢查清單。"
/>

<div class="doc-body">
	<p>
		選項：<strong>EC2</strong>（VM，推薦）、<strong>Lightsail</strong>（更簡單的 VM），或
		<strong>ECS/Fargate</strong>（容器）。
	</p>

	<h2>選項 1：EC2（推薦）</h2>
	<ol>
		<li>
			<strong>啟動執行個體</strong>：Amazon Linux 2023 或 Ubuntu 24.04 LTS，
			<code>t3.small</code>（2 GB RAM）起步足夠。選擇離使用者近的區域。
		</li>
		<li>
			<strong>安全群組</strong>：允許入站 TCP <code>8080</code>（以及 <code>443</code> 用於
			TLS）。將 SSH 規則限制為你的 IP。
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
			<a href={p('/docs/deploy/vps/')}>VPS 指南</a>）或帶 ACM 憑證的 Application/Network Load Balancer
			— 然後設定 <code>relay.public_url</code> 並重新啟動。
		</li>
	</ol>

	<h2>選項 2：Lightsail</h2>
	<p>
		Lightsail 執行個體的工作方式與 EC2 指南完全相同 — <strong>networking 索引標籤</strong>中有
		防火牆規則：開放 TCP <code>8080</code>。
	</p>

	<h2>選項 3：ECS / Fargate（容器）</h2>
	<p>
		倉庫的 <code>Dockerfile</code> 在建置時下載預編譯的發行二進位檔：
	</p>
	<ol>
		<li>
			將映像推送到 ECR：
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			建立 ECS 服務（Fargate，1 個任務），並<strong>在
			<code>/data</code> 掛載 EFS 磁碟區</strong>（LMDB 持久化 — 沒有它，重新部署時資料會遺失）。
		</li>
		<li>
			公開連接埠 <code>8080</code>；用 ALB + ACM 憑證為其前端提供 TLS。
		</li>
		<li>
			烘焙的 <code>deploy/nostrfy.container.toml</code> 設定可以透過在
			<code>/etc/nostrfy/nostrfy.toml</code> 掛載你自己的 <code>nostrfy.toml</code> 來覆寫（例如一個
			將其複製到映像中的分支）。
		</li>
	</ol>

	<h2>彈性 IP</h2>
	<p>
		如果會停止/啟動執行個體，請附加<strong>彈性 IP</strong> — 否則公開
		IP 會變化，<code>public_url</code> 會失效。
	</p>

	<Callout type="note" title="TLS 由你的代理或供應商終止">
		中繼本身在 8080 上提供一般 WebSocket 並遵循 X-Forwarded-Proto。
	</Callout>
</div>
