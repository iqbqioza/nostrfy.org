<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. 停止 nostrfy 中继（迁移需要数据库目录）
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. dry run — 解析并验证每个事件，不写入任何内容
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. 导入
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. 启动 — NIP-29 群组和 NIP-43 角色从导入的事件重建
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # NIP-42/62/98 和 NIP-29 元数据需要
private_key = "..."                       # NIP-29/43 中继签名元数据需要

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# 选项 A — nostrfy 自己运行 \`strfry export\`（strfry 在 PATH 中）
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# 选项 B — 你自己导出到文件
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# 选项 C — 管道（stdin 是默认输入）
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # 用于 nak（WebSocket）
H=https://relay.example.com    # 用于 curl（HTTP）

nak relay "$R"                              # 中继响应并公布其 NIP
curl -s "$H/api/v1/query?limit=1"           # 事件可被提供
nak req -i <deleted-event-id> "$R"          # 已删除的事件保持消失
nak req -k 39000 "$R"                       # NIP-29 群组元数据（如已迁移）
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # NIP-43 成员列表（AUTH）`;
</script>

<DocsTitle
	title="从 strfry 迁移"
	description="用一条命令将现有 strfry 中继的事件迁移到 nostrfy — 准备、dry-run、迁移、验证和回滚。"
/>

<div class="doc-body">
	<h2>一览</h2>
	<p>
		<code>nostrfy migrate-strfry</code> 读取
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		自己的导出格式（JSONL，每行一个 NIP-01 事件），因此可跨 strfry 数据库版本，且不依赖 strfry
		内部的 LMDB schema。它从不写入 strfry 数据库。
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>已迁移</th>
					<th>未迁移</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>每个已存储的事件（应用可替换/可寻址语义）</td>
					<td>没有 nostrfy 等效项的 strfry 设置（合并报告会列出每一项及原因）</td>
				</tr>
				<tr>
					<td>NIP-40 过期 — 已过期的事件被跳过</td>
					<td>Blossom 媒体及其所有者映射（strfry 没有 Blossom 服务器）</td>
				</tr>
				<tr>
					<td>NIP-09 删除，包括 strfry 已物理删除的事件的重新发布阻止</td>
					<td>访问列表（NIP-86 封禁、中继公钥列表、Blossom 白名单）</td>
				</tr>
				<tr>
					<td>NIP-29 <code>9005</code>/<code>9008</code> 管理副作用</td>
					<td>NIP-43 邀请码（用 <code>createclaim</code> 签发新的）</td>
				</tr>
				<tr>
					<td>首次出现时间戳（配置了新公钥门槛时）</td>
					<td>NIP-62 消除请求，除非给出 <code>--apply-vanish</code></td>
				</tr>
				<tr>
					<td>NIP-29 群组、NIP-43 角色及其中继签名元数据，在首次启动时重建</td>
					<td>中继自身的身份/密钥（它们位于 <code>nostrfy.toml</code>）</td>
				</tr>
				<tr>
					<td>等效的 strfry 设置，可选择合并到 <code>nostrfy.toml</code></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		摘要中的预期跳过：<strong>临时事件</strong>（类型 20000-29999，nostrfy 从不存储）和
		<strong>已过期事件</strong>。
	</p>

	<h2>快速开始</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="迁移是离线的">
		它直接写入 <code>database.path</code>，当 nostrfy 守护进程（或另一个迁移）占用数据库目录时会拒绝运行。
		<strong>请先停止中继。</strong>strfry 本身可以继续运行 — <code>strfry export</code> 读取一致的快照。
	</Callout>

	<h2>环境要求</h2>
	<ul>
		<li>
			<code>strfry</code> 二进制（用于 <code>--strfry-db</code>），或你自己导出的 JSONL 文件。
		</li>
		<li>nostrfy v0.1.15 或更高版本（<code>migrate-strfry</code> 子命令）。</li>
		<li>目标中继的 nostrfy 配置，已设置 <code>database.path</code>、<code>public_url</code> 和
			<code>private_key</code>。</li>
		<li>
			空闲磁盘空间：大约为 strfry 导出加上其索引的大小。NIP-50 词索引会增加
			一些；磁盘非常紧张时可先禁用（<code>database.search_index = false</code>），
			迁移后再启用（索引在启动时重建）。
		</li>
		<li>目标 <code>database.path</code> 上没有运行中的 nostrfy 实例。</li>
	</ul>

	<h2>准备配置</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		如果没有中继密钥，用 <code>nostrfy genkey</code> 生成，然后校验：
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>合并 strfry 设置（可选）</h3>
	<p>
		在打开数据库之前，<code>migrate-strfry</code> 会查找 strfry 的配置
		（<code>--strfry-config</code>，然后 <code>$STRFRY_CONFIG</code>、<code>/etc/strfry.conf</code>、
		<code>./strfry.conf</code>），打印有 nostrfy 等效项且与你的
		<code>nostrfy.toml</code> 不同的设置，并询问是否合并。只重写列出的键 — 注释
		和所有其他行都保留，会使配置无效的值会被跳过并说明原因，其余仍然合并。
	</p>
	<ul>
		<li><code>--merge-config</code> 不经询问直接应用（用于脚本）；<code>--no-merge-config</code> 跳过该步骤。</li>
		<li>没有终端时，会打印建议，除非给出 <code>--merge-config</code>，否则跳过合并。</li>
		<li><code>--dry-run</code> 打印建议但从不写入。</li>
	</ul>

	<h2>Dry run</h2>
	<p>先看再跳 — dry run 解析并验证整个导出，而不触碰数据库：</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		非零的 <code>bad signature</code> 计数意味着导出包含 strfry 未经
		校验就接受的事件；它们会被跳过。如果信任它们，传 <code>--no-verify</code> 仍然导入。
	</p>

	<h2>迁移</h2>
	<p>选择三种输入模式之一 — 结果完全相同：</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>标志</th>
					<th>用途</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry 不在 <code>PATH</code> 中</td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>续传/追赶：<code>created_at</code> 为该值或更新的事件（含边界）</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>处理导出中发现的 NIP-62 消除请求（默认关闭）</td></tr>
				<tr><td><code>--no-verify</code></td><td>对可信转储跳过签名验证（更快）</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>每个数据库事务的事件数（默认 512）</td></tr>
				<tr><td><code>--dry-run</code></td><td>只解析和验证</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		迁移<strong>可安全重复运行</strong>：重复项被跳过，删除副作用会
		重新应用，因此中断的运行可以直接重跑（或用 <code>--since</code> 续传）。
	</p>

	<h2>启动与验证</h2>
	<p>
		首次启动会从导入的事件重建 NIP-29 群组存储和 NIP-43 角色存储，并
		重新发布中继签名的元数据（每个群组的 <code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>，
		以及 <code>13534</code> 成员列表）。大型数据库可能需要一会儿；请观察日志。
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		如需精确的数量对比，<code>strfry scan '&#123;&#125;' | wc -l</code> 减去迁移摘要中报告的临时/过期事件
		应等于客户端能取回的数量。
	</p>

	<h2>恢复中断的迁移</h2>
	<Callout type="warning" title="重新运行前不要启动中继">
		NIP-29 群组副作用（<code>9005</code>/<code>9008</code>）在导入之后应用；中断的运行
		已存储这些事件但尚未执行删除，因此首次启动可能会提供删除本应移除的群组
		历史。请先重新运行迁移 — 它会完成副作用（清除是幂等的）— 然后再启动中继。
	</Callout>
	<ul>
		<li>
			<strong>导出到文件/管道：</strong>重新运行同一命令。重复项被跳过，删除
			阻止会重新应用。
		</li>
		<li>
			<strong>使用了 <code>--strfry-db</code>：</strong>摘要会打印续传提示；用那个
			<code>--since</code> 重新运行（含边界，边界秒会重新导入并去重）。
		</li>
		<li>
			如果运行失败并显示 <code>database writer unavailable</code>，检查空闲磁盘空间和
			<code>database.map_size</code>，然后重跑。
		</li>
	</ul>

	<h2>回滚</h2>
	<p>迁移只写入 nostrfy 数据库。要回滚，停止中继并恢复迁移前的数据库，或将其删除：</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # 或恢复迁移前的备份'} lang="sh" />

	<h2>故障排除</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>消息</th>
					<th>原因 / 修复</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>nostrfy 守护进程（或另一个迁移）占用了目录：先 <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> 必须指向包含 <code>data.mdb</code> 的目录</td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>安装 strfry、设置 <code>--strfry-bin</code>，或使用 <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>写入线程停止或队列过载：检查磁盘/映射大小，重跑（安全）</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>清除被中断：重新运行迁移</td>
				</tr>
				<tr>
					<td>高 <code>bad signature</code> 计数</td>
					<td>strfry 数据库包含未验证的事件：检查它们；仅当信任来源时才用 <code>--no-verify</code> 导入</td>
				</tr>
				<tr>
					<td>启动后缺少 NIP-29 元数据</td>
					<td>没有 <code>relay.private_key</code>：运行 <code>nostrfy genkey</code> 并重启</td>
				</tr>
				<tr>
					<td>未提供设置合并</td>
					<td>未找到 strfry 的配置：传 <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>检查清单</h2>
	<ul>
		<li>nostrfy 中继已停止</li>
		<li>strfry 数据库和 nostrfy 配置已备份</li>
		<li><code>nostrfy check</code> 通过</li>
		<li>strfry 设置已合并（或报告已审阅）</li>
		<li>dry run 已审阅（无意外的坏签名）</li>
		<li>迁移无错误完成</li>
		<li>中继启动；群组/角色重建已记录</li>
		<li>事件数量匹配（减去临时/过期）</li>
		<li>已删除的事件保持消失（重新发布被拒绝）</li>
		<li>以匿名和成员身份检查了私密群组可见性</li>
		<li>反向代理 / DNS / 客户端中继列表已更新</li>
	</ul>

	<Callout type="tip" title="strfry 还在运行？">
		如果导出期间 strfry 保持在线，在准备切换时做一次追赶运行：停止 nostrfy，
		用 <code>--since &lt;last created_at&gt;</code> 重新运行迁移，然后再次启动。
	</Callout>
</div>
