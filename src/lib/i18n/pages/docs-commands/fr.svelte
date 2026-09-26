<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# d’abord un dry-run — vérifie chaque événement sans rien écrire
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# import (arrêtez d’abord le relais nostrfy)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="Référence des commandes"
	description="Toutes les commandes nostrfy : init, start, stop, stats, upgrade et migrate-strfry, plus les listes d’accès en CLI et les filtres d’abonnement inbox/outbox."
/>

<div class="doc-body">
	<h2>Aperçu</h2>
	<p>Toutes les commandes acceptent <code>--config &lt;path&gt;</code> (par défaut <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Commande</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Écrit un nostrfy.toml par défaut et quitte ; le fichier est créé en mode 0600</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Génère une clé secrète pour les groupes NIP-29, l’écrit dans relay.private_key, passe la configuration en mode 0600 et affiche la clé publique ; si le fichier a changé depuis sa lecture, la commande s’arrête sans écrire</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Valide la configuration (à exécuter avant le démarrage)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Démarre en démon ; <code>--foreground</code> l’exécute dans le terminal</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Arrête le démon en cours</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Arrête et redémarre (relit la configuration)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Affiche les statistiques en direct</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Met à jour le binaire vers la dernière release GitHub (ou la version indiquée) ; télécharge l’asset de la plateforme, vérifie son sha256 et exécute <code>--version</code> puis remplace le binaire de façon atomique ; les exécutions concurrentes sont sérialisées par un fichier de verrou ; sans version indiquée, aucune rétrogradation n’a lieu ; <code>--force</code> force la réinstallation</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>Importe les événements d’un relais strfry — soit en exécutant <code>strfry export</code> via <code>--strfry-db</code>, soit en lisant un fichier JSONL avec <code>--input</code>, soit via stdin ; réexécutable, avec <code>--dry-run</code>, <code>--since</code> et la fusion optionnelle des réglages</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Gérer les listes d’accès</h2>
	<p>
		Les listes d’autorisation et de refus du relais et la liste d’autorisation d’upload Blossom vivent dans LMDB et s’appliquent immédiatement — le démon en cours est rechargé automatiquement :
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>Une clé refusée est toujours rejetée à la publication et jamais servie en lecture.</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> : retire une IP de la liste des IP bloquées NIP-86 persistée (récupération après auto-blocage) ; redémarrez le démon pour l’appliquer.
	</p>

	<h2>Filtres d’abonnement inbox/outbox</h2>
	<p>
		nostrfy étend la syntaxe des filtres REQ pour le modèle de routage inbox/outbox avec deux clés pratiques — une extension nostrfy, pas une partie d’un NIP. <code>"outbox"</code> se développe en <code>"authors"</code> : seuls les événements <em>créés par cette clé</em>.
		<code>"inbox"</code> se développe en <code>"#p"</code> : seuls les événements <em>adressés à cette clé</em> (mentions, réponses, zaps et messages privés). Les valeurs peuvent être en hexadécimal de 64 caractères ou en <code>npub1</code>, ou des tableaux fusionnés avec une clé <code>authors</code>/<code>#p</code> existante ; une clé invalide rejette l’abonnement :
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		Les points de terminaison sont aussi limités en écriture : <code>/outbox</code> n’accepte que les événements créés par la clé authentifiée NIP-42 de la connexion (<code>server.outbox_write_policy = "any"</code>), ou uniquement les événements du relais (<code>"relay"</code>) ;
		<code>/inbox</code> n’accepte que les événements portant un tag <code>p</code>.
	</p>

	<h2>Migration depuis strfry</h2>
	<p>
		Une seule commande reprend les événements d’un relais strfry existant. La migration est hors ligne (arrêtez d’abord le relais nostrfy — elle refuse de s’exécuter si la base est occupée), lit le propre format d’export de strfry et peut être relancée sans risque : les doublons sont ignorés et les effets des suppressions réappliqués.
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		Il propose aussi de fusionner les réglages strfry équivalents dans <code>nostrfy.toml</code>, et après une interruption avec <code>--since</code>
		reprendre. Les groupes NIP-29 et les rôles NIP-43 sont reconstruits à partir des événements importés au premier démarrage. Le manuel complet se trouve dans le
		<a href={p('/docs/migrating-from-strfry/')}>guide de migration</a>.
	</p>

	<Callout type="tip" title="Pas à pas">
		La plupart des commandes sont aussi expliquées pas à pas dans le <a href={p('/docs/quick-start/')}>guide de démarrage rapide</a>.
	</Callout>
</div>
