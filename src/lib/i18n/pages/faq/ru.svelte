<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const faqs = [
		{
			q: 'Что такое nostrfy?',
			a: 'nostrfy — универсальный серверный движок Nostr-релея на Rust. Он хранит события от клиентов Nostr и доставляет их по подпискам, реализуя все релейные NIP, а также дополнительный медиасервер Blossom, REST API только для чтения и API управления NIP-86 — всё в одном бинарнике.'
		},
		{
			q: 'nostrfy бесплатен и открыт?',
			a: 'Да. nostrfy — свободное ПО с двойной лицензией MIT или Apache-2.0 на ваш выбор. Исходный код на GitHub, без платных уровней, телеметрии и привязки.'
		},
		{
			q: 'Что нужно для работы nostrfy?',
			a: 'Один статический бинарник работает на Linux (x86_64 и aarch64) и FreeBSD (x86_64). Проверен на VPS с 0.25 vCPU / 512 MB. Хранилище — локальная база LMDB; внешний сервер базы данных не нужен.'
		},
		{
			q: 'Как установить nostrfy?',
			a: 'Одна строка: curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. Скрипт определяет вашу ОС и архитектуру, скачивает подходящий готовый бинарник, проверяет его контрольную сумму и помещает в PATH. Также можно собрать из исходников с Cargo или скопировать готовый шаблон конфигурации.'
		},
		{
			q: 'Как настраивается nostrfy?',
			a: 'Всё находится в одном подробно документированном файле nostrfy.toml — идентичность релея, лимиты, хранилище, контроль доступа, Blossom и RPC. nostrfy check проверяет его перед запуском, а большинство настроек перезагружается на SIGHUP без перезапуска.'
		},
		{
			q: 'Какие NIP поддерживает nostrfy?',
			a: 'nostrfy реализует 36 NIP, включая NIP-01, удаление NIP-09, группы NIP-29, аутентификацию NIP-42, поиск NIP-50, Zap NIP-57, подарочную упаковку NIP-59, списки релеев NIP-65, negentropy NIP-77, управление NIP-86 и HTTP-аутентификацию NIP-98. Список supported_nips в NIP-11 динамический: NIP исчезает, когда нужные ему kinds заблокированы или отключены.'
		},
		{
			q: 'Хостит ли nostrfy медиафайлы?',
			a: 'Да. Встроенный файловый сервер Blossom размещает загрузки с адресацией по содержимому на отдельном домене: локальный диск или S3-совместимый бакет (AWS S3, Cloudflare R2). Загрузки авторизуются подписанными событиями kind-24242 и могут быть ограничены списком.'
		},
		{
			q: 'Можно ли мигрировать со strfry?',
			a: 'Да. nostrfy migrate-strfry напрямую импортирует базу strfry или экспорт JSONL, применяя семантику заменяемых/адресуемых событий, удаления NIP-09 и побочные эффекты модерации NIP-29, а также при желании объединяет эквивалентные настройки strfry в nostrfy.toml. Миграция офлайн, поддерживает dry-run и безопасна при повторе.'
		},
		{
			q: 'Может ли nostrfy работать за обратным прокси или Cloudflare?',
			a: 'Да. Укажите адреса прокси в server.trusted_proxies (loopback для nginx или Caddy на том же хосте, диапазон балансировщика в облаке), чтобы ограничения по IP, blockip и журналы видели реальный адрес клиента. TLS завершается вашим прокси или туннелем; nostrfy за ним отдаёт обычные HTTP и WebSocket.'
		},
		{
			q: 'Есть ли у nostrfy REST API?',
			a: 'Да — /api/v1 только для чтения работает на том же порту, что и WebSocket-релей, в отдельном потоке чтения, поэтому REST-трафик никогда не блокирует подписчиков. Можно запрашивать события по npub, nevent или naddr и получать счётчики, статистику авторов, разбивку по дням/месяцам и полнотекстовый поиск.'
		},
		{
			q: 'Как nostrfy остаётся в строю под нагрузкой и атаками?',
			a: 'Защита от перегрузки, выделенные потоки чтения, изоляция паник и строгие лимиты ресурсов. Ограниченные очереди быстро отклоняют запросы вместо исчерпания памяти, лимиты соединений на IP останавливают флуд сокетов, а зависший диск не блокирует чтение. Подсистемы изолированы, и релей продолжает работать.'
		},
		{
			q: 'Как управлять пользователями, банами и ролями?',
			a: 'Через API управления NIP-86 JSON-RPC с Bearer token или ключом администратора NIP-98: банить публичные ключи, блокировать IP, управлять списками kinds, ролями и кодами приглашений. Назначение методов позволяет делегировать модерацию другим ключам без полных прав администратора.'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'ru',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Частые вопросы"
	description="Ответы о работе nostrfy: установка, конфигурация, поддержка NIP, медиа Blossom, миграция со strfry, обратный прокси, лицензия и управление."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Частые вопросы</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Короткие ответы о работе nostrfy. Всё ниже ссылается на
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">документацию</a> — а если хотите, можно
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">сравнить со strfry</a>.
		</p>

		<div class="mt-10 space-y-3">
			{#each faqs as faq (faq.q)}
				<details class="group rounded-xl border border-line bg-surface/50 p-5">
					<summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-zinc-100">
						{faq.q}
						<Icon
							name="chevron-down"
							size={16}
							class="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
						/>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
				</details>
			{/each}
		</div>

		<div class="mt-12 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Установить nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Посмотреть исходный код
			</a>
		</div>
	</div>
</div>
