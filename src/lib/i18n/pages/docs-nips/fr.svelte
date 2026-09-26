<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);
</script>

<DocsTitle
	title="Référence des NIP pris en charge"
	description="Tous les NIP côté relais implémentés par nostrfy — kinds, notes et réserves — et comment la liste supported_nips de NIP-11 est calculée dynamiquement."
/>

<div class="doc-body">
	<h2>NIP implémentés</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Protocole de base (événements, abonnements)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Suppression d’événements</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Document d’information du relais</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Preuve de travail</td>
			</tr>
			<tr>
				<td>17</td>
				<td>DM privés (kind 14 enveloppé dans kind 15 ; les gift wraps kind 1059 et éphémère kind 21059 sont servis uniquement au destinataire quand l’auth NIP-42 est activée)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Commentaires (kind 1111, fils via l’index #e)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Signature d’événements déléguée</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Chat public (côté client : stocké et servi comme événements ordinaires, non annoncé)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Groupes hébergés sur le relais</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Étiquetage (kind 1985, indexé #l/#L)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Événements remplaçables paramétrés</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					Fonctions Git (kinds 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — sur option via
					<code>relay.enabled_git</code>, désactivé par défaut)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Horodatage d’expiration</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Authentification client</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Métadonnées d’accès au relais (rôles) — kinds 33534/13534/8000/8001 plus éphémères 28934/28935/28936 ;
					les métadonnées signées par le relais sont protégées par AUTH. Les codes d’invitation sont émis avec NIP-86
					<code>createclaim</code>/<code>deleteclaim</code> ; un kind:28934 portant un code listé admet
					son auteur
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Comptage des résultats (COUNT)</td>
			</tr>
			<tr>
				<td>46</td>
				<td>Nostr Connect</td>
			</tr>
			<tr>
				<td>47</td>
				<td>Nostr Wallet Connect</td>
			</tr>
			<tr>
				<td>50</td>
				<td>Capacité de recherche (plein texte, triée par pertinence)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Zaps Lightning (kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift wrap (servi uniquement au destinataire)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Demande de disparition</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Métadonnées de liste de relais</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Découverte de relais &amp; vivacité (kinds 30166/10166 stockés et servis ; auto-publie kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>Indice de complétude EOSE</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Événements protégés</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Synchronisation Negentropy (un remplacement échoué ferme l’id avec NEG-ERR selon NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Données spécifiques aux applications (kind 30078, protégé par AUTH)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Points forts</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Assertions de confiance (kinds 30382/30383/30384/30385/10040, adressables)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>API de gestion du relais</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Annonces Cashu et Fedimint (kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Sondages</td>
			</tr>
			<tr>
				<td>94</td>
				<td>Métadonnées de fichiers (kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>Auth HTTP</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Cibles de paiement (kind 10133, remplaçable), un brouillon ; servi mais non annoncé
					dans <code>supported_nips</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) n’est pas un NIP et n’est pas annoncé dans le document NIP-11 — il est servi comme
		serveur de fichiers séparé sur le nom d’hôte <code>[blossom]</code>. Voir la
		<a href={p('/docs/blossom/')}>page du serveur de fichiers Blossom</a> pour plus de détails.
	</p>

	<h2>Annonce dynamique des NIP</h2>
	<p>
		La liste <code>supported_nips</code> n’est pas statique : un NIP en est retiré lorsque chaque kind défini par le
		NIP est rejeté par le contrôle d’accès du relais.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — bloquer tous les kinds d’un NIP le masque (p. ex. bloquer le
			kind 5 masque NIP-09). N’en bloquer que certains conserve le NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — un kind n’est accepté que s’il est listé ; un NIP dont les
			kinds sont tous non listés est masqué.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — les kinds éphémères qui ne figurent pas dans la liste d’exemption
			imposée par le NIP (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>) sont rejetés, donc les NIP qui en dépendent sont masqués.
		</li>
		<li>
			<strong>Prérequis</strong> — NIP-29, NIP-43 et NIP-66 reposent sur des événements signés par le relais et sont
			masqués sans <code>relay.private_key</code> ; NIP-86 est masqué sauf si
			<code>rpc.management_token</code> ou <code>rpc.admin_pubkey</code> est défini (sinon chaque
			appel de gestion est refusé).
		</li>
		<li>
			Les NIP sans kinds dédiés (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) sont toujours annoncés lorsqu’ils sont activés.
		</li>
	</ul>
	<p>
		Les modifications effectuées à l’exécution — NIP-86 <code>allowkind</code>/<code>disallowkind</code>, ou un rechargement SIGHUP de
		<code>reject_ephemeral</code> — sont reflétées lors de la prochaine récupération NIP-11.
		<code>enabled_nips</code>/<code>disabled_nips</code> exigent toujours un redémarrage.
	</p>
</div>
