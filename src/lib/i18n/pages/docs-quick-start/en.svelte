<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # reload the config without a restart`;
</script>

<DocsTitle
	title="Quick start guide"
	description="From install to a live Nostr relay in minutes: write the config, validate it, start the daemon and run the first health check."
/>

<div class="doc-body">
	<h2>1. Create a configuration</h2>
	<p>
		<code>nostrfy init</code> writes a default, fully-commented <code>nostrfy.toml</code>:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Open it in a text editor and adjust it — every option is commented.</p>

	<h2>2. Validate the configuration</h2>
	<p>
		<code>nostrfy check</code> is strongly recommended before starting; if anything is wrong, it reports
		exactly what is wrong.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Start the relay</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="Runs as a daemon. Add --foreground to run in the terminal."
	/>
	<p>Then verify the relay is up with the health endpoint:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Point a client at it</h2>
	<p>
		From the same machine, connect to <code>ws://&lt;host&gt;:8080</code>. The default host is
		<code>127.0.0.1</code>, which only accepts local connections. To reach the relay from other machines,
		set <code>server.host = "0.0.0.0"</code> in the config:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		For <code>wss://</code> you need a TLS-terminating proxy (nginx or Caddy) in front — see the
		<a href="/docs/deploy/">deployment</a> docs.
	</p>

	<h2>5. Stop and restart</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart re-reads the config; SIGHUP reloads most settings without restarting."
	/>

	<h2>Effectively operating it</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> shows live statistics — also available over HTTP as
			<code>/relay/stats</code> and <code>/metrics</code>.
		</li>
		<li>The log runs to <code>daemon.log_file</code> with automatic rotation.</li>
		<li>
			<code>RUST_LOG</code> controls the log level (e.g. <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="External clients can't connect?">
		The default server.host is 127.0.0.1. Set host = "0.0.0.0" and restart.
	</Callout>

	<Callout type="tip" title="Next">
		Tune every aspect of the relay in the <a href="/docs/configuration/">configuration reference</a>.
	</Callout>
</div>