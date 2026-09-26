<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const call = `curl -X POST http://127.0.0.1:8080/ \\
  -H "Content-Type: application/nostr+json+rpc" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"method":"supportedmethods","params":[]}'`;
</script>

<DocsTitle
	title="Управление NIP-86"
	description="API управления JSON-RPC: модерация, списки доступа, идентичность релея, роли, пригласительные коды и делегированные разрешения на методы, с аутентификацией Bearer или NIP-98."
/>

<div class="doc-body">
	<h2>Включение</h2>
	<p>
		NIP-86 — это JSON-RPC API для управления релеем. Требуется один из двух методов аутентификации, иначе каждый вызов отклоняется:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Метод</th>
				<th>Настройка</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Bearer-токен</td>
				<td>
					Установите <code>rpc.management_token</code> и отправляйте <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Установите <code>rpc.admin_pubkey</code> и отправляйте событие аутентификации NIP-98 (kind 27235), подписанное ключом администратора, в <code>Authorization: Nostr &lt;base64&gt;</code> — тег <code>payload</code> обязателен; каждое событие одноразовое в пределах своего 60-секундного окна
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Вызов API</h2>
	<p>POST / с <code>Content-Type: application/nostr+json+rpc</code>:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Методы</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Метод</th>
				<th>Параметры</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>Список поддерживаемых методов</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Заблокировать pubkey для публикаций (также удаляет его из списка разрешённых)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Разблокировать pubkey</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>Список заблокированных pubkey и причин</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Добавить в список разрешённых (также снимает блокировку)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Удалить из списка разрешённых</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>Список разрешённых</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Разрешить / запретить kind</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>Список разрешённых / запрещённых kind</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Изменить имя / описание / значок релея (сохраняется в файл конфигурации; при невозможности записи файла сообщается об ошибке)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>Управление ролями NIP-43 (поля с неверным типом отклоняются; удаление отсутствующей роли завершается успешно)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Назначить / снять роль (повторное назначение или отсутствующее снятие завершается успешно)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Предоставить / отозвать метод NIP-86 для pubkey без прав администратора — делегировать можно только методы модерации и чтения</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>Список разрешений на методы (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Заблокировать / разблокировать IP (блокировка также разрывает существующие соединения)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>Список заблокированных IP</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Заблокировать событие (блокировка неизвестного id предварительно блокирует его; также удаляет его из списка разрешённых)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Добавить событие в список разрешённых (также снимает блокировку; разрешение неизвестного id предварительно разрешает его)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Удалить событие из списка разрешённых / заблокированных (отсутствующая запись завершается успешно)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>Список заблокированных событий (неудачный поиск возвращает ошибку, а не пустой список)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>Список разрешённых событий</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>События, ожидающие модерации (на этом релее всегда пусто)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>Список пригласительных кодов NIP-43</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Выпустить / отозвать пригласительный код NIP-43 (kind:28934 с кодом из списка допускает его автора)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Делегированное администрирование">
		<code>rpc.admin_pubkey</code> (и токен управления) остаются корневым доступом со всеми методами. Остальные ключи аутентифицируются через NIP-98 и могут выполнять только предоставленные им через <code>assignmethod</code> методы (<code>supportedmethods</code> показывает их собственный поднабор). Управление разрешениями, ролями, пригласительными кодами и идентичностью релея остаётся только для администратора, поэтому получатель не может повысить привилегии. Заблокированный pubkey отклоняется даже при наличии разрешений.
	</Callout>

	<Callout type="note" title="Обслуживается на публичных маршрутах POST /">
		RPC NIP-86 смонтирован на публичных маршрутах POST / релея. Изменения записываются в журнал аудита с ограничением скорости (не более 600 записей в минуту) с указанием аутентифицированной личности. Запросы свыше <code>rpc.max_admin_body_bytes</code> отклоняются с кодом 413.
	</Callout>
</div>
