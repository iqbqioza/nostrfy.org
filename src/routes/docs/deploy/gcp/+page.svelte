<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # set name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Deploying on Google Cloud"
	description="Deploy nostrfy on Google Cloud Compute Engine or Cloud Run — step by step, with systemd, TLS and the scale-to-zero caveats."
/>

<div class="doc-body">
	<p>
		Options: <strong>Compute Engine</strong> (VM, recommended) or <strong>Cloud Run</strong>
		(containers).
	</p>

	<h2>Option 1: Compute Engine (recommended)</h2>
	<ol>
		<li>
			<strong>Create a VM</strong>: Ubuntu 24.04 LTS (or Debian), <code>e2-small</code> (2 GB) is
			enough to start. Choose a region close to your users.
		</li>
		<li>
			<strong>Firewall rule</strong>: allow inbound TCP <code>8080</code> (and <code>443</code> for
			TLS). Under <strong>Network → Firewall</strong>, create a rule with the target tags you assigned
			to the VM.
		</li>
		<li>
			<strong>SSH in</strong> (the console's SSH button works) and follow the generic
			<a href="/docs/deploy/vps/">VPS guide</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Reserve a static IP</strong> (External IP → Reserve) so <code>public_url</code> stays
			valid across reboots.
		</li>
		<li>
			<strong>Verify</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>Add TLS (<code>wss://</code>)</strong> with certbot + nginx (as in the
			<a href="/docs/deploy/vps/">VPS guide</a>) or a GCP load balancer with a managed certificate.
		</li>
	</ol>

	<h2>Option 2: Cloud Run (container)</h2>
	<p>
		Cloud Run builds from the repository <code>Dockerfile</code> (which downloads the pre-built release
		binary):
	</p>
	<ol>
		<li>
			<strong>Create a service from the GitHub repo</strong> (or push the image to Artifact
			Registry).
		</li>
		<li>
			<strong>Port</strong>: set the container port to <code>8080</code>.
		</li>
		<li>
			<strong>Allocate memory</strong>: at least 512 MB (LMDB + the async runtime).
		</li>
		<li>
			<strong>Persistent storage</strong>: attach a <strong>Cloud Run volume (filestore/gcsfuse)</strong>
			at <code>/data</code> — LMDB needs a filesystem, so a GCS FUSE mount at <code>/data</code> works
			for persistence.
		</li>
		<li>
			<strong>TLS</strong>: Cloud Run provides <code>https://</code> automatically — set
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (or your custom domain).
		</li>
	</ol>

	<Callout type="note" title="Cloud Run scales to zero by default">
		For a relay, set <strong>min instances = 1</strong> so it never goes cold. The
		<code>deploy/nostrfy.container.toml</code> baked into the image can be replaced by mounting your
		own <code>nostrfy.toml</code> at <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>