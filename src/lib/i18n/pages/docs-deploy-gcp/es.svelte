<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # configura name, public_url y private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Desplegar en Google Cloud"
	description="Despliega nostrfy en Google Cloud Compute Engine o Cloud Run — paso a paso, con systemd, TLS y las advertencias de escalado a cero."
/>

<div class="doc-body">
	<p>
		Opciones: <strong>Compute Engine</strong> (VM, recomendado) o <strong>Cloud Run</strong>
		(contenedores).
	</p>

	<h2>Opción 1: Compute Engine (recomendado)</h2>
	<ol>
		<li>
			<strong>Crea una VM</strong>: Ubuntu 24.04 LTS (o Debian), <code>e2-small</code> (2 GB) es
			suficiente para empezar. Elige una región cercana a tus usuarios.
		</li>
		<li>
			<strong>Regla de firewall</strong>: permite TCP entrante <code>8080</code> (y <code>443</code>
			para TLS). En <strong>Red → Firewall</strong>, crea una regla con las etiquetas de destino que
			asignaste a la VM.
		</li>
		<li>
			<strong>Conéctate por SSH</strong> (funciona el botón SSH de la consola) y sigue la
			<a href={p('/docs/deploy/vps/')}>guía genérica de VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Reserva una IP estática</strong> (IP externa → Reservar) para que
			<code>public_url</code> siga siendo válida tras los reinicios.
		</li>
		<li>
			<strong>Verifica</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>Añade TLS (<code>wss://</code>)</strong> con certbot + nginx (como en la
			<a href={p('/docs/deploy/vps/')}>guía de VPS</a>) o un balanceador de carga de GCP con un
			certificado gestionado.
		</li>
	</ol>

	<h2>Opción 2: Cloud Run (contenedor)</h2>
	<p>
		Cloud Run compila desde el <code>Dockerfile</code> del repositorio (que descarga el binario
		precompilado de la release):
	</p>
	<ol>
		<li>
			<strong>Crea un servicio desde el repo de GitHub</strong> (o sube la imagen a Artifact
			Registry).
		</li>
		<li>
			<strong>Puerto</strong>: establece el puerto del contenedor en <code>8080</code>.
		</li>
		<li>
			<strong>Asigna memoria</strong>: al menos 512 MB (LMDB + el runtime asíncrono).
		</li>
		<li>
			<strong>Almacenamiento persistente</strong>: adjunta un <strong>volumen de Cloud Run
			(filestore/gcsfuse)</strong> en <code>/data</code> — LMDB necesita un sistema de archivos, por lo
			que un montaje GCS FUSE en <code>/data</code> sirve para la persistencia.
		</li>
		<li>
			<strong>TLS</strong>: Cloud Run proporciona <code>https://</code> automáticamente — establece
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (o tu dominio personalizado).
		</li>
	</ol>

	<Callout type="note" title="Cloud Run escala a cero por defecto">
		Para un relé, establece <strong>min instances = 1</strong> para que nunca se enfríe. El
		<code>deploy/nostrfy.container.toml</code> integrado en la imagen se puede reemplazar montando tu
		propio <code>nostrfy.toml</code> en <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
