<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# Cambia port = 8080 en el archivo de configuración, luego:
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# Si nostrfy se está ejecutando, reinícialo
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Elimina un archivo pid obsoleto si existe
rm -f nostrfy.pid`;
	const tomlExample = `# Ejemplos correctos
name = "my relay"        # las cadenas van entre comillas con "
port = 8080              # los números van sin comillas
enabled_nips = [1, 50]   # las listas van entre [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# Desde fuera (usando la IP/puerto del servidor)
curl http://YOUR_SERVER_IP:8080/health

# Comprueba el cortafuegos (ejemplo: ufw)
sudo ufw status
# Abre el puerto si es necesario
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" en bytes`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Respalda también [blossom].local_path si usas almacenamiento local Blossom.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Solución de problemas"
	description="Los errores más comunes — puertos, permisos, TLS, NIP faltantes, publicación y tiempos de espera — con soluciones paso a paso."
/>

<div class="doc-body">
	<p><strong>Tres cosas que comprobar primero:</strong></p>
	<ul>
		<li><code>nostrfy check</code> valida tu configuración (la mayoría de los errores son errores de configuración).</li>
		<li><code>tail -f nostrfy.log</code> muestra el registro — la causa casi siempre está allí.</li>
		<li><code>nostrfy restart</code> reinicia el demonio de forma limpia.</li>
	</ul>

	<h2 id="cannot-start">No se puede iniciar</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Causa:</strong> Solo root puede usar el puerto 80.</p>
	<p><strong>Solución:</strong> Ejecuta con <code>sudo</code>, o cambia el puerto a uno como 8080.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Causa:</strong> Otro proceso (un nostrfy antiguo u otro servidor) ya está usando
		el puerto.
	</p>
	<p><strong>Solución:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Causa:</strong> nostrfy ya se está ejecutando; <code>start</code> se niega a iniciar una
		segunda instancia.
	</p>
	<p><strong>Solución:</strong> Usa <code>nostrfy restart</code>, o simplemente usa la instancia en ejecución.</p>

	<h3><code>nostrfy stop</code> se bloquea / <code>did not stop in time</code></h3>
	<p><strong>Causa:</strong> El demonio está bloqueado o no responde.</p>
	<p><strong>Solución:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Causa:</strong> El archivo de configuración no es TOML válido. Errores comunes: olvidar las
		comillas alrededor de una cadena, o escribir dos veces la misma clave.
	</p>
	<p><strong>Solución:</strong> El mensaje de error incluye un número de línea. Revisa y corrige esa línea.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Causa:</strong> El archivo de configuración no existe.</p>
	<p><strong>Solución:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Causa:</strong> <code>relay.private_key</code> no es una clave hexadecimal válida de 64
		caracteres.
	</p>
	<p>
		<strong>Solución:</strong> Ejecuta <code>nostrfy genkey</code> para generar una clave correcta (o
		establece <code>private_key = ""</code>).
	</p>

	<h3>Muchas advertencias en el registro al iniciar</h3>
	<p>Las líneas de registro <code>[WARN]</code> indican problemas de configuración. Las principales:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Advertencia</th>
				<th>Significado y solución</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> no está configurado — la autenticación NIP-42, la eliminación NIP-62
					y la autenticación de administrador NIP-98 no funcionarán. Configura
					<code>wss://your-public-url</code>.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>Los grupos necesitan una clave secreta. Ejecuta <code>nostrfy genkey</code>.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>Una clave heredada sin usar (o un error tipográfico) en la configuración. Revisa el nombre de la clave.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					Un error tipográfico en un nombre de sección (p. ej. <code>[serve]</code> en lugar de
					<code>[server]</code>). Corríjalo.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>Esta combinación bloquea a todos. Cambie uno de los dos.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					El requisito de prueba de trabajo es tan alto que nadie puede publicar. Reduce
					<code>require_pow</code>.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">No se puede conectar o comportamiento extraño</h2>

	<h3>El cliente recibe <code>connection refused</code></h3>
	<p>
		<strong>Causa:</strong> El relé no se está ejecutando, o un cortafuegos está bloqueando el puerto.
	</p>
	<p><strong>Solución:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>Los clientes externos no pueden conectarse, los locales sí</h3>
	<p>
		<strong>Causa:</strong> <code>server.host</code> sigue siendo <code>127.0.0.1</code> (el valor
		predeterminado), que solo acepta conexiones locales.
	</p>
	<p>
		<strong>Solución:</strong> Establece <code>host = "0.0.0.0"</code> en la configuración y
		reinicia.
	</p>

	<h3>No se puede conectar a través de un túnel de Cloudflare</h3>
	<p>Al usar Cloudflare Tunnel:</p>
	<ul>
		<li>
			El relé funciona con HTTP sin cifrar; Cloudflare termina TLS, por lo que los clientes usan
			<code>wss://</code>. Configura <code>public_url = "wss://..."</code> en el relé (esto hace que
			funcione la autenticación NIP-42).
		</li>
		<li>
			Cloudflare añade una cabecera <code>X-Forwarded-Proto</code>. nostrfy trata los valores
			<code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> de la misma forma, por lo que
			normalmente no se necesita configuración adicional.
		</li>
	</ul>

	<h3><code>error: message too large</code> y la conexión se cierra</h3>
	<p>
		<strong>Causa:</strong> Un solo mensaje supera <code>max_ws_message_bytes</code> (1 MB por defecto).
	</p>
	<p>
		<strong>Solución:</strong> Aumenta <code>limits.max_ws_message_bytes</code> si necesitas eventos más
		grandes — pero comprueba también los límites propios del cliente.
	</p>

	<h3>Errores <code>too many subscriptions</code> / <code>too many filters</code></h3>
	<p>
		<strong>Causa:</strong> Se alcanzaron los límites por conexión (suscripciones 20 por defecto, filtros
		20 por defecto).
	</p>
	<p>
		<strong>Solución:</strong> Aumenta <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> (y revisa la configuración del cliente).
	</p>

	<h3>Las nuevas conexiones se rechazan bajo carga</h3>
	<p>
		<strong>Causa:</strong> Se alcanzó <code>max_connections</code> (10000 por defecto), se activó el límite
		por IP (<code>max_connections_per_ip</code>, 64 por defecto), o el límite de conexiones por segundo y
		por IP (<code>max_connections_per_sec_per_ip</code>) rechazó la ráfaga. Los límites se aplican a cada
		conexión — tanto WebSocket como HTTP sin cifrar.
	</p>
	<p>
		<strong>Solución:</strong> Revisa y ajusta la configuración. <code>max_connections_per_ip = 0</code>
		desactiva el límite por IP; <code>max_connections_per_sec_per_ip = 0</code> desactiva el límite de
		frecuencia. Estos tres ajustes requieren un reinicio.
	</p>

	<h3>Las conexiones se cortan después de un tiempo</h3>
	<p>
		<strong>Causa:</strong> Si <code>ws_idle_timeout_secs</code> está configurado, las conexiones inactivas
		se cierran. Los clientes sanos responden al PING del relé con un PONG y permanecen conectados; solo se
		eliminan los pares muertos.
	</p>
	<p>
		<strong>Solución:</strong> Esto es intencional — el valor predeterminado es 300 segundos. Establece
		<code>ws_idle_timeout_secs = 0</code> para desactivarlo por completo.
	</p>

	<h3>Una suscripción termina con <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Causa:</strong> Los eventos almacenados de un REQ superaron
		<code>max_req_response_bytes</code> (32 MiB por defecto). Solo ocurre con eventos muy grandes o filtros
		muy amplios.
	</p>
	<p>
		<strong>Solución:</strong> Reduce el filtro (<code>since</code>/<code>until</code> más estrictos, un
		<code>limit</code> más bajo) o aumenta <code>max_req_response_bytes</code> (0 desactiva el límite).
	</p>

	<h3>Falta un NIP en la lista <code>supported_nips</code> de NIP-11</h3>
	<p>
		<strong>Causa:</strong> La lista anunciada es dinámica — un NIP se oculta cuando todos los kinds que
		define son rechazados: todos están en <code>blocked_kinds</code>, ninguno está en
		<code>allowed_kinds</code>, o son kinds efímeros rechazados por <code>reject_ephemeral</code>.
		NIP-29/43/66 además requieren <code>relay.private_key</code> y NIP-86 requiere
		<code>rpc.management_token</code> o <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Solución:</strong> Revisa las listas de acceso activas — <code>listallowedkinds</code> de NIP-86
		muestra la lista de kinds permitidos, y <code>GET /</code> muestra inmediatamente el
		<code>supported_nips</code> efectivo. Elimina el kind bloqueante o el ajuste
		<code>reject_ephemeral</code>.
	</p>

	<h2 id="publishing">Errores al publicar</h2>
	<p>
		Cuando falla la publicación, el cuarto elemento del mensaje <code>OK</code> explica por qué. Los más
		comunes:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Error</th>
				<th>Significado y solución</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>La firma del evento no es válida (posiblemente una clave de cliente defectuosa).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					El contenido supera <code>max_content_bytes</code> (64K caracteres por defecto). Acórtalo o
					aumenta el límite.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>Más etiquetas que <code>max_tags</code> (2000 por defecto).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Marca de tiempo demasiado lejana en el futuro (más allá de
					<code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					El contenido o las etiquetas contienen una cadena con aspecto de nsec.
					<strong>Nunca publiques claves secretas.</strong> Elimina la cadena y el evento será
					aceptado.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>El mismo evento ya está almacenado (normal).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>La clave pública está prohibida (<code>banpubkey</code>) o fuera de la lista de permitidos.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>Este kind no está permitido.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					La clave pública superó <code>max_events_per_min_per_pubkey</code> (ventana deslizante de 60
					segundos). Espera un minuto y reintenta, o aumenta/desactiva el límite.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>El id del evento está prohibido.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Republicación de un evento eliminado.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					Se requiere autenticación (cuando <code>relay.require_auth</code> está activado).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					La cuenta se creó dentro de <code>new_pubkey_min_age_secs</code>. Espera y
					reintenta.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>El grupo no existe (créalo primero).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					El grupo está <code>closed</code>; las solicitudes de unión sin código de invitación no se
					aceptan.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Servidor de archivos Blossom</h2>

	<h3>La subida falla con <code>401</code></h3>
	<p>El evento de autorización de subida (kind 24242) fue rechazado. Comprueba que:</p>
	<ul>
		<li>
			el tag <code>expiration</code> del token está <strong>presente</strong> y establecido a una marca de
			tiempo unix en el futuro,
		</li>
		<li>para upload/media/delete el token lleva un tag <code>x</code> con el sha256 del blob,</li>
		<li>
			el tag <code>server</code> (cuando está presente) nombra exactamente el <code>blossom.host</code>
			configurado (solo nombre de host, sin esquema/ruta),
		</li>
		<li>el token se firmó en los últimos 10 minutos (ventana de frescura contra repetición),</li>
		<li>y la clave de firma es la propia del remitente.</li>
	</ul>

	<h3>La subida falla con <code>403</code></h3>
	<p>
		<code>blossom.restrict_uploads = true</code> está configurado y la clave pública no está en la lista de
		permitidos — añádela con <code>nostrfy blossom allow npub1...</code> (el demonio recarga
		automáticamente). Si la lista parece incorrecta, <code>nostrfy blossom list</code> la muestra.
	</p>

	<h3>La subida falla con <code>409</code></h3>
	<p>
		El cliente envió una cabecera <code>X-SHA-256</code> que no coincide con el cuerpo real de la solicitud
		(el hash declarado se calculó sobre bytes diferentes — p. ej. el archivo cambió entre el cálculo y el
		envío). Los clientes pueden omitir la cabecera por completo.
	</p>

	<h3><code>GET /</code> en el host de medios sirve el documento NIP-11</h3>
	<p>
		La solicitud no llegó al relé con la cabecera Blossom Host. Apunta <code>media.example.com</code> (o el
		valor configurado para <code>blossom.host</code>) al mismo puerto en el proxy inverso, luego
		<code>nostrfy restart</code>.
	</p>

	<h3>Un blob devuelve 404 justo después de la subida</h3>
	<p>
		El archivo se direcciona por contenido mediante su SHA-256: obténlo mediante el hash exacto devuelto en la respuesta de
		subida (<code>/&lt;sha256&gt;</code> o <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). Una discordancia
		significa que el cliente solicitó un hash diferente de los bytes enviados.
	</p>

	<h2 id="search-groups-auth">Búsqueda, grupos y autenticación</h2>

	<h3>La búsqueda devuelve 0 resultados / resultados inesperados</h3>
	<p>La búsqueda de nostrfy coincide con <strong>palabras completas</strong>. Ten en cuenta que:</p>
	<ul>
		<li>
			<code>search = "rust"</code> coincide con eventos que contienen la palabra «rust», pero
			<code>"ru"</code> NO coincide con «rust» como subcadena.
		</li>
		<li>Solo se buscan palabras en el contenido del evento.</li>
		<li>Si <code>search_index = false</code>, la búsqueda sigue funcionando pero es más lenta.</li>
		<li>
			Si NIP-50 está desactivado (<code>disabled_nips = [50]</code>), <code>search</code> se ignora
			(se envía un NOTICE).
		</li>
	</ul>

	<h3>Los metadatos de grupo (39000-39005) no se generan</h3>
	<p>
		<strong>Causa:</strong> <code>relay.private_key</code> no está configurado. Las instantáneas de grupo
		las firma la propia clave del relé, por lo que sin ella no se genera nada.
	</p>
	<p><strong>Solución:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> rechaza eventos de grupo</h3>
	<p>
		<strong>Causa:</strong> El grupo no existe. En NIP-29, los eventos de moderación y las solicitudes de
		unión (9021) no pueden dirigirse a un grupo antes de que se cree (kind 9007).
	</p>
	<p><strong>Solución:</strong> Crea primero el grupo con un evento 9007.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Causa:</strong> La moderación (añadir miembros, etc.) requiere un administrador (un miembro con
		un rol). El creador es administrador.
	</p>
	<p><strong>Solución:</strong> Pide a un administrador que te otorgue un rol, o crea tu propio grupo.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Causa:</strong> El grupo está <code>closed</code>; las solicitudes de unión sin código de
		invitación no se aprueban automáticamente.
	</p>
	<p><strong>Solución:</strong> Pide a un administrador un código de invitación (9009) y únete con un tag <code>code</code>.</p>

	<h3>Salió accidentalmente de un grupo, o el grupo no tiene administradores</h3>
	<p>
		<strong>Causa:</strong> Las solicitudes de salida NIP-29 (kind 9022) se aceptan para cualquier miembro —
		incluido el último administrador del grupo, que no deja administradores. Sin administrador, nadie puede
		enviar eventos de moderación (9000/9001/9002/9008).
	</p>
	<p>
		<strong>Solución:</strong> Firma un evento de moderación con la propia clave del relé
		(<code>relay.private_key</code>, la clave pública anunciada como <code>self</code> de NIP-11). Según
		NIP-29, los eventos de moderación pueden venir de «la clave maestra del relé o ... los administradores
		del grupo», por lo que el relé acepta moderación de grupo firmada por su propia clave incluso cuando el
		grupo no tiene administradores. Por ejemplo, restaura un administrador con un
		<code>kind:9000</code>:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Fírmalo y publícalo con la clave del relé. Como alternativa, elimina el grupo con un
		<code>kind:9008</code> firmado por el relé (sus eventos almacenados se purgan) y vuelve a crearlo con
		<code>kind:9007</code>. Esta recuperación necesita que <code>relay.private_key</code> esté configurado.
	</p>

	<h3>Los eventos protegidos se rechazan con <code>auth-required</code></h3>
	<p>
		<strong>Causa:</strong> Los eventos protegidos NIP-70 (con un tag <code>-</code>) solo pueden ser
		publicados por el autor autenticado <strong>en la misma conexión</strong>.
	</p>
	<p><strong>Solución:</strong> Activa la autenticación NIP-42 en el cliente antes de publicar.</p>

	<h3>AUTH (NIP-42) devuelve <code>false</code></h3>
	<p>Causas comunes:</p>
	<ol>
		<li>
			<code>relay.public_url</code> no está configurado o es incorrecto — el tag <code>relay</code> del
			evento AUTH no coincide con la URL del relé. Configura <code>wss://...</code> y reinicia.
		</li>
		<li>Desafío obsoleto — enviaste AUTH en otra conexión, o reutilizaste un desafío antiguo.</li>
		<li>
			El reloj del cliente está desajustado — el <code>created_at</code> del evento AUTH debe estar dentro
			de ±10 minutos de la hora actual.
		</li>
	</ol>

	<h3>La API de gestión NIP-86 devuelve <code>401 unauthorized</code></h3>
	<p><strong>Causa:</strong> Credenciales faltantes o incorrectas.</p>
	<p><strong>Solución:</strong></p>
	<ul>
		<li>Configura <code>management_token</code> y envía <code>Authorization: Bearer &lt;token&gt;</code>.</li>
		<li>
			O configura <code>admin_pubkey</code> y envía un evento de autenticación NIP-98 (el tag
			<code>u</code> debe coincidir exactamente con la URL del relé; se requiere un tag
			<code>payload</code>).
		</li>
		<li>Si ninguno está configurado, la API de gestión está desactivada por completo.</li>
	</ul>

	<h3>Los eventos de autenticación NIP-98 se rechazan por un esquema o puerto diferente</h3>
	<p>
		La especificación NIP-98 dice que el tag <code>u</code> debe ser <em>exactamente</em> igual que la URL
		absoluta de la solicitud, por lo que nostrfy deriva la URL esperada de
		<code>relay.public_url</code>: su autoridad más el esquema HTTP asignado desde el esquema WebSocket
		(<code>wss://</code> → <code>https://</code>, <code>ws://</code> → <code>http://</code>,
		<code>nostr+</code> eliminado). Sin <code>public_url</code>, el relé espera el
		<code>http://host:port</code> sin cifrar que sirve. Un tag con otro esquema, un puerto diferente/omitido, o una ruta
		o consulta diferentes se rechaza — configura <code>relay.public_url</code> con la dirección pública que
		firman los clientes. Cada evento de autenticación también es de <strong>un solo uso</strong>: repetir la
		misma cabecera <code>Authorization</code> dentro de su ventana de validez de 60 segundos se rechaza.
	</p>

	<h2 id="db-disk">Base de datos y disco</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Causa:</strong> Se alcanzó el límite del mapa de memoria LMDB (1 TB de espacio de direcciones
		virtuales por defecto; el uso real de disco crece con los datos) — en la práctica, la base de datos está
		llena.
	</p>
	<p><strong>Solución:</strong> Aumenta <code>database.max_map_size</code> y reinicia.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Causa:</strong> Menos de 32 MB de espacio libre en disco. Las escrituras se detienen (para
		proteger los datos); las lecturas continúan.
	</p>
	<p>
		<strong>Solución:</strong> Libera espacio en disco. Las escrituras se reanudan automáticamente cuando
		haya espacio disponible. (<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> informa <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Causa:</strong> <code>database.map_size</code> es mayor que <code>max_map_size</code>.
	</p>
	<p>
		<strong>Solución:</strong> Establece <code>map_size</code> igual o por debajo de
		<code>max_map_size</code> (los valores predeterminados están bien).
	</p>

	<h3>Comprobar el tamaño de la base de datos</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Respaldar / mover la base de datos</h3>
	<p>
		Todos los datos están en el directorio <code>database.path</code>.
		<strong>Detén el relé antes de copiar</strong> (copiar una base de datos activa puede corromperla).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Funcionamiento del demonio</h2>

	<h3><code>nostrfy stats</code> dice <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Causa:</strong> El archivo de estadísticas no existe — el demonio no se está ejecutando, o se
		inició hace menos de unos segundos.
	</p>
	<p><strong>Solución:</strong> Ejecuta <code>nostrfy start</code>, espera unos segundos e inténtalo de nuevo.</p>

	<h3>El registro crece sin límite</h3>
	<p>
		<strong>Causa:</strong> <code>max_log_size_bytes</code> es 0 (rotación desactivada).
	</p>
	<p>
		<strong>Solución:</strong> Establece <code>max_log_size_bytes = 52428800</code> (50 MB) y
		<code>max_log_files = 5</code>. La rotación es automática.
	</p>

	<h3>Los cambios en la configuración no surten efecto tras la recarga</h3>
	<p>
		<strong>Causa:</strong> Recargaste (SIGHUP) ajustes que son fijos al inicio: <code>private_key</code>,
		<code>api_host</code>, <code>metrics_enabled</code>, los ajustes de LiveKit y las listas de
		activación/desactivación de NIP.
	</p>
	<p>
		<strong>Solución:</strong> Usa <code>nostrfy restart</code>. El registro contiene una advertencia
		«a restart is required» en este caso.
	</p>

	<h3>El relé sigue deteniéndose solo</h3>
	<p><strong>Causa:</strong> La máquina se reinició, o el relé se quedó sin memoria (OOM).</p>
	<p><strong>Solución:</strong></p>
	<ol>
		<li>Revisa el final del registro: <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Comprueba si la máquina se reinició: <code>uptime</code> (un tiempo de actividad muy corto significa
			un reinicio).
		</li>
		<li>Comprueba la memoria: <code>free -h</code>.</li>
		<li>Inicia el relé de nuevo: <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Consejo">
		Para iniciar nostrfy automáticamente al arrancar, regístralo como servicio systemd con el comando de
		inicio del relé como <code>ExecStart</code>.
	</Callout>

	<h3>systemd no puede iniciar el relé en el puerto 80</h3>
	<p>
		Un servicio systemd ejecutado como root puede usar el puerto 80. Si estableces <code>User=</code> a un
		usuario normal, usa un puerto más alto (p. ej. 8080) o añade
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> a la unidad.
	</p>

	<h2 id="still-not-solved">¿Aún no se ha resuelto?</h2>
	<ol>
		<li>
			<strong>Revisa el registro</strong>: <code>tail -100 nostrfy.log</code> — normalmente indica la causa
			directa.
		</li>
		<li>
			<strong>Vuelve a validar la configuración</strong>: <code>nostrfy check</code> — muestra advertencias
			y errores.
		</li>
		<li>
			<strong>Recopila los detalles de reproducción</strong>: qué estabas haciendo, qué cliente, qué error
			exacto.
		</li>
		<li>
			<strong>Pregunta en el repositorio del proyecto</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — al abrir un
			issue, incluye los pasos de reproducción y el registro.
		</li>
	</ol>
</div>
