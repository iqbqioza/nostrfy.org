<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const call = `curl -X POST http://127.0.0.1:8080/ \\
  -H "Content-Type: application/nostr+json+rpc" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"method":"supportedmethods","params":[]}'`;
</script>

<DocsTitle
	title="Gestión NIP-86"
	description="La API de gestión JSON-RPC: moderación, listas de acceso, identidad del relé, roles, códigos de invitación y delegaciones de métodos, con autenticación Bearer o NIP-98."
/>

<div class="doc-body">
	<h2>Habilitación</h2>
	<p>
		NIP-86 es una API JSON-RPC para gestionar el relé. Necesita uno de los dos métodos de autenticación, de lo contrario cada llamada es rechazada:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Método</th>
				<th>Configuración</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Token Bearer</td>
				<td>
					Configura <code>rpc.management_token</code> y envía <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Configura <code>rpc.admin_pubkey</code> y envía un evento de autenticación NIP-98 (kind 27235) firmado por la clave de administración en <code>Authorization: Nostr &lt;base64&gt;</code> — se requiere una etiqueta <code>payload</code>; cada evento es de un solo uso dentro de su ventana de 60 segundos
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Llamar a la API</h2>
	<p>POST / con <code>Content-Type: application/nostr+json+rpc</code>:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Métodos</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Método</th>
				<th>Parámetros</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>Lista de métodos admitidos</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Banear una pubkey para que no publique (también la elimina de la lista de permitidos)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Desbanear una pubkey</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>Listar pubkeys baneadas y motivos</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Añadir a la lista de permitidos (también desbanea)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Eliminar de la lista de permitidos</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>Listar la lista de permitidos</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Permitir / denegar un kind</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>Listar kinds permitidos / denegados</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Cambiar el nombre / la descripción / el icono del relé (persistido en el archivo de configuración; informa de un error cuando el archivo no se puede escribir)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>Gestión de roles NIP-43 (los campos con tipo incorrecto se rechazan; eliminar un rol inexistente tiene éxito)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Asignar / retirar un rol (una concesión duplicada o una revocación inexistente tiene éxito)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Conceder / revocar un método NIP-86 a una pubkey no administradora — solo los métodos de moderación y lectura son delegables</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>Listar concesiones de métodos (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Bloquear / desbloquear una IP (bloquear también corta las conexiones existentes)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>Listar IPs bloqueadas</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Banear un evento (banear un id desconocido lo pre-banea; también lo elimina de la lista de permitidos)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Añadir un evento a la lista de permitidos (también levanta el baneo; permitir un id desconocido lo pre-permite)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Eliminar un evento de la lista de permitidos / baneados (una entrada inexistente tiene éxito)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>Listar eventos baneados (una búsqueda fallida devuelve un error, nunca una lista vacía)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>Listar eventos permitidos</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>Eventos pendientes de moderación (siempre vacío en este relé)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>Listar códigos de invitación NIP-43</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Emitir / revocar un código de invitación NIP-43 (un kind:28934 con un código listado admite a su autor)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Administración delegada">
		<code>rpc.admin_pubkey</code> (y el token de gestión) sigue siendo el acceso raíz con todos los métodos. Las demás pubkeys se autentican con NIP-98 y solo pueden ejecutar sus métodos concedidos vía <code>assignmethod</code> (<code>supportedmethods</code> muestra su propio subconjunto). La gestión de permisos, roles, códigos de invitación e identidad del relé sigue siendo solo de admin, por lo que un beneficiario nunca puede escalar privilegios. Una pubkey baneada es rechazada incluso con concesiones.
	</Callout>

	<Callout type="note" title="Servido en las rutas públicas POST /">
		El RPC NIP-86 está montado en las rutas públicas POST / del relé. Las mutaciones se registran en un registro de auditoría con límite de velocidad (como máximo 600 entradas por minuto) con la identidad autenticada. Las solicitudes que superen <code>rpc.max_admin_body_bytes</code> se rechazan con 413.
	</Callout>
</div>
