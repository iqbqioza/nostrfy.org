<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const commonBlock = `# 1. Install the latest release binary (no sudo needed for the install itself)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Fetch the config template and edit it (no repository clone needed)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # set name, public_url, private_key

# 3. Fetch the systemd unit and start the service
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Open the port (usually 8080) in the provider's firewall and verify
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # required for NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # run 'nostrfy genkey' and paste the key`;
</script>

<DocsTitle
	title="Deployment overview"
	description="How nostrfy is distributed and how to deploy it — Fly.io, AWS, Google Cloud, Azure, DigitalOcean or any VPS, with TLS, systemd and container notes."
/>

<div class="doc-body">
	<h2>One binary, several platforms</h2>
	<p>
		nostrfy ships pre-built binaries for <strong>x86_64</strong> and <strong>aarch64</strong> (GitHub
		release assets, checksum-verified by <code>install.sh</code>), a container image that
		<strong>downloads those binaries</strong> (no compilation needed), and deployment guides for the
		major platforms.
	</p>

	<h2>Platforms</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Platform</th>
				<th>Type</th>
				<th>Guide</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Managed platform (containers, volumes, TLS)</td>
				<td><a href="/docs/deploy/fly/">fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) or App Platform</td>
				<td><a href="/docs/deploy/digitalocean/">deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail or ECS</td>
				<td><a href="/docs/deploy/aws/">deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) or Cloud Run</td>
				<td><a href="/docs/deploy/gcp/">deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM or Container Apps</td>
				<td><a href="/docs/deploy/azure/">deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Any VPS</strong></td>
				<td>plain Ubuntu/Debian server</td>
				<td><a href="/docs/deploy/vps/">deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>The common pattern for VMs</h2>
	<p>All the VM guides (Digital Ocean, AWS EC2, GCP, Azure, any VPS) follow the same pattern:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Before going live</h2>
	<p>
		Every deployment uses the same <code>nostrfy.toml</code> options. Before going live, set at least:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM or container?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong>: simplest, cheapest, full control. Recommended for most relay
			deployments.
		</li>
		<li>
			<strong>Container</strong>: use the repository <code>Dockerfile</code> (downloads the release
			binary at build time) on Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run or Azure
			Container Apps. Persistent storage is required for the LMDB data (<code>/data</code>).
		</li>
	</ul>

	<h2>Blossom media host</h2>
	<p>
		If <code>blossom.host</code> is set, point that hostname at the same port in the TLS proxy too (see
		the <a href="/docs/deploy/vps/">VPS guide</a> for nginx/Caddy blocks).
	</p>

	<Callout type="warning" title="TLS is terminated by your proxy or the provider">
		The relay itself serves plain WebSocket on 8080 and honors X-Forwarded-Proto.
	</Callout>
</div>