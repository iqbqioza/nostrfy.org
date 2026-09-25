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
	title="Running the relay"
	description="Starting and stopping, logs and statistics, hot configuration reloads, multiple instances and large-scale tuning for your nostrfy relay."
/>

<div class="doc-body">
	<h2>Starting and stopping</h2>
	<p>Start the relay as a background daemon:</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>Or run it in the foreground, in the terminal:</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>Stop it with:</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>Verify it is up:</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>Logs and statistics</h2>
	<p>
		The daemon writes to <code>daemon.log_file</code>. When the file grows past <code>max_log_size_bytes</code>, it
		rotates automatically (<code>nostrfy.log.1</code>, <code>.2</code>, ... up to <code>max_log_files</code>
		generations):
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>The log level is controlled by the <code>RUST_LOG</code> environment variable (e.g. <code>RUST_LOG=debug</code>).</p>
	<h3>Statistics</h3>
	<p>Live statistics from the CLI:</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>Or over HTTP:</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>Shows connections, events accepted/rejected, DB size, and more.</p>
	<h3>Prometheus metrics</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>Hot reload (SIGHUP)</h2>
	<p>After editing the config file, reload it without a restart:</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Applies on reload</th>
				<th>Requires restart</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>relay identity, public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>most [limits], reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>api_host, metrics_enabled, LiveKit settings</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips, server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.* incl. search_index, blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>The log warns when a restart-required setting changed.</p>

	<h2>Running multiple instances</h2>
	<p>
		nostrfy supports several independent relays on one server (different ports). Each instance needs its own
		<code>server.port</code>, <code>[daemon]</code> <code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		(shared values make the second instance refuse to start with <code>already running</code>),
		<code>database.path</code>, and — when used — its own <code>api_host</code> / <code>blossom.host</code>:
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>Each instance is managed with its own config: <code>nostrfy --config /etc/nostrfy/a.toml start</code> etc.</p>

	<h2>Large-scale deployments</h2>
	<p>
		The relay is designed to scale to hundreds of thousands of connections on a single host — live delivery wakes only
		the subscribers that can match an event, and per-connection memory is kept small. Pushing into the millions
		requires host-level tuning:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Setting</th>
				<th>Value</th>
				<th>Why</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 2× the target connections (+1000)</td>
				<td>every connection holds an fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>pending accept queue for connection bursts</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>low (e.g. 10)</td>
				<td>reclaims TIME_WAIT sockets faster</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 or 2</td>
				<td>the LMDB map is a large sparse virtual reservation</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		On FreeBSD the same knobs are <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> plus
		<code>ulimit -n</code>, and <code>kern.ipc.somaxconn</code> replaces <code>net.core.somaxconn</code>.
		Per-connection kernel memory is ~80 KiB and user space ~10 KiB, so a million connections need roughly 90 GiB of
		kernel + user memory on top of the database.
	</p>

	<h2 id="throughput">Throughput (events per second)</h2>
	<p>
		Event ingestion is bound by two costs: the Schnorr signature check (about 30-50 µs per event) and the synchronous
		disk flush the LMDB writer performs after every commit batch. Both are tunable in <code>nostrfy.toml</code>:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Setting</th>
				<th>Why</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>commits into the OS page cache (microseconds); a power loss loses only the writes since the last flush — start here</td>
			</tr>
			<tr>
				<td>CPU cores ≥ 8 vCPU</td>
				<td>the batch EVENT path verifies signatures in parallel across cores</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>drops the NIP-50 word index write per event for write-heavy instances</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		The parallel signature check verifies every signature in a pending batch at once on a pool of worker threads
		(capped at 8; batches under 16 events verify inline). Each event's cheap checks still run first, so the reject
		reason text is identical to the sequential path — only the Schnorr work is spread across cores. A single-threaded
		build stays sequential.
	</p>

	<h2>Fixed anti-abuse bounds</h2>
	<p>
		A few hard bounds are fixed (not configurable) to keep the relay responsive under abuse:
	</p>
	<ul>
		<li>
			One filter carries at most <strong>512</strong> <code>ids</code>, <code>authors</code> or
			<code>kinds</code> entries; <code>#...</code> tag values share a separate <strong>512</strong>-value
			budget per filter. Larger filters are rejected (<code>CLOSED invalid: ...</code>).
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> tracks at most 10,000 source IPs; while full, unseen IPs
			are refused (fail closed).
		</li>
		<li>
			Event ids in <code>ids</code> filters may be prefixes, but only full 32-byte ids and even-length
			prefixes match (odd-length/empty entries are ignored for history and live delivery alike).
		</li>
		<li>
			Over-long index keys (tag values, content words, <code>d</code> tags beyond LMDB's key-size limit) are
			skipped at indexing time; the event is still stored.
		</li>
	</ul>
</div>