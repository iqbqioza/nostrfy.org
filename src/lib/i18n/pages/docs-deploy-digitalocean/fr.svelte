<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # définissez name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Déployer sur DigitalOcean"
	description="Déployez nostrfy sur un Droplet DigitalOcean ou sur App Platform — étape par étape, avec systemd, TLS et une configuration prête pour la production."
/>

<div class="doc-body">
	<p>
		Deux options : un <strong>Droplet</strong> (VM, le plus simple) ou <strong>App Platform</strong>
		(conteneurs).
	</p>

	<h2>Option 1 : Droplet (recommandé)</h2>
	<ol>
		<li>
			<strong>Créer un Droplet</strong> : Ubuntu 24.04 LTS, n’importe quelle taille (1 Go de RAM suffit
			pour commencer). Un Droplet dans une région proche de vos utilisateurs réduit la latence.
		</li>
		<li>
			<strong>Connectez-vous en SSH</strong> et suivez le
			<a href={p('/docs/deploy/vps/')}>guide VPS générique</a> :
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Ouvrez le port</strong> dans le pare-feu du Droplet (le
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>
			est recommandé) : autorisez le TCP entrant <code>8080</code> (et <code>443</code> si vous ajoutez
			TLS).
		</li>
		<li>
			<strong>Vérifiez</strong> :
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Ajoutez TLS (<code>wss://</code>)</strong> avec certbot + nginx, ou
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				l’équilibreur de charge managé de DigitalOcean</a
			>
			avec un certificat — puis définissez <code>relay.public_url = "wss://relay.example.com"</code> et
			redémarrez.
		</li>
	</ol>

	<h2>Option 2 : App Platform (conteneur)</h2>
	<p>
		App Platform construit à partir du <code>Dockerfile</code> du dépôt (qui télécharge le binaire de
		release précompilé) :
	</p>
	<ol>
		<li><strong>Connectez votre dépôt GitHub</strong> et créez une app à partir de celui-ci.</li>
		<li>
			<strong>Port</strong> : définissez le port HTTP sur <code>8080</code> (le relais y écoute).
		</li>
		<li>
			<strong>Disque persistant</strong> : montez un volume sur <code>/data</code> (les données LMDB y
			résident — sans lui, les données sont perdues à chaque déploiement).
		</li>
		<li>
			<strong>Env</strong> : le fichier <code>deploy/nostrfy.container.toml</code> intégré à l’image peut
			être remplacé en montant votre propre configuration sur <code>/etc/nostrfy/nostrfy.toml</code> (créez
			un fork qui le copie, ou utilisez un <code>COPY</code> dans le Dockerfile de votre propre dépôt).
		</li>
		<li>
			<strong>TLS</strong> : App Platform fournit <code>https://</code> automatiquement pour le domaine de
			l’app — définissez <code>relay.public_url</code> en conséquence.
		</li>
	</ol>

	<h2>Les deux options</h2>
	<ul>
		<li>
			Mises à jour : réexécutez <code>install.sh</code> + <code>systemctl restart nostrfy</code>
			(Droplet), ou poussez vers le dépôt connecté (App Platform).
		</li>
		<li>
			Toute la configuration est documentée dans la
			<a href={p('/docs/configuration/')}>référence de configuration</a>.
		</li>
	</ul>
</div>
