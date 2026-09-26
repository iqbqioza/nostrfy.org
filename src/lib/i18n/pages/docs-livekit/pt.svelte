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
	title="Salas de áudio e vídeo LiveKit"
	description="Salas de áudio e vídeo para grupos NIP-29 com um servidor LiveKit: endpoints de tokens, assinatura JWT e os metadados de grupo que anunciam as salas."
/>

<div class="doc-body">
	<h2>Configuração</h2>
	<ol>
		<li>
			Defina <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> e
			<code>relay.livekit_api_secret</code> no arquivo de configuração.
		</li>
		<li>
			Adicione a tag <code>livekit</code> aos metadados do grupo com uma edição
			<code>kind:9002</code> feita por um administrador.
		</li>
		<li>
			Os clientes obtêm um JWT de <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> com autenticação
			NIP-98 (uma chave pública banida com <code>banpubkey</code> do NIP-86 é recusada).
		</li>
	</ol>

	<h2>Verificar o suporte</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="O código 204 significa que o servidor de salas está ativado."
	/>

	<h3>Configuração</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		As configurações do LiveKit são fixas na inicialização — alterá-las exige reiniciar.
	</Callout>
</div>
