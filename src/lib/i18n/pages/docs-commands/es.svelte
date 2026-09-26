<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# primero un dry-run — verifica cada evento y no escribe nada
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# importación (detén antes el relé nostrfy)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="Referencia de comandos"
	description="Todos los comandos de nostrfy: init, start, stop, stats, upgrade y migrate-strfry, además de las listas de acceso de la CLI y los filtros de suscripción inbox/outbox."
/>

<div class="doc-body">
	<h2>Resumen</h2>
	<p>Todos los comandos aceptan <code>--config &lt;path&gt;</code> (por defecto <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Comando</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Escribe un nostrfy.toml predeterminado y sale; el archivo se crea con 0600</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Genera una clave secreta para grupos NIP-29, la escribe en relay.private_key, pone la configuración en 0600 e imprime la clave pública; si el archivo cambió desde su lectura, aborta sin escribir</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Valida la configuración (ejecútalo antes de arrancar)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Arranca como demonio; <code>--foreground</code> lo ejecuta en la terminal</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Detiene el demonio en marcha</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Detiene y vuelve a arrancar (relee la configuración)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Muestra estadísticas en vivo</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Actualiza el binario a la última release de GitHub (o a la versión indicada); descarga el asset de la plataforma, verifica su suma SHA-256 y una prueba con <code>--version</code>, y luego sustituye el binario de forma atómica; las ejecuciones concurrentes se serializan con un archivo de bloqueo; sin versión indicada nunca se degrada; <code>--force</code> lo reinstala</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>Importa eventos de un relé strfry — ya sea ejecutando <code>strfry export</code> mediante <code>--strfry-db</code>, leyendo un archivo JSONL con <code>--input</code> o aceptando la entrada por stdin; repetible, con <code>--dry-run</code>, <code>--since</code> y la fusión opcional de ajustes</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Gestionar las listas de acceso</h2>
	<p>
		Las listas allow/deny del relé y la allowlist de subidas de Blossom viven en LMDB y se aplican al instante — el demonio en marcha se recarga automáticamente:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>Una clave denegada siempre se rechaza al publicar y nunca se sirve al leer.</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> Elimina una IP de la lista persistida de IP bloqueadas por NIP-86 (recuperación tras autobloqueo); reinicia el demonio para aplicarlo.
	</p>

	<h2>Filtros de suscripción inbox/outbox</h2>
	<p>
		nostrfy amplía la sintaxis de filtros REQ para el modelo de enrutamiento inbox/outbox con dos claves prácticas — una extensión de nostrfy, no parte de ningún NIP. <code>"outbox"</code> se expande a <code>"authors"</code>: solo los eventos <em>creados por</em> esa clave.
		<code>"inbox"</code> se expande a <code>"#p"</code>: solo los eventos <em>dirigidos a</em> esa clave (menciones, respuestas, zaps y MPs). Los valores pueden ser hex de 64 caracteres o <code>npub1</code> o arrays que se fusionan con una clave <code>authors</code>/<code>#p</code> existente; una clave inválida rechaza la suscripción:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		Los endpoints también tienen restricción de escritura: <code>/outbox</code> solo acepta eventos creados por la clave autenticada NIP-42 de la conexión (<code>server.outbox_write_policy = "any"</code>), o solo los eventos del propio relé (<code>"relay"</code>);
		<code>/inbox</code> solo acepta eventos que llevan una etiqueta <code>p</code>.
	</p>

	<h2>Migrar desde strfry</h2>
	<p>
		Un solo comando trae los eventos de un relé strfry existente. La migración es offline (detén antes el relé nostrfy — se niega a ejecutarse si la base está en uso), lee el propio formato de exportación de strfry y es segura de repetir: los duplicados se omiten y los efectos de borrado se reaplican.
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		También ofrece fusionar los ajustes equivalentes de strfry en <code>nostrfy.toml</code>, y tras una interrupción con <code>--since</code>
		reanudar. Los grupos NIP-29 y los roles NIP-43 se reconstruyen desde los eventos importados en el primer arranque. El manual completo está en la
		<a href={p('/docs/migrating-from-strfry/')}>guía de migración</a>.
	</p>

	<Callout type="tip" title="Paso a paso">
		La mayoría de los comandos también se explican paso a paso en la <a href={p('/docs/quick-start/')}>guía de inicio rápido</a>.
	</Callout>
</div>
