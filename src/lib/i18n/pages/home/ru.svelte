<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'Конкретная версия',
		'System-wide': 'Для всей системы',
		'Overwrite existing': 'Перезаписать существующий',
		'Build from source': 'Сборка из исходников'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'Открытый социальный клиент Nostr',
			quote:
				'Ditto действительно использует эти NIP — поиск NIP-50, ветки комментариев NIP-22, Zap NIP-57, медиа NIP-94 и статистику NIP-85 — и каждый из них соответствует возможности релея nostrfy.'
		},
		Nostrich: {
			tagline: 'Бесплатный клиент Nostr для веба, iOS, Android и Mac',
			quote:
				'Полнофункциональный клиент, который действительно использует эти NIP — поиск NIP-50, личные сообщения NIP-17/59, Zap NIP-57, опросы NIP-88 и медиа Blossom работают с вашим релеем.'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: 'Полное соответствие спецификациям',
			body: 'Все релейные NIP реализованы и проверены по официальным спецификациям — более 36 NIP плюс файловый сервер Blossom.'
		},
		{
			icon: 'shield',
			title: 'Не падает',
			body: 'Защита от перегрузки, выделенные потоки чтения, изоляция паник и строгие лимиты ресурсов позволяют релею обслуживать клиентов под длительными атаками.'
		},
		{
			icon: 'server',
			title: 'Медиасервер Blossom',
			body: 'Загрузки с адресацией по SHA-256 на отдельном домене — локальный диск или S3-совместимые бакеты (AWS S3, Cloudflare R2), с удалением по подписи владельца.'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: 'Только для чтения /api/v1 для запросов событий по npub1, nevent1 или naddr1 — собственный поток чтения не даёт REST-трафику блокировать WebSocket-подписчиков.'
		},
		{
			icon: 'database',
			title: 'Хранение в LMDB',
			body: 'Надёжное, устойчивое к сбоям хранилище на heed. Карта памяти резервируется разреженно до верхней границы — без изменения размера на ходу, минимальный физический объём.'
		},
		{
			icon: 'wrench',
			title: 'Всё настраивается',
			body: 'Все параметры находятся в nostrfy.toml — никаких опций времени компиляции. Правьте, SIGHUP, готово. Лимиты, переключатели NIP, хранилище и другое.'
		},
		{
			icon: 'network',
			title: 'Работает за TLS-прокси',
			body: 'nginx, Caddy, Cloudflare Tunnel — обновления WebSocket и X-Forwarded-Proto учитываются, поэтому wss:// работает за любым прокси.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'Единый статический бинарник Rust для Linux x86_64, Linux aarch64 и FreeBSD x86_64 — проверен на VPS с 0.25 vCPU / 512 MB.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'событий/с приём', note: 'одно соединение' },
		{ value: '100%', label: 'живая рассылка', note: '10 000 / 10 000 доставок' },
		{ value: '0.32s', label: 'запрос к базе', note: '20 000 событий' },
		{ value: '0.26s', label: 'поиск NIP-50', note: '10 000 результатов' },
		{ value: '7.9 MB', label: 'частный RSS', note: 'при базе 252 MB' }
	];

	const nips = [
		'1', '9', '11', '13', '17', '22', '26', '28', '29', '32', '33', '34', '40', '42', '43',
		'45', '46', '47', '50', '57', '59', '62', '65', '66', '67', '70', '77', '78', '84', '85',
		'86', '87', '88', '94', '98', 'A3', 'Blossom'
	];

	const softwareJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'nostrfy',
		description:
			'Универсальный серверный движок Nostr-релея на Rust. Полное соответствие спецификациям, надёжность и настройка через nostrfy.toml.',
		url: 'https://nostrfy.org/',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Linux, FreeBSD',
		license: ['https://opensource.org/licenses/MIT', 'https://www.apache.org/licenses/LICENSE-2.0'],
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		softwareVersion: '0.1.16',
		installUrl: 'https://nostrfy.org/ru/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'ru'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Nostr-релей, который не падает"
	description="nostrfy — универсальный серверный движок Nostr-релея на Rust. Полное соответствие спецификациям, надёжность и настройка через nostrfy.toml."
/>

<!-- ===== Hero ===== -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true"></div>
	<div
		class="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
		<img
			src="/logo.png"
			width={220}
			height={220}
			alt=""
			class="mx-auto rounded-[2.5rem]"
		/>
		<div
			class="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs text-zinc-400"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true"></span>
			<span>
				Rust · MIT или Apache-2.0 · последний релиз
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			Nostr-релей, который
			<span class="text-accent-gradient">не падает.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> — универсальный серверный движок Nostr-релея.
			Скорость по замыслу, лёгкость по природе, мощь по умолчанию. Установка одной строкой, настройка
			из одного файла TOML и запуск практически на любом VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				Установить nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Быстрый старт
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				Исходный код
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> более 36 релейных NIP
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · контейнеры
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> один бинарник, без зависимостей
			</span>
		</div>
	</div>
</section>

<!-- ===== Live relays ===== -->
<section class="relative border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
		<div class="mx-auto flex max-w-6xl justify-center">
			{#each site.relays as relay (relay.url)}
				<div class="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-line bg-bg/60 p-5">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"></span>
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Работающий релей</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Скопировать URL релея" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Установка одной строкой</h2>
			<p class="mt-3 text-zinc-400">
				Скрипт установки определяет вашу ОС и архитектуру, скачивает подходящий готовый бинарник,
				проверяет его sha256-контрольную сумму и помещает в
				<code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>.
				Без клонирования, без сборки, без sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'Работает без sudo', 'Устанавливается в ~/.local/bin, ~/bin или ~/.cargo/bin — первый из них, уже присутствующий в PATH.'],
				['cpu', 'Linux + FreeBSD', 'Готовые бинарники для x86_64 и aarch64 Linux, а также FreeBSD x86_64.'],
				['wrench', 'Проверка контрольной суммы', 'Контрольная сумма релиза скачивается и проверяется до записи бинарника на диск.']
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

		<div class="mt-8 grid gap-3 md:grid-cols-2">
			{#each installVariants as variant (variant.title)}
				<div class="min-w-0">
					<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{installLabels[variant.title] ?? variant.title}</div>
					<CodeBlock code={variant.command} lang="bash" />
				</div>
			{/each}
		</div>

		<div class="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface/50 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg">
					<Icon name="database" size={17} class="text-accent-400" />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-zinc-100">Переходите со strfry?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Перенесите существующие события одной командой — офлайн, с проверкой и безопасным повтором.
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Руководство по миграции <Icon name="arrow-right" size={15} />
			</a>
		</div>
	</div>
</section>

<!-- ===== Quick start ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
					Запуск меньше чем за минуту
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy включает демон, валидатор конфигурации, живую статистику, ротацию логов и горячую
					перезагрузку — всё, что нужно оператору релея, в одном бинарнике.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init создаёт стандартный nostrfy.toml с полными комментариями',
						'nostrfy check проверяет конфигурацию перед запуском',
						'SIGHUP перезагружает большинство настроек без перезапуска',
						'nostrfy upgrade обновляет бинарник до последнего релиза'
					] as line (line)}
						<li class="flex gap-3 text-sm text-zinc-300">
							<Icon name="check" size={16} class="mt-0.5 shrink-0 text-accent-400" />
							{line}
						</li>
					{/each}
				</ul>
				<a
					href={p('/docs/quick-start/')}
					class="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
				>
					Открыть руководство
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# создаёт стандартный nostrfy.toml и завершается'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# запускает релей как демон'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# соединения, события, размер базы'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Направьте любой клиент Nostr на ws://<host>:8080 — готово."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Для реальных релеев</h2>
			<p class="mt-3 text-zinc-400">
				Каждая возможность подчинена двум целям: не падать и полностью соответствовать спецификациям.
				Результат — релей, который выдерживает атаки, зависшие диски и хосты с малым объёмом памяти.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div class="group rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:border-line-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg transition-colors group-hover:border-accent-500/40">
						<Icon name={feature.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{feature.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Performance ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Измеренная производительность</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Release-сборка, свежая база, ноутбук с 8 потоками. Скорость записи ограничена единственным потоком
			записи LMDB и пакетными коммитами без fsync; потоки чтения ему не мешают.
		</p>
		<div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each benchmarks as b (b.label)}
				<div class="rounded-xl border border-line bg-bg/60 p-5 text-center">
					<div class="text-2xl font-bold tracking-tight text-accent-300">{b.value}</div>
					<div class="mt-1 text-xs font-medium text-zinc-300">{b.label}</div>
					<div class="mt-0.5 text-[11px] text-zinc-600">{b.note}</div>
				</div>
			{/each}
		</div>
		<p class="mt-6 text-center text-xs text-zinc-600">
			Воспроизводится встроенными бенчмарками — см.
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">заметки о производительности</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Полная поддержка NIP по спецификации</h2>
				<p class="mt-3 text-zinc-400">
					Все релейные NIP реализованы и проверены. Список в NIP-11 динамический —
					NIP исчезает из него, когда его kind блокируются.
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Полный справочник NIP <Icon name="arrow-right" size={15} />
			</a>
		</div>

		<div class="mt-8 flex flex-wrap gap-2">
			{#each nips as nip (nip)}
				<span class="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs text-zinc-300">
					{nip}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Clients ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Экосистема отличных клиентов</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy говорит на открытых стандартах NIP, на которые опираются клиенты, — лучшие приложения
				Nostr подключаются и получают всё. Любой клиент, совместимый с NIP, работает с вашим релеем.
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each displayClients as client (client.name)}
				<a
					href={client.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group rounded-xl border border-line bg-bg/60 p-5 transition-colors hover:border-line-2"
				>
					<div class="flex items-center gap-3">
						{#if client.icon}
							<img
								src={client.icon}
								alt=""
								width={40}
								height={40}
								class="rounded-lg"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-accent-300"
							>
								{client.name.charAt(0)}
							</div>
						{/if}
						<div class="min-w-0">
							<div class="flex items-center gap-1.5 text-sm font-semibold text-zinc-100 group-hover:text-white">
								{client.name}
								<Icon name="arrow-up-right" size={13} class="text-zinc-500 group-hover:text-accent-300" />
							</div>
							<div class="truncate text-xs text-zinc-500">{client.tagline}</div>
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">{client.quote}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each client.features as feature (feature)}
							<span
								class="rounded-md border border-line bg-surface/50 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
								{feature}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>

		<p class="mt-6 text-center text-xs text-zinc-600">
			Разрабатываете на Nostr? Направьте любой клиент на ваш релей — см.
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">полный справочник NIP</a>.
		</p>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="relative overflow-hidden">
	<div
		class="absolute inset-x-0 bottom-0 h-72 bg-accent-500/10 blur-[100px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6">
		<h2 class="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight">
			Запустите свой релей за минуты
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			От крошечного VPS до глобального парка — готовый бинарник, валидатор конфигурации и руководства
			по развёртыванию делают это простым.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Установить сейчас
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Руководства по развёртыванию <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Поддержать разработку
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			Есть вопросы? Прочитайте <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">FAQ</a> или узнайте,
			как nostrfy <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">отличается от strfry</a> —
			и <a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">перейдите одной командой</a>.
		</p>
	</div>
</section>
