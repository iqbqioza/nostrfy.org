<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# 先 dry-run — 验证每个事件，不写入任何内容
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# 导入（先停止 nostrfy 中继）
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="命令参考"
	description="所有 nostrfy 命令：init、start、stop、stats、upgrade 和 migrate-strfry，外加 CLI 访问列表和 inbox/outbox 订阅过滤器。"
/>

<div class="doc-body">
	<h2>概览</h2>
	<p>所有命令都接受 <code>--config &lt;path&gt;</code>（默认 <code>nostrfy.toml</code>）。</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>命令</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>写入默认 nostrfy.toml 并退出；文件以 0600 权限创建</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>为 NIP-29 群组生成密钥，写入 relay.private_key，将配置设为 0600 并打印公钥；当文件在读取后发生变化时中止而不写入</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>校验配置（启动前运行）</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>以守护进程方式启动；<code>--foreground</code> 在终端中运行</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>停止正在运行的守护进程</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>停止并重新启动（重新读取配置）</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>显示实时统计</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>将二进制更新到最新 GitHub 发布版（或指定版本）；下载匹配平台的资产，校验其 sha256 校验和并运行 <code>--version</code> 探测，然后原子替换二进制；并发运行通过锁文件串行化；除非指定版本，否则不会降级；<code>--force</code> 重新安装</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>从 strfry 中继导入事件 — 可通过 <code>--strfry-db</code> 运行 <code>strfry export</code>，用 <code>--input</code> 读取 JSONL 文件，或通过 stdin 管道输入；可重复运行，支持 <code>--dry-run</code>、<code>--since</code> 和可选的设置合并</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>管理访问列表</h2>
	<p>
		中继公钥白名单/黑名单和 Blossom 上传白名单存储在 LMDB 中并立即生效 —
		运行中的守护进程会自动重载：
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>被拒绝的公钥在发布时始终被拒绝，读取时也永远不会被提供。</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> 从持久化的 NIP-86 被封 IP 列表中移除一个 IP
		（自我锁定恢复）；重启守护进程以生效。
	</p>

	<h2>Inbox/outbox 订阅过滤器</h2>
	<p>
		nostrfy 为 inbox/outbox 路由模型扩展了 REQ 过滤器语法，增加了两个便捷键 — 这是 nostrfy
		扩展，不属于任何 NIP。<code>"outbox"</code> 展开为 <code>"authors"</code>：只包含<em>由</em>该公钥<em>创作</em>的事件。
		<code>"inbox"</code> 展开为 <code>"#p"</code>：只包含<em>发给</em>该公钥的事件（提及、回复、Zap 和私信）。
		值可以是 64 位十六进制或 <code>npub1</code> 编码，也可以是与现有 <code>authors</code>/<code>#p</code>
		键合并的数组；无效的公钥会拒绝该订阅：
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		端点也有写入限制：<code>/outbox</code> 只接受由连接的 NIP-42 认证公钥创作的事件
		（<code>server.outbox_write_policy = "any"</code>），或仅接受中继自身的事件（<code>"relay"</code>）；
		<code>/inbox</code> 只接受带有 <code>p</code> 标签的事件。
	</p>

	<h2>从 strfry 迁移</h2>
	<p>
		用一条命令导入现有 strfry 中继的事件。迁移是离线的（先停止 nostrfy 中继 — 数据库被占用时它会拒绝运行），
		读取 strfry 自己的导出格式，且可安全重复运行：重复项被跳过，删除副作用会重新应用。
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		它还会提议将等效的 strfry 设置合并到 <code>nostrfy.toml</code>，并可在中断后用 <code>--since</code>
		续传。NIP-29 群组和 NIP-43 角色会在首次启动时从导入的事件重建。完整操作手册见
		<a href={p('/docs/migrating-from-strfry/')}>迁移指南</a>。
	</p>

	<Callout type="tip" title="分步说明">
		大多数命令在<a href={p('/docs/quick-start/')}>快速开始指南</a>中也有分步说明。
	</Callout>
</div>
