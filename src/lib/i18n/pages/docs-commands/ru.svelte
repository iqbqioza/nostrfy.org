<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# сначала dry-run — проверяет каждое событие и ничего не записывает
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# импорт (сначала остановите релей nostrfy)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="Справочник команд"
	description="Все команды nostrfy: init, start, stop, stats, upgrade и migrate-strfry, плюс списки доступа CLI и фильтры подписок inbox/outbox."
/>

<div class="doc-body">
	<h2>Обзор</h2>
	<p>Все команды принимают <code>--config &lt;path&gt;</code> (по умолчанию <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Команда</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Записывает стандартный nostrfy.toml и завершается; файл создаётся с правами 0600</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Генерирует секретный ключ для групп NIP-29, записывает его в relay.private_key, устанавливает права конфигурации 0600 и выводит публичный ключ; если файл изменился после чтения, запись отменяется</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Проверяет конфигурацию (запускать перед стартом)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Запускает как демон; <code>--foreground</code> — запуск в терминале</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Останавливает работающий демон</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Останавливает и запускает заново (перечитывает конфигурацию)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Показывает живую статистику</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Обновляет бинарник до последнего релиза GitHub (или указанной версии); скачивает подходящий для платформы файл, проверяет его sha256 и выполняет проверку <code>--version</code>, затем атомарно заменяет бинарник; параллельные запуски сериализуются файловой блокировкой; без указания версии понижение не выполняется; <code>--force</code> — переустановка</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>Импортирует события из релея strfry — либо через <code>--strfry-db</code> запускает <code>strfry export</code>, либо читает файл JSONL через <code>--input</code>, либо принимает данные через stdin; поддерживает повторный запуск, <code>--dry-run</code>, <code>--since</code> и дополнительное объединение настроек</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Управление списками доступа</h2>
	<p>
		Списки разрешённых/запрещённых ключей релея и список загрузок Blossom хранятся в LMDB и применяются сразу — работающий демон перезагружается автоматически:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>Запрещённый ключ всегда отклоняется при публикации и никогда не отдаётся при чтении.</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> Удаляет IP из сохранённого списка заблокированных NIP-86 (восстановление после самоблокировки); для применения перезапустите демон.
	</p>

	<h2>Фильтры подписок inbox/outbox</h2>
	<p>
		nostrfy расширяет синтаксис фильтров REQ для модели маршрутизации inbox/outbox двумя удобными ключами — это расширение nostrfy, а не часть какого-либо NIP. <code>"outbox"</code> раскрывается в <code>"authors"</code>: только события, <em>созданные этим ключом</em>.
		<code>"inbox"</code> раскрывается в <code>"#p"</code>: только события, <em>адресованные этому ключу</em> (упоминания, ответы, Zap и личные сообщения). Значения могут быть 64-значным hex или в кодировке <code>npub1</code>, либо массивами, объединяемыми с существующим ключом <code>authors</code>/<code>#p</code>; неверный ключ отклоняет подписку:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		Конечные точки также ограничены на запись: <code>/outbox</code> принимает только события, созданные NIP-42-аутентифицированным ключом соединения (<code>server.outbox_write_policy = "any"</code>), либо только собственные события релея (<code>"relay"</code>);
		<code>/inbox</code> принимает только события с тегом <code>p</code>.
	</p>

	<h2>Миграция со strfry</h2>
	<p>
		Одна команда переносит события существующего релея strfry. Миграция выполняется офлайн (сначала остановите релей nostrfy — при занятой базе она откажется работать), читает собственный формат экспорта strfry и безопасна при повторе: дубликаты пропускаются, побочные эффекты удаления применяются заново.
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		Также предлагает объединить эквивалентные настройки strfry в <code>nostrfy.toml</code>, а после прерывания — продолжить с <code>--since</code>. Группы NIP-29 и роли NIP-43 восстанавливаются из импортированных событий при первом запуске. Полное руководство — см.
		<a href={p('/docs/migrating-from-strfry/')}>руководство по миграции</a>.
	</p>

	<Callout type="tip" title="Пошагово">
		Большинство команд также описаны пошагово в <a href={p('/docs/quick-start/')}>руководстве по быстрому старту</a>.
	</Callout>
</div>
