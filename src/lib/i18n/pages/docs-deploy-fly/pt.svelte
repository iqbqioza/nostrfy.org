<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # exibido nos clientes via NIP-11
description = "A friendly relay for everyone"
private_key = "..."                            # obrigatório para grupos NIP-29
public_url = "wss://<your-app-name>.fly.dev"   # obrigatório para NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# linha de log: "relay listening on ws://0.0.0.0:8080"
fly logs

# documento de informações NIP-11 no endereço público
curl https://<your-app-name>.fly.dev/

# aponte seu cliente Nostr para wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="Implantar na Fly.io"
	description="Implante o nostrfy na Fly.io em poucos minutos com o modelo pronto — volumes, máquinas, terminação TLS e atualizações simples."
/>

<div class="doc-body">
	<h2>O que vem no repositório</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Arquivo</th>
				<th>Finalidade</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Imagem de contêiner — <strong>baixa o binário de release pré-compilado</strong> dos assets do GitHub (x86_64 / aarch64, conforme a arquitetura de build) e verifica seu checksum sha256. Nenhuma compilação acontece na Fly
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Configuração do app Fly: serviço HTTP na porta 8080, verificações de saúde, montagem do volume <code>/data</code>, máquinas sempre ativas
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					A configuração do relay embutida na imagem em <code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Pré-requisitos</h2>
	<ul>
		<li>Uma conta Fly.io</li>
		<li>A CLI flyctl (<code>fly version</code>)</li>
		<li>Autenticado: <code>fly auth login</code></li>
	</ul>

	<h2>Implantação em quatro passos</h2>

	<h3>1. Crie o app (sem implantar ainda)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> deve ser único na Fly (faz parte da URL do relay:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>: ex. <code>nrt</code> (Tóquio), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — escolha a região mais próxima dos seus usuários
		</li>
		<li>
			Isso pode sobrescrever os valores <code>fly.toml</code> do modelo (nome do app, região) — não há problema
		</li>
	</ul>

	<h3>2. Crie o volume persistente</h3>
	<p>O banco LMDB fica em um volume Fly montado em <code>/data</code>:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB é suficiente para começar (o banco cresce com o uso). Você pode redimensionar depois ou criar um volume maior desde o início.
	</p>

	<h3>3. Configure o relay</h3>
	<p>Edite <code>deploy/nostrfy.container.toml</code> antes de implantar:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>: gere localmente com <code>nostrfy genkey</code> (com uma config temporária) e cole a chave, ou gere com qualquer ferramenta Nostr
		</li>
		<li>
			<code>public_url</code> <strong>deve</strong> corresponder ao nome do seu app — sem ela, NIP-42 AUTH, NIP-62 vanish e a API de gerenciamento NIP-86 não funcionarão
		</li>
		<li>Todo o resto pode ficar nos padrões</li>
	</ul>

	<h3>4. Implantar</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		A Fly constrói a imagem (alguns minutos — o download do binário é rápido, a imagem é pequena), cria uma máquina e executa a verificação de saúde contra <code>/health</code>.
	</p>

	<h2>Verificar</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Escala e atualizações</h2>
	<ul>
		<li>
			<strong>Atualizar o relay</strong>: edite <code>deploy/nostrfy.container.toml</code> e execute <code>fly deploy</code> novamente — a imagem sempre baixa o binário mais recente de release do GitHub, então atualizar é uma simples nova implantação
		</li>
		<li>
			<strong>Fixar uma versão</strong>: <code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> ou altere o <code>ARG</code> no Dockerfile
		</li>
		<li>
			<strong>Escala</strong>: o relay é uma única máquina por padrão. <code>fly machines clone &lt;id&gt;</code> cria uma segunda máquina; ambas compartilham o volume (volumes Fly suportam várias máquinas na mesma região)
		</li>
		<li>
			<strong>Métricas</strong>: a Fly coleta o endpoint <code>/metrics</code> (veja <code>[metrics]</code> em <code>fly.toml</code>) e mostra no painel Fly em Metrics
		</li>
	</ul>

	<h2>Personalizar a configuração</h2>
	<p>
		A imagem lê <code>/etc/nostrfy/nostrfy.toml</code>, embutido a partir de <code>deploy/nostrfy.container.toml</code>. Duas formas de personalizar:
	</p>
	<ol>
		<li>
			<strong>Edite <code>deploy/nostrfy.container.toml</code> no repositório</strong> e reimplante (mais simples)
		</li>
		<li>
			<strong>Monte sua própria config</strong>: construa um fork da imagem que copie seu arquivo de config sobre <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>Cada opção está documentada na <a href={p('/docs/configuration/')}>referência de configuração</a>.</p>

	<h2>Observações</h2>
	<ul>
		<li>
			<strong>Sempre ativo por design</strong>: <code>auto_stop_machines = false</code> em <code>fly.toml</code> — um relay nunca deve ser parado em períodos ociosos
		</li>
		<li>
			O contêiner executa o relay em <strong>modo foreground</strong> (<code>nostrfy start --foreground</code>); logs vão para stdout/stderr e são coletados pela Fly
		</li>
		<li>
			O TLS é terminado pela Fly; o relay serve WebSocket puro na porta 8080
		</li>
		<li>
			<strong>Host de mídia Blossom</strong>: para servir também o servidor Blossom, defina <code>blossom.host = "media.example.com"</code> na config, adicione <code>media.example.com</code> como <strong>nome de host adicional</strong> do mesmo app Fly (<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> ou <code>fly hostnames</code>), e adicione o certificado TLS de <code>media.</code> no painel Fly — o relay separa os hosts internamente (como <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS é terminado pela Fly">
		O relay serve WebSocket puro na porta 8080.
	</Callout>
</div>
