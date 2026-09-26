<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);
</script>

<DocsTitle
	title="Groupes NIP-29"
	description="Groupes NIP-29 : espaces de discussion fermés où seuls les membres peuvent écrire, avec des événements de modération et des instantanés de l’état du groupe signés par le relais."
/>

<div class="doc-body">
	<h2>Activer les groupes</h2>
	<ol>
		<li>
			Exécutez <code>nostrfy genkey</code> pour définir <code>relay.private_key</code>
			(<strong>requis</strong> — sans lui, les métadonnées de groupe ne sont pas générées).
		</li>
		<li>Redémarrez le relais.</li>
	</ol>

	<h2>Fonctionnement des groupes</h2>
	<p>
		Les groupes sont créés et modérés par des événements. À partir de ces événements de modération, le relais génère
		des instantanés signés par le relais que les clients utilisent pour l’affichage :
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Événement</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Créer le groupe (le créateur devient admin)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Ajouter un membre (avec rôles) / retirer un membre</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Modifier les métadonnées (nom, description, public/privé, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Supprimer un événement (modération)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Supprimer le groupe (ses événements stockés sont purgés)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Créer un code d’invitation</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Mettre à jour la liste des épinglés</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Demande d’adhésion / demande de départ</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Instantanés signés par le relais</h3>
	<ul>
		<li><code>kind:39000</code> — métadonnées du groupe (nom, paramètres de visibilité, ...)</li>
		<li><code>kind:39001</code> — liste des admins</li>
		<li><code>kind:39002</code> — liste des membres</li>
		<li><code>kind:39005</code> — événements épinglés</li>
	</ul>

	<h2>Paramètres de visibilité du groupe</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Tag</th>
				<th>Signification</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Seuls les membres peuvent lire les messages</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Seuls les membres peuvent écrire</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>Les métadonnées sont masquées aux non-membres</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Les demandes d’adhésion ne sont pas approuvées automatiquement (codes d’invitation requis)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>Le groupe dispose d’un salon audio/vidéo LiveKit</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Sous-groupes</h2>
	<p>
		Les groupes peuvent être hiérarchiques — imbriqués avec des tags <code>parent</code> / <code>child</code>. Les cycles sont
		rejetés automatiquement.
	</p>

	<Callout type="warning" title="Quitter un groupe">
		Tout membre — y compris le dernier admin du groupe — peut partir avec <code>kind:9022</code> et est
		automatiquement retiré ; si le dernier admin part, le groupe n’a plus d’admins. Nommez d’abord un autre admin,
		ou supprimez le groupe avec <code>kind:9008</code>, ou récupérez un groupe sans admin en signant un
		événement de modération avec la propre clé du relais (<code>relay.private_key</code>, la pubkey <code>self</code> de NIP-11).
		Voir <a href={p('/docs/troubleshooting/')}>dépannage</a> pour la procédure.
	</Callout>
</div>
