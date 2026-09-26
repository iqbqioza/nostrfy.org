<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const vpsCmd = `ssh <user>@<public-ip>
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
</script>

<DocsTitle
	title="Bereitstellung auf Azure"
	description="nostrfy auf einer Azure-VM oder in Azure Container Apps bereitstellen — Schritt für Schritt, mit systemd, TLS und den Besonderheiten dynamischer öffentlicher IPs."
/>

<div class="doc-body">
	<p>
		Optionen: <strong>VM</strong> (empfohlen) oder <strong>Container Apps</strong>.
	</p>

	<h2>Option 1: Virtuelle Maschine (empfohlen)</h2>
	<ol>
		<li>
			<strong>VM erstellen</strong>: Ubuntu 24.04 LTS, <code>Standard_B1s</code> (1 GB) oder
			<code>Standard_B2s</code> (2 GB) zum Start. Wählen Sie eine Region in der Nähe Ihrer Nutzer.
		</li>
		<li>
			<strong>Netzwerksicherheitsgruppe (NSG)</strong>: Fügen Sie eine eingehende Regel für TCP <code>8080</code>
			(und <code>443</code> für TLS) hinzu. Beschränken Sie die SSH-Regel auf Ihre IP.
		</li>
		<li>
			<strong>Per SSH verbinden</strong> und der allgemeinen <a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a> folgen:
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
			<a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a>) oder mit einem Azure Application Gateway mit Zertifikat.
		</li>
	</ol>

	<Callout type="note" title="Die öffentliche IP einer Azure-VM kann sich bei Freigabe ändern">
		Verwenden Sie eine <strong>statische öffentliche IP</strong>, damit <code>relay.public_url</code> gültig bleibt.
	</Callout>

	<h2>Option 2: Azure Container Apps</h2>
	<p>
		Container Apps baut aus dem <code>Dockerfile</code> des Repositorys (das das vorgebaute
		Release-Binary herunterlädt):
	</p>
	<ol>
		<li>
			<strong>Container App erstellen</strong> aus dem GitHub-Repo (oder pushen Sie das Image nach ACR).
		</li>
		<li>
			<strong>Port</strong>: Setzen Sie den Container-Port auf <code>8080</code>.
		</li>
		<li>
			<strong>Arbeitsspeicher</strong>: mindestens 1 GB.
		</li>
		<li>
			<strong>Persistenter Speicher</strong>: Binden Sie eine <strong>Azure-Storage-Dateifreigabe</strong> unter
			<code>/data</code> für die LMDB-Daten ein.
		</li>
		<li>
			<strong>TLS</strong>: Container Apps stellt <code>https://</code> auf der App-URL bereit — setzen Sie
			<code>relay.public_url = "wss://&lt;app&gt;.&lt;region&gt;.azurecontainerapps.io"</code> (oder eine eigene Domain).
		</li>
	</ol>

	<Callout type="note" title="Ein Relay darf niemals auf null skalieren">
		Setzen Sie <strong>min replicas = 1</strong>. Das mitgelieferte <code>deploy/nostrfy.container.toml</code> kann
		ersetzt werden, indem Sie Ihre eigene <code>nostrfy.toml</code> unter <code>/etc/nostrfy/nostrfy.toml</code> einbinden.
	</Callout>
</div>
