<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const vpsCmd = `ssh <user>@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # defina name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
</script>

<DocsTitle
	title="Implantar no Azure"
	description="Implante o nostrfy numa VM do Azure ou no Azure Container Apps — passo a passo, com systemd, TLS e as ressalvas dos IPs públicos dinâmicos."
/>

<div class="doc-body">
	<p>
		Opções: <strong>VM</strong> (recomendado) ou <strong>Container Apps</strong>.
	</p>

	<h2>Opção 1: Máquina virtual (recomendado)</h2>
	<ol>
		<li>
			<strong>Crie uma VM</strong>: Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 GB) ou
			<code>Standard_B2s</code> (2 GB) para começar. Escolha uma região próxima dos seus usuários.
		</li>
		<li>
			<strong>Grupo de segurança de rede (NSG)</strong>: adicione uma regra de entrada para TCP <code>8080</code>
			(e <code>443</code> para TLS). Restrinja a regra SSH ao seu IP.
		</li>
		<li>
			<strong>Conecte-se via SSH</strong> e siga o <a href={p('/docs/deploy/vps/')}>guia genérico de VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Verifique</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Adicione TLS (<code>wss://</code>)</strong> com certbot + nginx (como no
			<a href={p('/docs/deploy/vps/')}>guia de VPS</a>) ou com um Application Gateway do Azure com certificado.
		</li>
	</ol>

	<Callout type="note" title="O IP público de uma VM do Azure pode mudar ao desalocar">
		Use um <strong>IP público estático</strong> para que <code>relay.public_url</code> continue válido.
	</Callout>

	<h2>Opção 2: Azure Container Apps</h2>
	<p>
		O Container Apps compila a partir do <code>Dockerfile</code> do repositório (que baixa o binário
		release pré-compilado):
	</p>
	<ol>
		<li>
			<strong>Crie um Container App</strong> a partir do repositório GitHub (ou envie a imagem para o ACR).
		</li>
		<li>
			<strong>Porta</strong>: defina a porta do contêiner como <code>8080</code>.
		</li>
		<li>
			<strong>Memória</strong>: pelo menos 1 GB.
		</li>
		<li>
			<strong>Armazenamento persistente</strong>: monte um <strong>compartilhamento de arquivos do Azure Storage</strong> em
			<code>/data</code> para os dados LMDB.
		</li>
		<li>
			<strong>TLS</strong>: o Container Apps fornece <code>https://</code> na URL do app — defina
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (ou um domínio personalizado).
		</li>
	</ol>

	<Callout type="note" title="Um relay nunca deve escalar para zero">
		Defina <strong>min replicas = 1</strong>. O <code>deploy/nostrfy.container.toml</code> embutido pode
		ser substituído montando o seu próprio <code>nostrfy.toml</code> em <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
