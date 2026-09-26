<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);
</script>

<DocsTitle
	title="Grupos NIP-29"
	description="Grupos NIP-29: espacios de chat cerrados donde solo los miembros pueden escribir, con eventos de moderación e instantáneas del estado del grupo firmadas por el relé."
/>

<div class="doc-body">
	<h2>Habilitar grupos</h2>
	<ol>
		<li>
			Ejecuta <code>nostrfy genkey</code> para establecer <code>relay.private_key</code>
			(<strong>obligatorio</strong> — sin él no se generan los metadatos del grupo).
		</li>
		<li>Reinicia el relé.</li>
	</ol>

	<h2>Cómo funcionan los grupos</h2>
	<p>
		Los grupos se crean y moderan mediante eventos. A partir de estos eventos de moderación, el relé genera
		instantáneas firmadas por el relé que los clientes usan para mostrar:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Evento</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Crear grupo (el creador se convierte en administrador)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Añadir miembro (con roles) / eliminar miembro</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Editar metadatos (nombre, descripción, público/privado, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Eliminar evento (moderación)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Eliminar grupo (sus eventos almacenados se purgan)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Crear código de invitación</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Actualizar lista de fijados</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Solicitud de ingreso / solicitud de salida</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Instantáneas firmadas por el relé</h3>
	<ul>
		<li><code>kind:39000</code> — metadatos del grupo (nombre, ajustes de visibilidad, ...)</li>
		<li><code>kind:39001</code> — lista de administradores</li>
		<li><code>kind:39002</code> — lista de miembros</li>
		<li><code>kind:39005</code> — eventos fijados</li>
	</ul>

	<h2>Ajustes de visibilidad del grupo</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Etiqueta</th>
				<th>Significado</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Solo los miembros pueden leer los mensajes</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Solo los miembros pueden escribir</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>Los metadatos están ocultos para los no miembros</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Las solicitudes de ingreso no se aprueban automáticamente (se requieren códigos de invitación)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>El grupo tiene una sala de audio/video LiveKit</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Subgrupos</h2>
	<p>
		Los grupos pueden ser jerárquicos — anidados con etiquetas <code>parent</code> / <code>child</code>. Los ciclos se
		rechazan automáticamente.
	</p>

	<Callout type="warning" title="Salir de un grupo">
		Cualquier miembro — incluido el último administrador del grupo — puede salir con <code>kind:9022</code> y se
		elimina automáticamente; si el último administrador sale, el grupo se queda sin administradores. Nombra primero a otro administrador,
		o elimina el grupo con <code>kind:9008</code>, o recupera un grupo sin administrador firmando un
		evento de moderación con la propia clave del relé (<code>relay.private_key</code>, la self pubkey de NIP-11).
		Consulta <a href={p('/docs/troubleshooting/')}>solución de problemas</a> para ver cómo hacerlo.
	</Callout>
</div>
