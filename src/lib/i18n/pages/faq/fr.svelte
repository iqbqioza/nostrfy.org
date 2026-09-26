<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const faqs = [
		{
			q: 'Qu’est-ce que nostrfy ?',
			a: 'nostrfy est un moteur de serveur relais Nostr tout-en-un écrit en Rust. Il stocke les événements des clients Nostr et les distribue en réponse aux abonnements, en implémentant tous les NIP côté relais, plus un serveur multimédia Blossom optionnel, une API REST en lecture seule et une API de gestion NIP-86 — le tout dans un seul binaire.'
		},
		{
			q: 'nostrfy est-il gratuit et open source ?',
			a: 'Oui. nostrfy est un logiciel libre, sous double licence MIT ou Apache-2.0, au choix. Le code source est sur GitHub, sans offre payante, télémétrie ni verrouillage.'
		},
		{
			q: 'De quoi ai-je besoin pour exécuter nostrfy ?',
			a: 'Un seul binaire statique fonctionne sur Linux (x86_64 et aarch64) et FreeBSD (x86_64). Il a été vérifié sur un VPS 0,25 vCPU / 512 Mo. Le stockage est une base LMDB locale — aucun serveur de base de données externe n’est requis.'
		},
		{
			q: 'Comment installer nostrfy ?',
			a: 'Une ligne : curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. Le script détecte votre OS et votre architecture, télécharge le binaire précompilé correspondant, vérifie sa somme de contrôle et le place dans le PATH. Vous pouvez aussi compiler depuis les sources avec Cargo ou copier un modèle de configuration prêt à l’emploi.'
		},
		{
			q: 'Comment nostrfy est-il configuré ?',
			a: 'Tout tient dans un seul nostrfy.toml entièrement commenté — identité du relais, limites, stockage, contrôle d’accès, Blossom et RPC. nostrfy check le valide avant le démarrage, et la plupart des réglages se rechargent à chaud via SIGHUP sans redémarrage.'
		},
		{
			q: 'Quels NIP nostrfy prend-il en charge ?',
			a: 'nostrfy implémente 36 NIP, dont NIP-01, la suppression NIP-09, les groupes NIP-29, l’authentification NIP-42, la recherche NIP-50, les zaps NIP-57, le gift wrap NIP-59, les listes de relais NIP-65, negentropy NIP-77, la gestion NIP-86 et l’authentification HTTP NIP-98. La liste supported_nips de NIP-11 est dynamique : un NIP disparaît lorsque les kinds nécessaires sont bloqués ou désactivés.'
		},
		{
			q: 'nostrfy héberge-t-il des fichiers multimédias ?',
			a: 'Oui. Le serveur de fichiers Blossom intégré héberge des téléversements adressés par contenu sur son propre nom d’hôte — disque local ou bucket compatible S3 comme AWS S3 ou Cloudflare R2. Les téléversements sont autorisés par des événements kind-24242 signés et peuvent être limités à une allowlist.'
		},
		{
			q: 'Puis-je migrer depuis strfry ?',
			a: 'Oui. nostrfy migrate-strfry importe directement une base strfry ou un export JSONL, en appliquant la sémantique remplaçable/adressable, les suppressions NIP-09 et les effets de bord de modération NIP-29, et peut fusionner les réglages strfry équivalents dans nostrfy.toml. La migration est hors ligne, testable à blanc et sûre à relancer.'
		},
		{
			q: 'nostrfy peut-il tourner derrière un proxy inverse ou Cloudflare ?',
			a: 'Oui. Configurez server.trusted_proxies avec les adresses du proxy (bouclage local pour nginx ou Caddy sur le même hôte, la plage du load balancer dans le cloud) pour que les limites par IP, blockip et les journaux voient la vraie adresse client. Le TLS est terminé par votre proxy ou tunnel ; nostrfy sert derrière en HTTP et WebSocket classiques.'
		},
		{
			q: 'nostrfy a-t-il une API REST ?',
			a: 'Oui — une API /api/v1 en lecture seule sur le même port que le relais WebSocket, dans son propre thread de lecture, donc le trafic REST ne bloque jamais les abonnés. Elle interroge les événements par npub, nevent ou naddr et fournit compteurs, statistiques d’auteur, répartitions par jour/mois et recherche plein texte.'
		},
		{
			q: 'Comment nostrfy reste-t-il en ligne sous charge ou abus ?',
			a: 'Protection contre la surcharge, threads de lecture dédiés, isolation des panics et limites de ressources strictes. Les files bornées échouent vite au lieu d’épuiser la mémoire ; les plafonds de connexions par IP arrêtent les floods de sockets, et un disque bloqué ne bloque pas les lectures. Les sous-systèmes sont isolés, le relais continue de servir.'
		},
		{
			q: 'Comment gérer les utilisateurs, bannissements et rôles ?',
			a: 'Via l’API de gestion JSON-RPC NIP-86 avec un token Bearer ou une clé admin NIP-98 : bannir des clés, bloquer des IP, gérer les allowlists de kinds, les rôles et les codes d’invitation. Les attributions de méthodes permettent de déléguer la modération à d’autres clés sans donner les pleins droits d’admin.'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'fr',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Questions fréquentes"
	description="Réponses sur nostrfy : installation, configuration, prise en charge des NIP, médias Blossom, migration depuis strfry, proxys inverses, licence et gestion."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Questions fréquentes</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Réponses courtes sur l’exploitation de nostrfy. Tout ci-dessous renvoie vers la
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">documentation</a> — et si vous préférez, vous pouvez
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">le comparer à strfry</a>.
		</p>

		<div class="mt-10 space-y-3">
			{#each faqs as faq (faq.q)}
				<details class="group rounded-xl border border-line bg-surface/50 p-5">
					<summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-zinc-100">
						{faq.q}
						<Icon
							name="chevron-down"
							size={16}
							class="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
						/>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
				</details>
			{/each}
		</div>

		<div class="mt-12 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Installer nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Voir le code source
			</a>
		</div>
	</div>
</div>
