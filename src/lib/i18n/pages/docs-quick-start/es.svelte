<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # recarga la configuración sin reiniciar`;
</script>

<DocsTitle
	title="Guía de inicio rápido"
	description="De la instalación a un relé Nostr en marcha en minutos: escribe la configuración, valídala, arranca el demonio y ejecuta la primera comprobación de estado."
/>

<div class="doc-body">
	<h2>1. Crear una configuración</h2>
	<p>
		<code>nostrfy init</code> escribe un <code>nostrfy.toml</code> predeterminado con todos los comentarios:
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Ábrelo en un editor de texto y ajústalo — cada opción está comentada.</p>

	<h2>2. Validar la configuración</h2>
	<p>
		<code>nostrfy check</code> se recomienda encarecidamente antes de arrancar; si algo va mal, indica exactamente qué.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Arrancar el relé</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="Se ejecuta como demonio. Añade --foreground para quedarte en la terminal."
	/>
	<p>Luego verifica que el relé esté activo con la comprobación de estado:</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Apuntar un cliente</h2>
	<p>
		En la misma máquina, conéctate a <code>ws://&lt;host&gt;:8080</code>. El host predeterminado es
		<code>127.0.0.1</code>, que solo acepta conexiones locales. Para acceder al relé desde otras máquinas, configura en la configuración <code>server.host = "0.0.0.0"</code>:
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		Para <code>wss://</code>, necesitas un proxy que termine el TLS (nginx o Caddy) delante — consulta la
		<a href={p('/docs/deploy/')}>documentación de despliegue</a>.
	</p>

	<h2>5. Detener y reiniciar</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart relee la configuración; SIGHUP recarga la mayoría de los ajustes sin reiniciar."
	/>

	<h2>Operación eficaz</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> muestra estadísticas en vivo — también por HTTP en
			<code>/relay/stats</code> y <code>/metrics</code>.
		</li>
		<li>El registro se escribe en <code>daemon.log_file</code> y se rota automáticamente.</li>
		<li>
			<code>RUST_LOG</code> controla el nivel de registro (por ejemplo, <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="¿Los clientes externos no pueden conectar?">
		<code>server.host</code> es <code>127.0.0.1</code> por defecto. Configura <code>host = "0.0.0.0"</code> y reinicia.
	</Callout>

	<Callout type="tip" title="Siguiente">
		Ajusta todos los aspectos del relé en la <a href={p('/docs/configuration/')}>referencia de configuración</a>.
	</Callout>
</div>
