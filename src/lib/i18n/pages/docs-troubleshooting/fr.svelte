<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# Modifiez port = 8080 dans le fichier de configuration, puis :
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# Si nostrfy tourne, redémarrez-le
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Supprimez le fichier pid obsolète si présent
rm -f nostrfy.pid`;
	const tomlExample = `# Exemples corrects
name = "my relay"        # les chaînes sont citées avec "
port = 8080              # les nombres sont simples
enabled_nips = [1, 50]   # les listes sont entre [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# Depuis l’extérieur (avec l’IP/port du serveur)
curl http://YOUR_SERVER_IP:8080/health

# Vérifiez le pare-feu (exemple : ufw)
sudo ufw status
# Ouvrez le port si nécessaire
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" en octets`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Sauvegardez aussi [blossom].local_path avec le stockage Blossom local.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Dépannage"
	description="Les erreurs les plus courantes — ports, permissions, TLS, NIP manquants, publication et délais d’attente — avec des correctifs étape par étape."
/>

<div class="doc-body">
	<p><strong>Trois choses à vérifier en premier :</strong></p>
	<ul>
		<li><code>nostrfy check</code> valide votre configuration (la plupart des erreurs sont des erreurs de configuration).</li>
		<li><code>tail -f nostrfy.log</code> affiche le journal — la cause s’y trouve presque toujours.</li>
		<li><code>nostrfy restart</code> redémarre le démon proprement.</li>
	</ul>

	<h2 id="cannot-start">Impossible de démarrer</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Cause :</strong> Le port 80 ne peut être lié que par root.</p>
	<p><strong>Correctif :</strong> Exécutez avec <code>sudo</code>, ou changez le port pour un port comme 8080.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Cause :</strong> Un autre processus (un ancien nostrfy ou un autre serveur) utilise déjà
		le port.
	</p>
	<p><strong>Correctif :</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Cause :</strong> nostrfy est déjà en cours d’exécution ; <code>start</code> refuse de démarrer
		une seconde instance.
	</p>
	<p><strong>Correctif :</strong> Utilisez <code>nostrfy restart</code>, ou utilisez simplement l’instance en cours d’exécution.</p>

	<h3><code>nostrfy stop</code> se bloque / <code>did not stop in time</code></h3>
	<p><strong>Cause :</strong> Le démon est bloqué ou ne répond pas.</p>
	<p><strong>Correctif :</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Cause :</strong> Le fichier de configuration n’est pas du TOML valide. Erreurs courantes :
		oublier les guillemets autour d’une chaîne, ou écrire deux fois la même clé.
	</p>
	<p><strong>Correctif :</strong> Le message d’erreur inclut un numéro de ligne. Vérifiez et corrigez cette ligne.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Cause :</strong> Le fichier de configuration n’existe pas.</p>
	<p><strong>Correctif :</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Cause :</strong> <code>relay.private_key</code> n’est pas une clé hexadécimale valide de 64
		caractères.
	</p>
	<p>
		<strong>Correctif :</strong> Exécutez <code>nostrfy genkey</code> pour générer une clé correcte (ou
		définissez <code>private_key = ""</code>).
	</p>

	<h3>Beaucoup d’avertissements dans le journal au démarrage</h3>
	<p>Les lignes de journal <code>[WARN]</code> signalent des problèmes de configuration. Les principales :</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Avertissement</th>
				<th>Signification et correctif</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> n’est pas défini — l’authentification NIP-42, l’effacement NIP-62
					et l’authentification admin NIP-98 ne fonctionneront pas. Définissez
					<code>wss://your-public-url</code>.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>Les groupes ont besoin d’une clé secrète. Exécutez <code>nostrfy genkey</code>.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>Une clé héritée inutilisée (ou une faute de frappe) dans la configuration. Vérifiez le nom de la clé.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					Une faute de frappe dans un nom de section (p. ex. <code>[serve]</code> au lieu de
					<code>[server]</code>). Corrigez-la.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>Cette combinaison bloque tout le monde. Changez l’un des deux.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					L’exigence de preuve de travail est si élevée que personne ne peut publier. Réduisez
					<code>require_pow</code>.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">Impossible de se connecter ou comportement étrange</h2>

	<h3>Le client reçoit <code>connection refused</code></h3>
	<p>
		<strong>Cause :</strong> Le relais n’est pas en cours d’exécution, ou un pare-feu bloque le port.
	</p>
	<p><strong>Correctif :</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>Les clients externes ne peuvent pas se connecter, les clients locaux le peuvent</h3>
	<p>
		<strong>Cause :</strong> <code>server.host</code> est toujours <code>127.0.0.1</code> (la valeur par
		défaut), qui n’accepte que les connexions locales.
	</p>
	<p>
		<strong>Correctif :</strong> Définissez <code>host = "0.0.0.0"</code> dans la configuration et
		redémarrez.
	</p>

	<h3>Impossible de se connecter via un tunnel Cloudflare</h3>
	<p>Lors de l’utilisation de Cloudflare Tunnel :</p>
	<ul>
		<li>
			Le relais fonctionne en HTTP simple ; Cloudflare termine TLS, donc les clients utilisent
			<code>wss://</code>. Définissez <code>public_url = "wss://..."</code> sur le relais (cela fait
			fonctionner l’authentification NIP-42).
		</li>
		<li>
			Cloudflare ajoute un en-tête <code>X-Forwarded-Proto</code>. nostrfy traite les valeurs
			<code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> de la même façon, donc
			aucune configuration supplémentaire n’est normalement nécessaire.
		</li>
	</ul>

	<h3><code>error: message too large</code> et la connexion se ferme</h3>
	<p>
		<strong>Cause :</strong> Un seul message dépasse <code>max_ws_message_bytes</code> (1 Mo par défaut).
	</p>
	<p>
		<strong>Correctif :</strong> Augmentez <code>limits.max_ws_message_bytes</code> si vous avez besoin
		d’événements plus volumineux — mais vérifiez aussi les limites propres du client.
	</p>

	<h3>Erreurs <code>too many subscriptions</code> / <code>too many filters</code></h3>
	<p>
		<strong>Cause :</strong> Les plafonds par connexion ont été atteints (abonnements 20 par défaut,
		filtres 20 par défaut).
	</p>
	<p>
		<strong>Correctif :</strong> Augmentez <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> (et vérifiez les paramètres du client).
	</p>

	<h3>Les nouvelles connexions sont refusées sous charge</h3>
	<p>
		<strong>Cause :</strong> <code>max_connections</code> (10000 par défaut) a été atteint, le plafond par
		IP (<code>max_connections_per_ip</code>, 64 par défaut) s’est déclenché, ou la limite de débit de
		connexion par seconde et par IP (<code>max_connections_per_sec_per_ip</code>) a refusé la rafale. Ces
		plafonds s’appliquent à chaque connexion — WebSocket comme HTTP simple.
	</p>
	<p>
		<strong>Correctif :</strong> Vérifiez et ajustez les paramètres. <code>max_connections_per_ip = 0</code>
		désactive le plafond par IP ; <code>max_connections_per_sec_per_ip = 0</code> désactive la limite de
		débit. Ces trois paramètres nécessitent un redémarrage.
	</p>

	<h3>Les connexions se coupent après un moment</h3>
	<p>
		<strong>Cause :</strong> Si <code>ws_idle_timeout_secs</code> est défini, les connexions inactives sont
		fermées. Les clients sains répondent au PING du relais par un PONG et restent connectés ; seuls les
		pairs morts sont supprimés.
	</p>
	<p>
		<strong>Correctif :</strong> C’est intentionnel — la valeur par défaut est de 300 secondes. Définissez
		<code>ws_idle_timeout_secs = 0</code> pour le désactiver entièrement.
	</p>

	<h3>Un abonnement se termine par <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Cause :</strong> Les événements stockés d’un REQ ont dépassé
		<code>max_req_response_bytes</code> (32 Mo par défaut). Cela n’arrive qu’avec des événements très
		volumineux ou des filtres très larges.
	</p>
	<p>
		<strong>Correctif :</strong> Restreignez le filtre (<code>since</code>/<code>until</code> plus serrés, un
		<code>limit</code> plus bas) ou augmentez <code>max_req_response_bytes</code> (0 désactive le budget).
	</p>

	<h3>Un NIP manque dans la liste <code>supported_nips</code> de NIP-11</h3>
	<p>
		<strong>Cause :</strong> La liste annoncée est dynamique — un NIP est masqué lorsque tous les kinds
		qu’il définit sont rejetés : ils sont tous dans <code>blocked_kinds</code>, aucun d’eux n’est dans
		<code>allowed_kinds</code>, ou ce sont des kinds éphémères rejetés par <code>reject_ephemeral</code>.
		NIP-29/43/66 exigent en outre <code>relay.private_key</code> et NIP-86 exige
		<code>rpc.management_token</code> ou <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Correctif :</strong> Vérifiez les listes d’accès actives — <code>listallowedkinds</code> de
		NIP-86 affiche la liste d’autorisation des kinds, et <code>GET /</code> affiche immédiatement le
		<code>supported_nips</code> effectif. Supprimez le kind bloquant ou le paramètre
		<code>reject_ephemeral</code>.
	</p>

	<h2 id="publishing">Erreurs lors de la publication</h2>
	<p>
		Lorsque la publication échoue, le 4e élément du message <code>OK</code> explique pourquoi. Les plus
		courants :
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Erreur</th>
				<th>Signification et correctif</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>La signature de l’événement est invalide (peut-être une clé client défectueuse).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					Le contenu dépasse <code>max_content_bytes</code> (64K caractères par défaut).
					Raccourcissez-le ou augmentez la limite.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>Plus de tags que <code>max_tags</code> (2000 par défaut).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Horodatage trop loin dans le futur (au-delà de <code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					Le contenu ou les tags contiennent une chaîne ressemblant à nsec.
					<strong>Ne publiez jamais de clés secrètes.</strong> Supprimez la chaîne et l’événement
					sera accepté.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>Le même événement est déjà stocké (normal).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>La clé publique est bannie (<code>banpubkey</code>) ou hors de la liste d’autorisation.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>Ce kind n’est pas autorisé.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					La clé publique a dépassé <code>max_events_per_min_per_pubkey</code> (fenêtre glissante de
					60 secondes). Attendez une minute et réessayez, ou augmentez/désactivez la limite.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>L’identifiant de l’événement est banni.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Republication d’un événement supprimé.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					L’authentification est requise (quand <code>relay.require_auth</code> est activé).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					Le compte a été créé il y a moins de <code>new_pubkey_min_age_secs</code>. Attendez et
					réessayez.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>Le groupe n’existe pas (créez-le d’abord).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					Le groupe est <code>closed</code> ; les demandes d’adhésion sans code d’invitation ne sont
					pas honorées.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Serveur de fichiers Blossom</h2>

	<h3>L’envoi échoue avec <code>401</code></h3>
	<p>L’événement d’autorisation d’envoi (kind 24242) a été rejeté. Vérifiez que :</p>
	<ul>
		<li>
			le tag <code>expiration</code> du token est <strong>présent</strong> et défini à un horodatage unix
			dans le futur,
		</li>
		<li>pour upload/media/delete, le token porte un tag <code>x</code> avec le sha256 du blob,</li>
		<li>
			le tag <code>server</code> (le cas échéant) nomme exactement le <code>blossom.host</code>
			configuré (nom d’hôte uniquement, sans schéma/chemin),
		</li>
		<li>le token a été signé au cours des 10 dernières minutes (fenêtre de fraîcheur contre le rejeu),</li>
		<li>et la clé de signature est bien celle de l’expéditeur.</li>
	</ul>

	<h3>L’envoi échoue avec <code>403</code></h3>
	<p>
		<code>blossom.restrict_uploads = true</code> est défini et la clé publique n’est pas sur la liste
		d’autorisation — ajoutez-la avec <code>nostrfy blossom allow npub1...</code> (le démon recharge
		automatiquement). Si la liste semble incorrecte, <code>nostrfy blossom list</code> l’affiche.
	</p>

	<h3>L’envoi échoue avec <code>409</code></h3>
	<p>
		Le client a envoyé un en-tête <code>X-SHA-256</code> qui ne correspond pas au corps réel de la requête
		(le hash déclaré a été calculé sur des octets différents — p. ex. le fichier a changé entre le hachage
		et l’envoi). Les clients peuvent omettre entièrement l’en-tête.
	</p>

	<h3><code>GET /</code> sur l’hôte média sert le document NIP-11</h3>
	<p>
		La requête n’a pas atteint le relais avec l’en-tête Blossom Host. Pointez
		<code>media.example.com</code> (ou la valeur définie pour <code>blossom.host</code>) vers le même port
		dans le proxy inverse, puis <code>nostrfy restart</code>.
	</p>

	<h3>Un blob renvoie 404 juste après l’envoi</h3>
	<p>
		Le fichier est adressé par son SHA-256 : récupérez-le via le hash exact renvoyé dans la réponse
		d’envoi (<code>/&lt;sha256&gt;</code> ou <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). Une discordance
		signifie que le client a demandé un hash différent des octets envoyés.
	</p>

	<h2 id="search-groups-auth">Recherche, groupes et authentification</h2>

	<h3>La recherche renvoie 0 résultat / des résultats inattendus</h3>
	<p>La recherche nostrfy correspond à des <strong>mots entiers</strong>. Notez que :</p>
	<ul>
		<li>
			<code>search = "rust"</code> correspond aux événements contenant le mot « rust », mais
			<code>"ru"</code> ne correspond PAS à « rust » comme sous-chaîne.
		</li>
		<li>Seuls les mots du contenu de l’événement sont recherchés.</li>
		<li>Si <code>search_index = false</code>, la recherche fonctionne toujours mais est plus lente.</li>
		<li>
			Si NIP-50 est désactivé (<code>disabled_nips = [50]</code>), <code>search</code> est ignoré
			(un NOTICE est envoyé).
		</li>
	</ul>

	<h3>Les métadonnées de groupe (39000-39005) ne sont pas générées</h3>
	<p>
		<strong>Cause :</strong> <code>relay.private_key</code> n’est pas défini. Les instantanés de groupe sont
		signés par la propre clé du relais, donc sans elle rien n’est généré.
	</p>
	<p><strong>Correctif :</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> rejette les événements de groupe</h3>
	<p>
		<strong>Cause :</strong> Le groupe n’existe pas. Dans NIP-29, les événements de modération et les
		demandes d’adhésion (9021) ne peuvent pas cibler un groupe avant sa création (kind 9007).
	</p>
	<p><strong>Correctif :</strong> Créez d’abord le groupe avec un événement 9007.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Cause :</strong> La modération (ajout de membres, etc.) exige un administrateur (un membre avec
		un rôle). Le créateur est administrateur.
	</p>
	<p><strong>Correctif :</strong> Demandez à un administrateur de vous accorder un rôle, ou créez votre propre groupe.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Cause :</strong> Le groupe est <code>closed</code> ; les demandes d’adhésion sans code
		d’invitation ne sont pas approuvées automatiquement.
	</p>
	<p><strong>Correctif :</strong> Demandez à un administrateur un code d’invitation (9009) et rejoignez avec un tag <code>code</code>.</p>

	<h3>Quitté accidentellement un groupe, ou le groupe n’a plus d’administrateurs</h3>
	<p>
		<strong>Cause :</strong> Les demandes de départ NIP-29 (kind 9022) sont honorées pour tout membre — y
		compris le dernier administrateur du groupe, qui ne laisse aucun administrateur derrière lui. Sans
		administrateur, plus personne ne peut envoyer d’événements de modération (9000/9001/9002/9008).
	</p>
	<p>
		<strong>Correctif :</strong> Signez un événement de modération avec la propre clé du relais
		(<code>relay.private_key</code>, la clé publique annoncée comme <code>self</code> de NIP-11). Selon
		NIP-29, les événements de modération peuvent venir de « la clé maîtresse du relais ou ... des
		administrateurs du groupe », donc le relais accepte la modération de groupe signée par sa propre clé
		même quand le groupe n’a pas d’administrateurs. Par exemple, restaurez un administrateur avec un
		<code>kind:9000</code> :
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Signez-le et publiez-le avec la clé du relais. Vous pouvez aussi supprimer le groupe avec un
		<code>kind:9008</code> signé par le relais (ses événements stockés sont purgés) puis le recréer avec
		<code>kind:9007</code>. Cette récupération exige que <code>relay.private_key</code> soit configuré.
	</p>

	<h3>Les événements protégés sont rejetés avec <code>auth-required</code></h3>
	<p>
		<strong>Cause :</strong> Les événements protégés NIP-70 (avec un tag <code>-</code>) ne peuvent être
		publiés que par l’auteur authentifié <strong>sur la même connexion</strong>.
	</p>
	<p><strong>Correctif :</strong> Activez l’authentification NIP-42 dans le client avant de publier.</p>

	<h3>AUTH (NIP-42) renvoie <code>false</code></h3>
	<p>Causes courantes :</p>
	<ol>
		<li>
			<code>relay.public_url</code> n’est pas défini ou est incorrect — le tag <code>relay</code> de
			l’événement AUTH ne correspond pas à l’URL du relais. Définissez <code>wss://...</code> et
			redémarrez.
		</li>
		<li>Challenge obsolète — vous avez envoyé AUTH sur une autre connexion, ou réutilisé un ancien challenge.</li>
		<li>
			L’horloge du client est décalée — le <code>created_at</code> de l’événement AUTH doit être à ±10
			minutes de l’heure actuelle.
		</li>
	</ol>

	<h3>L’API de gestion NIP-86 renvoie <code>401 unauthorized</code></h3>
	<p><strong>Cause :</strong> Identifiants manquants ou incorrects.</p>
	<p><strong>Correctif :</strong></p>
	<ul>
		<li>Définissez <code>management_token</code> et envoyez <code>Authorization: Bearer &lt;token&gt;</code>.</li>
		<li>
			Ou définissez <code>admin_pubkey</code> et envoyez un événement d’authentification NIP-98 (le tag
			<code>u</code> doit correspondre exactement à l’URL du relais ; un tag <code>payload</code> est
			requis).
		</li>
		<li>Si aucun des deux n’est défini, l’API de gestion est entièrement désactivée.</li>
	</ul>

	<h3>Les événements d’authentification NIP-98 sont rejetés pour un schéma ou un port différent</h3>
	<p>
		La spécification NIP-98 dit que le tag <code>u</code> doit être <em>exactement</em> identique à l’URL
		absolue de la requête, donc nostrfy dérive l’URL attendue de <code>relay.public_url</code> : son autorité
		plus le schéma HTTP mappé depuis le schéma WebSocket (<code>wss://</code> →
		<code>https://</code>, <code>ws://</code> → <code>http://</code>, <code>nostr+</code> retiré). Sans
		<code>public_url</code>, le relais attend le simple <code>http://host:port</code> qu’il sert. Un tag avec
		un autre schéma, un port différent/omis, ou un chemin ou une requête différents est rejeté — définissez
		<code>relay.public_url</code> à l’adresse publique que les clients signent. Chaque événement
		d’authentification est aussi à <strong>usage unique</strong> : rejouer le même en-tête
		<code>Authorization</code> pendant sa fenêtre de validité de 60 secondes est refusé.
	</p>

	<h2 id="db-disk">Base de données et disque</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Cause :</strong> Le plafond de la projection mémoire LMDB (1 To d’espace d’adressage virtuel
		par défaut ; l’utilisation réelle du disque croît avec les données) a été atteint — en pratique, la base
		de données est pleine.
	</p>
	<p><strong>Correctif :</strong> Augmentez <code>database.max_map_size</code> et redémarrez.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Cause :</strong> Moins de 32 Mo d’espace disque libre. Les écritures s’arrêtent (pour protéger
		les données) ; les lectures continuent.
	</p>
	<p>
		<strong>Correctif :</strong> Libérez de l’espace disque. Les écritures reprennent automatiquement une
		fois l’espace disponible. (<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> signale <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Cause :</strong> <code>database.map_size</code> est supérieur à <code>max_map_size</code>.
	</p>
	<p>
		<strong>Correctif :</strong> Définissez <code>map_size</code> à une valeur égale ou inférieure à
		<code>max_map_size</code> (les valeurs par défaut conviennent).
	</p>

	<h3>Vérifier la taille de la base de données</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Sauvegarder / déplacer la base de données</h3>
	<p>
		Toutes les données se trouvent dans le répertoire <code>database.path</code>.
		<strong>Arrêtez le relais avant de copier</strong> (copier une base de données active peut la
		corrompre).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Fonctionnement du démon</h2>

	<h3><code>nostrfy stats</code> indique <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Cause :</strong> Le fichier de statistiques n’existe pas — le démon n’est pas en cours
		d’exécution, ou il a démarré il y a moins de quelques secondes.
	</p>
	<p><strong>Correctif :</strong> Exécutez <code>nostrfy start</code>, attendez quelques secondes, puis réessayez.</p>

	<h3>Le journal grossit sans limite</h3>
	<p>
		<strong>Cause :</strong> <code>max_log_size_bytes</code> vaut 0 (rotation désactivée).
	</p>
	<p>
		<strong>Correctif :</strong> Définissez <code>max_log_size_bytes = 52428800</code> (50 Mo) et
		<code>max_log_files = 5</code>. La rotation est automatique.
	</p>

	<h3>Les modifications de la configuration ne prennent pas effet après le rechargement</h3>
	<p>
		<strong>Cause :</strong> Vous avez rechargé (SIGHUP) des paramètres fixés au démarrage :
		<code>private_key</code>, <code>api_host</code>, <code>metrics_enabled</code>, les paramètres LiveKit et
		les listes d’activation/désactivation des NIP.
	</p>
	<p>
		<strong>Correctif :</strong> Utilisez <code>nostrfy restart</code>. Le journal contient un avertissement
		« a restart is required » dans ce cas.
	</p>

	<h3>Le relais ne cesse de s’arrêter tout seul</h3>
	<p><strong>Cause :</strong> La machine a redémarré, ou le relais a manqué de mémoire (OOM).</p>
	<p><strong>Correctif :</strong></p>
	<ol>
		<li>Vérifiez la fin du journal : <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Vérifiez si la machine a redémarré : <code>uptime</code> (une disponibilité très courte signifie un
			redémarrage).
		</li>
		<li>Vérifiez la mémoire : <code>free -h</code>.</li>
		<li>Redémarrez le relais : <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Astuce">
		Pour démarrer nostrfy automatiquement au démarrage, enregistrez-le comme service systemd avec la commande
		de démarrage du relais comme <code>ExecStart</code>.
	</Callout>

	<h3>systemd ne peut pas démarrer le relais sur le port 80</h3>
	<p>
		Un service systemd exécuté en tant que root peut lier le port 80. Si vous définissez
		<code>User=</code> à un utilisateur ordinaire, utilisez soit un port plus élevé (p. ex. 8080), soit
		ajoutez <code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> à l’unité.
	</p>

	<h2 id="still-not-solved">Toujours pas résolu ?</h2>
	<ol>
		<li>
			<strong>Vérifiez le journal</strong> : <code>tail -100 nostrfy.log</code> — il nomme généralement la
			cause directe.
		</li>
		<li>
			<strong>Revalidez la configuration</strong> : <code>nostrfy check</code> — affiche les avertissements
			et les erreurs.
		</li>
		<li>
			<strong>Rassemblez les détails de reproduction</strong> : ce que vous faisiez, quel client, quelle
			erreur exacte.
		</li>
		<li>
			<strong>Demandez dans le dépôt du projet</strong> :
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — lors du dépôt
			d’un ticket, incluez les étapes de reproduction et le journal.
		</li>
	</ol>
</div>
