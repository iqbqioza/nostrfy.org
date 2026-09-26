<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const commonBlock = `# 1. Installez le dernier binaire de release (sudo inutile pour l’installation elle-même)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Récupérez le modèle de configuration et modifiez-le (aucun clone du dépôt requis)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # définissez name, public_url, private_key

# 3. Récupérez l’unité systemd et démarrez le service
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Ouvrez le port (généralement 8080) dans le pare-feu du fournisseur et vérifiez
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # requis pour NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # exécutez 'nostrfy genkey' et collez la clé`;
</script>

<DocsTitle
	title="Aperçu du déploiement"
	description="Comment nostrfy est distribué et comment le déployer — Fly.io, AWS, Google Cloud, Azure, DigitalOcean ou tout VPS, avec des notes sur TLS, systemd et les conteneurs."
/>

<div class="doc-body">
	<h2>Un seul binaire, plusieurs plateformes</h2>
	<p>
		nostrfy fournit des binaires précompilés pour <strong>x86_64</strong> et <strong>aarch64</strong> (artefacts de
		release GitHub, vérifiés par somme de contrôle via <code>install.sh</code>), une image conteneur qui
		<strong>télécharge ces binaires</strong> (aucune compilation requise), ainsi que des guides de déploiement pour les
		principales plateformes.
	</p>

	<h2>Plateformes</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Plateforme</th>
				<th>Type</th>
				<th>Guide</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Plateforme gérée (conteneurs, volumes, TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) ou App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail ou ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) ou Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM ou Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Tout VPS</strong></td>
				<td>Serveur Ubuntu/Debian standard</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Le modèle commun pour les VM</h2>
	<p>Tous les guides VM (Digital Ocean, AWS EC2, GCP, Azure, tout VPS) suivent le même modèle :</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Avant la mise en production</h2>
	<p>
		Chaque déploiement utilise les mêmes options <code>nostrfy.toml</code>. Avant la mise en production, définissez au minimum :
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM ou conteneur ?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong> : le plus simple, le moins cher, contrôle total. Recommandé pour la plupart
			des déploiements de relais.
		</li>
		<li>
			<strong>Conteneur</strong> : utilisez le <code>Dockerfile</code> du dépôt (télécharge le binaire de release
			au moment du build) sur Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run ou Azure Container
			Apps. Un stockage persistant est requis pour les données LMDB (<code>/data</code>).
		</li>
	</ul>

	<h2>Hébergeur média Blossom</h2>
	<p>
		Si <code>blossom.host</code> est défini, pointez également ce nom d’hôte vers le même port dans le proxy TLS
		(voir les blocs nginx/Caddy dans le <a href={p('/docs/deploy/vps/')}>guide VPS</a>).
	</p>

	<Callout type="warning" title="TLS est terminé par votre proxy ou le fournisseur">
		Le relais lui-même sert du WebSocket en clair sur le port 8080 et respecte X-Forwarded-Proto.
	</Callout>
</div>
