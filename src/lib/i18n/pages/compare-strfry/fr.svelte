<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Langage', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'Licence', nostrfy: 'MIT ou Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Stockage', nostrfy: 'LMDB (aucune base externe)', strfry: 'LMDB (aucune base externe)' },
		{ label: 'Configuration', nostrfy: 'Un seul nostrfy.toml, rechargement à chaud (SIGHUP)', strfry: 'strfry.conf, rechargement à chaud' },
		{ label: 'NIP annoncés', nostrfy: '34 (36 implémentés, dont optionnels)', strfry: '11 NIP principaux' },
		{ label: 'Groupes NIP-29 + LiveKit', nostrfy: 'Intégré', strfry: '—' },
		{ label: 'Serveur multimédia Blossom', nostrfy: 'Intégré (disque local ou S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: '/api/v1 intégré', strfry: '—' },
		{ label: 'API de gestion', nostrfy: 'NIP-86 JSON-RPC avec administrateurs délégués', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Oui', strfry: 'Oui — strfry en est l’origine' },
		{ label: 'Politiques d’écriture / plugins', nostrfy: 'Listes allow/deny intégrées + NIP-86', strfry: 'Interface de plugins write-policy' },
		{ label: 'Outil de migration', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/fr/compare/strfry/`,
		description:
			'Une comparaison honnête de nostrfy et strfry pour les relais Nostr auto-hébergés — fonctionnalités, licences, exploitation et migration depuis strfry en une commande.',
		inLanguage: 'fr',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry : comparaison de relais Nostr"
	description="Une comparaison honnête de nostrfy et strfry pour les relais Nostr auto-hébergés — fonctionnalités, licences, exploitation et migration depuis strfry en une commande."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Comparaison</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Les deux sont des relais Nostr en un binaire, stockent les événements dans LMDB et parlent le même protocole. Mais ils font des compromis différents :
			<strong class="text-zinc-200">strfry</strong> est le relais C++ mature doté d’un système de plugins write-policy, tandis que
			<strong class="text-zinc-200">nostrfy</strong> est un moteur écrit en Rust qui regroupe les fonctions dont l’opérateur a besoin — groupes, médias, REST, gestion — dans un binaire et un fichier de configuration.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">En un coup d’œil</h2>
		<div class="mt-5 overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>nostrfy</th>
						<th>strfry</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.label)}
						<tr>
							<td class="text-zinc-500">{row.label}</td>
							<td class="text-zinc-200">{row.nostrfy}</td>
							<td class="text-zinc-400">{row.strfry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Licence</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry est sous <strong class="text-zinc-200">GPL-3.0</strong>, qui impose que les œuvres dérivées soient publiées selon les mêmes termes. nostrfy est sous double licence <strong class="text-zinc-200">MIT ou Apache-2.0</strong>, donc il peut être intégré à des produits propriétaires et relicencié librement. Si votre relais fait partie d’une pile commerciale ou sous licence, c’est souvent la différence décisive.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Configuration et exploitation</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy se configure via un seul <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					> : identité, limites, stockage, contrôle d’accès, Blossom et RPC au même endroit. La plupart des réglages se rechargent à chaud via SIGHUP.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Chaque option est validée avant le démarrage du relais par <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> — types erronés, limites impossibles et combinaisons verrouillantes sont signalés avec des correctifs.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Le démon inclut la rotation des journaux, des statistiques en direct, un contrôle de santé et des métriques Prometheus ; la CLI gère les listes d’accès, les mises à jour et les migrations.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Fonctionnalités intégrées</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Plutôt que d’ajouter des services annexes, nostrfy intègre ce dont un relais public a habituellement besoin :
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'Groupes NIP-29 + LiveKit', 'Groupes imposés par le relais, événements de modération et métadonnées de groupe signées par le relais, plus des salles audio/vidéo via LiveKit.'],
				['database', 'Serveur multimédia Blossom', 'Les téléversements adressés par contenu tournent sur leur propre nom d’hôte, sur disque local ou dans un bucket compatible S3 (AWS S3, Cloudflare R2).'],
				['server', 'REST API', 'API /api/v1 en lecture seule dans son propre thread de lecture : interrogez les événements par npub, nevent ou naddr, avec compteurs, statistiques et recherche.'],
				['lock', 'Gestion NIP-86', 'API de gestion JSON-RPC avec authentification Bearer ou NIP-98, attributions de méthodes déléguées et codes d’invitation.']
			] as [icon, title, body] (title)}
				<div class="rounded-xl border border-line bg-surface/50 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
				</div>
			{/each}
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Les atouts de strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry reste un excellent choix : il a créé le protocole negentropy, prend en charge les redémarrages sans interruption et la compression WebSocket optionnelle, et son interface de plugins write-policy permet d’exécuter une logique arbitraire à chaque publication. Si vous avez besoin d’un bac à sable de plugins et de rien d’autre dans cette liste, strfry est parfait. Si vous préférez des groupes, des médias, une API REST et une gestion intégrés — ou une licence permissive — nostrfy est le chemin le plus court.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Migration depuis strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Vous n’avez pas à repartir de zéro. <code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> lit le propre format d’export de strfry, vérifie chaque événement et importe toute la base — y compris les suppressions NIP-09, les effets de bord de modération NIP-29 et les horodatages de première apparition. C’est hors ligne, testable à blanc et sûr à relancer.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Lire le guide de migration <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Démarrage rapide <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Référence complète des NIP
			</a>
		</div>
	</div>
</div>
