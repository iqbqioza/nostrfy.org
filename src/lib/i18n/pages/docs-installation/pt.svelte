<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const lowSpecConfig = `[database]
search_index = false   # reduz o banco pela metade e economiza CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Guia de instalação"
	description="Requisitos, compilação do código-fonte, instalação de um binário pré-compilado, verificação de checksums e notas para executar o nostrfy no FreeBSD."
/>

<div class="doc-body">
	<h2>Requisitos</h2>
	<ul>
		<li>Uma toolchain Rust estável recente (necessária apenas para compilar o relay).</li>
		<li>Uma máquina Linux.</li>
		<li>Recomenda-se 2 GB de RAM ou mais — para um VPS de 0,25 vCPU / 512 MB, veja a nota de poucos recursos abaixo.</li>
	</ul>

	<h3>VPS de poucos recursos (0,25 vCPU / 512 MB)</h3>
	<p>
		O nostrfy foi verificado como estável mesmo quando o banco excede a RAM. O mapa LMDB é uma
		<strong>reserva virtual esparsa de 1 TiB</strong> — o disco físico só cresce com os dados gravados — e a memória do processo permanece estável: um relay com banco de 252 MB usava <strong>7,9 MB de RSS privado</strong>
		(o restante é cache de arquivos recuperável que o kernel descarta sob pressão).
	</p>
	<p>Em um VPS minúsculo, uma configuração faz a maior diferença:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Configuração</th>
				<th>Efeito</th>
				<th>Medido</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Desativa o índice de palavras NIP-50 — a pesquisa continua funcionando (palavras inteiras) mas é mais lenta
				</td>
				<td>41,8 MB → 20,5 MB por 10.000 eventos</td>
			</tr>
			<tr>
				<td>Padrões</td>
				<td>Já ajustado para pouca memória</td>
				<td>Nenhuma alteração necessária para 512 MB</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Compilar do código-fonte</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>Quando a compilação termina, o binário fica em <code>target/release/nostrfy</code>.</p>

	<h2>Instalar um binário pré-compilado</h2>
	<p>
		O fluxo de release anexa binários pré-compilados para <strong>Linux x86_64</strong>, <strong>Linux aarch64</strong> e
		<strong>FreeBSD x86_64</strong>. O mesmo
		<code>install.sh</code> funciona nos dois sistemas — detecta a plataforma, baixa o binário correspondente e verifica seu checksum:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>O nostrfy compila e roda no FreeBSD 13.x e 14.x (amd64). Instale o Rust e compile com:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Notas de plataforma:</p>
	<ul>
		<li>
			<code>start</code>/<code>stop</code>/<code>restart</code> — a verificação de processo ativo usada por
			esses comandos lê o nome do processo via sysctl
			<code>kern.proc.pid.&lt;pid&gt;.comm</code> (no Linux usa
			<code>/proc/&lt;pid&gt;/comm</code>), então um arquivo pid obsoleto cujo pid foi reutilizado por outro programa é detectado em ambas as plataformas.
		</li>
		<li>
			<code>nostrfy start</code> vira daemon como no Linux; o daemon de fork duplo padrão funciona com a integração
			<code>rc</code> (<code>service nostrfy start</code>).
		</li>
		<li>
			A verificação de <code>min_free_bytes</code> usa <code>statvfs</code>, que ambos os sistemas fornecem; nenhum outro código específico de plataforma é usado (o relay em si é Rust assíncrono puro sobre tokio).
		</li>
	</ul>

	<h3>Execução na porta 80</h3>
	<p>
		Usuários comuns não podem vincular a porta 80. Execute com <code>sudo</code> ou use uma porta mais alta, como 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Exemplo: execução na porta 8080 (válido para usuários comuns; altere antes a porta na configuração)."
	/>

	<Callout type="tip" title="Próximo">
		O nostrfy está instalado. Siga o <a href={p('/docs/quick-start/')}>início rápido</a>.
	</Callout>
</div>
