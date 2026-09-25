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
public_url = "wss://relay.example.com"   # 你的公開位址
private_key = "..."                      # 在本機執行 'nostrfy genkey' 並貼上金鑰

[server]
host = "0.0.0.0"                         # 範本中已設定
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
curl http://<server-ip>:8080/health        # 從你的筆電`;
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
	const updateCmd = `# 管線安裝從不詢問確認：使用 --force 覆寫
# 現有二進位檔（或在終端機中執行腳本並回答 y/N）
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="部署到任意 VPS"
	description="一般 Ubuntu 或 Debian VPS 的通用指南 — 其他所有平台指南的基礎，含 systemd、TLS 與防火牆說明。"
/>

<div class="doc-body">
	<p>
		這是一般 Linux VPS（任何供應商 — Hetzner、Vultr、Linode、Contabo、
		你自己的伺服器……）的通用指南。其他平台指南（Digital Ocean、AWS、GCP、Azure）都是本指南的
		捷徑，附加供應商特定的防火牆步驟。
	</p>

	<h2>1. 安裝二進位檔</h2>
	<p>
		<code>install.sh</code> 腳本下載適合你架構（x86_64 / aarch64）的最新發行二進位檔，
		驗證其 sha256 校驗和並安裝到 <code>PATH</code> 上的目錄 —
		<strong>安裝本身無需 sudo</strong>：
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. 建立設定</h2>
	<p>取得範本（無需複製倉庫）並編輯：</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>至少設定：</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>用以下指令產生金鑰：</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		（或者掛載你自己的設定檔代替範本 — 任何 <code>nostrfy.toml</code> 都可以。）
	</p>

	<h2>3. 作為 systemd 服務執行</h2>
	<p>取得加固的單元（無需複製倉庫）並啟動它：</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>日誌：</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. 開放連接埠並驗證</h2>
	<p>在防火牆（ufw、雲端防火牆、主機防火牆）中允許 TCP 8080：</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>從本機與外部驗證：</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. 在前端放置終止 TLS 的代理（用於 wss://）</h2>
	<p>
		中繼在 8080 上提供一般 WebSocket。要將其公開為 <code>wss://</code>，請在 443
		連接埠執行終止 TLS 的反向代理。中繼遵循 <code>X-Forwarded-Proto</code>，因此無需
		特殊設定。
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>：
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		用
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		取得免費憑證（<code>sudo certbot --nginx -d relay.example.com</code>）。
	</p>

	<h3>Caddy</h3>
	<p>（自動 TLS，一個檔案）：</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Blossom 媒體主機也一樣</h3>
	<p>
		設定 <code>blossom.host = "media.example.com"</code> 時，該主機名稱也必須到達
		同一連接埠 — 中繼在內部拆分主機（類似 <code>server.api_host</code>）。為它加入
		第二個 server 區塊 / 站點：
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		確保設定中的 <code>relay.public_url</code> 與
		<code>wss://relay.example.com</code> 相符。
	</p>

	<h2>6. 備份</h2>
	<p>停止中繼，複製資料目錄，重新啟動：</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>更新</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
