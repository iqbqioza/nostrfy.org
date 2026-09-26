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
public_url = "wss://relay.example.com"   # 公開アドレス
private_key = "..."                      # ローカルで 'nostrfy genkey' を実行してキーを貼り付け

[server]
host = "0.0.0.0"                         # テンプレートですでに設定済み
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
curl http://<server-ip>:8080/health        # お手元のPCから`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # database.path を指定
sudo systemctl start nostrfy`;
	const updateCmd = `# パイプ経由のインストールでは確認を求められません：上書きするには --force を使用
# （またはターミナルからスクリプトを実行して y/N で回答）
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="任意の VPS へのデプロイ"
	description="プレーンな Ubuntu / Debian VPS 向けの汎用ガイド — systemd、TLS、ファイアウォールの解説を含む、他のすべてのプラットフォームガイドの基礎です。"
/>

<div class="doc-body">
	<p>
		これはプレーンな Linux VPS(プロバイダーを問わず — Hetzner、Vultr、Linode、Contabo、
		自前のサーバーなど)向けの汎用ガイドです。他のプラットフォームガイド(DigitalOcean、AWS、GCP、Azure)は、
		このガイドにプロバイダー固有のファイアウォール手順を加えたショートカット版です。
	</p>

	<h2>1. バイナリのインストール</h2>
	<p>
		<code>install.sh</code> スクリプトは、お使いのアーキテクチャ(x86_64 / aarch64)向けの最新リリースバイナリをダウンロードし、
		sha256 チェックサムを検証して、<code>PATH</code> 上のディレクトリにインストールします —
		<strong>インストール自体に sudo は不要です</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. 設定の作成</h2>
	<p>テンプレートを取得して(リポジトリのクローンは不要)編集します:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>最低限、以下を設定してください:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>秘密鍵は次のコマンドで生成します:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(またはテンプレートの代わりに独自の設定ファイルをマウント — 任意の <code>nostrfy.toml</code> が使えます。)
	</p>

	<h2>3. systemd サービスとして実行</h2>
	<p>強化済みユニットを取得して(リポジトリのクローンは不要)起動します:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>ログ:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. ポートの開放と確認</h2>
	<p>ファイアウォール(ufw、クラウドファイアウォール、ホストファイアウォール)で TCP 8080 を許可します:</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>ローカルと外部から確認します:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. 前段に TLS 終端プロキシを配置する(wss:// 用)</h2>
	<p>
		リレーは 8080 番ポートでプレーンな WebSocket を提供します。これを <code>wss://</code> として公開するには、
		443 番ポートで TLS を終端するリバースプロキシを実行します。リレーは <code>X-Forwarded-Proto</code> を尊重するため、
		特別な設定は不要です。
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		無料証明書は
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		で取得できます(<code>sudo certbot --nginx -d relay.example.com</code>)。
	</p>

	<h3>Caddy</h3>
	<p>(自動 TLS、1 ファイル):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Blossom メディアホストも</h3>
	<p>
		<code>blossom.host = "media.example.com"</code> が設定されている場合、そのホスト名も同じポートに到達できる必要があります —
		リレーは内部でホストを分割します(<code>server.api_host</code> と同様)。2 つ目の server ブロック / サイトを追加してください:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		設定内の <code>relay.public_url</code> が
		<code>wss://relay.example.com</code> と一致していることを確認してください。
	</p>

	<h2>6. バックアップ</h2>
	<p>リレーを停止し、データディレクトリをコピーして、再起動します:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>更新</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
