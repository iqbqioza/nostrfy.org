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
public_url = "wss://relay.example.com"   # votre adresse publique
private_key = "..."                      # exécutez 'nostrfy genkey' en local et collez la clé

[server]
host = "0.0.0.0"                         # déjà défini dans le modèle
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
curl http://<server-ip>:8080/health        # depuis votre portable`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # votre database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# les installations pipées ne demandent jamais de confirmation : utilisez --force pour écraser un
# binaire existant (ou exécutez le script depuis un terminal et répondez y/N)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Déployer sur n’importe quel VPS"
	description="Le guide générique pour un VPS Ubuntu ou Debian standard — la base de tous les autres guides par plateforme, avec notes systemd, TLS et pare-feu."
/>

<div class="doc-body">
	<p>
		Ceci est le guide générique pour un VPS Linux standard (tout fournisseur — Hetzner, Vultr, Linode, Contabo,
		votre propre serveur, ...). Les autres guides par plateforme (Digital Ocean, AWS, GCP, Azure) sont des raccourcis de
		celui-ci avec leurs étapes de pare-feu spécifiques au fournisseur.
	</p>

	<h2>1. Installer le binaire</h2>
	<p>
		Le script <code>install.sh</code> télécharge le dernier binaire publié pour votre architecture
		(x86_64 / aarch64), vérifie sa somme de contrôle sha256 et l’installe dans un répertoire présent dans le
		<code>PATH</code> — <strong>aucun sudo requis pour l’installation elle-même</strong> :
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Créer une configuration</h2>
	<p>Récupérez le modèle (aucun clone du dépôt requis) et modifiez-le :</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>Au minimum, définissez :</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Générez la clé secrète avec :</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(Ou montez votre propre fichier de configuration au lieu du modèle — n’importe quel <code>nostrfy.toml</code> convient.)
	</p>

	<h2>3. Exécuter comme service systemd</h2>
	<p>Récupérez l’unité renforcée (aucun clone du dépôt requis) et démarrez-la :</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Journaux :</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Ouvrir le port et vérifier</h2>
	<p>Autorisez TCP 8080 dans votre pare-feu (ufw, pare-feu cloud, pare-feu hôte) :</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Vérifiez en local et depuis l’extérieur :</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. Placer un proxy de terminaison TLS devant (pour wss://)</h2>
	<p>
		Le relais sert du WebSocket en clair sur le port 8080. Pour l’exposer en <code>wss://</code>, exécutez un proxy inverse
		sur le port 443 qui termine TLS. Le relais respecte <code>X-Forwarded-Proto</code>, donc aucune
		configuration spéciale n’est nécessaire.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code> :
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Obtenez un certificat gratuit avec
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>TLS automatique, un seul fichier :</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Hébergeur média Blossom aussi</h3>
	<p>
		Lorsque <code>blossom.host = "media.example.com"</code> est défini, ce nom d’hôte doit aussi atteindre le
		même port — le relais sépare les hôtes en interne (comme <code>server.api_host</code>). Ajoutez un
		second bloc server / site pour lui :
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Assurez-vous que <code>relay.public_url</code> dans la configuration correspond à
		<code>wss://relay.example.com</code>.
	</p>

	<h2>6. Sauvegardes</h2>
	<p>Arrêtez le relais, copiez le répertoire de données, redémarrez :</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Mises à jour</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
