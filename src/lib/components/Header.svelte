<script lang="ts">
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import { site } from '$lib/data/site';
	import { page } from '$app/stores';
	import {
		locales,
		localeNames,
		localeShort,
		localePath,
		localeForPathname,
		type Locale
	} from '$lib/i18n/locale';
	import { ui } from '$lib/i18n/ui';

	const locale = $derived<Locale>($page.data.locale ?? localeForPathname($page.url.pathname));
	const t = $derived(ui[locale]);

	const links = $derived([
		{ href: localePath(locale, '/docs/'), label: t.header.docs },
		{ href: localePath(locale, '/about/'), label: t.header.about },
		{ href: localePath(locale, '/donate/'), label: t.header.donate }
	]);

	let open = $state(false);
	let langDetails = $state<HTMLDetailsElement | null>(null);

	function isActive(href: string) {
		return $page.url.pathname.startsWith(href) || $page.url.pathname === href;
	}

	function remember(target: Locale) {
		open = false;
		if (langDetails) langDetails.open = false;
		try {
			localStorage.setItem('nostrfy-lang', target);
		} catch {
			/* storage unavailable */
		}
	}
</script>

<header class="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
		<Logo label={t.logoAria} />

		<nav class="hidden items-center gap-1 md:flex" aria-label={t.header.mainNav}>
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="rounded-lg px-3.5 py-2 text-sm font-medium transition-colors {isActive(link.href)
						? 'text-zinc-50'
						: 'text-zinc-400 hover:text-zinc-100'}"
				>
					{link.label}
				</a>
			{/each}
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="ml-2 inline-flex items-center gap-2 rounded-lg border border-line bg-surface/60 px-3.5 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} class="text-zinc-400" />
				{t.header.github}
			</a>

			<details bind:this={langDetails} class="group relative ml-1">
				<summary
					class="flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-line bg-surface/60 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-line-2 hover:text-white [&::-webkit-details-marker]:hidden"
					aria-label={t.header.language}
				>
					<Icon name="globe" size={16} class="text-zinc-400" />
					{localeShort[locale]}
					<Icon name="chevron-down" size={13} class="transition-transform group-open:rotate-180" />
				</summary>
				<div
					class="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-line bg-bg/95 py-1 shadow-xl backdrop-blur-xl"
				>
					{#each locales as target (target)}
						<a
							href={localePath(target, $page.url.pathname)}
							onclick={() => remember(target)}
							class="flex items-center justify-between px-3.5 py-2 text-sm transition-colors {target === locale
								? 'text-accent-300'
								: 'text-zinc-300 hover:bg-surface/70 hover:text-white'}"
						>
							{localeNames[target]}
							{#if target === locale}
								<Icon name="check" size={14} />
							{/if}
						</a>
					{/each}
				</div>
			</details>
		</nav>

		<button
			type="button"
			class="inline-flex items-center justify-center rounded-lg border border-line p-2 text-zinc-300 transition-colors hover:text-white md:hidden"
			aria-label={t.header.toggleMenu}
			aria-expanded={open}
			onclick={() => (open = !open)}
		>
			<Icon name={open ? 'x' : 'menu'} size={20} />
		</button>
	</div>

	{#if open}
		<div class="border-t border-line/70 bg-bg/95 md:hidden">
			<nav class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label={t.header.mobileNav}>
				{#each links as link (link.href)}
					<a
						href={link.href}
						onclick={() => (open = false)}
						class="rounded-lg px-3 py-2.5 text-sm font-medium {isActive(link.href)
							? 'bg-surface text-zinc-50'
							: 'text-zinc-400 hover:text-zinc-100'}"
					>
						{link.label}
					</a>
				{/each}
				<a
					href={site.github}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => (open = false)}
					class="mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-100"
				>
					<Icon name="github" size={16} />
					{t.header.github}
				</a>
				<div class="mt-2 border-t border-line/70 pt-3">
					<div class="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-zinc-600">
						{t.header.language}
					</div>
					<div class="flex flex-wrap gap-1">
						{#each locales as target (target)}
							<a
								href={localePath(target, $page.url.pathname)}
								onclick={() => remember(target)}
								class="rounded-lg px-3 py-2 text-sm font-medium {target === locale
									? 'bg-accent-500/10 text-accent-200'
									: 'text-zinc-400 hover:text-zinc-100'}"
							>
								{localeNames[target]}
							</a>
						{/each}
					</div>
				</div>
			</nav>
		</div>
	{/if}
</header>
