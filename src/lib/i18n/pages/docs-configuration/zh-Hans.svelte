<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="配置参考"
	description="nostrfy.toml 的完整参考：每个键、类型、默认值及其确切作用 — 限制、数据库、守护进程、访问控制和 Blossom。"
/>

<div class="doc-body">
	<h2>基础</h2>
	<p>
		配置是一个 <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a> 文件，默认名为 <code>nostrfy.toml</code>。用 <code>init</code> 创建它：
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>校验它（建议每次启动前都执行）：</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>每个命令都接受 <code>--config &lt;path&gt;</code>（默认 <code>nostrfy.toml</code>）。</p>
	<p>通用语法：</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>配置段</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>段</th><th>用途</th></tr></thead>
		<tbody>
			<tr><td><code>[relay]</code></td><td>身份、URL 和 NIP 开关</td></tr>
			<tr><td><code>[server]</code></td><td>网络绑定、API 拆分、指标</td></tr>
			<tr><td><code>[rpc]</code></td><td>NIP-86 管理 RPC（认证、请求体限制）</td></tr>
			<tr><td><code>[limits]</code></td><td>所有限制和过载保护</td></tr>
			<tr><td><code>[database]</code></td><td>LMDB 存储、搜索索引、队列上限</td></tr>
			<tr><td><code>[daemon]</code></td><td>PID、日志和统计文件及轮转</td></tr>
			<tr><td><code>[access]</code></td><td>初始访问控制列表（运行时可更改）</td></tr>
			<tr><td><code>[blossom]</code></td><td>Blossom 文件服务器（媒体托管）</td></tr>
		</tbody>
	</table>
	</div>
	<p>每个键都是可选的；缺少的键使用其默认值。</p>

	<h2>[relay] 段 — 中继身份</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>name</code></td><td>string</td><td><code>"nostrfy"</code></td><td>通过 NIP-11 向客户端显示的中继名称</td></tr>
			<tr><td><code>description</code></td><td>string</td><td><code>"A minimal and stable Nostr relay"</code></td><td>中继描述（NIP-11）</td></tr>
			<tr><td><code>pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>管理员公钥（NIP-11 pubkey 字段）</td></tr>
			<tr><td><code>contact</code></td><td>string</td><td><code>""</code></td><td>管理员联系 URI（mailto: 或 https://）</td></tr>
			<tr><td><code>icon</code></td><td>string</td><td><code>""</code></td><td>中继图标图片 URL</td></tr>
			<tr><td><code>post_policy</code></td><td>string</td><td><code>""</code></td><td>指向中继发布政策的 URL</td></tr>
			<tr><td><code>private_key</code></td><td>string (64 hex)</td><td><code>""</code></td><td>中继自身的密钥；NIP-29 群组需要</td></tr>
			<tr><td><code>public_url</code></td><td>string</td><td><code>""</code></td><td>公共 URL，例如 wss://relay.example.com</td></tr>
			<tr><td><code>livekit_url</code></td><td>string</td><td><code>""</code></td><td>用于 NIP-29 音视频房间的 LiveKit 服务器 URL</td></tr>
			<tr><td><code>livekit_api_key</code></td><td>string</td><td><code>""</code></td><td>LiveKit API key</td></tr>
			<tr><td><code>livekit_api_secret</code></td><td>string</td><td><code>""</code></td><td>LiveKit API secret（用于签发 JWT）</td></tr>
			<tr><td><code>enabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>显式 NIP 白名单</td></tr>
			<tr><td><code>disabled_nips</code></td><td>array of integers</td><td><code>[]</code></td><td>要禁用的 NIP（enabled_nips 非空时忽略）</td></tr>
			<tr><td><code>reject_ephemeral</code></td><td>boolean</td><td><code>false</code></td><td>拒绝 NIP-01 临时事件（类型 20000-29999）</td></tr>
			<tr><td><code>enabled_git</code></td><td>boolean</td><td><code>false</code></td><td>接受 NIP-34 git 事件（类型 1617-1633、30617/30618）</td></tr>
			<tr><td><code>require_pow</code></td><td>integer</td><td><code>0</code></td><td>要求的工作量证明前导零位数</td></tr>
			<tr><td><code>new_pubkey_min_age_secs</code></td><td>integer</td><td><code>0</code></td><td>拒绝来自比该值更“年轻”的公钥的事件（秒；0 = 关闭）</td></tr>
			<tr><td><code>max_events_per_min_per_pubkey</code></td><td>integer</td><td><code>0</code></td><td>每个公钥的发布速率限制（每分钟；0 = 无限制）</td></tr>
			<tr><td><code>max_groups</code></td><td>integer</td><td><code>1000</code></td><td>内存中 NIP-29 群组存储的上限</td></tr>
			<tr><td><code>require_auth</code></td><td>boolean</td><td><code>false</code></td><td>对 REQ/EVENT/COUNT/NEG 要求 NIP-42 认证</td></tr>
			<tr><td><code>send_auth_challenge</code></td><td>boolean</td><td><code>true</code></td><td>连接时发送 AUTH 挑战</td></tr>
			<tr><td><code>enabled_nip78_auth</code></td><td>boolean</td><td><code>true</code></td><td>接受 kind 78/30078 事件前要求 NIP-42 AUTH</td></tr>
			<tr><td><code>enabled_command_events</code></td><td>boolean</td><td><code>false</code></td><td>执行由管理员公钥发布的 kind:1 运维命令</td></tr>
		</tbody>
	</table>
	</div>
	<h3>键详情</h3>
	<ul>
		<li>
			<strong>private_key</strong> — 中继自身的密钥，用于签署中继生成的事件：NIP-29 群组元数据（39000-39005）和 NIP-43 角色/成员事件。用 <code>nostrfy genkey</code> 生成；请保密。它只在启动时读取一次，因此更改它需要重启。
		</li>
		<li>
			<strong>public_url</strong> — 用于校验客户端发来的带 URL 标签：NIP-42 AUTH、NIP-62 消除和 NIP-98 管理认证。为空时，中继回退到 <code>host:port</code>，而绑定 <code>0.0.0.0</code> 或 <code>127.0.0.1</code> 时它永远不会匹配真实客户端 URL（会记录警告）。<strong>务必设置它。</strong>
		</li>
		<li>
			<strong>enabled_nips 与 disabled_nips</strong> — 白名单优先：当 <code>enabled_nips</code> 非空时，只公布其中的 NIP，<code>disabled_nips</code> 被忽略。两者都需要重启。
		</li>
		<li>
			<strong>reject_ephemeral</strong> — 类型 20000-29999 被拒绝，但 NIP 要求转发的豁免类型仍会转发：22242、27235、28934/28935/28936、24133、23194/23195、24242 和 21059。SIGHUP 时生效。
		</li>
		<li>
			<strong>enabled_git</strong> — 可选的 NIP-34：接受类型 1617-1633 和 30617/30618 并公布 NIP-34。默认关闭，因为补丁负载可能很大。SIGHUP 时生效。
		</li>
	</ul>

	<h2>[server] 段 — 服务器设置</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>"127.0.0.1"</code></td><td>绑定地址；0.0.0.0 接受来自任何位置的连接</td></tr>
			<tr><td><code>port</code></td><td>integer</td><td><code>8080</code></td><td>端口（1-65535）；80 端口需要 root</td></tr>
			<tr><td><code>api_host</code></td><td>string</td><td><code>""</code></td><td>专用于 REST API 的主机名</td></tr>
			<tr><td><code>metrics_enabled</code></td><td>boolean</td><td><code>true</code></td><td>在 /metrics 提供 Prometheus 指标</td></tr>
			<tr><td><code>ws_paths</code></td><td>string</td><td><code>"root"</code></td><td>WebSocket 端点路径：root、inbox-outbox 或 all</td></tr>
			<tr><td><code>inbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>谁可以写入 /inbox："any" 或 "relay"（事件仍须带 p 标签）</td></tr>
			<tr><td><code>outbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>谁可以写入 /outbox："any"（NIP-42 认证公钥自己的事件）或 "relay"</td></tr>
			<tr><td><code>trusted_proxies</code></td><td>array of strings</td><td><code>[]</code></td><td>其 X-Forwarded-For 受信任的反向代理地址/CIDR（空 = 不信任任何代理）</td></tr>
		</tbody>
	</table>
	</div>
	<h3>键详情</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> 绑定所有 IPv4 接口；<code>127.0.0.1</code> 仅本机。</li>
		<li><strong>port</strong> — 1-65535；80 端口需要 root。这一个端口同时提供 WebSocket 中继、NIP-11 文档、REST API 和 NIP-86 RPC。</li>
		<li>
			<strong>api_host</strong> — 将 REST API 专用于单个主机名，使 API 和中继可以在反向代理后共享一个端口。启动时固定 — 需要重启。
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> 只提供 /，<code>inbox-outbox</code> 只提供 /inbox 和 /outbox，<code>all</code> 两者都提供。启动时固定 — 需要重启。
		</li>
		<li>
			<strong>trusted_proxies</strong> — 只列出代理自身的地址（同主机上 nginx/Caddy 用回环地址，云端用负载均衡器的源网段）。设置后，客户端 IP 从最后一个不受信任的 <code>X-Forwarded-For</code> 条目推导，用于按 IP 的上限、速率限制、<code>blockip</code> 和日志。切勿添加客户端能直接访问的地址 — 它们可以伪造该头并绕过按 IP 限制。启动时固定 — 需要重启。
		</li>
	</ul>

	<h2>[rpc] 段 — NIP-86 管理</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>management_token</code></td><td>string</td><td><code>""</code></td><td>管理 API 的 Bearer token</td></tr>
			<tr><td><code>admin_pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>用于 NIP-98 管理认证的管理员公钥</td></tr>
			<tr><td><code>max_admin_body_bytes</code></td><td>integer</td><td><code>65536</code></td><td>NIP-86 管理 RPC 的请求体限制</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		NIP-86 RPC 挂载在中继的公共 <code>POST /</code> 路由上 — 没有单独的管理端口。旧指南中 <code>management_token</code> 和 <code>admin_pubkey</code> 有时出现在 <code>[server]</code> 下；那些写法是这些 <code>[rpc]</code> 键的遗留别名。
	</p>

	<h2>[limits] 段 — 限制与保护</h2>
	<h3>连接与消息</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>max_connections</code></td><td>integer</td><td><code>10000</code></td><td>最大并发连接数</td></tr>
			<tr><td><code>max_connections_per_ip</code></td><td>integer</td><td><code>64</code></td><td>每个源 IP 的最大连接数</td></tr>
			<tr><td><code>max_ws_message_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>每条 WebSocket 消息/帧的最大字节数</td></tr>
			<tr><td><code>socket_recv_buffer_kb</code></td><td>integer</td><td><code>64</code></td><td>每连接内核接收缓冲区（KiB）</td></tr>
			<tr><td><code>max_out_queue_bytes</code></td><td>integer</td><td><code>262144</code></td><td>每连接出站队列上限（字节）</td></tr>
			<tr><td><code>ws_idle_timeout_secs</code></td><td>integer</td><td><code>300</code></td><td>空闲连接在此时间后关闭</td></tr>
			<tr><td><code>http_read_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>HTTP 请求头超时（slow-loris 防御）</td></tr>
			<tr><td><code>max_connections_per_sec_per_ip</code></td><td>integer</td><td><code>0</code></td><td>每个源 IP 每秒最大新连接数</td></tr>
		</tbody>
	</table>
	</div>
	<h3>订阅与查询</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>max_filters</code></td><td>integer</td><td><code>20</code></td><td>每个 REQ 的最大过滤器数</td></tr>
			<tr><td><code>max_subscriptions</code></td><td>integer</td><td><code>20</code></td><td>每连接的最大订阅数</td></tr>
			<tr><td><code>max_limit</code></td><td>integer</td><td><code>500</code></td><td>REQ limit 的上限</td></tr>
			<tr><td><code>max_count</code></td><td>integer</td><td><code>2000</code></td><td>COUNT 结果的上限</td></tr>
			<tr><td><code>max_sub_id_len</code></td><td>integer</td><td><code>64</code></td><td>订阅 id 最大长度（字符，非字节）</td></tr>
			<tr><td><code>max_sub_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>每连接的订阅过滤器总字节数</td></tr>
			<tr><td><code>max_req_response_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>单个 REQ 响应可发送的总字节上限</td></tr>
		</tbody>
	</table>
	</div>
	<h3>事件</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>max_content_bytes</code></td><td>integer</td><td><code>65536</code></td><td>事件内容最大字符数</td></tr>
			<tr><td><code>max_tags</code></td><td>integer</td><td><code>2000</code></td><td>每个事件的最大标签数</td></tr>
			<tr><td><code>max_tag_value_bytes</code></td><td>integer</td><td><code>1024</code></td><td>每个标签值的最大字节数</td></tr>
			<tr><td><code>max_created_at_future_secs</code></td><td>integer</td><td><code>3600</code></td><td>容忍的 created_at 未来偏移</td></tr>
			<tr><td><code>group_late_publish_secs</code></td><td>integer</td><td><code>3600</code></td><td>容忍的 NIP-29 群组管理事件延迟（秒）</td></tr>
			<tr><td><code>max_neg_items</code></td><td>integer</td><td><code>100000</code></td><td>每次 NIP-77 negentropy 同步的最大记录数</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		遗留别名：<code>limits.require_pow</code>、<code>limits.new_pubkey_min_age_secs</code> 和 <code>limits.max_indexed_words</code> 仍被接受为 <code>relay.require_pow</code>、<code>relay.new_pubkey_min_age_secs</code> 和 <code>database.max_indexed_words</code> 的别名。
	</p>
	<h3>REST API</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>max_api_concurrent</code></td><td>integer</td><td><code>8</code></td><td>最大并发 /api/v1 请求数</td></tr>
			<tr><td><code>max_api_limit</code></td><td>integer</td><td><code>5000</code></td><td>API limit 参数的上限</td></tr>
			<tr><td><code>max_api_offset</code></td><td>integer</td><td><code>50000</code></td><td>API offset 参数的上限</td></tr>
			<tr><td><code>max_api_fetch</code></td><td>integer</td><td><code>55001</code></td><td>offset 查询的最大预取窗口 — 必须覆盖 max_api_offset + max_api_limit + 1（0 = 无限制）</td></tr>
			<tr><td><code>max_api_search_bytes</code></td><td>integer</td><td><code>2048</code></td><td>API search 参数的最大字节数</td></tr>
		</tbody>
	</table>
	</div>
	<h3>实时扇出</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>live_batch_interval_ms</code></td><td>integer</td><td><code>20</code></td><td>实时事件刷新频率（毫秒）</td></tr>
			<tr><td><code>live_batch_size</code></td><td>integer</td><td><code>32</code></td><td>每个实时批次的最大事件数</td></tr>
			<tr><td><code>live_buffer</code></td><td>integer</td><td><code>65536</code></td><td>实时扇出队列大小</td></tr>
		</tbody>
	</table>
	</div>

	<h2>[database] 段 — 数据库</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>path</code></td><td>string</td><td><code>"./data"</code></td><td>数据库目录（LMDB）</td></tr>
			<tr><td><code>max_dbs</code></td><td>integer</td><td><code>32</code></td><td>LMDB 最大命名数据库数</td></tr>
			<tr><td><code>max_readers</code></td><td>integer</td><td><code>128</code></td><td>LMDB 最大并发读取者数</td></tr>
			<tr><td><code>map_size</code></td><td>integer</td><td><code>1073741824</code> (1 GB)</td><td>内存映射大小的下限（字节）</td></tr>
			<tr><td><code>max_map_size</code></td><td>integer</td><td><code>1099511627776</code> (1 TB)</td><td>内存映射上限（字节）</td></tr>
			<tr><td><code>purge_interval_secs</code></td><td>integer</td><td><code>300</code></td><td>NIP-40 清除间隔（秒）</td></tr>
			<tr><td><code>search_index</code></td><td>boolean</td><td><code>true</code></td><td>启用 NIP-50 词索引</td></tr>
			<tr><td><code>reader_threads</code></td><td>integer</td><td><code>2</code></td><td>专用扫描线程</td></tr>
			<tr><td><code>max_indexed_words</code></td><td>integer</td><td><code>32</code></td><td>每个事件内容被索引的单词数</td></tr>
			<tr><td><code>meta_index</code></td><td>boolean</td><td><code>true</code></td><td>写入扫描预过滤使用的每事件元数据头</td></tr>
			<tr><td><code>disabled_fsync</code></td><td>boolean</td><td><code>false</code></td><td>跳过每个写入批次后的同步磁盘刷新</td></tr>
			<tr><td><code>db_buffer_size</code></td><td>integer</td><td><code>2048</code></td><td>每连接 WebSocket 初始缓冲区（字节）</td></tr>
			<tr><td><code>db_request_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>数据库请求在失败前可等待的时长</td></tr>
			<tr><td><code>max_db_queue_msgs</code></td><td>integer</td><td><code>4096</code></td><td>快速失败前排队的待处理消息上限</td></tr>
			<tr><td><code>max_db_queue_events</code></td><td>integer</td><td><code>262144</code></td><td>快速失败前排队批次内的事件上限</td></tr>
			<tr><td><code>max_db_queue_bytes</code></td><td>integer</td><td><code>268435456</code> (256 MiB)</td><td>快速失败前排队的数据库请求字节上限（0 = 无字节上限）</td></tr>
		</tbody>
	</table>
	</div>
	<h3>键详情</h3>
	<ul>
		<li>
			<strong>map_size</strong> — 内存映射的下限：映射始终至少以该大小打开。
		</li>
		<li>
			<strong>max_map_size</strong> — 上限，以稀疏虚拟预留方式打开：物理磁盘只随实际写入的数据增长。当遇到 <code>database map is full</code> 时提高它。
		</li>
		<li>
			<strong>search_index = false</strong> — 搜索仍然可用（针对内容的全词匹配）但扫描会更慢；在微型 VPS 上它可将数据库减半。小型实例推荐。
		</li>
		<li>
			<strong>disabled_fsync</strong> — 以持久性换取吞吐量：写入提交到操作系统页缓存，断电可能丢失最近的写入。
		</li>
	</ul>

	<h2>[daemon] 段 — 守护进程</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>pid_file</code></td><td>string</td><td><code>"./nostrfy.pid"</code></td><td>PID 文件路径</td></tr>
			<tr><td><code>log_file</code></td><td>string</td><td><code>"./nostrfy.log"</code></td><td>日志文件路径</td></tr>
			<tr><td><code>stats_file</code></td><td>string</td><td><code>"./nostrfy.stats.json"</code></td><td>统计文件路径</td></tr>
			<tr><td><code>stats_interval_secs</code></td><td>integer</td><td><code>5</code></td><td>统计写入间隔（秒）</td></tr>
			<tr><td><code>max_log_size_bytes</code></td><td>integer</td><td><code>52428800</code> (50 MB)</td><td>日志轮转大小（0 = 不轮转）</td></tr>
			<tr><td><code>max_log_files</code></td><td>integer</td><td><code>5</code></td><td>保留的轮转日志代数</td></tr>
		</tbody>
	</table>
	</div>
	<p>路径相对于配置文件所在目录解析，因此守护进程更改工作目录后它们仍然有效。</p>

	<h2>[access] 段 — 访问控制</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>restrict_relay</code></td><td>boolean</td><td><code>false</code></td><td>只有白名单中的公钥可以发布</td></tr>
			<tr><td><code>blocked_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>要拒绝的类型</td></tr>
			<tr><td><code>allowed_kinds</code></td><td>array of integers</td><td><code>[]</code></td><td>类型白名单；非空时只接受这些类型</td></tr>
			<tr><td><code>blocked_ips</code></td><td>array of strings</td><td><code>[]</code></td><td>连接时拒绝的 IP 地址</td></tr>
			<tr><td><code>method_grants</code></td><td>table: pubkey → array of strings</td><td><code>&#123;&#125;</code></td><td>非管理员公钥的 NIP-86 方法授权（运行时用 <code>assignmethod</code> 管理）</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		公钥白名单/黑名单<strong>不是</strong>配置键 — 它们位于中继数据库（LMDB）中并在运行时管理：
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — 只有白名单中的公钥可以<strong>发布</strong>，而读取对所有人保持开放（任何客户端仍可订阅和获取）。
		</li>
		<li>被拒绝的公钥在发布时始终被拒绝，读取时也永远不会被提供。</li>
		<li>
			<strong>method_grants</strong> — 非管理员公钥的 NIP-86 方法授权（公钥 → 方法名，例如允许版主使用 <code>banevent</code> 和 <code>listbannedevents</code>）。首次运行时从配置播种，之后在运行时用 NIP-86 <code>assignmethod</code>/<code>unassignmethod</code> 管理（用 <code>listmethodassignees</code> 查看）。只有审核和读取方法可被授权 — 权限、角色、邀请码和中继身份管理保持仅管理员，且被封禁的公钥即使有授权也会被拒绝。参见<a href={p('/docs/management/')}>管理 API</a>。
		</li>
	</ul>

	<h2>[blossom] 段 — Blossom 文件服务器</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>键</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>""</code></td><td>Blossom 服务器的主机名（空 = 禁用）</td></tr>
			<tr><td><code>storage</code></td><td>string</td><td><code>"local"</code></td><td>后端："local"（local_path）或 "s3"（S3 兼容存储桶）</td></tr>
			<tr><td><code>local_path</code></td><td>string</td><td><code>"/var/lib/nostrfy/images"</code></td><td>媒体文件的本地存储根目录</td></tr>
			<tr><td><code>max_upload_bytes</code></td><td>integer</td><td><code>20971520</code> (20 MB)</td><td>媒体文件最大大小</td></tr>
			<tr><td><code>min_free_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>低于该磁盘空间时拒绝上传</td></tr>
			<tr><td><code>s3_endpoint</code></td><td>string</td><td><code>""</code></td><td>S3 兼容端点（例如 R2）</td></tr>
			<tr><td><code>s3_region</code></td><td>string</td><td><code>""</code></td><td>S3 区域（R2 使用 "auto"）</td></tr>
			<tr><td><code>s3_bucket</code></td><td>string</td><td><code>""</code></td><td>S3 存储桶名称</td></tr>
			<tr><td><code>s3_access_key</code></td><td>string</td><td><code>""</code></td><td>S3 access key</td></tr>
			<tr><td><code>s3_secret_key</code></td><td>string</td><td><code>""</code></td><td>S3 secret key</td></tr>
			<tr><td><code>restrict_uploads</code></td><td>boolean</td><td><code>false</code></td><td>只有白名单中的公钥可以上传</td></tr>
		</tbody>
	</table>
	</div>

	<h2>运行时重载（SIGHUP）</h2>
	<p>
		编辑文件并发送 <code>kill -HUP $(cat nostrfy.pid)</code> 会<strong>无需重启</strong>重载配置。大多数设置立即生效；少数在启动时固定：
	</p>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>SIGHUP 时生效</th><th>需要重启</th></tr></thead>
		<tbody>
			<tr><td>relay.name、description、pubkey、contact、icon、post_policy、public_url</td><td>relay.private_key</td></tr>
			<tr><td>reject_ephemeral、enabled_git、enabled_nip78_auth</td><td>relay.livekit_*、enabled_nips / disabled_nips</td></tr>
			<tr><td>大部分 [limits]</td><td>api_host、trusted_proxies、metrics_enabled、ws_paths、database.*、daemon 大小、限制上限、blossom.*</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] 不会由重载应用 — 列表在启动时播种一次，之后通过 NIP-86 在运行时管理。当需要重启的设置发生变化时日志会警告，少数启动时捕获的设置不会被重载检查。
	</p>

	<Callout type="warning" title="常见错误">
		<div class="overflow-x-auto">
		<table>
			<thead><tr><th>错误</th><th>修复</th></tr></thead>
			<tbody>
				<tr><td>未设置 public_url</td><td>设置 <code>wss://...</code></td></tr>
				<tr><td>host 保持 127.0.0.1</td><td>外部客户端无法连接</td></tr>
				<tr><td>启用 NIP-29 但未设置 private_key</td><td>运行 <code>nostrfy genkey</code> + 重启</td></tr>
				<tr><td>restrict_relay 为 true 但白名单为空</td><td>所有人被锁定</td></tr>
				<tr><td>更改仅重启生效的键却只发 SIGHUP</td><td>使用 <code>nostrfy restart</code></td></tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
