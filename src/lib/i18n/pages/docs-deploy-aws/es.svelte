<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # En Ubuntu: ubuntu@<public-ip>
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
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="Desplegar en AWS"
	description="Despliega nostrfy en AWS EC2, Lightsail o ECS/Fargate — paso a paso, con systemd, TLS detrás de un proxy inverso y una lista de verificación de producción."
/>

<div class="doc-body">
	<p>
		Opciones: <strong>EC2</strong> (VM, recomendado), <strong>Lightsail</strong> (VM más simple) o
		<strong>ECS/Fargate</strong> (contenedores).
	</p>

	<h2>Opción 1: EC2 (recomendado)</h2>
	<ol>
		<li>
			<strong>Lanza una instancia</strong>: Amazon Linux 2023 o Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 GB de RAM) es suficiente para empezar. Elige una región cercana a tus usuarios.
		</li>
		<li>
			<strong>Grupo de seguridad</strong>: permite TCP entrante <code>8080</code> (y <code>443</code> para
			TLS). Limita la regla SSH a tu IP.
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
			<a href={p('/docs/deploy/vps/')}>guía de VPS</a>) o con un Application/Network Load Balancer con certificado ACM
			— luego establece <code>relay.public_url</code> y reinicia.
		</li>
	</ol>

	<h2>Opción 2: Lightsail</h2>
	<p>
		Las instancias de Lightsail funcionan exactamente igual que la guía de EC2 — la pestaña de <strong>red</strong> contiene las
		reglas del cortafuegos: abre TCP <code>8080</code>.
	</p>

	<h2>Opción 3: ECS / Fargate (contenedor)</h2>
	<p>
		El <code>Dockerfile</code> del repositorio descarga el binario de release precompilado en el momento de la compilación:
	</p>
	<ol>
		<li>
			Sube la imagen a ECR:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Crea un servicio ECS (Fargate, 1 tarea) con un <strong>volumen EFS montado en
			<code>/data</code></strong> (persistencia LMDB — sin él, los datos se pierden en cada redespliegue).
		</li>
		<li>
			Expón el puerto <code>8080</code>; coloca delante un ALB + certificado ACM para TLS.
		</li>
		<li>
			La configuración integrada <code>deploy/nostrfy.container.toml</code> se puede reemplazar montando tu propio
			<code>nostrfy.toml</code> en <code>/etc/nostrfy/nostrfy.toml</code> (p. ej. un fork que lo copia en la imagen).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Asocia una <strong>Elastic IP</strong> a la instancia si la detienes/inicias — de lo contrario la IP pública
		cambia y <code>public_url</code> deja de ser válida.
	</p>

	<Callout type="note" title="TLS lo termina tu proxy o el proveedor">
		El relé sirve WebSocket sin cifrar en el puerto 8080 y respeta X-Forwarded-Proto.
	</Callout>
</div>
