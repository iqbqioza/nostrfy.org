<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const vpsCmd = `ssh root@<droplet-ip>
curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # name, public_url, private_key setzen
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<droplet-ip>:8080/health`;
</script>

<DocsTitle
	title="Bereitstellung auf DigitalOcean"
	description="nostrfy auf einem DigitalOcean-Droplet oder der App Platform bereitstellen — Schritt für Schritt, mit systemd, TLS und einer produktionsreifen Konfiguration."
/>

<div class="doc-body">
	<p>
		Zwei Optionen: ein <strong>Droplet</strong> (VM, am einfachsten) oder die <strong>App Platform</strong>
		(Container).
	</p>

	<h2>Option 1: Droplet (empfohlen)</h2>
	<ol>
		<li>
			<strong>Droplet erstellen</strong>: Ubuntu 24.04 LTS, beliebige Größe (1 GB RAM reicht für den
			Anfang). Ein Droplet in einer Region in der Nähe Ihrer Nutzer senkt die Latenz.
		</li>
		<li>
			<strong>Per SSH verbinden</strong> und der allgemeinen
			<a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a> folgen:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="3">
		<li>
			<strong>Port öffnen</strong> in der Droplet-Firewall (die
			<a
				href="https://www.digitalocean.com/community/tutorials/how-to-configure-a-digitalocean-cloud-firewall"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOcean Cloud Firewall</a
			>
			wird empfohlen): eingehendes TCP <code>8080</code> erlauben (und <code>443</code>, falls Sie TLS
			hinzufügen).
		</li>
		<li>
			<strong>Überprüfen</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="5">
		<li>
			<strong>TLS (<code>wss://</code>) hinzufügen</strong> mit certbot + nginx oder
			<a
				href="https://docs.digitalocean.com/products/networking/load-balancers/"
				target="_blank"
				rel="noopener noreferrer"
			>
				DigitalOceans verwaltetem Load Balancer</a
			>
			mit Zertifikat — dann <code>relay.public_url = "wss://relay.example.com"</code> setzen und neu
			starten.
		</li>
	</ol>

	<h2>Option 2: App Platform (Container)</h2>
	<p>
		Die App Platform baut aus dem <code>Dockerfile</code> des Repositorys (das das vorgebaute
		Release-Binary herunterlädt):
	</p>
	<ol>
		<li><strong>GitHub-Repo verbinden</strong> und daraus eine App erstellen.</li>
		<li>
			<strong>Port</strong>: HTTP-Port auf <code>8080</code> setzen (der Relay lauscht dort).
		</li>
		<li>
			<strong>Persistente Platte</strong>: Volume unter <code>/data</code> einhängen (LMDB-Daten liegen
			dort — ohne sie gehen bei jeder Bereitstellung die Daten verloren).
		</li>
		<li>
			<strong>Env</strong>: Die ins Image eingebettete <code>deploy/nostrfy.container.toml</code> kann
			ersetzt werden, indem Sie Ihre eigene Konfiguration unter <code>/etc/nostrfy/nostrfy.toml</code> einhängen
			(einen Fork erstellen, der sie kopiert, oder ein Dockerfile-<code>COPY</code> im eigenen Repo verwenden).
		</li>
		<li>
			<strong>TLS</strong>: Die App Platform stellt <code>https://</code> für die App-Domain automatisch
			bereit — <code>relay.public_url</code> entsprechend setzen.
		</li>
	</ol>

	<h2>Beide Optionen</h2>
	<ul>
		<li>
			Updates: <code>install.sh</code> erneut ausführen + <code>systemctl restart nostrfy</code>
			(Droplet) oder in das verbundene Repo pushen (App Platform).
		</li>
		<li>
			Die gesamte Konfiguration ist in der
			<a href={p('/docs/configuration/')}>Konfigurationsreferenz</a> dokumentiert.
		</li>
	</ul>
</div>
