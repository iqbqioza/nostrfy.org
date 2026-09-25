<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. stop the nostrfy relay (the migration needs the database directory)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry run — parses and verifies every event, writes nothing
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. import
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. start — NIP-29 groups and NIP-43 roles rebuild from the imported events
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # needed for NIP-42/62/98 and NIP-29 metadata
private_key = "..."                       # needed for NIP-29/43 relay-signed metadata

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Option A — nostrfy runs \`strfry export\` itself (strfry on PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Option B — you exported to a file
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Option C — pipe (stdin is the default input)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # for nak (WebSocket)
H=https://relay.example.com    # for curl (HTTP)

nak relay "$R"                              # relay answers and advertises its NIPs
curl -s "$H/api/v1/query?limit=1"           # events are served
nak req -i <deleted-event-id> "$R"          # a deleted event stays gone
nak req -k 39000 "$R"                       # NIP-29 group metadata (if migrated)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # NIP-43 membership (AUTH)`;
</script>

<DocsTitle
	title="Migrating from strfry"
	description="Move an existing strfry relay's events into nostrfy with one command — preparation, dry run, migration, verification and rollback."
/>

<div class="doc-body">
	<h2>At a glance</h2>
	<p>
		<code>nostrfy migrate-strfry</code> reads
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>'s
		own export format (JSONL, one NIP-01 event per line), so it works across strfry database versions and does
		not depend on strfry's internal LMDB schema. It never writes to the strfry database.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Migrated</th>
					<th>Not migrated</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Every stored event (replaceable/addressable semantics applied)</td>
					<td>strfry settings with no nostrfy equivalent (the merge report lists each with a reason)</td>
				</tr>
				<tr>
					<td>NIP-40 expiry — already-expired events are skipped</td>
					<td>Blossom media and its owner mappings (strfry has no Blossom server)</td>
				</tr>
				<tr>
					<td>NIP-09 deletions, including re-publication blocks for events strfry had already deleted</td>
					<td>Access lists (NIP-86 bans, relay pubkey lists, Blossom allowlist)</td>
				</tr>
				<tr>
					<td>NIP-29 <code>9005</code>/<code>9008</code> moderation side effects</td>
					<td>NIP-43 invite codes (issue new ones with <code>createclaim</code>)</td>
				</tr>
				<tr>
					<td>First-seen timestamps (when the new-pubkey gate is configured)</td>
					<td>NIP-62 vanish requests unless <code>--apply-vanish</code> is given</td>
				</tr>
				<tr>
					<td>NIP-29 groups, NIP-43 roles and their relay-signed metadata, rebuilt on the first start</td>
					<td>The relay's own identity/keys (they live in <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>The equivalent strfry settings, offered for merge into <code>nostrfy.toml</code> (optional)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Expected skips in the summary: <strong>ephemeral events</strong> (kinds 20000-29999, which nostrfy never
		stores) and <strong>already-expired events</strong>.
	</p>

	<h2>Quick start</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="The migration is offline">
		It writes directly to <code>database.path</code> and refuses to run while a nostrfy daemon (or another
		migration) holds the database directory. <strong>Stop the relay first.</strong> strfry itself may keep
		running — <code>strfry export</code> reads a consistent snapshot.
	</Callout>

	<h2>Requirements</h2>
	<ul>
		<li>
			The <code>strfry</code> binary (for <code>--strfry-db</code>), or a JSONL file you exported yourself.
		</li>
		<li>nostrfy v0.1.15 or newer (the <code>migrate-strfry</code> subcommand).</li>
		<li>The nostrfy config for the target relay, with <code>database.path</code>, <code>public_url</code> and
			<code>private_key</code> set.</li>
		<li>
			Free disk space: roughly the size of the strfry export plus its indexes. The NIP-50 word index adds
			some more; on a very tight disk you can disable it (<code>database.search_index = false</code>),
			migrate, and re-enable it later (the index is rebuilt at startup).
		</li>
		<li>No running nostrfy instance on the target <code>database.path</code>.</li>
	</ul>

	<h2>Prepare the config</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Generate the relay key with <code>nostrfy genkey</code> if you do not have one, then validate:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>Merging the strfry settings (optional)</h3>
	<p>
		Before the database is opened, <code>migrate-strfry</code> looks for strfry's config
		(<code>--strfry-config</code>, then <code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>,
		<code>./strfry.conf</code>), prints the settings that have a nostrfy equivalent and differ from your
		<code>nostrfy.toml</code>, and asks whether to merge them. Only the listed keys are rewritten — comments
		and every other line are preserved, and a value that would make the config invalid is skipped with its
		reason while the rest still merge.
	</p>
	<ul>
		<li><code>--merge-config</code> applies without asking (for scripts); <code>--no-merge-config</code> skips the step.</li>
		<li>With no terminal, proposals are printed and the merge is skipped unless <code>--merge-config</code> is given.</li>
		<li><code>--dry-run</code> prints the proposals but never writes.</li>
	</ul>

	<h2>Dry run</h2>
	<p>Always look before you leap — a dry run parses and verifies the whole export without touching the database:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		A non-zero <code>bad signature</code> count means the export contains events strfry accepted without
		verification; they will be skipped. If you trust them, pass <code>--no-verify</code> to import them anyway.
	</p>

	<h2>Migrate</h2>
	<p>Pick one of three input modes — all produce the same result:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Flag</th>
					<th>Why</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry is not on <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Resume/catch-up: events with this <code>created_at</code> or newer (inclusive)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>Honor NIP-62 vanish requests found in the export (off by default)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Skip signature verification for trusted dumps (faster)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Events per database transaction (default 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Parse and verify only</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		The migration is <strong>safe to re-run</strong>: duplicates are skipped and the deletion side effects are
		re-applied, so an interrupted run can simply be repeated (or resumed with <code>--since</code>).
	</p>

	<h2>Start and verify</h2>
	<p>
		The first start rebuilds the NIP-29 group store and the NIP-43 role store from the imported events and
		republishes the relay-signed metadata (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		per group, the <code>13534</code> membership list). On a large database this can take a moment; watch the log.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		For an exact count comparison, <code>strfry scan '&#123;&#125;' | wc -l</code> minus the ephemeral/expired events
		reported by the migration summary should equal what clients can retrieve.
	</p>

	<h2>Resuming an interrupted migration</h2>
	<Callout type="warning" title="Do not start the relay before re-running">
		The NIP-29 group side effects (<code>9005</code>/<code>9008</code>) are applied after the import; an
		interrupted run has stored those events but not their deletions yet, so the first start could serve group
		history the deletion was meant to remove. Re-run the migration first — it completes the side effects (the
		purge is idempotent) — then start the relay.
	</Callout>
	<ul>
		<li>
			<strong>Exported to a file / piped:</strong> re-run the same command. Duplicates are skipped and the
			deletion blocks are re-applied.
		</li>
		<li>
			<strong>Used <code>--strfry-db</code>:</strong> the summary prints a resume hint; re-run with that
			<code>--since</code> (inclusive, so the boundary second is re-imported and deduplicated).
		</li>
		<li>
			If the run failed with <code>database writer unavailable</code>, check free disk space and
			<code>database.map_size</code>, then re-run.
		</li>
	</ul>

	<h2>Rollback</h2>
	<p>The migration only writes to the nostrfy database. To roll back, stop the relay and restore the pre-migration database or remove it:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # or restore the pre-migration backup'} lang="sh" />

	<h2>Troubleshooting</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Message</th>
					<th>Cause / fix</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>A nostrfy daemon (or another migration) holds the directory: <code>nostrfy stop</code> first</td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> must name the directory that contains <code>data.mdb</code></td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>Install strfry, set <code>--strfry-bin</code>, or use <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>The writer thread stopped or the queue is overloaded: check disk/map size, re-run (safe)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>The purge was interrupted: re-run the migration</td>
				</tr>
				<tr>
					<td>High <code>bad signature</code> count</td>
					<td>The strfry DB contains unverified events: inspect them; import with <code>--no-verify</code> only if you trust the source</td>
				</tr>
				<tr>
					<td>NIP-29 metadata missing after the start</td>
					<td>No <code>relay.private_key</code>: run <code>nostrfy genkey</code> and restart</td>
				</tr>
				<tr>
					<td>The settings merge is not offered</td>
					<td>strfry's config was not found: pass <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Checklist</h2>
	<ul>
		<li>nostrfy relay stopped</li>
		<li>strfry database and nostrfy config backed up</li>
		<li><code>nostrfy check</code> passes</li>
		<li>strfry settings merged (or the report reviewed)</li>
		<li>Dry run reviewed (no unexpected bad signatures)</li>
		<li>Migration completed without errors</li>
		<li>Relay starts; group/role rebuild logged</li>
		<li>Event counts match (minus ephemeral/expired)</li>
		<li>Deleted events stay gone (re-publish rejected)</li>
		<li>Private-group visibility checked anonymously and as a member</li>
		<li>Reverse proxy / DNS / client relay lists updated</li>
	</ul>

	<Callout type="tip" title="Still running strfry?">
		If strfry stayed live during the export, do a catch-up run once you are ready to switch: stop nostrfy,
		re-run the migration with <code>--since &lt;last created_at&gt;</code>, then start it again.
	</Callout>
</div>
