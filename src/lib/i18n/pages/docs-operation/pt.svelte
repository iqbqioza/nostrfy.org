<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="Executar o relay"
	description="Para o seu relay nostrfy: iniciar e parar, logs e estatísticas, recarga a quente da configuração, várias instâncias e ajuste em grande escala."
/>

<div class="doc-body">
	<h2>Iniciar e parar</h2>
	<p>Inicie o relay como daemon em segundo plano:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>Ou execute em primeiro plano no terminal:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Parar:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Verifique se está no ar:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Logs e estatísticas</h2>
	<p>
		O daemon grava em <code>daemon.log_file</code>. Quando o arquivo ultrapassa <code>max_log_size_bytes</code> é rotacionado automaticamente (<code>nostrfy.log.1</code>, <code>.2</code>…até <code>max_log_files</code> gerações):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>O nível de log é controlado pela variável de ambiente <code>RUST_LOG</code> (por exemplo, <code>RUST_LOG=debug</code>).</p>
	<h3>Estatísticas</h3>
	<p>Estatísticas ao vivo pela CLI:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>Ou via HTTP:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Mostra conexões, eventos aceitos/recusados, tamanho do banco e mais.</p>
	<h3>Métricas Prometheus</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Recarga a quente (SIGHUP)</h2>
	<p>Depois de editar o arquivo de configuração, recarregue sem reiniciar:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Aplica na recarga</th>
				<th>Exige reinício</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Identidade do relay, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>a maioria de [limits], reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, configurações do LiveKit</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* (incluindo search_index), blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>O log avisa quando uma configuração que exige reinício muda.</p>

	<h2>Executar várias instâncias</h2>
	<p>
		O nostrfy suporta vários relays independentes em um mesmo servidor (portas diferentes). Cada instância precisa do próprio
		<code>server.port</code>, dos próprios <code>pid_file</code>/<code>log_file</code>/<code>stats_file</code> em <code>[daemon]</code>
		(valores compartilhados fazem a segunda instância recusar a inicialização com <code>already running</code>),
		do próprio <code>database.path</code>, bem como (quando usados) do próprio <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Cada instância é gerenciada com sua própria configuração: <code>nostrfy --config /etc/nostrfy/a.toml start</code> e assim por diante.</p>

	<h2>Implantações em grande escala</h2>
	<p>
		O relay foi projetado para escalar a centenas de milhares de conexões em um único host — a entrega ao vivo acorda apenas os assinantes que podem coincidir com um evento, e a memória por conexão é pequena. Para chegar a milhões é preciso ajuste no nível do host:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Configuração</th>
				<th>Valor</th>
				<th>Motivo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× as conexões alvo (+1000)</td>
				<td>cada conexão ocupa um fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>Fila de accept pendente em picos de conexão</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>baixo (por exemplo, 10)</td>
				<td>Libera sockets TIME_WAIT mais rápido</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 ou 2</td>
				<td>O mapa LMDB é uma grande reserva virtual esparsa</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		No FreeBSD, os parâmetros correspondentes são <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> mais
		<code>ulimit -n</code>, e <code>kern.ipc.somaxconn</code> substitui <code>net.core.somaxconn</code>. A memória do kernel por conexão é de cerca de 80 KiB e a de espaço do usuário cerca de 10 KiB, então um milhão de conexões exige aproximadamente 90 GiB de memória do kernel e do usuário além do banco.
	</p>

	<h2 id="throughput">Taxa de transferência (eventos por segundo)</h2>
	<p>
		A gravação de eventos é limitada por dois custos: a verificação de assinatura Schnorr (cerca de 30–50 µs por evento) e o flush síncrono em disco que o escritor LMDB faz após cada lote de commits. Ambos são ajustáveis no arquivo <code>nostrfy.toml</code>:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Configuração</th>
				<th>Motivo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>Commit no cache de páginas do SO (microssegundos); uma queda de energia perde apenas as gravações desde o último flush — comece por aqui</td>
			</tr>
			<tr>
				<td>Núcleos de CPU ≥ 8 vCPU</td>
				<td>O caminho EVENT em lote verifica assinaturas em paralelo pelos núcleos</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>Remove a gravação do índice de palavras NIP-50 por evento para instâncias com muita escrita</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		A verificação paralela de assinaturas valida todas as assinaturas de um lote pendente de uma vez, num pool de threads (máximo 8; lotes com menos de 16 eventos são verificados em linha). As checagens baratas de cada evento continuam vindo primeiro, então o texto de rejeição é idêntico ao caminho sequencial — só o trabalho Schnorr é distribuído entre os núcleos. Uma compilação single-thread permanece sequencial.
	</p>

	<h2>Limites fixos contra abuso</h2>
	<p>
		Alguns limites rígidos são fixos (não configuráveis) para manter o relay responsivo sob abuso:
	</p>
	<ul>
		<li>
			Um filtro carrega no máximo <strong>512</strong> entradas em <code>ids</code>, <code>authors</code> ou
			<code>kinds</code>; valores de tags <code>#...</code> usam um orçamento separado de <strong>512</strong>
			valores. Filtros maiores são recusados (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> rastreia no máximo 10.000 IPs de origem; quando cheio, IPs nunca vistos são recusados (fail closed).
		</li>
		<li>
			<code>ids</code> nos filtros podem ser prefixos, mas só coincidem ids completos de 32 bytes e prefixos de comprimento par (entradas ímpares ou vazias são ignoradas tanto no histórico quanto na entrega ao vivo).
		</li>
		<li>
			Chaves de índice longas demais (valores de tags, palavras do conteúdo, tags <code>d</code> além do limite de tamanho de chave do LMDB) são ignoradas na indexação; o evento ainda é armazenado.
		</li>
	</ul>
</div>
