<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # показывается в клиентах через NIP-11
description = "A friendly relay for everyone"
private_key = "..."                            # обязательно для групп NIP-29
public_url = "wss://<your-app-name>.fly.dev"   # обязательно для NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# строка в журнале: "relay listening on ws://0.0.0.0:8080"
fly logs

# документ информации NIP-11 по публичному адресу
curl https://<your-app-name>.fly.dev/

# направьте ваш Nostr-клиент на wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="Развёртывание на Fly.io"
	description="Разверните nostrfy на Fly.io за несколько минут с помощью готового шаблона — тома, машины, TLS-терминация и простые обновления."
/>

<div class="doc-body">
	<h2>Что входит в репозиторий</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Файл</th>
				<th>Назначение</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Образ контейнера — <strong>скачивает готовый бинарник релиза</strong> из GitHub release assets (x86_64 / aarch64, выбирается архитектурой сборки) и проверяет его sha256-контрольную сумму. Компиляция на Fly не выполняется
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Конфигурация приложения Fly: HTTP-сервис на порту 8080, проверки работоспособности, монтирование тома <code>/data</code>, всегда включённые машины
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					Конфигурация релея, встроенная в образ по пути <code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Предварительные требования</h2>
	<ul>
		<li>Аккаунт Fly.io</li>
		<li>CLI flyctl (<code>fly version</code>)</li>
		<li>Выполнен вход: <code>fly auth login</code></li>
	</ul>

	<h2>Развёртывание в четыре шага</h2>

	<h3>1. Создайте приложение (пока без развёртывания)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> должен быть уникальным на Fly (он станет частью URL релея:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>: например <code>nrt</code> (Токио), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — выберите регион, ближайший к вашим пользователям
		</li>
		<li>
			Это может перезаписать значения <code>fly.toml</code> из шаблона (имя приложения, регион) — это нормально
		</li>
	</ul>

	<h3>2. Создайте постоянный том</h3>
	<p>База данных LMDB находится на томе Fly, смонтированном в <code>/data</code>:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		Для начала достаточно 1 ГБ (база растёт по мере использования). Позже можно изменить размер или сразу создать том большего размера.
	</p>

	<h3>3. Настройте релей</h3>
	<p>Отредактируйте <code>deploy/nostrfy.container.toml</code> перед развёртыванием:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>: сгенерируйте локально командой <code>nostrfy genkey</code> (с временной конфигурацией) и вставьте ключ, либо сгенерируйте любым Nostr-инструментом
		</li>
		<li>
			<code>public_url</code> <strong>обязан</strong> совпадать с именем приложения — без него не будут работать NIP-42 AUTH, NIP-62 vanish и NIP-86 management API
		</li>
		<li>Всё остальное можно оставить по умолчанию</li>
	</ul>

	<h3>4. Развёртывание</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly собирает образ (несколько минут — скачивание бинарника быстрое, образ небольшой), создаёт машину и выполняет проверку работоспособности к <code>/health</code>.
	</p>

	<h2>Проверка</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Масштабирование и обновления</h2>
	<ul>
		<li>
			<strong>Обновление релея</strong>: отредактируйте <code>deploy/nostrfy.container.toml</code> и снова выполните <code>fly deploy</code> — образ всегда скачивает <strong>последний</strong> бинарник релиза GitHub, поэтому обновление — это простое повторное развёртывание
		</li>
		<li>
			<strong>Фиксация версии</strong>: <code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> или измените <code>ARG</code> в Dockerfile
		</li>
		<li>
			<strong>Масштаб</strong>: по умолчанию релей — одна машина. <code>fly machines clone &lt;id&gt;</code> создаёт вторую машину; обе используют общий том (тома Fly поддерживают несколько машин в одном регионе)
		</li>
		<li>
			<strong>Метрики</strong>: Fly собирает конечную точку <code>/metrics</code> (см. <code>[metrics]</code> в <code>fly.toml</code>) и показывает её в дашборде Fly в разделе Metrics
		</li>
	</ul>

	<h2>Настройка конфигурации</h2>
	<p>
		Образ читает <code>/etc/nostrfy/nostrfy.toml</code>, встроенный из <code>deploy/nostrfy.container.toml</code>. Два способа настройки:
	</p>
	<ol>
		<li>
			<strong>Отредактируйте <code>deploy/nostrfy.container.toml</code> в репозитории</strong> и повторно разверните (проще всего)
		</li>
		<li>
			<strong>Подключите свой файл конфигурации</strong>: соберите форк образа, копирующий ваш файл конфигурации поверх <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>Все опции описаны в <a href={p('/docs/configuration/')}>справочнике по конфигурации</a>.</p>

	<h2>Примечания</h2>
	<ul>
		<li>
			<strong>Всегда включён по дизайну</strong>: <code>auto_stop_machines = false</code> в <code>fly.toml</code> — релей никогда не должен останавливаться в простое
		</li>
		<li>
			Контейнер запускает релей в <strong>режиме переднего плана</strong> (<code>nostrfy start --foreground</code>); журналы идут в stdout/stderr и собираются Fly
		</li>
		<li>
			TLS терминируется на Fly; сам релей отдаёт обычный WebSocket на порту 8080
		</li>
		<li>
			<strong>Хост медиа Blossom</strong>: чтобы отдавать и сервер Blossom, задайте <code>blossom.host = "media.example.com"</code> в конфигурации, добавьте <code>media.example.com</code> как <strong>дополнительное имя хоста</strong> того же приложения Fly (<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> или <code>fly hostnames</code>), и добавьте TLS-сертификат <code>media.</code> в дашборде Fly — релей разделяет хосты внутри (как <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS терминируется на Fly">
		Сам релей отдаёт обычный WebSocket на порту 8080.
	</Callout>
</div>
