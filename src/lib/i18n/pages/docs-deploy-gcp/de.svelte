<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const vpsCmd = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
sudo mkdir -p /etc/nostrfy
sudo curl -fsSL -o /etc/nostrfy/nostrfy.toml \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.toml
sudo nano /etc/nostrfy/nostrfy.toml                 # name, public_url, private_key setzen
sudo curl -fsSL -o /etc/systemd/system/nostrfy.service \\
  https://raw.githubusercontent.com/iqbqioza/nostrfy/main/deploy/nostrfy.service
sudo systemctl daemon-reload
sudo systemctl enable --now nostrfy`;
	const verifyCmd = `curl http://<external-ip>:8080/health`;
</script>

<DocsTitle
	title="Bereitstellung auf Google Cloud"
	description="nostrfy auf Google Cloud Compute Engine oder Cloud Run bereitstellen — Schritt für Schritt, mit systemd, TLS und den Scale-to-Zero-Hinweisen."
/>

<div class="doc-body">
	<p>
		Optionen: <strong>Compute Engine</strong> (VM, empfohlen) oder <strong>Cloud Run</strong>
		(Container).
	</p>

	<h2>Option 1: Compute Engine (empfohlen)</h2>
	<ol>
		<li>
			<strong>VM erstellen</strong>: Ubuntu 24.04 LTS (oder Debian), <code>e2-small</code> (2 GB)
			reicht für den Anfang. Wählen Sie eine Region in der Nähe Ihrer Nutzer.
		</li>
		<li>
			<strong>Firewall-Regel</strong>: eingehendes TCP <code>8080</code> (und <code>443</code> für
			TLS) erlauben. Unter <strong>Netzwerk → Firewall</strong> eine Regel mit den Ziel-Tags
			erstellen, die Sie der VM zugewiesen haben.
		</li>
		<li>
			<strong>Per SSH verbinden</strong> (der SSH-Button der Konsole funktioniert) und der allgemeinen
			<a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a> folgen:
		</li>
	</ol>
	<CodeBlock code={vpsCmd} lang="sh" />
	<ol start="4">
		<li>
			<strong>Statische IP reservieren</strong> (Externe IP → Reservieren), damit
			<code>public_url</code> auch nach Neustarts gültig bleibt.
		</li>
		<li>
			<strong>Überprüfen</strong>:
		</li>
	</ol>
	<CodeBlock code={verifyCmd} lang="sh" />
	<ol start="6">
		<li>
			<strong>TLS (<code>wss://</code>) hinzufügen</strong> mit certbot + nginx (wie in der
			<a href={p('/docs/deploy/vps/')}>VPS-Anleitung</a>) oder einem GCP-Load-Balancer mit
			verwaltetem Zertifikat.
		</li>
	</ol>

	<h2>Option 2: Cloud Run (Container)</h2>
	<p>
		Cloud Run baut aus dem <code>Dockerfile</code> des Repositories (das das vorgebaute
		Release-Binary herunterlädt):
	</p>
	<ol>
		<li>
			<strong>Service aus dem GitHub-Repo erstellen</strong> (oder das Image in die Artifact
			Registry pushen).
		</li>
		<li>
			<strong>Port</strong>: Container-Port auf <code>8080</code> setzen.
		</li>
		<li>
			<strong>Speicher zuweisen</strong>: mindestens 512 MB (LMDB + Async-Runtime).
		</li>
		<li>
			<strong>Persistenter Speicher</strong>: ein <strong>Cloud-Run-Volume (filestore/gcsfuse)</strong>
			unter <code>/data</code> einhängen — LMDB benötigt ein Dateisystem, daher eignet sich ein
			GCS-FUSE-Mount unter <code>/data</code> für die Persistenz.
		</li>
		<li>
			<strong>TLS</strong>: Cloud Run stellt <code>https://</code> automatisch bereit — setzen Sie
			<code>relay.public_url = "wss://&lt;service&gt;.a.run.app"</code> (oder Ihre eigene Domain).
		</li>
	</ol>

	<Callout type="note" title="Cloud Run skaliert standardmäßig auf null">
		Für ein Relay <strong>min instances = 1</strong> setzen, damit es nie kalt wird. Die ins Image
		eingebettete <code>deploy/nostrfy.container.toml</code> kann ersetzt werden, indem Sie Ihre eigene
		<code>nostrfy.toml</code> unter <code>/etc/nostrfy/nostrfy.toml</code> mounten.
	</Callout>
</div>
