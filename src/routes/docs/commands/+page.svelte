<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;
</script>

<DocsTitle
	title="Commands"
	description="Every nostrfy command, the CLI access list commands, and the inbox/outbox filter extensions."
/>

<div class="doc-body">
	<h2>Overview</h2>
	<p>All commands accept <code>--config &lt;path&gt;</code> (default <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Command</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Write a default nostrfy.toml and exit; the file is created 0600</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Generate a secret key for NIP-29 groups, write it into relay.private_key, set the config to 0600 and print the public key</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Validate the config (run before starting)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Start as a daemon; <code>--foreground</code> runs in the terminal</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Stop the running daemon</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Stop and start again (re-reads the config)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Show live statistics</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Update the binary to the latest GitHub release (or the given version); downloads the matching platform asset, verifies it with a <code>--version</code> probe and atomically replaces the binary; never downgrades unless a version is given; <code>--force</code> reinstalls</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Managing the access lists</h2>
	<p>
		The relay pubkey allow/deny lists and the Blossom upload allowlist live in LMDB and apply immediately — the
		running daemon reloads on SIGHUP:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>A denied pubkey is always rejected when publishing and never served when reading.</p>

	<h2>Inbox/outbox subscription filters</h2>
	<p>
		nostrfy extends the REQ filter syntax with two convenience keys for the inbox/outbox routing model — a nostrfy
		extension, not part of any NIP. <code>"outbox"</code> expands to <code>"authors"</code>: only events
		<em>authored by</em> the pubkey. <code>"inbox"</code> expands to <code>"#p"</code>: only events
		<em>addressed to</em> the pubkey (mentions, replies, zaps and DMs). Values may be 64-hex or <code>npub1</code>
		codes, or arrays that merge with an existing <code>authors</code>/<code>#p</code> key; an invalid pubkey rejects
		the subscription:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		The endpoints are also write-restricted: <code>/outbox</code> accepts only events authored by the connection's
		NIP-42-authenticated pubkey (<code>server.outbox_write_policy = "any"</code>) or only the relay's own events
		(<code>"relay"</code>); <code>/inbox</code> accepts only events carrying a <code>p</code> tag.
	</p>

	<Callout type="tip" title="Step by step">
		Most commands are also explained step by step in the <a href="/docs/quick-start/">quick-start guide</a>.
	</Callout>
</div>