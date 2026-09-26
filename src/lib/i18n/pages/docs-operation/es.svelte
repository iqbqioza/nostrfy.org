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
	title="Ejecutar el relé"
	description="Para tu relé nostrfy: arranque y parada, registros y estadísticas, recarga en caliente de la configuración, múltiples instancias y ajuste a gran escala."
/>

<div class="doc-body">
	<h2>Arranque y parada</h2>
	<p>Arranca el relé como demonio en segundo plano:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>O ejecútalo en primer plano en la terminal:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Detener:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Verifica que esté activo:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Registros y estadísticas</h2>
	<p>
		El demonio escribe en <code>daemon.log_file</code>. Cuando el archivo supera <code>max_log_size_bytes</code> se rota automáticamente (<code>nostrfy.log.1</code>, <code>.2</code>…hasta <code>max_log_files</code> generaciones):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>El nivel de registro lo controla la variable de entorno <code>RUST_LOG</code> (por ejemplo, <code>RUST_LOG=debug</code>).</p>
	<h3>Estadísticas</h3>
	<p>Estadísticas en vivo desde la CLI:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>O por HTTP:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Muestra conexiones, eventos aceptados/rechazados, tamaño de la base y más.</p>
	<h3>Métricas de Prometheus</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Recarga en caliente (SIGHUP)</h2>
	<p>Tras editar el archivo de configuración, recárgalo sin reiniciar:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Se aplica al recargar</th>
				<th>Requiere reinicio</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Identidad del relé, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>la mayoría de [limits], reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, ajustes de LiveKit</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* (incluido search_index), blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>El registro avisa cuando cambia un ajuste que requiere reinicio.</p>

	<h2>Ejecutar varias instancias</h2>
	<p>
		nostrfy admite varios relés independientes en un mismo servidor (puertos distintos). Cada instancia necesita su propio
		<code>server.port</code>, <code>[daemon]</code>
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		(valores compartidos hacen que la segunda instancia rechace el arranque con <code>already running</code>),
		<code>database.path</code> y — cuando se usen — sus propios <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Cada instancia se gestiona con su propia configuración: <code>nostrfy --config /etc/nostrfy/a.toml start</code> y más.</p>

	<h2>Despliegues a gran escala</h2>
	<p>
		El relé está diseñado para escalar a cientos de miles de conexiones en un solo host — la entrega en vivo solo despierta a los suscriptores que pueden coincidir con un evento y la memoria por conexión es pequeña. Para llegar al millón hace falta ajuste a nivel de host:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ajuste</th>
				<th>Valor</th>
				<th>Motivo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× las conexiones objetivo (+1000)</td>
				<td>cada conexión ocupa un fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>Cola de accept pendiente ante picos de conexiones</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>bajo (por ejemplo, 10)</td>
				<td>Libera antes los sockets TIME_WAIT</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 o 2</td>
				<td>El mapa LMDB es una gran reserva virtual dispersa</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		En FreeBSD, los parámetros correspondientes son <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> más
		<code>ulimit -n</code>, así como <code>kern.ipc.somaxconn</code> sustituye a <code>net.core.somaxconn</code>. La memoria de kernel por conexión es de unos 80 KiB y la de usuario unos 10 KiB, así que un millón de conexiones necesita unos 90 GiB de memoria de kernel y usuario además de la base de datos.
	</p>

	<h2 id="throughput">Rendimiento (eventos por segundo)</h2>
	<p>
		La escritura de eventos está limitada por dos costes: la verificación de firma Schnorr (unos 30-50 µs por evento) y el volcado síncrono a disco que el escritor LMDB realiza tras cada lote de commits. Ambos se ajustan en el archivo <code>nostrfy.toml</code>:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ajuste</th>
				<th>Motivo</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>Commit en la caché de páginas del SO (microsegundos); un corte de luz solo pierde las escrituras desde el último volcado — empieza por aquí</td>
			</tr>
			<tr>
				<td>Núcleos de CPU ≥ 8 vCPU</td>
				<td>El camino EVENT por lotes verifica firmas en paralelo entre núcleos</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>Elimina la escritura del índice de palabras NIP-50 por evento para instancias con mucha escritura</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		La verificación paralela de firmas valida todas las firmas de un lote pendiente a la vez en un pool de hilos (máximo 8; los lotes de menos de 16 eventos se verifican en línea). Las comprobaciones baratas de cada evento siguen ejecutándose primero, así que el texto de rechazo es idéntico al camino secuencial — solo el trabajo Schnorr se reparte entre núcleos. Una compilación mono-hilo sigue siendo secuencial.
	</p>

	<h2>Límites antiabuso fijos</h2>
	<p>
		Algunos límites duros son fijos (no configurables) para que el relé siga respondiendo bajo abuso:
	</p>
	<ul>
		<li>
			Un filtro contiene como máximo <strong>512</strong> <code>ids</code>, <code>authors</code> o
			<code>kinds</code> entradas; <code>#...</code> Los valores de etiquetas usan un presupuesto aparte de <strong>512</strong>
			valores. Los filtros más grandes se rechazan (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> rastrea como máximo 10.000 IP de origen; cuando se llena, las IP no vistas se rechazan (fail closed).
		</li>
		<li>
			<code>ids</code> de los filtros pueden ser prefijos, pero solo coinciden ids completos de 32 bytes y prefijos de longitud par (las entradas impares o vacías se ignoran tanto en el historial como en la entrega en vivo).
		</li>
		<li>
			Las claves de índice demasiado largas (valores de etiquetas, palabras del contenido, etiquetas <code>d</code> más allá del límite de tamaño de clave de LMDB) se omiten al indexar; el evento se guarda igualmente.
		</li>
	</ul>
</div>
