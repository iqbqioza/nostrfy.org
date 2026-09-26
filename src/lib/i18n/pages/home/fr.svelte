<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'Version précise',
		'System-wide': 'Installer pour tout le système',
		'Overwrite existing': 'Remplacer l’existant',
		'Build from source': 'Compiler depuis les sources'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'Client social Nostr open source',
			quote:
				'Ditto utilise réellement ces NIP — recherche NIP-50, commentaires imbriqués NIP-22, zaps NIP-57, médias NIP-94 et statistiques NIP-85 font partie de son quotidien — et chacun correspond à une fonctionnalité du relais nostrfy.'
		},
		Nostrich: {
			tagline: 'Client Nostr gratuit pour le web, iOS, Android et Mac',
			quote:
				'Un client complet qui utilise réellement ces NIP — recherche NIP-50, messages privés NIP-17/59, zaps NIP-57, sondages NIP-88 et médias Blossom fonctionnent avec votre relais.'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: 'Entièrement conforme',
			body: 'Tous les NIP côté relais implémentés et vérifiés par rapport aux spécifications officielles — plus de 36 NIP et le serveur de fichiers Blossom.'
		},
		{
			icon: 'shield',
			title: 'Ne tombe jamais',
			body: 'Protection contre la surcharge, threads de lecture dédiés, isolation des panics et limites de ressources strictes maintiennent le relais en service sous abus prolongé.'
		},
		{
			icon: 'server',
			title: 'Serveur multimédia Blossom',
			body: 'Téléversements adressés par SHA-256 sur leur propre nom d’hôte — disque local ou buckets compatibles S3 (AWS S3, Cloudflare R2), avec suppression signée par le propriétaire.'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: 'Une API /api/v1 en lecture seule pour interroger les événements par npub1, nevent1 ou naddr1 — son propre thread de lecture empêche le trafic REST de bloquer les abonnés WebSocket.'
		},
		{
			icon: 'database',
			title: 'Persistance LMDB',
			body: 'Stockage durable et résistant aux crashs via heed. La carte mémoire est réservée de façon creuse jusqu’à sa limite — aucun redimensionnement à chaud, empreinte physique minuscule.'
		},
		{
			icon: 'wrench',
			title: 'Tout est configurable',
			body: 'Tous les réglages sont dans nostrfy.toml — aucune option de compilation. Modifiez, envoyez SIGHUP, terminé. Limites, interrupteurs NIP, stockage et plus.'
		},
		{
			icon: 'network',
			title: 'Fonctionne derrière un proxy TLS',
			body: 'nginx, Caddy, Cloudflare Tunnel — les mises à niveau WebSocket et X-Forwarded-Proto sont respectées, wss:// fonctionne derrière n’importe quel proxy.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'Un seul binaire Rust statique pour Linux x86_64, Linux aarch64 et FreeBSD x86_64 — vérifié sur un VPS 0,25 vCPU / 512 Mo.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'événements/s en entrée', note: 'une connexion' },
		{ value: '100%', label: 'Distribution en direct', note: '10 000 / 10 000 livraisons' },
		{ value: '0,32s', label: 'requête stockée', note: '20 000 événements' },
		{ value: '0,26s', label: 'recherche NIP-50', note: '10 000 résultats' },
		{ value: '7,9 Mo', label: 'RSS privé', note: 'avec une base de 252 Mo' }
	];

	const nips = [
		'1', '9', '11', '13', '17', '22', '26', '28', '29', '32', '33', '34', '40', '42', '43',
		'45', '46', '47', '50', '57', '59', '62', '65', '66', '67', '70', '77', '78', '84', '85',
		'86', '87', '88', '94', '98', 'A3', 'Blossom'
	];

	const softwareJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'nostrfy',
		description:
			'Moteur de serveur relais Nostr tout-en-un écrit en Rust. Entièrement conforme aux spécifications, conçu pour ne jamais tomber, configurable via nostrfy.toml.',
		url: 'https://nostrfy.org/',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Linux, FreeBSD',
		license: ['https://opensource.org/licenses/MIT', 'https://www.apache.org/licenses/LICENSE-2.0'],
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		softwareVersion: '0.1.16',
		installUrl: 'https://nostrfy.org/fr/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'fr'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Le relais Nostr qui ne tombe jamais"
	description="nostrfy est un moteur de serveur relais Nostr tout-en-un écrit en Rust. Entièrement conforme aux spécifications, conçu pour ne jamais tomber, configurable via nostrfy.toml."
/>

<!-- ===== Hero ===== -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true"></div>
	<div
		class="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
		<img
			src="/logo.png"
			width={220}
			height={220}
			alt=""
			class="mx-auto rounded-[2.5rem]"
		/>
		<div
			class="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs text-zinc-400"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true"></span>
			<span>
				Rust · MIT ou Apache-2.0 · dernière version
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			Le relais Nostr qui
			<span class="text-accent-gradient">ne tombe jamais.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> est un moteur de serveur relais Nostr tout-en-un. Rapide par conception, léger par nature, puissant par défaut. Installation en une ligne, configuration dans un seul fichier TOML et exécution sur presque n’importe quel VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				Installer nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Démarrage rapide
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				Voir le code source
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> plus de 36 NIP côté relais
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · conteneurs
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> Un binaire, aucune dépendance
			</span>
		</div>
	</div>
</section>

<!-- ===== Live relays ===== -->
<section class="relative border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
		<div class="mx-auto flex max-w-6xl justify-center">
			{#each site.relays as relay (relay.url)}
				<div class="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-line bg-bg/60 p-5">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"></span>
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Relais actif</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Copier l’URL du relais" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Installation en une ligne</h2>
			<p class="mt-3 text-zinc-400">
				Le script d’installation détecte votre OS et votre architecture, télécharge le binaire précompilé correspondant, vérifie sa somme sha256 et le place dans votre <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>. Ni clonage, ni compilation, ni sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'sans sudo', 'Installe dans ~/.local/bin, ~/bin ou ~/.cargo/bin — le premier déjà présent dans le PATH.'],
				['cpu', 'Linux + FreeBSD', 'Binaires précompilés pour Linux x86_64 et aarch64, ainsi que FreeBSD x86_64.'],
				['wrench', 'Somme de contrôle vérifiée', 'La somme de contrôle de la release est récupérée et vérifiée avant que le binaire ne touche le disque.']
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

		<div class="mt-8 grid gap-3 md:grid-cols-2">
			{#each installVariants as variant (variant.title)}
				<div class="min-w-0">
					<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{installLabels[variant.title] ?? variant.title}</div>
					<CodeBlock code={variant.command} lang="bash" />
				</div>
			{/each}
		</div>

		<div class="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface/50 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg">
					<Icon name="database" size={17} class="text-accent-400" />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-zinc-100">Vous migrez depuis strfry ?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Reprenez vos événements existants en une commande — hors ligne, vérifié et réexécutable sans risque.
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Guide de migration <Icon name="arrow-right" size={15} />
			</a>
		</div>
	</div>
</section>

<!-- ===== Quick start ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
					Opérationnel en moins d’une minute
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy fournit un démon, un validateur de configuration, des statistiques en direct, la rotation des journaux et le rechargement à chaud — tout ce dont un opérateur a besoin, dans un seul binaire.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init écrit un nostrfy.toml par défaut entièrement commenté',
						'nostrfy check valide la configuration avant le démarrage',
						'SIGHUP recharge la plupart des réglages sans redémarrage',
						'nostrfy upgrade met à jour le binaire vers la dernière version'
					] as line (line)}
						<li class="flex gap-3 text-sm text-zinc-300">
							<Icon name="check" size={16} class="mt-0.5 shrink-0 text-accent-400" />
							{line}
						</li>
					{/each}
				</ul>
				<a
					href={p('/docs/quick-start/')}
					class="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
				>
					Ouvrir le guide de démarrage
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# écrit un nostrfy.toml par défaut et quitte'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# lance le relais en démon'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# connexions, événements, taille de la base'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Pointez votre client Nostr vers ws://<host>:8080 — terminé."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Pour des relais en production</h2>
			<p class="mt-3 text-zinc-400">
				Chaque fonctionnalité répond à deux objectifs : ne jamais tomber et être entièrement conforme aux spécifications. Le résultat : un relais qui survit aux abus, aux disques bloqués et aux hôtes à mémoire limitée.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div class="group rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:border-line-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg transition-colors group-hover:border-accent-500/40">
						<Icon name={feature.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{feature.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Performance ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Performances mesurées</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Version release, base de données neuve, portable 8 threads. Le débit d’écriture est limité par un unique thread d’écriture LMDB et des commits groupés sans fsync ; les lecteurs ne le bloquent jamais.
		</p>
		<div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each benchmarks as b (b.label)}
				<div class="rounded-xl border border-line bg-bg/60 p-5 text-center">
					<div class="text-2xl font-bold tracking-tight text-accent-300">{b.value}</div>
					<div class="mt-1 text-xs font-medium text-zinc-300">{b.label}</div>
					<div class="mt-0.5 text-[11px] text-zinc-600">{b.note}</div>
				</div>
			{/each}
		</div>
		<p class="mt-6 text-center text-xs text-zinc-600">
			Reproductible avec les benchmarks fournis — voir
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">notes de performance</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Prise en charge complète des NIP selon la spécification</h2>
				<p class="mt-3 text-zinc-400">
					Chaque NIP côté relais est implémenté et vérifié. La liste publiée dans NIP-11 est dynamique — un NIP disparaît automatiquement lorsque ses kinds sont bloqués.
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Référence complète des NIP <Icon name="arrow-right" size={15} />
			</a>
		</div>

		<div class="mt-8 flex flex-wrap gap-2">
			{#each nips as nip (nip)}
				<span class="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs text-zinc-300">
					{nip}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Clients ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Un écosystème de grands clients</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy parle les standards NIP ouverts sur lesquels les clients s’appuient — les meilleures applications Nostr se connectent et profitent de l’expérience complète. Tout client conforme aux NIP fonctionne avec votre relais.
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each displayClients as client (client.name)}
				<a
					href={client.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group rounded-xl border border-line bg-bg/60 p-5 transition-colors hover:border-line-2"
				>
					<div class="flex items-center gap-3">
						{#if client.icon}
							<img
								src={client.icon}
								alt=""
								width={40}
								height={40}
								class="rounded-lg"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-accent-300"
							>
								{client.name.charAt(0)}
							</div>
						{/if}
						<div class="min-w-0">
							<div class="flex items-center gap-1.5 text-sm font-semibold text-zinc-100 group-hover:text-white">
								{client.name}
								<Icon name="arrow-up-right" size={13} class="text-zinc-500 group-hover:text-accent-300" />
							</div>
							<div class="truncate text-xs text-zinc-500">{client.tagline}</div>
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">{client.quote}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each client.features as feature (feature)}
							<span
								class="rounded-md border border-line bg-surface/50 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
								{feature}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>

		<p class="mt-6 text-center text-xs text-zinc-600">
			Vous développez sur Nostr ? Pointez n’importe quel client vers votre relais — voir
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">Référence complète des NIP</a>.
		</p>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="relative overflow-hidden">
	<div
		class="absolute inset-x-0 bottom-0 h-72 bg-accent-500/10 blur-[100px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6">
		<h2 class="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight">
			Lancez votre propre relais en quelques minutes
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			Du plus petit VPS à une flotte mondiale — le binaire précompilé, le validateur de configuration et les guides de déploiement rendent le tout indolore.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Installer maintenant
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Guides de déploiement <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Soutenir le développement
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			Des questions ? <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">FAQ</a> ou <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">la comparaison entre nostrfy et strfry</a> — et <a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">migrez en une commande</a>.
		</p>
	</div>
</section>
