<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const config = `[blossom]
host = "media.example.com"          # обязательно — включает функцию
storage = "local"                   # "local" или "s3"
local_path = "./data/images"        # корень локального хранилища
max_upload_bytes = 20971520         # 20 MiB
min_free_bytes = 33554432           # отклонять загрузки, когда на диске меньше свободного места
restrict_uploads = false            # загружать могут только ключи из списка разрешённых

# Для S3 / Cloudflare R2:
s3_endpoint = "https://<account>.r2.cloudflarestorage.com"
s3_region = "auto"
s3_bucket = "nostr-media"
s3_access_key = "..."
s3_secret_key = "..."`;
	const example = `# Информация о сервере
curl https://media.example.com/

# Загрузка (auth-событие из вашего Blossom-клиента, например через nak или blossom-хелпер nostr-tools)
curl -X PUT -H "Authorization: Nostr <auth>" -H "Content-Type: image/png" --data-binary @photo.png https://media.example.com/upload

# Получение
curl https://media.example.com/<sha256>

# Список своих загрузок (auth-событие с t=list; pubkey в пути должен быть вашим)
curl -H "Authorization: Nostr <auth>" https://media.example.com/list/<pubkey-hex>

# Удаление (auth-событие с t=delete и x=<sha256>)
curl -X DELETE -H "Authorization: Nostr <auth>" https://media.example.com/<sha256>`;
	const restrict = `[blossom]
host = "media.example.com"
restrict_uploads = true`;
	const allowlist = `nostrfy blossom allow npub1...          # разрешить ключ (npub1... или hex)
nostrfy blossom deny npub1...           # отозвать ключ
nostrfy blossom list                    # показать список и restrict_uploads`;
</script>

<DocsTitle
	title="Файловый сервер Blossom"
	description="Хостинг медиа на отдельном имени хоста: загрузки с адресацией по содержимому, локальное или S3-совместимое хранилище и авторизация kind-24242 для вашего Nostr-релея."
/>

<div class="doc-body">
	<h2>Обзор</h2>
	<p>
		nostrfy может работать как сервер блобов Blossom: клиенты загружают файлы, адресуемые по их SHA-256-хэшу,
		а релей отдаёт их обратно. Как и REST API, он работает на выделенном имени хоста на том же порту.
	</p>

	<h2>Конфигурация</h2>
	<CodeBlock code={config} lang="toml" />
	<p>
		Направьте <code>media.example.com</code> на тот же порт в вашем обратном прокси, затем перезапустите. GET /
		на этом хосте отвечает документом с информацией о сервере Blossom. При <code>storage = "s3"</code>
		конечная точка должна использовать HTTPS, если хост не является loopback (например, локальный MinIO для тестирования).
	</p>

	<h2>Структура хранилища</h2>
	<p>Оба бэкенда используют иерархию <code>&lt;npub1...&gt;</code> с ключом по SHA-256 файла:</p>
	<ul>
		<li>
			<strong>local</strong> — файлы в <code>&lt;local_path&gt;/&lt;npub1...&gt;/&lt;sha256&gt;</code>
		</li>
		<li>
			<strong>s3 / R2</strong> — объекты <code>&lt;npub1...&gt;/&lt;sha256&gt;</code> в настроенном
			бакете
		</li>
	</ul>
	<p>
		Байты блобов никогда не попадают в базу данных релея — LMDB хранит только отображение sha256 → владелец и
		список разрешённых загрузок.
	</p>

	<h2>Конечные точки</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Метод</th>
				<th>Путь</th>
				<th>Авторизация</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET</code></td>
				<td><code>/</code></td>
				<td>—</td>
				<td>Информация о сервере Blossom</td>
			</tr>
			<tr>
				<td><code>GET</code> / <code>HEAD</code></td>
				<td><code>/&lt;sha256&gt;[.ext]</code></td>
				<td>—</td>
				<td>Получение / проверка блоба (байтовые диапазоны, 206)</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Загрузка блоба — 201 новый, 200 уже существует</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/upload</code></td>
				<td>kind 24242 (t=upload, x=sha256, expiration)</td>
				<td>Предпроверка BUD-06 — будет ли загрузка принята?</td>
			</tr>
			<tr>
				<td><code>PUT</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Медиазагрузка BUD-05 (хранится как есть)</td>
			</tr>
			<tr>
				<td><code>HEAD</code></td>
				<td><code>/media</code></td>
				<td>kind 24242 (t=media, x=sha256, expiration)</td>
				<td>Предпроверка BUD-05 — будет ли загрузка принята?</td>
			</tr>
			<tr>
				<td><code>GET</code></td>
				<td><code>/list/&lt;pubkey&gt;</code></td>
				<td>kind 24242 (t=list, expiration)</td>
				<td>Блобы, загруженные запрашивающим ключом (курсор + limit)</td>
			</tr>
			<tr>
				<td><code>DELETE</code></td>
				<td><code>/&lt;sha256&gt;</code></td>
				<td>kind 24242 (t=delete, x=sha256, expiration)</td>
				<td>Удаление блоба (только загрузивший)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Заметки о безопасности</h2>
	<ul>
		<li>Загруженные пользователями байты отдаются с <code>X-Content-Type-Options: nosniff</code>.</li>
		<li>
			HTML/SVG/XML/JavaScript дополнительно получают <code>Content-Disposition: attachment</code> и
			песочный CSP, поэтому медиа-источник нельзя использовать для хранимого XSS.
		</li>
		<li>
			Токены принимаются как в форме base64url без дополнения из спецификации, так и в стандартной форме с дополнением
			(BUD-11).
		</li>
		<li>
			Заголовок <code>X-SHA-256</code> проверяется по фактическим байтам — несоответствие возвращает 409.
		</li>
		<li>Файлы отдаются с ETag, Cache-Control: immutable и сохранённым типом содержимого.</li>
		<li>Pubkey, заблокированный через NIP-86 <code>banpubkey</code>, отклоняется на каждой конечной точке.</li>
	</ul>

	<h2>Пример</h2>
	<CodeBlock code={example} lang="bash" />

	<h2>Ограничение загрузок</h2>
	<p>Установите <code>restrict_uploads = true</code> в секции <code>[blossom]</code>:</p>
	<CodeBlock code={restrict} lang="toml" />
	<p>
		Список разрешённых хранится в базе данных релея (LMDB) и управляется специальными командами — перезапуск не
		нужен, демон перезагружается автоматически:
	</p>
	<CodeBlock code={allowlist} lang="sh" />
	<p>Загрузки от ключей вне списка отклоняются с кодом 403.</p>

	<h2>Резервные копии и миграция</h2>
	<p>
		Создавайте резервные копии как настроенного хранилища блобов, так и <code>database.path</code>, чтобы сохранить полную
		инвентаризацию и состояние авторизации. Отображение sha256 → владелец сохраняется в LMDB, поэтому перезапуски
		мгновенны и не требуют индекса в памяти или сканирования при старте — поиск читает отображение напрямую из
		базы данных. Автоматическая одноразовая миграция перестраивает отображение из устаревших блобов при первом
		запуске после обновления; маркер пропускает последующие перезапуски.
	</p>
</div>
