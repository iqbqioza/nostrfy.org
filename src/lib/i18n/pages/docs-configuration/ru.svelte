<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="Справочник по конфигурации"
	description="Полный справочник по nostrfy.toml: каждый ключ, его тип, значение по умолчанию и точное назначение — лимиты, база данных, демон, контроль доступа и Blossom."
/>

<div class="doc-body">
	<h2>Основы</h2>
	<p>
		Конфигурация — это <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a> файл, по
		умолчанию с именем <code>nostrfy.toml</code>. Создайте его командой <code>init</code>:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Проверьте его (рекомендуется перед каждым запуском):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Каждая команда принимает <code>--config &lt;path&gt;</code> (по умолчанию <code>nostrfy.toml</code>).</p>
	<p>Общий синтаксис:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Разделы конфигурации</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Раздел</th>
				<th>Назначение</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>[relay]</code></td>
				<td>Идентичность, URL и переключатели NIP</td>
			</tr>
			<tr>
				<td><code>[server]</code></td>
				<td>Сетевая привязка, разделение API, метрики</td>
			</tr>
			<tr>
				<td><code>[rpc]</code></td>
				<td>NIP-86 управляющий RPC (аутентификация, лимит тела)</td>
			</tr>
			<tr>
				<td><code>[limits]</code></td>
				<td>Все лимиты и защита от перегрузки</td>
			</tr>
			<tr>
				<td><code>[database]</code></td>
				<td>Хранилище LMDB, поисковый индекс, лимиты очередей</td>
			</tr>
			<tr>
				<td><code>[daemon]</code></td>
				<td>PID-, лог- и stats-файлы и ротация</td>
			</tr>
			<tr>
				<td><code>[access]</code></td>
				<td>Начальные списки контроля доступа (изменяемые в процессе работы)</td>
			</tr>
			<tr>
				<td><code>[blossom]</code></td>
				<td>Файловый сервер Blossom (хостинг медиа)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Каждый ключ необязателен; отсутствующий ключ использует значение по умолчанию.</p>

	<h2>Раздел [relay] — идентичность релея</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>name</code></td>
				<td>string</td>
				<td><code>"nostrfy"</code></td>
				<td>Имя релея, показываемое клиентам через NIP-11</td>
			</tr>
			<tr>
				<td><code>description</code></td>
				<td>string</td>
				<td><code>"A minimal and stable Nostr relay"</code></td>
				<td>Описание релея (NIP-11)</td>
			</tr>
			<tr>
				<td><code>pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Публичный ключ администратора (поле pubkey в NIP-11)</td>
			</tr>
			<tr>
				<td><code>contact</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Контактный URI администратора (mailto: или https://)</td>
			</tr>
			<tr>
				<td><code>icon</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL изображения-иконки релея</td>
			</tr>
			<tr>
				<td><code>post_policy</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL на политику публикации релея</td>
			</tr>
			<tr>
				<td><code>private_key</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Собственный секретный ключ релея; нужен для групп NIP-29</td>
			</tr>
			<tr>
				<td><code>public_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Публичный URL, напр. wss://relay.example.com</td>
			</tr>
			<tr>
				<td><code>livekit_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL сервера LiveKit для аудио/видео комнат NIP-29</td>
			</tr>
			<tr>
				<td><code>livekit_api_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>API-ключ LiveKit</td>
			</tr>
			<tr>
				<td><code>livekit_api_secret</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>API-секрет LiveKit (для подписи JWT)</td>
			</tr>
			<tr>
				<td><code>enabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Явный список разрешённых NIP</td>
			</tr>
			<tr>
				<td><code>disabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>NIP для отключения (игнорируется, если enabled_nips не пуст)</td>
			</tr>
			<tr>
				<td><code>reject_ephemeral</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Отклонять эфемерные события NIP-01 (kinds 20000-29999)</td>
			</tr>
			<tr>
				<td><code>enabled_git</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Принимать git-события NIP-34 (kinds 1617-1633, 30617/30618)</td>
			</tr>
			<tr>
				<td><code>require_pow</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Требуемое доказательство работы в ведущих нулевых битах</td>
			</tr>
			<tr>
				<td><code>new_pubkey_min_age_secs</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Отклонять события от ключей моложе этого (секунды; 0 = выкл.)</td>
			</tr>
			<tr>
				<td><code>max_events_per_min_per_pubkey</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Лимит публикации на ключ (в минуту; 0 = без лимита)</td>
			</tr>
			<tr>
				<td><code>max_groups</code></td>
				<td>integer</td>
				<td><code>1000</code></td>
				<td>Лимит in-memory хранилища групп NIP-29</td>
			</tr>
			<tr>
				<td><code>require_auth</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Требовать аутентификацию NIP-42 для REQ/EVENT/COUNT/NEG</td>
			</tr>
			<tr>
				<td><code>send_auth_challenge</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Отправлять AUTH-challenge при подключении</td>
			</tr>
			<tr>
				<td><code>enabled_nip78_auth</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Требовать NIP-42 AUTH перед приёмом событий kind 78/30078</td>
			</tr>
			<tr>
				<td><code>enabled_command_events</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Выполнять операторские команды kind:1 от admin-ключа</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Детали ключей</h3>
	<ul>
		<li>
			<strong>private_key</strong> — собственный секретный ключ релея, которым подписываются сгенерированные релеем события: метаданные
			групп NIP-29 (39000-39005) и события ролей/участников NIP-43. Создайте командой <code>nostrfy genkey</code>; храните в
			секрете. Читается один раз при запуске, поэтому его изменение требует перезапуска.
		</li>
		<li>
			<strong>public_url</strong> — используется для проверки тегов с URL от клиентов: NIP-42 AUTH, NIP-62 vanish и
			NIP-98 admin auth. Если пусто, релей откатывается к <code>host:port</code>, который никогда не совпадёт с реальным
			URL клиента при привязке <code>0.0.0.0</code> или <code>127.0.0.1</code> (пишется предупреждение).
			<strong>Всегда задавайте его.</strong>
		</li>
		<li>
			<strong>enabled_nips против disabled_nips</strong> — побеждает список разрешённых: когда <code>enabled_nips</code>
			не пуст, рекламируются только его NIP, а <code>disabled_nips</code> игнорируется. Оба требуют перезапуска.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — kinds 20000-29999 отклоняются, но освобождённые kinds, которые NIP требуют
			ретранслировать, всё равно пересылаются: 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 и 21059. Применяется по
			SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — опциональный NIP-34: принимает kinds 1617-1633 и 30617/30618 и рекламирует NIP-34.
			По умолчанию выключен, т.к. патчи могут быть большими. Применяется по SIGHUP.
		</li>
	</ul>

	<h2>Раздел [server] — настройки сервера</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>"127.0.0.1"</code></td>
				<td>Адрес привязки; 0.0.0.0 принимает соединения отовсюду</td>
			</tr>
			<tr>
				<td><code>port</code></td>
				<td>integer</td>
				<td><code>8080</code></td>
				<td>Порт (1-65535); порт 80 требует root</td>
			</tr>
			<tr>
				<td><code>api_host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Имя хоста, выделенное под REST API</td>
			</tr>
			<tr>
				<td><code>metrics_enabled</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Отдавать метрики Prometheus на /metrics</td>
			</tr>
			<tr>
				<td><code>ws_paths</code></td>
				<td>string</td>
				<td><code>"root"</code></td>
				<td>Пути конечных точек WebSocket: root, inbox-outbox или all</td>
			</tr>
			<tr>
				<td><code>inbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Кто может писать в /inbox: «any» или «relay» (события всё равно должны нести p-тег)</td>
			</tr>
			<tr>
				<td><code>outbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Кто может писать в /outbox: «any» (собственные события NIP-42-аутентифицированного ключа) или «relay»</td>
			</tr>
			<tr>
				<td><code>trusted_proxies</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>Адреса/CIDR обратных прокси, чьему X-Forwarded-For доверяем (пусто = не доверять никому)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Детали ключей</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> привязывает все интерфейсы IPv4; <code>127.0.0.1</code> — только локально.</li>
		<li><strong>port</strong> — 1-65535; порт 80 требует root. Этот один порт обслуживает WebSocket-релей, NIP-11 документ, REST API и NIP-86 RPC вместе.</li>
		<li>
			<strong>api_host</strong> — выделяет REST API под одно имя хоста, чтобы API и релей могли делить один
			порт за обратным прокси. Фиксируется при запуске — требует перезапуска.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> обслуживает только /, <code>inbox-outbox</code> обслуживает только /inbox и
			/outbox, <code>all</code> — и то, и другое. Фиксируется при запуске — требует перезапуска.
		</li>
		<li>
			<strong>trusted_proxies</strong> — перечисляйте только собственные адреса прокси (loopback для nginx/Caddy на том же
			хосте, диапазон источника балансировщика в облаке). Если задано, IP клиента выводится из последней недоверенной
			записи <code>X-Forwarded-For</code> для лимитов на IP, ограничения скорости, <code>blockip</code> и журналов. Никогда
			не добавляйте адрес, доступный клиентам напрямую — они смогут подделать заголовок и обойти per-IP лимиты.
			Фиксируется при запуске — требует перезапуска.
		</li>
	</ul>

	<h2>Раздел [rpc] — управление NIP-86</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>management_token</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Bearer-токен для управляющих API</td>
			</tr>
			<tr>
				<td><code>admin_pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Публичный ключ администратора для NIP-98 auth управления</td>
			</tr>
			<tr>
				<td><code>max_admin_body_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Лимит тела для управляющего RPC NIP-86</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		NIP-86 RPC смонтирован на публичных маршрутах релея <code>POST /</code> — отдельного управляющего
		порта нет. <code>management_token</code> и <code>admin_pubkey</code> иногда встречаются под <code>[server]</code>
		в старых гайдах; эти написания — устаревшие алиасы этих ключей <code>[rpc]</code>.
	</p>

	<h2>Раздел [limits] — лимиты и защита</h2>
	<h3>Соединения и сообщения</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_connections</code></td>
				<td>integer</td>
				<td><code>10000</code></td>
				<td>Максимум одновременных соединений</td>
			</tr>
			<tr>
				<td><code>max_connections_per_ip</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Максимум соединений на исходный IP</td>
			</tr>
			<tr>
				<td><code>max_ws_message_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Максимум байт на WebSocket-сообщение/фрейм</td>
			</tr>
			<tr>
				<td><code>socket_recv_buffer_kb</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Ядерный приёмный буфер на соединение (KiB)</td>
			</tr>
			<tr>
				<td><code>max_out_queue_bytes</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Лимит исходящей очереди на соединение (байты)</td>
			</tr>
			<tr>
				<td><code>ws_idle_timeout_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>Закрывать простаивающие соединения через это время</td>
			</tr>
			<tr>
				<td><code>http_read_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>Таймаут заголовка HTTP-запроса (защита от slow-loris)</td>
			</tr>
			<tr>
				<td><code>max_connections_per_sec_per_ip</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Максимум новых соединений в секунду на исходный IP</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Подписки и запросы</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_filters</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Максимум фильтров на REQ</td>
			</tr>
			<tr>
				<td><code>max_subscriptions</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Максимум подписок на соединение</td>
			</tr>
			<tr>
				<td><code>max_limit</code></td>
				<td>integer</td>
				<td><code>500</code></td>
				<td>Потолок для REQ limit</td>
			</tr>
			<tr>
				<td><code>max_count</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Потолок для результатов COUNT</td>
			</tr>
			<tr>
				<td><code>max_sub_id_len</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Макс. длина id подписки (символы, не байты)</td>
			</tr>
			<tr>
				<td><code>max_sub_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Суммарный размер фильтров подписок на соединение</td>
			</tr>
			<tr>
				<td><code>max_req_response_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>Потолок суммарных байт, которые может отправить один ответ REQ</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>События</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_content_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Макс. длина content события в символах</td>
			</tr>
			<tr>
				<td><code>max_tags</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Максимум тегов на событие</td>
			</tr>
			<tr>
				<td><code>max_tag_value_bytes</code></td>
				<td>integer</td>
				<td><code>1024</code></td>
				<td>Максимум байт на значение тега</td>
			</tr>
			<tr>
				<td><code>max_created_at_future_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Допустимый уход created_at в будущее</td>
			</tr>
			<tr>
				<td><code>group_late_publish_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Допустимое отставание админ-событий групп NIP-29 (секунды)</td>
			</tr>
			<tr>
				<td><code>max_neg_items</code></td>
				<td>integer</td>
				<td><code>100000</code></td>
				<td>Максимум записей на NIP-77 negentropy-синхронизацию</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Устаревшие алиасы: <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> и
		<code>limits.max_indexed_words</code> по-прежнему принимаются как алиасы <code>relay.require_pow</code>,
		<code>relay.new_pubkey_min_age_secs</code> и <code>database.max_indexed_words</code>.
	</p>
	<h3>REST API</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_api_concurrent</code></td>
				<td>integer</td>
				<td><code>8</code></td>
				<td>Максимум одновременных запросов /api/v1</td>
			</tr>
			<tr>
				<td><code>max_api_limit</code></td>
				<td>integer</td>
				<td><code>5000</code></td>
				<td>Потолок параметра limit API</td>
			</tr>
			<tr>
				<td><code>max_api_offset</code></td>
				<td>integer</td>
				<td><code>50000</code></td>
				<td>Потолок параметра offset API</td>
			</tr>
			<tr>
				<td><code>max_api_fetch</code></td>
				<td>integer</td>
				<td><code>55001</code></td>
				<td>Макс. окно предвыборки для offset-запросов — должно покрывать max_api_offset + max_api_limit + 1 (0 = без ограничения)</td>
			</tr>
			<tr>
				<td><code>max_api_search_bytes</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Максимум байт параметра search API</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Живая рассылка</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>live_batch_interval_ms</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Как часто сбрасываются живые события (мс)</td>
			</tr>
			<tr>
				<td><code>live_batch_size</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Максимум событий на живой батч</td>
			</tr>
			<tr>
				<td><code>live_buffer</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Размер очереди живой рассылки</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Раздел [database] — база данных</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>path</code></td>
				<td>string</td>
				<td><code>"./data"</code></td>
				<td>Каталог базы данных (LMDB)</td>
			</tr>
			<tr>
				<td><code>max_dbs</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Максимум именованных баз LMDB</td>
			</tr>
			<tr>
				<td><code>max_readers</code></td>
				<td>integer</td>
				<td><code>128</code></td>
				<td>Максимум одновременных читателей LMDB</td>
			</tr>
			<tr>
				<td><code>map_size</code></td>
				<td>integer</td>
				<td><code>1073741824</code> (1 GB)</td>
				<td>Нижняя граница размера memory map (байты)</td>
			</tr>
			<tr>
				<td><code>max_map_size</code></td>
				<td>integer</td>
				<td><code>1099511627776</code> (1 TB)</td>
				<td>Потолок memory-map (байты)</td>
			</tr>
			<tr>
				<td><code>purge_interval_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>Интервал очистки NIP-40 (секунды)</td>
			</tr>
			<tr>
				<td><code>search_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Включить словесный индекс NIP-50</td>
			</tr>
			<tr>
				<td><code>reader_threads</code></td>
				<td>integer</td>
				<td><code>2</code></td>
				<td>Выделенные потоки сканирования</td>
			</tr>
			<tr>
				<td><code>max_indexed_words</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Слов content каждого события индексируется для поиска</td>
			</tr>
			<tr>
				<td><code>meta_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Писать заголовок метаданных события для предфильтра сканирования</td>
			</tr>
			<tr>
				<td><code>disabled_fsync</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Пропускать синхронный сброс на диск после каждого батча записи</td>
			</tr>
			<tr>
				<td><code>db_buffer_size</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Начальный WebSocket-буфер на соединение (байты)</td>
			</tr>
			<tr>
				<td><code>db_request_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>Сколько запрос к базе может ждать перед ошибкой</td>
			</tr>
			<tr>
				<td><code>max_db_queue_msgs</code></td>
				<td>integer</td>
				<td><code>4096</code></td>
				<td>Максимум сообщений в очереди перед быстрым отказом</td>
			</tr>
			<tr>
				<td><code>max_db_queue_events</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Максимум событий в батчах очереди перед быстрым отказом</td>
			</tr>
			<tr>
				<td><code>max_db_queue_bytes</code></td>
				<td>integer</td>
				<td><code>268435456</code> (256 MiB)</td>
				<td>Максимум байт запросов к базе в очереди перед быстрым отказом (0 = без байтового лимита)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Детали ключей</h3>
	<ul>
		<li>
			<strong>map_size</strong> — нижняя граница memory map: карта всегда открывается не меньше этого размера.
		</li>
		<li>
			<strong>max_map_size</strong> — потолок, открывается как разреженное виртуальное резервирование: физический диск растёт только
			с реально записанными данными. Повысьте его при <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — поиск всё равно работает (полнословное сопоставление с content), но сканирования
			становятся медленнее; на крошечном VPS это вдвое уменьшает базу. Рекомендуется на маленьких инстансах.
		</li>
		<li>
			<strong>disabled_fsync</strong> — компромисс надёжности ради пропускной способности: записи фиксируются в page cache ОС, и
			потеря питания может уничтожить самые свежие записи.
		</li>
	</ul>

	<h2>Раздел [daemon] — демон</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>pid_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.pid"</code></td>
				<td>Путь к PID-файлу</td>
			</tr>
			<tr>
				<td><code>log_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.log"</code></td>
				<td>Путь к лог-файлу</td>
			</tr>
			<tr>
				<td><code>stats_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.stats.json"</code></td>
				<td>Путь к файлу статистики</td>
			</tr>
			<tr>
				<td><code>stats_interval_secs</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Интервал записи статистики (секунды)</td>
			</tr>
			<tr>
				<td><code>max_log_size_bytes</code></td>
				<td>integer</td>
				<td><code>52428800</code> (50 MB)</td>
				<td>Размер ротации лога (0 = без ротации)</td>
			</tr>
			<tr>
				<td><code>max_log_files</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Сколько поколений ротированных логов хранить</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Пути разрешаются относительно каталога файла конфигурации, поэтому остаются корректными после смены рабочего каталога демоном.</p>

	<h2>Раздел [access] — контроль доступа</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>restrict_relay</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Публиковать могут только ключи из списка разрешённых</td>
			</tr>
			<tr>
				<td><code>blocked_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Kinds для отклонения</td>
			</tr>
			<tr>
				<td><code>allowed_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Список разрешённых kinds; если не пуст, принимаются только эти kinds</td>
			</tr>
			<tr>
				<td><code>blocked_ips</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>IP-адреса, отклоняемые при подключении</td>
			</tr>
			<tr>
				<td><code>method_grants</code></td>
				<td>table: pubkey → array of strings</td>
				<td><code>&#123;&#125;</code></td>
				<td>Гранты методов NIP-86 для не-админ ключей (управляются в процессе работы через <code>assignmethod</code>)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Списки разрешённых/запрещённых ключей — <strong>не</strong> ключи конфигурации — они хранятся в базе релея (LMDB) и
		управляются в процессе работы:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — только ключи из списка разрешённых могут <strong>публиковать</strong>, а
			чтение остаётся открытым для всех (любой клиент может подписываться и читать).
		</li>
		<li>Запрещённый ключ всегда отклоняется при публикации и никогда не обслуживается при чтении.</li>
		<li>
			<strong>method_grants</strong> — гранты методов NIP-86 для не-админ ключей (ключ → имена методов, напр. модератору
			разрешены <code>banevent</code> и <code>listbannedevents</code>). При первом запуске засеиваются из конфигурации,
			затем управляются в процессе работы через NIP-86 <code>assignmethod</code>/<code>unassignmethod</code>
			(просмотр через <code>listmethodassignees</code>). Выдавать можно только модерационные и читающие методы —
			управление правами, ролями, инвайтами и идентичностью релея остаётся только админским, а забаненный ключ
			отклоняется даже с грантами. См.
			<a href={p('/docs/management/')}>управляющий API</a>.
		</li>
	</ul>

	<h2>Раздел [blossom] — файловый сервер Blossom</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ключ</th>
				<th>Тип</th>
				<th>По умолчанию</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Имя хоста сервера Blossom (пусто = отключено)</td>
			</tr>
			<tr>
				<td><code>storage</code></td>
				<td>string</td>
				<td><code>"local"</code></td>
				<td>Бэкенд: «local» (local_path) или «s3» (S3-совместимый бакет)</td>
			</tr>
			<tr>
				<td><code>local_path</code></td>
				<td>string</td>
				<td><code>"/var/lib/nostrfy/images"</code></td>
				<td>Локальный корень хранилища медиафайлов</td>
			</tr>
			<tr>
				<td><code>max_upload_bytes</code></td>
				<td>integer</td>
				<td><code>20971520</code> (20 MB)</td>
				<td>Макс. размер медиафайла</td>
			</tr>
			<tr>
				<td><code>min_free_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>Свободного места ниже — загрузки отклоняются</td>
			</tr>
			<tr>
				<td><code>s3_endpoint</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-совместимая конечная точка (напр. R2)</td>
			</tr>
			<tr>
				<td><code>s3_region</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Регион S3 (R2 использует «auto»)</td>
			</tr>
			<tr>
				<td><code>s3_bucket</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Имя S3-бакета</td>
			</tr>
			<tr>
				<td><code>s3_access_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Ключ доступа S3</td>
			</tr>
			<tr>
				<td><code>s3_secret_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Секретный ключ S3</td>
			</tr>
			<tr>
				<td><code>restrict_uploads</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Загружать могут только ключи из списка разрешённых</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Горячая перезагрузка (SIGHUP)</h2>
	<p>
		Отредактируйте файл и отправьте <code>kill -HUP $(cat nostrfy.pid)</code> — конфигурация перезагрузится <strong>без
		перезапуска</strong>. Большинство настроек вступают в силу сразу; несколько зафиксированы при запуске:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Применяется по SIGHUP</th>
				<th>Требует перезапуска</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td>
				<td>relay.private_key</td>
			</tr>
			<tr>
				<td>reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>relay.livekit_*, enabled_nips / disabled_nips</td>
			</tr>
			<tr>
				<td>большая часть [limits]</td>
				<td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, размеры демона, лимиты, blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] перезагрузкой не применяется — списки засеиваются один раз при запуске и затем управляются в процессе работы через NIP-86.
		Журнал предупреждает, когда изменилась настройка, требующая перезапуска, а несколько захваченных при запуске настроек проверкой
		перезагрузки не охватываются.
	</p>

	<Callout type="warning" title="Частые ошибки">
				<div class="overflow-x-auto">
			<table>
			<thead>
				<tr>
					<th>Ошибка</th>
					<th>Исправление</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>public_url не задан</td>
					<td>задайте <code>wss://...</code></td>
				</tr>
				<tr>
					<td>host остался 127.0.0.1</td>
					<td>внешние клиенты не могут подключиться</td>
				</tr>
				<tr>
					<td>private_key не задан при NIP-29</td>
					<td>выполните <code>nostrfy genkey</code> + перезапуск</td>
				</tr>
				<tr>
					<td>restrict_relay true при пустом списке разрешённых</td>
					<td>все заблокированы</td>
				</tr>
				<tr>
					<td>изменили ключи только-для-перезапуска и послали лишь SIGHUP</td>
					<td>используйте <code>nostrfy restart</code></td>
				</tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
