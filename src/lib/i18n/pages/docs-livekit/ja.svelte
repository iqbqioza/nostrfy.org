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
	title="LiveKit 音声・ビデオルーム"
	description="LiveKit サーバー経由の NIP-29 グループ向け音声・ビデオルーム:トークンエンドポイント、JWT 署名、ルームを告知するグループメタデータ。"
/>

<div class="doc-body">
	<h2>セットアップ</h2>
	<ol>
		<li>
			設定ファイルで <code>relay.livekit_url</code>、<code>relay.livekit_api_key</code> と
			<code>relay.livekit_api_secret</code> を設定します。
		</li>
		<li>
			管理者の <code>kind:9002</code> 編集でグループのメタデータに
			<code>livekit</code> タグを追加します。
		</li>
		<li>
			クライアントは NIP-98 認証で <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> から JWT を取得します
			(NIP-86 の <code>banpubkey</code> で禁止された公開鍵は拒否されます)。
		</li>
	</ol>

	<h2>サポートの確認</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 はルームサーバーが有効なことを示します。"
	/>

	<h3>設定</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		LiveKit の設定は起動時に固定されます — 変更には再起動が必要です。
	</Callout>
</div>
