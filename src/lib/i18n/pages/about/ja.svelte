<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: '落ちない',
			body: '過負荷保護、専用リーダースレッド、パニック隔離、厳格なリソース上限。リレーは動いていてこそ意味があります。'
		},
		{
			icon: 'layers',
			title: '仕様を完全実装',
			body: 'すべてのリレー側 NIP を実装し、公式仕様に照らして検証済み — 検索、グループ、メディア、管理 API を含みます。'
		},
		{
			icon: 'box',
			title: '単一バイナリ',
			body: '単一の静的 Rust バイナリがすべてを担います:リレー、REST API、Blossom ファイルサーバー、NIP-86 管理、デーモン、ログローテーション、統計。'
		},
		{
			icon: 'cpu',
			title: '本質的に軽量',
			body: '0.25 vCPU / 512 MB の VPS で快適に動作します。LMDB マップはスパースな仮想予約で、データベースが成長してもメモリは一定です。'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'nostrfy について',
		url: `${base}/ja/about/`,
		description:
			'nostrfy は Rust で書かれたオープンソースの Nostr リレーサーバーエンジンで、MIT または Apache-2.0 のデュアルライセンスです。プロジェクトとその設計理念をご覧ください。',
		inLanguage: 'ja',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` },
		mainEntity: {
			'@type': 'SoftwareApplication',
			name: 'nostrfy',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Linux, FreeBSD',
			license: [
				'https://opensource.org/licenses/MIT',
				'https://www.apache.org/licenses/LICENSE-2.0'
			]
		}
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${aboutJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy プロジェクトについて"
	description="nostrfy は Rust で書かれたオープンソースの Nostr リレーサーバーエンジンで、MIT または Apache-2.0 のデュアルライセンスです。プロジェクトとその設計理念をご覧ください。"
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">nostrfy について</h1>
				<p class="mt-1 text-sm text-zinc-500">オールインワンの Nostr リレーサーバーエンジン</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> は
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				プロトコルのリレーサーバーで、Rust 製です。クライアント(Amethyst、Damus、Iris など)が送信したイベントを保存し、購読に応じて配信します — 一般的なリレーに比べてほんのわずかなリソースで済みます。
			</p>
			<p>
				プロジェクトはある実験から始まりました:もしリレーが<strong class="text-zinc-200">たった 1 つの設定ファイルで定義でき</strong>、あなたが借りられる最小のサーバーで動かしながら、すべてのリレー側 NIP — さらにはファイルサーバー、REST API、管理 API まで実装できたら？nostrfy がその答えで、しかも無料です。MIT または Apache-2.0 ライセンスで公開しています。
			</p>
			<p>
				nostrfy プロジェクトは公式リレーを運用しており、同じバイナリが Linux(x86_64 と aarch64)と FreeBSD で、512 MB の VPS から数十万接続を処理する単一ホストまで検証されています。
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			{#each principles as p (p.title)}
				<div class="rounded-xl border border-line bg-surface/40 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={p.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{p.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{p.body}</p>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex flex-wrap gap-3">
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> GitHub でソースを見る
			</a>
			{#each site.relays as relay (relay.url)}
				<a
					href={relay.url}
					class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-mono text-sm text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
					{relay.url}
				</a>
			{/each}
		</div>
	</div>
</div>
