<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # imposta name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="Distribuzione su Azure"
	description="Distribuisci nostrfy su una VM di Azure o su Azure Container Apps — passo dopo passo, con systemd, TLS e le avvertenze degli IP pubblici dinamici."
/>

<div class="doc-body">
	<p>
		Opzioni: <strong>VM</strong> (consigliata) oppure <strong>Container Apps</strong>.
	</p>

	<h2>Opzione 1: Macchina virtuale (consigliata)</h2>
	<ol>
		<li>
			<strong>Crea una VM</strong>: Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 GB) oppure
			<code>Standard_B2s</code> (2 GB) per iniziare. Scegli una regione vicina ai tuoi utenti.
		</li>
		<li>
			<strong>Gruppo di sicurezza di rete (NSG)</strong>: aggiungi una regola in ingresso per TCP <code>8080</code>
			(e <code>443</code> per TLS). Limita la regola SSH al tuo IP.
		</li>
		<li>
			<strong>Connettiti via SSH</strong> e segui la <a href={p('/docs/deploy/vps/')}>guida VPS</a> generica:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Verifica</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Aggiungi TLS (<code>wss://</code>)</strong> con certbot + nginx (come nella
			<a href={p('/docs/deploy/vps/')}>guida VPS</a>) oppure con un Application Gateway di Azure con certificato.
		</li>
	</ol>

	<Callout type="note" title="L’IP pubblico di una VM di Azure può cambiare alla deallocazione">
		Usa un <strong>IP pubblico statico</strong> in modo che <code>relay.public_url</code> resti valido.
	</Callout>

	<h2>Opzione 2: Azure Container Apps</h2>
	<p>
		Container Apps compila dal <code>Dockerfile</code> del repository (che scarica il binario
		release precompilato):
	</p>
	<ol>
		<li>
			<strong>Crea una Container App</strong> dal repository GitHub (oppure invia l’immagine ad ACR).
		</li>
		<li>
			<strong>Porta</strong>: imposta la porta del contenitore su <code>8080</code>.
		</li>
		<li>
			<strong>Memoria</strong>: almeno 1 GB.
		</li>
		<li>
			<strong>Archiviazione persistente</strong>: monta una <strong>condivisione file di Azure Storage</strong> su
			<code>/data</code> per i dati LMDB.
		</li>
		<li>
			<strong>TLS</strong>: Container Apps fornisce <code>https://</code> sull’URL dell’app — imposta
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (oppure un dominio personalizzato).
		</li>
	</ol>

	<Callout type="note" title="Un relay non deve mai scalare a zero">
		Imposta <strong>min replicas = 1</strong>. Il file integrato <code>deploy/nostrfy.container.toml</code> può
		essere sostituito montando il tuo <code>nostrfy.toml</code> su <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
