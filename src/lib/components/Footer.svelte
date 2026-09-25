<script lang="ts">
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import { site } from '$lib/data/site';

	const cols = [
		{
			heading: 'Documentation',
			links: [
				{ label: 'Introduction', href: '/docs/introduction/' },
				{ label: 'Installation', href: '/docs/installation/' },
				{ label: 'Configuration', href: '/docs/configuration/' },
				{ label: 'Deployment', href: '/docs/deploy/' },
				{ label: 'Troubleshooting', href: '/docs/troubleshooting/' }
			]
		},
		{
			heading: 'Project',
			links: [
				{ label: 'About', href: '/about/' },
				{ label: 'FAQ', href: '/faq/' },
				{ label: 'nostrfy vs strfry', href: '/compare/strfry/' },
				{ label: 'Donate', href: '/donate/' },
				{ label: 'GitHub', href: site.github },
				{ label: 'Releases', href: `${site.github}/releases` },
				{ label: 'Security policy', href: `${site.github}/security/policy` }
			]
		}
	];
</script>

<footer class="border-t border-line/70">
	<div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
		<div class="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
			<div>
				<Logo size={30} />
				<p class="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
					An all-in-one Nostr relay server engine written in Rust. Open source, dual-licensed
					under MIT or Apache-2.0.
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
				<nav aria-label={col.heading}>
					<h3 class="text-xs font-semibold uppercase tracking-wider text-zinc-500">{col.heading}</h3>
					<ul class="mt-4 space-y-2.5">
						{#each col.links as link (link.href)}
							<li>
								<a
									href={link.href}
									{...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
									class="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div class="mt-12 flex flex-col gap-3 border-t border-line/70 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
			<p>
				&copy; {new Date().getFullYear()} iqbqioza · Released under the
				<a href="/LICENSE" class="text-zinc-500 hover:text-zinc-300">MIT or Apache-2.0 license</a>
			</p>
			<a href={site.github} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-zinc-300">
				<Icon name="github" size={13} />
				Source on GitHub
			</a>
		</div>
	</div>
</footer>