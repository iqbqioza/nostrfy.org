<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: '永不下线',
			body: '过载保护、专用读取线程、panic 隔离和严格的资源上限。中继只有在运行时才有意义。'
		},
		{
			icon: 'layers',
			title: '完整实现规范',
			body: '所有中继侧 NIP 均已实现并对照官方规范验证 — 包括搜索、群组、媒体和管理 API。'
		},
		{
			icon: 'box',
			title: '单一二进制',
			body: '一个静态 Rust 二进制文件完成一切：中继、REST API、Blossom 文件服务器、NIP-86 管理、守护进程、日志轮转和统计。'
		},
		{
			icon: 'cpu',
			title: '天生轻量',
			body: '0.25 vCPU / 512 MB 的 VPS 即可轻松运行。LMDB 映射是稀疏虚拟预留；随着数据库增长，内存保持平稳。'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: '关于 nostrfy',
		url: `${base}/zh-Hans/about/`,
		description:
			'nostrfy 是用 Rust 编写的开源 Nostr 中继服务器引擎，采用 MIT 或 Apache-2.0 双许可。了解这个项目及其设计理念。',
		inLanguage: 'zh-Hans',
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
	title="关于 nostrfy 项目"
	description="nostrfy 是用 Rust 编写的开源 Nostr 中继服务器引擎，采用 MIT 或 Apache-2.0 双许可。了解这个项目及其设计理念。"
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">关于 nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">一体化 Nostr 中继服务器引擎</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> 是
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				协议的中继服务器，用 Rust 编写。它存储客户端（Amethyst、Damus、Iris 等）发送的事件，并响应订阅将其投递 —
				所需资源仅为典型中继的一小部分。
			</p>
			<p>
				项目始于一个实验：如果中继可以<strong class="text-zinc-200">只用一份配置文件定义</strong>，运行在你能租到的最小
				服务器上，同时实现所有中继侧 NIP — 外加文件服务器、REST API 和管理界面，会怎样？nostrfy 就是答案，
				而且它免费：基于 MIT 或 Apache-2.0 许可发布。
			</p>
			<p>
				nostrfy 运行着项目的官方中继，同一个二进制文件已在 Linux（x86_64 和 aarch64）和 FreeBSD 上验证，
				从 512 MB VPS 到服务数十万连接的单个主机。
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
				<Icon name="github" size={16} /> 在 GitHub 上查看源码
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
