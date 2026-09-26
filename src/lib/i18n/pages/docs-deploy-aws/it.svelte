<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # per Ubuntu: ubuntu@<public-ip>
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
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="Distribuzione su AWS"
	description="Distribuisci nostrfy su AWS EC2, Lightsail o ECS/Fargate — passo dopo passo, con systemd, TLS dietro un reverse proxy e una checklist di produzione."
/>

<div class="doc-body">
	<p>
		Opzioni: <strong>EC2</strong> (VM, consigliata), <strong>Lightsail</strong> (VM più semplice) o
		<strong>ECS/Fargate</strong> (container).
	</p>

	<h2>Opzione 1: EC2 (consigliata)</h2>
	<ol>
		<li>
			<strong>Avvia un’istanza</strong>: Amazon Linux 2023 o Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 GB di RAM) è sufficiente per iniziare. Scegli una regione vicina ai tuoi utenti.
		</li>
		<li>
			<strong>Gruppo di sicurezza</strong>: consenti TCP in ingresso <code>8080</code> (e <code>443</code> per
			TLS). Limita la regola SSH al tuo IP.
		</li>
		<li>
			<strong>Connettiti via SSH</strong> e segui la <a href={p('/docs/deploy/vps/')}>guida VPS generica</a>:
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
			<a href={p('/docs/deploy/vps/')}>guida VPS</a>) oppure con un Application/Network Load Balancer con certificato ACM
			— quindi imposta <code>relay.public_url</code> e riavvia.
		</li>
	</ol>

	<h2>Opzione 2: Lightsail</h2>
	<p>
		Le istanze Lightsail funzionano esattamente come la guida EC2 — la scheda di <strong>rete</strong> contiene le
		regole del firewall: apri TCP <code>8080</code>.
	</p>

	<h2>Opzione 3: ECS / Fargate (container)</h2>
	<p>
		Il <code>Dockerfile</code> del repository scarica il binario di release precompilato al momento della build:
	</p>
	<ol>
		<li>
			Invia l’immagine su ECR:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Crea un servizio ECS (Fargate, 1 task) con un <strong>volume EFS montato su
			<code>/data</code></strong> (persistenza LMDB — senza di esso, i dati si perdono a ogni nuova distribuzione).
		</li>
		<li>
			Esporre la porta <code>8080</code>; metti davanti un ALB + certificato ACM per TLS.
		</li>
		<li>
			La configurazione integrata <code>deploy/nostrfy.container.toml</code> può essere sovrascritta montando il tuo
			<code>nostrfy.toml</code> su <code>/etc/nostrfy/nostrfy.toml</code> (es. un fork che lo copia nell’immagine).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Associa un <strong>Elastic IP</strong> all’istanza se la fermi/avvii — altrimenti l’IP pubblico
		cambia e <code>public_url</code> non sarà più valido.
	</p>

	<Callout type="note" title="TLS è terminato dal tuo proxy o dal provider">
		Il relay serve WebSocket semplice su 8080 e rispetta X-Forwarded-Proto.
	</Callout>
</div>
