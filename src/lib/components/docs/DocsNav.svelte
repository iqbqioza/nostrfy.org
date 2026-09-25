<script lang="ts">
	import Icon from '../Icon.svelte';
	import { docsNav } from '$lib/data/docs-nav';
	import { page } from '$app/stores';
	import { localePath, localeForPathname, type Locale } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
	const t = $derived(ui[locale]);

	const current = $derived(
		$page.url.pathname.endsWith('/') ? $page.url.pathname : $page.url.pathname + '/'
	);

	function isActive(href: string) {
		return localePath(locale, href) === current;
	}
</script>

<nav class="space-y-6" aria-label={t.docs.documentation}>
	{#each docsNav as group (group.label)}
		<div>
			<h3 class="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
				{t.navGroups[group.label] ?? group.label}
			</h3>
			<ul class="mt-2 space-y-0.5">
				{#each group.items as item (item.href)}
					<li>
						<a
							href={localePath(locale, item.href)}
							class="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[13.5px] transition-colors {isActive(item.href)
								? 'bg-accent-500/10 font-medium text-accent-200'
								: 'text-zinc-400 hover:bg-surface/60 hover:text-zinc-100'}"
						>
							{t.navItems[item.href] ?? item.title}
							{#if isActive(item.href)}
								<Icon name="chevron-right" size={13} class="shrink-0 text-accent-400" />
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>
