<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Nunca cai',
			body: 'Proteção contra sobrecarga, threads de leitura dedicados, isolamento de pânicos e limites rígidos de recursos. Um relay só importa se estiver no ar.'
		},
		{
			icon: 'layers',
			title: 'Totalmente compatível',
			body: 'Todos os NIP do lado do relay implementados e verificados contra as especificações oficiais — incluindo pesquisa, grupos, mídia e API de gerenciamento.'
		},
		{
			icon: 'box',
			title: 'Um único binário',
			body: 'Um único binário Rust estático faz tudo: relay, API REST, servidor de arquivos Blossom, gerenciamento NIP-86, daemon, rotação de logs e estatísticas.'
		},
		{
			icon: 'cpu',
			title: 'Leve por natureza',
			body: 'Funciona confortavelmente em um VPS de 0,25 vCPU / 512 MB. O mapa LMDB é uma reserva virtual esparsa; a memória permanece estável conforme o banco cresce.'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'Sobre o nostrfy',
		url: `${base}/pt/about/`,
		description:
			'O nostrfy é um motor de servidor de relay Nostr de código aberto escrito em Rust, com dupla licença MIT ou Apache-2.0. Conheça o projeto e seus princípios de design.',
		inLanguage: 'pt',
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
	title="Sobre o projeto nostrfy"
	description="O nostrfy é um motor de servidor de relay Nostr de código aberto escrito em Rust, com dupla licença MIT ou Apache-2.0. Conheça o projeto e seus princípios de design."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Sobre o nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">Motor de servidor de relay Nostr tudo-em-um</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> é um servidor de relay para o protocolo
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				, escrito em Rust. Ele armazena os eventos enviados pelos clientes (Amethyst, Damus, Iris e outros) e os entrega em resposta às assinaturas — com uma fração dos recursos de um relay típico.
			</p>
			<p>
				O projeto começou como um experimento: e se um relay pudesse <strong class="text-zinc-200">ser definido por um único arquivo de configuração</strong>, no menor servidor que você pode alugar, e ainda assim implementar todos os NIP do lado do relay — além de servidor de arquivos, API REST e interface de gerenciamento? O nostrfy é a resposta, e é gratuito: licenciado sob MIT ou Apache-2.0.
			</p>
			<p>
				O nostrfy opera o relay oficial do projeto, e o mesmo binário foi verificado em Linux (x86_64 e aarch64) e FreeBSD — de um VPS de 512 MB a um único host servindo centenas de milhares de conexões.
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
				<Icon name="github" size={16} /> Ver o código-fonte no GitHub
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
