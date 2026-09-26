<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('it', path);
</script>

<DocsTitle
	title="Riferimento ai NIP supportati"
	description="Tutti i NIP lato relay implementati da nostrfy — kind, note e avvertenze — e come viene calcolata dinamicamente la lista supported_nips di NIP-11."
/>

<div class="doc-body">
	<h2>NIP implementati</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Descrizione</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Protocollo di base (eventi, sottoscrizioni)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Eliminazione degli eventi</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Documento informativo del relay</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Proof of work</td>
			</tr>
			<tr>
				<td>17</td>
				<td>DM privati (kind 14 avvolto in kind 15; i gift wrap kind 1059 ed effimero kind 21059 sono serviti solo al destinatario quando l’auth NIP-42 è attiva)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Commenti (kind 1111, thread tramite indice #e)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Firma delegata degli eventi</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Chat pubblica (lato client: memorizzata e servita come eventi normali, non pubblicizzata)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Gruppi basati su relay</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Etichette (kind 1985, indicizzato #l/#L)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Eventi sostituibili parametrizzati</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					Funzioni git (kind 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — opt-in tramite
					<code>relay.enabled_git</code>, disattivato per impostazione predefinita)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Timestamp di scadenza</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Autenticazione client</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Metadati di accesso al relay (ruoli) — kind 33534/13534/8000/8001 più effimeri 28934/28935/28936;
					i metadati firmati dal relay sono protetti da AUTH. I codici d’invito sono emessi con NIP-86
					<code>createclaim</code>/<code>deleteclaim</code>; un kind:28934 con un codice elencato ammette
					il suo autore
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Conteggio dei risultati (COUNT)</td>
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
				<td>Funzione di ricerca (testo libero, ordinata per rilevanza)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Zap Lightning (kind 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift wrap (servito solo al destinatario)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Richieste vanish</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Metadati lista relay</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Scoperta dei relay e attività (kind 30166/10166 memorizzati e serviti; autopubblica kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>Suggerimento di completezza EOSE</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Eventi protetti</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Sincronizzazione negentropy (una sostituzione fallita chiude la sessione con NEG-ERR secondo NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Dati specifici dell’applicazione (kind 30078, protetto da AUTH)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Evidenziazioni</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Asserzioni fidate (kind 30382/30383/30384/30385/10040, indirizzabili)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>API di gestione del relay</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Annunci Cashu e Fedimint (kind 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Sondaggi</td>
			</tr>
			<tr>
				<td>94</td>
				<td>Metadati dei file (kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>Auth HTTP</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Destinazioni di pagamento (kind 10133, sostituibile), una bozza; servito ma non pubblicizzato
					in <code>supported_nips</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) non è un NIP e non è pubblicizzato nel documento NIP-11 — è servito come
		file server separato sull’hostname <code>[blossom]</code>. Vedi la
		<a href={p('/docs/blossom/')}>pagina del file server Blossom</a> per i dettagli.
	</p>

	<h2>Pubblicizzazione dinamica dei NIP</h2>
	<p>
		La lista <code>supported_nips</code> non è statica: un NIP ne viene rimosso quando ogni kind definito dal
		NIP è rifiutato dal controllo d’accesso del relay.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — bloccare tutti i kind di un NIP lo nasconde (es. bloccare il
			kind 5 nasconde NIP-09). Bloccarne solo alcuni mantiene il NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — un kind è accettato solo se elencato; un NIP i cui
			kind sono tutti non elencati viene nascosto.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — i kind effimeri non presenti nella lista di esenzione
			obbligatoria del NIP (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>) vengono rifiutati, quindi i NIP che dipendono da essi vengono nascosti.
		</li>
		<li>
			<strong>Prerequisiti</strong> — NIP-29, NIP-43 e NIP-66 si basano su eventi firmati dal relay e sono
			nascosti senza <code>relay.private_key</code>; NIP-86 è nascosto a meno che
			<code>rpc.management_token</code> o <code>rpc.admin_pubkey</code> sia impostato (altrimenti ogni
			chiamata di gestione viene rifiutata).
		</li>
		<li>
			I NIP senza kind dedicati (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) sono sempre pubblicizzati quando abilitati.
		</li>
	</ul>
	<p>
		Le modifiche a runtime — NIP-86 <code>allowkind</code>/<code>disallowkind</code>, o un ricaricamento SIGHUP di
		<code>reject_ephemeral</code> — si riflettono al successivo fetch NIP-11.
		<code>enabled_nips</code>/<code>disabled_nips</code> richiedono comunque un riavvio.
	</p>
</div>
