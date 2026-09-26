<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# zuerst Dry-Run — prüft jedes Event und schreibt nichts
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# Import (vorher das nostrfy-Relay stoppen)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="Befehlsreferenz"
	description="Alle nostrfy-Befehle: init, start, stop, stats, upgrade und migrate-strfry, plus CLI-Zugriffslisten und inbox/outbox-Abonnementfilter."
/>

<div class="doc-body">
	<h2>Übersicht</h2>
	<p>Alle Befehle akzeptieren <code>--config &lt;path&gt;</code> (standardmäßig <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Befehl</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Schreibt eine standardmäßige nostrfy.toml und beendet sich; die Datei wird mit 0600 erstellt</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Erzeugt einen geheimen Schlüssel für NIP-29-Gruppen, schreibt ihn in relay.private_key, setzt die Konfiguration auf 0600 und gibt den öffentlichen Schlüssel aus; wird die Datei nach dem Lesen geändert, bricht der Befehl ohne Schreiben ab</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Validiert die Konfiguration (vor dem Start ausführen)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Startet als Daemon; <code>--foreground</code> führt im Terminal aus</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Stoppt den laufenden Daemon</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Stoppt und startet neu (liest die Konfiguration neu)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Zeigt Live-Statistiken</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Aktualisiert das Binary auf das neueste GitHub-Release (oder die angegebene Version); lädt das passende Plattform-Asset, verifiziert dessen sha256 und führt eine <code>--version</code>-Prüfung aus, dann ersetzt es das Binary atomar; parallele Läufe werden per Lock-Datei serialisiert; ohne Versionsangabe wird nie herabgestuft; <code>--force</code> erzwingt eine Neuinstallation</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>Importiert Events aus einem strfry-Relay — entweder <code>strfry export</code> über <code>--strfry-db</code> ausführen, eine JSONL-Datei mit <code>--input</code> lesen oder Eingaben über stdin pipen; wiederholbar, mit <code>--dry-run</code>, <code>--since</code> und optionalem Zusammenführen der Einstellungen</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Zugriffslisten verwalten</h2>
	<p>
		Die Allow/Deny-Listen des Relays und die Blossom-Upload-Allowlist liegen in LMDB und gelten sofort — der laufende Daemon wird automatisch neu geladen:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>Ein gesperrter Pubkey wird beim Veröffentlichen immer abgelehnt und beim Lesen nie ausgeliefert.</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> Entfernt eine IP aus der persistierten NIP-86-Blockliste (Wiederherstellung nach Selbstaussperrung); zum Anwenden den Daemon neu starten.
	</p>

	<h2>Inbox/outbox-Abonnementfilter</h2>
	<p>
		nostrfy erweitert die REQ-Filtersyntax für das Inbox/Outbox-Routingmodell um zwei Komfortschlüssel — eine nostrfy-Erweiterung, kein Teil eines NIP. <code>"outbox"</code> wird zu <code>"authors"</code> erweitert: nur <em>von diesem Pubkey erstellte</em> Events.
		<code>"inbox"</code> wird zu <code>"#p"</code> erweitert: nur <em>an diesen Pubkey adressierte</em> Events (Erwähnungen, Antworten, Zaps und DMs). Werte dürfen 64-stellige Hex- oder <code>npub1</code>-kodiert sein oder Arrays, die mit einem vorhandenen <code>authors</code>/<code>#p</code>-Schlüssel
		 zusammengeführt; ein ungültiger Pubkey lehnt das Abonnement ab:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		Auch die Endpunkte sind schreibbeschränkt: <code>/outbox</code> akzeptiert nur Events, die vom NIP-42-authentifizierten Pubkey der Verbindung erstellt wurden (<code>server.outbox_write_policy = "any"</code>), oder nur die eigenen Events des Relays (<code>"relay"</code>);
		<code>/inbox</code> akzeptiert nur Events mit <code>p</code>-Tag.
	</p>

	<h2>Migration von strfry</h2>
	<p>
		Ein Befehl übernimmt die Events eines bestehenden strfry-Relays. Die Migration ist offline (stoppen Sie zuerst das nostrfy-Relay — bei belegter Datenbank verweigert sie den Start), liest strfrys eigenes Exportformat und ist sicher wiederholbar: Duplikate werden übersprungen, Löschnebenwirkungen erneut angewendet.
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		Es bietet außerdem an, passende strfry-Einstellungen nach <code>nostrfy.toml</code> zu übernehmen, und kann nach einer Unterbrechung mit <code>--since</code>
		fortgesetzt werden. NIP-29-Gruppen und NIP-43-Rollen werden beim ersten Start aus den importierten Events neu aufgebaut. Das vollständige Handbuch steht in
		<a href={p('/docs/migrating-from-strfry/')}>Migrationsanleitung</a>.
	</p>

	<Callout type="tip" title="Schritt für Schritt">
		Die meisten Befehle werden außerdem im <a href={p('/docs/quick-start/')}>Schnellstart</a> Schritt für Schritt erklärt.
	</Callout>
</div>
