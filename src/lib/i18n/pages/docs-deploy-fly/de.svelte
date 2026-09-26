<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('de', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # in Clients via NIP-11 angezeigt
description = "A friendly relay for everyone"
private_key = "..."                            # erforderlich für NIP-29-Gruppen
public_url = "wss://<your-app-name>.fly.dev"   # erforderlich für NIP-42/62/98`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# Log-Zeile: "relay listening on ws://0.0.0.0:8080"
fly logs

# NIP-11-Informationsdokument über die öffentliche Adresse
curl https://<your-app-name>.fly.dev/

# Ihren Nostr-Client auf wss://<your-app-name>.fly.dev zeigen`;
</script>

<DocsTitle
	title="Auf Fly.io bereitstellen"
	description="nostrfy in wenigen Minuten auf Fly.io bereitstellen mit der fertigen Vorlage — Volumes, Machines, TLS-Terminierung und einfache Updates."
/>

<div class="doc-body">
	<h2>Was im Repo enthalten ist</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Datei</th>
				<th>Zweck</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					Container-Image — <strong>lädt das vorgefertigte Release-Binary</strong> aus den GitHub-Release-Assets (x86_64 / aarch64, je nach Build-Architektur) herunter und prüft seine sha256-Prüfsumme. Auf Fly findet keine Kompilierung statt
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Fly-App-Konfiguration: HTTP-Service auf Port 8080, Health-Checks, der <code>/data</code>-Volume-Mount, immer aktive Machines
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					Die Relay-Konfiguration, eingebettet im Image unter <code>/etc/nostrfy/nostrfy.toml</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Voraussetzungen</h2>
	<ul>
		<li>Ein Fly.io-Konto</li>
		<li>Die flyctl-CLI (<code>fly version</code>)</li>
		<li>Angemeldet: <code>fly auth login</code></li>
	</ul>

	<h2>Bereitstellung in vier Schritten</h2>

	<h3>1. App anlegen (noch ohne Bereitstellung)</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> muss auf Fly eindeutig sein (wird Teil der Relay-URL:
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>)
		</li>
		<li>
			<code>&lt;region&gt;</code>: z. B. <code>nrt</code> (Tokio), <code>fra</code>,
			<code>iad</code>, <code>sjc</code> — wählen Sie die Region in der Nähe Ihrer Nutzer
		</li>
		<li>
			Dies kann die <code>fly.toml</code>-Werte der Vorlage (App-Name, Region) überschreiben — das ist in Ordnung
		</li>
	</ul>

	<h3>2. Persistentes Volume erstellen</h3>
	<p>Die LMDB-Datenbank liegt auf einem Fly-Volume, gemountet unter <code>/data</code>:</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB reicht zum Start (die Datenbank wächst mit der Nutzung). Sie können später vergrößern oder gleich ein größeres Volume erstellen.
	</p>

	<h3>3. Relay konfigurieren</h3>
	<p>Bearbeiten Sie <code>deploy/nostrfy.container.toml</code> vor der Bereitstellung:</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>: lokal mit <code>nostrfy genkey</code> (gegen eine temporäre Konfiguration) erzeugen und einfügen, oder mit einem beliebigen Nostr-Tool erzeugen
		</li>
		<li>
			<code>public_url</code> <strong>muss</strong> mit Ihrem App-Namen übereinstimmen — ohne sie funktionieren NIP-42 AUTH, NIP-62 vanish und die NIP-86-Verwaltungs-API nicht
		</li>
		<li>Alles andere kann auf den Standardwerten bleiben</li>
	</ul>

	<h3>4. Bereitstellen</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly baut das Image (wenige Minuten — der Binary-Download ist schnell, das Image ist klein), erstellt eine Machine und führt den Health-Check gegen <code>/health</code> aus.
	</p>

	<h2>Überprüfen</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>Skalierung und Updates</h2>
	<ul>
		<li>
			<strong>Relay aktualisieren</strong>: <code>deploy/nostrfy.container.toml</code> bearbeiten und erneut <code>fly deploy</code> — das Image lädt immer das <strong>neueste</strong> GitHub-Release-Binary, ein Update ist also ein einfaches erneutes Bereitstellen
		</li>
		<li>
			<strong>Version pinnen</strong>: <code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code> oder das <code>ARG</code> im Dockerfile ändern
		</li>
		<li>
			<strong>Skalieren</strong>: Standard ist eine einzelne Machine. <code>fly machines clone &lt;id&gt;</code> erstellt eine zweite Machine; beide teilen sich das Volume (Fly-Volumes unterstützen mehrere Machines in derselben Region)
		</li>
		<li>
			<strong>Metriken</strong>: Fly sammelt den <code>/metrics</code>-Endpunkt (siehe <code>[metrics]</code> in <code>fly.toml</code>) und zeigt ihn im Fly-Dashboard unter Metrics
		</li>
	</ul>

	<h2>Konfiguration anpassen</h2>
	<p>
		Das Image liest <code>/etc/nostrfy/nostrfy.toml</code>, eingebettet aus <code>deploy/nostrfy.container.toml</code>. Zwei Möglichkeiten zur Anpassung:
	</p>
	<ol>
		<li>
			<strong><code>deploy/nostrfy.container.toml</code> im Repository bearbeiten</strong> und erneut bereitstellen (am einfachsten)
		</li>
		<li>
			<strong>Eigene Konfiguration mounten</strong>: einen Fork des Images bauen, der Ihre Konfigurationsdatei über <code>/etc/nostrfy/nostrfy.toml</code> kopiert
		</li>
	</ol>
	<p>Jede Option ist in der <a href={p('/docs/configuration/')}>Konfigurationsreferenz</a> dokumentiert.</p>

	<h2>Hinweise</h2>
	<ul>
		<li>
			<strong>Immer aktiv per Design</strong>: <code>auto_stop_machines = false</code> in <code>fly.toml</code> — ein Relay darf im Leerlauf nie gestoppt werden
		</li>
		<li>
			Der Container führt das Relay im <strong>Vordergrundmodus</strong> aus (<code>nostrfy start --foreground</code>); Logs gehen nach stdout/stderr und werden von Fly gesammelt
		</li>
		<li>
			TLS wird von Fly terminiert; das Relay selbst liefert plain WebSocket auf Port 8080
		</li>
		<li>
			<strong>Blossom-Media-Host</strong>: um auch den Blossom-Server zu betreiben, setzen Sie <code>blossom.host = "media.example.com"</code> in der Konfiguration, fügen Sie <code>media.example.com</code> als <strong>zusätzlichen Hostnamen</strong> derselben Fly-App hinzu (<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> oder <code>fly hostnames</code>), und fügen Sie das <code>media.</code>-TLS-Zertifikat im Fly-Dashboard hinzu — das Relay trennt die Hosts intern (wie <code>server.api_host</code>)
		</li>
	</ul>

	<Callout type="note" title="TLS wird von Fly terminiert">
		Das Relay selbst liefert plain WebSocket auf Port 8080.
	</Callout>
</div>
