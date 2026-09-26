<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # ricarica la configurazione senza riavvio`;
</script>

<DocsTitle
	title="Guida all’avvio rapido"
	description="Dall’installazione a un relay Nostr attivo in pochi minuti: scrivi la configurazione, convalidala, avvia il demone ed esegui il primo controllo dello stato."
/>

<div class="doc-body">
	<h2>1. Creare una configurazione</h2>
	<p>
		<code>nostrfy init</code> scrive un file <code>nostrfy.toml</code> predefinito e completamente commentato:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Aprilo in un editor di testo e regolalo — ogni opzione è commentata.</p>

	<h2>2. Convalidare la configurazione</h2>
	<p>
		<code>nostrfy check</code>  è fortemente consigliato prima dell’avvio; se qualcosa non va, indica esattamente cosa.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Avviare il relay</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="Viene eseguito come demone. Aggiungi --foreground per restare nel terminale."
	/>
	<p>Poi verifica che il relay sia attivo tramite /health per il controllo dello stato:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Puntare un client</h2>
	<p>
		Sulla stessa macchina, connettiti a <code>ws://&lt;host&gt;:8080</code>. L’host predefinito è
		<code>127.0.0.1</code>, che accetta solo connessioni locali. Per raggiungere il relay da altre macchine, imposta nella configurazione <code>server.host = "0.0.0.0"</code>:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		Per <code>wss://</code> serve un proxy che termini il TLS (nginx o Caddy) davanti — vedi la
		<a href={p('/docs/deploy/')}>documentazione sulla distribuzione</a>.
	</p>

	<h2>5. Arresto e riavvio</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart rilegge la configurazione; SIGHUP ricarica la maggior parte delle impostazioni senza riavvio."
	/>

	<h2>Gestione efficace</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> mostra statistiche in tempo reale — anche via HTTP su
			<code>/relay/stats</code> e <code>/metrics</code>.
		</li>
		<li>Il log viene scritto in <code>daemon.log_file</code> e viene ruotato automaticamente.</li>
		<li>
			<code>RUST_LOG</code> controlla il livello di log (ad esempio, <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="I client esterni non riescono a connettersi?">
		server.host è 127.0.0.1 per impostazione predefinita. Imposta host = "0.0.0.0" e riavvia.
	</Callout>

	<Callout type="tip" title="Passi successivi">
		Regola ogni aspetto del relay nel <a href={p('/docs/configuration/')}>riferimento di configurazione</a>.
	</Callout>
</div>
