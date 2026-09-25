<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);

	const faqs = [
		{
			q: '什麼是 nostrfy？',
			a: 'nostrfy 是以 Rust 撰寫的一體化 Nostr 中繼伺服器引擎。它儲存來自 Nostr 用戶端的事件，並依訂閱提供出去，實作了所有中繼端 NIP，外加選用的 Blossom 媒體伺服器、唯讀 REST API 與 NIP-86 管理 API — 全部在一個二進位檔裡。'
		},
		{
			q: 'nostrfy 免費且開源嗎？',
			a: '是的。nostrfy 是自由軟體，採用 MIT 或 Apache-2.0 雙授權，任選其一。原始碼在 GitHub 上，沒有付費層級、遙測或鎖定。'
		},
		{
			q: '執行 nostrfy 需要什麼？',
			a: '單一靜態二進位檔即可執行於 Linux（x86_64 與 aarch64）與 FreeBSD（x86_64）。已在 0.25 vCPU / 512 MB 的 VPS 上驗證。儲存使用本機 LMDB 資料庫 — 無需外部資料庫伺服器。'
		},
		{
			q: '如何安裝 nostrfy？',
			a: '一行指令：curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh。腳本會偵測你的作業系統與架構，下載相符的預編譯二進位檔，驗證校驗和並將其放入 PATH。你也可以用 Cargo 從原始碼建置，或複製現成的設定範本。'
		},
		{
			q: 'nostrfy 如何設定？',
			a: '一切都集中在一個帶完整註解的 nostrfy.toml 檔案中 — 中繼身分、限制、儲存、存取控制、Blossom 與 RPC。nostrfy check 會在啟動前驗證它，大部分設定在執行階段透過 SIGHUP 重載，無需重新啟動。'
		},
		{
			q: 'nostrfy 支援哪些 NIP？',
			a: 'nostrfy 實作了 36 個 NIP，包括 NIP-01、NIP-09 刪除、NIP-29 群組、NIP-42 認證、NIP-50 搜尋、NIP-57 Zap、NIP-59 禮物包裝、NIP-65 中繼清單、NIP-77 negentropy、NIP-86 管理與 NIP-98 HTTP 認證。NIP-11 的 supported_nips 清單是動態的：當某個 NIP 需要的類型被封鎖或停用時，它會消失。'
		},
		{
			q: 'nostrfy 託管媒體檔案嗎？',
			a: '是的。內建的 Blossom 檔案伺服器在獨立主機名稱上託管內容定址的上傳，可儲存在本機磁碟或 AWS S3、Cloudflare R2 等 S3 相容儲存桶。上傳透過簽章的 kind-24242 事件授權，並可限制為允許清單。'
		},
		{
			q: '可以從 strfry 遷移嗎？',
			a: '可以。nostrfy migrate-strfry 可直接匯入 strfry 資料庫或 JSONL 匯出，套用可替換/可定址語意、NIP-09 刪除與 NIP-29 管理副作用，並可選擇將等效的 strfry 設定合併到 nostrfy.toml。遷移是離線的、支援 dry-run，且可安全重複執行。'
		},
		{
			q: 'nostrfy 能執行在反向代理或 Cloudflare 後面嗎？',
			a: '可以。用你的代理位址設定 server.trusted_proxies（同一主機上的 nginx 或 Caddy 用回環位址，雲端用負載平衡器網段），讓按 IP 的限制、blockip 與日誌能看到真實用戶端位址。TLS 由你的代理或通道終止；nostrfy 在其後提供一般 HTTP 與 WebSocket。'
		},
		{
			q: 'nostrfy 有 REST API 嗎？',
			a: '有 — 唯讀 /api/v1 與 WebSocket 中繼共用同一連接埠，執行於獨立的讀取執行緒上，因此 REST 流量永遠不會阻塞訂閱者。它可以依 npub、nevent 或 naddr 查詢事件，並提供計數、作者統計、按日/月分解與全文搜尋。'
		},
		{
			q: 'nostrfy 如何在負載或濫用下保持上線？',
			a: '過載保護、專用讀取執行緒、panic 隔離與嚴格的資源上限。有界佇列快速失敗，而不是耗盡記憶體；按 IP 的連線上限阻止 socket 洪水；磁碟停滯也不會阻塞讀取。子系統被隔離時，中繼仍持續服務。'
		},
		{
			q: '如何管理使用者、封鎖與角色？',
			a: '透過 NIP-86 JSON-RPC 管理 API，使用 Bearer token 或 NIP-98 管理員金鑰：封鎖公鑰、封鎖 IP、管理類型允許清單、角色與邀請碼。方法授權讓你可以把審核工作委派給其他公鑰，而無需給予完整管理員權限。'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'zh-Hant',
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
	title="常見問題"
	description="關於 nostrfy 的解答：安裝、設定、NIP 支援、Blossom 媒體、從 strfry 遷移、反向代理、授權與管理。"
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">常見問題</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			關於執行 nostrfy 的簡短解答。以下內容都連結到
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">文件</a> — 如果願意，你也可以
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">將其與 strfry 比較</a>。
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
				安裝 nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> 檢視原始碼
			</a>
		</div>
	</div>
</div>
