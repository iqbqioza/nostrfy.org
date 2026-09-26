<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'Versão específica',
		'System-wide': 'Instalar para todo o sistema',
		'Overwrite existing': 'Sobrescrever o existente',
		'Build from source': 'Compilar a partir do código-fonte'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'Cliente social Nostr de código aberto',
			quote:
				'O Ditto realmente usa estes NIP — pesquisa NIP-50, comentários em thread NIP-22, zaps NIP-57, mídia NIP-94 e estatísticas NIP-85 fazem parte do seu dia a dia — e cada um corresponde a um recurso do relay nostrfy.'
		},
		Nostrich: {
			tagline: 'Cliente Nostr gratuito para web, iOS, Android e Mac',
			quote:
				'Um cliente completo que realmente usa estes NIP — pesquisa NIP-50, mensagens privadas NIP-17/59, zaps NIP-57, enquetes NIP-88 e mídia Blossom funcionam com o seu relay.'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: 'Totalmente compatível',
			body: 'Todos os NIP do lado do relay implementados e verificados contra as especificações oficiais — mais de 36 NIP e o servidor de arquivos Blossom.'
		},
		{
			icon: 'shield',
			title: 'Nunca cai',
			body: 'Proteção contra sobrecarga, threads de leitura dedicados, isolamento de pânicos e limites rígidos de recursos mantêm o relay em serviço sob abuso contínuo.'
		},
		{
			icon: 'server',
			title: 'Servidor de mídia Blossom',
			body: 'Uploads endereçados por SHA-256 em seu próprio hostname — disco local ou buckets compatíveis com S3 (AWS S3, Cloudflare R2), com exclusão assinada pelo proprietário.'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: 'Uma API /api/v1 somente leitura para consultar eventos por npub1, nevent1 ou naddr1 — seu próprio thread de leitura impede que o tráfego REST bloqueie os assinantes WebSocket.'
		},
		{
			icon: 'database',
			title: 'Persistência em LMDB',
			body: 'Armazenamento durável e à prova de falhas via heed. O mapa de memória é reservado de forma esparsa até o limite — sem redimensionamento em tempo de execução e com consumo físico mínimo.'
		},
		{
			icon: 'wrench',
			title: 'Tudo configurável',
			body: 'Todas as opções ficam no nostrfy.toml — sem opções de compilação. Edite, SIGHUP, pronto. Limites, chaves de NIP, armazenamento e mais.'
		},
		{
			icon: 'network',
			title: 'Funciona atrás de proxies TLS',
			body: 'nginx, Caddy, Cloudflare Tunnel — upgrades WebSocket e X-Forwarded-Proto são respeitados, então wss:// funciona atrás de qualquer proxy.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'Um único binário Rust estático para Linux x86_64, Linux aarch64 e FreeBSD x86_64 — verificado em um VPS de 0,25 vCPU / 512 MB.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'eventos/s de entrada', note: 'uma conexão' },
		{ value: '100%', label: 'Distribuição ao vivo', note: '10.000 / 10.000 entregas' },
		{ value: '0.32s', label: 'consulta armazenada', note: '20.000 eventos' },
		{ value: '0.26s', label: 'pesquisa NIP-50', note: '10.000 resultados' },
		{ value: '7.9 MB', label: 'RSS privado', note: 'com um banco de 252 MB' }
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
			'Motor de servidor de relay Nostr tudo-em-um escrito em Rust. Totalmente compatível com as especificações, feito para nunca cair e configurável pelo nostrfy.toml.',
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
		installUrl: 'https://nostrfy.org/pt/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'pt'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="O relay Nostr que nunca cai"
	description="O nostrfy é um motor de servidor de relay Nostr tudo-em-um escrito em Rust. Totalmente compatível com as especificações, feito para nunca cair e configurável pelo nostrfy.toml."
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
				Rust · MIT ou Apache-2.0 · última versão
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			O relay Nostr que
			<span class="text-accent-gradient">nunca cai.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> é um motor de servidor de relay Nostr tudo-em-um. Rápido por design, leve por natureza, poderoso por padrão. Instalação em uma linha, configuração em um único arquivo TOML e execução em praticamente qualquer VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				Instalar o nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Início rápido
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				Ver o código-fonte
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> mais de 36 NIP do lado do relay
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · contêineres
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> Um binário, sem dependências
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
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Relay ativo</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Copiar a URL do relay" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Instalação em uma linha</h2>
			<p class="mt-3 text-zinc-400">
				O script de instalação detecta seu sistema operacional e arquitetura, baixa o binário pré-compilado correspondente, verifica seu checksum sha256 e o coloca no seu <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>. Sem clonar, sem compilar e sem sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'sem sudo', 'Instala em ~/.local/bin, ~/bin ou ~/.cargo/bin — o primeiro que já estiver no PATH.'],
				['cpu', 'Linux + FreeBSD', 'Binários pré-compilados para Linux x86_64 e aarch64, além de FreeBSD x86_64.'],
				['wrench', 'Checksum verificado', 'O checksum da release é obtido e verificado antes que o binário toque o disco.']
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
					<h3 class="text-sm font-semibold text-zinc-100">Migrando do strfry?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Traga seus eventos existentes com um comando — offline, verificado e seguro de repetir.
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Guia de migração <Icon name="arrow-right" size={15} />
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
					No ar em menos de um minuto
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					O nostrfy inclui um daemon, um validador de configuração, estatísticas ao vivo, rotação de logs e recarga a quente — tudo o que um operador precisa, em um único binário.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init grava um nostrfy.toml padrão totalmente comentado',
						'nostrfy check valida a configuração antes de iniciar',
						'SIGHUP recarrega a maioria das configurações sem reiniciar',
						'nostrfy upgrade atualiza o binário para a última versão'
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
					Abrir o guia de início rápido
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# grava um nostrfy.toml padrão e sai'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# executa o relay como daemon'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# conexões, eventos, tamanho do banco'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Aponte seu cliente Nostr para ws://<host>:8080 — pronto."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Para relays em produção</h2>
			<p class="mt-3 text-zinc-400">
				Cada recurso segue dois objetivos: nunca cair e ser totalmente compatível com as especificações. O resultado é um relay que resiste a abusos, discos travados e hosts com pouca memória.
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
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Desempenho medido</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Build de release, banco novo, notebook de 8 threads. A velocidade de escrita é limitada por um único thread de escrita do LMDB e commits em lote sem fsync; os leitores nunca o bloqueiam.
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
			Reproduzível com os benchmarks incluídos — veja
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">notas de desempenho</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Suporte completo a NIP conforme a especificação</h2>
				<p class="mt-3 text-zinc-400">
					Todos os NIP do lado do relay estão implementados e verificados. A lista publicada no NIP-11 é dinâmica — um NIP sai automaticamente quando seus kinds são bloqueados.
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Referência completa de NIP <Icon name="arrow-right" size={15} />
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
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Um ecossistema de ótimos clientes</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				O nostrfy fala os padrões NIP abertos nos quais os clientes confiam — os melhores aplicativos Nostr se conectam e obtêm a experiência completa. Qualquer cliente compatível com NIP funciona com o seu relay.
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
			Desenvolve no Nostr? Aponte qualquer cliente para o seu relay — veja
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">Referência completa de NIP</a>.
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
			Execute seu próprio relay em minutos
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			Do menor VPS a uma frota global — o binário pré-compilado, o validador de configuração e os guias de implantação tornam tudo indolor.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Instalar agora
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Guias de implantação <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Apoiar o desenvolvimento
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			Dúvidas? <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">Veja o FAQ</a> ou <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">a comparação entre nostrfy e strfry</a> — e <a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">migre com um comando</a>.
		</p>
	</div>
</section>
