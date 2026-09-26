<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # задайте name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Развёртывание в Google Cloud"
	description="Развёртывание nostrfy в Google Cloud Compute Engine или Cloud Run — шаг за шагом, с systemd, TLS и особенностями масштабирования до нуля."
/>

<div class="doc-body">
	<p>
		Варианты: <strong>Compute Engine</strong> (ВМ, рекомендуется) или <strong>Cloud Run</strong>
		(контейнеры).
	</p>

	<h2>Вариант 1: Compute Engine (рекомендуется)</h2>
	<ol>
		<li>
			<strong>Создайте ВМ</strong>: Ubuntu 24.04 LTS (или Debian), <code>e2-small</code> (2 ГБ)
			достаточно для начала. Выберите регион ближе к вашим пользователям.
		</li>
		<li>
			<strong>Правило брандмауэра</strong>: разрешите входящий TCP <code>8080</code> (и <code>443</code> для
			TLS). В разделе <strong>Network → Firewall</strong> создайте правило с целевыми тегами,
			назначенными вашей ВМ.
		</li>
		<li>
			<strong>Подключитесь по SSH</strong> (подойдёт кнопка SSH в консоли) и следуйте общему
			<a href={p('/docs/deploy/vps/')}>руководству по VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Зарезервируйте статический IP</strong> (External IP → Reserve), чтобы
			<code>public_url</code> оставался действительным после перезагрузок.
		</li>
		<li>
			<strong>Проверьте</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>Добавьте TLS (<code>wss://</code>)</strong> с certbot + nginx (как в
			<a href={p('/docs/deploy/vps/')}>руководстве по VPS</a>) или с балансировщиком нагрузки GCP
			с управляемым сертификатом.
		</li>
	</ol>

	<h2>Вариант 2: Cloud Run (контейнер)</h2>
	<p>
		Cloud Run собирается из <code>Dockerfile</code> репозитория (который скачивает заранее
		собранный релизный бинарник):
	</p>
	<ol>
		<li>
			<strong>Создайте сервис из GitHub-репозитория</strong> (или отправьте образ в Artifact
			Registry).
		</li>
		<li>
			<strong>Порт</strong>: установите порт контейнера <code>8080</code>.
		</li>
		<li>
			<strong>Выделите память</strong>: минимум 512 МБ (LMDB + асинхронный рантайм).
		</li>
		<li>
			<strong>Постоянное хранилище</strong>: подключите <strong>том Cloud Run (filestore/gcsfuse)</strong>
			в <code>/data</code> — LMDB нужна файловая система, поэтому монтирование GCS FUSE в
			<code>/data</code> подойдёт для сохранения данных.
		</li>
		<li>
			<strong>TLS</strong>: Cloud Run предоставляет <code>https://</code> автоматически — установите
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (или ваш собственный домен).
		</li>
	</ol>

	<Callout type="note" title="Cloud Run по умолчанию масштабируется до нуля">
		Для релея установите <strong>min instances = 1</strong>, чтобы он никогда не «остывал».
		Файл <code>deploy/nostrfy.container.toml</code>, встроенный в образ, можно заменить,
		смонтировав собственный <code>nostrfy.toml</code> в
		<code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
