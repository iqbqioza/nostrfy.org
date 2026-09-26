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
	title="Salons audio &amp; vidéo LiveKit"
	description="Salons audio et vidéo pour les groupes NIP-29 via un serveur LiveKit : points de terminaison de jetons, signature JWT et métadonnées de groupe qui annoncent les salons."
/>

<div class="doc-body">
	<h2>Configuration</h2>
	<ol>
		<li>
			Définissez <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> et
			<code>relay.livekit_api_secret</code> dans le fichier de configuration.
		</li>
		<li>
			Ajoutez le tag <code>livekit</code> aux métadonnées d’un groupe via une modification
			<code>kind:9002</code> effectuée par un administrateur.
		</li>
		<li>
			Les clients récupèrent un JWT depuis <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> avec
			l’authentification NIP-98 (une clé publique bannie via <code>banpubkey</code> NIP-86 est refusée).
		</li>
	</ol>

	<h2>Vérification de la prise en charge</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 signifie que le serveur de salles est activé."
	/>

	<h3>Configuration</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		Les paramètres LiveKit sont fixés au démarrage — toute modification nécessite un redémarrage.
	</Callout>
</div>
