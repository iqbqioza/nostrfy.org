<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { docsNav } from '$lib/data/docs-nav';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

	const p = (path: string) => localePath('zh-Hant', path);
	const t = ui['zh-Hant'];

	const icons: Record<string, string> = {
		'Getting started': 'rocket',
		Operations: 'wrench',
		Features: 'layers',
		Deployment: 'server',
		Help: 'activity'
	};
</script>

<PageMeta
	title="nostrfy 文件與手冊"
	description="完整的 nostrfy 手冊：安裝、設定、NIP 支援、REST API、部署指南與疑難排解，適用於一體化 Nostr 中繼引擎。"
/>

<div class="mx-auto max-w-3xl pb-20 pt-12">
	<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">文件</h1>
	<p class="mt-3 max-w-2xl text-base text-zinc-400">
		安裝、設定、執行與擴充 nostrfy 中繼所需的一切 — 包含完整的功能參考與針對中繼實際行為維護的疑難排解指南。
	</p>

	<div class="mt-12">
		<div class="flex flex-wrap gap-2">
			{#each docsNav as group (group.label)}
				<a
					href={p(group.items[0].href)}
					class="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/50 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
				>
					<Icon name={icons[group.label]} size={13} class="text-accent-400" />
					{t.navGroups[group.label] ?? group.label}
				</a>
			{/each}
		</div>
	</div>

	<div class="mt-8 space-y-8">
		{#each docsNav as group (group.label)}
			<section>
				<h2 class="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-100">
					<Icon name={icons[group.label]} size={18} class="text-accent-400" />
					{t.navGroups[group.label] ?? group.label}
				</h2>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each group.items as item (item.href)}
						<a
							href={p(item.href)}
							class="group rounded-xl border border-line bg-surface/40 p-5 transition-colors hover:border-line-2 hover:bg-surface/70"
						>
							<span class="flex items-center justify-between">
								<span class="text-sm font-semibold text-zinc-100 group-hover:text-white">
									{t.navItems[item.href] ?? item.title}
								</span>
								<Icon name="arrow-right" size={15} class="shrink-0 text-zinc-600 group-hover:text-accent-400" />
							</span>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</div>

	<div class="mt-12 rounded-xl border border-line bg-surface/40 p-5 text-sm text-zinc-400">
		需要協助？在
		<a href={site.github} target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">
			GitHub</a
		>
		上提交 issue，附上重現步驟與日誌 — 文件針對中繼的實際行為維護，歡迎提交修正。
	</div>
</div>
