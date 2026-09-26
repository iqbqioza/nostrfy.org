<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # задайте name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Развёртывание в DigitalOcean"
	description="Развёртывание nostrfy на DigitalOcean Droplet или App Platform — пошагово, с systemd, TLS и готовой к промышленной эксплуатации конфигурацией."
/>

<div class="doc-body">
	<p>
		Два варианта: <strong>Droplet</strong> (ВМ, самый простой) или <strong>App Platform</strong>
		(контейнеры).
	</p>

	<h2>Вариант 1: Droplet (рекомендуется)</h2>
	<ol>
		<li>
			<strong>Создайте Droplet</strong>: Ubuntu 24.04 LTS, любой размер (для начала достаточно 1 ГБ
			ОЗУ). Droplet в регионе рядом с вашими пользователями снижает задержку.
		</li>
		<li>
			<strong>Подключитесь по SSH</strong> и следуйте общему
			<a href={p('/docs/deploy/vps/')}>руководству по VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Откройте порт</strong> в брандмауэре Droplet (рекомендуется
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>): разрешите входящий TCP <code>8080</code> (и <code>443</code>, если добавляете TLS).
		</li>
		<li>
			<strong>Проверьте</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Добавьте TLS (<code>wss://</code>)</strong> с помощью certbot + nginx или
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				управляемого балансировщика нагрузки DigitalOcean</a
			>
			с сертификатом — затем установите
			<code>relay.public_url = "wss://relay.example.com"</code> и перезапустите.
		</li>
	</ol>

	<h2>Вариант 2: App Platform (контейнер)</h2>
	<p>
		App Platform собирается из <code>Dockerfile</code> репозитория (который скачивает заранее собранный
		релизный бинарник):
	</p>
	<ol>
		<li><strong>Подключите ваш GitHub-репозиторий</strong> и создайте из него приложение.</li>
		<li>
			<strong>Порт</strong>: установите HTTP-порт <code>8080</code> (релей слушает именно там).
		</li>
		<li>
			<strong>Постоянный диск</strong>: смонтируйте том в <code>/data</code> (данные LMDB хранятся там
			— без него данные теряются при каждом развёртывании).
		</li>
		<li>
			<strong>Окружение</strong>: встроенный в образ <code>deploy/nostrfy.container.toml</code> можно
			заменить, смонтировав собственную конфигурацию в <code>/etc/nostrfy/nostrfy.toml</code> (создайте
			форк, который его копирует, или используйте <code>COPY</code> в Dockerfile в собственном репозитории).
		</li>
		<li>
			<strong>TLS</strong>: App Platform автоматически предоставляет <code>https://</code> для домена
			приложения — установите <code>relay.public_url</code> соответственно.
		</li>
	</ol>

	<h2>Оба варианта</h2>
	<ul>
		<li>
			Обновления: повторно запустите <code>install.sh</code> + <code>systemctl restart nostrfy</code>
			(Droplet) или сделайте push в подключённый репозиторий (App Platform).
		</li>
		<li>
			Вся конфигурация описана в
			<a href={p('/docs/configuration/')}>справочнике по конфигурации</a>.
		</li>
	</ul>
</div>
