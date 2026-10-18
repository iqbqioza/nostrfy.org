<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const support = 'curl -i http://127.0.0.1:8080/.well-known/nip29/livekit';
	const config = `[relay]
livekit_url = "wss://livekit.example.com"
livekit_api_key = "..."
livekit_api_secret = "..."
livekit_participants_interval_secs = 15`;
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
		<li>
			中繼為每個 livekit 群組發布 <code>kind:39004</code> 參與者清單，每 <code>relay.livekit_participants_interval_secs</code>（預設 15）重新整理一次，並在 LiveKit 向 <code>/.well-known/nip29/livekit/webhook</code> 傳送 Webhook 時立即重新整理 — 將 LiveKit 伺服器的 <code>webhook.urls</code> 指向該位址，並讓 <code>webhook.api_key</code> 與 <code>relay.livekit_api_key</code> 一致（中繼會驗證簽章負載；遺漏的事件由輪詢核對）。解除群組的 LiveKit 模式會清除該清單。
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
