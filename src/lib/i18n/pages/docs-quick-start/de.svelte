<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # Konfiguration ohne Neustart neu laden`;
</script>

<DocsTitle
	title="Schnellstartanleitung"
	description="Von der Installation zum laufenden Nostr-Relay in Minuten: Konfiguration schreiben, validieren, Daemon starten und den ersten Health-Check ausführen."
/>

<div class="doc-body">
	<h2>1. Konfiguration erstellen</h2>
	<p>
		<code>nostrfy init</code> schreibt eine standardmäßige, vollständig kommentierte <code>nostrfy.toml</code>:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Öffnen Sie sie in einem Texteditor und passen Sie sie an — jede Option ist kommentiert.</p>

	<h2>2. Konfiguration validieren</h2>
	<p>
		<code>nostrfy check</code> wird vor dem Start dringend empfohlen; bei Problemen meldet er genau, was falsch ist.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Relay starten</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="Läuft als Daemon. Mit --foreground im Terminal."
	/>
	<p>Prüfen Sie dann mit dem Health-Endpunkt, ob das Relay läuft:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Client verbinden</h2>
	<p>
		Verbinden Sie sich auf derselben Maschine mit <code>ws://&lt;host&gt;:8080</code>. Der Standard-Host ist
		<code>127.0.0.1</code>, der nur lokale Verbindungen akzeptiert. Um das Relay von anderen Maschinen zu erreichen, setzen Sie in der Konfiguration <code>server.host = "0.0.0.0"</code>:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		Für <code>wss://</code> benötigen Sie einen TLS-terminierenden Proxy (nginx oder Caddy) davor — siehe
		die <a href={p('/docs/deploy/')}>Bereitstellungs</a>-Dokumentation.
	</p>

	<h2>5. Stoppen und neu starten</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart liest die Konfiguration neu ein; SIGHUP lädt die meisten Einstellungen ohne Neustart neu."
	/>

	<h2>Effektiver Betrieb</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> zeigt Live-Statistiken — auch über HTTP unter
			<code>/relay/stats</code> und <code>/metrics</code>.
		</li>
		<li>Das Log wird nach <code>daemon.log_file</code> geschrieben und automatisch rotiert.</li>
		<li>
			<code>RUST_LOG</code> steuert die Log-Stufe (z. B. <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="Externe Clients können sich nicht verbinden?">
		server.host ist standardmäßig 127.0.0.1. Setzen Sie server.host = "0.0.0.0" und starten Sie neu.
	</Callout>

	<Callout type="tip" title="Weiter">
		In der <a href={p('/docs/configuration/')}>Konfigurationsreferenz</a> können Sie jeden Aspekt des Relays abstimmen.
	</Callout>
</div>
