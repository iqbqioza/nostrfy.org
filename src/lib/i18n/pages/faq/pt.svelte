<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const faqs = [
		{
			q: 'O que é o nostrfy?',
			a: 'O nostrfy é um motor de servidor de relay Nostr tudo-em-um escrito em Rust. Ele armazena eventos de clientes Nostr e os entrega em resposta a assinaturas, implementando todos os NIP do lado do relay, além de um servidor de mídia Blossom opcional, uma API REST somente leitura e uma API de gerenciamento NIP-86 — tudo em um único binário.'
		},
		{
			q: 'O nostrfy é gratuito e de código aberto?',
			a: 'Sim. O nostrfy é software livre, com dupla licença MIT ou Apache-2.0, à sua escolha. O código-fonte está no GitHub e não há níveis pagos, telemetria ou aprisionamento.'
		},
		{
			q: 'Do que preciso para executar o nostrfy?',
			a: 'Um único binário estático roda em Linux (x86_64 e aarch64) e FreeBSD (x86_64). Foi verificado em um VPS de 0,25 vCPU / 512 MB. O armazenamento é um banco LMDB local — nenhum servidor de banco externo é necessário.'
		},
		{
			q: 'Como instalo o nostrfy?',
			a: 'Uma linha: curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. O script detecta seu sistema operacional e arquitetura, baixa o binário pré-compilado correspondente, verifica seu checksum e o coloca no PATH. Você também pode compilar do código-fonte com Cargo ou copiar um modelo de configuração pronto.'
		},
		{
			q: 'Como o nostrfy é configurado?',
			a: 'Tudo fica em um único nostrfy.toml totalmente comentado — identidade do relay, limites, armazenamento, controle de acesso, Blossom e RPC. O nostrfy check valida antes de iniciar, e a maioria das configurações recarrega a quente via SIGHUP sem reiniciar.'
		},
		{
			q: 'Quais NIP o nostrfy suporta?',
			a: 'O nostrfy implementa 36 NIP, incluindo NIP-01, exclusão NIP-09, grupos NIP-29, autenticação NIP-42, pesquisa NIP-50, zaps NIP-57, gift wrap NIP-59, listas de relays NIP-65, negentropy NIP-77, gerenciamento NIP-86 e autenticação HTTP NIP-98. A lista supported_nips do NIP-11 é dinâmica: um NIP desaparece quando os kinds necessários são bloqueados ou desativados.'
		},
		{
			q: 'O nostrfy hospeda arquivos de mídia?',
			a: 'Sim. O servidor de arquivos Blossom integrado hospeda uploads endereçados por conteúdo em seu próprio hostname — disco local ou bucket compatível com S3, como AWS S3 ou Cloudflare R2. Os uploads são autorizados por eventos kind-24242 assinados e podem ser restritos a uma allowlist.'
		},
		{
			q: 'Posso migrar do strfry?',
			a: 'Sim. O nostrfy migrate-strfry importa diretamente um banco strfry ou um export JSONL, aplicando a semântica substituível/endereçável, exclusões NIP-09 e efeitos colaterais de moderação NIP-29, e pode mesclar configurações equivalentes do strfry no nostrfy.toml. A migração é offline, aceita simulação e é segura de repetir.'
		},
		{
			q: 'O nostrfy funciona atrás de um proxy reverso ou do Cloudflare?',
			a: 'Sim. Configure server.trusted_proxies com os endereços do proxy (loopback para nginx ou Caddy no mesmo host, a faixa do balanceador na nuvem) para que os limites por IP, o blockip e os logs vejam o endereço real do cliente. O TLS é terminado pelo seu proxy ou túnel; o nostrfy serve atrás em HTTP e WebSocket comuns.'
		},
		{
			q: 'O nostrfy tem uma API REST?',
			a: 'Sim — uma API /api/v1 somente leitura na mesma porta do relay WebSocket, em seu próprio thread de leitura, então o tráfego REST nunca bloqueia os assinantes. Ela consulta eventos por npub, nevent ou naddr e oferece contagens, estatísticas de autor, divisões por dia/mês e pesquisa de texto completo.'
		},
		{
			q: 'Como o nostrfy se mantém no ar sob carga ou abuso?',
			a: 'Proteção contra sobrecarga, threads de leitura dedicados, isolamento de pânicos e limites rígidos de recursos. Filas limitadas falham rápido em vez de esgotar a memória; os limites de conexões por IP detêm floods de sockets, e um disco travado não bloqueia as leituras. Os subsistemas são isolados e o relay continua servindo.'
		},
		{
			q: 'Como gerencio usuários, banimentos e papéis?',
			a: 'Pela API de gerenciamento JSON-RPC NIP-86 com um token Bearer ou chave de administrador NIP-98: banir chaves, bloquear IPs, gerenciar allowlists de kinds, papéis e códigos de convite. As concessões de métodos permitem delegar a moderação a outras chaves sem dar permissões totais de administrador.'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'pt',
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
	title="Perguntas frequentes"
	description="Respostas sobre o nostrfy: instalação, configuração, suporte a NIP, mídia Blossom, migração do strfry, proxies reversos, licença e gerenciamento."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Perguntas frequentes</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Respostas curtas sobre operar o nostrfy. Tudo abaixo aponta para a
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">documentação</a> — e se preferir, você pode
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">compará-lo com o strfry</a>.
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
				Instalar o nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Ver o código-fonte
			</a>
		</div>
	</div>
</div>
