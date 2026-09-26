<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="Эксплуатация релея"
	description="Для вашего релея nostrfy: запуск и остановка, журналы и статистика, горячая перезагрузка конфигурации, несколько экземпляров и тюнинг на масштабе."
/>

<div class="doc-body">
	<h2>Запуск и остановка</h2>
	<p>Запустите релей как фоновый демон:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>Или запустите в терминале на переднем плане:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Остановить:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Убедитесь, что релей запущен:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Логи и статистика</h2>
	<p>
		Демон пишет в <code>daemon.log_file</code>. Когда файл превышает <code>max_log_size_bytes</code>, он автоматически ротируется (<code>nostrfy.log.1</code>, <code>.2</code>… до <code>max_log_files</code> поколений):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>Уровень журналов задаётся переменной окружения <code>RUST_LOG</code> (например, <code>RUST_LOG=debug</code>).</p>
	<h3>Статистика</h3>
	<p>Живая статистика из CLI:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>Или по HTTP:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Показывает соединения, принятые/отклонённые события, размер БД и другое.</p>
	<h3>Метрики Prometheus</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Горячая перезагрузка (SIGHUP)</h2>
	<p>Отредактировав файл конфигурации, перезагрузите его без перезапуска:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Применяется при перезагрузке</th>
				<th>Требуется перезапуск</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Идентичность релея, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>большинство [limits], reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, настройки LiveKit</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* (включая search_index), blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>При изменении настройки, требующей перезапуска, в журнале появляется предупреждение.</p>

	<h2>Запуск нескольких экземпляров</h2>
	<p>
		nostrfy поддерживает несколько независимых релеев на одном сервере (разные порты). Каждому экземпляру нужен собственный
		<code>server.port</code>, <code>[daemon]</code>
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		(общие значения заставят второй экземпляр завершиться с ошибкой запуска <code>already running</code>),
		<code>database.path</code>, а также (при использовании) собственные <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Каждый экземпляр управляется своим файлом конфигурации: <code>nostrfy --config /etc/nostrfy/a.toml start</code> и т. д.</p>

	<h2>Крупномасштабные развёртывания</h2>
	<p>
		Релей рассчитан на сотни тысяч соединений на одном хосте — живая доставка будит только тех подписчиков, которые могут совпасть с событием, а память на соединение мала. Для миллионов нужно тюнинг на уровне хоста:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Настройка</th>
				<th>Значение</th>
				<th>Причина</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× целевого числа соединений (+1000)</td>
				<td>каждое соединение занимает один fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>Очередь ожидающих accept при всплеске соединений</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>низкое (например, 10)</td>
				<td>Быстрее освобождает сокеты TIME_WAIT</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 или 2</td>
				<td>Карта LMDB — большая разреженная виртуальная резервация</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		В FreeBSD соответствующие параметры — <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> плюс
		<code>ulimit -n</code>, а также <code>kern.ipc.somaxconn</code> заменяет <code>net.core.somaxconn</code>. Память ядра на соединение — около 80 KiB, пользовательская — около 10 KiB, поэтому миллион соединений требует примерно 90 GiB памяти ядра и пользователя сверх базы данных.
	</p>

	<h2 id="throughput">Пропускная способность (событий в секунду)</h2>
	<p>
		Запись событий ограничена двумя затратами: проверкой подписи Schnorr (около 30–50 µs на событие) и синхронным сбросом на диск, который писатель LMDB выполняет после каждого пакета коммитов. Оба настраиваются в файле <code>nostrfy.toml</code>:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Настройка</th>
				<th>Причина</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>Коммит в страничный кэш ОС (микросекунды); при потере питания теряются только записи после последнего сброса — начните с этого</td>
			</tr>
			<tr>
				<td>Ядер CPU ≥ 8 vCPU</td>
				<td>Пакетный путь EVENT проверяет подписи параллельно по ядрам</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>Убирает запись словаря NIP-50 на каждое событие для нагруженных записью экземпляров</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Параллельная проверка подписей проверяет все подписи ожидающего пакета сразу в пуле рабочих потоков (не более 8; пакеты меньше 16 событий проверяются построчно). Дешёвые проверки каждого события всё равно выполняются первыми, поэтому текст причины отказа совпадает с последовательным путём — по ядрам распределяется только работа Schnorr. Однопоточная сборка остаётся последовательной.
	</p>

	<h2>Фиксированные границы защиты от атак</h2>
	<p>
		Несколько жёстких границ зафиксированы (не настраиваются), чтобы релей оставался отзывчивым под атаками:
	</p>
	<ul>
		<li>
			Один фильтр содержит не более <strong>512</strong> <code>ids</code>, <code>authors</code> или
			<code>kinds</code> записей; значения тегов <code>#...</code> используют отдельный бюджет <strong>512</strong>
			значений. Слишком большие фильтры отклоняются (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> отслеживает не более 10 000 исходных IP; при заполнении невиданные IP отклоняются (запрет по умолчанию).
		</li>
		<li>
			<code>ids</code> в фильтрах могут быть префиксами, но совпадают только полные 32-байтовые id и префиксы чётной длины (записи нечётной длины и пустые игнорируются и в истории, и в живой доставке).
		</li>
		<li>
			Слишком длинные ключи индекса (значения тегов, слова контента, теги <code>d</code> сверх лимита размера ключа LMDB) пропускаются при индексации; событие всё равно сохраняется.
		</li>
	</ul>
</div>
