<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);
</script>

<DocsTitle
	title="NIP-29-Gruppen"
	description="NIP-29-Gruppen: geschlossene Chaträume, in denen nur Mitglieder schreiben können, mit Moderations-Events und Relay-signierten Snapshots des Gruppenstatus."
/>

<div class="doc-body">
	<h2>Gruppen aktivieren</h2>
	<ol>
		<li>
			Führen Sie <code>nostrfy genkey</code> aus, um <code>relay.private_key</code> zu setzen
			(<strong>erforderlich</strong> — ohne ihn werden keine Gruppenmetadaten erzeugt).
		</li>
		<li>Starten Sie das Relay neu.</li>
	</ol>

	<h2>So funktionieren Gruppen</h2>
	<p>
		Gruppen werden durch Events erstellt und moderiert. Aus diesen Moderations-Events erzeugt das Relay
		Relay-signierte Snapshots, die Clients zur Anzeige verwenden:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Event</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Gruppe erstellen (der Ersteller wird Admin)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Mitglied hinzufügen (mit Rollen) / Mitglied entfernen</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Metadaten bearbeiten (Name, Beschreibung, öffentlich/privat, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Event löschen (Moderation)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Gruppe löschen (ihre gespeicherten Events werden gelöscht)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Einladungscode erstellen</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Pin-Liste aktualisieren</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Beitrittsanfrage / Austrittsanfrage</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Relay-signierte Snapshots</h3>
	<ul>
		<li><code>kind:39000</code> — Gruppenmetadaten (Name, Sichtbarkeitseinstellungen, ...)</li>
		<li><code>kind:39001</code> — Admin-Liste</li>
		<li><code>kind:39002</code> — Mitgliederliste</li>
		<li><code>kind:39005</code> — angepinnte Events</li>
	</ul>

	<h2>Sichtbarkeitseinstellungen der Gruppe</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Tag</th>
				<th>Bedeutung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Nur Mitglieder können Nachrichten lesen</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Nur Mitglieder können schreiben</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>Metadaten sind für Nichtmitglieder verborgen</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Beitrittsanfragen werden nicht automatisch genehmigt (Einladungscodes erforderlich)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>Die Gruppe hat einen LiveKit-Audio-/Videoraum</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Untergruppen</h2>
	<p>
		Gruppen können hierarchisch sein — verschachtelt mit <code>parent</code>- / <code>child</code>-Tags. Zyklen werden
		automatisch abgewiesen.
	</p>

	<Callout type="warning" title="Gruppe verlassen">
		Jedes Mitglied — einschließlich des letzten Admins der Gruppe — kann mit <code>kind:9022</code> austreten und wird
		automatisch entfernt; wenn der letzte Admin austritt, hat die Gruppe keine Admins mehr. Ernennen Sie zuerst einen weiteren Admin,
		oder löschen Sie die Gruppe mit <code>kind:9008</code>, oder stellen Sie eine adminlose Gruppe wieder her, indem Sie ein
		Moderations-Event mit dem eigenen Schlüssel des Relays signieren (<code>relay.private_key</code>, der NIP-11-Self-Pubkey).
		Siehe <a href={p('/docs/troubleshooting/')}>Fehlerbehebung</a> für die Anleitung.
	</Callout>
</div>
