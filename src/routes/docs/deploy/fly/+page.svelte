<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # shown in clients via NIP-11
description = "A friendly relay for everyone"
private_key = "..."                            # required for NIP-29 groups
public_url = "wss://<your-app-name>.fly.dev"   # required for NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# log line: "relay listening on ws://0.0.0.0:8080"
fly logs

# NIP-11 information document over the public address
curl https://<your-app-name>.fly.dev/

# point your Nostr client at wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="Fly.io"
	description="Deploy to Fly.io in a few minutes with the ready-made template."
/>

<div class="doc-body">
	<h2>What ships in the repo</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>File</th>
				<th>Purpose</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Container image — <strong>downloads the pre-built release binary</strong> from the GitHub
					release assets (x86_64 / aarch64, chosen by the build architecture) and verifies its
					sha256 checksum. No compilation happens on Fly
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Fly app configuration: HTTP service on port 8080, health checks, the
					<code>/data</code> volume mount, always-on machines
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					The relay configuration baked into the image at
					<code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Prerequisites</h2>
	<ul>
		<li>A Fly.io account</li>
		<li>The flyctl CLI (<code>fly version</code>)</li>
		<li>Logged in: <code>fly auth login</code></li>
	</ul>

	<h2>Deploy in four steps</h2>

	<h3>1. Launch the app (without deploying yet)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> must be unique on Fly (it becomes part of the relay URL:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>: e.g. <code>nrt</code> (Tokyo), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — pick the region closest to your users
		</li>
		<li>
			This may overwrite the template's <code>fly.toml</code> values (app name, region) — that is
			fine
		</li>
	</ul>

	<h3>2. Create the persistent volume</h3>
	<p>The LMDB database lives on a Fly volume mounted at <code>/data</code>:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB is enough to start (the database grows with usage). You can resize later, or create a larger
		volume from the start.
	</p>

	<h3>3. Configure the relay</h3>
	<p>Edit <code>deploy/nostrfy.container.toml</code> before deploying:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>: generate locally with <code>nostrfy genkey</code> (against a
			temporary config) and paste the key, or generate one with any Nostr tool
		</li>
		<li>
			<code>public_url</code> <strong>must</strong> match your app name — without it, NIP-42 AUTH,
			NIP-62 vanish and the NIP-86 management API will not work
		</li>
		<li>Everything else can stay at the defaults</li>
	</ul>

	<h3>4. Deploy</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly builds the image (a few minutes — the binary download is fast, the image is small), creates a
		machine and runs the health check against <code>/health</code>.
	</p>

	<h2>Verify</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Scaling and updates</h2>
	<ul>
		<li>
			<strong>Update the relay</strong>: edit <code>deploy/nostrfy.container.toml</code> and
			<code>fly deploy</code> again — the image always downloads the <strong>latest</strong> GitHub
			release binary, so an update is a simple redeploy
		</li>
		<li>
			<strong>Pin a version</strong>: <code>docker build --build-arg NOSTRFY_VERSION=v0.1.14 ...</code>
			or change the <code>ARG</code> in the Dockerfile
		</li>
		<li>
			<strong>Scale</strong>: the relay is a single machine by default.
			<code>fly machines clone &lt;id&gt;</code> creates a second machine; both share the volume (Fly
			volumes support multiple machines in the same region)
		</li>
		<li>
			<strong>Metrics</strong>: Fly collects the <code>/metrics</code> endpoint (see
			<code>[metrics]</code> in <code>fly.toml</code>) and shows it in the Fly dashboard under Metrics
		</li>
	</ul>

	<h2>Customizing the configuration</h2>
	<p>
		The image reads <code>/etc/nostrfy/nostrfy.toml</code>, baked from
		<code>deploy/nostrfy.container.toml</code>. Two ways to customize:
	</p>
	<ol>
		<li>
			<strong>Edit <code>deploy/nostrfy.container.toml</code> in the repository</strong> and redeploy
			(simplest)
		</li>
		<li>
			<strong>Mount your own config</strong>: build a fork of the image that copies your config file
			over <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>Every option is documented in the <a href="/docs/configuration/">configuration reference</a>.</p>

	<h2>Notes</h2>
	<ul>
		<li>
			<strong>Always-on by design</strong>: <code>auto_stop_machines = false</code> in
			<code>fly.toml</code> — a relay must never be stopped during idle periods
		</li>
		<li>
			The container runs the relay in <strong>foreground mode</strong>
			(<code>nostrfy start --foreground</code>); logs go to stdout/stderr and are collected by Fly
		</li>
		<li>
			TLS is terminated by Fly; the relay itself serves plain WebSocket on port 8080
		</li>
		<li>
			<strong>Blossom media host</strong>: to serve the Blossom server too, set
			<code>blossom.host = "media.example.com"</code> in the config, add
			<code>media.example.com</code> as an <strong>additional hostname</strong> of the same Fly app
			(<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> or
			<code>fly hostnames</code>), and add the <code>media.</code> TLS certificate in the Fly
			dashboard — the relay splits the hosts internally (like <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS is terminated by Fly">
		The relay itself serves plain WebSocket on port 8080.
	</Callout>
</div>
