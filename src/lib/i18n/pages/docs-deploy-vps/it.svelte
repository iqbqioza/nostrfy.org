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
public_url = "wss://relay.example.com"   # il tuo indirizzo pubblico
private_key = "..."                      # esegui 'nostrfy genkey' in locale e incolla la chiave

[server]
host = "0.0.0.0"                         # già impostato nel modello
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
curl http://<server-ip>:8080/health        # dal tuo portatile`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # il tuo database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# le installazioni via pipe non chiedono mai conferma: usa --force per sovrascrivere un
# binario esistente (oppure esegui lo script da un terminale e rispondi y/N)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Distribuzione su qualsiasi VPS"
	description="La guida generica per un semplice VPS Ubuntu o Debian — la base per tutte le altre guide per piattaforma, con note su systemd, TLS e firewall."
/>

<div class="doc-body">
	<p>
		Questa è la guida generica per un semplice VPS Linux (qualsiasi provider — Hetzner, Vultr, Linode, Contabo,
		il tuo server, ...). Le altre guide per piattaforma (Digital Ocean, AWS, GCP, Azure) sono scorciatoie di
		questa con i rispettivi passaggi firewall specifici del provider.
	</p>

	<h2>1. Installa il binario</h2>
	<p>
		Lo script <code>install.sh</code> scarica l’ultimo binario pubblicato per la tua architettura
		(x86_64 / aarch64), ne verifica il checksum sha256 e lo installa in una directory nel
		<code>PATH</code> — <strong>non serve sudo per l’installazione stessa</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Crea una configurazione</h2>
	<p>Scarica il modello (senza clonare il repository) e modificalo:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>Come minimo, imposta:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Genera la chiave segreta con:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(Oppure monta il tuo file di configurazione al posto del modello — va bene qualsiasi <code>nostrfy.toml</code>.)
	</p>

	<h2>3. Esegui come servizio systemd</h2>
	<p>Scarica l’unità rafforzata (senza clonare il repository) e avviala:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Log:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Apri la porta e verifica</h2>
	<p>Consenti TCP 8080 nel tuo firewall (ufw, firewall cloud, firewall host):</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Verifica in locale e dall’esterno:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. Metti un proxy di terminazione TLS davanti (per wss://)</h2>
	<p>
		Il relay serve WebSocket in chiaro sulla porta 8080. Per esporlo come <code>wss://</code>, esegui un reverse
		proxy sulla porta 443 che termina TLS. Il relay rispetta <code>X-Forwarded-Proto</code>, quindi non è
		necessaria alcuna configurazione speciale.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Ottieni un certificato gratuito con
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>(TLS automatico, un solo file):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Anche l’host multimediale Blossom</h3>
	<p>
		Quando <code>blossom.host = "media.example.com"</code> è impostato, anche quell’hostname deve raggiungere la
		stessa porta — il relay suddivide gli host internamente (come <code>server.api_host</code>). Aggiungi un
		secondo blocco server / sito per esso:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Assicurati che <code>relay.public_url</code> nella configurazione corrisponda a
		<code>wss://relay.example.com</code>.
	</p>

	<h2>6. Backup</h2>
	<p>Ferma il relay, copia la directory dei dati, riavvia:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Aggiornamenti</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
