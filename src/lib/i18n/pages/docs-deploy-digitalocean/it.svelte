<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # imposta name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Distribuzione su DigitalOcean"
	description="Distribuisci nostrfy su un Droplet DigitalOcean o su App Platform — passo dopo passo, con systemd, TLS e una configurazione pronta per la produzione."
/>

<div class="doc-body">
	<p>
		Due opzioni: un <strong>Droplet</strong> (VM, il più semplice) o <strong>App Platform</strong>
		(container).
	</p>

	<h2>Opzione 1: Droplet (consigliato)</h2>
	<ol>
		<li>
			<strong>Crea un Droplet</strong>: Ubuntu 24.04 LTS, qualsiasi dimensione (1 GB di RAM è sufficiente
			per iniziare). Un Droplet in una regione vicina ai tuoi utenti riduce la latenza.
		</li>
		<li>
			<strong>Accedi via SSH</strong> e segui la
			<a href={p('/docs/deploy/vps/')}>guida VPS generica</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Apri la porta</strong> nel firewall del Droplet (è consigliato il
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>): consenti il TCP in ingresso <code>8080</code> (e <code>443</code> se aggiungi TLS).
		</li>
		<li>
			<strong>Verifica</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Aggiungi TLS (<code>wss://</code>)</strong> con certbot + nginx, oppure
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				il load balancer gestito di DigitalOcean</a
			>
			con un certificato — quindi imposta <code>relay.public_url = "wss://relay.example.com"</code> e
			riavvia.
		</li>
	</ol>

	<h2>Opzione 2: App Platform (container)</h2>
	<p>
		App Platform compila dal <code>Dockerfile</code> del repository (che scarica il binario di release
		precompilato):
	</p>
	<ol>
		<li><strong>Collega il tuo repository GitHub</strong> e crea un’app da esso.</li>
		<li>
			<strong>Porta</strong>: imposta la porta HTTP su <code>8080</code> (il relay è in ascolto lì).
		</li>
		<li>
			<strong>Disco persistente</strong>: monta un volume su <code>/data</code> (i dati LMDB risiedono lì
			— senza di esso, i dati vengono persi a ogni distribuzione).
		</li>
		<li>
			<strong>Configurazione</strong>: il file <code>deploy/nostrfy.container.toml</code> integrato nell’immagine può
			essere sostituito montando la tua configurazione su <code>/etc/nostrfy/nostrfy.toml</code> (crea un
			fork che lo copia, oppure usa un <code>COPY</code> nel Dockerfile del tuo repository).
		</li>
		<li>
			<strong>TLS</strong>: App Platform fornisce <code>https://</code> automaticamente per il dominio
			dell’app — imposta <code>relay.public_url</code> di conseguenza.
		</li>
	</ol>

	<h2>Entrambe le opzioni</h2>
	<ul>
		<li>
			Aggiornamenti: riesegui <code>install.sh</code> + <code>systemctl restart nostrfy</code> (Droplet),
			oppure fai push al repository collegato (App Platform).
		</li>
		<li>
			Tutta la configurazione è documentata nel
			<a href={p('/docs/configuration/')}>riferimento di configurazione</a>.
		</li>
	</ul>
</div>
