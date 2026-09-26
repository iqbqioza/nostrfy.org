<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);
</script>

<DocsTitle
	title="Группы NIP-29"
	description="Группы NIP-29: закрытые чаты, писать в которых могут только участники, с событиями модерации и подписанными релеем снимками состояния группы."
/>

<div class="doc-body">
	<h2>Включение групп</h2>
	<ol>
		<li>
			Выполните <code>nostrfy genkey</code>, чтобы задать <code>relay.private_key</code>
			(<strong>обязательно</strong> — без него метаданные групп не генерируются).
		</li>
		<li>Перезапустите релей.</li>
	</ol>

	<h2>Как работают группы</h2>
	<p>
		Группы создаются и модерируются событиями. Из этих событий модерации релей генерирует
		подписанные снимки, которые клиенты используют для отображения:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Событие</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Создать группу (создатель становится администратором)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Добавить участника (с ролями) / удалить участника</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Изменить метаданные (название, описание, публичная/приватная, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Удалить событие (модерация)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Удалить группу (её сохранённые события очищаются)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Создать пригласительный код</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Обновить список закреплённых</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Запрос на вступление / запрос на выход</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Подписанные релеем снимки</h3>
	<ul>
		<li><code>kind:39000</code> — метаданные группы (название, настройки видимости, ...)</li>
		<li><code>kind:39001</code> — список администраторов</li>
		<li><code>kind:39002</code> — список участников</li>
		<li><code>kind:39005</code> — закреплённые события</li>
	</ul>

	<h2>Настройки видимости группы</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Тег</th>
				<th>Значение</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Только участники могут читать сообщения</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Только участники могут писать</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>Метаданные скрыты от неучастников</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Запросы на вступление не одобряются автоматически (нужны пригласительные коды)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>У группы есть аудио/видео комната LiveKit</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Подгруппы</h2>
	<p>
		Группы могут быть иерархическими — вложенными с помощью тегов <code>parent</code> / <code>child</code>. Циклы
		отклоняются автоматически.
	</p>

	<Callout type="warning" title="Выход из группы">
		Любой участник — включая последнего администратора группы — может выйти с помощью <code>kind:9022</code> и
		автоматически удаляется; если последний администратор выходит, в группе не остаётся администраторов. Сначала назначьте другого администратора,
		либо удалите группу с помощью <code>kind:9008</code>, либо восстановите группу без администратора, подписав
		событие модерации собственным ключом релея (<code>relay.private_key</code>, self pubkey из NIP-11).
		Инструкцию см. в разделе <a href={p('/docs/troubleshooting/')}>устранение неполадок</a>.
	</Callout>
</div>
