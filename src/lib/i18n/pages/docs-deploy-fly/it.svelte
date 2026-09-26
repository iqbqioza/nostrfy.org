<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # mostrato nei client tramite NIP-11
description = "A friendly relay for everyone"
private_key = "..."                            # obbligatorio per i gruppi NIP-29
public_url = "wss://<your-app-name>.fly.dev"   # obbligatorio per NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# riga di log: "relay listening on ws://0.0.0.0:8080"
fly logs

# Documento informativo NIP-11 sull'indirizzo pubblico
curl https://<your-app-name>.fly.dev/

# punta il tuo client Nostr su wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="Distribuire su Fly.io"
	description="Distribuisci nostrfy su Fly.io in pochi minuti con il modello pronto — volumi, macchine, terminazione TLS e aggiornamenti semplici."
/>

<div class="doc-body">
	<h2>Cosa include il repository</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>File</th>
				<th>Scopo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Immagine container — <strong>scarica il binario di release precompilato</strong> dagli asset di release su GitHub (x86_64 / aarch64, scelti in base all’architettura di build) e ne verifica il checksum sha256. Nessuna compilazione avviene su Fly
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Configurazione dell’app Fly: servizio HTTP sulla porta 8080, controllo dello stato, mount del volume <code>/data</code>, macchine sempre attive
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					La configurazione del relay integrata nell’immagine in <code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Prerequisiti</h2>
	<ul>
		<li>Un account Fly.io</li>
		<li>La CLI flyctl (<code>fly version</code>)</li>
		<li>Accesso effettuato: <code>fly auth login</code></li>
	</ul>

	<h2>Distribuzione in quattro passaggi</h2>

	<h3>1. Crea l’app (senza ancora distribuire)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> deve essere univoco su Fly (diventa parte dell’URL del relay:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>: es. <code>nrt</code> (Tokyo), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — scegli la regione più vicina ai tuoi utenti
		</li>
		<li>
			Questo comando potrebbe sovrascrivere i valori di <code>fly.toml</code> del modello (nome app, regione) — va bene così
		</li>
	</ul>

	<h3>2. Crea il volume persistente</h3>
	<p>Il database LMDB risiede su un volume Fly montato in <code>/data</code>:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB basta per iniziare (il database cresce con l’uso). Puoi ridimensionare dopo, o creare fin dall’inizio un volume più grande.
	</p>

	<h3>3. Configura il relay</h3>
	<p>Modifica <code>deploy/nostrfy.container.toml</code> prima di distribuire:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>: genera localmente con <code>nostrfy genkey</code> (con una config temporanea) e incolla la chiave, oppure generane una con un qualsiasi strumento Nostr
		</li>
		<li>
			<code>public_url</code> <strong>deve</strong> corrispondere al nome della tua app — senza di essa, NIP-42 AUTH, NIP-62 vanish e l’API di gestione NIP-86 non funzioneranno
		</li>
		<li>Tutto il resto può restare ai valori predefiniti</li>
	</ul>

	<h3>4. Distribuisci</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly compila l’immagine (pochi minuti — il download del binario è veloce, l’immagine è piccola), crea una macchina ed esegue il controllo dello stato contro <code>/health</code>.
	</p>

	<h2>Verifica</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Scalabilità e aggiornamenti</h2>
	<ul>
		<li>
			<strong>Aggiorna il relay</strong>: modifica <code>deploy/nostrfy.container.toml</code> ed esegui di nuovo <code>fly deploy</code> — l’immagine scarica sempre l'<strong>ultimo</strong> binario di release GitHub, quindi aggiornare è una semplice ridistribuzione
		</li>
		<li>
			<strong>Blocca una versione</strong>: <code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> oppure cambia l'<code>ARG</code> nel Dockerfile
		</li>
		<li>
			<strong>Scala</strong>: il relay è una singola macchina per impostazione predefinita. <code>fly machines clone &lt;id&gt;</code> crea una seconda macchina; entrambe condividono il volume (i volumi Fly supportano più macchine nella stessa regione)
		</li>
		<li>
			<strong>Metriche</strong>: Fly raccoglie l’endpoint <code>/metrics</code> (vedi <code>[metrics]</code> in <code>fly.toml</code>) e lo mostra nella dashboard Fly sotto Metrics
		</li>
	</ul>

	<h2>Personalizzare la configurazione</h2>
	<p>
		L’immagine legge <code>/etc/nostrfy/nostrfy.toml</code>, integrato da <code>deploy/nostrfy.container.toml</code>. Due modi per personalizzare:
	</p>
	<ol>
		<li>
			<strong>Modifica <code>deploy/nostrfy.container.toml</code> nel repository</strong> e distribuisci di nuovo (il modo più semplice)
		</li>
		<li>
			<strong>Monta la tua config</strong>: compila un fork dell’immagine che copia il tuo file di config sopra <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>Ogni opzione è documentata nel <a href={p('/docs/configuration/')}>riferimento di configurazione</a>.</p>

	<h2>Note</h2>
	<ul>
		<li>
			<strong>Sempre attivo per scelta progettuale</strong>: <code>auto_stop_machines = false</code> in <code>fly.toml</code> — un relay non deve mai essere fermato durante i periodi di inattività
		</li>
		<li>
			Il container esegue il relay in <strong>modalità foreground</strong> (<code>nostrfy start --foreground</code>); i log vanno su stdout/stderr e sono raccolti da Fly
		</li>
		<li>
			TLS è terminato da Fly; il relay serve WebSocket in chiaro sulla porta 8080
		</li>
		<li>
			<strong>Host multimediale Blossom</strong>: per servire anche il server Blossom, imposta <code>blossom.host = "media.example.com"</code> nella config, aggiungi <code>media.example.com</code> come <strong>hostname aggiuntivo</strong> della stessa app Fly (<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> oppure <code>fly hostnames</code>), e aggiungi il certificato TLS di <code>media.</code> nella dashboard Fly — il relay separa gli host internamente (come <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS è terminato da Fly">
		Il relay serve WebSocket in chiaro sulla porta 8080.
	</Callout>
</div>
