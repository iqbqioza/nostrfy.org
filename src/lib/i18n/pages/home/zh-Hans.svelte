<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const installLabels: Record<string, string> = {
		'Specific version': '指定版本',
		'System-wide': '系统全局安装',
		'Overwrite existing': '覆盖现有安装',
		'Build from source': '从源码构建'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: '开源 Nostr 社交客户端',
			quote:
				'Ditto 真正使用了这些 NIP — NIP-50 搜索、NIP-22 线程评论、NIP-57 Zap、NIP-94 媒体和 NIP-85 统计都是它的日常体验 — 每一个都对应 nostrfy 的中继功能。'
		},
		Nostrich: {
			tagline: '适用于 Web、iOS、Android 和 Mac 的免费 Nostr 客户端',
			quote:
				'一个功能完整的客户端，真正使用了这些 NIP — NIP-50 搜索、NIP-17/59 私信、NIP-57 Zap、NIP-88 投票和 Blossom 媒体都能在你的中继上运行。'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: '完整实现规范',
			body: '所有中继侧 NIP 均已实现并对照官方规范验证 — 36+ 个 NIP 以及 Blossom 文件服务器。'
		},
		{
			icon: 'shield',
			title: '永不下线',
			body: '过载保护、专用读取线程、panic 隔离和严格的资源上限，让中继在持续滥用下仍能稳定服务。'
		},
		{
			icon: 'server',
			title: 'Blossom 媒体服务器',
			body: '以 SHA-256 寻址的上传运行在独立主机名上 — 本地磁盘或 S3 兼容存储桶（AWS S3、Cloudflare R2），支持上传者签名删除。'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: '只读 /api/v1，可按 npub1、nevent1 或 naddr1 查询事件 — 独立的读取线程意味着 REST 流量永远不会阻塞 WebSocket 订阅者。'
		},
		{
			icon: 'database',
			title: 'LMDB 持久化',
			body: '通过 heed 实现耐用、崩溃安全的存储。内存映射按上限以稀疏方式预留 — 运行时无需扩容，物理占用极小。'
		},
		{
			icon: 'wrench',
			title: '一切皆可配置',
			body: '所有设置都在 nostrfy.toml — 没有编译期选项。编辑、SIGHUP、完成。限制、NIP 开关、存储等等。'
		},
		{
			icon: 'network',
			title: '适配 TLS 反向代理',
			body: 'nginx、Caddy、Cloudflare Tunnel — 支持 WebSocket 升级和 X-Forwarded-Proto，wss:// 在任何代理前都能正常工作。'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: '单一静态 Rust 二进制文件，支持 Linux x86_64、Linux aarch64 和 FreeBSD x86_64 — 已验证可在 0.25 vCPU / 512 MB 的 VPS 上运行。'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: '事件/秒 写入', note: '单连接' },
		{ value: '100%', label: '实时扇出', note: '10,000 / 10,000 次投递' },
		{ value: '0.32s', label: '存储查询', note: '20,000 事件' },
		{ value: '0.26s', label: 'NIP-50 搜索', note: '10,000 结果' },
		{ value: '7.9 MB', label: '私有 RSS', note: '数据库 252 MB' }
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
			'用 Rust 编写的一体化 Nostr 中继服务器引擎。完整实现规范，永不下线，完全通过 nostrfy.toml 配置。',
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
		installUrl: 'https://nostrfy.org/zh-Hans/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'zh-Hans'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="永不下线的 Nostr 中继"
	description="nostrfy 是用 Rust 编写的一体化 Nostr 中继服务器引擎。完整实现规范，永不下线，完全通过 nostrfy.toml 配置。"
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
			永不下线的
			<span class="text-accent-gradient">Nostr 中继。</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> 是一体化 Nostr 中继服务器引擎。为极致速度而设计，天生轻量，默认强大。
			一行命令安装，使用单个 TOML 文件配置，几乎可在任何 VPS 上运行。
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				安装 nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				快速入门
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				查看源码
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> 36+ 个中继侧 NIP
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · 容器
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> 单一二进制，无依赖
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
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">在线中继</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="复制中继地址" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">一行命令安装</h2>
			<p class="mt-3 text-zinc-400">
				安装脚本会检测你的操作系统和架构，下载匹配的预编译二进制文件，验证 sha256 校验和并将其放入你的
				<code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>。
				无需克隆、无需编译、无需 sudo。
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', '无需 sudo', '安装到 ~/.local/bin、~/bin 或 ~/.cargo/bin — PATH 中第一个已存在的目录。'],
				['cpu', 'Linux + FreeBSD', '提供 x86_64 与 aarch64 Linux 预编译二进制，以及 FreeBSD x86_64。'],
				['wrench', '校验和验证', '在二进制写入磁盘之前，获取并验证发布校验和。']
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
					<h3 class="text-sm font-semibold text-zinc-100">从 strfry 迁移？</h3>
					<p class="mt-1 text-sm text-zinc-500">
						用一条命令导入你现有的事件 — 离线、经过验证、可安全重复运行。
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				迁移指南 <Icon name="arrow-right" size={15} />
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
					一分钟内跑起来
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy 自带守护进程、配置校验器、实时统计、日志轮转和热重载 — 中继运营所需的一切，都在一个二进制文件里。
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init 写入一份带完整注释的默认 nostrfy.toml',
						'nostrfy check 在启动前校验配置',
						'SIGHUP 无需重启即可重载大部分设置',
						'nostrfy upgrade 将二进制更新到最新版本'
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
					打开快速入门指南
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# 写入默认 nostrfy.toml 并退出'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# 以守护进程方式运行中继'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# 实时连接数、事件数、数据库大小'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="把任意 Nostr 客户端指向 ws://<host>:8080 — 完成。"
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">为真实环境的中继而构建</h2>
			<p class="mt-3 text-zinc-400">
				每个功能都围绕两个目标设计：永不下线，完整实现规范。结果就是一个能抵御滥用、磁盘停滞和内存受限主机的中继。
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
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">实测性能</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Release 构建、全新数据库、8 线程笔记本。写入速度受单个 LMDB 写入线程和批量、无 fsync 提交的约束；读取线程永远不会阻塞它。
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
			使用随附的基准测试复现 — 参见
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">性能说明</a>。
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">完整实现 NIP 支持</h2>
				<p class="mt-3 text-zinc-400">
					所有中继侧 NIP 均已实现并验证。NIP-11 中公布的列表是动态的 — 当某个 NIP 的类型被屏蔽时会自动移除。
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				完整 NIP 参考 <Icon name="arrow-right" size={15} />
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
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">优秀客户端生态</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy 使用客户端所依赖的开放 NIP 标准 — 最好的 Nostr 应用可以即插即用，获得完整体验。任何符合 NIP 的客户端都能与你的中继配合。
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
			在 Nostr 上开发？把任意客户端指向你的中继 — 参见
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">完整 NIP 参考</a>。
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
			几分钟内运行你自己的中继
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			从最小的 VPS 到全球集群 — 预编译二进制、配置校验器和部署指南让这一切毫无痛苦。
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> 立即安装
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				部署指南 <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> 支持开发
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			有疑问？阅读 <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">常见问题</a>，或了解 nostrfy
			与 <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">strfry 的对比</a> —
			并<a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">用一条命令迁移</a>。
		</p>
	</div>
</section>
