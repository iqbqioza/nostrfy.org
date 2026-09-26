<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const faqs = [
		{
			q: '什么是 nostrfy？',
			a: 'nostrfy 是用 Rust 编写的一体化 Nostr 中继服务器引擎。它存储来自 Nostr 客户端的事件，并响应订阅将其提供出去，实现了所有中继侧 NIP，外加可选的 Blossom 媒体服务器、只读 REST API 和 NIP-86 管理 API — 全部在一个二进制文件里。'
		},
		{
			q: 'nostrfy 免费且开源吗？',
			a: '是的。nostrfy 是自由软件，采用 MIT 或 Apache-2.0 双许可，任选其一。源代码在 GitHub 上，没有付费层级、遥测或锁定。'
		},
		{
			q: '运行 nostrfy 需要什么？',
			a: '单一静态二进制文件即可运行于 Linux（x86_64 和 aarch64）和 FreeBSD（x86_64）。已在 0.25 vCPU / 512 MB 的 VPS 上验证。存储使用本地 LMDB 数据库 — 无需外部数据库服务器。'
		},
		{
			q: '如何安装 nostrfy？',
			a: '一行命令：curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh。脚本会检测你的操作系统和架构，下载匹配的预编译二进制文件，验证校验和并将其放入 PATH。你也可以用 Cargo 从源码构建，或复制现成的配置模板。'
		},
		{
			q: 'nostrfy 如何配置？',
			a: '一切都集中在一个带完整注释的 nostrfy.toml 文件中 — 中继身份、限制、存储、访问控制、Blossom 和 RPC。nostrfy check 会在启动前校验它，大部分设置在运行时通过 SIGHUP 重载，无需重启。'
		},
		{
			q: 'nostrfy 支持哪些 NIP？',
			a: 'nostrfy 实现了 36 个 NIP，包括 NIP-01、NIP-09 删除、NIP-29 群组、NIP-42 认证、NIP-50 搜索、NIP-57 Zap、NIP-59 礼物包装、NIP-65 中继列表、NIP-77 negentropy、NIP-86 管理和 NIP-98 HTTP 认证。NIP-11 的 supported_nips 列表是动态的：当某个 NIP 需要的类型被屏蔽或禁用时，它会消失。'
		},
		{
			q: 'nostrfy 托管媒体文件吗？',
			a: '是的。内置的 Blossom 文件服务器在独立主机名上托管内容寻址的上传，可存储在本地磁盘或 AWS S3、Cloudflare R2 等 S3 兼容存储桶。上传通过签名的 kind-24242 事件授权，并可限制为白名单。'
		},
		{
			q: '可以从 strfry 迁移吗？',
			a: '可以。nostrfy migrate-strfry 可直接导入 strfry 数据库或 JSONL 导出，应用可替换/可寻址语义、NIP-09 删除和 NIP-29 管理副作用，并可选择将等效的 strfry 设置合并到 nostrfy.toml。迁移是离线的、支持 dry-run，且可安全重复运行。'
		},
		{
			q: 'nostrfy 能运行在反向代理或 Cloudflare 后面吗？',
			a: '可以。用你的代理地址配置 server.trusted_proxies（同主机上的 nginx 或 Caddy 用回环地址，云端用负载均衡器网段），使按 IP 的限制、blockip 和日志能看到真实客户端地址。TLS 由你的代理或隧道终止；nostrfy 在其后提供普通 HTTP 和 WebSocket。'
		},
		{
			q: 'nostrfy 有 REST API 吗？',
			a: '有 — 只读 /api/v1 与 WebSocket 中继共用同一端口，运行在独立的读取线程上，因此 REST 流量永远不会阻塞订阅者。它可以按 npub、nevent 或 naddr 查询事件，并提供计数、作者统计、按日/月分解和全文搜索。'
		},
		{
			q: 'nostrfy 如何在负载或滥用下保持在线？',
			a: '过载保护、专用读取线程、panic 隔离和严格的资源上限。有界队列快速失败，而不是耗尽内存；按 IP 的连接上限阻止 socket 洪泛；磁盘停滞也不会阻塞读取。子系统被隔离时，中继仍持续服务。'
		},
		{
			q: '如何管理用户、封禁和角色？',
			a: '通过 NIP-86 JSON-RPC 管理 API，使用 Bearer token 或 NIP-98 管理员密钥：封禁公钥、屏蔽 IP、管理类型白名单、角色和邀请码。方法授权让你可以把审核工作委托给其他公钥，而无需给予完整管理员权限。'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'zh-Hans',
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
	title="常见问题"
	description="关于 nostrfy 的解答：安装、配置、NIP 支持、Blossom 媒体、从 strfry 迁移、反向代理、许可和管理。"
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">常见问题</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			关于运行 nostrfy 的简短解答。以下内容都链接到
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">文档</a> — 如果愿意，你也可以
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">将其与 strfry 对比</a>。
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
				安装 nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> 查看源码
			</a>
		</div>
	</div>
</div>
