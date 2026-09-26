<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # defina name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Implantar no Google Cloud"
	description="Implante o nostrfy no Google Cloud Compute Engine ou Cloud Run — passo a passo, com systemd, TLS e as ressalvas de escala a zero."
/>

<div class="doc-body">
	<p>
		Opções: <strong>Compute Engine</strong> (VM, recomendado) ou <strong>Cloud Run</strong>
		(contêineres).
	</p>

	<h2>Opção 1: Compute Engine (recomendado)</h2>
	<ol>
		<li>
			<strong>Crie uma VM</strong>: Ubuntu 24.04 LTS (ou Debian), <code>e2-small</code> (2 GB) é
			suficiente para começar. Escolha uma região próxima aos seus usuários.
		</li>
		<li>
			<strong>Regra de firewall</strong>: permita TCP de entrada <code>8080</code> (e <code>443</code>
			para TLS). Em <strong>Rede → Firewall</strong>, crie uma regra com as tags de destino que você
			atribuiu à VM.
		</li>
		<li>
			<strong>Acesse via SSH</strong> (o botão SSH do console funciona) e siga o
			<a href={p('/docs/deploy/vps/')}>guia genérico de VPS</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Reserve um IP estático</strong> (IP externo → Reservar) para que o
			<code>public_url</code> continue válido após reinicializações.
		</li>
		<li>
			<strong>Verifique</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>Adicione TLS (<code>wss://</code>)</strong> com certbot + nginx (como no
			<a href={p('/docs/deploy/vps/')}>guia de VPS</a>) ou um balanceador de carga GCP com um
			certificado gerenciado.
		</li>
	</ol>

	<h2>Opção 2: Cloud Run (contêiner)</h2>
	<p>
		O Cloud Run compila a partir do <code>Dockerfile</code> do repositório (que baixa o binário
		pré-compilado da release):
	</p>
	<ol>
		<li>
			<strong>Crie um serviço a partir do repo do GitHub</strong> (ou envie a imagem para o Artifact
			Registry).
		</li>
		<li>
			<strong>Porta</strong>: defina a porta do contêiner como <code>8080</code>.
		</li>
		<li>
			<strong>Aloque memória</strong>: pelo menos 512 MB (LMDB + o runtime assíncrono).
		</li>
		<li>
			<strong>Armazenamento persistente</strong>: anexe um <strong>volume do Cloud Run
			(filestore/gcsfuse)</strong> em <code>/data</code> — o LMDB precisa de um sistema de arquivos,
			portanto uma montagem GCS FUSE em <code>/data</code> funciona para persistência.
		</li>
		<li>
			<strong>TLS</strong>: o Cloud Run fornece <code>https://</code> automaticamente — defina
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (ou seu domínio personalizado).
		</li>
	</ol>

	<Callout type="note" title="O Cloud Run escala para zero por padrão">
		Para um relay, defina <strong>min instances = 1</strong> para que ele nunca esfrie. O
		<code>deploy/nostrfy.container.toml</code> embutido na imagem pode ser substituído montando seu
		próprio <code>nostrfy.toml</code> em <code>/etc/nostrfy/nostrfy.toml</code>.
	</Callout>
</div>
