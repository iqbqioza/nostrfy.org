<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32-byte hex event id",
      "pubkey": "32-byte hex pubkey",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64-byte hex signature"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # página 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # página 2 (cuando more era true)`;
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc';
	const notesEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1"`;
	const paginateEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?limit=10&offset=10&sort=asc"`;
	const byIdEx = `curl "http://127.0.0.1:8080/api/v1/note1..."
curl "http://127.0.0.1:8080/api/v1/nevent1..."`;
	const naddrEx = `curl "http://127.0.0.1:8080/api/v1/naddr1..."`;
	const searchEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?search=rust"`;
	const tagEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/7?e=<event-id>&limit=100"`;
</script>

<DocsTitle
	title="Referencia de la API REST"
	description="API HTTP de solo lectura para consultar eventos Nostr almacenados en GET /api/v1/... — endpoints, parámetros, paginación, reglas de visibilidad y errores."
/>

<div class="doc-body">
	<h2>URL base</h2>
	<p>
		La API se sirve bajo <code>/api/v1</code> en el mismo puerto que el relé WebSocket:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Enrutamiento por host (<code>server.api_host</code>)</h2>
	<p>
		Cuando <code>server.api_host</code> (p. ej. <code>api.example.com</code>) está configurado, la API y el relé se separan por la cabecera Host: <code>api.example.com</code> recibe <code>/api/v1</code>,
		<code>/health</code> y <code>/metrics</code>; cualquier otro host recibe el relé WebSocket y NIP-11.
		Sin <code>api_host</code>, la API se sirve en todos los hosts. Solo se admite GET — las solicitudes de actualización WebSocket a <code>/api/v1</code> se rechazan con 403.
	</p>

	<h2>Endpoints</h2>
	<h3>Rutas basadas en identificadores</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ruta</th>
				<th>Devuelve</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>Último evento de perfil kind-0</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>El evento único con este id</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>Eventos de la dirección (kind + autor + etiqueta d)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>Eventos por pubkey, filtrados por kind (acepta npub1... o nprofile1...; 400 en caso contrario)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Los identificadores de autor aceptan <code>npub1...</code>, <code>nprofile1...</code> o una pubkey hexadecimal de 64 caracteres (insensible a mayúsculas) en cada endpoint.
	</p>
	<h3>Endpoints de consulta y agregación</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — consulta genérica con filtro sin identificador.</li>
		<li><code>GET /api/v1/count</code> — recuento total para los mismos parámetros de filtro (semántica NIP-45).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — recuentos de eventos por kind para un autor, los más usados primero.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — recuentos por día para un mes;
			el mes debe ser 1–12, y cada día se informa con relleno de ceros hasta el último día (cada entrada y el total llevan una marca <code>approximate</code>).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — un evento único por su id hexadecimal de 64 caracteres (prefijos rechazados).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — resumen del autor (total, primera/última actividad, desglose por kind); <code>first_seen</code>/<code>last_seen</code>/los meses son <code>null</code> cuando no existen eventos visibles.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — recuentos por hora para un día; las 24 horas se informan con relleno de ceros (mismas marcas <code>approximate</code> que daily).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — respuestas (#e) y citas (#q) que hacen referencia al evento; el id de la ruta se pasa a minúsculas antes de comparar, y un parámetro de consulta <code>e</code> se combina con OR en el lado #e.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — la última lista de seguidos kind-3 del autor.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — los kinds más comunes en el relé (muestra acotada, filtrada por visibilidad; marcas <code>approximate</code> y <code>filtered</code>).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — los autores más activos en el relé (muestra acotada, filtrada por visibilidad; marcas <code>approximate</code> y <code>filtered</code>).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — la última lista de relés NIP-65 del autor (kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — recuentos por mes, con relleno de ceros en el rango since/until (por defecto: todo el período; limitado a 120 meses).
		</li>
	</ul>

	<h2>Parámetros de consulta</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Parámetro</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Máx. de resultados (por defecto 100, limitado por max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Número de resultados visibles a omitir (paginación)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Solo eventos con created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Solo eventos con created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> para los más antiguos primero; por defecto, los más recientes primero</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>Búsqueda de texto completo NIP-50 (coincidencia de palabras completas)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Filtrar por etiquetas #e / #p / #t / #d</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Excluir eventos con esa etiqueta — se aplica antes de la paginación, por lo que los eventos excluidos nunca consumen huecos de <code>limit</code> ni pasos de <code>offset</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Formato de respuesta</h2>
	<p>Las respuestas exitosas devuelven <code>200 OK</code> con el siguiente cuerpo JSON:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Campo</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>Los eventos de esta página (los más recientes primero por defecto)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>El número de eventos en esta página</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td><code>true</code> cuando existen más páginas (usa <code>offset</code> para obtenerlas)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Paginación</h2>
	<p>
		La paginación se hace con <code>offset</code> y la marca <code>more</code>, calculados sobre la secuencia <strong>visible</strong> — los eventos ocultos nunca omiten ni duplican una página:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="Peculiaridades de los endpoints">
		Los endpoints singleton (perfil, <code>/ids/&#123;hex&#125;</code>, follows, relays) siguen aceptando <code>offset</code> — <code>?offset=1</code> omite el único evento y devuelve <code>[]</code>.
		Los parámetros de consulta <code>authors</code>/<code>kinds</code> solo filtran el endpoint genérico <code>/query</code>: en endpoints kind se ignoran silenciosamente (ambos están prerrellenados), mientras que en endpoints id se combinan con AND. El desglose por kind de <code>stats</code> está ordenado por kind, a diferencia de <code>/kinds</code> (primero por recuento).
	</Callout>

	<h2>Reglas de visibilidad</h2>
	<p>La API no está autenticada, por lo que oculta los mismos eventos que una conexión WebSocket anónima:</p>
	<ul>
		<li>Eventos protegidos NIP-70 (con etiqueta <code>-</code>)</li>
		<li>Gift wraps NIP-59 (kind 1059)</li>
		<li>Contenido de grupo privado/oculto NIP-29 (visible solo para miembros)</li>
	</ul>

	<h2>Errores y códigos de estado</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Código</th>
				<th>Significado</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Éxito</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Identificador o parámetro de consulta inválido</td>
			</tr>
			<tr>
				<td>403</td>
				<td>Intento de actualización WebSocket a /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Ruta desconocida, o Host incorrecto para la API (api_host configurado)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>Límite de concurrencia de la API alcanzado — reintente en breve</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Ejemplos</h2>
	<p>Obtener las notas de un usuario (las más recientes primero):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Paginar y ordenar:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Obtener un evento único por id (tanto note1... como nevent1... funcionan):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Obtener un evento direccionable (naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Buscar:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Filtro por etiqueta:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
