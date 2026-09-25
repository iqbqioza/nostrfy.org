<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const installCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --version`;
	const configFetch = `sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml`;
	const relConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # 你的公开地址
private_key = "..."                      # 在本地运行 'nostrfy genkey' 并粘贴密钥

[server]
host = "0.0.0.0"                         # 模板中已设置
port = 8080`;
	const genkeyCmd = `nostrfy --config /tmp/nostrfy-genkey.toml init && nostrfy --config /tmp/nostrfy-genkey.toml genkey`;
	const serviceCmd = `sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy
sudo systemctl status nostrfy`;
	const logsCmd = `journalctl -u nostrfy -f`;
	const ufwCmd = `sudo ufw allow 8080/tcp`;
	const verifyCmd = `curl http://localhost:8080/health
curl http://<server-ip>:8080/health        # 从你的笔记本`;
	const nginxConf = `server {
    listen 443 ssl;
    server_name relay.example.com;

    ssl_certificate     /etc/letsencrypt/live/relay.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/relay.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
	const caddyConf = `relay.example.com {
    reverse_proxy 127.0.0.1:8080
}`;
	const nginxMedia = `server {
    listen 443 ssl;
    server_name media.example.com;

    ssl_certificate     /etc/letsencrypt/live/media.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/media.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
	const caddyMedia = `media.example.com {
    reverse_proxy 127.0.0.1:8080
}`;
	const backupCmd = `sudo systemctl stop nostrfy
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # 你的 database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# 管道安装从不询问确认：使用 --force 覆盖
# 现有二进制（或在终端中运行脚本并回答 y/N）
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="部署到任意 VPS"
	description="普通 Ubuntu 或 Debian VPS 的通用指南 — 其他所有平台指南的基础，含 systemd、TLS 和防火墙说明。"
/>

<div class="doc-body">
	<p>
		这是普通 Linux VPS（任何提供商 — Hetzner、Vultr、Linode、Contabo、
		你自己的服务器……）的通用指南。其他平台指南（Digital Ocean、AWS、GCP、Azure）都是本指南的
		快捷方式，附加提供商特定的防火墙步骤。
	</p>

	<h2>1. 安装二进制</h2>
	<p>
		<code>install.sh</code> 脚本下载适合你架构（x86_64 / aarch64）的最新发布二进制，
		验证其 sha256 校验和并安装到 <code>PATH</code> 上的目录 —
		<strong>安装本身无需 sudo</strong>：
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. 创建配置</h2>
	<p>获取模板（无需克隆仓库）并编辑：</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>至少设置：</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>用以下命令生成密钥：</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		（或者挂载你自己的配置文件代替模板 — 任何 <code>nostrfy.toml</code> 都可以。）
	</p>

	<h2>3. 作为 systemd 服务运行</h2>
	<p>获取加固的单元（无需克隆仓库）并启动它：</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>日志：</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. 开放端口并验证</h2>
	<p>在防火墙（ufw、云防火墙、主机防火墙）中允许 TCP 8080：</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>从本地和外部验证：</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. 在前端放置终止 TLS 的代理（用于 wss://）</h2>
	<p>
		中继在 8080 上提供普通 WebSocket。要将其暴露为 <code>wss://</code>，请在 443
		端口运行终止 TLS 的反向代理。中继遵循 <code>X-Forwarded-Proto</code>，因此无需
		特殊配置。
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>：
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		用
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		获取免费证书（<code>sudo certbot --nginx -d relay.example.com</code>）。
	</p>

	<h3>Caddy</h3>
	<p>（自动 TLS，一个文件）：</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Blossom 媒体主机也一样</h3>
	<p>
		设置 <code>blossom.host = "media.example.com"</code> 时，该主机名也必须到达
		同一端口 — 中继在内部拆分主机（类似 <code>server.api_host</code>）。为它添加
		第二个 server 块 / 站点：
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		确保配置中的 <code>relay.public_url</code> 与
		<code>wss://relay.example.com</code> 匹配。
	</p>

	<h2>6. 备份</h2>
	<p>停止中继，复制数据目录，重新启动：</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>更新</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
