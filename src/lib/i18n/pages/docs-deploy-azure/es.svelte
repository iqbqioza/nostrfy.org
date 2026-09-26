<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # configura name, public_url y private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="Desplegar en Azure"
	description="Despliega nostrfy en una VM de Azure o en Azure Container Apps — paso a paso, con systemd, TLS y las advertencias de las IP públicas dinámicas."
/>

<div class="doc-body">
	<p>
		Opciones: <strong>VM</strong> (recomendado) o <strong>Container Apps</strong>.
	</p>

	<h2>Opción 1: Máquina virtual (recomendado)</h2>
	<ol>
		<li>
			<strong>Crea una VM</strong>: Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 GB) o
			<code>Standard_B2s</code> (2 GB) para empezar. Elige una región cercana a tus usuarios.
		</li>
		<li>
			<strong>Grupo de seguridad de red (NSG)</strong>: añade una regla de entrada para TCP <code>8080</code>
			(y <code>443</code> para TLS). Restringe la regla SSH a tu IP.
		</li>
		<li>
			<strong>Conéctate por SSH</strong> y sigue la <a href={p('/docs/deploy/vps/')}>guía genérica de VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Verifica</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Añade TLS (<code>wss://</code>)</strong> con certbot + nginx (como en la
			<a href={p('/docs/deploy/vps/')}>guía de VPS</a>) o con un Application Gateway de Azure con certificado.
		</li>
	</ol>

	<Callout type="note" title="La IP pública de una VM de Azure puede cambiar al desasignarla">
		Usa una <strong>IP pública estática</strong> para que <code>relay.public_url</code> siga siendo válido.
	</Callout>

	<h2>Opción 2: Azure Container Apps</h2>
	<p>
		Container Apps se construye desde el <code>Dockerfile</code> del repositorio (que descarga el binario
		release precompilado):
	</p>
	<ol>
		<li>
			<strong>Crea una Container App</strong> desde el repositorio de GitHub (o sube la imagen a ACR).
		</li>
		<li>
			<strong>Puerto</strong>: establece el puerto del contenedor en <code>8080</code>.
		</li>
		<li>
			<strong>Memoria</strong>: al menos 1 GB.
		</li>
		<li>
			<strong>Almacenamiento persistente</strong>: monta un <strong>recurso compartido de archivos de Azure Storage</strong> en
			<code>/data</code> para los datos LMDB.
		</li>
		<li>
			<strong>TLS</strong>: Container Apps proporciona <code>https://</code> en la URL de la app — establece
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (o un dominio personalizado).
		</li>
	</ol>

	<Callout type="note" title="Un relé nunca debe escalar a cero">
		Establece <strong>min replicas = 1</strong>. El <code>deploy/nostrfy.container.toml</code> incluido puede
		reemplazarse montando tu propio <code>nostrfy.toml</code> en <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
