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
public_url = "wss://relay.example.com"   # Ihre öffentliche Adresse
private_key = "..."                      # 'nostrfy genkey' lokal ausführen und Schlüssel einfügen

[server]
host = "0.0.0.0"                         # bereits in der Vorlage gesetzt
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
curl http://<server-ip>:8080/health        # von Ihrem Laptop`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # Ihr database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# Pipe-Installationen fragen nie nach Bestätigung: --force zum Überschreiben einer
# vorhandenes Binary verwenden (oder Skript im Terminal ausführen und mit y/N antworten)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Bereitstellung auf einem beliebigen VPS"
	description="Die generische Anleitung für einen einfachen Ubuntu- oder Debian-VPS — die Basis für alle anderen Plattform-Anleitungen, mit Hinweisen zu systemd, TLS und Firewall."
/>

<div class="doc-body">
	<p>
		Dies ist die generische Anleitung für einen einfachen Linux-VPS (beliebiger Anbieter — Hetzner, Vultr, Linode, Contabo,
		eigener Server, ...). Die anderen Plattform-Anleitungen (Digital Ocean, AWS, GCP, Azure) sind Kurzfassungen
		dieser Anleitung mit ihren anbieterspezifischen Firewall-Schritten.
	</p>

	<h2>1. Binary installieren</h2>
	<p>
		Das Skript <code>install.sh</code> lädt das neueste Release-Binary für Ihre Architektur
		(x86_64 / aarch64) herunter, prüft ihre sha256-Prüfsumme und installiert sie in ein Verzeichnis im
		<code>PATH</code> — <strong>für die Installation selbst ist kein sudo nötig</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Konfiguration erstellen</h2>
	<p>Vorlage holen (kein Repository-Klon nötig) und bearbeiten:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>Mindestens festlegen:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Den geheimen Schlüssel erzeugen mit:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(Oder stattdessen die eigene Konfigurationsdatei einbinden — jede <code>nostrfy.toml</code> funktioniert.)
	</p>

	<h2>3. Als systemd-Dienst ausführen</h2>
	<p>Gehärtete Unit holen (kein Repository-Klon nötig) und starten:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Logs:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Port öffnen und prüfen</h2>
	<p>TCP 8080 in Ihrer Firewall freigeben (ufw, Cloud-Firewall, Host-Firewall):</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Lokal und von außen prüfen:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. TLS-terminierenden Proxy davor schalten (für wss://)</h2>
	<p>
		Das Relay liefert plain WebSocket auf 8080. Um es als <code>wss://</code> bereitzustellen, betreiben Sie einen Reverse-
		Proxy auf Port 443, der TLS terminiert. Das Relay beachtet <code>X-Forwarded-Proto</code>, daher ist keine
		besondere Konfiguration nötig.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Kostenloses Zertifikat holen mit
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>(automatisches TLS, eine Datei):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Blossom-Media-Host ebenfalls</h3>
	<p>
		Wenn <code>blossom.host = "media.example.com"</code> gesetzt ist, muss dieser Hostname ebenfalls denselben
		Port erreichen — das Relay trennt die Hosts intern (wie <code>server.api_host</code>). Fügen Sie einen
		zweiten Server-Block / eine zweite Site dafür hinzu:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Stellen Sie sicher, dass <code>relay.public_url</code> in der Konfiguration mit
		<code>wss://relay.example.com</code> übereinstimmt.
	</p>

	<h2>6. Backups</h2>
	<p>Relay stoppen, Datenverzeichnis kopieren, neu starten:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Updates</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
