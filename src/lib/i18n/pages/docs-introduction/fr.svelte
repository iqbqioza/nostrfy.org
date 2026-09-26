<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Introduction à nostrfy"
	description="Ce qu’est nostrfy, ce qu’il fait d’origine et les idées qui sous-tendent le moteur de relais Nostr tout-en-un écrit en Rust."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> est un serveur relais pour le protocole
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a>. Il stocke les événements envoyés par les clients (posts, réactions, profils…) et les distribue en réponse aux demandes d’abonnement.
	</p>

	<h2>Fonctionnalités clés</h2>
	<ul>
		<li><strong>Simple et stable</strong> — écrit en Rust ; un seul binaire fait tout.</li>
		<li>
			<strong>Stockage et recherche rapides</strong> — base de données LMDB avec index de recherche plein texte (NIP-50).
		</li>
		<li>
			<strong>Large prise en charge des NIP</strong> — 36 NIP implémentés, plus le serveur de fichiers Blossom : suppression, preuve de travail, délégation, groupes, recherche et API de gestion.
		</li>
		<li>
			<strong>Facile à exploiter</strong> — mode démon, rotation des journaux, rechargement à chaud de la configuration (SIGHUP), statistiques en direct, API REST et métriques Prometheus.
		</li>
		<li>
			<strong>Migration facile</strong> — une commande importe une
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			base de données : essai à blanc, fusion des réglages et réexécutions sûres (<a href={p('/docs/migrating-from-strfry/')}>guide de migration</a>).
		</li>
	</ul>

	<h2>Ce que vous obtenez d’origine</h2>
	<p>
		Un seul binaire <code>nostrfy</code> sur un seul port sert :
	</p>
	<ul>
		<li><strong>relais WebSocket</strong> et le document d’information NIP-11.</li>
		<li>Une <strong>API REST</strong> en lecture seule, située à <code>/api/v1/...</code> — son propre thread de lecture garantit que le trafic REST ne bloque jamais les abonnés WebSocket.</li>
		<li><strong>serveur de fichiers Blossom</strong> (hébergement de médias) sur son propre nom d’hôte.</li>
		<li><strong>RPC de gestion NIP-86</strong>, le contrôle de santé et Prometheus <code>/metrics</code>.</li>
	</ul>

	<h2>Profil de ressources</h2>
	<p>
		nostrfy a été vérifié sur un <strong>VPS 0,25 vCPU / 512 Mo</strong>. La carte mémoire LMDB est une réservation virtuelle creuse de 1 TiB — le disque physique ne grandit qu’avec les données réelles — et la mémoire du processus reste stable : un relais avec une base de 252 Mo n’occupait que <strong>7,9 Mo de RSS privé</strong>.
	</p>

	<h2>Un aperçu rapide</h2>
	<p>Trois commandes pour installer, initialiser et démarrer :</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Vérifiez ensuite que le relais est en marche :</p>
	<CodeBlock code={health} lang="bash" />
	<p>Puis récupérez son document NIP-11 :</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Où aller ensuite">
		Suivez le <a href={p('/docs/quick-start/')}>démarrage rapide</a> pour votre première exécution, ou passez directement à la
		<a href={p('/docs/configuration/')}>référence de configuration</a> pour régler le relais.
	</Callout>
</div>
