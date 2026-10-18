<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const support = 'curl -i http://127.0.0.1:8080/.well-known/nip29/livekit';
	const config = `[relay]
livekit_url = "wss://livekit.example.com"
livekit_api_key = "..."
livekit_api_secret = "..."
livekit_participants_interval_secs = 15`;
</script>

<DocsTitle
	title="LiveKit Audio- &amp; Videoräume"
	description="Audio- und Videoräume für NIP-29-Gruppen über einen LiveKit-Server: Token-Endpunkte, JWT-Signierung und die Gruppenmetadaten, die Räume bekannt machen."
/>

<div class="doc-body">
	<h2>Einrichtung</h2>
	<ol>
		<li>
			Setzen Sie <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> und
			<code>relay.livekit_api_secret</code> in der Konfigurationsdatei.
		</li>
		<li>
			Fügen Sie das <code>livekit</code>-Tag über eine <code>kind:9002</code>-Bearbeitung
			eines Admins zu den Metadaten einer Gruppe hinzu.
		</li>
		<li>
			Clients holen ein JWT von <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> mit NIP-98-Auth
			ab (ein per NIP-86-<code>banpubkey</code> gesperrter Pubkey wird abgewiesen).
		</li>
		<li>
			Das Relay veröffentlicht pro livekit-Gruppe eine <code>kind:39004</code>-Teilnehmerliste, aktualisiert alle <code>relay.livekit_participants_interval_secs</code> (Standard 15) und sofort, wenn LiveKit Webhooks an <code>/.well-known/nip29/livekit/webhook</code> sendet — richten Sie <code>webhook.urls</code> des LiveKit-Servers darauf und lassen Sie <code>webhook.api_key</code> zu <code>relay.livekit_api_key</code> passen (das Relay verifiziert die signierte Nutzlast; verpasste Events gleicht der Poll ab). Das Deaktivieren des LiveKit-Modus einer Gruppe löscht die Liste.
		</li>
	</ol>

	<h2>Unterstützung prüfen</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 bedeutet, dass der Raumserver aktiviert ist."
	/>

	<h3>Konfiguration</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		LiveKit-Einstellungen werden beim Start festgelegt — eine Änderung erfordert einen Neustart.
	</Callout>
</div>
