<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # NIP-11 経由でクライアントに表示されます
description = "A friendly relay for everyone"
private_key = "..."                            # NIP-29 グループに必須です
public_url = "wss://<your-app-name>.fly.dev"   # NIP-42/62/98 に必須です`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# ログ行: "relay listening on ws://0.0.0.0:8080"
fly logs

# 公開アドレス経由で NIP-11 情報ドキュメントを取得します
curl https://<your-app-name>.fly.dev/

# Nostr クライアントを wss://<your-app-name>.fly.dev に向けてください`;
</script>

<DocsTitle
	title="Fly.io へのデプロイ"
	description="既製テンプレートで数分で nostrfy を Fly.io にデプロイ — ボリューム、マシン、TLS 終端、シンプルな更新。"
/>

<div class="doc-body">
	<h2>リポジトリに含まれるもの</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>ファイル</th>
				<th>目的</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					コンテナイメージ — GitHub リリースアセットからビルド済みリリースバイナリ(x86_64 / aarch64、ビルドアーキテクチャで選択)をダウンロードし、sha256 チェックサムを検証します。Fly 上ではコンパイルは行われません
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Fly アプリ設定:ポート 8080 の HTTP サービス、ヘルスチェック、<code>/data</code> ボリュームマウント、常時起動マシン
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					イメージ内の <code>/etc/nostrfy/nostrfy.toml</code> に焼き込まれるリレー設定
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>前提条件</h2>
	<ul>
		<li>Fly.io アカウント</li>
		<li>flyctl CLI(<code>fly version</code>)</li>
		<li>ログイン済み:<code>fly auth login</code></li>
	</ul>

	<h2>4 ステップでデプロイ</h2>

	<h3>1. アプリを作成(まだデプロイしない)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> は Fly 上で一意である必要があります(リレー URL の一部になります:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>:例 <code>nrt</code>(東京)、<code>fra</code>、
			<code>iad</code>、<code>sjc</code> — ユーザーに最も近いリージョンを選んでください
		</li>
		<li>
			テンプレートの <code>fly.toml</code> の値(アプリ名、リージョン)を上書きすることがあります — 問題ありません
		</li>
	</ul>

	<h3>2. 永続ボリュームを作成</h3>
	<p>LMDB データベースは <code>/data</code> にマウントされた Fly ボリューム上にあります:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		開始には 1 GB で十分です(データベースは利用に応じて増加します)。後でリサイズも、最初から大きめに作成もできます。
	</p>

	<h3>3. リレーを設定</h3>
	<p>デプロイ前に <code>deploy/nostrfy.container.toml</code> を編集してください:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>:一時的な設定で <code>nostrfy genkey</code> を実行してローカルで生成し、貼り付けるか、任意の Nostr ツールで生成してください
		</li>
		<li>
			<code>public_url</code> はアプリ名と一致している<strong>必要があります</strong> — ない場合、NIP-42 AUTH、NIP-62 vanish、NIP-86 管理 API は動作しません
		</li>
		<li>その他は既定値のままで構いません</li>
	</ul>

	<h3>4. デプロイ</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly がイメージをビルドし(数分 — バイナリのダウンロードは高速でイメージは小さい)、マシンを作成して <code>/health</code> へのヘルスチェックを実行します。
	</p>

	<h2>検証</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>スケーリングと更新</h2>
	<ul>
		<li>
			<strong>リレーを更新</strong>:<code>deploy/nostrfy.container.toml</code> を編集して再度 <code>fly deploy</code> — イメージは常に最新の GitHub リリースバイナリをダウンロードするため、更新は再デプロイだけです
		</li>
		<li>
			<strong>バージョンを固定</strong>:<code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> または Dockerfile 内の <code>ARG</code> を変更
		</li>
		<li>
			<strong>スケール</strong>:既定ではリレーは単一マシンです。<code>fly machines clone &lt;id&gt;</code> で 2 台目を作成できます。両方がボリュームを共有します(Fly ボリュームは同一リージョン内の複数マシンに対応)
		</li>
		<li>
			<strong>メトリクス</strong>:Fly は <code>/metrics</code> エンドポイントを収集し(<code>fly.toml</code> の <code>[metrics]</code> を参照)、Fly ダッシュボードのメトリクスに表示します
		</li>
	</ul>

	<h2>設定のカスタマイズ</h2>
	<p>
		イメージは <code>deploy/nostrfy.container.toml</code> から焼き込まれた <code>/etc/nostrfy/nostrfy.toml</code> を読み取ります。カスタマイズ方法は 2 つあります:
	</p>
	<ol>
		<li>
			<strong>リポジトリ内の <code>deploy/nostrfy.container.toml</code> を編集</strong>して再デプロイ(最も簡単)
		</li>
		<li>
			<strong>独自設定をマウント</strong>:設定ファイルを <code>/etc/nostrfy/nostrfy.toml</code> に上書きコピーするフォークイメージをビルド
		</li>
	</ol>
	<p>すべてのオプションは<a href={p('/docs/configuration/')}>設定リファレンス</a>に記載されています。</p>

	<h2>注意点</h2>
	<ul>
		<li>
			<strong>常時起動設計</strong>:<code>fly.toml</code> の <code>auto_stop_machines = false</code> — リレーはアイドル時にも停止してはなりません
		</li>
		<li>
			コンテナはリレーを<strong>フォアグラウンドモード</strong>(<code>nostrfy start --foreground</code>)で実行します。ログは stdout/stderr に出力され、Fly が収集します
		</li>
		<li>
			TLS は Fly が終端します。リレー自体はポート 8080 でプレーン WebSocket を提供します
		</li>
		<li>
			<strong>Blossom メディアホスト</strong>:Blossom サーバーも提供するには、設定で <code>blossom.host = "media.example.com"</code> を設定し、<code>media.example.com</code> を同じ Fly アプリの<strong>追加ホスト名</strong>として追加し(<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> または <code>fly hostnames</code>)、Fly ダッシュボードで <code>media.</code> の TLS 証明書を追加します — リレーは内部でホストを分割します(<code>server.api_host</code> と同様)
		</li>
	</ul>

	<Callout type="note" title="TLS は Fly が終端します">
		リレー自体はポート 8080 でプレーン WebSocket を提供します。
	</Callout>
</div>
