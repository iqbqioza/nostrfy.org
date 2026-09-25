<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);
</script>

<DocsTitle
	title="NIP-29 群组"
	description="NIP-29 群组：只有成员可以写入的封闭聊天空间，带管理事件和中继签名的群组状态快照。"
/>

<div class="doc-body">
	<h2>启用群组</h2>
	<ol>
		<li>
			运行 <code>nostrfy genkey</code> 以设置 <code>relay.private_key</code>
			（<strong>必需</strong> — 没有它就不会生成群组元数据）。
		</li>
		<li>重启中继。</li>
	</ol>

	<h2>群组如何工作</h2>
	<p>
		群组由事件创建和管理。中继从这些管理事件生成中继签名的快照，供客户端显示使用：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>事件</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>创建群组（创建者成为管理员）</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>添加成员（带角色）/ 移除成员</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>编辑元数据（名称、描述、公开/私密……）</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>删除事件（管理）</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>删除群组（其存储的事件被清除）</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>创建邀请码</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>更新置顶列表</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>加入请求 / 离开请求</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>中继签名的快照</h3>
	<ul>
		<li><code>kind:39000</code> — 群组元数据（名称、可见性设置……）</li>
		<li><code>kind:39001</code> — 管理员列表</li>
		<li><code>kind:39002</code> — 成员列表</li>
		<li><code>kind:39005</code> — 置顶事件</li>
	</ul>

	<h2>群组可见性设置</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>标签</th>
				<th>含义</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>只有成员可以读取消息</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>只有成员可以写入</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>元数据对非成员隐藏</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>加入请求不会自动批准（需要邀请码）</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>该群组有 LiveKit 音视频房间</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>子群组</h2>
	<p>
		群组可以层级化 — 用 <code>parent</code> / <code>child</code> 标签嵌套。循环会被
		自动拒绝。
	</p>

	<Callout type="warning" title="离开群组">
		任何成员 — 包括群组的最后一位管理员 — 都可以用 <code>kind:9022</code> 离开并被
		自动移除；如果最后一位管理员离开，群组将没有管理员。请先授予另一位管理员，
		或用 <code>kind:9008</code> 删除群组，或用中继自己的密钥（<code>relay.private_key</code>，即 NIP-11 self 公钥）
		签署一条管理事件来恢复无管理员的群组。具体做法见
		<a href={p('/docs/troubleshooting/')}>故障排除</a>。
	</Callout>
</div>
