<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # name、public_url、private_key を設定します
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="Azure へのデプロイ"
	description="Azure VM または Azure Container Apps に nostrfy をデプロイ — systemd、TLS、動的パブリック IP の注意点を含めてステップごとに解説します。"
/>

<div class="doc-body">
	<p>
		選択肢: <strong>VM</strong>(推奨)、または <strong>Container Apps</strong>。
	</p>

	<h2>オプション 1: 仮想マシン(推奨)</h2>
	<ol>
		<li>
			<strong>VM を作成</strong>: Ubuntu 24.04 LTS、開始時は <code>Standard_B1s</code> (1 GB) または
			<code>Standard_B2s</code> (2 GB)。ユーザーに近いリージョンを選んでください。
		</li>
		<li>
			<strong>ネットワーク セキュリティ グループ (NSG)</strong>: TCP <code>8080</code>
			(TLS 用に <code>443</code> も)の受信規則を追加します。SSH 規則は自分の IP に制限してください。
		</li>
		<li>
			<strong>SSH で接続</strong>し、汎用の <a href={p('/docs/deploy/vps/')}>VPS ガイド</a>に従います:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>検証</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>TLS (<code>wss://</code>) を追加</strong>: certbot + nginx で(<a
				href={p('/docs/deploy/vps/')}>VPS ガイド</a> と同様に)、または証明書付きの Azure Application
			Gateway を使用します。
		</li>
	</ol>

	<Callout type="note" title="Azure VM のパブリック IP は割り当て解除で変わることがあります">
		<code>relay.public_url</code> を有効に保つため、<strong>静的パブリック IP</strong> を使用してください。
	</Callout>

	<h2>オプション 2: Azure Container Apps</h2>
	<p>
		Container Apps はリポジトリの <code>Dockerfile</code> からビルドします(事前ビルド済みリリースバイナリをダウンロードするもの):
	</p>
	<ol>
		<li>
			<strong>Container App を作成</strong>: GitHub リポジトリから作成します(またはイメージを ACR にプッシュ)。
		</li>
		<li>
			<strong>ポート</strong>:コンテナポートを <code>8080</code> に設定します。
		</li>
		<li>
			<strong>メモリ</strong>: 最低 1 GB。
		</li>
		<li>
			<strong>永続ストレージ</strong>: LMDB データ用に <strong>Azure Storage ファイル共有</strong> を
			<code>/data</code> にマウントします。
		</li>
		<li>
			<strong>TLS</strong>: Container Apps はアプリ URL に <code>https://</code> を提供します —
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> を設定します(またはカスタムドメイン)。
		</li>
	</ol>

	<Callout type="note" title="リレーをゼロにスケールさせてはいけません">
		<strong>最小レプリカ = 1</strong> に設定してください。組み込みの <code>deploy/nostrfy.container.toml</code> は、独自の
		<code>nostrfy.toml</code> を <code>/etc/nostrfy/nostrfy.toml</code> にマウントして置き換えることができます。
	</Callout>
</div>
