<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const commonBlock = `# 1. Установите последний релизный бинарник (sudo для самой установки не нужен)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Скачайте шаблон конфигурации и отредактируйте его (клонировать репозиторий не нужно)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # задайте name, public_url, private_key

# 3. Скачайте systemd-юнит и запустите сервис
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Откройте порт (обычно 8080) в брандмауэре провайдера и проверьте
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # обязательно для NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # выполните 'nostrfy genkey' и вставьте ключ`;
</script>

<DocsTitle
	title="Обзор развёртывания"
	description="Как распространяется nostrfy и как его развернуть — Fly.io, AWS, Google Cloud, Azure, DigitalOcean или любой VPS, с заметками о TLS, systemd и контейнерах."
/>

<div class="doc-body">
	<h2>Один бинарник, несколько платформ</h2>
	<p>
		nostrfy поставляет готовые бинарники для <strong>x86_64</strong> и <strong>aarch64</strong> (артефакты
		релизов GitHub, проверяемые контрольной суммой через <code>install.sh</code>), образ контейнера, который
		<strong>скачивает эти бинарники</strong> (компиляция не нужна), и руководства по развёртыванию для основных
		платформ.
	</p>

	<h2>Платформы</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Платформа</th>
				<th>Тип</th>
				<th>Руководство</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Управляемая платформа (контейнеры, тома, TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) или App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail или ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) или Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM или Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Любой VPS</strong></td>
				<td>Обычный сервер Ubuntu/Debian</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Общий шаблон для VM</h2>
	<p>Все руководства для VM (Digital Ocean, AWS EC2, GCP, Azure, любой VPS) следуют одному шаблону:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Перед запуском в производство</h2>
	<p>
		Каждое развёртывание использует одни и те же параметры <code>nostrfy.toml</code>. Перед запуском в производство задайте как минимум:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM или контейнер?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong>: проще всего, дешевле, полный контроль. Рекомендуется для большинства
			развёртываний релея.
		</li>
		<li>
			<strong>Контейнер</strong>: используйте <code>Dockerfile</code> из репозитория (скачивает релизный
			бинарник во время сборки) на Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run или Azure
			Container Apps. Для данных LMDB (<code>/data</code>) требуется постоянное хранилище.
		</li>
	</ul>

	<h2>Медиа-хост Blossom</h2>
	<p>
		Если задан <code>blossom.host</code>, направьте это имя хоста на тот же порт в TLS-прокси (примеры блоков
		nginx/Caddy см. в <a href={p('/docs/deploy/vps/')}>руководстве по VPS</a>).
	</p>

	<Callout type="warning" title="TLS завершается вашим прокси или провайдером">
		Сам релей обслуживает обычный WebSocket на порту 8080 и учитывает X-Forwarded-Proto.
	</Callout>
</div>
