<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# Смените port = 8080 в файле конфигурации, затем:
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# Если nostrfy запущен, перезапустите его
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Удалите устаревший pid-файл, если он есть
rm -f nostrfy.pid`;
	const tomlExample = `# Правильные примеры
name = "my relay"        # строки — в кавычках "
port = 8080              # числа — без кавычек
enabled_nips = [1, 50]   # списки — в квадратных скобках [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# Снаружи (через IP/порт сервера)
curl http://YOUR_SERVER_IP:8080/health

# Проверьте брандмауэр (например: ufw)
sudo ufw status
# Откройте порт при необходимости
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" в байтах`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Также скопируйте [blossom].local_path при локальном хранилище Blossom.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Устранение неполадок"
	description="Ошибки, с которыми вы столкнётесь чаще всего, — порты, права, TLS, отсутствующие NIP, публикация и тайм-ауты — с пошаговыми исправлениями."
/>

<div class="doc-body">
	<p><strong>Три вещи, которые нужно проверить в первую очередь:</strong></p>
	<ul>
		<li><code>nostrfy check</code> проверяет конфигурацию (большинство ошибок — это ошибки в конфигурации).</li>
		<li><code>tail -f nostrfy.log</code> показывает журнал — причина почти всегда там.</li>
		<li><code>nostrfy restart</code> корректно перезапускает демона.</li>
	</ul>

	<h2 id="cannot-start">Не запускается</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Причина:</strong> порт 80 может занимать только root.</p>
	<p><strong>Исправление:</strong> запустите с <code>sudo</code> или смените порт, например на 8080.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Причина:</strong> другой процесс (старый nostrfy или другой сервер) уже использует этот порт.
	</p>
	<p><strong>Исправление:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Причина:</strong> nostrfy уже запущен; <code>start</code> отказывается запускать второй экземпляр.
	</p>
	<p><strong>Исправление:</strong> используйте <code>nostrfy restart</code> или просто используйте уже работающий экземпляр.</p>

	<h3><code>nostrfy stop</code> зависает / <code>did not stop in time</code></h3>
	<p><strong>Причина:</strong> демон завис или не отвечает.</p>
	<p><strong>Исправление:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Причина:</strong> файл конфигурации — некорректный TOML. Типичные ошибки: забытые кавычки вокруг строки или дважды записанный один и тот же ключ.
	</p>
	<p><strong>Исправление:</strong> сообщение об ошибке содержит номер строки. Проверьте и исправьте эту строку.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Причина:</strong> файл конфигурации не существует.</p>
	<p><strong>Исправление:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Причина:</strong> <code>relay.private_key</code> — невалидный 64-символьный hex-ключ.
	</p>
	<p>
		<strong>Исправление:</strong> выполните <code>nostrfy genkey</code>, чтобы сгенерировать корректный ключ (или задайте
		<code>private_key = ""</code>).
	</p>

	<h3>Много предупреждений в журнале при запуске</h3>
	<p>Строки журнала <code>[WARN]</code> сообщают о проблемах конфигурации. Основные:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Предупреждение</th>
				<th>Значение и исправление</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> не задан — NIP-42 auth, NIP-62 vanish и NIP-98 admin auth не будут работать. Задайте <code>wss://your-public-url</code>.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>Группам нужен секретный ключ. Выполните <code>nostrfy genkey</code>.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>Неиспользуемый устаревший ключ (или опечатка) в конфигурации. Проверьте имя ключа.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					Опечатка в имени секции (например, <code>[serve]</code> вместо <code>[server]</code>). Исправьте её.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>Такая комбинация блокирует всех. Измените один из двух параметров.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					Требование PoW настолько высокое, что никто не может публиковать. Понизьте <code>require_pow</code>.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">Не подключается или работает странно</h2>

	<h3>Клиент получает <code>connection refused</code></h3>
	<p>
		<strong>Причина:</strong> релей не запущен или брандмауэр блокирует порт.
	</p>
	<p><strong>Исправление:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>Внешние клиенты не подключаются, локальные — да</h3>
	<p>
		<strong>Причина:</strong> <code>server.host</code> всё ещё <code>127.0.0.1</code> (по умолчанию), который принимает только локальные подключения.
	</p>
	<p>
		<strong>Исправление:</strong> задайте <code>host = "0.0.0.0"</code> в конфигурации и перезапустите.
	</p>

	<h3>Не подключается через туннель Cloudflare</h3>
	<p>При использовании Cloudflare Tunnel:</p>
	<ul>
		<li>
			Релей работает по обычному HTTP; Cloudflare терминирует TLS, поэтому клиенты используют <code>wss://</code>. Задайте
			<code>public_url = "wss://..."</code> на релее (тогда заработает NIP-42 auth).
		</li>
		<li>
			Cloudflare добавляет заголовок <code>X-Forwarded-Proto</code>. nostrfy одинаково трактует значения
			<code>ws</code> / <code>wss</code> / <code>http</code> / <code>https</code>, поэтому дополнительная настройка обычно не нужна.
		</li>
	</ul>

	<h3><code>error: message too large</code>, и соединение закрывается</h3>
	<p>
		<strong>Причина:</strong> одно сообщение превышает <code>max_ws_message_bytes</code> (по умолчанию 1 МБ).
	</p>
	<p>
		<strong>Исправление:</strong> увеличьте <code>limits.max_ws_message_bytes</code>, если нужны более крупные события, — но проверьте и собственные лимиты клиента.
	</p>

	<h3>Ошибки <code>too many subscriptions</code> / <code>too many filters</code></h3>
	<p>
		<strong>Причина:</strong> достигнуты лимиты на подключения (подписок по умолчанию 20, фильтров по умолчанию 20).
	</p>
	<p>
		<strong>Исправление:</strong> увеличьте <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> (и проверьте настройки клиента).
	</p>

	<h3>Новые подключения отклоняются под нагрузкой</h3>
	<p>
		<strong>Причина:</strong> достигнут <code>max_connections</code> (по умолчанию 10000), сработал лимит на IP
		(<code>max_connections_per_ip</code>, по умолчанию 64) или лимит скорости подключений в секунду на IP
		(<code>max_connections_per_sec_per_ip</code>) отклонил всплеск. Лимиты применяются к каждому подключению — и WebSocket, и обычному HTTP.
	</p>
	<p>
		<strong>Исправление:</strong> проверьте и настройте параметры. <code>max_connections_per_ip = 0</code> отключает лимит на IP; <code>max_connections_per_sec_per_ip = 0</code> отключает лимит скорости. Эти три настройки требуют перезапуска.
	</p>

	<h3>Соединения разрываются через некоторое время</h3>
	<p>
		<strong>Причина:</strong> если задан <code>ws_idle_timeout_secs</code>, простаивающие соединения закрываются. Здоровые клиенты отвечают PONG на PING релея и остаются подключёнными; удаляются только мёртвые пиры.
	</p>
	<p>
		<strong>Исправление:</strong> это задумано — по умолчанию 300 секунд. Задайте
		<code>ws_idle_timeout_secs = 0</code>, чтобы полностью отключить.
	</p>

	<h3>Подписка завершается с <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Причина:</strong> сохранённые события одного REQ превысили <code>max_req_response_bytes</code> (по умолчанию 32 МиБ). Бывает только при очень крупных событиях или очень широких фильтрах.
	</p>
	<p>
		<strong>Исправление:</strong> сузьте фильтр (более строгие <code>since</code> / <code>until</code>, меньший
		<code>limit</code>) или увеличьте <code>max_req_response_bytes</code> (0 отключает бюджет).
	</p>

	<h3>NIP отсутствует в списке NIP-11 <code>supported_nips</code></h3>
	<p>
		<strong>Причина:</strong> публикуемый список динамический — NIP скрывается, когда все определяемые им kinds отклонены: все они в <code>blocked_kinds</code>, ни один из них не в
		<code>allowed_kinds</code>, или эфемерные kinds отклонены через <code>reject_ephemeral</code>.
		NIP-29/43/66 дополнительно требуют <code>relay.private_key</code>, а NIP-86 требует
		<code>rpc.management_token</code> или <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Исправление:</strong> проверьте активные списки доступа — NIP-86 <code>listallowedkinds</code> показывает список разрешённых kind, а <code>GET /</code> сразу показывает действующий <code>supported_nips</code>.
		Уберите блокирующий kind или настройку <code>reject_ephemeral</code>.
	</p>

	<h2 id="publishing">Ошибки при публикации</h2>
	<p>
		Когда публикация не удаётся, 4-й элемент сообщения <code>OK</code> объясняет причину. Самые частые:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ошибка</th>
				<th>Значение и исправление</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>Недействительная подпись события (возможно, сломанный ключ клиента).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					Контент превышает <code>max_content_bytes</code> (по умолчанию 64K символов). Сократите его или увеличьте лимит.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>Тегов больше, чем <code>max_tags</code> (по умолчанию 2000).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Метка времени слишком далеко в будущем (за пределами <code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					Контент или теги содержат строку, похожую на nsec.
					<strong>Никогда не публикуйте секретные ключи.</strong> Удалите строку, и событие будет принято.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>Такое же событие уже сохранено (нормально).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>Публичный ключ забанен (<code>banpubkey</code>) или вне списка разрешённых.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>Этот kind запрещён.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					Публичный ключ превысил <code>max_events_per_min_per_pubkey</code> (скользящее 60-секундное окно). Подождите минуту и повторите, либо увеличьте/отключите лимит.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>ID события забанен.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Повторная публикация удалённого события.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					Требуется аутентификация (когда включён <code>relay.require_auth</code>).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					Аккаунт создан в пределах <code>new_pubkey_min_age_secs</code>. Подождите и повторите.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>Группа не существует (сначала создайте её).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					Группа <code>closed</code>; запросы на вступление без пригласительного кода не удовлетворяются.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Файловый сервер Blossom</h2>

	<h3>Загрузка завершается с ошибкой <code>401</code></h3>
	<p>Событие авторизации загрузки (kind 24242) отклонено. Проверьте, что:</p>
	<ul>
		<li>
			тег <code>expiration</code> токена <strong>присутствует</strong> и задан как unix-метка в будущем,
		</li>
		<li>для upload/media/delete токен несёт тег <code>x</code> с sha256 блоба,</li>
		<li>
			тег <code>server</code> (если есть) точно называет настроенный <code>blossom.host</code> (только hostname, без схемы/пути),
		</li>
		<li>токен подписан в последние 10 минут (окно свежести против повторов),</li>
		<li>и ключ подписи принадлежит самому загрузчику.</li>
	</ul>

	<h3>Загрузка завершается с ошибкой <code>403</code></h3>
	<p>
		Задано <code>blossom.restrict_uploads = true</code>, и публичного ключа нет в списке разрешённых — добавьте его командой
		<code>nostrfy blossom allow npub1...</code> (демон перезагрузится автоматически). Если список выглядит неверно, <code>nostrfy blossom list</code> покажет его.
	</p>

	<h3>Загрузка завершается с ошибкой <code>409</code></h3>
	<p>
		Клиент отправил заголовок <code>X-SHA-256</code>, который не совпадает с фактическим телом запроса (объявленный хеш вычислен по другим байтам — например, файл изменился между хешированием и отправкой).
		Клиенты могут вообще опустить заголовок.
	</p>

	<h3><code>GET /</code> на медиа-хосте отдаёт NIP-11 документ</h3>
	<p>
		Запрос не дошёл до релея с заголовком Blossom Host. Направьте <code>media.example.com</code> (или то, что задано как <code>blossom.host</code>) на тот же порт в обратном прокси, затем
		<code>nostrfy restart</code>.
	</p>

	<h3>Блоб отдаёт 404 сразу после загрузки</h3>
	<p>
		Файл адресуется по содержимому через SHA-256: запрашивайте его по точному хешу, возвращённому в ответе загрузки (<code>/&lt;sha256&gt;</code> или <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). Несовпадение означает,
		что клиент запросил другой хеш, чем отправленные байты.
	</p>

	<h2 id="search-groups-auth">Поиск, группы и auth</h2>

	<h3>Поиск возвращает 0 результатов / неожиданные результаты</h3>
	<p>Поиск nostrfy совпадает по <strong>целым словам</strong>. Обратите внимание, что:</p>
	<ul>
		<li>
			<code>search = "rust"</code> совпадает с событиями, содержащими слово «rust», но <code>"ru"</code>
			НЕ совпадает с «rust» как подстрока.
		</li>
		<li>Ищутся только слова в контенте событий.</li>
		<li>Если <code>search_index = false</code>, поиск всё равно работает, но медленнее.</li>
		<li>
			Если NIP-50 отключён (<code>disabled_nips = [50]</code>), <code>search</code> игнорируется (отправляется NOTICE).
		</li>
	</ul>

	<h3>Метаданные групп (39000-39005) не генерируются</h3>
	<p>
		<strong>Причина:</strong> <code>relay.private_key</code> не задан. Снапшоты групп подписываются собственным ключом релея, поэтому без него ничего не генерируется.
	</p>
	<p><strong>Исправление:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> отклоняет события групп</h3>
	<p>
		<strong>Причина:</strong> группа не существует. В NIP-29 события модерации и запросы на вступление (9021) не могут быть направлены группе до её создания (kind 9007).
	</p>
	<p><strong>Исправление:</strong> сначала создайте группу событием 9007.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Причина:</strong> модерация (добавление участников и т. д.) требует администратора (участника с ролью). Создатель — администратор.
	</p>
	<p><strong>Исправление:</strong> попросите администратора выдать вам роль или создайте собственную группу.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Причина:</strong> группа <code>closed</code>; запросы на вступление без пригласительного кода не одобряются автоматически.
	</p>
	<p><strong>Исправление:</strong> попросите у администратора пригласительный код (9009) и вступайте с тегом <code>code</code>.</p>

	<h3>Случайно покинули группу, или в группе нет администраторов</h3>
	<p>
		<strong>Причина:</strong> запросы на выход NIP-29 (kind 9022) уважаются для любого участника — включая последнего администратора группы, после ухода которого администраторов не остаётся. Без администратора никто больше не может отправлять события модерации (9000/9001/9002/9008).
	</p>
	<p>
		<strong>Исправление:</strong> подпишите событие модерации собственным ключом релея (<code>relay.private_key</code>,
		публичный ключ, публикуемый как NIP-11 <code>self</code>). Согласно NIP-29, события модерации могут исходить от «мастер-ключа релея или … администраторов групп», поэтому релей принимает модерацию групп, подписанную собственным ключом, даже когда в группе нет администраторов. Например, восстановите администратора с <code>kind:9000</code>:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Подпишите и опубликуйте его ключом релея. Либо удалите группу подписанным релеем
		<code>kind:9008</code> (её сохранённые события очищаются) и создайте заново с <code>kind:9007</code>.
		Для этого восстановления нужен настроенный <code>relay.private_key</code>.
	</p>

	<h3>Защищённые события отклоняются с <code>auth-required</code></h3>
	<p>
		<strong>Причина:</strong> защищённые события NIP-70 (с тегом <code>-</code>) могут публиковаться только аутентифицированным автором <strong>на том же соединении</strong>.
	</p>
	<p><strong>Исправление:</strong> включите NIP-42 auth в клиенте перед публикацией.</p>

	<h3>AUTH (NIP-42) возвращает <code>false</code></h3>
	<p>Частые причины:</p>
	<ol>
		<li>
			<code>relay.public_url</code> не задан или неверен — тег <code>relay</code> события AUTH не совпадает с URL релея. Задайте <code>wss://...</code> и перезапустите.
		</li>
		<li>Устаревший challenge — вы отправили AUTH на другом соединении или повторно использовали старый challenge.</li>
		<li>
			Часы клиента сбиты — <code>created_at</code> события AUTH должен быть в пределах ±10 минут от текущего времени.
		</li>
	</ol>

	<h3>API управления NIP-86 возвращает <code>401 unauthorized</code></h3>
	<p><strong>Причина:</strong> отсутствуют или неверны учётные данные.</p>
	<p><strong>Исправление:</strong></p>
	<ul>
		<li>Задайте <code>management_token</code> и отправляйте <code>Authorization: Bearer &lt;token&gt;</code>.</li>
		<li>
			Или задайте <code>admin_pubkey</code> и отправьте NIP-98 auth-событие (тег <code>u</code> должен точно совпадать с URL релея; тег <code>payload</code> обязателен).
		</li>
		<li>Если не задано ни то, ни другое, API управления полностью отключён.</li>
	</ul>

	<h3>Auth-события NIP-98 отклоняются из-за другой схемы или порта</h3>
	<p>
		Спецификация NIP-98 требует, чтобы тег <code>u</code> был <em>в точности</em> тем же, что и абсолютный URL запроса, поэтому nostrfy выводит ожидаемый URL из <code>relay.public_url</code>: его authority плюс HTTP-схема, отображённая из WebSocket-схемы (<code>wss://</code> → <code>https://</code>,
		<code>ws://</code> → <code>http://</code>, <code>nostr+</code> отбрасывается). Без
		<code>public_url</code> релей ожидает обычный <code>http://host:port</code>, который он обслуживает. Тег с другой схемой, другим/опущенным портом либо другим путём или запросом отклоняется — задайте
		<code>relay.public_url</code> как публичный адрес, который подписывают клиенты. Каждое auth-событие также <strong>одноразовое</strong>: повтор той же строки <code>Authorization</code> в пределах 60-секундного окна валидности отклоняется.
	</p>

	<h2 id="db-disk">База данных и диск</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Причина:</strong> достигнут потолок memory-map LMDB (по умолчанию 1 ТБ виртуального адресного пространства; реальное использование диска растёт с данными) — фактически база данных переполнена.
	</p>
	<p><strong>Исправление:</strong> увеличьте <code>database.max_map_size</code> и перезапустите.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Причина:</strong> менее 32 МБ свободного места на диске. Записи останавливаются (для защиты данных); чтения продолжаются.
	</p>
	<p>
		<strong>Исправление:</strong> освободите место на диске. Записи возобновятся автоматически, как только место появится.
		(<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> сообщает <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Причина:</strong> <code>database.map_size</code> больше, чем <code>max_map_size</code>.
	</p>
	<p>
		<strong>Исправление:</strong> задайте <code>map_size</code> на уровне или ниже <code>max_map_size</code> (значений по умолчанию достаточно).
	</p>

	<h3>Проверка размера базы данных</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Резервное копирование / перенос базы данных</h3>
	<p>
		Все данные находятся в каталоге <code>database.path</code>.
		<strong>Остановите релей перед копированием</strong> (копирование живой базы может её повредить).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Работа демона</h2>

	<h3><code>nostrfy stats</code> говорит <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Причина:</strong> файл статистики не существует — демон не запущен или запущен менее нескольких секунд назад.
	</p>
	<p><strong>Исправление:</strong> выполните <code>nostrfy start</code>, подождите несколько секунд и попробуйте снова.</p>

	<h3>Журнал растёт без ограничений</h3>
	<p>
		<strong>Причина:</strong> <code>max_log_size_bytes</code> равен 0 (ротация отключена).
	</p>
	<p>
		<strong>Исправление:</strong> задайте <code>max_log_size_bytes = 52428800</code> (50 МБ) и
		<code>max_log_files = 5</code>. Ротация автоматическая.
	</p>

	<h3>Изменения конфигурации не применяются после reload</h3>
	<p>
		<strong>Причина:</strong> вы перезагрузили (SIGHUP) настройки, фиксированные при старте:
		<code>private_key</code>, <code>api_host</code>, <code>metrics_enabled</code>, настройки LiveKit и списки включения/отключения NIP.
	</p>
	<p>
		<strong>Исправление:</strong> используйте <code>nostrfy restart</code>. В журнале в этом случае есть предупреждение «a restart is required».
	</p>

	<h3>Релей сам завершается</h3>
	<p><strong>Причина:</strong> машина перезагрузилась или у релея закончилась память (OOM).</p>
	<p><strong>Исправление:</strong></p>
	<ol>
		<li>Проверьте конец журнала: <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Проверьте, перезагружалась ли машина: <code>uptime</code> (очень короткое время работы означает перезагрузку).
		</li>
		<li>Проверьте память: <code>free -h</code>.</li>
		<li>Запустите релей снова: <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Совет">
		Чтобы запускать nostrfy автоматически при загрузке, зарегистрируйте его как systemd-сервис со стартовой командой релея в <code>ExecStart</code>.
	</Callout>

	<h3>systemd не может запустить релей на порту 80</h3>
	<p>
		Systemd-сервис, работающий от root, может занимать порт 80. Если в <code>User=</code> задан обычный пользователь,
		либо используйте более высокий порт (например, 8080), либо добавьте
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> в юнит.
	</p>

	<h2 id="still-not-solved">Всё ещё не решено?</h2>
	<ol>
		<li>
			<strong>Проверьте журнал</strong>: <code>tail -100 nostrfy.log</code> — там обычно названа прямая причина.
		</li>
		<li>
			<strong>Перепроверьте конфигурацию</strong>: <code>nostrfy check</code> — показывает предупреждения и ошибки.
		</li>
		<li>
			<strong>Соберите детали воспроизведения</strong>: что вы делали, какой клиент, какая точная ошибка.
		</li>
		<li>
			<strong>Спросите в репозитории проекта</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — при подаче issue включите шаги воспроизведения и журнал.
		</li>
	</ol>
</div>
