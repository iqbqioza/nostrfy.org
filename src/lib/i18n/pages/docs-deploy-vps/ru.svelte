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
public_url = "wss://relay.example.com"   # ваш публичный адрес
private_key = "..."                      # выполните 'nostrfy genkey' локально и вставьте ключ

[server]
host = "0.0.0.0"                         # уже задано в шаблоне
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
curl http://<server-ip>:8080/health        # с вашего ноутбука`;
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
sudo tar -czf nostrfy-data-backup.tar.gz /var/lib/nostrfy   # ваш database.path
sudo systemctl start nostrfy`;
	const updateCmd = `# установка через pipe никогда не запрашивает подтверждение: используйте --force для перезаписи
# существующего бинарника (или запустите скрипт из терминала и ответьте y/N)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh -s -- --force
sudo systemctl restart nostrfy`;
</script>

<DocsTitle
	title="Развёртывание на любом VPS"
	description="Универсальное руководство для обычного VPS на Ubuntu или Debian — основа всех остальных руководств по платформам, с заметками о systemd, TLS и брандмауэре."
/>

<div class="doc-body">
	<p>
		Это универсальное руководство для обычного Linux VPS (любой провайдер — Hetzner, Vultr, Linode, Contabo,
		собственный сервер, ...). Остальные руководства по платформам (Digital Ocean, AWS, GCP, Azure) — это сокращённые версии
		этого руководства с шагами для брандмауэра конкретного провайдера.
	</p>

	<h2>1. Установка бинарного файла</h2>
	<p>
		Скрипт <code>install.sh</code> скачивает последний релизный бинарник под вашу архитектуру
		(x86_64 / aarch64), проверяет его sha256-контрольную сумму и устанавливает в каталог из
		<code>PATH</code> — <strong>sudo для самой установки не нужен</strong>:
	</p>
	<CodeBlock code={installCmd} lang="sh" />

	<h2>2. Создание конфигурации</h2>
	<p>Скачайте шаблон (клонировать репозиторий не нужно) и отредактируйте его:</p>
	<CodeBlock code={configFetch} lang="sh" />
	<p>Как минимум задайте:</p>
	<CodeBlock code={relConfig} lang="toml" />
	<p>Сгенерируйте секретный ключ командой:</p>
	<CodeBlock code={genkeyCmd} lang="sh" />
	<p>
		(Или подключите собственный файл конфигурации вместо шаблона — подойдёт любой <code>nostrfy.toml</code>.)
	</p>

	<h2>3. Запуск как systemd-сервис</h2>
	<p>Скачайте усиленный юнит (клонировать репозиторий не нужно) и запустите его:</p>
	<CodeBlock code={serviceCmd} lang="sh" />
	<p>Логи:</p>
	<CodeBlock code={logsCmd} lang="sh" />

	<h2>4. Откройте порт и проверьте</h2>
	<p>Разрешите TCP 8080 в брандмауэре (ufw, облачный брандмауэр, брандмауэр хоста):</p>
	<CodeBlock code={ufwCmd} lang="sh" />
	<p>Проверьте локально и снаружи:</p>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>5. Поставьте перед ним TLS-терминирующий прокси (для wss://)</h2>
	<p>
		Релей отдаёт обычный WebSocket на порту 8080. Чтобы открыть его как <code>wss://</code>, запустите обратный
		прокси на порту 443, который терминирует TLS. Релей учитывает <code>X-Forwarded-Proto</code>, поэтому
		специальная настройка не нужна.
	</p>

	<h3>nginx</h3>
	<p>
		<code>/etc/nginx/sites-available/relay</code>:
	</p>
	<CodeBlock code={nginxConf} lang="nginx" />
	<p>
		Получите бесплатный сертификат с помощью
		<a href="https://certbot.eff.org/" target="_blank" rel="noopener noreferrer">certbot</a>
		(<code>sudo certbot --nginx -d relay.example.com</code>).
	</p>

	<h3>Caddy</h3>
	<p>(авто-TLS, один файл):</p>
	<CodeBlock code={caddyConf} lang="caddy" />

	<h3>Также медиа-хост Blossom</h3>
	<p>
		Когда задано <code>blossom.host = "media.example.com"</code>, это имя хоста тоже должно вести на тот же
		порт — релей разделяет хосты внутри (как <code>server.api_host</code>). Добавьте
		второй server-блок / сайт для него:
	</p>
	<CodeBlock code={nginxMedia} lang="nginx" />
	<CodeBlock code={caddyMedia} lang="caddy" />
	<p>
		Убедитесь, что <code>relay.public_url</code> в конфигурации совпадает с
		<code>wss://relay.example.com</code>.
	</p>

	<h2>6. Резервные копии</h2>
	<p>Остановите релей, скопируйте каталог данных, перезапустите:</p>
	<CodeBlock code={backupCmd} lang="sh" />

	<h2>Обновления</h2>
	<CodeBlock code={updateCmd} lang="sh" />
</div>
