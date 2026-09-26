<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const lowSpecConfig = `[database]
search_index = false   # dimezza la dimensione del database e risparmia CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Guida all’installazione"
	description="Requisiti, compilazione dai sorgenti, installazione di un binario precompilato, verifica dei checksum e note per eseguire nostrfy su FreeBSD."
/>

<div class="doc-body">
	<h2>Requisiti</h2>
	<ul>
		<li>Una toolchain Rust stabile recente (necessaria solo per compilare il relay).</li>
		<li>Una macchina Linux.</li>
		<li>Si consigliano 2 GB di RAM o più — per un VPS da 0,25 vCPU / 512 MB vedi la nota sulle risorse ridotte qui sotto.</li>
	</ul>

	<h3>VPS con risorse ridotte (0,25 vCPU / 512 MB)</h3>
	<p>
		nostrfy è stato verificato come stabile anche quando il database supera la RAM. La mappa LMDB è una
		<strong>prenotazione virtuale sparsa da 1 TiB</strong>  — il disco fisico cresce solo con i dati scritti — e la memoria del processo resta stabile: un relay con un database da 252 MB occupava <strong>7,9 MB di RSS privato</strong>
		(il resto è cache di file recuperabile che il kernel espelle sotto pressione).
	</p>
	<p>Su un VPS minuscolo, un’impostazione fa la differenza maggiore:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Impostazione</th>
				<th>Effetto</th>
				<th>Misurato</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Disattiva l’indice parole NIP-50 — la ricerca funziona ancora (parole intere) ma è più lenta
				</td>
				<td>41,8 MB → 20,5 MB per 10.000 eventi</td>
			</tr>
			<tr>
				<td>Predefiniti</td>
				<td>Già ottimizzato per poca memoria</td>
				<td>Nessuna modifica necessaria per 512 MB</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Compilare dai sorgenti</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>Al termine della compilazione, il binario si trova in <code>target/release/nostrfy</code>.</p>

	<h2>Installare un binario precompilato</h2>
	<p>
		Il flusso di release allega binari precompilati per <strong>Linux x86_64</strong>, <strong>Linux aarch64</strong> e
		<strong>FreeBSD x86_64</strong>. Lo stesso
		<code>install.sh</code> funziona su entrambi i sistemi — rileva la piattaforma, scarica il binario corrispondente e ne verifica il checksum:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy si compila e gira su FreeBSD 13.x e 14.x (amd64). Installa Rust e compila con:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Note sulla piattaforma:</p>
	<ul>
		<li>
			Il controllo di attività del processo usato da <code>start</code>/<code>stop</code>/<code>restart</code> legge il nome del processo tramite
			<code>kern.proc.pid.&lt;pid&gt;.comm</code> sysctl (su Linux usa
			<code>/proc/&lt;pid&gt;/comm</code>), quindi un file pid obsoleto il cui pid è stato riutilizzato da un altro programma viene rilevato su entrambe le piattaforme.
		</li>
		<li>
			<code>nostrfy start</code> si avvia come demone come su Linux; il demone standard con doppio fork funziona con l’integrazione
			<code>rc</code> predefinita (<code>service nostrfy start</code>).
		</li>
		<li>
			Il controllo <code>min_free_bytes</code> di Blossom usa <code>statvfs</code>, fornito da entrambi i sistemi; non viene usato altro codice specifico per piattaforma (il relay stesso è puro Rust asincrono su tokio).
		</li>
	</ul>

	<h3>Esecuzione sulla porta 80</h3>
	<p>
		Gli utenti normali non possono occupare la porta 80. Esegui con <code>sudo</code> oppure usa una porta più alta come 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Esempio: esecuzione sulla porta 8080 (funziona per gli utenti normali; cambia prima la porta nella configurazione)."
	/>

	<Callout type="tip" title="Passi successivi">
		nostrfy è installato. Segui la <a href={p('/docs/quick-start/')}>guida di avvio rapido</a>.
	</Callout>
</div>
