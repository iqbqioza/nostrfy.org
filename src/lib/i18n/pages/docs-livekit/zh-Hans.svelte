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
	title="LiveKit 音视频房间"
	description="通过 LiveKit 服务器为 NIP-29 群组提供音视频房间：令牌端点、JWT 签发和公布房间的群组元数据。"
/>

<div class="doc-body">
	<h2>设置</h2>
	<ol>
		<li>
			在配置文件中设置 <code>relay.livekit_url</code>、<code>relay.livekit_api_key</code> 和
			<code>relay.livekit_api_secret</code>。
		</li>
		<li>
			通过管理员的 <code>kind:9002</code> 编辑，向群组元数据添加 <code>livekit</code> 标签。
		</li>
		<li>
			客户端使用 NIP-98 认证从 <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> 获取
			JWT（被 NIP-86 <code>banpubkey</code> 封禁的公钥会被拒绝）。
		</li>
	</ol>

	<h2>检查支持</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 表示房间服务器已启用。"
	/>

	<h3>配置</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		LiveKit 设置在启动时固定 — 更改它们需要重启。
	</Callout>
</div>
