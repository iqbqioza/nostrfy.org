<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
</script>

<DocsTitle
	title="NIP-29 groups"
	description="NIP-29 groups: closed chat spaces where only members can write, with moderation events and relay-signed snapshots of the group state."
/>

<div class="doc-body">
	<h2>Enabling groups</h2>
	<ol>
		<li>
			Run <code>nostrfy genkey</code> to set <code>relay.private_key</code>
			(<strong>required</strong> — group metadata is not generated without it).
		</li>
		<li>Restart the relay.</li>
	</ol>

	<h2>How groups work</h2>
	<p>
		Groups are created and moderated by events. From these moderation events the relay generates
		relay-signed snapshots that clients use for display:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Event</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Create group (the creator becomes the admin)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Add member (with roles) / remove member</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Edit metadata (name, description, public/private, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Delete event (moderation)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Delete group (its stored events are purged)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Create invite code</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Update pin list</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Join request / leave request</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Relay-signed snapshots</h3>
	<ul>
		<li><code>kind:39000</code> — group metadata (name, visibility settings, ...)</li>
		<li><code>kind:39001</code> — admin list</li>
		<li><code>kind:39002</code> — member list</li>
		<li><code>kind:39005</code> — pinned events</li>
	</ul>

	<h2>Group visibility settings</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Tag</th>
				<th>Meaning</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Only members can read messages</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Only members can write</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>Metadata is hidden from non-members</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Join requests are not auto-approved (invite codes required)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>The group has a LiveKit audio/video room</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Subgroups</h2>
	<p>
		Groups can be hierarchical — nested with <code>parent</code> / <code>child</code> tags. Cycles are
		rejected automatically.
	</p>

	<Callout type="warning" title="Leaving a group">
		Any member — including the group's last admin — may leave with <code>kind:9022</code> and is
		automatically removed; if the last admin leaves, the group has no admins left. Grant another admin
		first, or delete the group with <code>kind:9008</code>, or recover an admin-less group by signing a
		moderation event with the relay's own key (<code>relay.private_key</code>, the NIP-11 self pubkey).
		See <a href="/docs/troubleshooting/">troubleshooting</a> for the how-to.
	</Callout>
</div>