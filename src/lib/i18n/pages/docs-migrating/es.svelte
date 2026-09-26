<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. detén el relé nostrfy (la migración necesita el directorio de la base)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry-run — analiza y verifica cada evento, no escribe nada
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. importación
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. arranca — los grupos NIP-29 y los roles NIP-43 se reconstruyen desde los eventos importados
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # necesario para NIP-42/62/98 y metadatos NIP-29
private_key = "..."                       # necesario para metadatos NIP-29/43 firmados por el relé

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Opción A — nostrfy ejecuta \`strfry export\` (strfry en PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Opción B — exportaste a un archivo
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Opción C — pipe (stdin es la entrada por defecto)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # para nak (WebSocket)
H=https://relay.example.com    # para curl (HTTP)

nak relay "$R"                              # el relé responde y anuncia sus NIPs
curl -s "$H/api/v1/query?limit=1"           # los eventos se sirven
nak req -i <deleted-event-id> "$R"          # un evento borrado sigue fuera
nak req -k 39000 "$R"                       # metadatos de grupo NIP-29 (si se migró)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # membresía NIP-43 (AUTH)`;
</script>

<DocsTitle
	title="Migrar desde strfry"
	description="Mueve los eventos de un relé strfry existente a nostrfy con un comando — preparación, simulacro, migración, verificación y reversión."
/>

<div class="doc-body">
	<h2>De un vistazo</h2>
	<p>
		<code>nostrfy migrate-strfry</code> lee el formato de exportación propio de
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		(JSONL, un evento NIP-01 por línea), así funciona entre versiones de base de datos de strfry y no depende del esquema
		LMDB interno de strfry. Nunca escribe en la base de datos de strfry.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Migrado</th>
					<th>No migrado</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Cada evento almacenado (semántica reemplazable/direccionable aplicada)</td>
					<td>Ajustes de strfry sin equivalente en nostrfy (el informe de fusión lista cada uno con motivo)</td>
				</tr>
				<tr>
					<td>Caducidad NIP-40 — los eventos ya caducados se omiten</td>
					<td>Medios Blossom y mapeos de propietarios (strfry no tiene servidor Blossom)</td>
				</tr>
				<tr>
					<td>Borrados NIP-09, incluidos bloqueos de republicación para eventos ya borrados por strfry</td>
					<td>Listas de acceso (bans NIP-86, listas de pubkeys del relé, allowlist de Blossom)</td>
				</tr>
				<tr>
					<td>Efectos secundarios de moderación NIP-29 <code>9005</code>/<code>9008</code></td>
					<td>Códigos de invitación NIP-43 (emite nuevos con <code>createclaim</code>)</td>
				</tr>
				<tr>
					<td>Marcas first-seen (cuando está configurada la puerta de nuevas pubkeys)</td>
					<td>Solicitudes vanish NIP-62 a menos que se dé <code>--apply-vanish</code></td>
				</tr>
				<tr>
					<td>Grupos NIP-29, roles NIP-43 y sus metadatos firmados por el relé, reconstruidos en el primer arranque</td>
					<td>Identidad/claves propias del relé (viven en <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>Los ajustes equivalentes de strfry, ofrecidos para fusionar en <code>nostrfy.toml</code> (opcional)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Omitidos esperados en el resumen: <strong>eventos efímeros</strong> (kinds 20000-29999, que nostrfy nunca
		almacena) y <strong>eventos ya caducados</strong>.
	</p>

	<h2>Inicio rápido</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="La migración es offline">
		Escribe directamente en <code>database.path</code> y se niega a ejecutarse mientras un demonio nostrfy (u otra
		migración) mantenga el directorio de base. <strong>Detén primero el relé.</strong> strfry puede seguir
		ejecutándose — <code>strfry export</code> lee una instantánea consistente.
	</Callout>

	<h2>Requisitos</h2>
	<ul>
		<li>
			El binario <code>strfry</code> (para <code>--strfry-db</code>), o un archivo JSONL exportado por ti.
		</li>
		<li>nostrfy v0.1.15 o superior (subcomando <code>migrate-strfry</code>).</li>
		<li>La config nostrfy del relé destino, con <code>database.path</code>, <code>public_url</code> y <code>private_key</code> definidos.</li>
		<li>
			Espacio libre: aproximadamente el tamaño del export de strfry más sus índices. El índice de palabras NIP-50
			suma algo más; con disco muy justo puedes desactivarlo (<code>database.search_index = false</code>),
			migrar y reactivarlo después (el índice se reconstruye al arrancar).
		</li>
		<li>Ninguna instancia nostrfy en ejecución sobre el <code>database.path</code> destino.</li>
	</ul>

	<h2>Preparar la config</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Genera la clave del relé con <code>nostrfy genkey</code> si no tienes una, luego valida:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>Fusionar los ajustes de strfry (opcional)</h3>
	<p>
		Antes de abrir la base, <code>migrate-strfry</code> busca la config de strfry (<code>--strfry-config</code>, luego
		<code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>, <code>./strfry.conf</code>), muestra los ajustes que tienen
		equivalente en nostrfy y difieren de tu <code>nostrfy.toml</code>, y pregunta si fusionarlos. Solo se reescriben las claves
		listadas — comentarios y demás líneas se preservan, y un valor que invalidaría la config se omite con su motivo mientras el
		resto sí se fusiona.
	</p>
	<ul>
		<li><code>--merge-config</code> aplica sin preguntar (para scripts); <code>--no-merge-config</code> omite el paso.</li>
		<li>Sin terminal, las propuestas se imprimen y la fusión se omite salvo que se dé <code>--merge-config</code>.</li>
		<li><code>--dry-run</code> muestra las propuestas pero nunca escribe.</li>
	</ul>

	<h2>Simulacro</h2>
	<p>Mira antes de saltar — un simulacro analiza y verifica todo el export sin tocar la base:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		Un conteo <code>bad signature</code> distinto de cero significa que el export contiene eventos que strfry aceptó sin
		verificación; se omitirán. Si confías en ellos, pasa <code>--no-verify</code> para importarlos igualmente.
	</p>

	<h2>Migrar</h2>
	<p>Elige uno de tres modos de entrada — todos producen el mismo resultado:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Flag</th>
					<th>Por qué</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry no está en <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Reanudar/alcanzar: eventos con este <code>created_at</code> o más nuevos (inclusivo)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>Respetar solicitudes vanish NIP-62 del export (desactivado por defecto)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Omitir verificación de firmas para dumps confiables (más rápido)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Eventos por transacción de base (defecto 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Solo analizar y verificar</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		La migración es <strong>segura de reejecutar</strong>: los duplicados se omiten y los efectos de borrado se
		reaplican, así una ejecución interrumpida puede simplemente repetirse (o reanudarse con <code>--since</code>).
	</p>

	<h2>Iniciar y verificar</h2>
	<p>
		El primer arranque reconstruye el almacén de grupos NIP-29 y el almacén de roles NIP-43 desde los eventos importados
		y republica los metadatos firmados por el relé (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		por grupo, la lista de miembros <code>13534</code>). En una base grande puede tardar; observa el log.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		Para comparación exacta, <code>strfry scan '&#123;&#125;' | wc -l</code> menos los eventos efímeros/caducados
		reportados por el resumen debería igualar lo que los clientes pueden recuperar.
	</p>

	<h2>Reanudar una migración interrumpida</h2>
	<Callout type="warning" title="No inicies el relé antes de reejecutar">
		Los efectos de grupo NIP-29 (<code>9005</code>/<code>9008</code>) se aplican tras la importación; una ejecución
		interrumpida almacenó esos eventos pero aún no sus borrados, así el primer arranque podría servir historial que el
		borrado debía eliminar. Reejecuta primero la migración — completa los efectos (la purga es idempotente) — luego inicia el relé.
	</Callout>
	<ul>
		<li>
			<strong>Exportado a archivo / por pipe:</strong> reejecuta el mismo comando. Los duplicados se omiten y los
			bloqueos de borrado se reaplican.
		</li>
		<li>
			<strong>Usaste <code>--strfry-db</code>:</strong> el resumen imprime una pista de reanudación; reejecuta con ese
			<code>--since</code> (inclusivo, el segundo límite se reimporta y deduplica).
		</li>
		<li>
			Si falló con <code>database writer unavailable</code>, revisa espacio libre y <code>database.map_size</code>, luego reejecuta.
		</li>
	</ul>

	<h2>Reversión</h2>
	<p>La migración solo escribe en la base nostrfy. Para revertir, detén el relé y restaura la base pre-migración o elimínala:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # o restaura la copia pre-migración'} lang="sh" />

	<h2>Solución de problemas</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Mensaje</th>
					<th>Causa / solución</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>Un demonio nostrfy (u otra migración) mantiene el directorio: primero <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> debe nombrar el directorio que contiene <code>data.mdb</code></td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>Instala strfry, define <code>--strfry-bin</code>, o usa <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>El hilo escritor se detuvo o la cola está sobrecargada: revisa disco/tamaño map, reejecuta (seguro)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>La purga fue interrumpida: reejecuta la migración</td>
				</tr>
				<tr>
					<td>Conteo <code>bad signature</code> alto</td>
					<td>La BD strfry contiene eventos no verificados: inspecciónalos; importa con <code>--no-verify</code> solo si confías en la fuente</td>
				</tr>
				<tr>
					<td>Faltan metadatos NIP-29 tras el arranque</td>
					<td>Sin <code>relay.private_key</code>: ejecuta <code>nostrfy genkey</code> y reinicia</td>
				</tr>
				<tr>
					<td>La fusión de ajustes no se ofrece</td>
					<td>Config de strfry no encontrada: pasa <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Lista de verificación</h2>
	<ul>
		<li>Relé nostrfy detenido</li>
		<li>Base strfry y config nostrfy respaldadas</li>
		<li><code>nostrfy check</code> pasa</li>
		<li>Ajustes strfry fusionados (o informe revisado)</li>
		<li>Simulacro revisado (sin bad signatures inesperadas)</li>
		<li>Migración completada sin errores</li>
		<li>El relé arranca; reconstrucción de grupos/roles registrada</li>
		<li>Conteos coinciden (menos efímeros/caducados)</li>
		<li>Eventos borrados siguen fuera (republicación rechazada)</li>
		<li>Visibilidad de grupos privados comprobada anónimamente y como miembro</li>
		<li>Proxy inverso, DNS y listas de relés de clientes actualizados</li>
	</ul>

	<Callout type="tip" title="¿strfry sigue en marcha?">
		Si strfry quedó live durante el export, haz una pasada de alcance cuando estés listo para cambiar: detén nostrfy,
		reejecuta la migración con <code>--since &lt;last created_at&gt;</code>, luego arranca de nuevo.
	</Callout>
</div>
