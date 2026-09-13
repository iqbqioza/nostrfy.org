<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Introduction"
	description="What nostrfy is, what it does out of the box, and the ideas that shape how it is built and run."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> is a relay server for the
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a> protocol. It stores
		events (posts, reactions, profiles, …) sent by clients and delivers them in response to
		subscription requests.
	</p>

	<h2>Key features</h2>
	<ul>
		<li><strong>Simple and stable</strong> — written in Rust; a single binary does everything.</li>
		<li>
			<strong>Fast storage and search</strong> — LMDB database with a full-text search index (NIP-50).
		</li>
		<li>
			<strong>Broad NIP support</strong> — 36 NIPs implemented, plus the Blossom file server:
			deletion, proof-of-work, delegation, groups, search and a management API.
		</li>
		<li>
			<strong>Easy to operate</strong> — daemon mode, log rotation, hot configuration reload
			(SIGHUP), live statistics, a REST API and Prometheus metrics.
		</li>
	</ul>

	<h2>What you get out of the box</h2>
	<p>
		A single <code>nostrfy</code> binary on one port serves:
	</p>
	<ul>
		<li>The <strong>WebSocket relay</strong> and the NIP-11 information document.</li>
		<li>A read-only <strong>REST API</strong> at <code>/api/v1/...</code> — its own reader thread means REST traffic can never stall WebSocket subscribers.</li>
		<li>The <strong>Blossom file server</strong> (media hosting) on its own hostname.</li>
		<li>The <strong>NIP-86 management RPC</strong>, health check and Prometheus <code>/metrics</code>.</li>
	</ul>

	<h2>Resource profile</h2>
	<p>
		nostrfy is verified to run on a <strong>0.25 vCPU / 512 MB VPS</strong>. The LMDB memory map is a
		sparse 1 TiB virtual reservation — physical disk grows only with real data — and process memory
		stays flat: a relay with a 252 MB database held <strong>7.9 MB of private RSS</strong>.
	</p>

	<h2>A quick feel for it</h2>
	<p>Install, initialize and start in three commands:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Then verify the relay is up:</p>
	<CodeBlock code={health} lang="bash" />
	<p>And fetch its NIP-11 document:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Where to go next">
		Follow the <a href="/docs/quick-start/">quick start</a> for your first run, or skip straight to
		the <a href="/docs/configuration/">configuration reference</a> to tune the relay.
	</Callout>
</div>