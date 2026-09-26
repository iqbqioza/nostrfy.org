<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Ne tombe jamais',
			body: 'Protection contre la surcharge, threads de lecture dédiés, isolation des panics et limites de ressources strictes. Un relais ne compte que s’il tourne.'
		},
		{
			icon: 'layers',
			title: 'Entièrement conforme',
			body: 'Tous les NIP côté relais implémentés et vérifiés par rapport aux spécifications officielles — recherche, groupes, médias et API de gestion inclus.'
		},
		{
			icon: 'box',
			title: 'Un seul binaire',
			body: 'Un seul binaire Rust statique fait tout : relais, API REST, serveur de fichiers Blossom, gestion NIP-86, démon, rotation des journaux et statistiques.'
		},
		{
			icon: 'cpu',
			title: 'Léger par nature',
			body: 'Fonctionne confortablement sur un VPS 0,25 vCPU / 512 Mo. La carte LMDB est une réservation virtuelle creuse ; la mémoire reste stable à mesure que la base grandit.'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'À propos de nostrfy',
		url: `${base}/fr/about/`,
		description:
			'nostrfy est un moteur de serveur relais Nostr open source écrit en Rust, sous double licence MIT ou Apache-2.0. Découvrez le projet et ses principes de conception.',
		inLanguage: 'fr',
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
	title="À propos du projet nostrfy"
	description="nostrfy est un moteur de serveur relais Nostr open source écrit en Rust, sous double licence MIT ou Apache-2.0. Découvrez le projet et ses principes de conception."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">À propos de nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">Moteur de serveur relais Nostr tout-en-un</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> est un serveur relais pour le protocole
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>,
				écrit en Rust. Il stocke les événements envoyés par les clients (Amethyst, Damus, Iris et d’autres) et les distribue en réponse aux abonnements — avec une fraction des ressources d’un relais classique.
			</p>
			<p>
				Le projet a commencé comme une expérience : et si un relais pouvait <strong class="text-zinc-200">être défini par un seul fichier de configuration</strong>, sur le plus petit serveur que vous pouvez louer, tout en implémentant chaque NIP côté relais — plus un serveur de fichiers, une API REST et une interface de gestion ? nostrfy est la réponse, et c’est gratuit : sous licence MIT ou Apache-2.0.
			</p>
			<p>
				nostrfy fait tourner le relais officiel du projet, et le même binaire a été vérifié sur Linux (x86_64 et aarch64) et FreeBSD, d’un VPS de 512 Mo à un hôte unique servant des centaines de milliers de connexions.
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
				<Icon name="github" size={16} /> Voir le code source sur GitHub
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
