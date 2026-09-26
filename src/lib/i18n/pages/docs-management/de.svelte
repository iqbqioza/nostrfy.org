<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const call = `curl -X POST http://127.0.0.1:8080/ \\
  -H "Content-Type: application/nostr+json+rpc" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"method":"supportedmethods","params":[]}'`;
</script>

<DocsTitle
	title="NIP-86-Verwaltung"
	description="Die JSON-RPC-Verwaltungs-API: Moderation, Zugriffslisten, Relay-Identität, Rollen, Einladungscodes und delegierte Methodenzuweisungen, mit Bearer- oder NIP-98-Authentifizierung."
/>

<div class="doc-body">
	<h2>Aktivieren</h2>
	<p>
		NIP-86 ist eine JSON-RPC-API zur Verwaltung des Relays. Sie benötigt eine von zwei Authentifizierungsmethoden, andernfalls wird jeder Aufruf abgelehnt:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Methode</th>
				<th>Einrichtung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Bearer-Token</td>
				<td>
					Setzen Sie <code>rpc.management_token</code> und senden Sie <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Setzen Sie <code>rpc.admin_pubkey</code> und senden Sie ein NIP-98-Auth-Event (Kind 27235), signiert mit dem Admin-Schlüssel, in <code>Authorization: Nostr &lt;base64&gt;</code> — ein <code>payload</code>-Tag ist erforderlich; jedes Event ist innerhalb seines 60-Sekunden-Fensters nur einmal verwendbar
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>API aufrufen</h2>
	<p>POST / mit <code>Content-Type: application/nostr+json+rpc</code>:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Methoden</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Methode</th>
				<th>Parameter</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>Liste der unterstützten Methoden</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Einen Pubkey für das Veröffentlichen sperren (entfernt ihn auch von der Allowlist)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Einen Pubkey entsperren</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>Gesperrte Pubkeys und Gründe auflisten</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Zur Allowlist hinzufügen (hebt auch die Sperre auf)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Von der Allowlist entfernen</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>Die Allowlist auflisten</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Einen Kind erlauben / verbieten</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>Erlaubte / verbotene Kinds auflisten</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Relay-Namen / Beschreibung / Icon ändern (wird in die Konfigurationsdatei gespeichert; meldet einen Fehler, wenn die Datei nicht geschrieben werden kann)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>NIP-43-Rollenverwaltung (falsch typisierte Felder werden abgelehnt; das Löschen einer fehlenden Rolle gelingt)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Eine Rolle zuweisen / entziehen (eine doppelte Zuweisung oder fehlende Entziehung gelingt)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Eine NIP-86-Methode an einen Nicht-Admin-Pubkey vergeben / entziehen — nur Moderations- und Lesemethoden sind übertragbar</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>Methodenzuweisungen auflisten (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Eine IP blockieren / entblockieren (Blockieren trennt auch bestehende Verbindungen)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>Blockierte IPs auflisten</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Ein Event sperren (das Sperren einer unbekannten ID sperrt sie vorab; entfernt sie auch von der Allow-Liste)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Ein Event zur Allow-Liste hinzufügen (hebt auch die Sperre auf; das Erlauben einer unbekannten ID erlaubt sie vorab)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Ein Event von der Allow- / Ban-Liste entfernen (ein fehlender Eintrag gelingt)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>Gesperrte Events auflisten (eine fehlgeschlagene Suche meldet einen Fehler, niemals eine leere Liste)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>Erlaubte Events auflisten</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>Events, die auf Moderation warten (auf diesem Relay immer leer)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>NIP-43-Einladungscodes auflisten</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Einen NIP-43-Einladungscode ausstellen / widerrufen (ein Kind:28934 mit einem gelisteten Code lässt seinen Autor zu)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Delegierte Administration">
		<code>rpc.admin_pubkey</code> (und das Verwaltungstoken) bleiben der Root-Zugang mit allen Methoden. Andere Pubkeys authentifizieren sich mit NIP-98 und dürfen nur ihre per <code>assignmethod</code> zugewiesenen Methoden ausführen (<code>supportedmethods</code> zeigt ihre eigene Teilmenge). Berechtigungs-, Rollen-, Einladungscode- und Relay-Identitätsverwaltung bleiben Admin-only, sodass ein Begünstigter niemals eskalieren kann. Ein gesperrter Pubkey wird selbst mit Zuweisungen abgelehnt.
	</Callout>

	<Callout type="note" title="Bereitgestellt auf den öffentlichen POST /-Routen">
		Die NIP-86-RPC ist auf den öffentlichen POST /-Routen des Relays eingebunden. Änderungen werden in einem ratenbegrenzten Audit-Log (höchstens 600 Einträge pro Minute) mit der authentifizierten Identität aufgezeichnet. Anfragen über <code>rpc.max_admin_body_bytes</code> werden mit 413 abgelehnt.
	</Callout>
</div>
