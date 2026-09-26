<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # se muestra en clientes vía NIP-11
description = "A friendly relay for everyone"
private_key = "..."                            # obligatorio para grupos NIP-29
public_url = "wss://<your-app-name>.fly.dev"   # obligatorio para NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# línea de registro: "relay listening on ws://0.0.0.0:8080"
fly logs

# documento de información NIP-11 sobre la dirección pública
curl https://<your-app-name>.fly.dev/

# apunta tu cliente Nostr a wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="Desplegar en Fly.io"
	description="Despliega nostrfy en Fly.io en pocos minutos con la plantilla lista — volúmenes, máquinas, terminación TLS y actualizaciones sencillas."
/>

<div class="doc-body">
	<h2>Qué incluye el repositorio</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Archivo</th>
				<th>Propósito</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Imagen de contenedor — <strong>descarga el binario de release precompilado</strong> desde los assets de GitHub (x86_64 / aarch64, según la arquitectura de compilación) y verifica su checksum sha256. No se compila nada en Fly
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Configuración de la app Fly: servicio HTTP en el puerto 8080, comprobaciones de estado, montaje del volumen <code>/data</code>, máquinas siempre activas
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					La configuración del relé incluida en la imagen en <code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Requisitos previos</h2>
	<ul>
		<li>Una cuenta de Fly.io</li>
		<li>La CLI flyctl (<code>fly version</code>)</li>
		<li>Sesión iniciada: <code>fly auth login</code></li>
	</ul>

	<h2>Despliegue en cuatro pasos</h2>

	<h3>1. Crea la app (sin desplegar todavía)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> debe ser único en Fly (forma parte de la URL del relé:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>: p. ej. <code>nrt</code> (Tokio), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — elige la región más cercana a tus usuarios
		</li>
		<li>
			Esto puede sobrescribir los valores <code>fly.toml</code> de la plantilla (nombre de app, región) — no pasa nada
		</li>
	</ul>

	<h3>2. Crea el volumen persistente</h3>
	<p>La base de datos LMDB vive en un volumen Fly montado en <code>/data</code>:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB es suficiente para empezar (la base crece con el uso). Puedes redimensionar más tarde o crear desde el inicio un volumen mayor.
	</p>

	<h3>3. Configura el relé</h3>
	<p>Edita <code>deploy/nostrfy.container.toml</code> antes de desplegar:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>: genera localmente con <code>nostrfy genkey</code> (con una config temporal) y pega la clave, o genera una con cualquier herramienta Nostr
		</li>
		<li>
			<code>public_url</code> <strong>debe</strong> coincidir con tu nombre de app — sin ella, NIP-42 AUTH, NIP-62 vanish y la API de gestión NIP-86 no funcionarán
		</li>
		<li>Todo lo demás puede quedar por defecto</li>
	</ul>

	<h3>4. Desplegar</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly construye la imagen (unos minutos — la descarga del binario es rápida, la imagen es pequeña), crea una máquina y ejecuta la comprobación de estado contra <code>/health</code>.
	</p>

	<h2>Verificar</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Escalado y actualizaciones</h2>
	<ul>
		<li>
			<strong>Actualizar el relé</strong>: edita <code>deploy/nostrfy.container.toml</code> y repite <code>fly deploy</code> — la imagen siempre descarga el <strong>último</strong> binario de release de GitHub, así que actualizar es un simple redespliegue
		</li>
		<li>
			<strong>Fijar una versión</strong>: <code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> o cambia el <code>ARG</code> en el Dockerfile
		</li>
		<li>
			<strong>Escalar</strong>: el relé es una sola máquina por defecto. <code>fly machines clone &lt;id&gt;</code> crea una segunda máquina; ambas comparten el volumen (los volúmenes Fly admiten varias máquinas en la misma región)
		</li>
		<li>
			<strong>Métricas</strong>: Fly recoge el endpoint <code>/metrics</code> (ver <code>[metrics]</code> en <code>fly.toml</code>) y lo muestra en el panel de Fly bajo Metrics
		</li>
	</ul>

	<h2>Personalizar la configuración</h2>
	<p>
		La imagen lee <code>/etc/nostrfy/nostrfy.toml</code>, generado desde <code>deploy/nostrfy.container.toml</code>. Dos formas de personalizar:
	</p>
	<ol>
		<li>
			<strong>Edita <code>deploy/nostrfy.container.toml</code> en el repositorio</strong> y redespliega (lo más simple)
		</li>
		<li>
			<strong>Monta tu propia config</strong>: construye un fork de la imagen que copie tu archivo de config sobre <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>Cada opción está documentada en la <a href={p('/docs/configuration/')}>referencia de configuración</a>.</p>

	<h2>Notas</h2>
	<ul>
		<li>
			<strong>Siempre activo por diseño</strong>: <code>auto_stop_machines = false</code> en <code>fly.toml</code> — un relé nunca debe detenerse en periodos de inactividad
		</li>
		<li>
			El contenedor ejecuta el relé en <strong>modo primer plano</strong> (<code>nostrfy start --foreground</code>); los logs van a stdout/stderr y los recoge Fly
		</li>
		<li>
			TLS lo termina Fly; el relé sirve WebSocket sin cifrar en el puerto 8080
		</li>
		<li>
			<strong>Host multimedia Blossom</strong>: para servir también el servidor Blossom, pon <code>blossom.host = "media.example.com"</code> en la config, añade <code>media.example.com</code> como <strong>nombre de host adicional</strong> de la misma app Fly (<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> o <code>fly hostnames</code>), y añade el certificado TLS de <code>media.</code> en el panel de Fly — el relé separa los hosts internamente (como <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS lo termina Fly">
		El relé sirve WebSocket sin cifrar en el puerto 8080.
	</Callout>
</div>
