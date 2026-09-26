<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const commonBlock = `# 1. Instale o binário da última release (sem sudo para a instalação em si)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Baixe o modelo de configuração e edite (sem clonar o repositório)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # defina name, public_url, private_key

# 3. Baixe a unit systemd e inicie o serviço
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Abra a porta (geralmente 8080) no firewall do provedor e verifique
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # obrigatório para NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # execute 'nostrfy genkey' e cole a chave`;
</script>

<DocsTitle
	title="Visão geral da implantação"
	description="Como o nostrfy é distribuído e como implantá-lo — Fly.io, AWS, Google Cloud, Azure, DigitalOcean ou qualquer VPS, com notas sobre TLS, systemd e contêineres."
/>

<div class="doc-body">
	<h2>Um binário, várias plataformas</h2>
	<p>
		O nostrfy oferece binários pré-compilados para <strong>x86_64</strong> e <strong>aarch64</strong> (artefatos de
		release do GitHub, verificados por checksum via <code>install.sh</code>), uma imagem de contêiner que
		<strong>baixa esses binários</strong> (sem necessidade de compilação) e guias de implantação para as principais
		plataformas.
	</p>

	<h2>Plataformas</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Plataforma</th>
				<th>Tipo</th>
				<th>Guia</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Plataforma gerenciada (contêineres, volumes, TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) ou App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail ou ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) ou Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM ou Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Qualquer VPS</strong></td>
				<td>Servidor Ubuntu/Debian padrão</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>O padrão comum para VMs</h2>
	<p>Todos os guias de VM (Digital Ocean, AWS EC2, GCP, Azure, qualquer VPS) seguem o mesmo padrão:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Antes de entrar em produção</h2>
	<p>
		Cada implantação usa as mesmas opções de <code>nostrfy.toml</code>. Antes de entrar em produção, defina pelo menos:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM ou contêiner?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong>: mais simples, mais barato, controle total. Recomendado para a maioria das
			implantações de relay.
		</li>
		<li>
			<strong>Contêiner</strong>: use o <code>Dockerfile</code> do repositório (baixa o binário de release no
			momento do build) na Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run ou Azure Container Apps. É
			necessário armazenamento persistente para os dados LMDB (<code>/data</code>).
		</li>
	</ul>

	<h2>Host de mídia Blossom</h2>
	<p>
		Se <code>blossom.host</code> estiver definido, aponte esse nome de host para a mesma porta no proxy TLS também
		(consulte os blocos nginx/Caddy no <a href={p('/docs/deploy/vps/')}>guia de VPS</a>).
	</p>

	<Callout type="warning" title="O TLS é terminado pelo seu proxy ou pelo provedor">
		O relay em si serve WebSocket simples na porta 8080 e respeita X-Forwarded-Proto.
	</Callout>
</div>
