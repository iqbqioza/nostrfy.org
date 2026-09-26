<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Introdução ao nostrfy"
	description="O que é o nostrfy, o que ele faz de fábrica e as ideias por trás do motor de relay Nostr tudo-em-um escrito em Rust."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> é um servidor de relay para o protocolo
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a>. Ele armazena os eventos enviados pelos clientes (posts, reações, perfis…) e os entrega em resposta às assinaturas.
	</p>

	<h2>Recursos principais</h2>
	<ul>
		<li><strong>Simples e estável</strong> — escrito em Rust; um único binário faz tudo.</li>
		<li>
			<strong>Armazenamento e pesquisa rápidos</strong> — banco LMDB com índice de pesquisa de texto completo (NIP-50).
		</li>
		<li>
			<strong>Amplo suporte a NIP</strong> — 36 NIP implementados, além do servidor de arquivos Blossom: exclusão, prova de trabalho, delegação, grupos, pesquisa e uma API de gerenciamento.
		</li>
		<li>
			<strong>Fácil de operar</strong> — modo daemon, rotação de logs, recarga a quente da configuração (SIGHUP), estatísticas ao vivo, API REST e métricas Prometheus.
		</li>
		<li>
			<strong>Migração fácil</strong> — um comando importa um banco de dados
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			existente: simulação, mesclagem de configurações e repetições seguras (<a href={p('/docs/migrating-from-strfry/')}>guia de migração</a>).
		</li>
	</ul>

	<h2>O que você ganha de fábrica</h2>
	<p>
		Um único binário <code>nostrfy</code> em uma única porta serve:
	</p>
	<ul>
		<li>O <strong>relay WebSocket</strong> e o documento de informações NIP-11.</li>
		<li>Uma <strong>API REST</strong> somente leitura em <code>/api/v1/...</code> — com thread de leitura próprio, o tráfego REST nunca bloqueia os assinantes WebSocket.</li>
		<li>O <strong>servidor de arquivos Blossom</strong> (hospedagem de mídia) em seu próprio hostname.</li>
		<li>O <strong>RPC de gerenciamento NIP-86</strong>, a verificação de saúde e o <code>/metrics</code> do Prometheus.</li>
	</ul>

	<h2>Perfil de recursos</h2>
	<p>
		O nostrfy foi verificado em um <strong>VPS de 0,25 vCPU / 512 MB</strong>. O mapa de memória LMDB é uma reserva virtual esparsa de 1 TiB — o disco físico só cresce com dados reais — e a memória do processo permanece estável: um relay com banco de 252 MB usava <strong>7,9 MB de RSS privado</strong>.
	</p>

	<h2>Uma ideia rápida</h2>
	<p>Três comandos para instalar, inicializar e iniciar:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Depois verifique se o relay está no ar:</p>
	<CodeBlock code={health} lang="bash" />
	<p>E obtenha o documento NIP-11:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Próximos passos">
		Siga o <a href={p('/docs/quick-start/')}>início rápido</a> para a primeira execução, ou vá direto para a
		<a href={p('/docs/configuration/')}>referência de configuração</a> para ajustar o relay.
	</Callout>
</div>
