<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32-byte hex event id",
      "pubkey": "32-byte hex pubkey",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64-byte hex signature"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # страница 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # страница 2 (когда more было true)`;
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc';
	const notesEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1"`;
	const paginateEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?limit=10&offset=10&sort=asc"`;
	const byIdEx = `curl "http://127.0.0.1:8080/api/v1/note1..."
curl "http://127.0.0.1:8080/api/v1/nevent1..."`;
	const naddrEx = `curl "http://127.0.0.1:8080/api/v1/naddr1..."`;
	const searchEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?search=rust"`;
	const tagEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/7?e=<event-id>&limit=100"`;
</script>

<DocsTitle
	title="Справочник по REST API"
	description="HTTP API только для чтения для запроса сохранённых Nostr-событий через GET /api/v1/... — конечные точки, параметры, пагинация, правила видимости и ошибки."
/>

<div class="doc-body">
	<h2>Базовый URL</h2>
	<p>
		API обслуживается по пути <code>/api/v1</code> на том же порту, что и WebSocket-релей:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Маршрутизация по хосту (<code>server.api_host</code>)</h2>
	<p>
		Когда настроен <code>server.api_host</code> (например, <code>api.example.com</code>), API и релей разделяются по заголовку Host: <code>api.example.com</code> получает <code>/api/v1</code>,
		<code>/health</code> и <code>/metrics</code>; любой другой хост получает WebSocket-релей и NIP-11.
		Без <code>api_host</code> API обслуживается на всех хостах. Поддерживается только GET — запросы на обновление WebSocket к <code>/api/v1</code> отклоняются с кодом 403.
	</p>

	<h2>Конечные точки</h2>
	<h3>Пути на основе идентификаторов</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Путь</th>
				<th>Возвращает</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>Последнее событие профиля kind-0</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>Единственное событие с этим id</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>События адреса (kind + автор + d-тег)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>События по pubkey с фильтром по kind (принимает npub1... или nprofile1...; иначе 400)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		В качестве идентификаторов авторов принимаются <code>npub1...</code>, <code>nprofile1...</code> или 64-hex pubkey (без учёта регистра) на каждой конечной точке.
	</p>
	<h3>Конечные точки запросов и агрегации</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — общий запрос с фильтром без идентификатора.</li>
		<li><code>GET /api/v1/count</code> — общее количество для тех же параметров фильтра (семантика NIP-45).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — количество событий автора по kind, сначала наиболее используемые.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — количество по дням за один месяц;
			месяц должен быть 1–12, и каждый день отчитывается с заполнением нулями до последнего дня (каждая запись и итог несут флаг <code>approximate</code>).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — единственное событие по его 64-hex id (префиксы отклоняются).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — сводка автора (всего, первая/последняя активность, разбивка по kind); <code>first_seen</code>/<code>last_seen</code>/месяцы равны <code>null</code>, когда видимых событий нет.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — количество по часам за один день; все 24 часа отчитываются с заполнением нулями (те же флаги <code>approximate</code>, что и для daily).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — ответы (#e) и цитаты (#q), ссылающиеся на событие; id в пути приводится к нижнему регистру перед сопоставлением, а параметр запроса <code>e</code> добавляется через OR к стороне #e.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — последний список подписок автора kind-3.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — самые распространённые kind на релее (ограниченная, отфильтрованная по видимости выборка; флаги <code>approximate</code> и <code>filtered</code>).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — самые активные авторы на релее (ограниченная, отфильтрованная по видимости выборка; флаги <code>approximate</code> и <code>filtered</code>).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — последний список релеев автора NIP-65 (kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — количество по месяцам с заполнением нулями за диапазон since/until (по умолчанию: весь период; максимум 120 месяцев).
		</li>
	</ul>

	<h2>Параметры запроса</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Параметр</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Максимум результатов (по умолчанию 100, ограничено max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Количество видимых результатов для пропуска (пагинация)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Только события с created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Только события с created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> для порядка от старых к новым; по умолчанию — от новых к старым</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>Полнотекстовый поиск NIP-50 (совпадение целых слов)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Фильтр по тегам #e / #p / #t / #d</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Исключить события с этим тегом — применяется до пагинации, поэтому исключённые события никогда не занимают слоты limit или шаги offset
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Формат ответа</h2>
	<p>Успешные ответы возвращают <code>200 OK</code> со следующим телом JSON:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Поле</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>События этой страницы (по умолчанию от новых к старым)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>Количество событий на этой странице</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td><code>true</code>, когда есть следующие страницы (используйте offset для их получения)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Пагинация</h2>
	<p>
		Пагинация выполняется с помощью <code>offset</code> и флага <code>more</code>, вычисленных по <strong>видимой</strong> последовательности — скрытые события никогда не пропускают и не дублируют страницу:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="Особенности конечных точек">
		Одиночные конечные точки (профиль, <code>/ids/&#123;hex&#125;</code>, follows, relays) всё равно принимают <code>offset</code> — <code>?offset=1</code> пропускает единственное событие и возвращает <code>[]</code>.
		Параметры запроса <code>authors</code>/<code>kinds</code> фильтруют только общую конечную точку <code>/query</code>: на kind-конечных точках они молча игнорируются (оба уже предзаполнены), а на id-конечных точках объединяются через AND. Разбивка по kind в <code>stats</code> упорядочена по kind, в отличие от <code>/kinds</code> (сначала по количеству).
	</Callout>

	<h2>Правила видимости</h2>
	<p>API не требует аутентификации, поэтому оно скрывает те же события, что и анонимное WebSocket-подключение:</p>
	<ul>
		<li>Защищённые события NIP-70 (с тегом <code>-</code>)</li>
		<li>Gift wrap NIP-59 (kind 1059)</li>
		<li>Приватный/скрытый контент групп NIP-29 (виден только участникам)</li>
	</ul>

	<h2>Ошибки и коды состояния</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Код</th>
				<th>Значение</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Успех</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Недопустимый идентификатор или параметр запроса</td>
			</tr>
			<tr>
				<td>403</td>
				<td>Попытка обновления WebSocket к /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Неизвестный путь или неверный Host для API (настроен api_host)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>Достигнут лимит параллельности API — повторите попытку позже</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Примеры</h2>
	<p>Получить заметки пользователя (сначала новые):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Пагинация и сортировка:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Получить единственное событие по id (работают и note1..., и nevent1...):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Получить адресуемое событие (naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Поиск:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Фильтр по тегу:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
