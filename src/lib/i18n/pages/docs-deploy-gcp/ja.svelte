<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # name、public_url、private_key を設定します
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Google Cloud へのデプロイ"
	description="Google Cloud Compute Engine または Cloud Run への nostrfy のデプロイ — systemd、TLS、ゼロへの自動縮小の注意点を網羅したステップバイステップガイド。"
/>

<div class="doc-body">
	<p>
		選択肢:<strong>Compute Engine</strong>(VM、推奨)または <strong>Cloud Run</strong>
		(コンテナ)。
	</p>

	<h2>オプション 1:Compute Engine(推奨)</h2>
	<ol>
		<li>
			<strong>VM を作成</strong>:Ubuntu 24.04 LTS(または Debian)、<code>e2-small</code>(2 GB)で
			開始に十分です。ユーザーに近いリージョンを選んでください。
		</li>
		<li>
			<strong>ファイアウォールルール</strong>:インバウンド TCP <code>8080</code>(TLS 用に <code>443</code>
			も)を許可します。<strong>Network → Firewall</strong> で、VM に割り当てたターゲットタグを持つ
			ルールを作成してください。
		</li>
		<li>
			<strong>SSH で接続</strong>(コンソールの SSH ボタンで可)し、汎用の
			<a href={p('/docs/deploy/vps/')}>VPS ガイド</a>に従ってください:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>静的 IP を予約</strong>(External IP → Reserve)して、再起動後も <code>public_url</code> が
			有効なままになるようにします。
		</li>
		<li>
			<strong>検証</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>TLS(<code>wss://</code>)を追加</strong>:<a href={p('/docs/deploy/vps/')}>VPS ガイド</a>の
			通り certbot + nginx を使うか、マネージド証明書付きの GCP ロードバランサーを使用します。
		</li>
	</ol>

	<h2>オプション 2:Cloud Run(コンテナ)</h2>
	<p>
		Cloud Run はリポジトリの <code>Dockerfile</code> からビルドします(事前ビルド済みリリース
		バイナリをダウンロードするもの):
	</p>
	<ol>
		<li>
			<strong>GitHub リポジトリからサービスを作成</strong>(またはイメージを Artifact
			Registry にプッシュ)。
		</li>
		<li>
			<strong>ポート</strong>:コンテナポートを <code>8080</code> に設定します。
		</li>
		<li>
			<strong>メモリを割り当て</strong>:最低 512 MB(LMDB + 非同期ランタイム用)。
		</li>
		<li>
			<strong>永続ストレージ</strong>:<strong>Cloud Run ボリューム(filestore/gcsfuse)</strong>
			を <code>/data</code> にアタッチ — LMDB はファイルシステムが必要なため、<code>/data</code> への
			GCS FUSE マウントが永続化に有効です。
		</li>
		<li>
			<strong>TLS</strong>:Cloud Run は <code>https://</code> を自動的に提供します —
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code>(またはカスタムドメイン)
			を設定してください。
		</li>
	</ol>

	<Callout type="note" title="Cloud Run は既定でゼロにスケールします">
		リレーの場合は <strong>min instances = 1</strong> に設定してコールドスタートを防いでください。
		イメージに組み込まれた <code>deploy/nostrfy.container.toml</code> は、独自の
		<code>nostrfy.toml</code> を <code>/etc/nostrfy/nostrfy.toml</code> にマウントすることで
		置き換え可能です。
	</Callout>
</div>
