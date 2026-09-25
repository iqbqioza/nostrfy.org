<script lang="ts">
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import { site } from '$lib/data/site';
	import { page } from '$app/stores';
	import { localePath, localeForPathname, type Locale } from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
	const t = $derived(ui[locale]);

	const cols = [
		{
			heading: 'documentation' as const,
			links: [
				{ key: '/docs/introduction/', href: '/docs/introduction/' },
				{ key: '/docs/installation/', href: '/docs/installation/' },
				{ key: '/docs/configuration/', href: '/docs/configuration/' },
				{ key: '/docs/deploy/', href: '/docs/deploy/' },
				{ key: '/docs/troubleshooting/', href: '/docs/troubleshooting/' }
			]
		},
		{
			heading: 'project' as const,
			links: [
				{ key: '/about/', href: '/about/' },
				{ key: '/faq/', href: '/faq/' },
				{ key: '/compare/strfry/', href: '/compare/strfry/' },
				{ key: '/donate/', href: '/donate/' },
				{ key: 'github', href: site.github },
				{ key: 'releases', href: `${site.github}/releases` },
				{ key: 'security', href: `${site.github}/security/policy` }
			]
		}
	];

	const year = new Date().getFullYear();
</script>

<footer class="border-t border-line/70">
	<div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
		<div class="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
			<div>
				<Logo size={30} label={t.logoAria} />
				<p class="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
					{t.footer.tagline}
				</p>
				<div class="mt-5 flex flex-col gap-2">
					{#each site.relays as relay (relay.url)}
						<a
							href={relay.url}
							class="inline-flex w-fit items-center gap-2 rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs text-zinc-400 transition-colors hover:border-line-2 hover:text-zinc-200"
						>
							<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
							{relay.url}
						</a>
					{/each}
				</div>
			</div>

			{#each cols as col (col.heading)}
				<nav aria-label={t.footer[col.heading]}>
					<h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">
						{t.footer[col.heading]}
					</h3>
					<ul class="mt-4 space-y-2.5">
						{#each col.links as link (link.key)}
							{@const external = link.href.startsWith('http')}
							<li>
								<a
									href={external ? link.href : localePath(locale, link.href)}
									{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
									class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
								>
									{t.footer.labels[link.key]}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div class="mt-12 flex flex-col gap-3 border-t border-line/70 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
			<p>
				{t.footer.copyrightPrefix(year)}<a href="/LICENSE" class="text-zinc-500 hover:text-zinc-300"
					>{t.footer.licenseLabel}</a
				>
			</p>
			<a href={site.github} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-zinc-300">
				<Icon name="github" size={13} />
				{t.footer.source}
			</a>
		</div>
	</div>
</footer>
