<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const lowSpecConfig = `[database]
search_index = false   # halbiert die Datenbankgröße und spart CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Installationsanleitung"
	description="Anforderungen, Bauen aus dem Quellcode, Installation eines vorgefertigten Binaries, Prüfsummenprüfung und Hinweise zum Betrieb von nostrfy unter FreeBSD."
/>

<div class="doc-body">
	<h2>Anforderungen</h2>
	<ul>
		<li>Eine aktuelle, stabile Rust-Toolchain (nur zum Bauen des Relays nötig).</li>
		<li>Linux-Rechner.</li>
		<li>2 GB RAM oder mehr werden empfohlen — für einen 0,25 vCPU / 512 MB VPS siehe den Hinweis zu schwacher Hardware unten.</li>
	</ul>

	<h3>Schwacher VPS (0,25 vCPU / 512 MB)</h3>
	<p>
		nostrfy läuft nachweislich stabil, auch wenn die Datenbank den RAM übersteigt. Die LMDB-Map ist eine
		<strong>dünne virtuelle Reservierung von 1 TiB</strong> — die physische Festplatte wächst nur mit den geschriebenen Daten — und der Prozessspeicher bleibt konstant: Ein Relay mit 252 MB Datenbank belegte <strong>7,9 MB privates RSS</strong>
		(der Rest ist rückgewinnbarer Dateicache, den der Kernel unter Druck verdrängt).
	</p>
	<p>Bei einem winzigen VPS bringt eine Einstellung den größten Unterschied:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Einstellung</th>
				<th>Wirkung</th>
				<th>Gemessen</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Deaktiviert den NIP-50-Wortindex — die Suche funktioniert weiter (Ganzwortsuche), ist aber langsamer
				</td>
				<td>41,8 MB → 20,5 MB pro 10.000 Events</td>
			</tr>
			<tr>
				<td>Standardwerte</td>
				<td>Bereits auf wenig Speicher abgestimmt</td>
				<td>Für 512 MB sind keine Änderungen nötig</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Bau aus dem Quellcode</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>Wenn der Build fertig ist, liegt das Binary unter <code>target/release/nostrfy</code>.</p>

	<h2>Vorgebautes Binary installieren</h2>
	<p>
		Der Release-Workflow liefert <strong>Linux x86_64</strong>, <strong>Linux aarch64</strong> und
		<strong>FreeBSD x86_64</strong> als vorgefertigte Binaries. Dasselbe
		<code>install.sh</code> funktioniert auf allen Systemen — es erkennt die Plattform, lädt das passende Binary und verifiziert dessen Prüfsumme:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy lässt sich auf FreeBSD 13.x und 14.x (amd64) bauen und betreiben. Installieren Sie Rust und bauen Sie mit:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Hinweise zur Plattform:</p>
	<ul>
		<li>
			Die von <code>start</code>/<code>stop</code>/<code>restart</code> genutzte Prozessprüfung liest den Prozessnamen über das
			<code>kern.proc.pid.&lt;pid&gt;.comm</code>-sysctl (unter Linux wird
			<code>/proc/&lt;pid&gt;/comm</code> verwendet), sodass auf beiden Plattformen eine veraltete pid-Datei erkannt wird, deren pid von einem anderen Programm wiederverwendet wurde.
		</li>
		<li>
			<code>nostrfy start</code> daemonisiert wie unter Linux; der standardmäßige Double-Fork-Daemon funktioniert mit der Standard-<code>rc</code>-Integration (<code>service nostrfy start</code>).
		</li>
		<li>
			Die <code>min_free_bytes</code>-Prüfung von Blossom nutzt <code>statvfs</code>, das beide Systeme bereitstellen; weiterer plattformspezifischer Code wird nicht verwendet (das Relay selbst ist reines asynchrones Rust auf tokio).
		</li>
	</ul>

	<h3>Betrieb auf Port 80</h3>
	<p>
		Normale Benutzer können Port 80 nicht binden. Führen Sie es mit <code>sudo</code> aus oder verwenden Sie einen höheren Port wie 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Beispiel: Betrieb auf Port 8080 (für normale Benutzer geeignet; ändern Sie zuerst den Port in der Konfiguration)."
	/>

	<Callout type="tip" title="Weiter">
		nostrfy ist installiert. Folgen Sie der <a href={p('/docs/quick-start/')}>Schnellstartanleitung</a>.
	</Callout>
</div>
