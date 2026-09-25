<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # set name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="Deploying on Azure"
	description="Deploy nostrfy on an Azure VM or Azure Container Apps — step by step, with systemd, TLS and the caveats of dynamic public IPs."
/>

<div class="doc-body">
	<p>
		Options: <strong>VM</strong> (recommended), or <strong>Container Apps</strong>.
	</p>

	<h2>Option 1: Virtual Machine (recommended)</h2>
	<ol>
		<li>
			<strong>Create a VM</strong>: Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 GB) or
			<code>Standard_B2s</code> (2 GB) to start. Choose a region close to your users.
		</li>
		<li>
			<strong>Network security group (NSG)</strong>: add an inbound rule for TCP <code>8080</code>
			(and <code>443</code> for TLS). Restrict the SSH rule to your IP.
		</li>
		<li>
			<strong>SSH in</strong> and follow the generic <a href="/docs/deploy/vps/">VPS guide</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Verify</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Add TLS (<code>wss://</code>)</strong> with certbot + nginx (as in the
			<a href="/docs/deploy/vps/">VPS guide</a>) or an Azure Application Gateway with a certificate.
		</li>
	</ol>

	<Callout type="note" title="An Azure VM's public IP can change on deallocation">
		Use a <strong>static public IP</strong> so <code>relay.public_url</code> stays valid.
	</Callout>

	<h2>Option 2: Azure Container Apps</h2>
	<p>
		Container Apps builds from the repository <code>Dockerfile</code> (which downloads the pre-built
		release binary):
	</p>
	<ol>
		<li>
			<strong>Create a Container App</strong> from the GitHub repo (or push the image to ACR).
		</li>
		<li>
			<strong>Port</strong>: set the container port to <code>8080</code>.
		</li>
		<li>
			<strong>Memory</strong>: at least 1 GB.
		</li>
		<li>
			<strong>Persistent storage</strong>: mount an <strong>Azure Storage file share</strong> at
			<code>/data</code> for the LMDB data.
		</li>
		<li>
			<strong>TLS</strong>: Container Apps provides <code>https://</code> on the app URL — set
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (or a
			custom domain).
		</li>
	</ol>

	<Callout type="note" title="A relay must never scale to zero">
		Set <strong>min replicas = 1</strong>. The baked <code>deploy/nostrfy.container.toml</code> can be
		replaced by mounting your own <code>nostrfy.toml</code> at
		<code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>