<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # перезагружает конфигурацию без перезапуска`;
</script>

<DocsTitle
	title="Руководство по быстрому старту"
	description="От установки до работающего релея Nostr — считаные минуты: напишите конфигурацию, проверьте её, запустите демон и выполните первую проверку работоспособности."
/>

<div class="doc-body">
	<h2>1. Создайте конфигурацию</h2>
	<p>
		<code>nostrfy init</code> записывает стандартный, полностью прокомментированный <code>nostrfy.toml</code>:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Откройте его в текстовом редакторе и настройте — каждая опция прокомментирована.</p>

	<h2>2. Проверьте конфигурацию</h2>
	<p>
		<code>nostrfy check</code> настоятельно рекомендуется перед запуском; при любой проблеме он точно укажет, в чём дело.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Запустите релей</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="Запускается как демон. Добавьте --foreground, чтобы работать в терминале."
	/>
	<p>Затем проверьте, что релей запущен, с помощью конечной точки проверки работоспособности:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Направьте клиент на релей</h2>
	<p>
		На той же машине подключитесь к <code>ws://&lt;host&gt;:8080</code>. Хост по умолчанию —
		<code>127.0.0.1</code> принимает только локальные соединения. Чтобы открыть релей для других машин, задайте в конфигурации <code>server.host = "0.0.0.0"</code>:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		Для <code>wss://</code> нужен прокси, завершающий TLS (nginx или Caddy), перед релеем — см.
		<a href={p('/docs/deploy/')}>документацию по развёртыванию</a>.
	</p>

	<h2>5. Остановка и перезапуск</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart перечитывает конфигурацию; SIGHUP перезагружает большинство настроек без перезапуска."
	/>

	<h2>Эффективная эксплуатация</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> показывает живую статистику — также по HTTP:
			<code>/relay/stats</code> и <code>/metrics</code>.
		</li>
		<li>Лог пишется в <code>daemon.log_file</code> и автоматически ротируется.</li>
		<li>
			<code>RUST_LOG</code> управляет уровнем логирования (например, <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="Внешние клиенты не подключаются?">
		По умолчанию server.host равен 127.0.0.1. Установите host = "0.0.0.0" и перезапустите.
	</Callout>

	<Callout type="tip" title="Далее">
		В <a href={p('/docs/configuration/')}>справочнике по конфигурации</a> можно настроить любые аспекты релея.
	</Callout>
</div>
