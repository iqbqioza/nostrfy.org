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
		<li>
			中继为每个 livekit 群组发布 <code>kind:39004</code> 参与者列表，每 <code>relay.livekit_participants_interval_secs</code>（默认 15）刷新一次，并在 LiveKit 向 <code>/.well-known/nip29/livekit/webhook</code> 发送 Webhook 时立即刷新 — 将 LiveKit 服务器的 <code>webhook.urls</code> 指向该地址，并让 <code>webhook.api_key</code> 与 <code>relay.livekit_api_key</code> 一致（中继会验证签名负载；遗漏的事件由轮询核对）。解除群组的 LiveKit 模式会清除该列表。
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
