<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const commonBlock = `# 1. Installa l'ultimo binario della release (non serve sudo per l'installazione stessa)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Scarica il modello di configurazione e modificalo (non serve clonare il repository)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # imposta name, public_url, private_key

# 3. Scarica l'unità systemd e avvia il servizio
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Apri la porta (di solito 8080) nel firewall del provider e verifica
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # obbligatorio per NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # esegui 'nostrfy genkey' e incolla la chiave`;
</script>

<DocsTitle
	title="Panoramica sulla distribuzione"
	description="Come è distribuito nostrfy e come distribuirlo — Fly.io, AWS, Google Cloud, Azure, DigitalOcean o qualsiasi VPS, con note su TLS, systemd e container."
/>

<div class="doc-body">
	<h2>Un binario, più piattaforme</h2>
	<p>
		nostrfy fornisce binari precompilati per <strong>x86_64</strong> e <strong>aarch64</strong> (artefatti delle
		release GitHub, verificati tramite checksum da <code>install.sh</code>), un’immagine container che
		<strong>scarica tali binari</strong> (nessuna compilazione richiesta) e guide di distribuzione per le principali
		piattaforme.
	</p>

	<h2>Piattaforme</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Piattaforma</th>
				<th>Tipo</th>
				<th>Guida</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Piattaforma gestita (container, volumi, TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) o App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail o ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) o Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM o Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Qualsiasi VPS</strong></td>
				<td>Semplice server Ubuntu/Debian</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Il modello comune per le VM</h2>
	<p>Tutte le guide per VM (Digital Ocean, AWS EC2, GCP, Azure, qualsiasi VPS) seguono lo stesso modello:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Prima di andare in produzione</h2>
	<p>
		Ogni distribuzione usa le stesse opzioni di <code>nostrfy.toml</code>. Prima di andare in produzione, imposta almeno:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM o container?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong>: più semplice, più economica, controllo completo. Consigliata per la maggior
			parte delle distribuzioni di relay.
		</li>
		<li>
			<strong>Container</strong>: usa il <code>Dockerfile</code> del repository (scarica il binario della release
			al momento della build) su Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run o Azure Container
			Apps. È richiesto storage persistente per i dati LMDB (<code>/data</code>).
		</li>
	</ul>

	<h2>Host multimediale Blossom</h2>
	<p>
		Se <code>blossom.host</code> è impostato, punta quell’hostname alla stessa porta anche nel proxy TLS (vedi i
		blocchi nginx/Caddy nella <a href={p('/docs/deploy/vps/')}>guida VPS</a>).
	</p>

	<Callout type="warning" title="TLS è terminato dal tuo proxy o dal provider">
		Il relay di per sé serve WebSocket in chiaro sulla porta 8080 e rispetta X-Forwarded-Proto.
	</Callout>
</div>
