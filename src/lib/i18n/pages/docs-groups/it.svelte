<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);
</script>

<DocsTitle
	title="Gruppi NIP-29"
	description="Gruppi NIP-29: spazi di chat chiusi in cui solo i membri possono scrivere, con eventi di moderazione e snapshot dello stato del gruppo firmati dal relay."
/>

<div class="doc-body">
	<h2>Abilitare i gruppi</h2>
	<ol>
		<li>
			Esegui <code>nostrfy genkey</code> per impostare <code>relay.private_key</code>
			(<strong>obbligatorio</strong> — senza di essa i metadati del gruppo non vengono generati).
		</li>
		<li>Riavvia il relay.</li>
	</ol>

	<h2>Come funzionano i gruppi</h2>
	<p>
		I gruppi vengono creati e moderati tramite eventi. Da questi eventi di moderazione il relay genera
		istantanee firmate dal relay che i client usano per la visualizzazione:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Evento</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Crea gruppo (il creatore diventa admin)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Aggiungi membro (con ruoli) / rimuovi membro</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Modifica i metadati (nome, descrizione, pubblico/privato, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Elimina evento (moderazione)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Elimina gruppo (i suoi eventi memorizzati vengono eliminati)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Crea codice di invito</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Aggiorna l’elenco dei messaggi fissati in alto</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Richiesta di ingresso / richiesta di uscita</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Istantanee firmate dal relay</h3>
	<ul>
		<li><code>kind:39000</code> — metadati del gruppo (nome, impostazioni di visibilità, ...)</li>
		<li><code>kind:39001</code> — elenco admin</li>
		<li><code>kind:39002</code> — elenco membri</li>
		<li><code>kind:39005</code> — eventi fissati in alto</li>
	</ul>

	<h2>Impostazioni di visibilità del gruppo</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Tag</th>
				<th>Significato</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Solo i membri possono leggere i messaggi</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Solo i membri possono scrivere</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>I metadati sono nascosti ai non membri</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Le richieste di ingresso non sono approvate automaticamente (codici di invito obbligatori)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>Il gruppo ha una stanza audio/video LiveKit</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Sottogruppi</h2>
	<p>
		I gruppi possono essere gerarchici — annidati con tag <code>parent</code> / <code>child</code>. I cicli vengono
		rifiutati automaticamente.
	</p>

	<Callout type="warning" title="Uscire da un gruppo">
		Qualsiasi membro — incluso l’ultimo admin del gruppo — può uscire con <code>kind:9022</code> e viene
		rimosso automaticamente; se l’ultimo admin esce, il gruppo resta senza admin. Nomina prima un altro admin,
		oppure elimina il gruppo con <code>kind:9008</code>, oppure recupera un gruppo senza admin firmando un
		evento di moderazione con la chiave propria del relay (<code>relay.private_key</code>, la pubkey del relay stesso annunciata in NIP-11).
		Vedi <a href={p('/docs/troubleshooting/')}>risoluzione dei problemi</a> per la procedura.
	</Callout>
</div>
