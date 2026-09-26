<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const commonBlock = `# 1. 最新のリリースバイナリをインストールします（インストール自体に sudo は不要です）
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. 設定テンプレートを取得して編集します（リポジトリのクローンは不要です）
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # name、public_url、private_key を設定します

# 3. systemd ユニットを取得してサービスを開始します
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. プロバイダーのファイアウォールでポート（通常は 8080）を開いて検証します
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # NIP-42 AUTH / NIP-62 / NIP-98 に必須です
private_key = ""                          # 'nostrfy genkey' を実行してキーを貼り付けます`;
</script>

<DocsTitle
	title="デプロイ概要"
	description="nostrfy の配布形態とデプロイ方法 — Fly.io、AWS、Google Cloud、Azure、DigitalOcean、任意の VPS に対応し、TLS、systemd、コンテナの注記付き。"
/>

<div class="doc-body">
	<h2>1つのバイナリ、複数のプラットフォーム</h2>
	<p>
		nostrfy は <strong>x86_64</strong> と <strong>aarch64</strong> 向けのビルド済みバイナリ(GitHub
		リリースアセット、<code>install.sh</code> によるチェックサム検証付き)、それらのバイナリを
		<strong>ダウンロードする</strong>コンテナイメージ(コンパイル不要)、および主要プラットフォーム向けのデプロイガイドを提供します。
	</p>

	<h2>プラットフォーム</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>プラットフォーム</th>
				<th>種類</th>
				<th>ガイド</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>マネージドプラットフォーム(コンテナ、ボリューム、TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>DigitalOcean</strong></td>
				<td>Droplet(VM)または App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2(VM)、Lightsail または ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine(VM)または Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM または Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>汎用 VPS</strong></td>
				<td>標準的な Ubuntu/Debian サーバー</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>VM 向けの共通パターン</h2>
	<p>すべての VM ガイド(DigitalOcean、AWS EC2、GCP、Azure、汎用 VPS)は同じパターンに従います:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>本番公開の前に</h2>
	<p>
		すべてのデプロイで同じ <code>nostrfy.toml</code> オプションを使用します。本番公開の前に、少なくとも以下を設定してください:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM とコンテナのどちらか？</h2>
	<ul>
		<li>
			<strong>VM(systemd)</strong>:最もシンプルで安価、完全に制御できます。ほとんどのリレーデプロイにおすすめです。
		</li>
		<li>
			<strong>コンテナ</strong>:リポジトリの <code>Dockerfile</code>(ビルド時にリリースバイナリをダウンロード)を使用して、Fly.io、Digital
			Ocean App Platform、AWS ECS、GCP Cloud Run、Azure Container Apps 上で実行します。LMDB データ用に永続ストレージ(<code>/data</code>)が必要です。
		</li>
	</ul>

	<h2>Blossom メディアホスト</h2>
	<p>
		<code>blossom.host</code> が設定されている場合、そのホスト名も TLS プロキシの同じポートに向けてください(nginx/Caddy
		の設定例は <a href={p('/docs/deploy/vps/')}>VPS ガイド</a> を参照)。
	</p>

	<Callout type="warning" title="TLS はプロキシまたはプロバイダー側で終端します">
		リレー自体は 8080 でプレーンな WebSocket を提供し、X-Forwarded-Proto を尊重します。
	</Callout>
</div>
