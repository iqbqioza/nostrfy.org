<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Язык', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'Лицензия', nostrfy: 'MIT or Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Хранилище', nostrfy: 'LMDB (внешняя база не нужна)', strfry: 'LMDB (внешняя база не нужна)' },
		{ label: 'Конфигурация', nostrfy: 'Один nostrfy.toml, горячая перезагрузка (SIGHUP)', strfry: 'strfry.conf, горячая перезагрузка' },
		{ label: 'Рекламируемые NIP', nostrfy: '34 (реализовано 36, включая опциональные)', strfry: '11 основных NIP' },
		{ label: 'Группы NIP-29 + LiveKit', nostrfy: 'Встроено', strfry: '—' },
		{ label: 'Медиасервер Blossom', nostrfy: 'Встроено (локальный диск или S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: 'Встроенный /api/v1', strfry: '—' },
		{ label: 'API управления', nostrfy: 'NIP-86 JSON-RPC с делегированием администраторов', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Да', strfry: 'Да — strfry её создал' },
		{ label: 'Политики записи / плагины', nostrfy: 'Встроенные списки разрешений/запретов + NIP-86', strfry: 'Интерфейс плагинов write-policy' },
		{ label: 'Инструмент миграции', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/ru/compare/strfry/`,
		description:
			'Честное сравнение nostrfy и strfry для самостоятельно размещаемых релеев Nostr — функции, лицензии, эксплуатация и миграция со strfry одной командой.',
		inLanguage: 'ru',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry: сравнение релеев Nostr"
	description="Честное сравнение nostrfy и strfry для самостоятельно размещаемых релеев Nostr — функции, лицензии, эксплуатация и миграция со strfry одной командой."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Сравнение</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Оба — однобинарные релеи Nostr, хранящие события в LMDB и говорящие на одном протоколе. Но компромиссы у них разные:
			<strong class="text-zinc-200">strfry</strong> — зрелый C++-релей с системой плагинов write-policy, а
			<strong class="text-zinc-200">nostrfy</strong> — движок на Rust, который упаковывает нужные оператору функции — группы, медиа, REST, управление — в один бинарник и один файл конфигурации.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Кратко</h2>
		<div class="mt-5 overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>nostrfy</th>
						<th>strfry</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.label)}
						<tr>
							<td class="text-zinc-500">{row.label}</td>
							<td class="text-zinc-200">{row.nostrfy}</td>
							<td class="text-zinc-400">{row.strfry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Лицензия</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry распространяется под <strong class="text-zinc-200">лицензией GPL-3.0</strong>, требующей, чтобы производные работы выходили на тех же условиях. nostrfy — <strong class="text-zinc-200">лицензия MIT или Apache-2.0</strong>, поэтому его можно встраивать в закрытые продукты и свободно перелицензировать. Если ваш релей — часть коммерческого или иного лицензированного стека, это часто становится решающим доводом.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Конфигурация и эксплуатация</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy настраивается одним полностью документированным <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					>: идентичность, лимиты, хранилище, контроль доступа, Blossom и RPC в одном месте. Большинство настроек перезагружается на SIGHUP.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Каждая опция проверяется командой <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> перед запуском релея — неверные типы, невозможные лимиты и комбинации с блокировкой сообщаются с рекомендациями.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					В демоне есть ротация журналов, живая статистика, проверка работоспособности и метрики Prometheus; CLI управляет списками доступа, обновлениями и миграциями.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Встроенные функции</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Вместо внешних сервисов nostrfy включает то, что обычно нужно публичному релею:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'Группы NIP-29 + LiveKit', 'группы, принудительно управляемые релеем, события модерации и подписанные релеем метаданные групп, плюс аудио/видеокомнаты через LiveKit.'],
				['database', 'Медиасервер Blossom', 'контентно-адресуемые загрузки работают на отдельном домене и поддерживают локальный диск или S3-совместимый бакет (AWS S3, Cloudflare R2).'],
				['server', 'REST API', 'REST API /api/v1 только для чтения работает в отдельном потоке: запросы событий по npub, nevent или naddr, счётчики, статистика и поиск.'],
				['lock', 'Управление NIP-86', 'API управления JSON-RPC с аутентификацией Bearer или NIP-98, делегированием методов и кодами приглашений.']
			] as [icon, title, body] (title)}
				<div class="rounded-xl border border-line bg-surface/50 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
				</div>
			{/each}
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Преимущества strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry по-прежнему отличный выбор: он создал протокол negentropy, поддерживает перезапуск без простоя и опциональное сжатие WebSocket, а интерфейс плагинов write-policy позволяет выполнять произвольную логику при каждой публикации. Если вам нужна песочница плагинов и больше ничего из этого списка, strfry подойдёт идеально. Если же вы хотите группы, медиа, REST и управление из коробки — или нужна разрешительная лицензия — nostrfy — более короткий путь.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Миграция со strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Вам не нужно начинать с нуля.<code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> читает собственный формат экспорта strfry, проверяет каждое событие и импортирует всю базу — включая удаления NIP-09, побочные эффекты модерации NIP-29 и метки первого появления. Работает офлайн, поддерживает dry-run и безопасен при повторе.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Читать руководство по миграции <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Быстрый старт <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Полный справочник NIP
			</a>
		</div>
	</div>
</div>
