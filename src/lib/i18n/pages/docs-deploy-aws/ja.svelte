<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # Ubuntu の場合は ubuntu@<public-ip> を使います
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
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="AWS へのデプロイ"
	description="nostrfy を AWS EC2、Lightsail、ECS/Fargate にデプロイ — systemd、リバースプロキシ背後の TLS、本番チェックリストをステップバイステップで解説します。"
/>

<div class="doc-body">
	<p>
		選択肢: <strong>EC2</strong>(VM、推奨)、<strong>Lightsail</strong>(よりシンプルなVM)、または
		<strong>ECS/Fargate</strong>(コンテナ)。
	</p>

	<h2>オプション1: EC2(推奨)</h2>
	<ol>
		<li>
			<strong>インスタンスを起動</strong>: Amazon Linux 2023またはUbuntu 24.04 LTS、
			<code>t3.small</code>(2 GB RAM)で開始できます。ユーザーに近いリージョンを選んでください。
		</li>
		<li>
			<strong>セキュリティグループ</strong>: インバウンドTCP <code>8080</code>(TLS用に
			<code>443</code>も)を許可。SSHルールは自分のIPに制限してください。
		</li>
		<li>
			<strong>SSH で接続</strong>し、汎用<a href={p('/docs/deploy/vps/')}>VPS ガイド</a>に従ってください:
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
			<strong>TLS(<code>wss://</code>)を追加</strong>: certbot + nginxで(<a
				href={p('/docs/deploy/vps/')}>VPSガイド</a
			>の通り)、またはACM証明書付きのApplication/Network Load Balancerを使用 — その後
			<code>relay.public_url</code>を設定して再起動します。
		</li>
	</ol>

	<h2>オプション2: Lightsail</h2>
	<p>
		Lightsail インスタンスは EC2 ガイドとまったく同じです — <strong>ネットワーキングタブ</strong>にファイアウォールルールがあります:
		TCP <code>8080</code>を開いてください。
	</p>

	<h2>オプション3: ECS / Fargate(コンテナ)</h2>
	<p>
		リポジトリの<code>Dockerfile</code>はビルド時に事前ビルド済みリリースバイナリをダウンロードします:
	</p>
	<ol>
		<li>
			イメージをECRにプッシュ:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			<strong><code>/data</code>にEFSボリュームをマウントした</strong>ECSサービス(Fargate、1タスク)を作成します(LMDB永続化
			— ないと再デプロイ時にデータが失われます)。
		</li>
		<li>
			ポート<code>8080</code>を公開し、前段にTLS用のALB + ACM証明書を配置します。
		</li>
		<li>
			組み込みの<code>deploy/nostrfy.container.toml</code>設定は、独自の<code>nostrfy.toml</code>を<code
				>/etc/nostrfy/nostrfy.toml</code
			>にマウントすることで上書きできます(例: イメージにコピーするフォーク)。
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		インスタンスを停止/起動する場合は<strong>Elastic IP</strong>をアタッチしてください — そうしないとパブリックIPが変わり、<code
			>public_url</code
		>が壊れます。
	</p>

	<Callout type="note" title="TLSはプロキシまたはプロバイダー側で終端されます">
		リレー自体は8080でプレーンなWebSocketを提供し、X-Forwarded-Protoを尊重します。
	</Callout>
</div>
