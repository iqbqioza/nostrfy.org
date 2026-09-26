<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # name、public_url、private_key を設定します
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="DigitalOcean へのデプロイ"
	description="DigitalOcean Droplet または App Platform に nostrfy をデプロイ — systemd、TLS、本番対応の設定をステップバイステップで解説します。"
/>

<div class="doc-body">
	<p>
		2つの選択肢があります:<strong>Droplet</strong>(VM、最もシンプル)または <strong>App Platform</strong
		>(コンテナ)です。
	</p>

	<h2>オプション 1:Droplet(推奨)</h2>
	<ol>
		<li>
			<strong>Droplet を作成</strong>:Ubuntu 24.04 LTS、サイズはどれでも可(開始時は 1 GB RAM
			で十分です)。ユーザーの近くにあるリージョンの Droplet はレイテンシを低減します。
		</li>
		<li>
			<strong>SSH で接続</strong>し、汎用の
			<a href={p('/docs/deploy/vps/')}>VPS ガイド</a>に従います:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>ポートを開く</strong>:Droplet ファイアウォール(<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>が推奨)で受信 TCP <code>8080</code> を許可します(TLS を追加する場合は <code>443</code> も)。
		</li>
		<li>
			<strong>検証</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>TLS(<code>wss://</code>)を追加</strong>:certbot + nginx で追加するか、証明書付きの<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean マネージド・ロードバランサー</a
			>を利用します — その後 <code>relay.public_url = "wss://relay.example.com"</code> を設定して再起動します。
		</li>
	</ol>

	<h2>オプション 2:App Platform(コンテナ)</h2>
	<p>
		App Platform はリポジトリの <code>Dockerfile</code> からビルドします(事前ビルド済みリリースバイナリをダウンロードします):
	</p>
	<ol>
		<li><strong>GitHub リポジトリを接続</strong>し、そこからアプリを作成します。</li>
		<li>
			<strong>ポート</strong>:HTTP ポートを <code>8080</code> に設定します(リレーはそこでリッスンします)。
		</li>
		<li>
			<strong>永続ディスク</strong>:<code>/data</code> にボリュームをマウントします(LMDB
			データはそこに保存されます — ない場合、デプロイのたびにデータが失われます)。
		</li>
		<li>
			<strong>環境</strong>:イメージに組み込まれた <code>deploy/nostrfy.container.toml</code> は、独自の設定を
			<code>/etc/nostrfy/nostrfy.toml</code> にマウントすることで置き換えられます(コピーするフォークを作成するか、独自リポジトリの
			Dockerfile で <code>COPY</code> を使用してください)。
		</li>
		<li>
			<strong>TLS</strong>:App Platform はアプリドメインに <code>https://</code> を自動的に提供します —
			それに合わせて <code>relay.public_url</code> を設定してください。
		</li>
	</ol>

	<h2>両方のオプション共通</h2>
	<ul>
		<li>
			更新:<code>install.sh</code> を再実行 + <code>systemctl restart nostrfy</code>(Droplet の場合)、または接続されたリポジトリにプッシュ(App
			Platform の場合)。
		</li>
		<li>
			すべての設定は
			<a href={p('/docs/configuration/')}>設定リファレンス</a>に記載されています。
		</li>
	</ul>
</div>
