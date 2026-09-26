<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const installLabels: Record<string, string> = {
		'Specific version': '指定版本',
		'System-wide': '系統全域安裝',
		'Overwrite existing': '覆寫現有安裝',
		'Build from source': '從原始碼建置'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: '開源 Nostr 社交用戶端',
			quote:
				'Ditto 真正使用了這些 NIP — NIP-50 搜尋、NIP-22 討論串留言、NIP-57 Zap、NIP-94 媒體與 NIP-85 統計都是它的日常體驗 — 每一個都對應 nostrfy 的中繼功能。'
		},
		Nostrich: {
			tagline: '適用於 Web、iOS、Android 與 Mac 的免費 Nostr 用戶端',
			quote:
				'功能完整的用戶端，真正使用了這些 NIP — NIP-50 搜尋、NIP-17/59 私訊、NIP-57 Zap、NIP-88 投票與 Blossom 媒體都能在你的中繼上運作。'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: '完整實作規範',
			body: '所有中繼端 NIP 均已實作並對照官方規範驗證 — 36+ 個 NIP 以及 Blossom 檔案伺服器。'
		},
		{
			icon: 'shield',
			title: '永不下線',
			body: '過載保護、專用讀取執行緒、panic 隔離與嚴格的資源上限，讓中繼在持續濫用下仍能穩定服務。'
		},
		{
			icon: 'server',
			title: 'Blossom 媒體伺服器',
			body: '以 SHA-256 定址的上傳使用獨立主機名稱 — 本機磁碟或 S3 相容儲存桶（AWS S3、Cloudflare R2），支援上傳者簽章刪除。'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: '唯讀 /api/v1，可依 npub1、nevent1 或 naddr1 查詢事件 — 獨立的讀取執行緒意味著 REST 流量永遠不會阻塞 WebSocket 訂閱者。'
		},
		{
			icon: 'database',
			title: 'LMDB 持久化',
			body: '透過 heed 提供耐用且抗崩潰的儲存。記憶體映射以稀疏保留方式一次開到上限 — 執行階段無需擴充，實體佔用極小。'
		},
		{
			icon: 'wrench',
			title: '一切皆可設定',
			body: '所有設定都在 nostrfy.toml — 沒有編譯期選項。編輯、SIGHUP、完成。限制、NIP 切換、儲存等等。'
		},
		{
			icon: 'network',
			title: '可在 TLS 反向代理後運作',
			body: 'nginx、Caddy、Cloudflare Tunnel — 支援 WebSocket 升級與 X-Forwarded-Proto，wss:// 在任何代理前都能正常運作。'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: '單一靜態 Rust 二進位檔，支援 Linux x86_64、Linux aarch64 與 FreeBSD x86_64 — 已驗證可在 0.25 vCPU / 512 MB 的 VPS 上執行。'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: '事件/秒 寫入', note: '單一連線' },
		{ value: '100%', label: '即時扇出', note: '10,000 / 10,000 次投遞' },
		{ value: '0.32s', label: '儲存查詢', note: '20,000 事件' },
		{ value: '0.26s', label: 'NIP-50 搜尋', note: '10,000 結果' },
		{ value: '7.9 MB', label: '私有 RSS', note: '資料庫 252 MB' }
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
			'以 Rust 撰寫的一體化 Nostr 中繼伺服器引擎。完整實作規範，永不下線，完全透過 nostrfy.toml 設定。',
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
		installUrl: 'https://nostrfy.org/zh-Hant/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'zh-Hant'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="永不下線的 Nostr 中繼"
	description="nostrfy 是以 Rust 撰寫的一體化 Nostr 中繼伺服器引擎。完整實作規範，永不下線，完全透過 nostrfy.toml 設定。"
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
				Rust · MIT 或 Apache-2.0 · 最新版本
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			永不下線的
			<span class="text-accent-gradient">Nostr 中繼。</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> 是一體化 Nostr 中繼伺服器引擎。為極致速度而設計，天生輕量，預設強大。
			一行指令安裝，使用單一 TOML 檔案設定，幾乎可在任何 VPS 上執行。
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				安裝 nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				快速開始
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				檢視原始碼
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> 36+ 個中繼端 NIP
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · 容器
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> 單一二進位檔，無依賴
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
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">線上中繼</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="複製中繼網址" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">一行指令安裝</h2>
			<p class="mt-3 text-zinc-400">
				安裝腳本會偵測你的作業系統與架構，下載相符的預編譯二進位檔，驗證 sha256 校驗和並將其加入你的
				<code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>。
				無需複製原始碼、無需編譯、無需 sudo。
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', '無需 sudo', '安裝到 ~/.local/bin、~/bin 或 ~/.cargo/bin — PATH 中第一個已存在的目錄。'],
				['cpu', 'Linux + FreeBSD', '提供 x86_64 與 aarch64 Linux 預編譯二進位檔，以及 FreeBSD x86_64。'],
				['wrench', '校驗和驗證', '在二進位檔寫入磁碟之前，取得並驗證發行版校驗和。']
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
					<h3 class="text-sm font-semibold text-zinc-100">從 strfry 遷移？</h3>
					<p class="mt-1 text-sm text-zinc-500">
						用一行指令匯入你現有的事件 — 離線、經過驗證、可安全重複執行。
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				遷移指南 <Icon name="arrow-right" size={15} />
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
					一分鐘內跑起來
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy 內建常駐程式、設定驗證器、即時統計、日誌輪替與熱重載 — 中繼維運所需的一切，都在一個二進位檔裡。
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init 寫入一份帶完整註解的預設 nostrfy.toml',
						'nostrfy check 在啟動前驗證設定',
						'SIGHUP 無需重新啟動即可重載大部分設定',
						'nostrfy upgrade 將二進位檔更新到最新版本'
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
					開啟快速開始指南
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# 寫入預設 nostrfy.toml 並結束'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# 以常駐程式方式執行中繼'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# 即時連線數、事件數、資料庫大小'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="將任意 Nostr 用戶端指向 ws://<host>:8080 — 完成。"
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">為真實環境的中繼而打造</h2>
			<p class="mt-3 text-zinc-400">
				每個功能都圍繞兩個目標設計：永不下線，完整實作規範。結果就是一個能抵禦濫用、磁碟停滯與記憶體受限主機的中繼。
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
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">實測效能</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Release 建置、全新資料庫、8 執行緒的筆電。寫入速度受限於單一 LMDB 寫入執行緒，以及批次、無 fsync 的提交；讀取執行緒永遠不會阻塞它。
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
			使用隨附的基準測試重現 — 參閱
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">效能說明</a>。
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">完整實作 NIP 支援</h2>
				<p class="mt-3 text-zinc-400">
					所有中繼端 NIP 均已實作並驗證。NIP-11 中公佈的列表是動態的 — 當某個 NIP 的類型被封鎖時會自動移除。
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				完整 NIP 參考 <Icon name="arrow-right" size={15} />
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
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">優秀用戶端生態系</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy 採用用戶端所依賴的開放 NIP 標準 — 最好的 Nostr 應用可以隨插即用，獲得完整體驗。任何符合 NIP 的用戶端都能與你的中繼搭配。
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
			在 Nostr 上開發？將任意用戶端指向你的中繼 — 參閱
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">完整 NIP 參考</a>。
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
			幾分鐘內執行你自己的中繼
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			從最小的 VPS 到全球叢集 — 預編譯二進位檔、設定驗證器與部署指南讓這一切輕鬆無痛。
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> 立即安裝
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				部署指南 <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> 支援開發
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			有疑問？閱讀 <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">常見問題</a>，或了解 nostrfy
			與 <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">strfry 的比較</a> —
			並<a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">用一行指令遷移</a>。
		</p>
	</div>
</section>
