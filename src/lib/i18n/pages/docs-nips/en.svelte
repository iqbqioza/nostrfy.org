<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
</script>

<DocsTitle
	title="Supported NIPs reference"
	description="Every relay-side NIP nostrfy implements — kinds, notes and caveats — and how the NIP-11 supported_nips list is computed dynamically."
/>

<div class="doc-body">
	<h2>Implemented NIPs</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Basic protocol (events, subscriptions)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Event deletion</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Relay information document</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Proof of work</td>
			</tr>
			<tr>
				<td>17</td>
				<td>Private DMs (kind 14 wrapped in kind 15; kind 1059 and ephemeral kind 21059 gift wraps served recipient-only when NIP-42 auth is on)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Comments (kind 1111, threaded via the #e index)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Delegated event signing</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Public chat (client-side: stored and served as plain events, not advertised)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Relay-based groups</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Labeling (kind 1985, #l/#L indexed)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Parameterized replaceable events</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					git stuff (kinds 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — opt-in via
					<code>relay.enabled_git</code>, off by default)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Expiration timestamp</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Client authentication</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Relay access metadata (roles) — kinds 33534/13534/8000/8001 plus ephemeral 28934/28935/28936;
					the relay-signed metadata is AUTH-gated. Invite codes are issued with NIP-86
					<code>createclaim</code>/<code>deleteclaim</code>; a kind:28934 carrying a listed code admits
					its author
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Counting results (COUNT)</td>
			</tr>
			<tr>
				<td>46</td>
				<td>Nostr Connect</td>
			</tr>
			<tr>
				<td>47</td>
				<td>Nostr Wallet Connect</td>
			</tr>
			<tr>
				<td>50</td>
				<td>Search capability (full-text, relevance-ordered)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Lightning zaps (kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift wrap (recipient-only serving)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Request to vanish</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Relay list metadata</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Relay discovery &amp; liveness (kinds 30166/10166 stored and served; self-publishes kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>EOSE completeness hint</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Protected events</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Negentropy syncing (a failed replacement closes the id with NEG-ERR per NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Application-specific data (kind 30078, AUTH-gated)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Highlights</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Trusted assertions (kinds 30382/30383/30384/30385/10040, addressable)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>Relay management API</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Cashu and Fedimint announcements (kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Polls</td>
			</tr>
			<tr>
				<td>94</td>
				<td>File metadata (kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>HTTP auth</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Payment targets (kind 10133, replaceable), a draft; served but not advertised
					in <code>supported_nips</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) is not a NIP and is not advertised in the NIP-11 document — it is served as a
		separate file server on the <code>[blossom]</code> hostname. See the
		<a href="/docs/blossom/">Blossom file server</a> page for details.
	</p>

	<h2>Dynamic NIP advertisement</h2>
	<p>
		The <code>supported_nips</code> list is not static: a NIP is dropped from it when every kind the
		NIP defines is rejected by the relay's access control.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — blocking all kinds of a NIP hides it (e.g. blocking
			kind 5 hides NIP-09). Blocking only some kinds keeps the NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — a kind is only accepted when listed; a NIP whose
			kinds are all unlisted is hidden.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — ephemeral kinds that are not in the NIP-mandated
			exempt list (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>) are rejected, so NIPs relying on them are hidden.
		</li>
		<li>
			<strong>Prerequisites</strong> — NIP-29, NIP-43 and NIP-66 rely on relay-signed events and are
			hidden without <code>relay.private_key</code>; NIP-86 is hidden unless
			<code>rpc.management_token</code> or <code>rpc.admin_pubkey</code> is set (otherwise every
			management call is refused).
		</li>
		<li>
			NIPs without dedicated kinds (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) are always advertised when enabled.
		</li>
	</ul>
	<p>
		Changes made at runtime — NIP-86 <code>allowkind</code>/<code>disallowkind</code>, or a SIGHUP reload
		of <code>reject_ephemeral</code> — are reflected in the next NIP-11 fetch.
		<code>enabled_nips</code>/<code>disabled_nips</code> still require a restart.
	</p>
</div>