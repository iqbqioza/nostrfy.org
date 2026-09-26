<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const d = $derived(site.donate);
	const dev = site.developer;
</script>

<PageMeta
	title="nostrfy unterstützen"
	description="Unterstützen Sie die Entwicklung von nostrfy mit einer On-Chain-Bitcoin-Spende. Freie Open-Source-Software, dual unter MIT oder Apache-2.0 lizenziert."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="text-center">
			<div class="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-surface/60">
				<Icon name="heart" size={22} class="text-accent-400" />
			</div>
			<h1 class="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy unterstützen</h1>
			<p class="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-400">
				nostrfy ist frei, quelloffen (MIT oder Apache-2.0) und ohne Lock-in — und das bleibt so. Es wird von einem Entwickler in der Freizeit gebaut und gepflegt und wird durch Menschen wie Sie stetig besser. Wenn nostrfy Ihnen Zeit, Geld oder Ärger erspart hat, bewirkt eine kleine Spende viel, und wir sind sehr dankbar. Danke!
			</p>
		</div>

		<div class="mt-10 flex items-center justify-center">
			<a
				href={dev.url}
				target="_blank"
				rel="noopener noreferrer"
				class="flex w-full max-w-md items-center gap-4 rounded-2xl border border-line bg-surface/40 p-5 transition-colors hover:border-line-2"
			>
				<img
					src={dev.avatarUrl}
					alt="Avatar von @iqbqioza"
					width={64}
					height={64}
					class="h-16 w-16 shrink-0 rounded-2xl border border-line object-cover"
				/>
				<div class="min-w-0">
					<h2 class="text-base font-semibold text-zinc-100">Entwickelt von @iqbqioza</h2>
					<p class="text-sm text-zinc-500">Maintainer und Lead-Entwickler</p>
					<p class="mt-1 truncate text-sm text-accent-300">{dev.url}</p>
				</div>
			</a>
		</div>

		<div class="mt-10 space-y-4">
			<div class="rounded-2xl border border-line bg-surface/40 p-6">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-400/30 bg-accent-400/10">
						<Icon name="circle-check" size={19} class="text-accent-300" />
					</div>
					<div>
						<h2 class="text-base font-semibold text-zinc-100">Bitcoin (On-Chain)</h2>
						<p class="text-xs text-zinc-500">Eine normale BTC-Transaktion, für jeden nutzbar</p>
					</div>
				</div>
				<div class="mt-4 space-y-3">
					<div class="flex items-center gap-3 rounded-xl border border-line bg-bg p-3.5">
						<code class="min-w-0 flex-1 truncate font-mono text-sm text-zinc-200">{d.bitcoin}</code>
						<CopyButton text={d.bitcoin} label="Bitcoin-Adresse kopieren" showLabel={false} />
					</div>
					<div class="flex items-center gap-3 rounded-xl border border-line bg-bg p-3.5">
						<span class="shrink-0 rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-zinc-500">
							SegWit
						</span>
						<code class="min-w-0 flex-1 truncate font-mono text-sm text-zinc-300">{d.bitcoinSegwit}</code>
						<CopyButton text={d.bitcoinSegwit} label="SegWit-Adresse kopieren" showLabel={false} />
					</div>
				</div>
				<p class="mt-3 text-xs text-zinc-600">
					Beide Adressen gehören zur selben Wallet. Für niedrigere Gebühren empfehlen wir SegWit.
				</p>
			</div>
		</div>

		<div class="mt-10 rounded-xl border border-line bg-surface/40 p-5">
			<h3 class="flex items-center gap-2 text-sm font-semibold text-zinc-100">
				<Icon name="shield" size={15} class="text-accent-400" />
				Wohin das Geld geht
			</h3>
			<ul class="mt-3 space-y-2 text-sm text-zinc-400">
				{#each [
					'Serverkosten für die laufenden Relays (relay.nostrfy.org)',
					'Laufende Entwicklung: NIP-Abdeckung, Performance, Dokumentation und Bereitstellungswerkzeuge',
					'Lizenzen für Open-Source-Infrastruktur und Werkzeuge'
				] as line (line)}
					<li class="flex gap-2.5">
						<Icon name="check" size={15} class="mt-0.5 shrink-0 text-accent-400" />
						{line}
					</li>
				{/each}
			</ul>
		</div>

		<p class="mt-8 text-center text-sm text-zinc-500">
			Lieber Code beitragen?
			<a href={site.github} target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">GitHub</a>
			 Pull Requests und Fehlerberichte sind immer willkommen. Wie auch immer Sie helfen — vielen Dank, das bedeutet wirklich viel.
		</p>
	</div>
</div>
