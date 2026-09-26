<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const lowSpecConfig = `[database]
search_index = false   # reduce la base a la mitad y ahorra CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Guía de instalación"
	description="Requisitos, compilación desde el código fuente, instalación de un binario precompilado, verificación de sumas de comprobación y notas para ejecutar nostrfy en FreeBSD."
/>

<div class="doc-body">
	<h2>Requisitos</h2>
	<ul>
		<li>Un toolchain de Rust estable y reciente (solo necesario para compilar el relé).</li>
		<li>Máquina Linux.</li>
		<li>Se recomiendan 2 GB de RAM o más — para un VPS de 0,25 vCPU / 512 MB, consulta la nota de bajos recursos de abajo.</li>
	</ul>

	<h3>VPS de bajos recursos (0,25 vCPU / 512 MB)</h3>
	<p>
		nostrfy se ha verificado como estable incluso cuando la base de datos supera la RAM. El mapa LMDB es una
		<strong>reserva virtual dispersa de 1 TiB</strong> — el disco físico solo crece con los datos escritos — y la memoria del proceso se mantiene estable: un relé con una base de 252 MB ocupaba <strong>7,9 MB de RSS privado</strong>
		(el resto es caché de archivos reclamable que el kernel expulsa bajo presión).
	</p>
	<p>En un VPS diminuto, un ajuste marca la mayor diferencia:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Ajuste</th>
				<th>Efecto</th>
				<th>Medido</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Desactiva el índice de palabras NIP-50 — la búsqueda sigue funcionando (palabras completas) pero es más lenta
				</td>
				<td>41,8 MB → 20,5 MB por 10.000 eventos</td>
			</tr>
			<tr>
				<td>Valores predeterminados</td>
				<td>Ya optimizado para poca memoria</td>
				<td>No se necesita ningún cambio para 512 MB</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Compilar desde el código fuente</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>Cuando termina la compilación, el binario está en <code>target/release/nostrfy</code>.</p>

	<h2>Instalar un binario precompilado</h2>
	<p>
		El flujo de publicación adjunta binarios precompilados para <strong>Linux x86_64</strong>,
		<strong>Linux aarch64</strong> y <strong>FreeBSD x86_64</strong>. El mismo
		<code>install.sh</code> funciona en ambos sistemas — detecta la plataforma, descarga el binario correspondiente y verifica su suma de comprobación:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy se compila y ejecuta en FreeBSD 13.x y 14.x (amd64). Instala Rust y compila con:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Notas de plataforma:</p>
	<ul>
		<li>
			La comprobación de proceso vivo que usan <code>start</code>/<code>stop</code>/<code>restart</code> lee el
			nombre del proceso vía el sysctl <code>kern.proc.pid.&lt;pid&gt;.comm</code> (en Linux usa
			<code>/proc/&lt;pid&gt;/comm</code>), por lo que un archivo pid obsoleto cuyo pid fue reutilizado por otro programa se detecta en ambas plataformas.
		</li>
		<li>
			<code>nostrfy start</code> se ejecuta como demonio igual que en Linux; el demonio clásico de doble fork funciona con la integración
			<code>rc</code> por defecto (<code>service nostrfy start</code>).
		</li>
		<li>
			La comprobación de <code>min_free_bytes</code> de Blossom usa <code>statvfs</code>, que ambos sistemas proporcionan; no se usa ningún otro código específico de plataforma (el relé es Rust asíncrono puro sobre tokio).
		</li>
	</ul>

	<h3>Ejecución en el puerto 80</h3>
	<p>
		Los usuarios normales no pueden enlazar el puerto 80. Ejecútalo con <code>sudo</code> o usa un puerto más alto como 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Ejemplo: ejecución en el puerto 8080 (válido para usuarios normales; cambia antes el puerto en la configuración)."
	/>

	<Callout type="tip" title="Siguiente">
		nostrfy está instalado. Sigue el <a href={p('/docs/quick-start/')}>inicio rápido</a>.
	</Callout>
</div>
