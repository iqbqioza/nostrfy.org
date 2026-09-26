<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: '語言', nostrfy: 'Rust', strfry: 'C++' },
		{ label: '授權', nostrfy: 'MIT or Apache-2.0', strfry: 'GPL-3.0' },
		{ label: '儲存', nostrfy: 'LMDB（無需外部資料庫）', strfry: 'LMDB（無需外部資料庫）' },
		{ label: '設定', nostrfy: '單一 nostrfy.toml，熱重載（SIGHUP）', strfry: 'strfry.conf，熱重載' },
		{ label: '公佈的 NIP', nostrfy: '34 個（實作 36 個，含選用）', strfry: '11 個核心 NIP' },
		{ label: 'NIP-29 群組 + LiveKit', nostrfy: '內建', strfry: '—' },
		{ label: 'Blossom 媒體伺服器', nostrfy: '內建（本機磁碟或 S3/R2）', strfry: '—' },
		{ label: 'REST API', nostrfy: '內建於 /api/v1', strfry: '—' },
		{ label: '管理 API', nostrfy: 'NIP-86 JSON-RPC，可委派管理員', strfry: '—' },
		{ label: 'Negentropy（NIP-77）', nostrfy: '支援', strfry: '支援 — strfry 是它的發源地' },
		{ label: '寫入原則 / 外掛', nostrfy: '內建允許/拒絕清單 + NIP-86', strfry: '寫入原則外掛介面' },
		{ label: '遷移工具', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/zh-Hant/compare/strfry/`,
		description:
			'對 nostrfy 與 strfry 的誠實比較，面向自建 Nostr 中繼 — 功能、授權、維運，以及如何用一行指令從 strfry 遷移。',
		inLanguage: 'zh-Hant',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry：Nostr 中繼比較"
	description="對 nostrfy 與 strfry 的誠實比較，面向自建 Nostr 中繼 — 功能、授權、維運，以及如何用一行指令從 strfry 遷移。"
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
			兩者都是單一二進位檔的 Nostr 中繼，將事件儲存在 LMDB 中並使用相同協定。它們做出不同的取捨：
			<strong class="text-zinc-200">strfry</strong> 是成熟的 C++ 中繼，擁有寫入原則外掛系統；而
			<strong class="text-zinc-200">nostrfy</strong> 是以 Rust 撰寫的引擎，將維運者所需的功能 —
			群組、媒體、REST、管理 — 打包在一個二進位檔與一個設定檔中。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">一覽</h2>
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">授權</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry 採用 <strong class="text-zinc-200">GPL-3.0</strong> 授權，要求衍伸作品以相同條款發布。
			nostrfy 採用 <strong class="text-zinc-200">MIT 或 Apache-2.0</strong> 雙授權，因此可以嵌入閉源產品並自由重新授權。
			如果你的中繼是商業或其他授權堆疊的一部分，這往往就是決定性差異。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">設定與維運</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy 由單一帶完整註解的 <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					> 設定：身分、限制、儲存、存取控制、Blossom 與 RPC 集中在一處。大部分設定在 SIGHUP 時熱重載。
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					每個選項都會在中繼啟動前由 <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> 驗證 — 錯誤的類型、不可能的極限與鎖定組合都會連同修正建議一起回報。
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					常駐程式內建日誌輪替、即時統計、健康端點與 Prometheus 指標；CLI 管理存取清單、升級與遷移。
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">內建功能</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			nostrfy 無需外掛附屬服務，而是內建了公共中繼通常需要的服務：
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'NIP-29 群組 + LiveKit', '中繼強制的群組、管理事件與中繼簽章的群組中繼資料，外加透過 LiveKit 的影音房間。'],
				['database', 'Blossom 媒體伺服器', '內容定址的上傳使用獨立主機名稱，支援本機磁碟或 S3 相容儲存桶（AWS S3、Cloudflare R2）。'],
				['server', 'REST API', '唯讀 /api/v1 在自己的讀取執行緒上執行 — 可依 npub、nevent 或 naddr 查詢事件，支援計數、統計與搜尋。'],
				['lock', 'NIP-86 管理', 'JSON-RPC 管理 API，支援 Bearer 或 NIP-98 認證、委派方法授權與邀請碼。']
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">strfry 的優勢</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry 仍是極佳的選擇：它開創了 negentropy 協定，支援零停機重啟與選用的 WebSocket 壓縮，
			其寫入原則外掛介面讓你能在每次發布時執行任意邏輯。如果你需要外掛沙箱，而不需要這份清單上的其他功能，
			strfry 非常合適。如果你更希望在開箱即用的方案裡擁有群組、媒體、REST 與管理 — 或者需要寬鬆授權 —
			nostrfy 是更短的路。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">從 strfry 遷移</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			你不必從頭開始。<code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> 讀取 strfry 自己的匯出格式，驗證每一個事件，並匯入整個資料庫 — 包括 NIP-09 刪除、NIP-29 管理副作用與
			首次出現時間戳。它是離線的、支援 dry-run，且可安全重複。
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				閱讀遷移指南 <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				快速開始 <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				完整 NIP 參考
			</a>
		</div>
	</div>
</div>
