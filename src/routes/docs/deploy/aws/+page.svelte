<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # Ubuntu: ubuntu@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # set name, public_url, private_key
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="AWS"
	description="Deploy nostrfy on AWS EC2, Lightsail or ECS/Fargate."
/>

<div class="doc-body">
	<p>
		Options: <strong>EC2</strong> (VM, recommended), <strong>Lightsail</strong> (simpler VM), or
		<strong>ECS/Fargate</strong> (containers).
	</p>

	<h2>Option 1: EC2 (recommended)</h2>
	<ol>
		<li>
			<strong>Launch an instance</strong>: Amazon Linux 2023 or Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 GB RAM) is enough to start. Choose a region close to your users.
		</li>
		<li>
			<strong>Security group</strong>: allow inbound TCP <code>8080</code> (and <code>443</code> for
			TLS). Limit the SSH rule to your IP.
		</li>
		<li>
			<strong>SSH in</strong> and follow the generic <a href="/docs/deploy/vps/">VPS guide</a>:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Verify</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>Add TLS (<code>wss://</code>)</strong> with certbot + nginx (as in the
			<a href="/docs/deploy/vps/">VPS guide</a>) or an Application/Network Load Balancer with an ACM
			certificate — then set <code>relay.public_url</code> and restart.
		</li>
	</ol>

	<h2>Option 2: Lightsail</h2>
	<p>
		Lightsail instances work exactly like the EC2 guide — the <strong>networking tab</strong> has the
		firewall rules: open TCP <code>8080</code>.
	</p>

	<h2>Option 3: ECS / Fargate (container)</h2>
	<p>
		The repository <code>Dockerfile</code> downloads the pre-built release binary at build time:
	</p>
	<ol>
		<li>
			Push the image to ECR:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Create an ECS service (Fargate, 1 task) with a <strong>mounted EFS volume at
			<code>/data</code></strong> (LMDB persistence — without it, data is lost on redeploys).
		</li>
		<li>
			Expose port <code>8080</code>; front it with an ALB + ACM certificate for TLS.
		</li>
		<li>
			The baked <code>deploy/nostrfy.container.toml</code> config can be overridden by mounting your
			own <code>nostrfy.toml</code> at <code>/etc/nostrfy/nostrfy.toml</code> (e.g. a fork that
			copies it into the image).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Attach an <strong>Elastic IP</strong> to the instance if you stop/start it — otherwise the public
		IP changes and <code>public_url</code> breaks.
	</p>

	<Callout type="note" title="TLS is terminated by your proxy or the provider">
		The relay itself serves plain WebSocket on 8080 and honors X-Forwarded-Proto.
	</Callout>
</div>