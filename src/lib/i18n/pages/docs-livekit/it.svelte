<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const support = 'curl -i http://127.0.0.1:8080/.well-known/nip29/livekit';
	const config = `[relay]
livekit_url = "wss://livekit.example.com"
livekit_api_key = "..."
livekit_api_secret = "..."`;
</script>

<DocsTitle
	title="Stanze audio &amp; video LiveKit"
	description="Stanze audio e video per i gruppi NIP-29 tramite un server LiveKit: endpoint dei token, firma JWT e metadati del gruppo che pubblicizzano le stanze."
/>

<div class="doc-body">
	<h2>Configurazione</h2>
	<ol>
		<li>
			Imposta <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> e
			<code>relay.livekit_api_secret</code> nel file di configurazione.
		</li>
		<li>
			Aggiungi il tag <code>livekit</code> ai metadati di un gruppo tramite una modifica
			<code>kind:9002</code> di un amministratore.
		</li>
		<li>
			I client ottengono un JWT da <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> con autenticazione
			NIP-98 (una chiave pubblica bannata con <code>banpubkey</code> NIP-86 viene rifiutata).
		</li>
	</ol>

	<h2>Verifica del supporto</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 significa che il server delle stanze è abilitato."
	/>

	<h3>Configurazione</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		Le impostazioni di LiveKit sono fissate all’avvio — modificarle richiede un riavvio.
	</Callout>
</div>
