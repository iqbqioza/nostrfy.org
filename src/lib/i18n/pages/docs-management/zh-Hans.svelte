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
	title="NIP-86 管理"
	description="JSON-RPC 管理 API：审核、访问列表、中继身份、角色、邀请码和委派方法授权，支持 Bearer 或 NIP-98 认证。"
/>

<div class="doc-body">
	<h2>启用</h2>
	<p>
		NIP-86 是用于管理中继的 JSON-RPC API。它需要两种认证方式之一，
		否则每次调用都会被拒绝：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方式</th>
				<th>设置</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Bearer token</td>
				<td>
					设置 <code>rpc.management_token</code> 并发送 <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					设置 <code>rpc.admin_pubkey</code> 并发送由管理员密钥签名的 NIP-98 认证事件
					（kind 27235），放在 <code>Authorization: Nostr &lt;base64&gt;</code> 中 — 需要一个
					<code>payload</code> 标签；每个事件在其 60 秒窗口内只能使用一次
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>调用 API</h2>
	<p>POST /，使用 <code>Content-Type: application/nostr+json+rpc</code>：</p>
	<CodeBlock code={call} lang="bash" />

	<h2>方法</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方法</th>
				<th>参数</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr><td><code>supportedmethods</code></td><td>[]</td><td>支持的方法列表</td></tr>
			<tr><td><code>banpubkey</code></td><td>["pubkey", "reason (optional)"]</td><td>封禁公钥使其不能发布（同时将其从白名单移除）</td></tr>
			<tr><td><code>unbanpubkey</code></td><td>["pubkey"]</td><td>解封公钥</td></tr>
			<tr><td><code>listbannedpubkeys</code></td><td>[]</td><td>列出被封禁的公钥及原因</td></tr>
			<tr><td><code>allowpubkey</code></td><td>["pubkey", "reason (optional)"]</td><td>加入白名单（同时解除封禁）</td></tr>
			<tr><td><code>unallowpubkey</code></td><td>["pubkey"]</td><td>从白名单移除</td></tr>
			<tr><td><code>listallowedpubkeys</code></td><td>[]</td><td>列出白名单</td></tr>
			<tr><td><code>allowkind</code> / <code>disallowkind</code></td><td>[kind]</td><td>允许 / 禁止某个类型</td></tr>
			<tr><td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td><td>[]</td><td>列出允许 / 禁止的类型</td></tr>
			<tr><td><code>changerelayname</code> / <code>changerelaydescription</code> / <code>changerelayicon</code></td><td>["new value"]</td><td>更改中继名称 / 描述 / 图标（持久化到配置文件；文件无法写入时报告错误）</td></tr>
			<tr><td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td><td>[id, label, description, color, order]</td><td>NIP-43 角色管理（类型错误的字段被拒绝；删除不存在的角色会成功）</td></tr>
			<tr><td><code>assignrole</code> / <code>unassignrole</code></td><td>["pubkey", "role id"]</td><td>分配 / 取消分配角色（重复授予或撤销不存在的角色会成功）</td></tr>
			<tr><td><code>assignmethod</code> / <code>unassignmethod</code></td><td>["pubkey", "method"]</td><td>向非管理员公钥授予 / 撤销 NIP-86 方法 — 只有审核和读取方法可被授予</td></tr>
			<tr><td><code>listmethodassignees</code></td><td>[]</td><td>列出方法授权（<code>[&#123;pubkey, methods&#125;]</code>）</td></tr>
			<tr><td><code>blockip</code> / <code>unblockip</code></td><td>["ip", "reason (optional)"]</td><td>屏蔽 / 解除屏蔽 IP（屏蔽还会断开现有连接）</td></tr>
			<tr><td><code>listblockedips</code></td><td>[]</td><td>列出被封 IP</td></tr>
			<tr><td><code>banevent</code></td><td>["event id", "reason (optional)"]</td><td>封禁事件（封禁未知 id 会预先封禁；同时将其从允许列表移除）</td></tr>
			<tr><td><code>allowevent</code></td><td>["event id", "reason (optional)"]</td><td>将事件加入允许列表（同时解除封禁；允许未知 id 会预先允许）</td></tr>
			<tr><td><code>unallowevent</code> / <code>unbanevent</code></td><td>["event id"]</td><td>从允许 / 封禁列表移除事件（条目不存在也会成功）</td></tr>
			<tr><td><code>listbannedevents</code></td><td>[]</td><td>列出被封禁的事件（查询失败会显示错误，绝不会返回空列表）</td></tr>
			<tr><td><code>listallowedevents</code></td><td>[]</td><td>列出允许的事件</td></tr>
			<tr><td><code>listeventsneedingmoderation</code></td><td>[]</td><td>等待审核的事件（此中继上始终为空）</td></tr>
			<tr><td><code>listclaims</code></td><td>[]</td><td>列出 NIP-43 邀请码</td></tr>
			<tr><td><code>createclaim</code> / <code>deleteclaim</code></td><td>["claim"]</td><td>签发 / 撤销 NIP-43 邀请码（携带已列码的 kind:28934 会接纳其作者）</td></tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="委派管理">
		<code>rpc.admin_pubkey</code>（和管理令牌）仍是拥有所有方法的根登录。其他
		公钥用 NIP-98 认证，并且只能运行通过 <code>assignmethod</code> 授予它们的方法
		（<code>supportedmethods</code> 显示它们自己的子集）。权限、角色、邀请码和中继身份
		管理保持仅管理员，因此被授权者永远无法提权。被封禁的公钥即使有授权也会被拒绝。
	</Callout>

	<Callout type="note" title="在公共 POST / 路由上提供">
		NIP-86 RPC 挂载在中继的公共 POST / 路由上。变更会以已认证身份记录在
		限速审计日志中（每分钟最多 600 条）。超过 <code>rpc.max_admin_body_bytes</code> 的请求
		会被 413 拒绝。
	</Callout>
</div>
