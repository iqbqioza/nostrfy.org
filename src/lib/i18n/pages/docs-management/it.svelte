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
	title="Gestione NIP-86"
	description="L’API di gestione JSON-RPC: moderazione, liste di accesso, identità del relay, ruoli, codici di invito e deleghe di metodi, con autenticazione Bearer o NIP-98."
/>

<div class="doc-body">
	<h2>Abilitazione</h2>
	<p>
		NIP-86 è un’API JSON-RPC per gestire il relay. Richiede uno dei due metodi di autenticazione, altrimenti ogni chiamata viene rifiutata:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Metodo</th>
				<th>Configurazione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Token Bearer</td>
				<td>
					Imposta <code>rpc.management_token</code> e invia <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Imposta <code>rpc.admin_pubkey</code> e invia un evento di autenticazione NIP-98 (kind 27235) firmato dalla chiave admin in <code>Authorization: Nostr &lt;base64&gt;</code> — è richiesto un tag <code>payload</code>; ogni evento è monouso entro la sua finestra di 60 secondi
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Chiamare l’API</h2>
	<p>POST / con <code>Content-Type: application/nostr+json+rpc</code>:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Metodi</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Metodo</th>
				<th>Parametri</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>Elenco dei metodi supportati</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Bannare una pubkey dalla pubblicazione (la rimuove anche dalla allowlist)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Rimuovere il ban di una pubkey</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>Elencare le pubkey bannate e i motivi</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Aggiungere alla allowlist (rimuove anche il ban)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Rimuovere dalla allowlist</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>Elencare la allowlist</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Consentire / vietare un kind</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>Elencare i kind consentiti / vietati</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Cambiare nome / descrizione / icona del relay (persistito nel file di configurazione; segnala un errore quando il file non può essere scritto)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>Gestione dei ruoli NIP-43 (i campi con tipo errato vengono rifiutati; eliminare un ruolo mancante riesce)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Assegnare / revocare un ruolo (una concessione duplicata o una revoca mancante riesce)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Concedere / revocare un metodo NIP-86 a una pubkey non admin — solo i metodi di moderazione e lettura sono delegabili</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>Elencare le concessioni di metodi (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Bloccare / sbloccare un IP (il blocco interrompe anche le connessioni esistenti)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>Elencare gli IP bloccati</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Bannare un evento (bannare un id sconosciuto lo pre-banna; lo rimuove anche dalla allowlist)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Aggiungere un evento alla allowlist (toglie anche il ban; consentire un id sconosciuto lo pre-consente)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Rimuovere un evento dalla allowlist/banlist (una voce mancante riesce)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>Elencare gli eventi bannati (una ricerca fallita restituisce un errore, mai una lista vuota)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>Elencare gli eventi consentiti</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>Eventi in attesa di moderazione (sempre vuoto su questo relay)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>Elencare i codici di invito NIP-43</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Emettere / revocare un codice di invito NIP-43 (un kind:28934 con un codice elencato ammette il suo autore)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Amministrazione delegata">
		<code>rpc.admin_pubkey</code> (e il token di gestione) resta l’accesso root con tutti i metodi. Le altre pubkey si autenticano con NIP-98 e possono eseguire solo i metodi concessi via <code>assignmethod</code> (<code>supportedmethods</code> mostra il proprio sottoinsieme). La gestione di permessi, ruoli, codici di invito e identità del relay resta solo admin, quindi un beneficiario non può mai escalare. Una pubkey bannata viene rifiutata anche con concessioni.
	</Callout>

	<Callout type="note" title="Servito sulle rotte pubbliche POST /">
		L’RPC NIP-86 è montato sulle rotte pubbliche POST / del relay. Le modifiche sono registrate in un audit log con limitazione della frequenza (al massimo 600 voci al minuto), con l’identità autenticata. Le richieste oltre <code>rpc.max_admin_body_bytes</code> vengono rifiutate con 413.
	</Callout>
</div>
