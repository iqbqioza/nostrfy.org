<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. остановите релей nostrfy (миграции нужен каталог базы данных)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry-run — разбирает и проверяет каждое событие, ничего не записывает
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. импорт
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. запуск — группы NIP-29 и роли NIP-43 пересоздаются из импортированных событий
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # нужен для NIP-42/62/98 и метаданных NIP-29
private_key = "..."                       # нужен для подписанных релеем метаданных NIP-29/43

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Вариант A — nostrfy сам запускает \`strfry export\` (strfry в PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Вариант B — вы выгрузили данные в файл
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Вариант C — pipe (stdin — ввод по умолчанию)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # для nak (WebSocket)
H=https://relay.example.com    # для curl (HTTP)

nak relay "$R"                              # релей отвечает и объявляет свои NIP
curl -s "$H/api/v1/query?limit=1"           # события отдаются
nak req -i <deleted-event-id> "$R"          # удалённое событие остаётся удалённым
nak req -k 39000 "$R"                       # метаданные групп NIP-29 (если мигрированы)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # членство NIP-43 (AUTH)`;
</script>

<DocsTitle
	title="Миграция со strfry"
	description="Перенесите события существующего strfry-релея в nostrfy одной командой — подготовка, пробный запуск, миграция, проверка и откат."
/>

<div class="doc-body">
	<h2>Кратко</h2>
	<p>
		<code>nostrfy migrate-strfry</code> читает собственный формат экспорта
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		(JSONL, одно NIP-01 событие на строку), поэтому работает с разными версиями базы strfry и не зависит от внутренней
		LMDB-схемы strfry. В базу strfry ничего не записывается.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Мигрируется</th>
					<th>Не мигрируется</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Каждое сохранённое событие (с применением семантики заменяемых/адресуемых)</td>
					<td>Настройки strfry без эквивалента в nostrfy (отчёт о слиянии перечисляет каждую с причиной)</td>
				</tr>
				<tr>
					<td>Истечение срока NIP-40 — уже истёкшие события пропускаются</td>
					<td>Blossom-медиа и сопоставления владельцев (в strfry нет Blossom-сервера)</td>
				</tr>
				<tr>
					<td>NIP-09 удаления, включая блоки повторной публикации для событий, уже удалённых strfry</td>
					<td>Списки доступа (NIP-86 баны, списки pubkey релея, список разрешённых Blossom)</td>
				</tr>
				<tr>
					<td>Побочные эффекты модерации NIP-29 <code>9005</code>/<code>9008</code></td>
					<td>NIP-43 инвайт-коды (выпустите новые через <code>createclaim</code>)</td>
				</tr>
				<tr>
					<td>Метки первого появления (когда настроен фильтр новых ключей)</td>
					<td>NIP-62 запросы vanish, если не указан <code>--apply-vanish</code></td>
				</tr>
				<tr>
					<td>NIP-29 группы, NIP-43 роли и их подписанные релеем метаданные, пересоздаваемые при первом запуске</td>
					<td>Собственная идентичность/ключи релея (они хранятся в <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>Эквивалентные настройки strfry, предлагаемые для слияния в <code>nostrfy.toml</code> (опционально)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Ожидаемые пропуски в сводке: <strong>эфемерные события</strong> (kinds 20000-29999, которые nostrfy никогда не
		хранит) и <strong>уже истёкшие события</strong>.
	</p>

	<h2>Быстрый старт</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="Миграция выполняется офлайн">
		Она пишет напрямую в <code>database.path</code> и отказывается работать, пока демон nostrfy (или другая
		миграция) удерживает каталог базы. <strong>Сначала остановите релей.</strong> Сам strfry может продолжать
		работать — <code>strfry export</code> читает консистентный снапшот.
	</Callout>

	<h2>Требования</h2>
	<ul>
		<li>
			Исполняемый файл <code>strfry</code> (для <code>--strfry-db</code>) или JSONL-файл, экспортированный вами вручную.
		</li>
		<li>nostrfy v0.1.15 или новее (подкоманда <code>migrate-strfry</code>).</li>
		<li>Конфигурация nostrfy для целевого релея с заданными <code>database.path</code>, <code>public_url</code> и <code>private_key</code>.</li>
		<li>
			Свободное место: примерно размер экспорта strfry плюс индексы. Словный индекс NIP-50 добавляет
			ещё; при очень тесном диске можно отключить его (<code>database.search_index = false</code>),
			выполнить миграцию и включить позже (индекс пересоздаётся при запуске).
		</li>
		<li>Нет запущенного экземпляра nostrfy на целевом <code>database.path</code>.</li>
	</ul>

	<h2>Подготовка конфигурации</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Сгенерируйте ключ релея через <code>nostrfy genkey</code>, если его нет, затем проверьте:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>Слияние настроек strfry (опционально)</h3>
	<p>
		Перед открытием базы <code>migrate-strfry</code> ищет файл конфигурации strfry (<code>--strfry-config</code>, затем
		<code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>, <code>./strfry.conf</code>), выводит настройки,
		имеющие эквивалент в nostrfy и отличающиеся от вашего <code>nostrfy.toml</code>, и спрашивает, объединять ли их.
		Перезаписываются только перечисленные ключи — комментарии и все остальные строки сохраняются, а значение,
		делающее конфигурацию невалидной, пропускается с причиной, остальные всё равно объединяются.
	</p>
	<ul>
		<li><code>--merge-config</code> применяет без вопроса (для скриптов); <code>--no-merge-config</code> пропускает шаг.</li>
		<li>Без терминала предложения печатаются, а слияние пропускается, если не указан <code>--merge-config</code>.</li>
		<li><code>--dry-run</code> выводит предложения, но ничего не записывает.</li>
	</ul>

	<h2>Пробный запуск</h2>
	<p>Сначала проверьте, потом запускайте — пробный запуск парсит и проверяет весь экспорт, не трогая базу:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		Ненулевое число <code>bad signature</code> означает, что экспорт содержит события, принятые strfry без
		проверки; они будут пропущены. Если вы им доверяете, передайте <code>--no-verify</code>, чтобы всё равно импортировать.
	</p>

	<h2>Миграция</h2>
	<p>Выберите один из трёх режимов ввода — все дают одинаковый результат:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Флаг</th>
					<th>Зачем</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry нет в <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Продолжение/догон: события с этим <code>created_at</code> и новее (включительно)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>Учитывать NIP-62 запросы vanish из экспорта (по умолчанию выкл)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Пропустить проверку подписей для доверенных дампов (быстрее)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Событий на транзакцию базы (по умолчанию 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Только разбор и проверка</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		Миграцию <strong>безопасно запускать повторно</strong>: дубликаты пропускаются, а побочные эффекты удалений
		применяются заново, так что прерванный запуск можно просто повторить (или продолжить с <code>--since</code>).
	</p>

	<h2>Запуск и проверка</h2>
	<p>
		Первый запуск пересоздаёт хранилище NIP-29 групп и хранилище NIP-43 ролей из импортированных событий и
		перепубликует подписанные релеем метаданные (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		на группу, список участников <code>13534</code>). На большой базе это может занять время; следите за журналом.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		Для точного сравнения чисел <code>strfry scan '&#123;&#125;' | wc -l</code> минус эфемерные/истёкшие события
		из сводки миграции должно равняться тому, что могут получить клиенты.
	</p>

	<h2>Продолжение прерванной миграции</h2>
	<Callout type="warning" title="Не запускайте релей до повторного запуска миграции">
		Побочные эффекты групп NIP-29 (<code>9005</code>/<code>9008</code>) применяются после импорта; прерванный запуск
		уже сохранил эти события, но ещё не выполнил их удаления, поэтому первый запуск мог бы отдать историю групп,
		которую удаление должно было убрать. Сначала повторно запустите миграцию — она завершит побочные эффекты
		(очистка идемпотентна) — затем запускайте релей.
	</Callout>
	<ul>
		<li>
			<strong>Экспорт в файл / pipe:</strong> повторно выполните ту же команду. Дубликаты пропускаются, а блоки
			удалений применяются заново.
		</li>
		<li>
			<strong>Использовали <code>--strfry-db</code>:</strong> сводка выводит подсказку продолжения; повторите с тем
			<code>--since</code> (включительно, граничная секунда переимпортируется и дедуплицируется).
		</li>
		<li>
			Если запуск упал с <code>database writer unavailable</code>, проверьте свободное место и
			<code>database.map_size</code>, затем повторите.
		</li>
	</ul>

	<h2>Откат</h2>
	<p>Миграция пишет только в базу nostrfy. Для отката остановите релей и восстановите базу до миграции или удалите её:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # или восстановите резервную копию до миграции'} lang="sh" />

	<h2>Устранение неполадок</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Сообщение</th>
					<th>Причина / исправление</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>Демон nostrfy (или другая миграция) удерживает каталог: сначала <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> должен указывать каталог, содержащий <code>data.mdb</code></td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>Установите strfry, задайте <code>--strfry-bin</code> или используйте <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>Поток записи остановился или очередь перегружена: проверьте диск/размер карты, повторите (безопасно)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>Очистка была прервана: повторите миграцию</td>
				</tr>
				<tr>
					<td>Высокое число <code>bad signature</code></td>
					<td>БД strfry содержит непроверенные события: изучите их; импортируйте с <code>--no-verify</code>, только если доверяете источнику</td>
				</tr>
				<tr>
					<td>После запуска нет метаданных NIP-29</td>
					<td>Нет <code>relay.private_key</code>: выполните <code>nostrfy genkey</code> и перезапустите</td>
				</tr>
				<tr>
					<td>Слияние настроек не предлагается</td>
					<td>Файл конфигурации strfry не найден: передайте <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Чек-лист</h2>
	<ul>
		<li>Релей nostrfy остановлен</li>
		<li>База strfry и конфигурация nostrfy сохранены в резервной копии</li>
		<li><code>nostrfy check</code> проходит</li>
		<li>Настройки strfry объединены (или отчёт просмотрен)</li>
		<li>Пробный запуск просмотрен (нет неожиданных bad signature)</li>
		<li>Миграция завершена без ошибок</li>
		<li>Релей запускается; пересоздание групп/ролей записано в журнал</li>
		<li>Числа событий совпадают (минус эфемерные/истёкшие)</li>
		<li>Удалённые события остаются удалёнными (повторная публикация отклоняется)</li>
		<li>Видимость приватных групп проверена анонимно и как участник</li>
		<li>Обратный прокси / DNS / списки релеев клиентов обновлены</li>
	</ul>

	<Callout type="tip" title="strfry всё ещё работает?">
		Если strfry продолжал работать во время экспорта, сделайте догоняющий запуск, когда будете готовы переключиться: остановите
		nostrfy, повторите миграцию с <code>--since &lt;last created_at&gt;</code>, затем запустите снова.
	</Callout>
</div>
