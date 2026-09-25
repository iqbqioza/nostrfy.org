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
	title="LiveKit audio &amp; video rooms"
	description="Audio and video rooms for NIP-29 groups via a LiveKit server: token endpoints, JWT signing and the group metadata that advertises rooms."
/>

<div class="doc-body">
	<h2>Setup</h2>
	<ol>
		<li>
			Set <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> and
			<code>relay.livekit_api_secret</code> in the config file.
		</li>
		<li>
			Add the <code>livekit</code> tag to a group's metadata via an admin's
			<code>kind:9002</code> edit.
		</li>
		<li>
			Clients fetch a JWT from <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> with NIP-98
			auth (a pubkey banned with NIP-86 <code>banpubkey</code> is refused).
		</li>
	</ol>

	<h2>Checking support</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 means the room server is enabled."
	/>

	<h3>Configuration</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		LiveKit settings are fixed at startup — changing them requires a restart.
	</Callout>
</div>