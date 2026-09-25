<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const call = `curl -X POST http://127.0.0.1:8080/ \\
  -H "Content-Type: application/nostr+json+rpc" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"method":"supportedmethods","params":[]}'`;
</script>

<DocsTitle
	title="NIP-86 management"
	description="The JSON-RPC management API: moderation, access lists, relay identity, roles, invite claims and delegated method grants, with Bearer or NIP-98 authentication."
/>

<div class="doc-body">
	<h2>Enabling</h2>
	<p>
		NIP-86 is a JSON-RPC API for managing the relay. It needs one of two authentication methods,
		otherwise every call is refused:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Method</th>
				<th>Setup</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Bearer token</td>
				<td>
					Set <code>rpc.management_token</code> and send <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Set <code>rpc.admin_pubkey</code> and send a NIP-98 auth event (kind 27235) signed by the
					admin key in <code>Authorization: Nostr &lt;base64&gt;</code> — a <code>payload</code> tag
					is required; each event is single-use within its 60-second window
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Calling the API</h2>
	<p>POST / with <code>Content-Type: application/nostr+json+rpc</code>:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Methods</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Method</th>
				<th>Params</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>List of supported methods</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Ban a pubkey from posting (also removes it from the allowlist)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Unban a pubkey</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>List banned pubkeys and reasons</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Add to the allowlist (also un-bans)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Remove from the allowlist</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>List the allowlist</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Allow / disallow a kind</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>List allowed / disallowed kinds</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Change the relay name / description / icon (persisted to the config file; reports an error when the file cannot be written)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>NIP-43 role management (wrong-typed fields are rejected; deleting a missing role succeeds)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Assign / unassign a role (a duplicate grant or missing revocation succeeds)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Grant / revoke a NIP-86 method to a non-admin pubkey — only moderation and read methods are grantable</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>List method grants (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Block / unblock an IP (blocking also drops existing connections)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>List blocked IPs</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Ban an event (banning an unknown id pre-bans it; also removes it from the allow list)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Add an event to the allow list (also lifts the ban; allowing an unknown id pre-allows it)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Remove an event from the allow / ban list (a missing entry succeeds)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>List banned events (a failed lookup surfaces an error, never an empty list)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>List allowed events</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>Events awaiting moderation (always empty on this relay)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>List NIP-43 invite codes</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Issue / revoke a NIP-43 invite code (a kind:28934 carrying a listed code admits its author)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Delegated administration">
		<code>rpc.admin_pubkey</code> (and the management token) stay the root login with every method. Other
		pubkeys authenticate with NIP-98 and may only run their <code>assignmethod</code>-granted methods
		(<code>supportedmethods</code> shows their own subset). Permission, role, invite-claim and relay-identity
		management stay admin-only, so a grantee can never escalate. A banned pubkey is refused even with grants.
	</Callout>

	<Callout type="note" title="Served on the public POST / routes">
		The NIP-86 RPC is mounted on the relay's public POST / routes. Mutations are recorded in a
		rate-limited audit log (at most 600 entries per minute) with the authenticated identity. Requests
		over <code>rpc.max_admin_body_bytes</code> are refused with 413.
	</Callout>
</div>