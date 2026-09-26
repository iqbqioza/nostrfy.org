<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # définissez name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Déployer sur Google Cloud"
	description="Déployez nostrfy sur Google Cloud Compute Engine ou Cloud Run — étape par étape, avec systemd, TLS et les réserves sur la mise à l’échelle à zéro."
/>

<div class="doc-body">
	<p>
		Options : <strong>Compute Engine</strong> (VM, recommandé) ou <strong>Cloud Run</strong>
		(conteneurs).
	</p>

	<h2>Option 1 : Compute Engine (recommandé)</h2>
	<ol>
		<li>
			<strong>Créer une VM</strong> : Ubuntu 24.04 LTS (ou Debian), <code>e2-small</code> (2 Go)
			suffit pour commencer. Choisissez une région proche de vos utilisateurs.
		</li>
		<li>
			<strong>Règle de pare-feu</strong> : autoriser le TCP entrant <code>8080</code> (et
			<code>443</code> pour TLS). Sous <strong>Réseau → Pare-feu</strong>, créez une règle avec les
			tags cibles attribués à la VM.
		</li>
		<li>
			<strong>Connectez-vous en SSH</strong> (le bouton SSH de la console fonctionne) et suivez le
			<a href={p('/docs/deploy/vps/')}>guide VPS</a> générique :
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Réservez une IP statique</strong> (IP externe → Réserver) pour que
			<code>public_url</code> reste valide après les redémarrages.
		</li>
		<li>
			<strong>Vérifiez</strong> :
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>Ajoutez TLS (<code>wss://</code>)</strong> avec certbot + nginx (comme dans le
			<a href={p('/docs/deploy/vps/')}>guide VPS</a>) ou un équilibreur de charge GCP avec un
			certificat géré.
		</li>
	</ol>

	<h2>Option 2 : Cloud Run (conteneur)</h2>
	<p>
		Cloud Run construit à partir du <code>Dockerfile</code> du dépôt (qui télécharge le binaire
		précompilé de la release) :
	</p>
	<ol>
		<li>
			<strong>Créez un service depuis le dépôt GitHub</strong> (ou poussez l’image vers Artifact
			Registry).
		</li>
		<li>
			<strong>Port</strong> : définissez le port du conteneur sur <code>8080</code>.
		</li>
		<li>
			<strong>Allouez de la mémoire</strong> : au moins 512 Mo (LMDB + runtime asynchrone).
		</li>
		<li>
			<strong>Stockage persistant</strong> : attachez un <strong>volume Cloud Run (filestore/gcsfuse)</strong>
			sur <code>/data</code> — LMDB a besoin d’un système de fichiers, donc un montage GCS FUSE sur
			<code>/data</code> convient pour la persistance.
		</li>
		<li>
			<strong>TLS</strong> : Cloud Run fournit <code>https://</code> automatiquement — définissez
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (ou votre domaine personnalisé).
		</li>
	</ol>

	<Callout type="note" title="Cloud Run passe à zéro par défaut">
		Pour un relais, définissez <strong>min instances = 1</strong> pour qu’il ne refroidisse jamais. Le
		fichier <code>deploy/nostrfy.container.toml</code> intégré à l’image peut être remplacé en montant
		votre propre <code>nostrfy.toml</code> sur <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
