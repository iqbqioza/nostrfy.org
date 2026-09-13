<script lang="ts">
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import { site } from '$lib/data/site';
	import { page } from '$app/stores';

	const links = [
		{ href: '/docs/', label: 'Docs' },
		{ href: '/about/', label: 'About' },
		{ href: '/donate/', label: 'Donate' }
	];

	let open = $state(false);

	function isActive(href: string) {
		return $page.url.pathname.startsWith(href) || $page.url.pathname === href;
	}
</script>

<header class="sticky top-0 z-50 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
		<Logo />

		<nav class="hidden items-center gap-1 md:flex" aria-label="Main">
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
				GitHub
			</a>
		</nav>

		<button
			type="button"
			class="inline-flex items-center justify-center rounded-lg border border-line p-2 text-zinc-300 transition-colors hover:text-white md:hidden"
			aria-label="Toggle menu"
			aria-expanded={open}
			onclick={() => (open = !open)}
		>
			<Icon name={open ? 'x' : 'menu'} size={20} />
		</button>
	</div>

	{#if open}
		<div class="border-t border-line/70 bg-bg/95 md:hidden">
			<nav class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Mobile">
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
					GitHub
				</a>
			</nav>
		</div>
	{/if}
</header>