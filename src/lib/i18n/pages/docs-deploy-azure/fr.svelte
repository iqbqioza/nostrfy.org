<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const vpsCmd = `ssh <user>@<public-ip>
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
</script>

<DocsTitle
	title="Déployer sur Azure"
	description="Déployez nostrfy sur une VM Azure ou Azure Container Apps — étape par étape, avec systemd, TLS et les particularités des IP publiques dynamiques."
/>

<div class="doc-body">
	<p>
		Options : <strong>VM</strong> (recommandé) ou <strong>Container Apps</strong>.
	</p>

	<h2>Option 1 : Machine virtuelle (recommandé)</h2>
	<ol>
		<li>
			<strong>Créer une VM</strong> : Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 Go) ou
			<code>Standard_B2s</code> (2 Go) pour commencer. Choisissez une région proche de vos utilisateurs.
		</li>
		<li>
			<strong>Groupe de sécurité réseau (NSG)</strong> : ajoutez une règle entrante pour TCP <code>8080</code>
			(et <code>443</code> pour TLS). Restreignez la règle SSH à votre IP.
		</li>
		<li>
			<strong>Connectez-vous en SSH</strong> et suivez le <a href={p('/docs/deploy/vps/')}>guide VPS</a> générique :
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
			<a href={p('/docs/deploy/vps/')}>guide VPS</a>) ou avec une Application Gateway Azure et un certificat.
		</li>
	</ol>

	<Callout type="note" title="L’IP publique d’une VM Azure peut changer lors de la désallocation">
		Utilisez une <strong>IP publique statique</strong> pour que <code>relay.public_url</code> reste valide.
	</Callout>

	<h2>Option 2 : Azure Container Apps</h2>
	<p>
		Container Apps se construit à partir du <code>Dockerfile</code> du dépôt (qui télécharge le binaire
		release précompilé) :
	</p>
	<ol>
		<li>
			<strong>Créez une Container App</strong> depuis le dépôt GitHub (ou poussez l’image vers ACR).
		</li>
		<li>
			<strong>Port</strong> : définissez le port du conteneur sur <code>8080</code>.
		</li>
		<li>
			<strong>Mémoire</strong> : au moins 1 Go.
		</li>
		<li>
			<strong>Stockage persistant</strong> : montez un <strong>partage de fichiers Azure Storage</strong> sur
			<code>/data</code> pour les données LMDB.
		</li>
		<li>
			<strong>TLS</strong> : Container Apps fournit <code>https://</code> sur l’URL de l’app — définissez
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (ou un domaine personnalisé).
		</li>
	</ol>

	<Callout type="note" title="Un relais ne doit jamais retomber à zéro">
		Définissez <strong>min replicas = 1</strong>. Le fichier intégré <code>deploy/nostrfy.container.toml</code> peut
		être remplacé en montant votre propre <code>nostrfy.toml</code> sur <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
