<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="nostrfy の紹介"
	description="nostrfy とは何か、標準で使える機能、そして Rust で書かれたオールインワン Nostr リレーエンジンの設計理念。"
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> は
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a> プロトコルのリレーサーバーです。クライアントが送信したイベント(投稿、リアクション、プロフィール……)を保存し、購読リクエストに応じて配信します。
	</p>

	<h2>主な特徴</h2>
	<ul>
		<li><strong>シンプルで安定</strong>  — Rust 製。1 つのバイナリですべてをこなします。</li>
		<li>
			<strong>高速なストレージと検索</strong>  — LMDB データベースと全文検索インデックス(NIP-50)。
		</li>
		<li>
			<strong>広範な NIP サポート</strong>  — 36 個の NIP に加えて Blossom ファイルサーバーを実装:削除、プルーフ・オブ・ワーク、委任、グループ、検索、管理 API。
		</li>
		<li>
			<strong>運用が簡単</strong>  — デーモンモード、ログローテーション、設定のホットリロード(SIGHUP)、ライブ統計、REST API、Prometheus メトリクス。
		</li>
		<li>
			<strong>移行が簡単</strong>  — 1 コマンドで既存の
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			データベースを取り込めます。dry-run、設定のマージ、安全な再実行に対応(<a href={p('/docs/migrating-from-strfry/')}>移行ガイド</a>)。
		</li>
	</ul>

	<h2>標準で使える機能</h2>
	<p>
		単一の <code>nostrfy</code> バイナリが 1 つのポートで提供します:
	</p>
	<ul>
		<li><strong>WebSocket リレー</strong>と NIP-11 情報ドキュメント。</li>
		<li>読み取り専用の <strong>REST API</strong>、場所は <code>/api/v1/...</code>  — 専用のリーダースレッドにより、REST トラフィックが WebSocket 購読者を妨げることはありません。</li>
		<li><strong>Blossom ファイルサーバー</strong>(メディアホスティング)。専用ホスト名で動作します。</li>
		<li><strong>NIP-86 管理 RPC</strong>、ヘルスチェック、Prometheus <code>/metrics</code>。</li>
	</ul>

	<h2>リソース使用量</h2>
	<p>
		nostrfy は <strong>0.25 vCPU / 512 MB VPS</strong> で動作します。LMDB メモリマップは 1 TiB のスパースな仮想予約で — 物理ディスクは実データ分だけ増え — プロセスメモリは一定に保たれます:データベース 252 MB のリレーでも <strong>7.9 MB のプライベート RSS</strong>。
	</p>

	<h2>すぐに試す</h2>
	<p>3 つのコマンドでインストール、初期化、起動が完了します:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>その後、リレーが起動したことを確認します:</p>
	<CodeBlock code={health} lang="bash" />
	<p>そして NIP-11 ドキュメントを取得します:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="次のステップ">
		<a href={p('/docs/quick-start/')}>クイックスタート</a>に従って初回実行を行い、あるいは直接
		<a href={p('/docs/configuration/')}>設定リファレンス</a>へ進んで調整してください。
	</Callout>
</div>
