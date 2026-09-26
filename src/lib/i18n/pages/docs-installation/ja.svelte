<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const lowSpecConfig = `[database]
search_index = false   # データベースサイズを半分にし、CPU/IO を節約します`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="インストールガイド"
	description="環境要件、ソースからのビルド、ビルド済みバイナリのインストール、チェックサムの検証、および FreeBSD で nostrfy を実行する際の注意点。"
/>

<div class="doc-body">
	<h2>環境要件</h2>
	<ul>
		<li>新しい安定版 Rust ツールチェーン(リレーのビルド時のみ必要)。</li>
		<li>Linux マシン。</li>
		<li>2 GB 以上のメモリを推奨 — 0.25 vCPU / 512 MB VPS の場合は以下の低スペック向け注意を参照してください。</li>
	</ul>

	<h3>低スペック VPS(0.25 vCPU / 512 MB)</h3>
	<p>
		データベースがメモリを超えても、nostrfy が安定して動作することを検証済みです。LMDB マップは
		<strong>スパースな 1 TiB 仮想予約</strong>  — 物理ディスクは書き込まれたデータ分だけ増え — プロセスメモリは一定:データベース 252 MB のリレーでも <strong>7.9 MB のプライベート RSS</strong>
		(残りはカーネルが圧力下で解放する回収可能なファイルキャッシュです)。
	</p>
	<p>小さな VPS では、1 つの設定が最も効果的です:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>設定</th>
				<th>効果</th>
				<th>実測</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					NIP-50 単語インデックスを無効化 — 検索は引き続き動作します(全語一致)が遅くなります
				</td>
				<td>10,000 イベントあたり 41.8 MB → 20.5 MB</td>
			</tr>
			<tr>
				<td>既定値</td>
				<td>低メモリ向けに調整済み</td>
				<td>512 MB では変更不要</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>ソースからのビルド</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>ビルドが完了すると、バイナリは <code>target/release/nostrfy</code> に生成されます。</p>

	<h2>ビルド済みバイナリのインストール</h2>
	<p>
		リリースワークフローは <strong>Linux x86_64</strong>、<strong>Linux aarch64</strong> 、
		<strong>FreeBSD x86_64</strong> のビルド済みバイナリを提供します。同じ
		<code>install.sh</code>  は両 OS で動作します — プラットフォームを検出し、一致するバイナリをダウンロードしてチェックサムを検証します:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy は FreeBSD 13.x と 14.x(amd64)でビルド・実行できます。Rust をインストールしてビルドします:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>プラットフォームに関する注意:</p>
	<ul>
		<li>
			<code>start</code>/<code>stop</code>/<code>restart</code> が使用するプロセス生存確認は FreeBSD では
			<code>kern.proc.pid.&lt;pid&gt;.comm</code> sysctl でプロセス名を読み取ります(Linux では
			<code>/proc/&lt;pid&gt;/comm</code>)ため、両プラットフォームで pid が他プログラムに再利用された古い pid ファイルを検出できます。
		</li>
		<li>
			<code>nostrfy start</code> は Linux と同様にデーモン化します。標準の二重 fork デーモンは既定の
			<code>rc</code> との統合(<code>service nostrfy start</code>)と組み合わせて動作します。
		</li>
		<li>
			Blossom の <code>min_free_bytes</code> のチェックは <code>statvfs</code> を使用しており、両システムが提供しています。他にプラットフォーム固有のコードはありません(リレー自体は tokio 上の純粋な非同期 Rust です)。
		</li>
	</ul>

	<h3>80 ポートでの実行</h3>
	<p>
		一般ユーザーはポート 80 をバインドできません。 <code>sudo</code> で実行するか、8080 など高いポートを使用してください。
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="例:ポート 8080 で実行(一般ユーザーでも可。先に設定でポートを変更してください)。"
	/>

	<Callout type="tip" title="次のステップ">
		nostrfy のインストールが完了しました。<a href={p('/docs/quick-start/')}>クイックスタート</a>ガイドに従ってください。
	</Callout>
</div>
