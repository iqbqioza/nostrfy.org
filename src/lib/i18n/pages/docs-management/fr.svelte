<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const call = `curl -X POST http://127.0.0.1:8080/ \\
  -H "Content-Type: application/nostr+json+rpc" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"method":"supportedmethods","params":[]}'`;
</script>

<DocsTitle
	title="Gestion NIP-86"
	description="L’API de gestion JSON-RPC : modération, listes d’accès, identité du relais, rôles, codes d’invitation et délégations de méthodes, avec authentification Bearer ou NIP-98."
/>

<div class="doc-body">
	<h2>Activation</h2>
	<p>
		NIP-86 est une API JSON-RPC pour gérer le relais. Elle nécessite l’une des deux méthodes d’authentification, sinon chaque appel est refusé :
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Méthode</th>
				<th>Configuration</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Jeton Bearer</td>
				<td>
					Définissez <code>rpc.management_token</code> et envoyez <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Définissez <code>rpc.admin_pubkey</code> et envoyez un événement d’authentification NIP-98 (kind 27235) signé par la clé admin dans <code>Authorization: Nostr &lt;base64&gt;</code> — un tag <code>payload</code> est requis ; chaque événement est à usage unique dans sa fenêtre de 60 secondes
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Appeler l’API</h2>
	<p>POST / avec <code>Content-Type: application/nostr+json+rpc</code> :</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Méthodes</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Méthode</th>
				<th>Paramètres</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>Liste des méthodes prises en charge</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Bannir une pubkey de la publication (la retire aussi de la liste d’autorisation)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Débannir une pubkey</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>Lister les pubkeys bannies et les motifs</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Ajouter à la liste d’autorisation (débannit aussi)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Retirer de la liste d’autorisation</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>Lister la liste d’autorisation</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Autoriser / interdire un kind</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>Lister les kinds autorisés / interdits</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Changer le nom / la description / l’icône du relais (persisté dans le fichier de configuration ; signale une erreur si le fichier ne peut pas être écrit)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>Gestion des rôles NIP-43 (les champs mal typés sont rejetés ; supprimer un rôle manquant réussit)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Attribuer / retirer un rôle (une attribution en double ou une révocation manquante réussit)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Accorder / révoquer une méthode NIP-86 à une pubkey non-admin — seules les méthodes de modération et de lecture peuvent être déléguées</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>Lister les délégations de méthodes (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Bloquer / débloquer une IP (le blocage coupe aussi les connexions existantes)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>Lister les IP bloquées</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Bannir un événement (bannir un id inconnu le pré-bannit ; le retire aussi de la liste d’autorisation)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Ajouter un événement à la liste d’autorisation (lève aussi le bannissement ; autoriser un id inconnu le pré-autorise)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Retirer un événement de la liste d’autorisation / de bannissement (une entrée manquante réussit)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>Lister les événements bannis (une recherche échouée renvoie une erreur, jamais une liste vide)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>Lister les événements autorisés</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>Événements en attente de modération (toujours vide sur ce relais)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>Lister les codes d’invitation NIP-43</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Émettre / révoquer un code d’invitation NIP-43 (un kind:28934 portant un code listé admet son auteur)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Administration déléguée">
		<code>rpc.admin_pubkey</code> (et le jeton de gestion) restent la connexion racine avec toutes les méthodes. Les autres pubkeys s’authentifient avec NIP-98 et ne peuvent exécuter que leurs méthodes accordées via <code>assignmethod</code> (<code>supportedmethods</code> affiche leur propre sous-ensemble). La gestion des permissions, des rôles, des codes d’invitation et de l’identité du relais reste réservée à l’admin, donc un bénéficiaire ne peut jamais escalader. Une pubkey bannie est refusée même avec des délégations.
	</Callout>

	<Callout type="note" title="Servi sur les routes publiques POST /">
		Le RPC NIP-86 est monté sur les routes publiques POST / du relais. Les mutations sont enregistrées dans un journal d’audit limité en débit (600 entrées par minute au maximum) avec l’identité authentifiée. Les requêtes dépassant <code>rpc.max_admin_body_bytes</code> sont refusées avec un code 413.
	</Callout>
</div>
