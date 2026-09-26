<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # affiché dans les clients via NIP-11
description = "A friendly relay for everyone"
private_key = "..."                            # requis pour les groupes NIP-29
public_url = "wss://<your-app-name>.fly.dev"   # requis pour NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# ligne de journal : "relay listening on ws://0.0.0.0:8080"
fly logs

# document d’information NIP-11 via l’adresse publique
curl https://<your-app-name>.fly.dev/

# pointez votre client Nostr vers wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="Déployer sur Fly.io"
	description="Déployez nostrfy sur Fly.io en quelques minutes avec le modèle prêt à l’emploi — volumes, machines, terminaison TLS et mises à jour simples."
/>

<div class="doc-body">
	<h2>Contenu du dépôt</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Fichier</th>
				<th>Rôle</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Image conteneur — <strong>télécharge le binaire de release précompilé</strong> depuis les assets GitHub (x86_64 / aarch64, selon l’architecture de build) et vérifie sa somme sha256. Aucune compilation n’a lieu sur Fly
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Configuration de l’app Fly : service HTTP sur le port 8080, contrôles de santé, montage du volume <code>/data</code>, machines toujours actives
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					La configuration du relais intégrée à l’image sous <code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Prérequis</h2>
	<ul>
		<li>Un compte Fly.io</li>
		<li>La CLI flyctl (<code>fly version</code>)</li>
		<li>Connecté : <code>fly auth login</code></li>
	</ul>

	<h2>Déploiement en quatre étapes</h2>

	<h3>1. Créer l’app (sans déployer pour l’instant)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> doit être unique sur Fly (il fait partie de l’URL du relais :
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code> : p. ex. <code>nrt</code> (Tokyo), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — choisissez la région la plus proche de vos utilisateurs
		</li>
		<li>
			Cela peut écraser les valeurs <code>fly.toml</code> du modèle (nom d’app, région) — ce n’est pas grave
		</li>
	</ul>

	<h3>2. Créer le volume persistant</h3>
	<p>La base LMDB réside sur un volume Fly monté sur <code>/data</code> :</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 Go suffit pour commencer (la base grandit avec l’usage). Vous pouvez redimensionner plus tard, ou créer dès le départ un volume plus grand.
	</p>

	<h3>3. Configurer le relais</h3>
	<p>Modifiez <code>deploy/nostrfy.container.toml</code> avant de déployer :</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code> : générez localement avec <code>nostrfy genkey</code> (avec une config temporaire) et collez la clé, ou générez-en une avec n’importe quel outil Nostr
		</li>
		<li>
			<code>public_url</code> <strong>doit</strong> correspondre à votre nom d’app — sans elle, NIP-42 AUTH, NIP-62 vanish et l’API de gestion NIP-86 ne fonctionneront pas
		</li>
		<li>Tout le reste peut rester par défaut</li>
	</ul>

	<h3>4. Déployer</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly construit l’image (quelques minutes — le téléchargement du binaire est rapide, l’image est petite), crée une machine et exécute le contrôle de santé contre <code>/health</code>.
	</p>

	<h2>Vérifier</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Mise à l’échelle et mises à jour</h2>
	<ul>
		<li>
			<strong>Mettre à jour le relais</strong> : modifiez <code>deploy/nostrfy.container.toml</code> et relancez <code>fly deploy</code> — l’image télécharge toujours le <strong>dernier</strong> binaire de release GitHub, une mise à jour est donc un simple redéploiement
		</li>
		<li>
			<strong>Épingler une version</strong> : <code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> ou modifiez l'<code>ARG</code> dans le Dockerfile
		</li>
		<li>
			<strong>Mise à l’échelle</strong> : le relais est une machine unique par défaut. <code>fly machines clone &lt;id&gt;</code> crée une seconde machine ; les deux partagent le volume (les volumes Fly supportent plusieurs machines dans la même région)
		</li>
		<li>
			<strong>Métriques</strong> : Fly collecte l’endpoint <code>/metrics</code> (voir <code>[metrics]</code> dans <code>fly.toml</code>) et l’affiche dans le tableau de bord Fly sous Metrics
		</li>
	</ul>

	<h2>Personnaliser la configuration</h2>
	<p>
		L’image lit <code>/etc/nostrfy/nostrfy.toml</code>, intégré depuis <code>deploy/nostrfy.container.toml</code>. Deux façons de personnaliser :
	</p>
	<ol>
		<li>
			<strong>Modifiez <code>deploy/nostrfy.container.toml</code> dans le dépôt</strong> et redéployez (le plus simple)
		</li>
		<li>
			<strong>Montez votre propre config</strong> : construisez un fork de l’image qui copie votre fichier de config par-dessus <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>Chaque option est documentée dans la <a href={p('/docs/configuration/')}>référence de configuration</a>.</p>

	<h2>Remarques</h2>
	<ul>
		<li>
			<strong>Toujours actif par conception</strong> : <code>auto_stop_machines = false</code> dans <code>fly.toml</code> — un relais ne doit jamais être arrêté pendant les périodes d’inactivité
		</li>
		<li>
			Le conteneur exécute le relais en <strong>mode avant-plan</strong> (<code>nostrfy start --foreground</code>) ; les logs vont vers stdout/stderr et sont collectés par Fly
		</li>
		<li>
			TLS est terminé par Fly ; le relais lui-même sert du WebSocket en clair sur le port 8080
		</li>
		<li>
			<strong>Hôte média Blossom</strong> : pour servir aussi le serveur Blossom, définissez <code>blossom.host = "media.example.com"</code> dans la config, ajoutez <code>media.example.com</code> comme <strong>nom d’hôte supplémentaire</strong> de la même app Fly (<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> ou <code>fly hostnames</code>), et ajoutez le certificat TLS <code>media.</code> dans le tableau de bord Fly — le relais sépare les hôtes en interne (comme <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS est terminé par Fly">
		Le relais lui-même sert du WebSocket en clair sur le port 8080.
	</Callout>
</div>
