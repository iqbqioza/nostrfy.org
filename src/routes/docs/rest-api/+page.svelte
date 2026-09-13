<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32-byte hex event id",
      "pubkey": "32-byte hex pubkey",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64-byte hex signature"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # page 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # page 2 (when more was true)`;
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc';
	const notesEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1"`;
	const paginateEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?limit=10&offset=10&sort=asc"`;
	const byIdEx = `curl "http://127.0.0.1:8080/api/v1/note1..."
curl "http://127.0.0.1:8080/api/v1/nevent1..."`;
	const naddrEx = `curl "http://127.0.0.1:8080/api/v1/naddr1..."`;
	const searchEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?search=rust"`;
	const tagEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/7?e=<event-id>&limit=100"`;
</script>

<DocsTitle
	title="REST API"
	description="Read-only HTTP API for querying stored events at GET /api/v1/... — served on the same port as the WebSocket relay."
/>

<div class="doc-body">
	<h2>Base URL</h2>
	<p>
		The API is served under <code>/api/v1</code> on the same port as the WebSocket relay:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Host routing (<code>server.api_host</code>)</h2>
	<p>
		When <code>server.api_host</code> (e.g. <code>api.example.com</code>) is configured, the API and the
		relay are split by the Host header: <code>api.example.com</code> gets <code>/api/v1</code>,
		<code>/health</code> and <code>/metrics</code>; any other host gets the WebSocket relay and NIP-11.
		Without <code>api_host</code> the API is served on every host. Only GET is supported — WebSocket
		upgrade requests to <code>/api/v1</code> are refused with 403.
	</p>

	<h2>Endpoints</h2>
	<h3>Identifier-based paths</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Path</th>
				<th>Returns</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>Latest kind-0 profile event</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>The single event with this id</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>Events of the address (kind + author + d tag)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>Events by pubkey, filtered by kind (only valid for npub1...; 400 otherwise)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Query and aggregate endpoints</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — generic filter query without an identifier.</li>
		<li><code>GET /api/v1/count</code> — total count for the same filter parameters (NIP-45 semantics).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — per-kind event counts for an author, most used
			first.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — per-day counts for one month;
			month must be 1-12, and every day is reported zero-filled through the last day.
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — a single event by its 64-hex id (prefixes rejected).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — author summary (total, first/last activity, kind
			breakdown).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — per-hour counts for one day; all 24
			hours are reported, zero-filled.
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — replies (#e) and quotes (#q) referencing the
			event.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — the author's latest kind-3 follow list.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — the most common kinds on the relay (bounded, visibility-filtered sample).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — the most active authors on the relay (bounded,
			visibility-filtered sample; approximate flag).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — the author's latest NIP-65 relay list
			(kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — per-month counts, zero-filled over
			the since/until range (default: the whole period; capped at 120 months).
		</li>
	</ul>

	<h2>Query parameters</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Parameter</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Max results (default 100, capped by max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Number of visible results to skip (pagination)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Only events with created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Only events with created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> for oldest first; default is newest first</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>NIP-50 full-text search (whole-word matching)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Filter by #e / #p / #t / #d tags</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Exclude events carrying that tag — applied before pagination, so excluded events never
					consume limit slots or offset steps
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Response format</h2>
	<p>Successful responses return <code>200 OK</code> with the following JSON body:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Field</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>The events of this page (newest first by default)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>The number of events in this page</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td>True when further pages exist (use offset to fetch them)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Pagination</h2>
	<p>
		Pagination is done with <code>offset</code> and the <code>more</code> flag, computed over the
		<strong>visible</strong> sequence — hidden events never skip or duplicate a page:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<h2>Visibility rules</h2>
	<p>The API is unauthenticated, so it withholds the same events as an anonymous WebSocket connection:</p>
	<ul>
		<li>NIP-70 protected events (carrying a <code>-</code> tag)</li>
		<li>NIP-59 gift wraps (kind 1059)</li>
		<li>NIP-29 private/hidden group content (visible only to members)</li>
	</ul>

	<h2>Errors and status codes</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Code</th>
				<th>Meaning</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Success</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Invalid identifier or query parameter</td>
			</tr>
			<tr>
				<td>403</td>
				<td>WebSocket upgrade attempt to /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Unknown path, or wrong Host for the API (api_host configured)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>API concurrency limit reached — retry shortly</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Examples</h2>
	<p>Fetch a user's notes (newest first):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Paginate and sort:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Fetch a single event by id (note1... or nevent1... both work):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Fetch an addressable event (naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Search:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Tag filter:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>