<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # recarrega a configuração sem reiniciar`;
</script>

<DocsTitle
	title="Guia de início rápido"
	description="Da instalação a um relay Nostr no ar em minutos: escreva a configuração, valide-a, inicie o daemon e execute a primeira verificação de saúde."
/>

<div class="doc-body">
	<h2>1. Criar uma configuração</h2>
	<p>
		<code>nostrfy init</code> grava um <code>nostrfy.toml</code> padrão:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Abra o arquivo em um editor de texto e ajuste — cada opção é comentada.</p>

	<h2>2. Validar a configuração</h2>
	<p>
		<code>nostrfy check</code> é fortemente recomendado antes de iniciar; se algo estiver errado, ele indica exatamente o quê.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Iniciar o relay</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="Roda como daemon. Adicione --foreground para rodar no terminal."
	/>
	<p>Depois verifique se o relay está no ar com o endpoint de saúde:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Apontar um cliente</h2>
	<p>
		Na mesma máquina, conecte-se a <code>ws://&lt;host&gt;:8080</code>. O host padrão é
		<code>127.0.0.1</code>, que aceita apenas conexões locais. Para acessar o relay de outras máquinas, defina na configuração <code>server.host = "0.0.0.0"</code>:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		Para <code>wss://</code>, você precisa de um proxy que termine o TLS (nginx ou Caddy) na frente — veja a
		<a href={p('/docs/deploy/')}>implantação</a>.
	</p>

	<h2>5. Parar e reiniciar</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart relê a configuração; o SIGHUP recarrega a maioria das configurações sem reiniciar."
	/>

	<h2>Operação no dia a dia</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> mostra estatísticas ao vivo — também via HTTP em
			<code>/relay/stats</code> e <code>/metrics</code>.
		</li>
		<li>O log é gravado em <code>daemon.log_file</code> e passa por rotação automática.</li>
		<li>
			<code>RUST_LOG</code> controla o nível de log (por exemplo, <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="Clientes externos não conseguem conectar?">
		server.host é 127.0.0.1 por padrão. Defina host = "0.0.0.0" e reinicie.
	</Callout>

	<Callout type="tip" title="Próximo">
		Veja a <a href={p('/docs/configuration/')}>referência de configuração</a> para ajustar todos os aspectos do relay.
	</Callout>
</div>
