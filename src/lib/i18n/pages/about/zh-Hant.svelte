<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: '永不下線',
			body: '過載保護、專用讀取執行緒、panic 隔離與嚴格的資源上限。中繼只有在運作時才有意義。'
		},
		{
			icon: 'layers',
			title: '完整實作規範',
			body: '所有中繼端 NIP 均已實作並對照官方規範驗證 — 包括搜尋、群組、媒體與管理 API。'
		},
		{
			icon: 'box',
			title: '單一二進位檔',
			body: '一個靜態 Rust 二進位檔完成一切：中繼、REST API、Blossom 檔案伺服器、NIP-86 管理、常駐程式、日誌輪替與統計。'
		},
		{
			icon: 'cpu',
			title: '天生輕量',
			body: '0.25 vCPU / 512 MB 的 VPS 即可輕鬆執行。LMDB 映射是稀疏虛擬保留；隨著資料庫成長，記憶體保持平穩。'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: '關於 nostrfy',
		url: `${base}/zh-Hant/about/`,
		description:
			'nostrfy 是以 Rust 撰寫的開源 Nostr 中繼伺服器引擎，採用 MIT 或 Apache-2.0 雙授權。了解這個專案及其設計理念。',
		inLanguage: 'zh-Hant',
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
	title="關於 nostrfy 專案"
	description="nostrfy 是以 Rust 撰寫的開源 Nostr 中繼伺服器引擎，採用 MIT 或 Apache-2.0 雙授權。了解這個專案及其設計理念。"
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">關於 nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">一體化 Nostr 中繼伺服器引擎</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> 是
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				協定的中繼伺服器，以 Rust 撰寫。它儲存用戶端（Amethyst、Damus、Iris 等）傳送的事件，並依訂閱將它們投遞 —
				所需資源僅為典型中繼的一小部分。
			</p>
			<p>
				專案始於一個實驗：如果中繼可以<strong class="text-zinc-200">只用一份設定檔定義</strong>，執行在你能租到的最小
				伺服器上，同時實作所有中繼端 NIP — 外加檔案伺服器、REST API 與管理介面，會怎樣？nostrfy 就是答案，
				而且它免費：依 MIT 或 Apache-2.0 授權發布。
			</p>
			<p>
				nostrfy 執行著專案的官方中繼，同一個二進位檔已在 Linux（x86_64 與 aarch64）與 FreeBSD 上驗證，
				從 512 MB VPS 到服務數十萬連線的單一主機。
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
				<Icon name="github" size={16} /> 在 GitHub 檢視原始碼
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
