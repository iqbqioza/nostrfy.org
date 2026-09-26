<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="Référence de configuration"
	description="Référence complète pour nostrfy.toml : chaque clé, son type, sa valeur par défaut et exactement ce qu’elle fait — limites, base de données, démon, contrôle d’accès et Blossom."
/>

<div class="doc-body">
	<h2>Bases</h2>
	<p>
		La configuration est un fichier <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a>, par
		défaut nommé <code>nostrfy.toml</code>. Créez-le avec <code>init</code> :
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Validez-le (recommandé avant chaque démarrage) :</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Chaque commande accepte <code>--config &lt;path&gt;</code> (par défaut <code>nostrfy.toml</code>).</p>
	<p>Syntaxe générale :</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Sections de configuration</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Section</th>
				<th>Objet</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>[relay]</code></td>
				<td>Identité, URLs et interrupteurs NIP</td>
			</tr>
			<tr>
				<td><code>[server]</code></td>
				<td>Liaison réseau, séparation API, métriques</td>
			</tr>
			<tr>
				<td><code>[rpc]</code></td>
				<td>RPC de gestion NIP-86 (auth, limite de corps)</td>
			</tr>
			<tr>
				<td><code>[limits]</code></td>
				<td>Toutes les limites et protections contre la surcharge</td>
			</tr>
			<tr>
				<td><code>[database]</code></td>
				<td>Stockage LMDB, index de recherche, plafonds de file</td>
			</tr>
			<tr>
				<td><code>[daemon]</code></td>
				<td>Fichiers PID, journal et statistiques, et rotation</td>
			</tr>
			<tr>
				<td><code>[access]</code></td>
				<td>Listes de contrôle d’accès initiales (modifiables à l’exécution)</td>
			</tr>
			<tr>
				<td><code>[blossom]</code></td>
				<td>Serveur de fichiers Blossom (hébergement média)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Chaque clé est optionnelle ; une clé manquante utilise sa valeur par défaut.</p>

	<h2>Section [relay] — identité du relais</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>name</code></td>
				<td>string</td>
				<td><code>"nostrfy"</code></td>
				<td>Nom du relais affiché aux clients via NIP-11</td>
			</tr>
			<tr>
				<td><code>description</code></td>
				<td>string</td>
				<td><code>"A minimal and stable Nostr relay"</code></td>
				<td>Description du relais (NIP-11)</td>
			</tr>
			<tr>
				<td><code>pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Clé publique de l’administrateur (champ pubkey NIP-11)</td>
			</tr>
			<tr>
				<td><code>contact</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URI de contact de l’administrateur (mailto: ou https://)</td>
			</tr>
			<tr>
				<td><code>icon</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL de l’image d’icône du relais</td>
			</tr>
			<tr>
				<td><code>post_policy</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL pointant vers la politique de publication du relais</td>
			</tr>
			<tr>
				<td><code>private_key</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Clé secrète propre au relais ; requise pour les groupes NIP-29</td>
			</tr>
			<tr>
				<td><code>public_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL publique, p. ex. wss://relay.example.com</td>
			</tr>
			<tr>
				<td><code>livekit_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL du serveur LiveKit pour les salons audio/vidéo NIP-29</td>
			</tr>
			<tr>
				<td><code>livekit_api_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Clé API LiveKit</td>
			</tr>
			<tr>
				<td><code>livekit_api_secret</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Secret API LiveKit (utilisé pour signer les JWT)</td>
			</tr>
			<tr>
				<td><code>enabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Liste d’autorisation NIP explicite</td>
			</tr>
			<tr>
				<td><code>disabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>NIPs à désactiver (ignoré quand enabled_nips est non vide)</td>
			</tr>
			<tr>
				<td><code>reject_ephemeral</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Rejeter les événements éphémères NIP-01 (kinds 20000–29999)</td>
			</tr>
			<tr>
				<td><code>enabled_git</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Accepter les événements git NIP-34 (kinds 1617–1633, 30617/30618)</td>
			</tr>
			<tr>
				<td><code>require_pow</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Preuve de travail requise en bits zéro initiaux</td>
			</tr>
			<tr>
				<td><code>new_pubkey_min_age_secs</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Refuser les événements des pubkeys plus jeunes que cette valeur (secondes ; 0 = désactivé)</td>
			</tr>
			<tr>
				<td><code>max_events_per_min_per_pubkey</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Limite de débit de publication par pubkey (par minute ; 0 = sans limite)</td>
			</tr>
			<tr>
				<td><code>max_groups</code></td>
				<td>integer</td>
				<td><code>1000</code></td>
				<td>Plafond du magasin de groupes NIP-29 en mémoire</td>
			</tr>
			<tr>
				<td><code>require_auth</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Exiger l’authentification NIP-42 pour REQ/EVENT/COUNT/NEG</td>
			</tr>
			<tr>
				<td><code>send_auth_challenge</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Envoyer le défi AUTH à la connexion</td>
			</tr>
			<tr>
				<td><code>enabled_nip78_auth</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Exiger AUTH NIP-42 avant d’accepter les événements kind 78/30078</td>
			</tr>
			<tr>
				<td><code>enabled_command_events</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Exécuter les commandes opérateur kind:1 rédigées par la pubkey admin</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Détails des clés</h3>
	<ul>
		<li>
			<strong>private_key</strong> — clé secrète propre au relais, utilisée pour signer les événements générés par le relais : métadonnées
			de groupes NIP-29 (39000–39005) et événements de rôles/membres NIP-43. Générez-la avec <code>nostrfy genkey</code> ; gardez-la
			secrète. Elle est lue une fois au démarrage, donc toute modification exige un redémarrage.
		</li>
		<li>
			<strong>public_url</strong> — utilisée pour valider les tags porteurs d’URL des clients : AUTH NIP-42, vanish NIP-62 et
			auth admin NIP-98. Quand elle est vide, le relais se replie sur <code>host:port</code>, qui ne correspond jamais à une vraie
			URL client lors de la liaison à <code>0.0.0.0</code> ou <code>127.0.0.1</code> (un avertissement est journalisé).
			<strong>Définissez-la toujours.</strong>
		</li>
		<li>
			<strong>enabled_nips vs disabled_nips</strong> — la liste d’autorisation l’emporte : quand <code>enabled_nips</code> est
			non vide, seuls ses NIPs sont annoncés et <code>disabled_nips</code> est ignoré. Les deux exigent un redémarrage.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — les kinds 20000–29999 sont rejetés, mais les kinds exemptés que les NIPs exigent de
			relayer sont toujours transmis : 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 et 21059. S’applique sur SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — opt-in NIP-34 : accepte les kinds 1617–1633 et 30617/30618 et annonce NIP-34.
			Désactivé par défaut car les charges de patch peuvent être volumineuses. S’applique sur SIGHUP.
		</li>
	</ul>

	<h2>Section [server] — paramètres serveur</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>"127.0.0.1"</code></td>
				<td>Adresse de liaison ; 0.0.0.0 accepte les connexions de partout</td>
			</tr>
			<tr>
				<td><code>port</code></td>
				<td>integer</td>
				<td><code>8080</code></td>
				<td>Port (1–65535) ; le port 80 exige root</td>
			</tr>
			<tr>
				<td><code>api_host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Nom d’hôte dédié à l’API REST</td>
			</tr>
			<tr>
				<td><code>metrics_enabled</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Servir les métriques Prometheus sur /metrics</td>
			</tr>
			<tr>
				<td><code>ws_paths</code></td>
				<td>string</td>
				<td><code>"root"</code></td>
				<td>Chemins des points de terminaison WebSocket : root, inbox-outbox ou all</td>
			</tr>
			<tr>
				<td><code>inbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Qui peut écrire sur /inbox : « any » ou « relay » (les événements doivent toujours porter un tag p)</td>
			</tr>
			<tr>
				<td><code>outbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Qui peut écrire sur /outbox : « any » (propres événements de la pubkey authentifiée NIP-42) ou « relay »</td>
			</tr>
			<tr>
				<td><code>trusted_proxies</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>Adresses/CIDRs de reverse-proxy dont le X-Forwarded-For est de confiance (vide = aucun proxy de confiance)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Détails des clés</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> lie toutes les interfaces IPv4 ; <code>127.0.0.1</code> est local uniquement.</li>
		<li><strong>port</strong> — 1–65535 ; le port 80 exige root. Ce port unique sert ensemble le relais WebSocket, le document NIP-11, l’API REST et le RPC NIP-86.</li>
		<li>
			<strong>api_host</strong> — dédie l’API REST à un seul nom d’hôte pour que l’API et le relais puissent partager un
			port derrière un reverse-proxy. Figé au démarrage — exige un redémarrage.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> sert uniquement /, <code>inbox-outbox</code> sert uniquement /inbox et
			/outbox, <code>all</code> sert les deux. Figé au démarrage — exige un redémarrage.
		</li>
		<li>
			<strong>trusted_proxies</strong> — listez uniquement les propres adresses du proxy (loopback pour nginx/Caddy sur le même
			hôte, plage source de l’équilibreur dans le cloud). Si défini, l’IP client est dérivée de la dernière entrée
			<code>X-Forwarded-For</code> non de confiance pour les plafonds par IP, la limite de débit, <code>blockip</code> et les logs. N’ajoutez jamais
			une adresse joignable directement par les clients — ils pourraient falsifier l’en-tête et contourner les limites par IP.
			Figé au démarrage — exige un redémarrage.
		</li>
	</ul>

	<h2>Section [rpc] — gestion NIP-86</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>management_token</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Jeton Bearer pour les API de gestion</td>
			</tr>
			<tr>
				<td><code>admin_pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Pubkey administrateur pour l’auth de gestion NIP-98</td>
			</tr>
			<tr>
				<td><code>max_admin_body_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Limite de corps pour le RPC de gestion NIP-86</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Le RPC NIP-86 est monté sur les routes publiques <code>POST /</code> du relais — il n’y a pas de port de gestion séparé.
		<code>management_token</code> et <code>admin_pubkey</code> apparaissent parfois sous <code>[server]</code>
		dans les anciens guides ; ces orthographes sont des alias historiques de ces clés <code>[rpc]</code>.
	</p>

	<h2>Section [limits] — limites et protections</h2>
	<h3>Connexions et messages</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_connections</code></td>
				<td>integer</td>
				<td><code>10000</code></td>
				<td>Connexions simultanées maximales</td>
			</tr>
			<tr>
				<td><code>max_connections_per_ip</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Max. de connexions par IP source</td>
			</tr>
			<tr>
				<td><code>max_ws_message_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Max. d’octets par message/frame WebSocket</td>
			</tr>
			<tr>
				<td><code>socket_recv_buffer_kb</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Tampon de réception noyau par connexion (Kio)</td>
			</tr>
			<tr>
				<td><code>max_out_queue_bytes</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Plafond de file sortante par connexion (octets)</td>
			</tr>
			<tr>
				<td><code>ws_idle_timeout_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>Fermer les connexions inactives après ce délai</td>
			</tr>
			<tr>
				<td><code>http_read_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>Délai d’en-tête de requête HTTP (défense slow-loris)</td>
			</tr>
			<tr>
				<td><code>max_connections_per_sec_per_ip</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Max. de nouvelles connexions par seconde par IP source</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Abonnements et requêtes</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_filters</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Max. de filtres par REQ</td>
			</tr>
			<tr>
				<td><code>max_subscriptions</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Max. d’abonnements par connexion</td>
			</tr>
			<tr>
				<td><code>max_limit</code></td>
				<td>integer</td>
				<td><code>500</code></td>
				<td>Plafond pour la limite REQ</td>
			</tr>
			<tr>
				<td><code>max_count</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Plafond pour les résultats COUNT</td>
			</tr>
			<tr>
				<td><code>max_sub_id_len</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Longueur max. d’id d’abonnement (caractères, pas octets)</td>
			</tr>
			<tr>
				<td><code>max_sub_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Total d’octets de filtres d’abonnement par connexion</td>
			</tr>
			<tr>
				<td><code>max_req_response_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 Mo)</td>
				<td>Plafond pour le total d’octets qu’une seule réponse REQ peut envoyer</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Événements</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_content_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Longueur max. du contenu d’événement en caractères</td>
			</tr>
			<tr>
				<td><code>max_tags</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Max. de tags par événement</td>
			</tr>
			<tr>
				<td><code>max_tag_value_bytes</code></td>
				<td>integer</td>
				<td><code>1024</code></td>
				<td>Max. d’octets par valeur de tag</td>
			</tr>
			<tr>
				<td><code>max_created_at_future_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Écart futur toléré de created_at</td>
			</tr>
			<tr>
				<td><code>group_late_publish_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Retard toléré pour les événements admin de groupes NIP-29 (secondes)</td>
			</tr>
			<tr>
				<td><code>max_neg_items</code></td>
				<td>integer</td>
				<td><code>100000</code></td>
				<td>Max. d’enregistrements par synchronisation negentropy NIP-77</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Alias historiques : <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> et
		<code>limits.max_indexed_words</code> sont toujours acceptés comme alias de <code>relay.require_pow</code>,
		<code>relay.new_pubkey_min_age_secs</code> et <code>database.max_indexed_words</code>.
	</p>
	<h3>API REST</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_api_concurrent</code></td>
				<td>integer</td>
				<td><code>8</code></td>
				<td>Max. de requêtes /api/v1 simultanées</td>
			</tr>
			<tr>
				<td><code>max_api_limit</code></td>
				<td>integer</td>
				<td><code>5000</code></td>
				<td>Plafond pour le paramètre limit de l’API</td>
			</tr>
			<tr>
				<td><code>max_api_offset</code></td>
				<td>integer</td>
				<td><code>50000</code></td>
				<td>Plafond pour le paramètre offset de l’API</td>
			</tr>
			<tr>
				<td><code>max_api_fetch</code></td>
				<td>integer</td>
				<td><code>55001</code></td>
				<td>Fenêtre de sur-récupération max. pour les requêtes offset — doit couvrir max_api_offset + max_api_limit + 1 (0 = sans borne)</td>
			</tr>
			<tr>
				<td><code>max_api_search_bytes</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Max. d’octets du paramètre search de l’API</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Diffusion live</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>live_batch_interval_ms</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Fréquence de vidage des événements live (ms)</td>
			</tr>
			<tr>
				<td><code>live_batch_size</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Max. d’événements par lot live</td>
			</tr>
			<tr>
				<td><code>live_buffer</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Taille de la file de diffusion live</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Section [database] — base de données</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>path</code></td>
				<td>string</td>
				<td><code>"./data"</code></td>
				<td>Répertoire de la base de données (LMDB)</td>
			</tr>
			<tr>
				<td><code>max_dbs</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Max. de bases nommées LMDB</td>
			</tr>
			<tr>
				<td><code>max_readers</code></td>
				<td>integer</td>
				<td><code>128</code></td>
				<td>Max. de lecteurs simultanés LMDB</td>
			</tr>
			<tr>
				<td><code>map_size</code></td>
				<td>integer</td>
				<td><code>1073741824</code> (1 Go)</td>
				<td>Plancher pour la taille du memory map (octets)</td>
			</tr>
			<tr>
				<td><code>max_map_size</code></td>
				<td>integer</td>
				<td><code>1099511627776</code> (1 TB)</td>
				<td>Plafond du memory-map (octets)</td>
			</tr>
			<tr>
				<td><code>purge_interval_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>Intervalle de purge NIP-40 (secondes)</td>
			</tr>
			<tr>
				<td><code>search_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Activer l’index de mots NIP-50</td>
			</tr>
			<tr>
				<td><code>reader_threads</code></td>
				<td>integer</td>
				<td><code>2</code></td>
				<td>Threads de scan dédiés</td>
			</tr>
			<tr>
				<td><code>max_indexed_words</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Mots du contenu de chaque événement indexés pour la recherche</td>
			</tr>
			<tr>
				<td><code>meta_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Écrire l’en-tête de métadonnées par événement utilisé par le préfiltre de scan</td>
			</tr>
			<tr>
				<td><code>disabled_fsync</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Ignorer le vidage disque synchrone après chaque lot d’écriture</td>
			</tr>
			<tr>
				<td><code>db_buffer_size</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Tampon WebSocket initial par connexion (octets)</td>
			</tr>
			<tr>
				<td><code>db_request_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>Durée d’attente possible d’une requête base avant échec</td>
			</tr>
			<tr>
				<td><code>max_db_queue_msgs</code></td>
				<td>integer</td>
				<td><code>4096</code></td>
				<td>Max. de messages en attente avant échec rapide</td>
			</tr>
			<tr>
				<td><code>max_db_queue_events</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Max. d’événements dans les lots en attente avant échec rapide</td>
			</tr>
			<tr>
				<td><code>max_db_queue_bytes</code></td>
				<td>integer</td>
				<td><code>268435456</code> (256 MiB)</td>
				<td>Max. d’octets de requêtes base en file avant échec rapide (0 = sans plafond d’octets)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Détails des clés</h3>
	<ul>
		<li>
			<strong>map_size</strong> — le plancher pour le memory map : la map est toujours ouverte au moins à cette taille.
		</li>
		<li>
			<strong>max_map_size</strong> — le plafond, ouvert comme réservation virtuelle éparse : le disque physique ne croît qu’avec
			les données réellement écrites. Augmentez-le en cas de <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — la recherche fonctionne toujours (correspondance de mots entiers dans le contenu) mais les scans
			sont plus lents ; sur un petit VPS cela divise la base par deux. Recommandé sur les petites instances.
		</li>
		<li>
			<strong>disabled_fsync</strong> — échange la durabilité contre le débit : les écritures sont validées dans le cache de pages OS et
			une coupure de courant peut perdre les écritures les plus récentes.
		</li>
	</ul>

	<h2>Section [daemon] — démon</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>pid_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.pid"</code></td>
				<td>Chemin du fichier PID</td>
			</tr>
			<tr>
				<td><code>log_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.log"</code></td>
				<td>Chemin du fichier log</td>
			</tr>
			<tr>
				<td><code>stats_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.stats.json"</code></td>
				<td>Chemin du fichier de statistiques</td>
			</tr>
			<tr>
				<td><code>stats_interval_secs</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Intervalle d’écriture des statistiques (secondes)</td>
			</tr>
			<tr>
				<td><code>max_log_size_bytes</code></td>
				<td>integer</td>
				<td><code>52428800</code> (50 Mo)</td>
				<td>Taille de rotation des logs (0 = sans rotation)</td>
			</tr>
			<tr>
				<td><code>max_log_files</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Générations de logs pivotés à conserver</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Les chemins sont résolus par rapport au répertoire du fichier de configuration, donc ils restent valides après que le démon change son répertoire de travail.</p>

	<h2>Section [access] — contrôle d’accès</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>restrict_relay</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Seules les pubkeys autorisées peuvent publier</td>
			</tr>
			<tr>
				<td><code>blocked_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Kinds à rejeter</td>
			</tr>
			<tr>
				<td><code>allowed_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Liste d’autorisation de kinds ; seuls ces kinds sont acceptés quand elle est non vide</td>
			</tr>
			<tr>
				<td><code>blocked_ips</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>Adresses IP refusées au moment de la connexion</td>
			</tr>
			<tr>
				<td><code>method_grants</code></td>
				<td>table: pubkey → array of strings</td>
				<td><code>&#123;&#125;</code></td>
				<td>Octrois de méthodes NIP-86 pour les pubkeys non-admin (gérés à l’exécution avec <code>assignmethod</code>)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Les listes d’autorisation/refus de pubkeys ne sont <strong>pas</strong> des clés de config — elles vivent dans la base du relais (LMDB) et sont
		gérées à l’exécution :
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — seules les pubkeys autorisées peuvent <strong>publier</strong>, tandis que
			la lecture reste ouverte à tous (tout client peut toujours s’abonner et récupérer).
		</li>
		<li>Une pubkey refusée est toujours rejetée à la publication et jamais servie à la lecture.</li>
		<li>
			<strong>method_grants</strong> — octrois de méthodes NIP-86 pour les pubkeys non-admin (pubkey → noms de méthodes, p. ex. un
			modérateur autorisé avec <code>banevent</code> et <code>listbannedevents</code>). Initialisés depuis la config au
			premier lancement, puis gérés à l’exécution avec NIP-86 <code>assignmethod</code>/<code>unassignmethod</code>
			(inspectés avec <code>listmethodassignees</code>). Seules les méthodes de modération et de lecture sont octroyables —
			la gestion des permissions, rôles, revendications d’invitation et identité du relais reste réservée à l’admin, et une pubkey bannie est
			refusée même avec des octrois. Voir l'
			<a href={p('/docs/management/')}>API de gestion</a>.
		</li>
	</ul>

	<h2>Section [blossom] — serveur de fichiers Blossom</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Clé</th>
				<th>Type</th>
				<th>Défaut</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Nom d’hôte pour le serveur Blossom (vide = désactivé)</td>
			</tr>
			<tr>
				<td><code>storage</code></td>
				<td>string</td>
				<td><code>"local"</code></td>
				<td>Backend : « local » (local_path) ou « s3 » (bucket compatible S3)</td>
			</tr>
			<tr>
				<td><code>local_path</code></td>
				<td>string</td>
				<td><code>"/var/lib/nostrfy/images"</code></td>
				<td>Racine de stockage local pour les fichiers média</td>
			</tr>
			<tr>
				<td><code>max_upload_bytes</code></td>
				<td>integer</td>
				<td><code>20971520</code> (20 Mo)</td>
				<td>Taille max. de fichier média</td>
			</tr>
			<tr>
				<td><code>min_free_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 Mo)</td>
				<td>Espace disque sous lequel les téléversements sont refusés</td>
			</tr>
			<tr>
				<td><code>s3_endpoint</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Point de terminaison compatible S3 (p. ex. R2)</td>
			</tr>
			<tr>
				<td><code>s3_region</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Région S3 (R2 utilise « auto »)</td>
			</tr>
			<tr>
				<td><code>s3_bucket</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Nom du bucket S3</td>
			</tr>
			<tr>
				<td><code>s3_access_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Clé d’accès S3</td>
			</tr>
			<tr>
				<td><code>s3_secret_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Clé secrète S3</td>
			</tr>
			<tr>
				<td><code>restrict_uploads</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Seules les pubkeys autorisées peuvent téléverser</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Rechargement à l’exécution (SIGHUP)</h2>
	<p>
		Modifier le fichier et envoyer <code>kill -HUP $(cat nostrfy.pid)</code> recharge la configuration <strong>sans
		redémarrage</strong>. La plupart des réglages prennent effet immédiatement ; quelques-uns sont figés au démarrage :
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>S’applique sur SIGHUP</th>
				<th>Exige un redémarrage</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td>
				<td>relay.private_key</td>
			</tr>
			<tr>
				<td>reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>relay.livekit_*, enabled_nips / disabled_nips</td>
			</tr>
			<tr>
				<td>la plupart des limites</td>
				<td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, tailles du démon, plafonds de limites, blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] n’est pas appliqué par un rechargement — les listes sont initialisées une fois au démarrage puis gérées à l’exécution via NIP-86.
		Le log avertit quand un réglage exigeant un redémarrage a changé, et quelques réglages capturés au démarrage ne sont pas vérifiés par le
		rechargement.
	</p>

	<Callout type="warning" title="Erreurs fréquentes">
				<div class="overflow-x-auto">
			<table>
			<thead>
				<tr>
					<th>Erreur</th>
					<th>Correctif</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>public_url non défini</td>
					<td>définissez <code>wss://...</code></td>
				</tr>
				<tr>
					<td>host laissé à 127.0.0.1</td>
					<td>les clients externes ne peuvent pas se connecter</td>
				</tr>
				<tr>
					<td>private_key non définie avec NIP-29</td>
					<td>exécutez <code>nostrfy genkey</code> + redémarrage</td>
				</tr>
				<tr>
					<td>restrict_relay true avec allowlist vide</td>
					<td>tout le monde est verrouillé</td>
				</tr>
				<tr>
					<td>clés exigeant un redémarrage modifiées avec seulement un SIGHUP</td>
					<td>utilisez <code>nostrfy restart</code></td>
				</tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
