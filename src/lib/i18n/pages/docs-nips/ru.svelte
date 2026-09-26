<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);
</script>

<DocsTitle
	title="Справочник поддерживаемых NIP"
	description="Все NIP на стороне релея, реализованные в nostrfy — kinds, замечания и оговорки — и как динамически вычисляется список supported_nips в NIP-11."
/>

<div class="doc-body">
	<h2>Реализованные NIP</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Описание</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Базовый протокол (события, подписки)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Удаление событий</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Документ с информацией о релее</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Доказательство работы</td>
			</tr>
			<tr>
				<td>17</td>
				<td>Приватные DM (kind 14, обёрнутый в kind 15; gift wrap kind 1059 и эфемерный kind 21059 выдаются только получателю, когда включена аутентификация NIP-42)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Комментарии (kind 1111, треды через индекс #e)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Делегированное подписание событий</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Публичный чат (на стороне клиента: хранится и отдаётся как обычные события, не рекламируется)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Группы на основе релея</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Метки (kind 1985, индексы #l/#L)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Параметризованные заменяемые события</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					git (kinds 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — включается через
					<code>relay.enabled_git</code>, по умолчанию выключено)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Метка истечения срока</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Аутентификация клиента</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Метаданные доступа релея (роли) — kinds 33534/13534/8000/8001 плюс эфемерные 28934/28935/28936;
					подписанные релеем метаданные закрыты AUTH. Инвайт-коды выдаются через NIP-86
					<code>createclaim</code>/<code>deleteclaim</code>; kind:28934 с указанным кодом допускает
					своего автора
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Подсчёт результатов (COUNT)</td>
			</tr>
			<tr>
				<td>46</td>
				<td>Nostr Connect</td>
			</tr>
			<tr>
				<td>47</td>
				<td>Nostr Wallet Connect</td>
			</tr>
			<tr>
				<td>50</td>
				<td>Возможность поиска (полнотекстовый, с сортировкой по релевантности)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Lightning-запы (kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift wrap (выдача только получателю)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Запрос на удаление</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Метаданные списка релеев</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Обнаружение релеев и доступность (kinds 30166/10166 хранятся и отдаются; публикует собственный kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>Подсказка полноты EOSE</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Защищённые события</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Синхронизация Negentropy (неудачная замена закрывает id с NEG-ERR по NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Данные приложений (kind 30078, закрыто AUTH)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Выдержки</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Доверенные утверждения (kinds 30382/30383/30384/30385/10040, адресуемые)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>API управления релеем</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Анонсы Cashu и Fedimint (kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Опросы</td>
			</tr>
			<tr>
				<td>94</td>
				<td>Метаданные файлов (kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>HTTP-аутентификация</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Платёжные цели (kind 10133, заменяемый), черновик; обслуживается, но не рекламируется
					в <code>supported_nips</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) — не NIP и не рекламируется в документе NIP-11 — он обслуживается как
		отдельный файловый сервер на хосте <code>[blossom]</code>. Подробности см. на
		<a href={p('/docs/blossom/')}>странице файлового сервера Blossom</a>.
	</p>

	<h2>Динамическая реклама NIP</h2>
	<p>
		Список <code>supported_nips</code> не статичен: NIP удаляется из него, когда каждый kind, определённый этим NIP, отклоняется контролем доступа релея.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — блокировка всех kinds какого-либо NIP скрывает его (например, блокировка
			kind 5 скрывает NIP-09). Блокировка лишь некоторых kinds сохраняет NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — kind принимается только если он перечислен; NIP, все
			kinds которого не перечислены, скрывается.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — эфемерные kinds, которых нет в обязательном списке
			исключений (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>), отклоняются, поэтому зависящие от них NIP скрываются.
		</li>
		<li>
			<strong>Предусловия</strong> — NIP-29, NIP-43 и NIP-66 зависят от подписанных релеем событий и
			скрыты без <code>relay.private_key</code>; NIP-86 скрыт, если не заданы
			<code>rpc.management_token</code> или <code>rpc.admin_pubkey</code> (иначе каждый
			управляющий вызов отклоняется).
		</li>
		<li>
			NIP без выделенных kinds (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) всегда рекламируются, когда включены.
		</li>
	</ul>
	<p>
		Изменения в процессе работы — NIP-86 <code>allowkind</code>/<code>disallowkind</code> или перезагрузка SIGHUP
		для <code>reject_ephemeral</code> — отражаются при следующем запросе NIP-11.
		<code>enabled_nips</code>/<code>disabled_nips</code> по-прежнему требуют перезапуска.
	</p>
</div>
