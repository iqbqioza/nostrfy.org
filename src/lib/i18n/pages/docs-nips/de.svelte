<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);
</script>

<DocsTitle
	title="Referenz der unterstützten NIPs"
	description="Jeder Relay-seitige NIP, den nostrfy implementiert — Kinds, Hinweise und Einschränkungen — und wie die supported_nips-Liste von NIP-11 dynamisch berechnet wird."
/>

<div class="doc-body">
	<h2>Implementierte NIPs</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Beschreibung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Basisprotokoll (Events, Subscriptions)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Löschen von Events</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Relay-Informationsdokument</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Proof of Work</td>
			</tr>
			<tr>
				<td>17</td>
				<td>Private DMs (Kind 14 verpackt in Kind 15; Gift Wraps der Kinds 1059 und ephemeral 21059 werden bei aktivierter NIP-42-Auth nur an den Empfänger ausgeliefert)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Kommentare (Kind 1111, Threads über den #e-Index)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Delegiertes Signieren von Events</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Öffentlicher Chat (clientseitig: als normale Events gespeichert und ausgeliefert, nicht beworben)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Relay-basierte Gruppen</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Labeling (Kind 1985, #l/#L indiziert)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Parametrisierte ersetzbare Events</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					git-Funktionen (Kinds 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — Opt-in per
					<code>relay.enabled_git</code>, standardmäßig deaktiviert)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Ablaufzeitstempel</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Client-Authentifizierung</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Relay-Zugriffsmetadaten (Rollen) — Kinds 33534/13534/8000/8001 plus ephemeral 28934/28935/28936;
					die Relay-signierten Metadaten sind AUTH-geschützt. Einladungscodes werden mit NIP-86
					<code>createclaim</code>/<code>deleteclaim</code> ausgestellt; ein kind:28934 mit einem gelisteten Code lässt
					seinen Autor zu
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Zählen von Ergebnissen (COUNT)</td>
			</tr>
			<tr>
				<td>46</td>
				<td>Nostr Connect</td>
			</tr>
			<tr>
				<td>47</td>
				<td>Nostr Wallet Connect</td>
			</tr>
			<tr>
				<td>50</td>
				<td>Suchfunktion (Volltext, relevanzsortiert)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Lightning-Zaps (Kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift Wrap (Auslieferung nur an den Empfänger)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Aufforderung zum Löschen</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Relay-Listen-Metadaten</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Relay-Erkennung &amp; Liveness (Kinds 30166/10166 werden gespeichert und ausgeliefert; veröffentlicht selbst Kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>EOSE-Vollständigkeitshinweis</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Geschützte Events</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Negentropy-Synchronisierung (eine fehlgeschlagene Ersetzung schließt die ID mit NEG-ERR gemäß NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Anwendungsspezifische Daten (Kind 30078, AUTH-geschützt)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Highlights</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Vertrauenswürdige Zusicherungen (Kinds 30382/30383/30384/30385/10040, adressierbar)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>Relay-Verwaltungs-API</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Cashu- und Fedimint-Ankündigungen (Kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Umfragen</td>
			</tr>
			<tr>
				<td>94</td>
				<td>Dateimetadaten (Kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>HTTP-Auth</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Zahlungsziele (Kind 10133, ersetzbar), ein Entwurf; wird ausgeliefert, aber nicht in
					<code>supported_nips</code> beworben
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) ist kein NIP und wird im NIP-11-Dokument nicht beworben — es wird als
		separater Dateiserver auf dem <code>[blossom]</code>-Hostnamen betrieben. Details siehe
		<a href={p('/docs/blossom/')}>Blossom-Dateiserver</a>-Seite.
	</p>

	<h2>Dynamische NIP-Ankündigung</h2>
	<p>
		Die <code>supported_nips</code>-Liste ist nicht statisch: Ein NIP wird daraus entfernt, wenn jeder Kind, den der
		NIP definiert, von der Zugriffskontrolle des Relays abgelehnt wird.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — Das Blockieren aller Kinds eines NIP blendet ihn aus (z. B. blendet das Blockieren von
			Kind 5 NIP-09 aus). Das Blockieren nur einzelner Kinds behält den NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — Ein Kind wird nur akzeptiert, wenn er gelistet ist; ein NIP, dessen
			Kinds alle nicht gelistet sind, wird ausgeblendet.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — Ephemere Kinds, die nicht in der NIP-vorgeschriebenen
			Ausnahmeliste stehen (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>), werden abgelehnt, sodass darauf angewiesene NIPs ausgeblendet werden.
		</li>
		<li>
			<strong>Voraussetzungen</strong> — NIP-29, NIP-43 und NIP-66 beruhen auf Relay-signierten Events und sind
			ohne <code>relay.private_key</code> ausgeblendet; NIP-86 ist ausgeblendet, sofern nicht
			<code>rpc.management_token</code> oder <code>rpc.admin_pubkey</code> gesetzt ist (sonst wird jeder
			Verwaltungsaufruf abgelehnt).
		</li>
		<li>
			NIPs ohne eigene Kinds (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) werden bei Aktivierung immer beworben.
		</li>
	</ul>
	<p>
		Laufzeitänderungen — NIP-86 <code>allowkind</code>/<code>disallowkind</code> oder ein SIGHUP-Neuladen von
		<code>reject_ephemeral</code> — werden beim nächsten NIP-11-Abruf sichtbar.
		<code>enabled_nips</code>/<code>disabled_nips</code> erfordern weiterhin einen Neustart.
	</p>
</div>
