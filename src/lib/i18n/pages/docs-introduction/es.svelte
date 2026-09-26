<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Introducción a nostrfy"
	description="Qué es nostrfy, qué hace de serie y las ideas de diseño detrás del motor de relé Nostr todo en uno escrito en Rust."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> es un servidor de relé para el protocolo
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a>. Almacena los eventos enviados por los clientes (publicaciones, reacciones, perfiles…) y los entrega en respuesta a las suscripciones.
	</p>

	<h2>Funciones clave</h2>
	<ul>
		<li><strong>Simple y estable</strong>  — escrito en Rust; un solo binario lo hace todo.</li>
		<li>
			<strong>Almacenamiento y búsqueda rápidos</strong>  — base de datos LMDB con índice de búsqueda de texto completo (NIP-50).
		</li>
		<li>
			<strong>Amplia compatibilidad con NIP</strong>  — 36 NIP implementados, más el servidor de archivos Blossom: eliminación, prueba de trabajo, delegación, grupos, búsqueda y una API de gestión.
		</li>
		<li>
			<strong>Fácil de operar</strong>  — modo demonio, rotación de registros, recarga en caliente de la configuración (SIGHUP), estadísticas en vivo, API REST y métricas Prometheus.
		</li>
		<li>
			<strong>Migración sencilla</strong>  — un comando importa una
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			base de datos: dry-run, fusión de ajustes y repeticiones seguras (<a href={p('/docs/migrating-from-strfry/')}>guía de migración</a>).
		</li>
	</ul>

	<h2>Lo que obtienes de serie</h2>
	<p>
		Un único binario <code>nostrfy</code> en un solo puerto sirve:
	</p>
	<ul>
		<li><strong>relé WebSocket</strong> y el documento de información NIP-11.</li>
		<li>Una <strong>API REST</strong> de solo lectura, ubicada en <code>/api/v1/...</code> — su propio hilo de lectura garantiza que el tráfico REST nunca bloquee a los suscriptores WebSocket.</li>
		<li><strong>servidor de archivos Blossom</strong> (alojamiento de medios) en su propio nombre de host.</li>
		<li><strong>RPC de gestión NIP-86</strong>, la comprobación de estado y Prometheus <code>/metrics</code>.</li>
	</ul>

	<h2>Perfil de recursos</h2>
	<p>
		nostrfy se ha verificado que funciona en un <strong>VPS de 0,25 vCPU / 512 MB</strong>. El mapa de memoria LMDB es una reserva virtual dispersa de 1 TiB — el disco físico solo crece con datos reales — y la memoria del proceso se mantiene estable: un relé con una base de 252 MB ocupaba <strong>7,9 MB de RSS privado</strong>.
	</p>

	<h2>Una idea rápida</h2>
	<p>Tres comandos para instalar, inicializar y arrancar:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Luego verifica que el relé esté activo:</p>
	<CodeBlock code={health} lang="bash" />
	<p>Y obtén su documento NIP-11:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Siguientes pasos">
		Sigue el <a href={p('/docs/quick-start/')}>inicio rápido</a> para tu primera ejecución, o pasa directamente a la
		<a href={p('/docs/configuration/')}>referencia de configuración</a> para ajustar el relé.
	</Callout>
</div>
