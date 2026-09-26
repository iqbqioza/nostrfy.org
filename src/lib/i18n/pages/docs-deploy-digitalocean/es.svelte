<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # configura name, public_url y private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Desplegar en DigitalOcean"
	description="Despliega nostrfy en un Droplet de DigitalOcean o en App Platform — paso a paso, con systemd, TLS y una configuración lista para producción."
/>

<div class="doc-body">
	<p>
		Dos opciones: un <strong>Droplet</strong> (VM, lo más sencillo) o <strong>App Platform</strong>
		(contenedores).
	</p>

	<h2>Opción 1: Droplet (recomendado)</h2>
	<ol>
		<li>
			<strong>Crea un Droplet</strong>: Ubuntu 24.04 LTS, cualquier tamaño (1 GB de RAM es suficiente
			para empezar). Un Droplet en una región cercana a tus usuarios reduce la latencia.
		</li>
		<li>
			<strong>Conéctate por SSH</strong> y sigue la
			<a href={p('/docs/deploy/vps/')}>guía genérica de VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Abre el puerto</strong> en el firewall del Droplet (se recomienda
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>): permite el TCP entrante <code>8080</code> (y <code>443</code> si añades TLS).
		</li>
		<li>
			<strong>Verifica</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Añade TLS (<code>wss://</code>)</strong> con certbot + nginx, o
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				el balanceador de carga gestionado de DigitalOcean</a
			>
			con un certificado — luego establece <code>relay.public_url = "wss://relay.example.com"</code> y
			reinicia.
		</li>
	</ol>

	<h2>Opción 2: App Platform (contenedor)</h2>
	<p>
		App Platform compila desde el <code>Dockerfile</code> del repositorio (que descarga el binario de
		release precompilado):
	</p>
	<ol>
		<li><strong>Conecta tu repositorio de GitHub</strong> y crea una app a partir de él.</li>
		<li>
			<strong>Puerto</strong>: establece el puerto HTTP en <code>8080</code> (el relé escucha allí).
		</li>
		<li>
			<strong>Disco persistente</strong>: monta un volumen en <code>/data</code> (los datos LMDB viven
			allí — sin él, los datos se pierden en cada despliegue).
		</li>
		<li>
			<strong>Env</strong>: el archivo <code>deploy/nostrfy.container.toml</code> incluido en la imagen
			puede reemplazarse montando tu propia configuración en <code>/etc/nostrfy/nostrfy.toml</code> (crea
			un fork que lo copie, o usa un <code>COPY</code> en el Dockerfile de tu propio repo).
		</li>
		<li>
			<strong>TLS</strong>: App Platform proporciona <code>https://</code> automáticamente para el dominio
			de la app — establece <code>relay.public_url</code> en consecuencia.
		</li>
	</ol>

	<h2>Ambas opciones</h2>
	<ul>
		<li>
			Actualizaciones: vuelve a ejecutar <code>install.sh</code> + <code>systemctl restart nostrfy</code>
			(Droplet), o haz push al repositorio conectado (App Platform).
		</li>
		<li>
			Toda la configuración está documentada en la
			<a href={p('/docs/configuration/')}>referencia de configuración</a>.
		</li>
	</ul>
</div>
