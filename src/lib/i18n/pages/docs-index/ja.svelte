<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { docsNav } from '$lib/data/docs-nav';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

	const p = (path: string) => localePath('ja', path);
	const t = ui['ja'];

	const icons: Record<string, string> = {
		'Getting started': 'rocket',
		Operations: 'wrench',
		Features: 'layers',
		Deployment: 'server',
		Help: 'activity'
	};
</script>

<PageMeta
	title="nostrfy ドキュメントとマニュアル"
	description="完全な nostrfy マニュアル:インストール、設定、NIP 対応、REST API、デプロイガイド、トラブルシューティングをオールインワンの Nostr リレーエンジン向けに解説。"
/>

<div class="mx-auto max-w-3xl pb-20 pt-12">
	<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">ドキュメント</h1>
	<p class="mt-3 max-w-2xl text-base text-zinc-400">
		nostrfy リレーのインストール、設定、運用、拡張に必要なすべて — 完全な機能リファレンスと、リレーの実際の挙動に合わせて維持されたトラブルシューティング付き。
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
		お困りですか？
		<a href={site.github} target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">
			GitHub</a
		>
		 で issue を作成し、再現手順とログを添えてください — ドキュメントはリレーの実際の挙動に合わせて維持されており、修正を歓迎します。
	</div>
</div>
