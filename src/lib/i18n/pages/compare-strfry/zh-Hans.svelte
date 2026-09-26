<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: '语言', nostrfy: 'Rust', strfry: 'C++' },
		{ label: '许可', nostrfy: 'MIT or Apache-2.0', strfry: 'GPL-3.0' },
		{ label: '存储', nostrfy: 'LMDB（无需外部数据库）', strfry: 'LMDB（无需外部数据库）' },
		{ label: '配置', nostrfy: '单个 nostrfy.toml，热重载（SIGHUP）', strfry: 'strfry.conf，热重载' },
		{ label: '公布的 NIP', nostrfy: '34 个（实现 36 个，含可选）', strfry: '11 个核心 NIP' },
		{ label: 'NIP-29 群组 + LiveKit', nostrfy: '内置', strfry: '—' },
		{ label: 'Blossom 媒体服务器', nostrfy: '内置（本地磁盘或 S3/R2）', strfry: '—' },
		{ label: 'REST API', nostrfy: '内置 /api/v1', strfry: '—' },
		{ label: '管理 API', nostrfy: 'NIP-86 JSON-RPC，可委派管理员', strfry: '—' },
		{ label: 'Negentropy（NIP-77）', nostrfy: '支持', strfry: '支持 — strfry 是它的发源地' },
		{ label: '写入策略 / 插件', nostrfy: '内置白名单/黑名单 + NIP-86', strfry: '写入策略插件接口' },
		{ label: '迁移工具', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/zh-Hans/compare/strfry/`,
		description:
			'对 nostrfy 与 strfry 的诚实对比，面向自建 Nostr 中继 — 功能、许可、运维，以及如何用一条命令从 strfry 迁移。',
		inLanguage: 'zh-Hans',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry：Nostr 中继对比"
	description="对 nostrfy 与 strfry 的诚实对比，面向自建 Nostr 中继 — 功能、许可、运维，以及如何用一条命令从 strfry 迁移。"
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">对比</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			两者都是单二进制的 Nostr 中继，将事件存储在 LMDB 中并使用相同的协议。它们做出了不同的权衡：
			<strong class="text-zinc-200">strfry</strong> 是成熟的 C++ 中继，拥有写入策略插件系统；而
			<strong class="text-zinc-200">nostrfy</strong> 是用 Rust 编写的引擎，将运营者所需的功能 —
			群组、媒体、REST、管理 — 打包在一个二进制文件和一个配置文件中。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">一览</h2>
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">许可</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry 采用 <strong class="text-zinc-200">GPL-3.0</strong> 许可，要求衍生作品以相同条款发布。
			nostrfy 采用 <strong class="text-zinc-200">MIT 或 Apache-2.0</strong> 双许可，因此可以嵌入闭源产品并自由重新许可。
			如果你的中继是商业或其他许可栈的一部分，这往往就是决定性差异。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">配置与运维</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy 由单个带完整注释的 <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					> 配置：身份、限制、存储、访问控制、Blossom 和 RPC 集中在一处。大部分设置在 SIGHUP 时热重载。
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					每个选项都会在中继启动前由 <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> 验证 — 错误的类型、不可能的限制和锁定组合都会连同修复建议一起报告。
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					守护进程自带日志轮转、实时统计、健康端点和 Prometheus 指标；CLI 管理访问列表、升级和迁移。
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">内置功能</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			nostrfy 无需外挂附属服务，而是内置了公共中继通常需要的服务：
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'NIP-29 群组 + LiveKit', '中继强制的群组、管理事件和中继签名的群组元数据，外加通过 LiveKit 的音视频房间。'],
				['database', 'Blossom 媒体服务器', '内容寻址的上传运行在独立主机名上，支持本地磁盘或 S3 兼容存储桶（AWS S3、Cloudflare R2）。'],
				['server', 'REST API', '只读 /api/v1 运行在自己的读取线程上 — 可按 npub、nevent 或 naddr 查询事件，支持计数、统计和搜索。'],
				['lock', 'NIP-86 管理', 'JSON-RPC 管理 API，支持 Bearer 或 NIP-98 认证、委派方法授权和邀请码。']
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">strfry 的优势</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry 仍然是极佳的选择：它开创了 negentropy 协议，支持零停机重启和可选的 WebSocket 压缩，
			其写入策略插件接口让你能在每次发布时运行任意逻辑。如果你需要插件沙箱，而不需要这份清单上的其他功能，
			strfry 非常合适。如果你更希望在开箱即用的方案里拥有群组、媒体、REST 和管理 — 或者需要宽松许可 —
			nostrfy 是更短的路。
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">从 strfry 迁移</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			你不必从头开始。<code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> 读取 strfry 自己的导出格式，验证每一个事件，并导入整个数据库 — 包括 NIP-09 删除、NIP-29 管理副作用和
			首次出现时间戳。它是离线的、支持 dry-run，且可安全重复。
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				阅读迁移指南 <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				快速入门 <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				完整 NIP 参考
			</a>
		</div>
	</div>
</div>
