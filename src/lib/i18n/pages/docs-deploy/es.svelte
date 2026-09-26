<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const commonBlock = `# 1. Instala el último binario de la release (no necesitas sudo para instalarlo)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Descarga la plantilla de configuración y edítala (no necesitas clonar el repositorio)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # configura name, public_url y private_key

# 3. Descarga la unidad systemd e inicia el servicio
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Abre el puerto (normalmente 8080) en el cortafuegos del proveedor y verifica
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # obligatorio para NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # ejecuta 'nostrfy genkey' y pega la clave`;
</script>

<DocsTitle
	title="Resumen de despliegue"
	description="Cómo se distribuye nostrfy y cómo desplegarlo — Fly.io, AWS, Google Cloud, Azure, DigitalOcean o cualquier VPS, con notas sobre TLS, systemd y contenedores."
/>

<div class="doc-body">
	<h2>Un binario, varias plataformas</h2>
	<p>
		nostrfy ofrece binarios precompilados para <strong>x86_64</strong> y <strong>aarch64</strong> (artefactos de
		release de GitHub, verificados por checksum con <code>install.sh</code>), una imagen de contenedor que
		<strong>descarga esos binarios</strong> (sin necesidad de compilar) y guías de despliegue para las principales
		plataformas.
	</p>

	<h2>Plataformas</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Plataforma</th>
				<th>Tipo</th>
				<th>Guía</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Plataforma gestionada (contenedores, volúmenes, TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) o App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail o ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) o Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM o Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Cualquier VPS</strong></td>
				<td>Servidor Ubuntu/Debian estándar</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>El patrón común para VM</h2>
	<p>Todas las guías de VM (Digital Ocean, AWS EC2, GCP, Azure, cualquier VPS) siguen el mismo patrón:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Antes de salir a producción</h2>
	<p>
		Cada despliegue usa las mismas opciones de <code>nostrfy.toml</code>. Antes de salir a producción, configura al menos:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>¿VM o contenedor?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong>: lo más simple, barato y con control total. Recomendado para la mayoría de
			despliegues de relés.
		</li>
		<li>
			<strong>Contenedor</strong>: usa el <code>Dockerfile</code> del repositorio (descarga el binario de release
			en el momento de la construcción) en Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run o Azure
			Container Apps. Se requiere almacenamiento persistente para los datos LMDB (<code>/data</code>).
		</li>
	</ul>

	<h2>Anfitrión multimedia Blossom</h2>
	<p>
		Si <code>blossom.host</code> está configurado, apunta ese nombre de host al mismo puerto en el proxy TLS
		(consulta los bloques nginx/Caddy en la <a href={p('/docs/deploy/vps/')}>guía de VPS</a>).
	</p>

	<Callout type="warning" title="TLS lo termina tu proxy o el proveedor">
		El relé sirve WebSocket sin cifrar en el puerto 8080 y respeta X-Forwarded-Proto.
	</Callout>
</div>
