<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const vpsCmd = `ssh -i your-key.pem ec2-user@<public-ip>        # Unter Ubuntu: ubuntu@<public-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # name, public_url, private_key setzen
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<public-ip>:8080/health`;
	const ecrCmd = `docker buildx build --platform linux/amd64,linux/arm64 -t <account>.dkr.ecr.<region>.amazonaws.com/nostrfy .`;
</script>

<DocsTitle
	title="Bereitstellung auf AWS"
	description="nostrfy auf AWS EC2, Lightsail oder ECS/Fargate bereitstellen — Schritt für Schritt, mit systemd, TLS hinter einem Reverse-Proxy und einer Produktions-Checkliste."
/>

<div class="doc-body">
	<p>
		Optionen: <strong>EC2</strong> (VM, empfohlen), <strong>Lightsail</strong> (einfachere VM) oder
		<strong>ECS/Fargate</strong> (Container).
	</p>

	<h2>Option 1: EC2 (empfohlen)</h2>
	<ol>
		<li>
			<strong>Instanz starten</strong>: Amazon Linux 2023 oder Ubuntu 24.04 LTS,
			<code>t3.small</code> (2 GB RAM) reicht für den Anfang. Wählen Sie eine Region in der Nähe Ihrer Nutzer.
		</li>
		<li>
			<strong>Sicherheitsgruppe</strong>: eingehendes TCP <code>8080</code> (und <code>443</code> für
			TLS) erlauben. Begrenzen Sie die SSH-Regel auf Ihre IP.
		</li>
		<li>
			<strong>Per SSH verbinden</strong> und der allgemeinen <a href={p('/docs/deploy/vps/')}
				>VPS-Anleitung</a
			> folgen:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Überprüfen</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>TLS (<code>wss://</code>) hinzufügen</strong> mit certbot + nginx (wie in der
			<a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a>) oder mit einem Application/Network Load Balancer
			mit ACM-Zertifikat — dann <code>relay.public_url</code> setzen und neu starten.
		</li>
	</ol>

	<h2>Option 2: Lightsail</h2>
	<p>
		Lightsail-Instanzen funktionieren genau wie in der EC2-Anleitung — der <strong>Networking-Tab</strong> enthält die
		Firewall-Regeln: TCP <code>8080</code> öffnen.
	</p>

	<h2>Option 3: ECS / Fargate (Container)</h2>
	<p>
		Das <code>Dockerfile</code> im Repository lädt beim Build das vorgefertigte Release-Binary herunter:
	</p>
	<ol>
		<li>
			Image nach ECR pushen:
			<CodeBlock code={ecrCmd} lang="sh" />
		</li>
		<li>
			Einen ECS-Service (Fargate, 1 Task) mit <strong>gemountetem EFS-Volume unter
			<code>/data</code></strong> erstellen (LMDB-Persistenz — ohne sie gehen Daten bei erneuten Bereitstellungen verloren).
		</li>
		<li>
			Port <code>8080</code> exponieren; davor einen ALB + ACM-Zertifikat für TLS schalten.
		</li>
		<li>
			Die eingebettete Konfiguration <code>deploy/nostrfy.container.toml</code> kann überschrieben werden, indem Sie Ihre
			eigene <code>nostrfy.toml</code> unter <code>/etc/nostrfy/nostrfy.toml</code> mounten (z. B. ein Fork, der sie ins Image kopiert).
		</li>
	</ol>

	<h2>Elastic IP</h2>
	<p>
		Weisen Sie der Instanz eine <strong>Elastic IP</strong> zu, wenn Sie sie stoppen/starten — sonst ändert sich die öffentliche
		IP und <code>public_url</code> bricht.
	</p>

	<Callout type="note" title="TLS wird von Ihrem Proxy oder dem Anbieter terminiert">
		Das Relay selbst liefert plain WebSocket auf 8080 und beachtet X-Forwarded-Proto.
	</Callout>
</div>
