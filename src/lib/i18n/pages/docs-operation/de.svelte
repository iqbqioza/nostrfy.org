<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="Relay betreiben"
	description="Für Ihr nostrfy-Relay: Start und Stopp, Logs und Statistiken, Hot-Reload der Konfiguration, mehrere Instanzen und Tuning für große Maßstäbe."
/>

<div class="doc-body">
	<h2>Starten und stoppen</h2>
	<p>Starten Sie das Relay als Hintergrund-Daemon:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>Oder im Vordergrund im Terminal ausführen:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Stoppen:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Prüfen Sie, ob es läuft:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Logs und Statistiken</h2>
	<p>
		Der Daemon schreibt nach <code>daemon.log_file</code>. Wenn die Datei <code>max_log_size_bytes</code> überschreitet, rotiert sie automatisch (<code>nostrfy.log.1</code>, <code>.2</code> … bis zu <code>max_log_files</code> Generationen):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>Die Log-Stufe wird über die <code>RUST_LOG</code>-Umgebungsvariable gesteuert (z. B. <code>RUST_LOG=debug</code>).</p>
	<h3>Statistiken</h3>
	<p>Live-Statistiken aus der CLI:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>Oder über HTTP:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Zeigt Verbindungen, akzeptierte/abgelehnte Events, DB-Größe und mehr.</p>
	<h3>Prometheus-Metriken</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Hot-Reload (SIGHUP)</h2>
	<p>Nach dem Bearbeiten der Konfigurationsdatei ohne Neustart neu laden:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Gilt beim Reload</th>
				<th>Neustart nötig</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Relay-Identität, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>die meisten [limits], reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, LiveKit-Einstellungen</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* (inkl. search_index), blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Das Log warnt, wenn eine neustartpflichtige Einstellung geändert wurde.</p>

	<h2>Mehrere Instanzen betreiben</h2>
	<p>
		nostrfy unterstützt mehrere unabhängige Relays auf einem Server (verschiedene Ports). Jede Instanz braucht einen eigenen
		<code>server.port</code>, eigene <code>[daemon]</code>-Dateien
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		(geteilte Werte lassen die zweite Instanz mit <code>already running</code> ablehnen),
		<code>database.path</code> sowie (falls genutzt) eigene <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Jede Instanz wird mit eigener Konfiguration verwaltet: <code>nostrfy --config /etc/nostrfy/a.toml start</code> und mehr.</p>

	<h2>Bereitstellungen in großem Maßstab</h2>
	<p>
		Das Relay ist darauf ausgelegt, auf einem einzelnen Host auf Hunderttausende von Verbindungen zu skalieren — die Live-Zustellung weckt nur Abonnenten, die zu einem Event passen könnten, und der Speicher pro Verbindung bleibt klein. Für Millionen ist Host-Tuning nötig:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Einstellung</th>
				<th>Wert</th>
				<th>Grund</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× der Zielverbindungen (+1000)</td>
				<td>jede Verbindung belegt einen fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>Ausstehende Accept-Queue bei Verbindungsspitzen</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>niedrig (z. B. 10)</td>
				<td>Gibt TIME_WAIT-Sockets schneller frei</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 oder 2</td>
				<td>Die LMDB-Map ist eine große dünne virtuelle Reservierung</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Unter FreeBSD sind die entsprechenden Parameter <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> plus
		<code>ulimit -n</code>, während <code>kern.ipc.somaxconn</code> <code>net.core.somaxconn</code> ersetzt. Der Kernel-Speicher pro Verbindung beträgt etwa 80 KiB, der Userspace etwa 10 KiB, sodass eine Million Verbindungen zusätzlich zur Datenbank rund 90 GiB Kernel- und Userspace-Speicher benötigt.
	</p>

	<h2 id="throughput">Durchsatz (Events pro Sekunde)</h2>
	<p>
		Das Schreiben von Events wird von zwei Kosten begrenzt: der Schnorr-Signaturprüfung (etwa 30–50 µs pro Event) und dem synchronen Festplatten-Flush, den der LMDB-Writer nach jedem Commit-Batch ausführt. Beides lässt sich in <code>nostrfy.toml</code> abstimmen:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Einstellung</th>
				<th>Grund</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>Commit in den OS-Page-Cache (Mikrosekunden); ein Stromausfall verliert nur Schreibvorgänge seit dem letzten Flush — hier anfangen</td>
			</tr>
			<tr>
				<td>CPU-Kerne ≥ 8 vCPU</td>
				<td>Der Batch-EVENT-Pfad verifiziert Signaturen parallel über Kerne</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>Lässt für schreibintensive Instanzen den NIP-50-Wortindex pro Event weg</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Die parallele Signaturprüfung verifiziert alle Signaturen eines ausstehenden Batches auf einmal in einem Pool von Worker-Threads (maximal 8; Batches unter 16 Events werden inline geprüft). Die günstigen Prüfungen jedes Events laufen weiterhin zuerst, daher ist der Ablehnungstext identisch zum sequenziellen Pfad — nur die Schnorr-Arbeit wird über Kerne verteilt. Ein Single-Thread-Build bleibt sequenziell.
	</p>

	<h2>Feste Anti-Missbrauchsgrenzen</h2>
	<p>
		Einige harte Grenzen sind fest (nicht konfigurierbar), damit das Relay unter Missbrauch ansprechbar bleibt:
	</p>
	<ul>
		<li>
			Ein Filter enthält höchstens <strong>512</strong> <code>ids</code>, <code>authors</code> oder
			<code>kinds</code>-Einträge; <code>#...</code>-Tag-Werte haben ein eigenes Budget von <strong>512</strong>
			Werten. Größere Filter werden abgelehnt (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> verfolgt höchstens 10.000 Quell-IPs; ist der Speicher voll, werden unbekannte IPs abgelehnt (fail closed).
		</li>
		<li>
			<code>ids</code>-Filter dürfen Präfixe enthalten, aber nur vollständige 32-Byte-IDs und Präfixe gerader Länge passen (ungerade/leere Einträge werden sowohl in der Historie als auch bei der Live-Zustellung ignoriert).
		</li>
		<li>
			Überlange Indexschlüssel (Tag-Werte, Inhaltswörter, <code>d</code> -Tags jenseits der LMDB-Schlüsselgrenze) werden beim Indexieren übersprungen; das Event wird dennoch gespeichert.
		</li>
	</ul>
</div>
