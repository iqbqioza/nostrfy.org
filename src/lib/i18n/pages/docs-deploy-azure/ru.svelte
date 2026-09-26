<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # задайте name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="Развёртывание в Azure"
	description="Разверните nostrfy на виртуальной машине Azure или в Azure Container Apps — пошагово, с systemd, TLS и особенностями динамических публичных IP."
/>

<div class="doc-body">
	<p>
		Варианты: <strong>VM</strong> (рекомендуется) или <strong>Container Apps</strong>.
	</p>

	<h2>Вариант 1: Виртуальная машина (рекомендуется)</h2>
	<ol>
		<li>
			<strong>Создайте VM</strong>: Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 ГБ) или
			<code>Standard_B2s</code> (2 ГБ) для начала. Выберите регион ближе к вашим пользователям.
		</li>
		<li>
			<strong>Группа безопасности сети (NSG)</strong>: добавьте входящее правило для TCP <code>8080</code>
			(и <code>443</code> для TLS). Ограничьте правило SSH вашим IP.
		</li>
		<li>
			<strong>Подключитесь по SSH</strong> и следуйте общему <a href={p('/docs/deploy/vps/')}>руководству по VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Проверьте</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Добавьте TLS (<code>wss://</code>)</strong> с certbot + nginx (как в
			<a href={p('/docs/deploy/vps/')}>руководстве по VPS</a>) или через Azure Application Gateway с сертификатом.
		</li>
	</ol>

	<Callout type="note" title="Публичный IP виртуальной машины Azure может измениться при освобождении">
		Используйте <strong>статический публичный IP</strong>, чтобы <code>relay.public_url</code> оставался действительным.
	</Callout>

	<h2>Вариант 2: Azure Container Apps</h2>
	<p>
		Container Apps собирается из <code>Dockerfile</code> репозитория (который скачивает заранее собранный
		релизный бинарник):
	</p>
	<ol>
		<li>
			<strong>Создайте Container App</strong> из репозитория GitHub (или отправьте образ в ACR).
		</li>
		<li>
			<strong>Порт</strong>: установите порт контейнера <code>8080</code>.
		</li>
		<li>
			<strong>Память</strong>: не менее 1 ГБ.
		</li>
		<li>
			<strong>Постоянное хранилище</strong>: смонтируйте <strong>файловый ресурс Azure Storage</strong> в
			<code>/data</code> для данных LMDB.
		</li>
		<li>
			<strong>TLS</strong>: Container Apps предоставляет <code>https://</code> на URL приложения — установите
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (или собственный домен).
		</li>
	</ol>

	<Callout type="note" title="Релей никогда не должен масштабироваться до нуля">
		Установите <strong>min replicas = 1</strong>. Встроенный <code>deploy/nostrfy.container.toml</code> можно
		заменить, смонтировав собственный <code>nostrfy.toml</code> в <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
