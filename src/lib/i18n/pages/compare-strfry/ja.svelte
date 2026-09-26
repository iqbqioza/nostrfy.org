<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: '言語', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'ライセンス', nostrfy: 'MIT or Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'ストレージ', nostrfy: 'LMDB(外部データベース不要)', strfry: 'LMDB(外部データベース不要)' },
		{ label: '設定', nostrfy: '単一の nostrfy.toml、ホットリロード(SIGHUP)', strfry: 'strfry.conf、ホットリロード' },
		{ label: '公表している NIP', nostrfy: '34 個(36 個実装、任意を含む)', strfry: '11 個のコア NIP' },
		{ label: 'NIP-29 グループ + LiveKit', nostrfy: '内蔵', strfry: '—' },
		{ label: 'Blossom メディアサーバー', nostrfy: '内蔵(ローカルディスクまたは S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: '内蔵 /api/v1', strfry: '—' },
		{ label: '管理 API', nostrfy: 'NIP-86 JSON-RPC、管理者の委任', strfry: '—' },
		{ label: 'Negentropy(NIP-77)', nostrfy: '対応', strfry: '対応 — strfry が生み出しました' },
		{ label: '書き込みポリシー / プラグイン', nostrfy: '内蔵の許可/拒否リスト + NIP-86', strfry: '書き込みポリシープラグインインターフェース' },
		{ label: '移行ツール', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/ja/compare/strfry/`,
		description:
			'nostrfy と strfry の正直な比較。自前で Nostr リレーを運用する方向けに、機能、ライセンス、運用、そして 1 コマンドで strfry から移行する方法をまとめました。',
		inLanguage: 'ja',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry:Nostr リレー比較"
	description="nostrfy と strfry の正直な比較。自前で Nostr リレーを運用する方向けに、機能、ライセンス、運用、そして 1 コマンドで strfry から移行する方法をまとめました。"
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">比較</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			どちらも単一バイナリの Nostr リレーで、イベントを LMDB に保存し、同じプロトコルを話します。しかしトレードオフが異なります:
			<strong class="text-zinc-200">strfry</strong> は成熟した C++ リレーで、書き込みポリシープラグインシステムを持ちます。一方
			<strong class="text-zinc-200">nostrfy</strong> は Rust 製のエンジンで、運営者に必要な機能 — グループ、メディア、REST、管理 — を 1 つのバイナリと 1 つの設定ファイルにまとめています。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">一目でわかる</h2>
		<div class="mt-5 overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>nostrfy</th>
						<th>strfry</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.label)}
						<tr>
							<td class="text-zinc-500">{row.label}</td>
							<td class="text-zinc-200">{row.nostrfy}</td>
							<td class="text-zinc-400">{row.strfry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">ライセンス</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry は <strong class="text-zinc-200">GPL-3.0</strong> ライセンスで、派生作品にも同じ条件を課します。nostrfy は <strong class="text-zinc-200">MIT または Apache-2.0</strong> のデュアルライセンスなので、クローズドソース製品に組み込んで自由に再ライセンスできます。リレーが商用その他のライセンススタックの一部なら、これが決め手になることがよくあります。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">設定と運用</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy は完全にコメントされた <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					> で設定を一箇所にまとめています:アイデンティティ、制限、ストレージ、アクセス制御、Blossom、RPC。ほとんどの設定は SIGHUP でホットリロードされます。
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					すべてのオプションはリレーの起動前に <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> で検証できます — 誤った型、不可能な制限、ロックアウトの組み合わせを修正案付きで報告します。
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					デーモンにはログローテーション、ライブ統計、ヘルスエンドポイント、Prometheus メトリクスが付属し、CLI でアクセスリスト、アップグレード、移行を管理できます。
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">内蔵機能</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			nostrfy は外部サービスを追加する代わりに、公開リレーが必要とする機能を内蔵しています:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'NIP-29 グループ + LiveKit', 'リレーが管理するグループ、管理イベント、リレー署名のグループメタデータに加え、LiveKit による音声/映像ルーム。'],
				['database', 'Blossom メディアサーバー', '内容アドレス指定のアップロードは独自ホスト名で動作し、ローカルディスクまたは S3 互換バケット(AWS S3、Cloudflare R2)に対応します。'],
				['server', 'REST API', '読み取り専用の /api/v1 は専用のリーダースレッドで動作し、npub、nevent、naddr でイベントを照会でき、カウント、統計、検索に対応します。'],
				['lock', 'NIP-86 管理', 'JSON-RPC 管理 API。Bearer または NIP-98 認証、委任メソッド付与、招待コードに対応します。']
			] as [icon, title, body] (title)}
				<div class="rounded-xl border border-line bg-surface/50 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
				</div>
			{/each}
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">strfry の強み</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry はいまでも優れた選択です。negentropy プロトコルを生み出し、ゼロダウンタイム再起動と任意の WebSocket 圧縮に対応し、書き込みポリシープラグインインターフェースで公開ごとに任意のロジックを実行できます。プラグインサンドボックスだけが必要で、このリストの他の機能が不要なら、strfry は最適です。グループ、メディア、REST、管理を最初から備えたい、あるいは寛容なライセンスが必要なら — nostrfy が近道です。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">strfry からの移行</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			ゼロから始める必要はありません。<code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> strfry 自身のエクスポート形式を読み取り、すべてのイベントを検証してデータベース全体をインポートします — NIP-09 削除、NIP-29 管理副作用、初回検出タイムスタンプを含みます。オフラインで dry-run 可能、安全に繰り返せます。
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				移行ガイドを読む <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				クイックスタート <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				完全な NIP リファレンス
			</a>
		</div>
	</div>
</div>
