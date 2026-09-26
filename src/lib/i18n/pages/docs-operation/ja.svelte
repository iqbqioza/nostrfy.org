<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="リレーの運用"
	description="nostrfy リレーの運用:起動と停止、ログと統計、設定のホットリロード、複数インスタンス、大規模チューニング。"
/>

<div class="doc-body">
	<h2>起動と停止</h2>
	<p>リレーをバックグラウンドのデーモンとして起動します:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>またはターミナルでフォアグラウンド実行:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>停止:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>起動を確認:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>ログと統計</h2>
	<p>
		デーモンは次のファイルに書き込みます: <code>daemon.log_file</code>。ファイルが <code>max_log_size_bytes</code> を超えると自動的にローテーションします(<code>nostrfy.log.1</code>、<code>.2</code>……最大 <code>max_log_files</code> 世代):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>ログレベルは <code>RUST_LOG</code> 環境変数で制御します(例: <code>RUST_LOG=debug</code>)。</p>
	<h3>統計</h3>
	<p>CLI からライブ統計を取得:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>または HTTP 経由:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>接続数、承認／拒否されたイベント、DB サイズなどが表示されます。</p>
	<h3>Prometheus メトリクス</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>ホットリロード(SIGHUP)</h2>
	<p>設定ファイルを編集したら、再起動せずにリロードできます:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>リロード時に有効</th>
				<th>再起動が必要</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>リレー ID、public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>大部分の [limits]、reject_ephemeral、enabled_git、enabled_nip78_auth</td>
				<td>api_host、metrics_enabled、LiveKit 設定</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips、server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.*(search_index を含む)、blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>再起動が必要な設定が変更されると、ログが警告します。</p>

	<h2>複数インスタンスの実行</h2>
	<p>
		nostrfy は 1 台のサーバーで複数の独立したリレー(異なるポート)を実行できます。各インスタンスには独自の
		<code>server.port</code>、<code>[daemon]</code> の
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		(共有すると 2 番目のインスタンスが <code>already running</code> で拒否されます)、
		<code>database.path</code>、および(使用する場合)独自の <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>各インスタンスは独自の設定で管理します:<code>nostrfy --config /etc/nostrfy/a.toml start</code> など。</p>

	<h2>大規模デプロイ</h2>
	<p>
		このリレーは単一ホストで数十万接続まで拡張できるよう設計されています — ライブ配信はイベントに一致し得る購読者だけを起こし、接続あたりのメモリは小さく保たれます。数百万規模にはホストレベルのチューニングが必要です:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>設定</th>
				<th>値</th>
				<th>理由</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>目標接続数の 2 倍以上(+1000)</td>
				<td>接続ごとに fd を 1 つ消費します</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>接続バースト時の保留 accept キュー</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>低くする(例:10)</td>
				<td>TIME_WAIT ソケットをより早く回収</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 または 2</td>
				<td>LMDB マップは大きなスパース仮想予約です</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		FreeBSD では、対応するパラメータは <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> と
		<code>ulimit -n</code> で、<code>kern.ipc.somaxconn</code> が <code>net.core.somaxconn</code> に対応します。1 接続あたりのカーネルメモリは約 80 KiB、ユーザー空間は約 10 KiB なので、100 万接続ではデータベースとは別に約 90 GiB のカーネル + ユーザーメモリが必要です。
	</p>

	<h2 id="throughput">スループット(毎秒イベント数)</h2>
	<p>
		イベントの書き込みは 2 つのコストに制約されます:Schnorr 署名検証(1 イベントあたり約 30〜50 µs)と、LMDB ライターが各コミットバッチ後に実行する同期ディスクフラッシュです。どちらも <code>nostrfy.toml</code> で調整できます:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>設定</th>
				<th>理由</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>OS ページキャッシュへコミット(マイクロ秒);電源断で失われるのは最後のフラッシュ以降の書き込みのみ — ここから始めましょう</td>
			</tr>
			<tr>
				<td>CPU コア ≥ 8 vCPU</td>
				<td>バッチ EVENT パスがコアをまたいで並列に署名検証</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>書き込み重視のインスタンス向けに、イベントごとの NIP-50 語インデックス書き込みを省きます</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		並列署名検証は、保留中のバッチ内のすべての署名を一度にワーカースレッドプールで検証します(上限 8。16 イベント未満のバッチはインラインで検証)。各イベントの軽量チェックは先に実行されるため、拒否理由の文言は逐次処理と同一です — Schnorr の処理だけが各コアに分散されます。シングルスレッドビルドは逐次のままです。
	</p>

	<h2>固定の不正対策リミット</h2>
	<p>
		リレーが濫用下でも応答し続けるよう、いくつかのハードリミットは固定されています(設定不可):
	</p>
	<ul>
		<li>
			1 つのフィルターが持つのは最大 <strong>512</strong> 個 <code>ids</code>、<code>authors</code> または
			<code>kinds</code> エントリ;<code>#...</code> タグ値はフィルターごとに別の <strong>512</strong>
			値の予算。より大きなフィルターは拒否されます(<code>CLOSED invalid: ...</code>)。
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> は最大 10,000 個のソース IP を追跡します。満杯になると、未見の IP は拒否されます(フェイルクローズ)。
		</li>
		<li>
			<code>ids</code>  フィルター内のイベント id はプレフィックスでも構いませんが、完全な 32 バイト id と偶数長のプレフィックスのみ一致します(奇数長/空のエントリは履歴とライブ配信の両方で無視されます)。
		</li>
		<li>
			過長なインデックスキー(タグ値、内容の単語、LMDB のキーサイズ制限を超える <code>d</code> タグ)は索引時にスキップされます;イベント自体は保存されます。
		</li>
	</ul>
</div>
