<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # defina name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Implantar na DigitalOcean"
	description="Implante o nostrfy em um Droplet da DigitalOcean ou na App Platform — passo a passo, com systemd, TLS e uma configuração pronta para produção."
/>

<div class="doc-body">
	<p>
		Duas opções: um <strong>Droplet</strong> (VM, o mais simples) ou a <strong>App Platform</strong>
		(contêineres).
	</p>

	<h2>Opção 1: Droplet (recomendado)</h2>
	<ol>
		<li>
			<strong>Crie um Droplet</strong>: Ubuntu 24.04 LTS, qualquer tamanho (1 GB de RAM é suficiente para
			começar). Um Droplet em uma região próxima aos seus usuários reduz a latência.
		</li>
		<li>
			<strong>Acesse via SSH</strong> e siga o
			<a href={p('/docs/deploy/vps/')}>guia genérico de VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Abra a porta</strong> no firewall do Droplet (o
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>
			é recomendado): permita o TCP de entrada <code>8080</code> (e <code>443</code> se adicionar TLS).
		</li>
		<li>
			<strong>Verifique</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Adicione TLS (<code>wss://</code>)</strong> com certbot + nginx, ou
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				o balanceador de carga gerenciado da DigitalOcean</a
			>
			com um certificado — em seguida defina <code>relay.public_url = "wss://relay.example.com"</code> e
			reinicie.
		</li>
	</ol>

	<h2>Opção 2: App Platform (contêiner)</h2>
	<p>
		A App Platform compila a partir do <code>Dockerfile</code> do repositório (que baixa o binário de
		release pré-compilado):
	</p>
	<ol>
		<li><strong>Conecte seu repositório do GitHub</strong> e crie um app a partir dele.</li>
		<li>
			<strong>Porta</strong>: defina a porta HTTP para <code>8080</code> (o relay escuta nela).
		</li>
		<li>
			<strong>Disco persistente</strong>: monte um volume em <code>/data</code> (os dados LMDB ficam lá —
			sem ele, os dados são perdidos a cada implantação).
		</li>
		<li>
			<strong>Env</strong>: o arquivo <code>deploy/nostrfy.container.toml</code> embutido na imagem pode
			ser substituído montando sua própria configuração em <code>/etc/nostrfy/nostrfy.toml</code> (crie um
			fork que o copie, ou use um <code>COPY</code> no Dockerfile do seu próprio repo).
		</li>
		<li>
			<strong>TLS</strong>: a App Platform fornece <code>https://</code> automaticamente para o domínio do
			app — defina <code>relay.public_url</code> de acordo.
		</li>
	</ol>

	<h2>Ambas as opções</h2>
	<ul>
		<li>
			Atualizações: execute novamente <code>install.sh</code> + <code>systemctl restart nostrfy</code>
			(Droplet), ou faça push para o repositório conectado (App Platform).
		</li>
		<li>
			Toda a configuração está documentada na
			<a href={p('/docs/configuration/')}>referência de configuração</a>.
		</li>
	</ul>
</div>
