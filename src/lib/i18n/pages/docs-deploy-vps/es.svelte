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
public_url = "wss://relay.example.com"   # tu dirección pública
private_key = "..."                      # ejecuta 'nostrfy genkey' en local y pega la clave

[server]
host = "0.0.0.0"                         # ya configurado en la plantilla
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
curl http://<server-ip>:8080/health        # desde tu portátil`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # tu database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# las instalaciones por tubería nunca piden confirmación: usa --force para sobrescribir un
# binario existente (o ejecuta el script desde un terminal y responde y/N)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Desplegar en cualquier VPS"
	description="La guía genérica para un VPS sencillo con Ubuntu o Debian — la base de todas las demás guías por plataforma, con notas de systemd, TLS y cortafuegos."
/>

<div class="doc-body">
	<p>
		Esta es la guía genérica para un VPS Linux sencillo (cualquier proveedor — Hetzner, Vultr, Linode, Contabo,
		tu propio servidor, ...). Las demás guías por plataforma (Digital Ocean, AWS, GCP, Azure) son atajos de
		esta con sus pasos de cortafuegos específicos del proveedor.
	</p>

	<h2>1. Instalar el binario</h2>
	<p>
		El script <code>install.sh</code> descarga el último binario publicado para tu arquitectura
		(x86_64 / aarch64), verifica su checksum sha256 y lo instala en un directorio del
		<code>PATH</code> — <strong>no se necesita sudo para la propia instalación</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Crear una configuración</h2>
	<p>Obtén la plantilla (sin clonar el repositorio) y edítala:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>Como mínimo, configura:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Genera la clave secreta con:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(O monta tu propio archivo de configuración en lugar de la plantilla — cualquier <code>nostrfy.toml</code> sirve.)
	</p>

	<h2>3. Ejecutar como servicio systemd</h2>
	<p>Obtén la unidad reforzada (sin clonar el repositorio) e iníciala:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Registros:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Abrir el puerto y verificar</h2>
	<p>Permite TCP 8080 en tu cortafuegos (ufw, cortafuegos en la nube, cortafuegos del host):</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Verifica en local y desde fuera:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. Poner un proxy de terminación TLS delante (para wss://)</h2>
	<p>
		El relé sirve WebSocket sin cifrar en el 8080. Para exponerlo como <code>wss://</code>, ejecuta un proxy inverso
		en el puerto 443 que termine TLS. El relé respeta <code>X-Forwarded-Proto</code>, así que no se
		necesita ninguna configuración especial.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Obtén un certificado gratuito con
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>(TLS automático, un archivo):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Anfitrión multimedia Blossom también</h3>
	<p>
		Cuando se configura <code>blossom.host = "media.example.com"</code>, ese nombre de host también debe llegar al
		mismo puerto — el relé separa los hosts internamente (como <code>server.api_host</code>). Añade un
		segundo bloque server / sitio para él:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Asegúrate de que <code>relay.public_url</code> en la configuración coincida con
		<code>wss://relay.example.com</code>.
	</p>

	<h2>6. Copias de seguridad</h2>
	<p>Detén el relé, copia el directorio de datos, reinicia:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Actualizaciones</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
