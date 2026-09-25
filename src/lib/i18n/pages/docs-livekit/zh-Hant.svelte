<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const support = 'curl -i http://127.0.0.1:8080/.well-known/nip29/livekit';
	const config = `[relay]
livekit_url = "wss://livekit.example.com"
livekit_api_key = "..."
livekit_api_secret = "..."`;
</script>

<DocsTitle
	title="LiveKit 影音房間"
	description="透過 LiveKit 伺服器為 NIP-29 群組提供影音房間：權杖端點、JWT 簽發與公佈房間的群組中繼資料。"
/>

<div class="doc-body">
	<h2>設定</h2>
	<ol>
		<li>
			在設定檔中設定 <code>relay.livekit_url</code>、<code>relay.livekit_api_key</code> 與
			<code>relay.livekit_api_secret</code>。
		</li>
		<li>
			透過管理員的 <code>kind:9002</code> 編輯，將 <code>livekit</code> 標籤加入群組中繼資料。
		</li>
		<li>
			用戶端使用 NIP-98 認證從 <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> 取得
			JWT（被 NIP-86 <code>banpubkey</code> 封鎖的公鑰會被拒絕）。
		</li>
	</ol>

	<h2>檢查支援</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 表示房間伺服器已啟用。"
	/>

	<h3>設定</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		LiveKit 設定在啟動時固定 — 變更它們需要重新啟動。
	</Callout>
</div>
