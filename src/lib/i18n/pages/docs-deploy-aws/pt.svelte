<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # No Ubuntu: ubuntu@<public-ip>
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
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="Implantar na AWS"
	description="Implante o nostrfy na AWS EC2, Lightsail ou ECS/Fargate — passo a passo, com systemd, TLS atrás de um proxy reverso e uma lista de verificação de produção."
/>

<div class="doc-body">
	<p>
		Opções: <strong>EC2</strong> (VM, recomendado), <strong>Lightsail</strong> (VM mais simples) ou
		<strong>ECS/Fargate</strong> (contêineres).
	</p>

	<h2>Opção 1: EC2 (recomendado)</h2>
	<ol>
		<li>
			<strong>Inicie uma instância</strong>: Amazon Linux 2023 ou Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 GB de RAM) é suficiente para começar. Escolha uma região próxima aos seus usuários.
		</li>
		<li>
			<strong>Grupo de segurança</strong>: permita TCP de entrada <code>8080</code> (e <code>443</code> para
			TLS). Limite a regra SSH ao seu IP.
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
			<a href={p('/docs/deploy/vps/')}>guia VPS</a>) ou com um Application/Network Load Balancer com certificado ACM
			— depois defina <code>relay.public_url</code> e reinicie.
		</li>
	</ol>

	<h2>Opção 2: Lightsail</h2>
	<p>
		Instâncias Lightsail funcionam exatamente como o guia EC2 — a aba de <strong>rede</strong> contém as
		regras de firewall: abra TCP <code>8080</code>.
	</p>

	<h2>Opção 3: ECS / Fargate (contêiner)</h2>
	<p>
		O <code>Dockerfile</code> do repositório baixa o binário de release pré-compilado no momento do build:
	</p>
	<ol>
		<li>
			Envie a imagem para o ECR:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Crie um serviço ECS (Fargate, 1 tarefa) com um <strong>volume EFS montado em
			<code>/data</code></strong> (persistência LMDB — sem ele, os dados são perdidos nas reimplantações).
		</li>
		<li>
			Exponha a porta <code>8080</code>; coloque na frente um ALB + certificado ACM para TLS.
		</li>
		<li>
			A configuração embutida <code>deploy/nostrfy.container.toml</code> pode ser substituída montando seu próprio
			<code>nostrfy.toml</code> em <code>/etc/nostrfy/nostrfy.toml</code> (p. ex. um fork que o copia para a imagem).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Associe um <strong>Elastic IP</strong> à instância se você pará-la/iniciá-la — caso contrário o IP público
		muda e o <code>public_url</code> quebra.
	</p>

	<Callout type="note" title="TLS é terminado pelo seu proxy ou pelo provedor">
		O relay serve WebSocket simples na 8080 e respeita X-Forwarded-Proto.
	</Callout>
</div>
