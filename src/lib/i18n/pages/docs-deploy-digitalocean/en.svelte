<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # set name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Deploying on DigitalOcean"
	description="Deploy nostrfy on a DigitalOcean Droplet or App Platform — step by step, with systemd, TLS and a production-ready configuration."
/>

<div class="doc-body">
	<p>
		Two options: a <strong>Droplet</strong> (VM, simplest) or the <strong>App Platform</strong>
		(containers).
	</p>

	<h2>Option 1: Droplet (recommended)</h2>
	<ol>
		<li>
			<strong>Create a Droplet</strong>: Ubuntu 24.04 LTS, any size (1 GB RAM is enough to start). A
			Droplet in a region close to your users lowers latency.
		</li>
		<li>
			<strong>SSH in</strong> and follow the generic
			<a href="/docs/deploy/vps/">VPS guide</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Open the port</strong> in the Droplet firewall (the
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			> is recommended): allow inbound TCP <code>8080</code> (and <code>443</code> if you add TLS).
		</li>
		<li>
			<strong>Verify</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Add TLS (<code>wss://</code>)</strong> with certbot + nginx, or
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean's managed load balancer</a
			> with a certificate — then set
			<code>relay.public_url = "wss://relay.example.com"</code> and restart.
		</li>
	</ol>

	<h2>Option 2: App Platform (container)</h2>
	<p>
		The App Platform builds from the repository <code>Dockerfile</code> (which downloads the pre-built
		release binary):
	</p>
	<ol>
		<li><strong>Connect your GitHub repo</strong> and create an app from it.</li>
		<li>
			<strong>Port</strong>: set the HTTP port to <code>8080</code> (the relay listens there).
		</li>
		<li>
			<strong>Persistent disk</strong>: mount a volume at <code>/data</code> (LMDB data lives there —
			without it, data is lost on every deploy).
		</li>
		<li>
			<strong>Env</strong>: the <code>deploy/nostrfy.container.toml</code> baked into the image can be
			replaced by mounting your own config at <code>/etc/nostrfy/nostrfy.toml</code> (create a fork
			that copies it, or use a Dockerfile <code>COPY</code> in your own repo).
		</li>
		<li>
			<strong>TLS</strong>: App Platform provides <code>https://</code> automatically for the app
			domain — set <code>relay.public_url</code> accordingly.
		</li>
	</ol>

	<h2>Both options</h2>
	<ul>
		<li>
			Updates: re-run <code>install.sh</code> + <code>systemctl restart nostrfy</code> (Droplet), or
			push to the connected repo (App Platform).
		</li>
		<li>
			All configuration is documented in the
			<a href="/docs/configuration/">configuration reference</a>.
		</li>
	</ul>
</div>
