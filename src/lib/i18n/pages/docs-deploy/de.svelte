<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const commonBlock = `# 1. Neuestes Release-Binary installieren (für die Installation selbst ist kein sudo nötig)
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh

# 2. Konfigurationsvorlage laden und bearbeiten (kein Repository-Klon nötig)
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                   # name, public_url, private_key setzen

# 3. systemd-Unit laden und Dienst starten
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy

# 4. Port (in der Regel 8080) in der Firewall des Anbieters öffnen und prüfen
curl http://localhost:8080/health`;
	const relayConfig = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # erforderlich für NIP-42 AUTH / NIP-62 / NIP-98
private_key = ""                          # 'nostrfy genkey' ausführen und Schlüssel einfügen`;
</script>

<DocsTitle
	title="Bereitstellungsübersicht"
	description="Wie nostrfy verteilt wird und wie man es bereitstellt — Fly.io, AWS, Google Cloud, Azure, DigitalOcean oder ein beliebiger VPS, mit Hinweisen zu TLS, systemd und Containern."
/>

<div class="doc-body">
	<h2>Ein Binary, mehrere Plattformen</h2>
	<p>
		nostrfy liefert vorgefertigte Binaries für <strong>x86_64</strong> und <strong>aarch64</strong>
		(GitHub-Release-Artefakte, per Prüfsumme durch <code>install.sh</code> verifiziert), ein Container-Image, das
		diese Binaries <strong>herunterlädt</strong> (keine Kompilierung nötig), sowie Bereitstellungsanleitungen für die
		wichtigsten Plattformen.
	</p>

	<h2>Plattformen</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Plattform</th>
				<th>Typ</th>
				<th>Anleitung</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Fly.io</strong></td>
				<td>Verwaltete Plattform (Container, Volumes, TLS)</td>
				<td><a href={p('/docs/deploy/fly/')}>fly.md</a></td>
			</tr>
			<tr>
				<td><strong>Digital Ocean</strong></td>
				<td>Droplet (VM) oder App Platform</td>
				<td><a href={p('/docs/deploy/digitalocean/')}>deploy/digitalocean.md</a></td>
			</tr>
			<tr>
				<td><strong>AWS</strong></td>
				<td>EC2 (VM), Lightsail oder ECS</td>
				<td><a href={p('/docs/deploy/aws/')}>deploy/aws.md</a></td>
			</tr>
			<tr>
				<td><strong>Google Cloud</strong></td>
				<td>Compute Engine (VM) oder Cloud Run</td>
				<td><a href={p('/docs/deploy/gcp/')}>deploy/gcp.md</a></td>
			</tr>
			<tr>
				<td><strong>Azure</strong></td>
				<td>VM oder Container Apps</td>
				<td><a href={p('/docs/deploy/azure/')}>deploy/azure.md</a></td>
			</tr>
			<tr>
				<td><strong>Beliebiger VPS</strong></td>
				<td>Einfacher Ubuntu/Debian-Server</td>
				<td><a href={p('/docs/deploy/vps/')}>deploy/vps.md</a></td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Das gängige Muster für VMs</h2>
	<p>Alle VM-Anleitungen (Digital Ocean, AWS EC2, GCP, Azure, beliebiger VPS) folgen demselben Muster:</p>
	<CodeBlock code={commonBlock} lang="sh" />

	<h2>Vor dem Go-Live</h2>
	<p>
		Jede Bereitstellung verwendet dieselben <code>nostrfy.toml</code>-Optionen. Stellen Sie vor dem Go-Live mindestens Folgendes ein:
	</p>
	<CodeBlock code={relayConfig} lang="toml" />

	<h2>VM oder Container?</h2>
	<ul>
		<li>
			<strong>VM (systemd)</strong>: am einfachsten, am günstigsten, volle Kontrolle. Für die meisten
			Relay-Bereitstellungen empfohlen.
		</li>
		<li>
			<strong>Container</strong>: Verwende das <code>Dockerfile</code> aus dem Repository (lädt das
			Release-Binary zur Build-Zeit herunter) auf Fly.io, Digital Ocean App Platform, AWS ECS, GCP Cloud Run oder
			Azure Container Apps. Für die LMDB-Daten (<code>/data</code>) ist persistenter Speicher erforderlich.
		</li>
	</ul>

	<h2>Blossom-Medienhost</h2>
	<p>
		Wenn <code>blossom.host</code> gesetzt ist, leite diesen Hostnamen ebenfalls auf denselben Port im TLS-Proxy
		(siehe die nginx/Caddy-Blöcke in der <a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a>).
	</p>

	<Callout type="warning" title="TLS wird von Ihrem Proxy oder dem Anbieter terminiert">
		Das Relay selbst liefert plain WebSocket auf 8080 und beachtet X-Forwarded-Proto.
	</Callout>
</div>
