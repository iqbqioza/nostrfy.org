<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Не падает',
			body: 'Защита от перегрузки, выделенные потоки чтения, изоляция паник и строгие лимиты ресурсов. Реле важно только тогда, когда оно работает.'
		},
		{
			icon: 'layers',
			title: 'Полное соответствие спецификациям',
			body: 'Все релейные NIP реализованы и проверены по официальным спецификациям — включая поиск, группы, медиа и API управления.'
		},
		{
			icon: 'box',
			title: 'Один бинарник',
			body: 'Один статический бинарник Rust делает всё: релей, REST API, файловый сервер Blossom, управление NIP-86, демон, ротацию логов и статистику.'
		},
		{
			icon: 'cpu',
			title: 'Лёгкость по природе',
			body: 'Комфортно работает на VPS с 0.25 vCPU / 512 MB. Карта LMDB — разреженная виртуальная резервация; память остаётся стабильной по мере роста базы.'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'О nostrfy',
		url: `${base}/ru/about/`,
		description:
			'nostrfy — открытый серверный движок Nostr-релея на Rust с двойной лицензией MIT или Apache-2.0. Узнайте о проекте и его принципах.',
		inLanguage: 'ru',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` },
		mainEntity: {
			'@type': 'SoftwareApplication',
			name: 'nostrfy',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Linux, FreeBSD',
			license: [
				'https://opensource.org/licenses/MIT',
				'https://www.apache.org/licenses/LICENSE-2.0'
			]
		}
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${aboutJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="О проекте nostrfy"
	description="nostrfy — открытый серверный движок Nostr-релея на Rust с двойной лицензией MIT или Apache-2.0. Узнайте о проекте и его принципах."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">О nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">Универсальный серверный движок Nostr-релея</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> — это сервер релея для протокола
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				, написанный на Rust. Он хранит события клиентов (Amethyst, Damus, Iris и других) и доставляет их по подпискам — расходуя лишь малую часть ресурсов типичного релея.
			</p>
			<p>
				Проект начался с эксперимента: что если релей можно <strong class="text-zinc-200">описать одним файлом конфигурации</strong>, работая на самом маленьком сервере, который можно арендовать, и при этом реализовать все релейные NIP — плюс файловый сервер, REST API и интерфейс управления? Ответ — nostrfy, и он бесплатный: лицензия MIT или Apache-2.0.
			</p>
			<p>
				nostrfy обслуживает официальный релей проекта, и тот же бинарник проверен на Linux (x86_64 и aarch64) и FreeBSD — от VPS с 512 MB до одиночного хоста, обслуживающего сотни тысяч соединений.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			{#each principles as p (p.title)}
				<div class="rounded-xl border border-line bg-surface/40 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={p.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{p.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{p.body}</p>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex flex-wrap gap-3">
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Посмотреть исходный код на GitHub
			</a>
			{#each site.relays as relay (relay.url)}
				<a
					href={relay.url}
					class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-mono text-sm text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
					{relay.url}
				</a>
			{/each}
		</div>
	</div>
</div>
