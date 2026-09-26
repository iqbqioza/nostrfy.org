<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. Arrêtez le relais nostrfy (la migration nécessite le répertoire de la base)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry-run — vérifie chaque événement sans rien écrire
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. importez
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. démarrez — les groupes NIP-29 et les rôles NIP-43 sont reconstruits depuis les événements importés
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # requis pour NIP-42/62/98 et les métadonnées NIP-29
private_key = "..."                       # requis pour les métadonnées NIP-29/43 signées par le relais

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Option A — nostrfy exécute \`strfry export\` lui-même (strfry dans le PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Option B — vous avez exporté vers un fichier
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Option C — pipe (stdin est l’entrée par défaut)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # pour nak (WebSocket)
H=https://relay.example.com    # pour curl (HTTP)

nak relay "$R"                              # le relais répond et annonce ses NIP
curl -s "$H/api/v1/query?limit=1"           # les événements sont servis
nak req -i <deleted-event-id> "$R"          # un événement supprimé reste supprimé
nak req -k 39000 "$R"                       # métadonnées de groupe NIP-29 (si migrées)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # appartenance NIP-43 (AUTH)`;
</script>

<DocsTitle
	title="Migrer depuis strfry"
	description="Déplacez les événements d’un relais strfry existant vers nostrfy en une commande — préparation, essai à blanc, migration, vérification et retour en arrière."
/>

<div class="doc-body">
	<h2>En un coup d'œil</h2>
	<p>
		<code>nostrfy migrate-strfry</code> lit le format d’export propre de
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		(JSONL, un événement NIP-01 par ligne), et fonctionne donc avec différentes versions de la base strfry sans dépendre du schéma
		LMDB interne de strfry. Il n’écrit jamais dans la base strfry.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Migré</th>
					<th>Non migré</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Chaque événement stocké (sémantique remplaçable/adressable appliquée)</td>
					<td>Réglages strfry sans équivalent nostrfy (le rapport de fusion liste chacun avec un motif)</td>
				</tr>
				<tr>
					<td>Expiration NIP-40 — les événements déjà expirés sont ignorés</td>
					<td>Médias Blossom et mappings de propriétaires (strfry n’a pas de serveur Blossom)</td>
				</tr>
				<tr>
					<td>Suppressions NIP-09, y compris blocs de republication pour événements déjà supprimés par strfry</td>
					<td>Listes d’accès (bans NIP-86, listes de pubkeys du relais, allowlist Blossom)</td>
				</tr>
				<tr>
					<td>Effets de modération NIP-29 <code>9005</code>/<code>9008</code></td>
					<td>Codes d’invitation NIP-43 (émettez-en de nouveaux avec <code>createclaim</code>)</td>
				</tr>
				<tr>
					<td>Horodatages first-seen (quand le filtre nouvelles pubkeys est configuré)</td>
					<td>Requêtes vanish NIP-62 sauf si <code>--apply-vanish</code> est donné</td>
				</tr>
				<tr>
					<td>Groupes NIP-29, rôles NIP-43 et leurs métadonnées signées par le relais, reconstruits au premier démarrage</td>
					<td>Identité/clés propres du relais (elles vivent dans <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>Les réglages strfry équivalents, proposés pour fusion dans <code>nostrfy.toml</code> (optionnel)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Ignorés attendus dans le résumé : <strong>événements éphémères</strong> (kinds 20000-29999, que nostrfy ne
		stocke jamais) et <strong>événements déjà expirés</strong>.
	</p>

	<h2>Démarrage rapide</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="La migration est hors ligne">
		Elle écrit directement dans <code>database.path</code> et refuse de tourner tant qu’un démon nostrfy (ou une autre
		migration) tient le répertoire de base. <strong>Arrêtez d’abord le relais.</strong> strfry lui-même peut rester
		lancé — <code>strfry export</code> lit un snapshot cohérent.
	</Callout>

	<h2>Prérequis</h2>
	<ul>
		<li>
			Le binaire <code>strfry</code> (pour <code>--strfry-db</code>), ou un fichier JSONL exporté vous-même.
		</li>
		<li>nostrfy v0.1.15 ou plus récent (sous-commande <code>migrate-strfry</code>).</li>
		<li>La config nostrfy du relais cible, avec <code>database.path</code>, <code>public_url</code> et <code>private_key</code> définis.</li>
		<li>
			Espace disque libre : environ la taille de l’export strfry plus ses index. L’index de mots NIP-50 ajoute
			un peu ; sur disque très juste vous pouvez le désactiver (<code>database.search_index = false</code>),
			migrer, puis le réactiver (l’index est reconstruit au démarrage).
		</li>
		<li>Aucune instance nostrfy en cours sur le <code>database.path</code> cible.</li>
	</ul>

	<h2>Préparer la config</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Générez la clé du relais avec <code>nostrfy genkey</code> si vous n’en avez pas, puis validez :
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>Fusionner les réglages strfry (optionnel)</h3>
	<p>
		Avant d’ouvrir la base, <code>migrate-strfry</code> cherche la config de strfry (<code>--strfry-config</code>, puis
		<code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>, <code>./strfry.conf</code>), affiche les réglages qui ont
		un équivalent nostrfy et diffèrent de votre <code>nostrfy.toml</code>, et demande s’il faut les fusionner. Seules les clés
		listées sont réécrites — commentaires et toutes autres lignes préservés, et une valeur qui rendrait la config invalide est
		ignorée avec son motif pendant que le reste fusionne.
	</p>
	<ul>
		<li><code>--merge-config</code> applique sans demander (pour scripts) ; <code>--no-merge-config</code> saute l’étape.</li>
		<li>Sans terminal, les propositions sont affichées et la fusion est sautée sauf si <code>--merge-config</code> est donné.</li>
		<li><code>--dry-run</code> affiche les propositions mais n’écrit jamais.</li>
	</ul>

	<h2>Essai à blanc</h2>
	<p>Regardez avant de sauter — un essai à blanc analyse et vérifie tout l’export sans toucher la base :</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		Un compteur <code>bad signature</code> non nul signifie que l’export contient des événements acceptés par strfry sans
		vérification ; ils seront ignorés. Si vous leur faites confiance, passez <code>--no-verify</code> pour les importer quand même.
	</p>

	<h2>Migrer</h2>
	<p>Choisissez un des trois modes d’entrée — tous produisent le même résultat :</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Option</th>
					<th>Pourquoi</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry n’est pas dans <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Reprise/rattrapage : événements avec ce <code>created_at</code> ou plus récents (inclus)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>Honorer les requêtes vanish NIP-62 trouvées dans l’export (désactivé par défaut)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Ignorer la vérification de signature pour dumps de confiance (plus rapide)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Événements par transaction base (défaut 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Analyser et vérifier seulement</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		La migration est <strong>sûre à relancer</strong> : les doublons sont ignorés et les effets de suppression sont
		réappliqués, donc une exécution interrompue peut simplement être répétée (ou reprise avec <code>--since</code>).
	</p>

	<h2>Démarrer et vérifier</h2>
	<p>
		Le premier démarrage reconstruit le store de groupes NIP-29 et le store de rôles NIP-43 depuis les événements importés
		et republie les métadonnées signées par le relais (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		par groupe, la liste de membres <code>13534</code>). Sur une grosse base cela peut prendre un moment ; surveillez le log.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		Pour une comparaison exacte, <code>strfry scan '&#123;&#125;' | wc -l</code> moins les événements éphémères/expirés
		signalés par le résumé devrait égaler ce que les clients peuvent récupérer.
	</p>

	<h2>Reprendre une migration interrompue</h2>
	<Callout type="warning" title="Ne démarrez pas le relais avant de relancer">
		Les effets de groupe NIP-29 (<code>9005</code>/<code>9008</code>) sont appliqués après l’import ; une exécution
		interrompue a stocké ces événements mais pas encore leurs suppressions, donc le premier démarrage pourrait servir
		l’historique que la suppression devait retirer. Relancez d’abord la migration — elle complète les effets (la purge
		est idempotente) — puis démarrez le relais.
	</Callout>
	<ul>
		<li>
			<strong>Exporté vers fichier / pipé :</strong> relancez la même commande. Les doublons sont ignorés et les blocs
			de suppression sont réappliqués.
		</li>
		<li>
			<strong>Utilisé <code>--strfry-db</code> :</strong> le résumé affiche une astuce de reprise ; relancez avec ce
			<code>--since</code> (inclusif, la seconde frontière est réimportée et dédupliquée).
		</li>
		<li>
			Si l’exécution a échoué avec <code>database writer unavailable</code>, vérifiez l’espace libre et
			<code>database.map_size</code>, puis relancez.
		</li>
	</ul>

	<h2>Retour en arrière</h2>
	<p>La migration n’écrit que dans la base nostrfy. Pour revenir en arrière, arrêtez le relais et restaurez la base pré-migration ou supprimez-la :</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # ou restaurez la sauvegarde pré-migration'} lang="sh" />

	<h2>Dépannage</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Message</th>
					<th>Cause / correction</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>Un démon nostrfy (ou une autre migration) tient le répertoire : <code>nostrfy stop</code> d’abord</td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> doit nommer le répertoire contenant <code>data.mdb</code></td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>Installez strfry, définissez <code>--strfry-bin</code>, ou utilisez <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>Le thread d’écriture s’est arrêté ou la file est surchargée : vérifiez disque/taille map, relancez (sûr)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>La purge a été interrompue : relancez la migration</td>
				</tr>
				<tr>
					<td>Compteur <code>bad signature</code> élevé</td>
					<td>La BD strfry contient des événements non vérifiés : inspectez-les ; importez avec <code>--no-verify</code> seulement si vous faites confiance à la source</td>
				</tr>
				<tr>
					<td>Métadonnées NIP-29 manquantes après démarrage</td>
					<td>Pas de <code>relay.private_key</code> : lancez <code>nostrfy genkey</code> et redémarrez</td>
				</tr>
				<tr>
					<td>La fusion des réglages n’est pas proposée</td>
					<td>Config strfry introuvable : passez <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Liste de contrôle</h2>
	<ul>
		<li>Relais nostrfy arrêté</li>
		<li>Base strfry et config nostrfy sauvegardées</li>
		<li><code>nostrfy check</code> passe</li>
		<li>Réglages strfry fusionnés (ou rapport relu)</li>
		<li>Essai à blanc relu (pas de bad signatures inattendues)</li>
		<li>Migration terminée sans erreurs</li>
		<li>Relais démarré ; reconstruction groupes/rôles journalisée</li>
		<li>Comptes d’événements concordent (moins éphémères/expirés)</li>
		<li>Événements supprimés restent partis (republication rejetée)</li>
		<li>Visibilité des groupes privés vérifiée anonymement et comme membre</li>
		<li>Reverse proxy / DNS / listes de relais clients mis à jour</li>
	</ul>

	<Callout type="tip" title="strfry tourne encore ?">
		Si strfry est resté live pendant l’export, faites une passe de rattrapage quand vous êtes prêt à basculer : arrêtez nostrfy,
		relancez la migration avec <code>--since &lt;last created_at&gt;</code>, puis redémarrez.
	</Callout>
</div>
