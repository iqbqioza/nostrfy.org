<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="Configuration reference"
	description="Complete reference for nostrfy.toml: every key, its type, its default and exactly what it does — limits, database, daemon, access control and Blossom."
/>

<div class="doc-body">
	<h2>Basics</h2>
	<p>
		The configuration is a <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a> file, by
		default named <code>nostrfy.toml</code>. Create it with <code>init</code>:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Validate it (recommended before every start):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Every command takes <code>--config &lt;path&gt;</code> (default <code>nostrfy.toml</code>).</p>
	<p>General syntax:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Configuration sections</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Section</th>
				<th>Purpose</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>[relay]</code></td>
				<td>Identity, URLs and NIP toggles</td>
			</tr>
			<tr>
				<td><code>[server]</code></td>
				<td>Network binding, API split, metrics</td>
			</tr>
			<tr>
				<td><code>[rpc]</code></td>
				<td>NIP-86 management RPC (auth, body limit)</td>
			</tr>
			<tr>
				<td><code>[limits]</code></td>
				<td>All limits and overload protections</td>
			</tr>
			<tr>
				<td><code>[database]</code></td>
				<td>LMDB storage, search index, queue caps</td>
			</tr>
			<tr>
				<td><code>[daemon]</code></td>
				<td>PID, log and stats files and rotation</td>
			</tr>
			<tr>
				<td><code>[access]</code></td>
				<td>Initial access control lists (changeable at runtime)</td>
			</tr>
			<tr>
				<td><code>[blossom]</code></td>
				<td>Blossom file server (media hosting)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Every key is optional; a missing key uses its default.</p>

	<h2>Section [relay] — relay identity</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>name</code></td>
				<td>string</td>
				<td><code>"nostrfy"</code></td>
				<td>Relay name shown to clients via NIP-11</td>
			</tr>
			<tr>
				<td><code>description</code></td>
				<td>string</td>
				<td><code>"A minimal and stable Nostr relay"</code></td>
				<td>Relay description (NIP-11)</td>
			</tr>
			<tr>
				<td><code>pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Administrator public key (NIP-11 pubkey field)</td>
			</tr>
			<tr>
				<td><code>contact</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Administrator contact URI (mailto: or https://)</td>
			</tr>
			<tr>
				<td><code>icon</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Relay icon image URL</td>
			</tr>
			<tr>
				<td><code>post_policy</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>URL pointing to the relay's posting policy</td>
			</tr>
			<tr>
				<td><code>private_key</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>The relay's own secret key; required for NIP-29 groups</td>
			</tr>
			<tr>
				<td><code>public_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Public URL, e.g. wss://relay.example.com</td>
			</tr>
			<tr>
				<td><code>livekit_url</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit server URL for NIP-29 audio/video rooms</td>
			</tr>
			<tr>
				<td><code>livekit_api_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit API key</td>
			</tr>
			<tr>
				<td><code>livekit_api_secret</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>LiveKit API secret (used to sign JWTs)</td>
			</tr>
			<tr>
				<td><code>enabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Explicit NIP allowlist</td>
			</tr>
			<tr>
				<td><code>disabled_nips</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>NIPs to disable (ignored when enabled_nips is non-empty)</td>
			</tr>
			<tr>
				<td><code>reject_ephemeral</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Reject NIP-01 ephemeral events (kinds 20000-29999)</td>
			</tr>
			<tr>
				<td><code>enabled_git</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Accept NIP-34 git events (kinds 1617-1633, 30617/30618)</td>
			</tr>
			<tr>
				<td><code>require_pow</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Required proof-of-work in leading zero bits</td>
			</tr>
			<tr>
				<td><code>new_pubkey_min_age_secs</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Refuse events from pubkeys younger than this (seconds; 0 = off)</td>
			</tr>
			<tr>
				<td><code>max_events_per_min_per_pubkey</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Publish rate limit per pubkey (per minute; 0 = no limit)</td>
			</tr>
			<tr>
				<td><code>max_groups</code></td>
				<td>integer</td>
				<td><code>1000</code></td>
				<td>Cap on the in-memory NIP-29 group store</td>
			</tr>
			<tr>
				<td><code>require_auth</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Require NIP-42 authentication for REQ/EVENT/COUNT/NEG</td>
			</tr>
			<tr>
				<td><code>send_auth_challenge</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Send the AUTH challenge on connect</td>
			</tr>
			<tr>
				<td><code>enabled_nip78_auth</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Require NIP-42 AUTH before accepting kind 78/30078 events</td>
			</tr>
			<tr>
				<td><code>enabled_command_events</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Execute kind:1 operator commands authored by the admin pubkey</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Key details</h3>
	<ul>
		<li>
			<strong>private_key</strong> — the relay's own secret key, used to sign relay-generated events: NIP-29 group
			metadata (39000-39005) and NIP-43 role/membership events. Generate with <code>nostrfy genkey</code>; keep it
			secret. It is read once at startup, so changing it requires a restart.
		</li>
		<li>
			<strong>public_url</strong> — used to validate URL-bearing tags from clients: NIP-42 AUTH, NIP-62 vanish and
			NIP-98 admin auth. When empty, the relay falls back to <code>host:port</code>, which never matches a real
			client URL when binding <code>0.0.0.0</code> or <code>127.0.0.1</code> (a warning is logged).
			<strong>Always set it.</strong>
		</li>
		<li>
			<strong>enabled_nips vs disabled_nips</strong> — the allowlist wins: when <code>enabled_nips</code> is
			non-empty, only its NIPs are advertised and <code>disabled_nips</code> is ignored. Both require a restart.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — kinds 20000-29999 are rejected, but the exempt kinds NIPs require to be
			relayed are still forwarded: 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 and 21059. Applies on
			SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — opt-in NIP-34: accepts kinds 1617-1633 and 30617/30618 and advertises NIP-34.
			Off by default because patch payloads can be large. Applies on SIGHUP.
		</li>
	</ul>

	<h2>Section [server] — server settings</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>"127.0.0.1"</code></td>
				<td>Bind address; 0.0.0.0 accepts connections from anywhere</td>
			</tr>
			<tr>
				<td><code>port</code></td>
				<td>integer</td>
				<td><code>8080</code></td>
				<td>Port (1-65535); port 80 requires root</td>
			</tr>
			<tr>
				<td><code>api_host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Hostname dedicated to the REST API</td>
			</tr>
			<tr>
				<td><code>metrics_enabled</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Serve Prometheus metrics at /metrics</td>
			</tr>
			<tr>
				<td><code>ws_paths</code></td>
				<td>string</td>
				<td><code>"root"</code></td>
				<td>WebSocket endpoint paths: root, inbox-outbox or all</td>
			</tr>
			<tr>
				<td><code>inbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Who may write to /inbox: "any" or "relay" (events must still carry a p tag)</td>
			</tr>
			<tr>
				<td><code>outbox_write_policy</code></td>
				<td>string</td>
				<td><code>"any"</code></td>
				<td>Who may write to /outbox: "any" (the NIP-42-authenticated pubkey's own events) or "relay"</td>
			</tr>
			<tr>
				<td><code>trusted_proxies</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>Reverse-proxy addresses/CIDRs whose X-Forwarded-For is trusted (empty = trust no proxy)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Key details</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> binds all IPv4 interfaces; <code>127.0.0.1</code> is local only.</li>
		<li><strong>port</strong> — 1-65535; port 80 requires root. This one port serves the WebSocket relay, the NIP-11 document, the REST API and the NIP-86 RPC together.</li>
		<li>
			<strong>api_host</strong> — dedicates the REST API to a single hostname so the API and the relay can share one
			port behind a reverse proxy. Fixed at startup — requires a restart.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> serves / only, <code>inbox-outbox</code> serves /inbox and
			/outbox only, <code>all</code> serves both. Fixed at startup — requires a restart.
		</li>
		<li>
			<strong>trusted_proxies</strong> — list only the proxy's own addresses (loopback for nginx/Caddy on the same
			host, the balancer's source range in the cloud). With it set, the client IP is derived from the last untrusted
			<code>X-Forwarded-For</code> entry for the per-IP caps, rate limit, <code>blockip</code> and the logs. Never
			add an address clients can reach directly — they could spoof the header and bypass the per-IP limits.
			Fixed at startup — requires a restart.
		</li>
	</ul>

	<h2>Section [rpc] — NIP-86 management</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>management_token</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Bearer token for the management APIs</td>
			</tr>
			<tr>
				<td><code>admin_pubkey</code></td>
				<td>string (64 hex)</td>
				<td><code>""</code></td>
				<td>Administrator pubkey for NIP-98 management auth</td>
			</tr>
			<tr>
				<td><code>max_admin_body_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Body limit for the NIP-86 management RPC</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		The NIP-86 RPC is mounted on the relay's public <code>POST /</code> routes — there is no separate management
		port. <code>management_token</code> and <code>admin_pubkey</code> sometimes appear under <code>[server]</code>
		in old guides; those spellings are legacy aliases of these <code>[rpc]</code> keys.
	</p>

	<h2>Section [limits] — limits and protections</h2>
	<h3>Connections and messages</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_connections</code></td>
				<td>integer</td>
				<td><code>10000</code></td>
				<td>Maximum concurrent connections</td>
			</tr>
			<tr>
				<td><code>max_connections_per_ip</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Max connections per source IP</td>
			</tr>
			<tr>
				<td><code>max_ws_message_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Max bytes per WebSocket message/frame</td>
			</tr>
			<tr>
				<td><code>socket_recv_buffer_kb</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Per-connection kernel receive buffer (KiB)</td>
			</tr>
			<tr>
				<td><code>max_out_queue_bytes</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Per-connection outgoing queue cap (bytes)</td>
			</tr>
			<tr>
				<td><code>ws_idle_timeout_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>Close idle connections after this long</td>
			</tr>
			<tr>
				<td><code>http_read_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>HTTP request-head timeout (slow-loris defense)</td>
			</tr>
			<tr>
				<td><code>max_connections_per_sec_per_ip</code></td>
				<td>integer</td>
				<td><code>0</code></td>
				<td>Max new connections per second per source IP</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Subscriptions and queries</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_filters</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Max filters per REQ</td>
			</tr>
			<tr>
				<td><code>max_subscriptions</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>Max subscriptions per connection</td>
			</tr>
			<tr>
				<td><code>max_limit</code></td>
				<td>integer</td>
				<td><code>500</code></td>
				<td>Ceiling for the REQ limit</td>
			</tr>
			<tr>
				<td><code>max_count</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Ceiling for COUNT results</td>
			</tr>
			<tr>
				<td><code>max_sub_id_len</code></td>
				<td>integer</td>
				<td><code>64</code></td>
				<td>Max subscription id length (characters, not bytes)</td>
			</tr>
			<tr>
				<td><code>max_sub_bytes</code></td>
				<td>integer</td>
				<td><code>1048576</code></td>
				<td>Total subscription filter bytes per connection</td>
			</tr>
			<tr>
				<td><code>max_req_response_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>Ceiling for the total bytes a single REQ response may send</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Events</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_content_bytes</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Max event content length in characters</td>
			</tr>
			<tr>
				<td><code>max_tags</code></td>
				<td>integer</td>
				<td><code>2000</code></td>
				<td>Max tags per event</td>
			</tr>
			<tr>
				<td><code>max_tag_value_bytes</code></td>
				<td>integer</td>
				<td><code>1024</code></td>
				<td>Max bytes per tag value</td>
			</tr>
			<tr>
				<td><code>max_created_at_future_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Tolerated future skew of created_at</td>
			</tr>
			<tr>
				<td><code>group_late_publish_secs</code></td>
				<td>integer</td>
				<td><code>3600</code></td>
				<td>Tolerated lag for NIP-29 group admin events (seconds)</td>
			</tr>
			<tr>
				<td><code>max_neg_items</code></td>
				<td>integer</td>
				<td><code>100000</code></td>
				<td>Max records per NIP-77 negentropy sync</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Legacy aliases: <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> and
		<code>limits.max_indexed_words</code> are still accepted as aliases of <code>relay.require_pow</code>,
		<code>relay.new_pubkey_min_age_secs</code> and <code>database.max_indexed_words</code>.
	</p>
	<h3>REST API</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>max_api_concurrent</code></td>
				<td>integer</td>
				<td><code>8</code></td>
				<td>Max concurrent /api/v1 requests</td>
			</tr>
			<tr>
				<td><code>max_api_limit</code></td>
				<td>integer</td>
				<td><code>5000</code></td>
				<td>Ceiling for the API limit parameter</td>
			</tr>
			<tr>
				<td><code>max_api_offset</code></td>
				<td>integer</td>
				<td><code>50000</code></td>
				<td>Ceiling for the API offset parameter</td>
			</tr>
			<tr>
				<td><code>max_api_fetch</code></td>
				<td>integer</td>
				<td><code>55001</code></td>
				<td>Max over-fetch window for offset queries — must cover max_api_offset + max_api_limit + 1 (0 = no bound)</td>
			</tr>
			<tr>
				<td><code>max_api_search_bytes</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Max bytes of the API search parameter</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Live fan-out</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>live_batch_interval_ms</code></td>
				<td>integer</td>
				<td><code>20</code></td>
				<td>How often live events are flushed (ms)</td>
			</tr>
			<tr>
				<td><code>live_batch_size</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Max events per live batch</td>
			</tr>
			<tr>
				<td><code>live_buffer</code></td>
				<td>integer</td>
				<td><code>65536</code></td>
				<td>Live fan-out queue size</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Section [database] — database</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>path</code></td>
				<td>string</td>
				<td><code>"./data"</code></td>
				<td>Database directory (LMDB)</td>
			</tr>
			<tr>
				<td><code>max_dbs</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>LMDB max named databases</td>
			</tr>
			<tr>
				<td><code>max_readers</code></td>
				<td>integer</td>
				<td><code>128</code></td>
				<td>LMDB max concurrent readers</td>
			</tr>
			<tr>
				<td><code>map_size</code></td>
				<td>integer</td>
				<td><code>1073741824</code> (1 GB)</td>
				<td>Floor for the memory map size (bytes)</td>
			</tr>
			<tr>
				<td><code>max_map_size</code></td>
				<td>integer</td>
				<td><code>1099511627776</code> (1 TB)</td>
				<td>Memory-map ceiling (bytes)</td>
			</tr>
			<tr>
				<td><code>purge_interval_secs</code></td>
				<td>integer</td>
				<td><code>300</code></td>
				<td>NIP-40 purge interval (seconds)</td>
			</tr>
			<tr>
				<td><code>search_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Enable the NIP-50 word index</td>
			</tr>
			<tr>
				<td><code>reader_threads</code></td>
				<td>integer</td>
				<td><code>2</code></td>
				<td>Dedicated scan threads</td>
			</tr>
			<tr>
				<td><code>max_indexed_words</code></td>
				<td>integer</td>
				<td><code>32</code></td>
				<td>Words of each event's content indexed for search</td>
			</tr>
			<tr>
				<td><code>meta_index</code></td>
				<td>boolean</td>
				<td><code>true</code></td>
				<td>Write the per-event metadata header used by the scan prefilter</td>
			</tr>
			<tr>
				<td><code>disabled_fsync</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Skip the synchronous disk flush after every write batch</td>
			</tr>
			<tr>
				<td><code>db_buffer_size</code></td>
				<td>integer</td>
				<td><code>2048</code></td>
				<td>Initial per-connection WebSocket buffer (bytes)</td>
			</tr>
			<tr>
				<td><code>db_request_timeout_secs</code></td>
				<td>integer</td>
				<td><code>30</code></td>
				<td>How long a database request may wait before failing</td>
			</tr>
			<tr>
				<td><code>max_db_queue_msgs</code></td>
				<td>integer</td>
				<td><code>4096</code></td>
				<td>Max queued pending messages before failing fast</td>
			</tr>
			<tr>
				<td><code>max_db_queue_events</code></td>
				<td>integer</td>
				<td><code>262144</code></td>
				<td>Max events inside queued batches before failing fast</td>
			</tr>
			<tr>
				<td><code>max_db_queue_bytes</code></td>
				<td>integer</td>
				<td><code>268435456</code> (256 MiB)</td>
				<td>Max bytes of queued database requests before failing fast (0 = no byte cap)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Key details</h3>
	<ul>
		<li>
			<strong>map_size</strong> — the floor for the memory map: the map is always opened at least this large.
		</li>
		<li>
			<strong>max_map_size</strong> — the ceiling, opened as a sparse virtual reservation: physical disk grows only
			with the data actually written. Raise it when you hit <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — search still works (whole-word matching against content) but scans
			get slower; on a tiny VPS it halves the database. Recommended on small instances.
		</li>
		<li>
			<strong>disabled_fsync</strong> — trades durability for throughput: writes commit into the OS page cache and
			a power loss may lose the most recent writes.
		</li>
	</ul>

	<h2>Section [daemon] — daemon</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>pid_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.pid"</code></td>
				<td>PID file path</td>
			</tr>
			<tr>
				<td><code>log_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.log"</code></td>
				<td>Log file path</td>
			</tr>
			<tr>
				<td><code>stats_file</code></td>
				<td>string</td>
				<td><code>"./nostrfy.stats.json"</code></td>
				<td>Statistics file path</td>
			</tr>
			<tr>
				<td><code>stats_interval_secs</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Statistics write interval (seconds)</td>
			</tr>
			<tr>
				<td><code>max_log_size_bytes</code></td>
				<td>integer</td>
				<td><code>52428800</code> (50 MB)</td>
				<td>Log rotation size (0 = no rotation)</td>
			</tr>
			<tr>
				<td><code>max_log_files</code></td>
				<td>integer</td>
				<td><code>5</code></td>
				<td>Rotated log generations to keep</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>Paths are resolved against the config file's directory, so they stay valid after the daemon changes its working directory.</p>

	<h2>Section [access] — access control</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>restrict_relay</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Only allowlisted pubkeys may publish</td>
			</tr>
			<tr>
				<td><code>blocked_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Kinds to reject</td>
			</tr>
			<tr>
				<td><code>allowed_kinds</code></td>
				<td>array of integers</td>
				<td><code>[]</code></td>
				<td>Kind allowlist; only these kinds are accepted when non-empty</td>
			</tr>
			<tr>
				<td><code>blocked_ips</code></td>
				<td>array of strings</td>
				<td><code>[]</code></td>
				<td>IP addresses refused at connection time</td>
			</tr>
			<tr>
				<td><code>method_grants</code></td>
				<td>table: pubkey → array of strings</td>
				<td><code>&#123;&#125;</code></td>
				<td>NIP-86 method grants for non-admin pubkeys (managed at runtime with <code>assignmethod</code>)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		The pubkey allow/deny lists are <strong>not</strong> config keys — they live in the relay database (LMDB) and are
		managed at runtime:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — only the allowlisted pubkeys may <strong>publish</strong>, while
			reading stays open to everyone (any client can still subscribe and fetch).
		</li>
		<li>A denied pubkey is always rejected when publishing and never served when reading.</li>
		<li>
			<strong>method_grants</strong> — NIP-86 method grants for non-admin pubkeys (pubkey → method names, e.g. a
			moderator allowed <code>banevent</code> and <code>listbannedevents</code>). Seeded from the config on the
			first run, then managed at runtime with NIP-86 <code>assignmethod</code>/<code>unassignmethod</code>
			(inspected with <code>listmethodassignees</code>). Only moderation and read methods are grantable —
			permission, role, invite-claim and relay-identity management stay admin-only, and a banned pubkey is
			refused even with grants. See the
			<a href="/docs/management/">management API</a>.
		</li>
	</ul>

	<h2>Section [blossom] — Blossom file server</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Key</th>
				<th>Type</th>
				<th>Default</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>host</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>Hostname for the Blossom server (empty = disabled)</td>
			</tr>
			<tr>
				<td><code>storage</code></td>
				<td>string</td>
				<td><code>"local"</code></td>
				<td>Backend: "local" (local_path) or "s3" (S3-compatible bucket)</td>
			</tr>
			<tr>
				<td><code>local_path</code></td>
				<td>string</td>
				<td><code>"/var/lib/nostrfy/images"</code></td>
				<td>Local storage root for media files</td>
			</tr>
			<tr>
				<td><code>max_upload_bytes</code></td>
				<td>integer</td>
				<td><code>20971520</code> (20 MB)</td>
				<td>Max media file size</td>
			</tr>
			<tr>
				<td><code>min_free_bytes</code></td>
				<td>integer</td>
				<td><code>33554432</code> (32 MB)</td>
				<td>Disk space below which uploads are refused</td>
			</tr>
			<tr>
				<td><code>s3_endpoint</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3-compatible endpoint (e.g. R2)</td>
			</tr>
			<tr>
				<td><code>s3_region</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 region (R2 uses "auto")</td>
			</tr>
			<tr>
				<td><code>s3_bucket</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 bucket name</td>
			</tr>
			<tr>
				<td><code>s3_access_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 access key</td>
			</tr>
			<tr>
				<td><code>s3_secret_key</code></td>
				<td>string</td>
				<td><code>""</code></td>
				<td>S3 secret key</td>
			</tr>
			<tr>
				<td><code>restrict_uploads</code></td>
				<td>boolean</td>
				<td><code>false</code></td>
				<td>Only allowlisted pubkeys may upload</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Reloading at runtime (SIGHUP)</h2>
	<p>
		Editing the file and sending <code>kill -HUP $(cat nostrfy.pid)</code> reloads the config <strong>without a
		restart</strong>. Most settings take effect immediately; a few are fixed at startup:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Applies on SIGHUP</th>
				<th>Requires restart</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td>
				<td>relay.private_key</td>
			</tr>
			<tr>
				<td>reject_ephemeral, enabled_git, enabled_nip78_auth</td>
				<td>relay.livekit_*, enabled_nips / disabled_nips</td>
			</tr>
			<tr>
				<td>most of [limits]</td>
				<td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, daemon sizes, limit caps, blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] is not applied by a reload — the lists are seeded once at startup and then managed at runtime via NIP-86.
		The log warns when a restart-required setting changed, and a few startup-captured settings are not checked by the
		reload.
	</p>

	<Callout type="warning" title="Common mistakes">
				<div class="overflow-x-auto">
			<table>
			<thead>
				<tr>
					<th>Mistake</th>
					<th>Fix</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>public_url unset</td>
					<td>set <code>wss://...</code></td>
				</tr>
				<tr>
					<td>host left 127.0.0.1</td>
					<td>external clients can't connect</td>
				</tr>
				<tr>
					<td>private_key unset with NIP-29</td>
					<td>run <code>nostrfy genkey</code> + restart</td>
				</tr>
				<tr>
					<td>restrict_relay true with empty allowlist</td>
					<td>everyone locked out</td>
				</tr>
				<tr>
					<td>changing restart-only keys and only SIGHUPing</td>
					<td>use <code>nostrfy restart</code></td>
				</tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>