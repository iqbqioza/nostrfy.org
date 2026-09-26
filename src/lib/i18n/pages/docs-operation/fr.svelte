<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="Exploiter le relais"
	description="Pour votre relais nostrfy : démarrage et arrêt, journaux et statistiques, rechargement à chaud de la configuration, instances multiples et réglage à grande échelle."
/>

<div class="doc-body">
	<h2>Démarrage et arrêt</h2>
	<p>Démarrez le relais en démon d’arrière-plan :</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>Ou exécutez-le au premier plan dans le terminal :</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Arrêter :</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Vérifiez qu’il est en marche :</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Journaux et statistiques</h2>
	<p>
		Le démon écrit dans <code>daemon.log_file</code>. Lorsque le fichier dépasse <code>max_log_size_bytes</code>, il subit automatiquement une rotation (<code>nostrfy.log.1</code>, <code>.2</code>… jusqu’à <code>max_log_files</code> générations) :
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>Le niveau de journalisation est contrôlé par la variable d’environnement <code>RUST_LOG</code> (par ex. <code>RUST_LOG=debug</code>).</p>
	<h3>Statistiques</h3>
	<p>Statistiques en direct depuis la CLI :</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>Ou via HTTP :</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Affiche les connexions, les événements acceptés/refusés, la taille de la base et plus.</p>
	<h3>Métriques Prometheus</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Rechargement à chaud (SIGHUP)</h2>
	<p>Après avoir modifié le fichier de configuration, rechargez-le sans redémarrage :</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Appliqué au rechargement</th>
				<th>Redémarrage requis</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Identité du relais, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>la plupart des limites, reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, réglages LiveKit</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* (y compris search_index), blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Le journal avertit lorsqu’un réglage nécessitant un redémarrage a changé.</p>

	<h2>Exécuter plusieurs instances</h2>
	<p>
		nostrfy prend en charge plusieurs relais indépendants sur un même serveur (ports différents). Chaque instance a besoin de son propre
		<code>server.port</code>, <code>[daemon]</code>
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		(des valeurs partagées font que la seconde instance refuse de démarrer avec <code>already running</code>),
		<code>database.path</code> ainsi que (si utilisés) leurs propres <code>api_host</code> / <code>blossom.host</code> :
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Chaque instance est gérée avec sa propre configuration : <code>nostrfy --config /etc/nostrfy/a.toml start</code> et plus.</p>

	<h2>Déploiements à grande échelle</h2>
	<p>
		Le relais est conçu pour monter à des centaines de milliers de connexions sur un seul hôte — la diffusion live ne réveille que les abonnés pouvant correspondre et la mémoire par connexion reste faible. Pour atteindre le million, un réglage au niveau de l’hôte est nécessaire :
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Réglage</th>
				<th>Valeur</th>
				<th>Raison</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× les connexions visées (+1000)</td>
				<td>chaque connexion occupe un fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>File d’accept en attente lors des pics de connexions</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>faible (par ex. 10)</td>
				<td>Libère plus vite les sockets TIME_WAIT</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 ou 2</td>
				<td>La carte LMDB est une grande réservation virtuelle creuse</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Sous FreeBSD, les paramètres correspondants sont <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> plus
		<code>ulimit -n</code> ainsi que <code>kern.ipc.somaxconn</code> remplace <code>net.core.somaxconn</code>. La mémoire noyau par connexion est d’environ 80 KiB, l’espace utilisateur d’environ 10 KiB : un million de connexions demande donc environ 90 GiB de mémoire noyau + utilisateur en plus de la base.
	</p>

	<h2 id="throughput">Débit (événements par seconde)</h2>
	<p>
		L’écriture des événements est limitée par deux coûts : la vérification de signature Schnorr (environ 30 à 50 µs par événement) et le vidage disque synchrone effectué par l’écrivain LMDB après chaque lot de commits. Les deux se règlent dans le fichier <code>nostrfy.toml</code> :
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Réglage</th>
				<th>Raison</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>Commit dans le cache de pages de l’OS (microsecondes) ; une coupure de courant ne perd que les écritures depuis le dernier vidage — commencez par là</td>
			</tr>
			<tr>
				<td>Cœurs CPU ≥ 8 vCPU</td>
				<td>Le chemin EVENT par lots vérifie les signatures en parallèle sur les cœurs</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>Supprime l’écriture de l’index de mots NIP-50 par événement pour les instances à forte écriture</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		La vérification parallèle des signatures vérifie toutes les signatures d’un lot en attente d’un coup, sur un pool de threads (plafonné à 8 ; les lots de moins de 16 événements sont vérifiés en ligne). Les contrôles peu coûteux passent toujours en premier, donc le texte de rejet est identique au chemin séquentiel — seul le travail Schnorr est réparti sur les cœurs. Une compilation mono-thread reste séquentielle.
	</p>

	<h2>Limites anti-abus fixes</h2>
	<p>
		Quelques limites strictes sont fixes (non configurables) pour que le relais reste réactif sous abus :
	</p>
	<ul>
		<li>
			Un filtre contient au plus <strong>512</strong> entrées <code>ids</code>, <code>authors</code> ou
			<code>kinds</code> ; les valeurs de tags <code>#...</code> disposent d’un budget séparé de <strong>512</strong>
			valeurs. Les filtres plus grands sont refusés (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> suit au plus 10 000 IP sources ; une fois plein, les IP inédites sont refusées (fail closed).
		</li>
		<li>
			Les <code>ids</code> des filtres peuvent être des préfixes, mais seuls les id complets de 32 octets et les préfixes de longueur paire correspondent (les entrées impaires/vides sont ignorées en historique comme en diffusion live).
		</li>
		<li>
			Les clés d’index trop longues (valeurs de tags, mots du contenu, tags <code>d</code> au-delà de la limite de taille de clé LMDB) sont ignorées à l’indexation ; l’événement est tout de même stocké.
		</li>
	</ul>
</div>
