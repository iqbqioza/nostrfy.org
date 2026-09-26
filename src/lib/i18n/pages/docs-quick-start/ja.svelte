<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # 再起動せずに設定を再読み込みします`;
</script>

<DocsTitle
	title="クイックスタートガイド"
	description="インストールから稼働中の Nostr リレーまで数分:設定を書き、検証し、デーモンを起動して最初のヘルスチェックを実行するだけです。"
/>

<div class="doc-body">
	<h2>1. 設定を作成</h2>
	<p>
		<code>nostrfy init</code> は完全にコメント付きの既定の <code>nostrfy.toml</code> を書き出します:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>テキストエディタで開いて調整してください — 各オプションにはコメントがあります。</p>

	<h2>2. 設定を検証</h2>
	<p>
		<code>nostrfy check</code>  は起動前に強く推奨されます。問題があれば正確に報告します。
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. リレーを起動</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="デーモンとして実行します。--foreground を付けるとターミナルで実行します。"
	/>
	<p>その後、ヘルスエンドポイントでリレーが起動したことを確認します:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. クライアントを向ける</h2>
	<p>
		同じマシン上では、次のアドレスに接続します: <code>ws://&lt;host&gt;:8080</code>。既定のホスト
		<code>127.0.0.1</code> はローカル接続のみを受け付けます。他のマシンからリレーへアクセスするには、設定で <code>server.host = "0.0.0.0"</code> を設定します:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		 <code>wss://</code> を使うには、前段に TLS 終端プロキシ(nginx または Caddy)が必要です —
		<a href={p('/docs/deploy/')}>デプロイ</a>に関するドキュメントを参照してください。
	</p>

	<h2>5. 停止と再起動</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart は設定を読み直します。SIGHUP は再起動なしでほとんどの設定をリロードします。"
	/>

	<h2>効果的な運用</h2>
	<ul>
		<li>
			<code>nostrfy stats</code>  はライブ統計を表示 — HTTP でも
			<code>/relay/stats</code>  と  <code>/metrics</code>  から取得できます。
		</li>
		<li>ログは <code>daemon.log_file</code>  に書き込まれ、自動的にローテーションされます。</li>
		<li>
			<code>RUST_LOG</code>  はログレベルを制御します(例: <code>RUST_LOG=nostrfy=debug</code>)。
		</li>
	</ul>

	<Callout type="warning" title="外部クライアントが接続できない？">
		server.host の既定値は 127.0.0.1 です。host = "0.0.0.0" に設定して再起動してください。
	</Callout>

	<Callout type="tip" title="次のステップ">
		<a href={p('/docs/configuration/')}>設定リファレンス</a> でリレーのあらゆる面を調整できます。
	</Callout>
</div>
