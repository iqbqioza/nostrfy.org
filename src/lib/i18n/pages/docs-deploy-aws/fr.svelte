<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # Sous Ubuntu : ubuntu@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # définissez name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="Déployer sur AWS"
	description="Déployez nostrfy sur AWS EC2, Lightsail ou ECS/Fargate — étape par étape, avec systemd, TLS derrière un reverse proxy et une liste de contrôle production."
/>

<div class="doc-body">
	<p>
		Options : <strong>EC2</strong> (VM, recommandé), <strong>Lightsail</strong> (VM plus simple) ou
		<strong>ECS/Fargate</strong> (conteneurs).
	</p>

	<h2>Option 1 : EC2 (recommandé)</h2>
	<ol>
		<li>
			<strong>Lancez une instance</strong> : Amazon Linux 2023 ou Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 Go de RAM) suffit pour commencer. Choisissez une région proche de vos utilisateurs.
		</li>
		<li>
			<strong>Groupe de sécurité</strong> : autorisez le TCP entrant <code>8080</code> (et <code>443</code> pour
			TLS). Limitez la règle SSH à votre IP.
		</li>
		<li>
			<strong>Connectez-vous en SSH</strong> et suivez le <a href={p('/docs/deploy/vps/')}>guide VPS générique</a> :
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Vérifiez</strong> :
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Ajoutez TLS (<code>wss://</code>)</strong> avec certbot + nginx (comme dans le
			<a href={p('/docs/deploy/vps/')}>guide VPS</a>) ou avec un Application/Network Load Balancer et un certificat ACM
			— puis définissez <code>relay.public_url</code> et redémarrez.
		</li>
	</ol>

	<h2>Option 2 : Lightsail</h2>
	<p>
		Les instances Lightsail fonctionnent exactement comme le guide EC2 — l’onglet <strong>réseau</strong> contient les
		règles de pare-feu : ouvrez le TCP <code>8080</code>.
	</p>

	<h2>Option 3 : ECS / Fargate (conteneur)</h2>
	<p>
		Le <code>Dockerfile</code> du dépôt télécharge le binaire de release précompilé au moment du build :
	</p>
	<ol>
		<li>
			Poussez l’image vers ECR :
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Créez un service ECS (Fargate, 1 tâche) avec un <strong>volume EFS monté sur
			<code>/data</code></strong> (persistance LMDB — sans lui, les données sont perdues lors des redéploiements).
		</li>
		<li>
			Exposez le port <code>8080</code> ; placez devant un ALB + certificat ACM pour TLS.
		</li>
		<li>
			La config intégrée <code>deploy/nostrfy.container.toml</code> peut être remplacée en montant votre propre
			<code>nostrfy.toml</code> sur <code>/etc/nostrfy/nostrfy.toml</code> (p. ex. un fork qui le copie dans l’image).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Attachez une <strong>Elastic IP</strong> à l’instance si vous l’arrêtez/redémarrez — sinon l’IP publique
		change et <code>public_url</code> casse.
	</p>

	<Callout type="note" title="TLS est terminé par votre proxy ou le fournisseur">
		Le relais lui-même sert du WebSocket en clair sur 8080 et respecte X-Forwarded-Proto.
	</Callout>
</div>
