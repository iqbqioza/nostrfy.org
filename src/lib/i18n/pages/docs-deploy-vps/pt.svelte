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
public_url = "wss://relay.example.com"   # o seu endereço público
private_key = "..."                      # execute 'nostrfy genkey' localmente e cole a chave

[server]
host = "0.0.0.0"                         # já definido no modelo
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
curl http://<server-ip>:8080/health        # do seu portátil`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # o seu database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# instalações via pipe nunca pedem confirmação: use --force para sobrescrever um
# binário existente (ou execute o script num terminal e responda y/N)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Implantar em qualquer VPS"
	description="O guia genérico para um VPS simples com Ubuntu ou Debian — a base para todos os outros guias por plataforma, com notas de systemd, TLS e firewall."
/>

<div class="doc-body">
	<p>
		Este é o guia genérico para um VPS Linux simples (qualquer provedor — Hetzner, Vultr, Linode, Contabo,
		o seu próprio servidor, ...). Os outros guias por plataforma (Digital Ocean, AWS, GCP, Azure) são atalhos deste
		com os seus passos de firewall específicos do provedor.
	</p>

	<h2>1. Instalar o binário</h2>
	<p>
		O script <code>install.sh</code> baixa o binário mais recente para a sua arquitetura
		(x86_64 / aarch64), verifica o seu checksum sha256 e instala-o num diretório do
		<code>PATH</code> — <strong>não é preciso sudo para a instalação em si</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Criar uma configuração</h2>
	<p>Obtenha o modelo (sem clonar o repositório) e edite-o:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>No mínimo, defina:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Gere a chave secreta com:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(Ou use seu próprio arquivo de configuração em vez do modelo — qualquer <code>nostrfy.toml</code> funciona.)
	</p>

	<h2>3. Executar como serviço systemd</h2>
	<p>Obtenha a unit reforçada (sem clonar o repositório) e inicie-a:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Logs:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Abrir a porta e verificar</h2>
	<p>Permita TCP 8080 no seu firewall (ufw, firewall na nuvem, firewall do host):</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Verifique localmente e a partir do exterior:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. Colocar um proxy de terminação TLS à frente (para wss://)</h2>
	<p>
		O relay serve WebSocket em claro na porta 8080. Para expô-lo como <code>wss://</code>, execute um proxy reverso
		na porta 443 que termine TLS. O relay respeita <code>X-Forwarded-Proto</code>, por isso não é
		necessária nenhuma configuração especial.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Obtenha um certificado gratuito com
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>(TLS automático, um arquivo):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Host de mídia Blossom também</h3>
	<p>
		Quando <code>blossom.host = "media.example.com"</code> está definido, esse hostname também precisa alcançar a
		mesma porta — o relay separa os hosts internamente (como <code>server.api_host</code>). Adicione um
		segundo bloco server / site para ele:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Certifique-se de que <code>relay.public_url</code> na configuração corresponde a
		<code>wss://relay.example.com</code>.
	</p>

	<h2>6. Cópias de segurança</h2>
	<p>Pare o relay, copie o diretório de dados, reinicie:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Atualizações</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
