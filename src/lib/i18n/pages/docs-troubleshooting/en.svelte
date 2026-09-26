<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# Change port = 8080 in the config file, then:
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# If nostrfy is running, restart it
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Remove a stale pid file if present
rm -f nostrfy.pid`;
	const tomlExample = `# Correct examples
name = "my relay"        # strings are quoted with "
port = 8080              # numbers are plain
enabled_nips = [1, 50]   # lists are wrapped in [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# From outside (using the server's IP/port)
curl http://YOUR_SERVER_IP:8080/health

# Check the firewall (example: ufw)
sudo ufw status
# Open the port if needed
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" in bytes`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Also back up [blossom].local_path when using local Blossom storage.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Troubleshooting"
	description="The errors you are most likely to meet — ports, permissions, TLS, missing NIPs, publishing and timeouts — with step-by-step fixes."
/>

<div class="doc-body">
	<p><strong>Three things to check first:</strong></p>
	<ul>
		<li><code>nostrfy check</code> validates your config (most errors are config mistakes).</li>
		<li><code>tail -f nostrfy.log</code> shows the log — the cause is almost always there.</li>
		<li><code>nostrfy restart</code> restarts the daemon cleanly.</li>
	</ul>

	<h2 id="cannot-start">Cannot start</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Cause:</strong> Port 80 can only be bound by root.</p>
	<p><strong>Fix:</strong> Run with <code>sudo</code>, or change the port to something like 8080.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Cause:</strong> Another process (an old nostrfy or a different server) is already using
		the port.
	</p>
	<p><strong>Fix:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Cause:</strong> nostrfy is already running; <code>start</code> refuses to start a second
		instance.
	</p>
	<p><strong>Fix:</strong> Use <code>nostrfy restart</code>, or just use the running instance.</p>

	<h3><code>nostrfy stop</code> hangs / <code>did not stop in time</code></h3>
	<p><strong>Cause:</strong> The daemon is stuck or not responding.</p>
	<p><strong>Fix:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Cause:</strong> The config file is not valid TOML. Common mistakes: forgetting quotes around
		a string, or writing the same key twice.
	</p>
	<p><strong>Fix:</strong> The error message includes a line number. Check and fix that line.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Cause:</strong> The config file does not exist.</p>
	<p><strong>Fix:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Cause:</strong> <code>relay.private_key</code> is not a valid 64-character hex key.
	</p>
	<p>
		<strong>Fix:</strong> Run <code>nostrfy genkey</code> to generate a correct key (or set
		<code>private_key = ""</code>).
	</p>

	<h3>Lots of warnings in the log at startup</h3>
	<p><code>[WARN]</code> log lines tell you about configuration problems. The main ones:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Warning</th>
				<th>Meaning and fix</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> is not set — NIP-42 auth, NIP-62 vanish and NIP-98 admin auth
					will not work. Set <code>wss://your-public-url</code>.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>Groups need a secret key. Run <code>nostrfy genkey</code>.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>An unused legacy key (or a typo) in the config. Check the key name.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					A typo in a section name (e.g. <code>[serve]</code> instead of <code>[server]</code>).
					Fix it.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>This combination locks everyone out. Change one of the two.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					The PoW requirement is so high nobody can post. Lower <code>require_pow</code>.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">Cannot connect or behaves strangely</h2>

	<h3>Client gets <code>connection refused</code></h3>
	<p>
		<strong>Cause:</strong> The relay is not running, or a firewall is blocking the port.
	</p>
	<p><strong>Fix:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>External clients cannot connect, local ones can</h3>
	<p>
		<strong>Cause:</strong> <code>server.host</code> is still <code>127.0.0.1</code> (the default),
		which only accepts local connections.
	</p>
	<p>
		<strong>Fix:</strong> Set <code>host = "0.0.0.0"</code> in the config and restart.
	</p>

	<h3>Cannot connect through a Cloudflare tunnel</h3>
	<p>When using Cloudflare Tunnel:</p>
	<ul>
		<li>
			The relay runs plain HTTP; Cloudflare terminates TLS, so clients use <code>wss://</code>. Set
			<code>public_url = "wss://..."</code> on the relay (this makes NIP-42 auth work).
		</li>
		<li>
			Cloudflare adds an <code>X-Forwarded-Proto</code> header. nostrfy treats
			<code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> values the same, so no
			extra configuration is normally needed.
		</li>
	</ul>

	<h3><code>error: message too large</code> and the connection closes</h3>
	<p>
		<strong>Cause:</strong> A single message exceeds <code>max_ws_message_bytes</code> (default 1 MB).
	</p>
	<p>
		<strong>Fix:</strong> Raise <code>limits.max_ws_message_bytes</code> if you need larger events — but
		also check the client's own limits.
	</p>

	<h3><code>too many subscriptions</code> / <code>too many filters</code> errors</h3>
	<p>
		<strong>Cause:</strong> The per-connection caps were reached (subscriptions default 20, filters
		default 20).
	</p>
	<p>
		<strong>Fix:</strong> Raise <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> (and check the client settings).
	</p>

	<h3>New connections are refused under load</h3>
	<p>
		<strong>Cause:</strong> <code>max_connections</code> (default 10000) was reached, the per-IP cap
		(<code>max_connections_per_ip</code>, default 64) kicked in, or the per-second connection rate limit
		(<code>max_connections_per_sec_per_ip</code>) refused the burst. The caps apply to every connection —
		WebSocket and plain HTTP alike.
	</p>
	<p>
		<strong>Fix:</strong> Review and adjust the settings. <code>max_connections_per_ip = 0</code> disables
		the per-IP cap; <code>max_connections_per_sec_per_ip = 0</code> disables the rate limit. These three
		settings require a restart.
	</p>

	<h3>Connections drop after a while</h3>
	<p>
		<strong>Cause:</strong> If <code>ws_idle_timeout_secs</code> is set, idle connections are closed.
		Healthy clients answer the relay's PING with a PONG and stay connected; only dead peers are reaped.
	</p>
	<p>
		<strong>Fix:</strong> This is intentional — the default is 300 seconds. Set
		<code>ws_idle_timeout_secs = 0</code> to disable it entirely.
	</p>

	<h3>A subscription ends with <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Cause:</strong> The stored events of one REQ exceeded <code>max_req_response_bytes</code>
		(default 32 MiB). Only happens with very large events or very wide filters.
	</p>
	<p>
		<strong>Fix:</strong> Narrow the filter (tighter <code>since</code>/<code>until</code>, a lower
		<code>limit</code>) or raise <code>max_req_response_bytes</code> (0 disables the budget).
	</p>

	<h3>A NIP is missing from the NIP-11 <code>supported_nips</code> list</h3>
	<p>
		<strong>Cause:</strong> The advertised list is dynamic — a NIP is hidden when all the kinds it
		defines are rejected: they are all in <code>blocked_kinds</code>, none of them is in
		<code>allowed_kinds</code>, or they are ephemeral kinds rejected by <code>reject_ephemeral</code>.
		NIP-29/43/66 additionally require <code>relay.private_key</code> and NIP-86 requires
		<code>rpc.management_token</code> or <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Fix:</strong> Check the active access lists — NIP-86 <code>listallowedkinds</code> shows the
		kind allowlist, and <code>GET /</code> shows the effective <code>supported_nips</code> immediately.
		Remove the blocking kind or the <code>reject_ephemeral</code> setting.
	</p>

	<h2 id="publishing">Errors when publishing</h2>
	<p>
		When publishing fails, the 4th element of the <code>OK</code> message explains why. The common ones:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Error</th>
				<th>Meaning and fix</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>The event signature is invalid (possibly a broken client key).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					Content exceeds <code>max_content_bytes</code> (default 64K characters). Shorten it or
					raise the limit.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>More tags than <code>max_tags</code> (default 2000).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Timestamp too far in the future (beyond <code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					The content or tags contain an nsec-looking string.
					<strong>Never post secret keys.</strong> Remove the string and the event is accepted.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>The same event is already stored (normal).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>The pubkey is banned (<code>banpubkey</code>) or outside the allowlist.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>This kind is disallowed.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					The pubkey exceeded <code>max_events_per_min_per_pubkey</code> (sliding 60-second
					window). Wait a minute and retry, or raise/disable the limit.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>The event id is banned.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Re-publishing a deleted event.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					Authentication is required (when <code>relay.require_auth</code> is on).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					The account was created within <code>new_pubkey_min_age_secs</code>. Wait and retry.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>The group does not exist (create it first).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					The group is <code>closed</code>; join requests without an invite code are not honored.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Blossom file server</h2>

	<h3>Upload fails with <code>401</code></h3>
	<p>The upload authorization event (kind 24242) was rejected. Check that:</p>
	<ul>
		<li>
			the token's <code>expiration</code> tag is <strong>present</strong> and set to a unix timestamp
			in the future,
		</li>
		<li>for upload/media/delete the token carries an <code>x</code> tag with the blob's sha256,</li>
		<li>
			the <code>server</code> tag (when present) names exactly the configured <code>blossom.host</code>
			(hostname only, no scheme/path),
		</li>
		<li>the token was signed within the last 10 minutes (a freshness window against replay),</li>
		<li>and the signing key is the uploader's own.</li>
	</ul>

	<h3>Upload fails with <code>403</code></h3>
	<p>
		<code>blossom.restrict_uploads = true</code> is set and the pubkey is not on the allowlist — add it
		with <code>nostrfy blossom allow npub1...</code> (the daemon reloads automatically). If the list looks
		wrong, <code>nostrfy blossom list</code> shows it.
	</p>

	<h3>Upload fails with <code>409</code></h3>
	<p>
		The client sent an <code>X-SHA-256</code> header that does not match the actual request body (the
		declared hash was computed over different bytes — e.g. the file changed between hashing and sending).
		Clients may omit the header entirely.
	</p>

	<h3><code>GET /</code> on the media host serves the NIP-11 document</h3>
	<p>
		The request did not reach the relay with the Blossom Host header. Point <code>media.example.com</code>
		(or whatever <code>blossom.host</code> is set to) at the same port in the reverse proxy, then
		<code>nostrfy restart</code>.
	</p>

	<h3>A blob 404s right after upload</h3>
	<p>
		The file is content-addressed by its SHA-256: fetch it via the exact hash returned in the upload
		response (<code>/&lt;sha256&gt;</code> or <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). A mismatch means
		the client requested a different hash than the bytes it sent.
	</p>

	<h2 id="search-groups-auth">Search, groups and auth</h2>

	<h3>Search returns 0 results / unexpected results</h3>
	<p>nostrfy search matches <strong>whole words</strong>. Note that:</p>
	<ul>
		<li>
			<code>search = "rust"</code> matches events containing the word "rust", but <code>"ru"</code>
			does NOT match "rust" as a substring.
		</li>
		<li>Only words in the event content are searched.</li>
		<li>If <code>search_index = false</code>, search still works but is slower.</li>
		<li>
			If NIP-50 is disabled (<code>disabled_nips = [50]</code>), <code>search</code> is ignored
			(a NOTICE is sent).
		</li>
	</ul>

	<h3>Group metadata (39000-39005) is not generated</h3>
	<p>
		<strong>Cause:</strong> <code>relay.private_key</code> is not set. Group snapshots are signed by the
		relay's own key, so without it nothing is generated.
	</p>
	<p><strong>Fix:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> rejects group events</h3>
	<p>
		<strong>Cause:</strong> The group does not exist. In NIP-29, moderation events and join requests
		(9021) cannot target a group before it is created (kind 9007).
	</p>
	<p><strong>Fix:</strong> Create the group with a 9007 event first.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Cause:</strong> Moderation (adding members, etc.) requires an admin (a member with a role).
		The creator is an admin.
	</p>
	<p><strong>Fix:</strong> Ask an admin to grant you a role, or create your own group.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Cause:</strong> The group is <code>closed</code>; join requests without an invite code are
		not auto-approved.
	</p>
	<p><strong>Fix:</strong> Ask an admin for an invite code (9009) and join with a <code>code</code> tag.</p>

	<h3>Accidentally left a group, or the group has no admins</h3>
	<p>
		<strong>Cause:</strong> NIP-29 leave requests (kind 9022) are honored for any member — including the
		group's last admin, who leaves no admins behind. With no admin, nobody can send moderation events
		(9000/9001/9002/9008) anymore.
	</p>
	<p>
		<strong>Fix:</strong> Sign a moderation event with the relay's own key (<code>relay.private_key</code>,
		the pubkey advertised as NIP-11 <code>self</code>). Per NIP-29, moderation events may come from "the
		relay master key or ... group admins", so the relay accepts group moderation signed by its own key even
		when the group has no admins. For example, restore an admin with a <code>kind:9000</code>:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Sign and publish it with the relay key. Alternatively, delete the group with a relay-signed
		<code>kind:9008</code> (its stored events are purged) and re-create it with <code>kind:9007</code>.
		This recovery needs <code>relay.private_key</code> to be configured.
	</p>

	<h3>Protected events are rejected with <code>auth-required</code></h3>
	<p>
		<strong>Cause:</strong> NIP-70 protected events (with a <code>-</code> tag) may only be published by
		the authenticated author <strong>on the same connection</strong>.
	</p>
	<p><strong>Fix:</strong> Enable NIP-42 auth in the client before publishing.</p>

	<h3>AUTH (NIP-42) returns <code>false</code></h3>
	<p>Common causes:</p>
	<ol>
		<li>
			<code>relay.public_url</code> is unset or wrong — the AUTH event's <code>relay</code> tag does not
			match the relay's URL. Set <code>wss://...</code> and restart.
		</li>
		<li>Stale challenge — you sent AUTH on a different connection, or reused an old challenge.</li>
		<li>
			The client clock is off — the AUTH event's <code>created_at</code> must be within ±10 minutes of
			now.
		</li>
	</ol>

	<h3>NIP-86 management API returns <code>401 unauthorized</code></h3>
	<p><strong>Cause:</strong> Missing or wrong credentials.</p>
	<p><strong>Fix:</strong></p>
	<ul>
		<li>Set <code>management_token</code> and send <code>Authorization: Bearer &lt;token&gt;</code>.</li>
		<li>
			Or set <code>admin_pubkey</code> and send a NIP-98 auth event (the <code>u</code> tag must match
			the relay URL exactly; a <code>payload</code> tag is required).
		</li>
		<li>If neither is set, the management API is disabled entirely.</li>
	</ul>

	<h3>NIP-98 auth events are rejected for a different scheme or port</h3>
	<p>
		The NIP-98 spec says the <code>u</code> tag must be <em>exactly</em> the same as the absolute request
		URL, so nostrfy derives the expected URL from <code>relay.public_url</code>: its authority plus the
		HTTP scheme mapped from the WebSocket scheme (<code>wss://</code> → <code>https://</code>,
		<code>ws://</code> → <code>http://</code>, <code>nostr+</code> stripped). Without
		<code>public_url</code> the relay expects the plain <code>http://host:port</code> it serves. A tag with
		another scheme, a different/omitted port, or a different path or query is rejected — set
		<code>relay.public_url</code> to the public address clients sign. Each auth event is also
		<strong>single-use</strong>: replaying the same <code>Authorization</code> header within its 60-second
		validity window is refused.
	</p>

	<h2 id="db-disk">Database and disk</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Cause:</strong> The LMDB memory-map ceiling (default 1 TB of virtual address space; actual
		disk usage grows with data) was reached — effectively, the database is full.
	</p>
	<p><strong>Fix:</strong> Raise <code>database.max_map_size</code> and restart.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Cause:</strong> Less than 32 MB of free disk space. Writes stop (to protect the data); reads
		continue.
	</p>
	<p>
		<strong>Fix:</strong> Free up disk space. Writes resume automatically once space is available.
		(<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> reports <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Cause:</strong> <code>database.map_size</code> is larger than <code>max_map_size</code>.
	</p>
	<p>
		<strong>Fix:</strong> Set <code>map_size</code> at or below <code>max_map_size</code> (the defaults
		are fine).
	</p>

	<h3>Checking the database size</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Backing up / moving the database</h3>
	<p>
		All data lives in the <code>database.path</code> directory.
		<strong>Stop the relay before copying</strong> (copying a live database can corrupt it).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Daemon operation</h2>

	<h3><code>nostrfy stats</code> says <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Cause:</strong> The stats file does not exist — the daemon is not running, or it started less
		than a few seconds ago.
	</p>
	<p><strong>Fix:</strong> Run <code>nostrfy start</code>, wait a few seconds, and try again.</p>

	<h3>The log grows without bound</h3>
	<p>
		<strong>Cause:</strong> <code>max_log_size_bytes</code> is 0 (rotation disabled).
	</p>
	<p>
		<strong>Fix:</strong> Set <code>max_log_size_bytes = 52428800</code> (50 MB) and
		<code>max_log_files = 5</code>. Rotation is automatic.
	</p>

	<h3>Changes to the config do not take effect after reload</h3>
	<p>
		<strong>Cause:</strong> You reloaded (SIGHUP) settings that are fixed at startup:
		<code>private_key</code>, <code>api_host</code>, <code>metrics_enabled</code>, LiveKit settings, and
		the NIP enable/disable lists.
	</p>
	<p>
		<strong>Fix:</strong> Use <code>nostrfy restart</code>. The log contains an "a restart is required"
		warning in this case.
	</p>

	<h3>The relay keeps dying by itself</h3>
	<p><strong>Cause:</strong> The machine rebooted, or the relay ran out of memory (OOM).</p>
	<p><strong>Fix:</strong></p>
	<ol>
		<li>Check the end of the log: <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Check if the machine rebooted: <code>uptime</code> (a very short uptime means a reboot).
		</li>
		<li>Check memory: <code>free -h</code>.</li>
		<li>Start the relay again: <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Tip">
		To start nostrfy automatically on boot, register it as a systemd service with the relay's start
		command as <code>ExecStart</code>.
	</Callout>

	<h3>systemd cannot start the relay on port 80</h3>
	<p>
		A systemd service running as root can bind port 80. If you set <code>User=</code> to a regular user,
		either use a higher port (e.g. 8080) or add
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> to the unit.
	</p>

	<h2 id="still-not-solved">Still not solved?</h2>
	<ol>
		<li>
			<strong>Check the log</strong>: <code>tail -100 nostrfy.log</code> — it usually names the direct
			cause.
		</li>
		<li>
			<strong>Re-validate the config</strong>: <code>nostrfy check</code> — shows warnings and errors.
		</li>
		<li>
			<strong>Gather reproduction details</strong>: what were you doing, which client, what exact error.
		</li>
		<li>
			<strong>Ask in the project repository</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — when filing
			an issue, include the reproduction steps and the log.
		</li>
	</ol>
</div>