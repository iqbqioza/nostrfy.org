<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # imposta name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Distribuzione su Google Cloud"
	description="Distribuisci nostrfy su Google Cloud Compute Engine o Cloud Run — passo dopo passo, con systemd, TLS e le avvertenze sullo scale-to-zero."
/>

<div class="doc-body">
	<p>
		Opzioni: <strong>Compute Engine</strong> (VM, consigliata) o <strong>Cloud Run</strong>
		(container).
	</p>

	<h2>Opzione 1: Compute Engine (consigliata)</h2>
	<ol>
		<li>
			<strong>Crea una VM</strong>: Ubuntu 24.04 LTS (o Debian), <code>e2-small</code> (2 GB) è
			sufficiente per iniziare. Scegli una regione vicina ai tuoi utenti.
		</li>
		<li>
			<strong>Regola firewall</strong>: consenti TCP in ingresso <code>8080</code> (e <code>443</code>
			per TLS). Sotto <strong>Rete → Firewall</strong>, crea una regola con i tag di destinazione
			assegnati alla VM.
		</li>
		<li>
			<strong>Connettiti via SSH</strong> (funziona il pulsante SSH della console) e segui la
			<a href={p('/docs/deploy/vps/')}>guida VPS</a> generica:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Riserva un IP statico</strong> (IP esterno → Prenota) in modo che
			<code>public_url</code> resti valido dopo i riavvii.
		</li>
		<li>
			<strong>Verifica</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>Aggiungi TLS (<code>wss://</code>)</strong> con certbot + nginx (come nella
			<a href={p('/docs/deploy/vps/')}>guida VPS</a>) o un load balancer GCP con un certificato
			gestito.
		</li>
	</ol>

	<h2>Opzione 2: Cloud Run (container)</h2>
	<p>
		Cloud Run compila dal <code>Dockerfile</code> del repository (che scarica il binario
		precompilato della release):
	</p>
	<ol>
		<li>
			<strong>Crea un servizio dal repo GitHub</strong> (oppure invia l’immagine su Artifact
			Registry).
		</li>
		<li>
			<strong>Porta</strong>: imposta la porta del container su <code>8080</code>.
		</li>
		<li>
			<strong>Alloca memoria</strong>: almeno 512 MB (LMDB + runtime asincrono).
		</li>
		<li>
			<strong>Storage persistente</strong>: collega un <strong>volume Cloud Run (filestore/gcsfuse)</strong>
			su <code>/data</code> — LMDB ha bisogno di un filesystem, quindi un montaggio GCS FUSE su
			<code>/data</code> garantisce la persistenza.
		</li>
		<li>
			<strong>TLS</strong>: Cloud Run fornisce <code>https://</code> automaticamente — imposta
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (o il tuo dominio personalizzato).
		</li>
	</ol>

	<Callout type="note" title="Cloud Run scala a zero per impostazione predefinita">
		Per un relay, imposta <strong>min instances = 1</strong> in modo che non venga mai sospeso per inattività. Il file
		<code>deploy/nostrfy.container.toml</code> integrato nell’immagine può essere sostituito montando il
		tuo <code>nostrfy.toml</code> su <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
