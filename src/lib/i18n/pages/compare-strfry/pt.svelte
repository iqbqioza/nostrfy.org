<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Linguagem', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'Licença', nostrfy: 'MIT ou Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Armazenamento', nostrfy: 'LMDB (sem banco externo)', strfry: 'LMDB (sem banco externo)' },
		{ label: 'Configuração', nostrfy: 'Um único nostrfy.toml, recarga a quente (SIGHUP)', strfry: 'strfry.conf, recarga a quente' },
		{ label: 'NIP anunciados', nostrfy: '34 (36 implementados, incl. opcionais)', strfry: '11 NIP principais' },
		{ label: 'Grupos NIP-29 + LiveKit', nostrfy: 'Integrado', strfry: '—' },
		{ label: 'Servidor de mídia Blossom', nostrfy: 'Integrado (disco local ou S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: '/api/v1 integrado', strfry: '—' },
		{ label: 'API de gerenciamento', nostrfy: 'NIP-86 JSON-RPC com administradores delegados', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Sim', strfry: 'Sim — o strfry o originou' },
		{ label: 'Políticas de escrita / plugins', nostrfy: 'Listas allow/deny integradas + NIP-86', strfry: 'Interface de plugins write-policy' },
		{ label: 'Ferramenta de migração', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/pt/compare/strfry/`,
		description:
			'Uma comparação honesta entre nostrfy e strfry para relays Nostr auto-hospedados — recursos, licenças, operação e como migrar do strfry com um único comando.',
		inLanguage: 'pt',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry: comparação de relays Nostr"
	description="Uma comparação honesta entre nostrfy e strfry para relays Nostr auto-hospedados — recursos, licenças, operação e como migrar do strfry com um único comando."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Comparação</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Ambos são relays Nostr de um único binário, armazenam eventos em LMDB e falam o mesmo protocolo. Mas fazem escolhas diferentes:
			<strong class="text-zinc-200">strfry</strong> é o relay C++ maduro com sistema de plugins write-policy, enquanto
			<strong class="text-zinc-200">nostrfy</strong> é um motor escrito em Rust que reúne os recursos de que o operador precisa — grupos, mídia, REST, gerenciamento — em um binário e um arquivo de configuração.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Visão geral</h2>
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Licença</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			O strfry está sob <strong class="text-zinc-200">GPL-3.0</strong>, que exige que obras derivadas sejam publicadas nos mesmos termos. O nostrfy tem dupla licença <strong class="text-zinc-200">MIT ou Apache-2.0</strong>, então pode ser embutido em produtos de código fechado e relicenciado livremente. Se o seu relay faz parte de uma pilha comercial ou licenciada, isso costuma ser a diferença decisiva.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Configuração e operação</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					O nostrfy é configurado por um único <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					>: identidade, limites, armazenamento, controle de acesso, Blossom e RPC em um só lugar. A maioria das configurações recarrega a quente via SIGHUP.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Cada opção é validada antes de o relay iniciar pelo <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> — tipos errados, limites impossíveis e combinações que bloqueiam o acesso são relatados com correções.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					O daemon inclui rotação de logs, estatísticas ao vivo, endpoint de saúde e métricas Prometheus; a CLI gerencia listas de acesso, atualizações e migrações.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Recursos integrados</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Em vez de acoplar serviços auxiliares, o nostrfy inclui o que um relay público costuma precisar:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'Grupos NIP-29 + LiveKit', 'Grupos aplicados pelo relay, eventos de moderação e metadados de grupo assinados pelo relay, além de salas de áudio/vídeo via LiveKit.'],
				['database', 'Servidor de mídia Blossom', 'Uploads endereçados por conteúdo no seu próprio hostname, em disco local ou em um bucket compatível com S3 (AWS S3, Cloudflare R2).'],
				['server', 'REST API', 'API /api/v1 somente leitura no seu próprio thread de leitura: consulte eventos por npub, nevent ou naddr, com contagens, estatísticas e pesquisa.'],
				['lock', 'Gerenciamento NIP-86', 'API de gerenciamento JSON-RPC com autenticação Bearer ou NIP-98, concessões de métodos delegadas e códigos de convite.']
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Onde o strfry se destaca</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			O strfry continua sendo uma excelente escolha: originou o protocolo negentropy, suporta reinícios sem tempo de inatividade e compressão WebSocket opcional, e sua interface de plugins write-policy permite executar lógica arbitrária em cada publicação. Se você precisa de um sandbox de plugins e de nada mais desta lista, o strfry é ideal. Se prefere grupos, mídia, REST e gerenciamento de fábrica — ou precisa de uma licença permissiva — o nostrfy é o caminho mais curto.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Migrar do strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			Você não precisa começar do zero.<code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> lê o próprio formato de exportação do strfry, verifica cada evento e importa todo o banco — incluindo exclusões NIP-09, efeitos colaterais de moderação NIP-29 e marcas de primeira aparição. É offline, aceita simulação e é seguro repetir.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Ler o guia de migração <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Início rápido <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Referência completa de NIP
			</a>
		</div>
	</div>
</div>
