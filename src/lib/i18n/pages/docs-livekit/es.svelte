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
	title="Salas de audio y vídeo de LiveKit"
	description="Salas de audio y vídeo para grupos NIP-29 mediante un servidor LiveKit: endpoints de tokens, firma JWT y los metadatos de grupo que anuncian las salas."
/>

<div class="doc-body">
	<h2>Preparación</h2>
	<ol>
		<li>
			Establece <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> y
			<code>relay.livekit_api_secret</code> en el archivo de configuración.
		</li>
		<li>
			Añade la etiqueta <code>livekit</code> a los metadatos de un grupo mediante una edición
			<code>kind:9002</code> de un administrador.
		</li>
		<li>
			Los clientes obtienen un JWT de <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> con autenticación
			NIP-98 (una clave pública vetada con <code>banpubkey</code> de NIP-86 es rechazada).
		</li>
	</ol>

	<h2>Comprobar la compatibilidad</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 significa que el servidor de salas está habilitado."
	/>

	<h3>Configuración</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		Los ajustes de LiveKit se fijan al arrancar — cambiarlos requiere un reinicio.
	</Callout>
</div>
