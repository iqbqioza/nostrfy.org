<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const installCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --version`;
	const configFetch = `sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml`;
	const relConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # your public address
private_key = "..."                      # run 'nostrfy genkey' locally and paste the key

[server]
host = "0.0.0.0"                         # already set in the template
port = 8080`;
	const genkeyCmd = `nostrfy --config /tmp/nostrfy-genkey.toml init && nostrfy --config /tmp/nostrfy-genkey.toml genkey`;
	const serviceCmd = `sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy
sudo systemctl status nostrfy`;
	const logsCmd = `journalctl -u nostrfy -f`;
	const ufwCmd = `sudo ufw allow 8080/tcp`;
	const verifyCmd = `curl http://localhost:8080/health
curl http://<server-ip>:8080/health        # from your laptop`;
	const nginxConf = `server {
    listen 443 ssl;
    server_name relay.example.com;

    ssl_certificate     /etc/letsencrypt/live/relay.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/relay.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
	const caddyConf = `relay.example.com {
    reverse_proxy 127.0.0.1:8080
}`;
	const nginxMedia = `server {
    listen 443 ssl;
    server_name media.example.com;

    ssl_certificate     /etc/letsencrypt/live/media.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/media.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;
	const caddyMedia = `media.example.com {
    reverse_proxy 127.0.0.1:8080
}`;
	const backupCmd = `sudo systemctl stop nostrfy
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # your database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# piped installs never ask for confirmation: use --force to overwrite an
# existing binary (or run the script from a terminal and answer y/N)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Deploying on any VPS"
	description="The generic guide for a plain Ubuntu or Debian VPS — the base for every other platform guide, with systemd, TLS and firewall notes."
/>

<div class="doc-body">
	<p>
		This is the generic guide for a plain Linux VPS (any provider — Hetzner, Vultr, Linode, Contabo,
		your own server, ...). The other platform guides (Digital Ocean, AWS, GCP, Azure) are shortcuts of
		this one with their provider-specific firewall steps.
	</p>

	<h2>1. Install the binary</h2>
	<p>
		The <code>install.sh</code> script downloads the latest release binary for your architecture
		(x86_64 / aarch64), verifies its sha256 checksum and installs it into a directory on
		<code>PATH</code> — <strong>no sudo needed for the install itself</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Create a configuration</h2>
	<p>Fetch the template (no repository clone needed) and edit it:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>At minimum, set:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Generate the secret key with:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(Or mount your own config file instead of the template — any <code>nostrfy.toml</code> works.)
	</p>

	<h2>3. Run as a systemd service</h2>
	<p>Fetch the hardened unit (no repository clone needed) and start it:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Logs:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Open the port and verify</h2>
	<p>Allow TCP 8080 in your firewall (ufw, cloud firewall, host firewall):</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Verify locally and from the outside:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. Put a TLS-terminating proxy in front (for wss://)</h2>
	<p>
		The relay serves plain WebSocket on 8080. To expose it as <code>wss://</code>, run a reverse
		proxy on port 443 that terminates TLS. The relay honors <code>X-Forwarded-Proto</code>, so no
		special configuration is needed.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Get a free certificate with
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>(auto TLS, one file):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Blossom media host too</h3>
	<p>
		When <code>blossom.host = "media.example.com"</code> is set, that hostname must also reach the
		same port — the relay splits the hosts internally (like <code>server.api_host</code>). Add a
		second server block / site for it:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Make sure <code>relay.public_url</code> in the config matches
		<code>wss://relay.example.com</code>.
	</p>

	<h2>6. Backups</h2>
	<p>Stop the relay, copy the data directory, restart:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Updates</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
