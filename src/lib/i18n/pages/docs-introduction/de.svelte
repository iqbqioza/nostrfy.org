<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Einführung in nostrfy"
	description="Was nostrfy ist, was es ab Werk kann und welche Ideen hinter der All-in-One-Nostr-Relay-Server-Engine in Rust stehen."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> ist ein Relay-Server für das
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a>-Protokoll. Er speichert von Clients gesendete Events (Beiträge, Reaktionen, Profile …) und liefert sie auf Abonnementanfragen hin aus.
	</p>

	<h2>Hauptfunktionen</h2>
	<ul>
		<li><strong>Einfach und stabil</strong>  — in Rust geschrieben; ein Binary erledigt alles.</li>
		<li>
			<strong>Schneller Speicher und Suche</strong>  — LMDB-Datenbank mit Volltext-Index (NIP-50).
		</li>
		<li>
			<strong>Breite NIP-Unterstützung</strong>  — 36 NIPs implementiert, plus der Blossom-Dateiserver: Löschung, Proof-of-Work, Delegierung, Gruppen, Suche und eine Verwaltungs-API.
		</li>
		<li>
			<strong>Einfach zu betreiben</strong>  — Daemon-Modus, Log-Rotation, Hot-Reload der Konfiguration (SIGHUP), Live-Statistiken, REST-API und Prometheus-Metriken.
		</li>
		<li>
			<strong>Einfache Migration</strong>  — ein Befehl importiert eine vorhandene
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			Datenbank: Dry-Run, Zusammenführen der Einstellungen und sichere Wiederholungen (<a href={p('/docs/migrating-from-strfry/')}>Migrationsanleitung</a>).
		</li>
	</ul>

	<h2>Was Sie ab Werk erhalten</h2>
	<p>
		Ein einzelnes <code>nostrfy</code>-Binary stellt an einem Port bereit:
	</p>
	<ul>
		<li><strong>WebSocket-Relay</strong> und das NIP-11-Informationsdokument.</li>
		<li>Ein schreibgeschütztes <strong>REST-API</strong> unter <code>/api/v1/...</code> — ein eigener Reader-Thread sorgt dafür, dass REST-Verkehr WebSocket-Abonnenten nie blockiert.</li>
		<li><strong>Blossom-Dateiserver</strong> (Medien-Hosting) unter eigenem Hostnamen.</li>
		<li><strong>NIP-86-Verwaltungs-RPC</strong>, Health-Check und Prometheus-<code>/metrics</code>.</li>
	</ul>

	<h2>Ressourcenprofil</h2>
	<p>
		nostrfy läuft nachweislich auf einem <strong>0,25 vCPU / 512 MB VPS</strong>. Die LMDB-Speicherzuordnung ist eine dünne virtuelle Reservierung von 1 TiB — die physische Festplatte wächst nur mit echten Daten — und der Prozessspeicher bleibt konstant: Ein Relay mit 252 MB Datenbank belegte <strong>7,9 MB privates RSS</strong>.
	</p>

	<h2>Ein schneller Eindruck</h2>
	<p>Drei Befehle für Installation, Initialisierung und Start:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Prüfen Sie dann, ob das Relay läuft:</p>
	<CodeBlock code={health} lang="bash" />
	<p>Und rufen Sie das NIP-11-Dokument ab:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Wie es weitergeht">
		Folgen Sie der <a href={p('/docs/quick-start/')}>Schnellstartanleitung</a> für den ersten Lauf oder wechseln Sie direkt zur
		<a href={p('/docs/configuration/')}>Konfigurationsreferenz</a>, um das Relay abzustimmen.
	</Callout>
</div>
