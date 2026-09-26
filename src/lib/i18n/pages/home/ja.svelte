<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'バージョンを指定',
		'System-wide': 'システム全体にインストール',
		'Overwrite existing': '既存を上書き',
		'Build from source': 'ソースからビルド'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'オープンソースの Nostr ソーシャルクライアント',
			quote:
				'Ditto はこれらの NIP を実際に使っています — NIP-50 検索、NIP-22 スレッドコメント、NIP-57 Zap、NIP-94 メディア、NIP-85 統計が日常的に使われ、そのすべてが nostrfy のリレー機能に対応します。'
		},
		Nostrich: {
			tagline: 'Web・iOS・Android・Mac 向けの無料 Nostr クライアント',
			quote:
				'高機能なクライアントで、これらの NIP を実際に使っています — NIP-50 検索、NIP-17/59 プライベートメッセージ、NIP-57 Zap、NIP-88 投票、Blossom メディアがあなたのリレーで動作します。'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: '仕様を完全実装',
			body: 'リレー側の NIP をすべて実装し、公式仕様に照らして検証済み — 36 以上の NIP と Blossom ファイルサーバー。'
		},
		{
			icon: 'shield',
			title: '落ちない',
			body: '過負荷保護、専用リーダースレッド、パニック隔離、厳格なリソース上限により、継続的な攻撃下でもサービスを提供し続けます。'
		},
		{
			icon: 'server',
			title: 'Blossom メディアサーバー',
			body: 'SHA-256 アドレス指定のアップロードを専用ホスト名で提供 — ローカルディスクまたは S3 互換バケット(AWS S3、Cloudflare R2)、投稿者署名による削除に対応。'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: '読み取り専用の /api/v1 で npub1・nevent1・naddr1 からイベントを検索 — 専用リーダースレッドにより REST トラフィックが WebSocket 購読者を妨げることはありません。'
		},
		{
			icon: 'database',
			title: 'LMDB 永続化',
			body: 'heed による堅牢でクラッシュセーフなストレージ。メモリマップは上限までスパースな仮想予約として確保 — 実行時のリサイズなし、実メモリ使用量はわずか。'
		},
		{
			icon: 'wrench',
			title: 'すべて設定可能',
			body: '設定はすべて nostrfy.toml に — コンパイル時オプションはありません。編集して SIGHUP を送れば完了です。上限、NIP スイッチ、ストレージなど。'
		},
		{
			icon: 'network',
			title: 'TLS リバースプロキシ対応',
			body: 'nginx、Caddy、Cloudflare Tunnel — WebSocket アップグレードと X-Forwarded-Proto を尊重し、どのプロキシの背後でも wss:// がそのまま動作します。'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: '単一の静的 Rust バイナリで Linux x86_64、Linux aarch64、FreeBSD x86_64 に対応 — 0.25 vCPU / 512 MB の VPS で動作確認済み。'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: '取り込み(イベント/秒)', note: '単一接続' },
		{ value: '100%', label: 'ライブファンアウト', note: '10,000 / 10,000 件配信' },
		{ value: '0.32s', label: '保存済みクエリ', note: '20,000 イベント' },
		{ value: '0.26s', label: 'NIP-50 検索', note: '10,000 件' },
		{ value: '7.9 MB', label: 'プライベート RSS', note: 'データベース 252 MB' }
	];

	const nips = [
		'1', '9', '11', '13', '17', '22', '26', '28', '29', '32', '33', '34', '40', '42', '43',
		'45', '46', '47', '50', '57', '59', '62', '65', '66', '67', '70', '77', '78', '84', '85',
		'86', '87', '88', '94', '98', 'A3', 'Blossom'
	];

	const softwareJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'nostrfy',
		description:
			'Rust で書かれたオールインワンの Nostr リレーサーバーエンジン。仕様を完全実装し、落ちず、nostrfy.toml で設定できます。',
		url: 'https://nostrfy.org/',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Linux, FreeBSD',
		license: ['https://opensource.org/licenses/MIT', 'https://www.apache.org/licenses/LICENSE-2.0'],
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		softwareVersion: '0.1.16',
		installUrl: 'https://nostrfy.org/ja/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'ja'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="落ちない Nostr リレー"
	description="nostrfy は Rust で書かれたオールインワンの Nostr リレーサーバーエンジン。仕様を完全実装し、落ちず、nostrfy.toml だけで設定できます。"
/>

<!-- ===== Hero ===== -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true"></div>
	<div
		class="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
		<img
			src="/logo.png"
			width={220}
			height={220}
			alt=""
			class="mx-auto rounded-[2.5rem]"
		/>
		<div
			class="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs text-zinc-400"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true"></span>
			<span>
				Rust · MIT または Apache-2.0 · 最新リリース
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			落ちない
			<span class="text-accent-gradient">Nostr リレー。</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> はオールインワンの Nostr リレーサーバーエンジン。
			設計から高速、本質的に軽量、標準で強力。1 行でインストールし、単一の TOML ファイルで設定して、
			ほぼどんな VPS でも動かせます。
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				nostrfy をインストール
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				クイックスタート
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				ソースを見る
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> リレー側 NIP 36 以上
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · コンテナ
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> バイナリ 1 つ、依存なし
			</span>
		</div>
	</div>
</section>

<!-- ===== Live relays ===== -->
<section class="relative border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
		<div class="mx-auto flex max-w-6xl justify-center">
			{#each site.relays as relay (relay.url)}
				<div class="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-line bg-bg/60 p-5">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"></span>
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">稼働中のリレー</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="リレー URL をコピー" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">1 行でインストール</h2>
			<p class="mt-3 text-zinc-400">
				インストールスクリプトが OS とアーキテクチャを検出し、一致するビルド済みバイナリをダウンロードして
				sha256 チェックサムを検証し、<code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code> に配置します。
				クローンもビルドも sudo も不要です。
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'sudo 不要', '~/.local/bin、~/bin、~/.cargo/bin のうち PATH にある最初のディレクトリにインストールします。'],
				['cpu', 'Linux + FreeBSD', 'x86_64 / aarch64 Linux と FreeBSD x86_64 のビルド済みバイナリを提供。'],
				['wrench', 'チェックサム検証', 'バイナリがディスクに書き込まれる前にリリースのチェックサムを取得して検証します。']
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

		<div class="mt-8 grid gap-3 md:grid-cols-2">
			{#each installVariants as variant (variant.title)}
				<div class="min-w-0">
					<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{installLabels[variant.title] ?? variant.title}</div>
					<CodeBlock code={variant.command} lang="bash" />
				</div>
			{/each}
		</div>

		<div class="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface/50 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg">
					<Icon name="database" size={17} class="text-accent-400" />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-zinc-100">strfry からの移行をお考えですか？</h3>
					<p class="mt-1 text-sm text-zinc-500">
						既存のイベントを 1 コマンドで取り込み — オフライン、検証済み、再実行しても安全です。
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				移行ガイド <Icon name="arrow-right" size={15} />
			</a>
		</div>
	</div>
</section>

<!-- ===== Quick start ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
					1 分以内に稼働
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy にはデーモン、設定バリデータ、ライブ統計、ログローテーション、ホットリロード —
					リレー運用に必要なすべてが 1 つのバイナリに含まれています。
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init が完全にコメント付きの既定の nostrfy.toml を書き出します',
						'nostrfy check が起動前に設定を検証します',
						'SIGHUP で再起動せずにほとんどの設定をリロードできます',
						'nostrfy upgrade がバイナリを最新リリースに更新します'
					] as line (line)}
						<li class="flex gap-3 text-sm text-zinc-300">
							<Icon name="check" size={16} class="mt-0.5 shrink-0 text-accent-400" />
							{line}
						</li>
					{/each}
				</ul>
				<a
					href={p('/docs/quick-start/')}
					class="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
				>
					クイックスタートガイドを開く
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# 既定の nostrfy.toml を書き出して終了'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# リレーをデーモンとして起動'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# 接続数、イベント数、データベースサイズ'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="お使いの Nostr クライアントを ws://<host>:8080 に向けるだけ — 完了です。"
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">実運用のリレーのために</h2>
			<p class="mt-3 text-zinc-400">
				すべての機能は 2 つの目標に沿って設計されています。落ちないこと、そして仕様を完全に実装すること。
				その結果、攻撃、ディスクの停滞、メモリの少ないホストに耐えるリレーになりました。
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div class="group rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:border-line-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg transition-colors group-hover:border-accent-500/40">
						<Icon name={feature.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{feature.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Performance ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">実測パフォーマンス</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Release ビルド、新規データベース、8 スレッドのノート PC。書き込み速度は単一の LMDB ライタースレッドと
			バッチ化された fsync なしコミットに制約され、リーダーがそれを妨げることはありません。
		</p>
		<div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each benchmarks as b (b.label)}
				<div class="rounded-xl border border-line bg-bg/60 p-5 text-center">
					<div class="text-2xl font-bold tracking-tight text-accent-300">{b.value}</div>
					<div class="mt-1 text-xs font-medium text-zinc-300">{b.label}</div>
					<div class="mt-0.5 text-[11px] text-zinc-600">{b.note}</div>
				</div>
			{/each}
		</div>
		<p class="mt-6 text-center text-xs text-zinc-600">
			同梱のベンチマークで再現できます — 詳しくは
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">パフォーマンスノート</a>。
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">NIP を仕様どおり完全サポート</h2>
				<p class="mt-3 text-zinc-400">
					リレー側の NIP はすべて実装・検証済み。NIP-11 で公開されるリストは動的で、
					NIP の kind がブロックされると自動的に外れます。
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				完全な NIP リファレンス <Icon name="arrow-right" size={15} />
			</a>
		</div>

		<div class="mt-8 flex flex-wrap gap-2">
			{#each nips as nip (nip)}
				<span class="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs text-zinc-300">
					{nip}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Clients ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">優れたクライアントのエコシステム</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy はクライアントが頼るオープンな NIP 標準を話します — 最高の Nostr アプリをそのまま接続して
				フル機能を利用できます。NIP 準拠のクライアントならどれでもあなたのリレーで動きます。
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each displayClients as client (client.name)}
				<a
					href={client.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group rounded-xl border border-line bg-bg/60 p-5 transition-colors hover:border-line-2"
				>
					<div class="flex items-center gap-3">
						{#if client.icon}
							<img
								src={client.icon}
								alt=""
								width={40}
								height={40}
								class="rounded-lg"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-accent-300"
							>
								{client.name.charAt(0)}
							</div>
						{/if}
						<div class="min-w-0">
							<div class="flex items-center gap-1.5 text-sm font-semibold text-zinc-100 group-hover:text-white">
								{client.name}
								<Icon name="arrow-up-right" size={13} class="text-zinc-500 group-hover:text-accent-300" />
							</div>
							<div class="truncate text-xs text-zinc-500">{client.tagline}</div>
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">{client.quote}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each client.features as feature (feature)}
							<span
								class="rounded-md border border-line bg-surface/50 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
								{feature}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>

		<p class="mt-6 text-center text-xs text-zinc-600">
			Nostr で開発していますか？任意のクライアントをあなたのリレーに向けてください — 詳しくは
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">完全な NIP リファレンス</a>。
		</p>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="relative overflow-hidden">
	<div
		class="absolute inset-x-0 bottom-0 h-72 bg-accent-500/10 blur-[100px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6">
		<h2 class="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight">
			数分で自分のリレーを運用
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			小さな VPS からグローバル規模まで — ビルド済みバイナリ、設定バリデータ、デプロイガイドで手間なく始められます。
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> 今すぐインストール
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				デプロイガイド <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> 開発を支援
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			疑問がありますか？<a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">FAQ</a> を読むか、
			nostrfy と <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">strfry の比較</a>をご覧ください —
			そして<a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">1 コマンドで移行</a>できます。
		</p>
	</div>
</section>
