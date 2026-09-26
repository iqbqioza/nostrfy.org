<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="Referencia de configuración"
	description="Referencia completa de nostrfy.toml: cada clave, su tipo, su valor predeterminado y exactamente qué hace — límites, base de datos, demonio, control de acceso y Blossom."
/>

<div class="doc-body">
	<h2>Conceptos básicos</h2>
	<p>
		La configuración es un archivo <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a>, llamado por defecto <code>nostrfy.toml</code>. Créalo con <code>init</code>:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Valídalo (recomendado antes de cada inicio):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Cada comando acepta <code>--config &lt;path&gt;</code> (por defecto <code>nostrfy.toml</code>).</p>
	<p>Sintaxis general:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Secciones de configuración</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Sección</th><th>Propósito</th></tr></thead>
		<tbody>
			<tr><td><code>[relay]</code></td><td>Identidad, URL e interruptores NIP</td></tr>
			<tr><td><code>[server]</code></td><td>Enlace de red, separación de API, métricas</td></tr>
			<tr><td><code>[rpc]</code></td><td>RPC de gestión NIP-86 (autenticación, límite del cuerpo)</td></tr>
			<tr><td><code>[limits]</code></td><td>Todos los límites y protecciones contra sobrecarga</td></tr>
			<tr><td><code>[database]</code></td><td>Almacenamiento LMDB, índice de búsqueda, límites de cola</td></tr>
			<tr><td><code>[daemon]</code></td><td>Archivos PID, de registro y de estadísticas y rotación</td></tr>
			<tr><td><code>[access]</code></td><td>Listas iniciales de control de acceso (modificables en tiempo de ejecución)</td></tr>
			<tr><td><code>[blossom]</code></td><td>Servidor de archivos Blossom (alojamiento de medios)</td></tr>
		</tbody>
	</table>
	</div>
	<p>Cada clave es opcional; una clave ausente usa su valor predeterminado.</p>

	<h2>Sección [relay] — identidad del relé</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>name</code></td><td>string</td><td><code>"nostrfy"</code></td><td>Nombre del relé mostrado a los clientes vía NIP-11</td></tr>
			<tr><td><code>description</code></td><td>string</td><td><code>"A minimal and stable Nostr relay"</code></td><td>Descripción del relé (NIP-11)</td></tr>
			<tr><td><code>pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Clave pública del administrador (campo pubkey de NIP-11)</td></tr>
			<tr><td><code>contact</code></td><td>string</td><td><code>""</code></td><td>URI de contacto del administrador (mailto: o https://)</td></tr>
			<tr><td><code>icon</code></td><td>string</td><td><code>""</code></td><td>URL de la imagen del icono del relé</td></tr>
			<tr><td><code>post_policy</code></td><td>string</td><td><code>""</code></td><td>URL que apunta a la política de publicación del relé</td></tr>
			<tr><td><code>private_key</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Clave secreta propia del relé; necesaria para grupos NIP-29</td></tr>
			<tr><td><code>public_url</code></td><td>string</td><td><code>""</code></td><td>URL pública, p. ej. wss://relay.example.com</td></tr>
			<tr><td><code>livekit_url</code></td><td>string</td><td><code>""</code></td><td>URL del servidor LiveKit para salas de audio/vídeo NIP-29</td></tr>
			<tr><td><code>livekit_api_key</code></td><td>string</td><td><code>""</code></td><td>Clave API de LiveKit</td></tr>
			<tr><td><code>livekit_api_secret</code></td><td>string</td><td><code>""</code></td><td>Secreto API de LiveKit (usado para firmar JWT)</td></tr>
			<tr><td><code>enabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>Lista explícita de NIP permitidos</td></tr>
			<tr><td><code>disabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>NIP a desactivar (se ignora cuando enabled_nips no está vacío)</td></tr>
			<tr><td><code>reject_ephemeral</code></td><td>boolean</td><td><code>false</code></td><td>Rechazar eventos efímeros NIP-01 (kinds 20000-29999)</td></tr>
			<tr><td><code>enabled_git</code></td><td>boolean</td><td><code>false</code></td><td>Aceptar eventos git NIP-34 (kinds 1617-1633, 30617/30618)</td></tr>
			<tr><td><code>require_pow</code></td><td>integer</td><td><code>0</code></td><td>Prueba de trabajo requerida en bits cero iniciales</td></tr>
			<tr><td><code>new_pubkey_min_age_secs</code></td><td>integer</td><td><code>0</code></td><td>Rechazar eventos de pubkeys más recientes que esto (segundos; 0 = desactivado)</td></tr>
			<tr><td><code>max_events_per_min_per_pubkey</code></td><td>integer</td><td><code>0</code></td><td>Límite de publicación por pubkey (por minuto; 0 = sin límite)</td></tr>
			<tr><td><code>max_groups</code></td><td>integer</td><td><code>1000</code></td><td>Límite del almacén de grupos NIP-29 en memoria</td></tr>
			<tr><td><code>require_auth</code></td><td>boolean</td><td><code>false</code></td><td>Requerir autenticación NIP-42 para REQ/EVENT/COUNT/NEG</td></tr>
			<tr><td><code>send_auth_challenge</code></td><td>boolean</td><td><code>true</code></td><td>Enviar el desafío AUTH al conectar</td></tr>
			<tr><td><code>enabled_nip78_auth</code></td><td>boolean</td><td><code>true</code></td><td>Requerir AUTH NIP-42 antes de aceptar eventos kind 78/30078</td></tr>
			<tr><td><code>enabled_command_events</code></td><td>boolean</td><td><code>false</code></td><td>Ejecutar comandos de operador kind:1 firmados por la pubkey del administrador</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Detalles de claves</h3>
	<ul>
		<li>
			<strong>private_key</strong> — la clave secreta propia del relé, usada para firmar eventos generados por el relé: metadatos de grupos NIP-29 (39000-39005) y eventos de rol/miembros NIP-43. Genérala con <code>nostrfy genkey</code>; mantenla en secreto. Se lee una vez al iniciar, por lo que cambiarla requiere reiniciar.
		</li>
		<li>
			<strong>public_url</strong> — se usa para validar etiquetas con URL de los clientes: AUTH NIP-42, vanish NIP-62 y auth de administración NIP-98. Cuando está vacía, el relé recurre a <code>host:port</code>, que nunca coincide con una URL real de cliente al enlazar <code>0.0.0.0</code> o <code>127.0.0.1</code> (se registra una advertencia). <strong>Configúrala siempre.</strong>
		</li>
		<li>
			<strong>enabled_nips frente a disabled_nips</strong> — la lista de permitidos gana: cuando <code>enabled_nips</code> no está vacío, solo se anuncian sus NIP y <code>disabled_nips</code> se ignora. Ambos requieren reinicio.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — los kinds 20000-29999 se rechazan, pero los kinds exentos que los NIP exigen retransmitir siguen reenviándose: 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 y 21059. Se aplica con SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — NIP-34 opcional: acepta los kinds 1617-1633 y 30617/30618 y anuncia NIP-34. Desactivado por defecto porque los parches pueden ser grandes. Se aplica con SIGHUP.
		</li>
	</ul>

	<h2>Sección [server] — ajustes del servidor</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>"127.0.0.1"</code></td><td>Dirección de enlace; 0.0.0.0 acepta conexiones de cualquier lugar</td></tr>
			<tr><td><code>port</code></td><td>integer</td><td><code>8080</code></td><td>Puerto (1-65535); el puerto 80 requiere root</td></tr>
			<tr><td><code>api_host</code></td><td>string</td><td><code>""</code></td><td>Nombre de host dedicado a la API REST</td></tr>
			<tr><td><code>metrics_enabled</code></td><td>boolean</td><td><code>true</code></td><td>Servir métricas Prometheus en /metrics</td></tr>
			<tr><td><code>ws_paths</code></td><td>string</td><td><code>"root"</code></td><td>Rutas del endpoint WebSocket: root, inbox-outbox o all</td></tr>
			<tr><td><code>inbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>Quién puede escribir en /inbox: "any" o "relay" (los eventos deben llevar etiqueta p)</td></tr>
			<tr><td><code>outbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>Quién puede escribir en /outbox: "any" (los propios eventos de la pubkey autenticada NIP-42) o "relay"</td></tr>
			<tr><td><code>trusted_proxies</code></td><td>array of strings</td><td><code>[]</code></td><td>Direcciones/CIDR de proxies inversos cuyo X-Forwarded-For es confiable (vacío = no confiar en ningún proxy)</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Detalles de claves</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> enlaza todas las interfaces IPv4; <code>127.0.0.1</code> es solo local.</li>
		<li><strong>port</strong> — 1-65535; el puerto 80 requiere root. Este único puerto sirve el relé WebSocket, el documento NIP-11, la API REST y el RPC NIP-86 juntos.</li>
		<li>
			<strong>api_host</strong> — dedica la API REST a un único nombre de host para que la API y el relé puedan compartir un puerto detrás de un proxy inverso. Fijo al iniciar — requiere reinicio.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> sirve solo /, <code>inbox-outbox</code> sirve solo /inbox y /outbox, <code>all</code> sirve ambos. Fijo al iniciar — requiere reinicio.
		</li>
		<li>
			<strong>trusted_proxies</strong> — incluye solo las direcciones propias del proxy (loopback para nginx/Caddy en el mismo host, el rango de origen del balanceador en la nube). Con esta opción, la IP del cliente se deriva de la última entrada no confiable de <code>X-Forwarded-For</code> para los límites por IP, el límite de tasa, <code>blockip</code> y los registros. Nunca añadas una dirección accesible directamente por los clientes — podrían falsificar la cabecera y eludir los límites por IP. Fijo al iniciar — requiere reinicio.
		</li>
	</ul>

	<h2>Sección [rpc] — gestión NIP-86</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>management_token</code></td><td>string</td><td><code>""</code></td><td>Token Bearer para las API de gestión</td></tr>
			<tr><td><code>admin_pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Pubkey del administrador para la auth de gestión NIP-98</td></tr>
			<tr><td><code>max_admin_body_bytes</code></td><td>integer</td><td><code>65536</code></td><td>Límite del cuerpo para el RPC de gestión NIP-86</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		El RPC NIP-86 está montado en las rutas públicas <code>POST /</code> del relé — no hay un puerto de gestión separado. <code>management_token</code> y <code>admin_pubkey</code> a veces aparecen bajo <code>[server]</code> en guías antiguas; esas grafías son alias heredados de estas claves <code>[rpc]</code>.
	</p>

	<h2>Sección [limits] — límites y protecciones</h2>
	<h3>Conexiones y mensajes</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>max_connections</code></td><td>integer</td><td><code>10000</code></td><td>Conexiones concurrentes máximas</td></tr>
			<tr><td><code>max_connections_per_ip</code></td><td>integer</td><td><code>64</code></td><td>Conexiones máximas por IP de origen</td></tr>
			<tr><td><code>max_ws_message_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>Bytes máximos por mensaje/frame WebSocket</td></tr>
			<tr><td><code>socket_recv_buffer_kb</code></td><td>integer</td><td><code>64</code></td><td>Búfer de recepción del kernel por conexión (KiB)</td></tr>
			<tr><td><code>max_out_queue_bytes</code></td><td>integer</td><td><code>262144</code></td><td>Límite de cola de salida por conexión (bytes)</td></tr>
			<tr><td><code>ws_idle_timeout_secs</code></td><td>integer</td><td><code>300</code></td><td>Cerrar conexiones inactivas tras este tiempo</td></tr>
			<tr><td><code>http_read_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>Tiempo de espera de cabecera HTTP (defensa slow-loris)</td></tr>
			<tr><td><code>max_connections_per_sec_per_ip</code></td><td>integer</td><td><code>0</code></td><td>Conexiones nuevas máximas por segundo por IP de origen</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Suscripciones y consultas</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>max_filters</code></td><td>integer</td><td><code>20</code></td><td>Filtros máximos por REQ</td></tr>
			<tr><td><code>max_subscriptions</code></td><td>integer</td><td><code>20</code></td><td>Suscripciones máximas por conexión</td></tr>
			<tr><td><code>max_limit</code></td><td>integer</td><td><code>500</code></td><td>Tope para el limit de REQ</td></tr>
			<tr><td><code>max_count</code></td><td>integer</td><td><code>2000</code></td><td>Tope para resultados COUNT</td></tr>
			<tr><td><code>max_sub_id_len</code></td><td>integer</td><td><code>64</code></td><td>Longitud máxima del id de suscripción (caracteres, no bytes)</td></tr>
			<tr><td><code>max_sub_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>Bytes totales de filtros de suscripción por conexión</td></tr>
			<tr><td><code>max_req_response_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>Tope de bytes totales que una sola respuesta REQ puede enviar</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Eventos</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>max_content_bytes</code></td><td>integer</td><td><code>65536</code></td><td>Longitud máxima del contenido del evento en caracteres</td></tr>
			<tr><td><code>max_tags</code></td><td>integer</td><td><code>2000</code></td><td>Etiquetas máximas por evento</td></tr>
			<tr><td><code>max_tag_value_bytes</code></td><td>integer</td><td><code>1024</code></td><td>Bytes máximos por valor de etiqueta</td></tr>
			<tr><td><code>max_created_at_future_secs</code></td><td>integer</td><td><code>3600</code></td><td>Desviación futura tolerada de created_at</td></tr>
			<tr><td><code>group_late_publish_secs</code></td><td>integer</td><td><code>3600</code></td><td>Retraso tolerado para eventos de administración de grupos NIP-29 (segundos)</td></tr>
			<tr><td><code>max_neg_items</code></td><td>integer</td><td><code>100000</code></td><td>Registros máximos por sincronización de negentropía NIP-77</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Alias heredados: <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> y <code>limits.max_indexed_words</code> aún se aceptan como alias de <code>relay.require_pow</code>, <code>relay.new_pubkey_min_age_secs</code> y <code>database.max_indexed_words</code>.
	</p>
	<h3>API REST</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>max_api_concurrent</code></td><td>integer</td><td><code>8</code></td><td>Solicitudes /api/v1 concurrentes máximas</td></tr>
			<tr><td><code>max_api_limit</code></td><td>integer</td><td><code>5000</code></td><td>Tope para el parámetro limit de la API</td></tr>
			<tr><td><code>max_api_offset</code></td><td>integer</td><td><code>50000</code></td><td>Tope para el parámetro offset de la API</td></tr>
			<tr><td><code>max_api_fetch</code></td><td>integer</td><td><code>55001</code></td><td>Ventana máxima de sobrecarga para consultas con offset — debe cubrir max_api_offset + max_api_limit + 1 (0 = sin límite)</td></tr>
			<tr><td><code>max_api_search_bytes</code></td><td>integer</td><td><code>2048</code></td><td>Bytes máximos del parámetro search de la API</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Distribución en vivo</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>live_batch_interval_ms</code></td><td>integer</td><td><code>20</code></td><td>Frecuencia de vaciado de eventos en vivo (ms)</td></tr>
			<tr><td><code>live_batch_size</code></td><td>integer</td><td><code>32</code></td><td>Eventos máximos por lote en vivo</td></tr>
			<tr><td><code>live_buffer</code></td><td>integer</td><td><code>65536</code></td><td>Tamaño de la cola de distribución en vivo</td></tr>
		</tbody>
	</table>
	</div>

	<h2>Sección [database] — base de datos</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>path</code></td><td>string</td><td><code>"./data"</code></td><td>Directorio de la base de datos (LMDB)</td></tr>
			<tr><td><code>max_dbs</code></td><td>integer</td><td><code>32</code></td><td>Máximo de bases de datos nombradas LMDB</td></tr>
			<tr><td><code>max_readers</code></td><td>integer</td><td><code>128</code></td><td>Máximo de lectores concurrentes LMDB</td></tr>
			<tr><td><code>map_size</code></td><td>integer</td><td><code>1073741824</code> (1 GB)</td><td>Piso del tamaño del mapa de memoria (bytes)</td></tr>
			<tr><td><code>max_map_size</code></td><td>integer</td><td><code>1099511627776</code> (1 TB)</td><td>Techo del mapa de memoria (bytes)</td></tr>
			<tr><td><code>purge_interval_secs</code></td><td>integer</td><td><code>300</code></td><td>Intervalo de purga NIP-40 (segundos)</td></tr>
			<tr><td><code>search_index</code></td><td>boolean</td><td><code>true</code></td><td>Habilitar el índice de palabras NIP-50</td></tr>
			<tr><td><code>reader_threads</code></td><td>integer</td><td><code>2</code></td><td>Hilos dedicados de escaneo</td></tr>
			<tr><td><code>max_indexed_words</code></td><td>integer</td><td><code>32</code></td><td>Palabras del contenido de cada evento indexadas para búsqueda</td></tr>
			<tr><td><code>meta_index</code></td><td>boolean</td><td><code>true</code></td><td>Escribir la cabecera de metadatos por evento usada por el prefiltro de escaneo</td></tr>
			<tr><td><code>disabled_fsync</code></td><td>boolean</td><td><code>false</code></td><td>Omitir el vaciado síncrono a disco tras cada lote de escritura</td></tr>
			<tr><td><code>db_buffer_size</code></td><td>integer</td><td><code>2048</code></td><td>Búfer WebSocket inicial por conexión (bytes)</td></tr>
			<tr><td><code>db_request_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>Tiempo máximo que una solicitud a la base de datos puede esperar antes de fallar</td></tr>
			<tr><td><code>max_db_queue_msgs</code></td><td>integer</td><td><code>4096</code></td><td>Mensajes pendientes máximos en cola antes de fallar rápido</td></tr>
			<tr><td><code>max_db_queue_events</code></td><td>integer</td><td><code>262144</code></td><td>Eventos máximos en lotes en cola antes de fallar rápido</td></tr>
			<tr><td><code>max_db_queue_bytes</code></td><td>integer</td><td><code>268435456</code> (256 MiB)</td><td>Bytes máximos de solicitudes a la base de datos en cola antes de fallar rápido (0 = sin límite de bytes)</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Detalles de claves</h3>
	<ul>
		<li>
			<strong>map_size</strong> — el piso del mapa de memoria: el mapa siempre se abre al menos con este tamaño.
		</li>
		<li>
			<strong>max_map_size</strong> — el techo, abierto como reserva virtual dispersa: el disco físico solo crece con los datos realmente escritos. Auméntalo cuando veas <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — la búsqueda sigue funcionando (coincidencia de palabras completas contra el contenido) pero los escaneos son más lentos; en un VPS pequeño reduce la base de datos a la mitad. Recomendado en instancias pequeñas.
		</li>
		<li>
			<strong>disabled_fsync</strong> — cambia durabilidad por rendimiento: las escrituras se confirman en la caché de páginas del SO y un corte de energía puede perder las escrituras más recientes.
		</li>
	</ul>

	<h2>Sección [daemon] — demonio</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>pid_file</code></td><td>string</td><td><code>"./nostrfy.pid"</code></td><td>Ruta del archivo PID</td></tr>
			<tr><td><code>log_file</code></td><td>string</td><td><code>"./nostrfy.log"</code></td><td>Ruta del archivo de registro</td></tr>
			<tr><td><code>stats_file</code></td><td>string</td><td><code>"./nostrfy.stats.json"</code></td><td>Ruta del archivo de estadísticas</td></tr>
			<tr><td><code>stats_interval_secs</code></td><td>integer</td><td><code>5</code></td><td>Intervalo de escritura de estadísticas (segundos)</td></tr>
			<tr><td><code>max_log_size_bytes</code></td><td>integer</td><td><code>52428800</code> (50 MB)</td><td>Tamaño de rotación del registro (0 = sin rotación)</td></tr>
			<tr><td><code>max_log_files</code></td><td>integer</td><td><code>5</code></td><td>Generaciones de registros rotados a conservar</td></tr>
		</tbody>
	</table>
	</div>
	<p>Las rutas se resuelven respecto al directorio del archivo de configuración, por lo que siguen siendo válidas después de que el demonio cambie su directorio de trabajo.</p>

	<h2>Sección [access] — control de acceso</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>restrict_relay</code></td><td>boolean</td><td><code>false</code></td><td>Solo las pubkeys en lista permitida pueden publicar</td></tr>
			<tr><td><code>blocked_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>Kinds a rechazar</td></tr>
			<tr><td><code>allowed_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>Lista de kinds permitidos; solo se aceptan estos kinds cuando no está vacía</td></tr>
			<tr><td><code>blocked_ips</code></td><td>array of strings</td><td><code>[]</code></td><td>Direcciones IP rechazadas al conectar</td></tr>
			<tr><td><code>method_grants</code></td><td>table: pubkey → array of strings</td><td><code>&#123;&#125;</code></td><td>Concesiones de métodos NIP-86 para pubkeys no administradoras (gestionadas en tiempo de ejecución con <code>assignmethod</code>)</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Las listas de pubkeys permitidas/denegadas <strong>no</strong> son claves de configuración — viven en la base de datos del relé (LMDB) y se gestionan en tiempo de ejecución:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — solo las pubkeys en lista permitida pueden <strong>publicar</strong>, mientras la lectura sigue abierta para todos (cualquier cliente aún puede suscribirse y obtener datos).
		</li>
		<li>Una pubkey denegada siempre se rechaza al publicar y nunca se sirve al leer.</li>
		<li>
			<strong>method_grants</strong> — concesiones de métodos NIP-86 para pubkeys no administradoras (pubkey → nombres de método, p. ej. un moderador con <code>banevent</code> y <code>listbannedevents</code>). Se siembran desde la configuración en la primera ejecución, luego se gestionan en tiempo de ejecución con <code>assignmethod</code>/<code>unassignmethod</code> de NIP-86 (inspeccionadas con <code>listmethodassignees</code>). Solo los métodos de moderación y lectura son delegables — la gestión de permisos, roles, invitaciones e identidad del relé sigue siendo solo de admin, y una pubkey baneada se rechaza incluso con concesiones. Ver la <a href={p('/docs/management/')}>API de gestión</a>.
		</li>
	</ul>

	<h2>Sección [blossom] — servidor de archivos Blossom</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Clave</th><th>Tipo</th><th>Predeterminado</th><th>Descripción</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>""</code></td><td>Nombre de host para el servidor Blossom (vacío = desactivado)</td></tr>
			<tr><td><code>storage</code></td><td>string</td><td><code>"local"</code></td><td>Backend: "local" (local_path) o "s3" (bucket compatible con S3)</td></tr>
			<tr><td><code>local_path</code></td><td>string</td><td><code>"/var/lib/nostrfy/images"</code></td><td>Raíz de almacenamiento local para archivos multimedia</td></tr>
			<tr><td><code>max_upload_bytes</code></td><td>integer</td><td><code>20971520</code> (20 MB)</td><td>Tamaño máximo de archivo multimedia</td></tr>
			<tr><td><code>min_free_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>Espacio en disco por debajo del cual se rechazan subidas</td></tr>
			<tr><td><code>s3_endpoint</code></td><td>string</td><td><code>""</code></td><td>Endpoint compatible con S3 (p. ej. R2)</td></tr>
			<tr><td><code>s3_region</code></td><td>string</td><td><code>""</code></td><td>Región S3 (R2 usa "auto")</td></tr>
			<tr><td><code>s3_bucket</code></td><td>string</td><td><code>""</code></td><td>Nombre del bucket S3</td></tr>
			<tr><td><code>s3_access_key</code></td><td>string</td><td><code>""</code></td><td>Clave de acceso S3</td></tr>
			<tr><td><code>s3_secret_key</code></td><td>string</td><td><code>""</code></td><td>Clave secreta S3</td></tr>
			<tr><td><code>restrict_uploads</code></td><td>boolean</td><td><code>false</code></td><td>Solo las pubkeys en lista permitida pueden subir archivos</td></tr>
		</tbody>
	</table>
	</div>

	<h2>Recarga en caliente (SIGHUP)</h2>
	<p>
		Editar el archivo y enviar <code>kill -HUP $(cat nostrfy.pid)</code> recarga la configuración <strong>sin reiniciar</strong>. La mayoría de los ajustes surten efecto de inmediato; unos pocos están fijados al iniciar:
	</p>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Se aplica con SIGHUP</th><th>Requiere reinicio</th></tr></thead>
		<tbody>
			<tr><td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td><td>relay.private_key</td></tr>
			<tr><td>reject_ephemeral, enabled_git, enabled_nip78_auth</td><td>relay.livekit_*, enabled_nips / disabled_nips</td></tr>
			<tr><td>la mayoría de [limits]</td><td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, tamaños de demonio, topes de límites, blossom.*</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] no se aplica con una recarga — las listas se siembran una vez al iniciar y luego se gestionan en tiempo de ejecución vía NIP-86. El registro avisa cuando cambia un ajuste que requiere reinicio, y algunos ajustes capturados al iniciar no son comprobados por la recarga.
	</p>

	<Callout type="warning" title="Errores comunes">
		<div class="overflow-x-auto">
		<table>
			<thead><tr><th>Error</th><th>Solución</th></tr></thead>
			<tbody>
				<tr><td>public_url sin definir</td><td>define <code>wss://...</code></td></tr>
				<tr><td>host dejado en 127.0.0.1</td><td>los clientes externos no pueden conectar</td></tr>
				<tr><td>private_key sin definir con NIP-29</td><td>ejecuta <code>nostrfy genkey</code> + reinicia</td></tr>
				<tr><td>restrict_relay true con allowlist vacía</td><td>todos bloqueados</td></tr>
				<tr><td>cambiar claves que solo requieren reinicio y solo hacer SIGHUP</td><td>usa <code>nostrfy restart</code></td></tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
