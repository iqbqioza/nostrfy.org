<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const faqs = [
		{
			q: 'nostrfy とは？',
			a: 'nostrfy は Rust で書かれたオールインワンの Nostr リレーサーバーエンジンです。Nostr クライアントからのイベントを保存し、購読に応じて配信します。すべてのリレー側 NIP に加え、任意の Blossom メディアサーバー、読み取り専用 REST API、NIP-86 管理 API を 1 つのバイナリに収めています。'
		},
		{
			q: 'nostrfy は無料でオープンソースですか？',
			a: 'はい。nostrfy は自由ソフトウェアで、MIT または Apache-2.0 のデュアルライセンス(いずれかを選択)です。ソースは GitHub にあり、有料プラン、テレメトリ、ロックインはありません。'
		},
		{
			q: 'nostrfy の実行には何が必要ですか？',
			a: '単一の静的バイナリで Linux(x86_64 と aarch64)と FreeBSD(x86_64)上で動作します。0.25 vCPU / 512 MB の VPS で検証済みです。ストレージはローカルの LMDB データベースで、外部データベースサーバーは不要です。'
		},
		{
			q: 'nostrfy のインストール方法は？',
			a: '一行で:curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh。スクリプトが OS とアーキテクチャを検出し、一致するビルド済みバイナリをダウンロードしてチェックサムを検証し、PATH に配置します。Cargo でソースからビルドしたり、既成の設定テンプレートをコピーすることもできます。'
		},
		{
			q: 'nostrfy の設定方法は？',
			a: 'すべてはコメント付きの 1 つの nostrfy.toml に収められています — リレー識別情報、制限、ストレージ、アクセス制御、Blossom、RPC。nostrfy check が起動前に検証し、ほとんどの設定は SIGHUP で再起動なしにリロードされます。'
		},
		{
			q: 'nostrfy はどの NIP をサポートしますか？',
			a: 'nostrfy は 36 個の NIP を実装しています。NIP-01、NIP-09 削除、NIP-29 グループ、NIP-42 認証、NIP-50 検索、NIP-57 Zap、NIP-59 ギフトラップ、NIP-65 リレーリスト、NIP-77 negentropy、NIP-86 管理、NIP-98 HTTP 認証などです。NIP-11 の supported_nips リストは動的で、必要な kind がブロックまたは無効化されるとその NIP は消えます。'
		},
		{
			q: 'nostrfy はメディアファイルをホストしますか？',
			a: 'はい。内蔵の Blossom ファイルサーバーが、独自ホスト名で内容アドレス指定のアップロードを提供します。保存先はローカルディスクまたは AWS S3、Cloudflare R2 などの S3 互換バケットです。アップロードは署名された kind-24242 イベントで認可され、許可リストに制限できます。'
		},
		{
			q: 'strfry から移行できますか？',
			a: 'はい。nostrfy migrate-strfry は strfry のデータベースまたは JSONL エクスポートを直接インポートし、置換可能／アドレス指定可能セマンティクス、NIP-09 削除、NIP-29 の管理副作用を適用します。同等の strfry 設定を nostrfy.toml にマージすることもできます。移行はオフラインで dry-run 可能、再実行しても安全です。'
		},
		{
			q: 'nostrfy はリバースプロキシや Cloudflare の背後で動きますか？',
			a: 'はい。server.trusted_proxies にプロキシのアドレスを設定してください(同じホスト上の nginx や Caddy ならループバック、クラウドならロードバランサの範囲)。これにより IP ごとの上限、blockip、ログが実際のクライアントアドレスを認識できます。TLS はプロキシまたはトンネルが終端し、nostrfy はその背後で通常の HTTP と WebSocket を提供します。'
		},
		{
			q: 'nostrfy に REST API はありますか？',
			a: 'はい — 読み取り専用の /api/v1 が WebSocket リレーと同じポートで提供され、専用のリーダースレッドで動作するため、REST トラフィックが購読者を妨げることはありません。npub、nevent、naddr でイベントを照会でき、カウント、作成者統計、日別/月別の内訳、全文検索を提供します。'
		},
		{
			q: 'nostrfy は負荷や攻撃下でどうやって動き続けますか？',
			a: '過負荷保護、専用リーダースレッド、パニック隔離、厳格なリソース上限。有界キューはメモリを枯渇させる代わりに即座に失敗し、IP ごとの接続上限がソケットフラッドを防ぎ、ディスクの停滞も読み取りを妨げません。サブシステムを隔離しつつリレーは動き続けます。'
		},
		{
			q: 'ユーザー、バン、ロールはどう管理しますか？',
			a: 'NIP-86 JSON-RPC 管理 API を通じて、Bearer token または NIP-98 管理者キーで操作できます。公開鍵のバン、IP のブロック、kind 許可リスト、ロール、招待コードを管理できます。メソッド付与により、完全な管理者権限を与えずにモデレーションを他の公開鍵に委任できます。'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'ja',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="よくある質問"
	description="nostrfy に関する回答:インストール、設定、NIP 対応、Blossom メディア、strfry からの移行、リバースプロキシ、ライセンス、管理。"
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">よくある質問</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			nostrfy の運用に関する短い回答です。以下はすべて
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">ドキュメント</a>へのリンクです — よければ
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">strfry との比較</a>もご覧ください。
		</p>

		<div class="mt-10 space-y-3">
			{#each faqs as faq (faq.q)}
				<details class="group rounded-xl border border-line bg-surface/50 p-5">
					<summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-zinc-100">
						{faq.q}
						<Icon
							name="chevron-down"
							size={16}
							class="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
						/>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
				</details>
			{/each}
		</div>

		<div class="mt-12 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				nostrfy をインストール <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> ソースを見る
			</a>
		</div>
	</div>
</div>
