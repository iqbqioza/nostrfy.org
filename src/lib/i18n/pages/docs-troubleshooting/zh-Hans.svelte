<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# 在配置文件中将 port = 8080 改掉，然后：
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# 如果 nostrfy 正在运行，重启它
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# 如果存在陈旧的 pid 文件，删除它
rm -f nostrfy.pid`;
	const tomlExample = `# 正确示例
name = "my relay"        # 字符串用 " 引起来
port = 8080              # 数字直接写
enabled_nips = [1, 50]   # 列表用 [ ] 包裹`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# 从外部（使用服务器的 IP/端口）
curl http://YOUR_SERVER_IP:8080/health

# 检查防火墙（示例：ufw）
sudo ufw status
# 如需要，开放端口
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" 以字节为单位`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# 使用本地 Blossom 存储时，也要备份 [blossom].local_path。
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="故障排除"
	description="你最可能遇到的错误 — 端口、权限、TLS、缺少 NIP、发布和超时 — 附分步修复方法。"
/>

<div class="doc-body">
	<p><strong>首先检查三件事：</strong></p>
	<ul>
		<li><code>nostrfy check</code> 校验你的配置（大多数错误是配置失误）。</li>
		<li><code>tail -f nostrfy.log</code> 显示日志 — 原因几乎总在那里。</li>
		<li><code>nostrfy restart</code> 干净地重启守护进程。</li>
	</ul>

	<h2 id="cannot-start">无法启动</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>原因：</strong>80 端口只能由 root 绑定。</p>
	<p><strong>修复：</strong>用 <code>sudo</code> 运行，或将端口改为 8080 之类。</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>原因：</strong>另一个进程（旧的 nostrfy 或不同的服务器）已经占用了
		该端口。
	</p>
	<p><strong>修复：</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>原因：</strong>nostrfy 已在运行；<code>start</code> 拒绝启动第二个
		实例。
	</p>
	<p><strong>修复：</strong>使用 <code>nostrfy restart</code>，或直接使用正在运行的实例。</p>

	<h3><code>nostrfy stop</code> 卡住 / <code>did not stop in time</code></h3>
	<p><strong>原因：</strong>守护进程卡住或无响应。</p>
	<p><strong>修复：</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>原因：</strong>配置文件不是有效的 TOML。常见错误：忘记给字符串加引号，
		或同一个键写了两次。
	</p>
	<p><strong>修复：</strong>错误消息包含行号。检查并修复该行。</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>原因：</strong>配置文件不存在。</p>
	<p><strong>修复：</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>原因：</strong><code>relay.private_key</code> 不是有效的 64 字符十六进制密钥。
	</p>
	<p>
		<strong>修复：</strong>运行 <code>nostrfy genkey</code> 生成正确的密钥（或设置
		<code>private_key = ""</code>）。
	</p>

	<h3>启动时日志中有大量警告</h3>
	<p><code>[WARN]</code> 日志行告诉你配置问题。主要的：</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>警告</th>
				<th>含义和修复</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					未设置 <code>public_url</code> — NIP-42 认证、NIP-62 消除和 NIP-98 管理认证
					将无法工作。设置 <code>wss://your-public-url</code>。
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>群组需要密钥。运行 <code>nostrfy genkey</code>。</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>配置中有未使用的遗留键（或拼写错误）。检查键名。</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					段名拼写错误（例如 <code>[serve]</code> 而不是 <code>[server]</code>）。
					修复它。
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>这个组合会把所有人锁在外面。更改其中之一。</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					PoW 要求太高，没人能发布。降低 <code>require_pow</code>。
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">无法连接或行为异常</h2>

	<h3>客户端收到 <code>connection refused</code></h3>
	<p>
		<strong>原因：</strong>中继未运行，或防火墙阻止了端口。
	</p>
	<p><strong>修复：</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>外部客户端无法连接，本地可以</h3>
	<p>
		<strong>原因：</strong><code>server.host</code> 仍是 <code>127.0.0.1</code>（默认），
		它只接受本地连接。
	</p>
	<p>
		<strong>修复：</strong>在配置中设置 <code>host = "0.0.0.0"</code> 并重启。
	</p>

	<h3>无法通过 Cloudflare Tunnel 连接</h3>
	<p>使用 Cloudflare Tunnel 时：</p>
	<ul>
		<li>
			中继运行普通 HTTP；Cloudflare 终止 TLS，因此客户端使用 <code>wss://</code>。在中继上设置
			<code>public_url = "wss://..."</code>（这使 NIP-42 认证正常工作）。
		</li>
		<li>
			Cloudflare 会添加 <code>X-Forwarded-Proto</code> 头。nostrfy 对
			<code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> 值一视同仁，因此通常
			无需额外配置。
		</li>
	</ul>

	<h3><code>error: message too large</code> 且连接关闭</h3>
	<p>
		<strong>原因：</strong>单条消息超过 <code>max_ws_message_bytes</code>（默认 1 MB）。
	</p>
	<p>
		<strong>修复：</strong>如果需要更大的事件，提高 <code>limits.max_ws_message_bytes</code> — 但
		也要检查客户端自己的限制。
	</p>

	<h3><code>too many subscriptions</code> / <code>too many filters</code> 错误</h3>
	<p>
		<strong>原因：</strong>达到了每连接上限（订阅默认 20，过滤器
		默认 20）。
	</p>
	<p>
		<strong>修复：</strong>提高 <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code>（并检查客户端设置）。
	</p>

	<h3>负载下新连接被拒绝</h3>
	<p>
		<strong>原因：</strong>达到了 <code>max_connections</code>（默认 10000）、触发了按 IP 上限
		（<code>max_connections_per_ip</code>，默认 64），或每秒连接速率限制
		（<code>max_connections_per_sec_per_ip</code>）拒绝了突发。这些上限适用于每个连接 —
		WebSocket 和普通 HTTP 一样。
	</p>
	<p>
		<strong>修复：</strong>检查并调整设置。<code>max_connections_per_ip = 0</code> 禁用
		按 IP 上限；<code>max_connections_per_sec_per_ip = 0</code> 禁用速率限制。这三项
		设置需要重启。
	</p>

	<h3>连接一段时间后断开</h3>
	<p>
		<strong>原因：</strong>如果设置了 <code>ws_idle_timeout_secs</code>，空闲连接会被关闭。
		健康的客户端会用 PONG 回应中继的 PING 并保持连接；只有死掉的对端会被清理。
	</p>
	<p>
		<strong>修复：</strong>这是有意为之 — 默认 300 秒。设置
		<code>ws_idle_timeout_secs = 0</code> 完全禁用它。
	</p>

	<h3>订阅以 <code>CLOSED ... response too large</code> 结束</h3>
	<p>
		<strong>原因：</strong>一个 REQ 的已存储事件超过了 <code>max_req_response_bytes</code>
		（默认 32 MiB）。只在事件非常大或过滤器非常宽时发生。
	</p>
	<p>
		<strong>修复：</strong>缩小过滤器（更严格的 <code>since</code>/<code>until</code>、更低的
		<code>limit</code>）或提高 <code>max_req_response_bytes</code>（0 禁用预算）。
	</p>

	<h3>NIP-11 <code>supported_nips</code> 列表中缺少某个 NIP</h3>
	<p>
		<strong>原因：</strong>公布的列表是动态的 — 当某个 NIP 定义的所有类型都被
		拒绝时它会被隐藏：它们都在 <code>blocked_kinds</code> 中、都不在
		<code>allowed_kinds</code> 中，或它们是 <code>reject_ephemeral</code> 拒绝的临时类型。
		NIP-29/43/66 还需要 <code>relay.private_key</code>，NIP-86 需要
		<code>rpc.management_token</code> 或 <code>rpc.admin_pubkey</code>。
	</p>
	<p>
		<strong>修复：</strong>检查活动的访问列表 — NIP-86 <code>listallowedkinds</code> 显示
		类型白名单，<code>GET /</code> 立即显示生效的 <code>supported_nips</code>。
		移除屏蔽的类型或 <code>reject_ephemeral</code> 设置。
	</p>

	<h2 id="publishing">发布时的错误</h2>
	<p>
		发布失败时，<code>OK</code> 消息的第 4 个元素解释原因。常见的：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>错误</th>
				<th>含义和修复</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>事件签名无效（可能是客户端密钥损坏）。</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					内容超过 <code>max_content_bytes</code>（默认 64K 字符）。缩短它或
					提高限制。
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>标签数超过 <code>max_tags</code>（默认 2000）。</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					时间戳过于超前（超过 <code>max_created_at_future_secs</code>）。
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					内容或标签包含类似 nsec 的字符串。
					<strong>切勿发布密钥。</strong>移除该字符串后事件会被接受。
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>同一事件已存储（正常）。</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>该公钥被封禁（<code>banpubkey</code>）或在白名单之外。</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>此类型被禁止。</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					该公钥超过了 <code>max_events_per_min_per_pubkey</code>（滑动 60 秒
					窗口）。等一分钟再试，或提高/禁用该限制。
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>该事件 id 被封禁。</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>重新发布已删除的事件。</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					需要认证（当 <code>relay.require_auth</code> 开启时）。
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					账户创建时间在 <code>new_pubkey_min_age_secs</code> 之内。等待并重试。
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>群组不存在（先创建它）。</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					群组是 <code>closed</code>；没有邀请码的加入请求不会被处理。
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Blossom 文件服务器</h2>

	<h3>上传失败并返回 <code>401</code></h3>
	<p>上传授权事件（kind 24242）被拒绝。检查：</p>
	<ul>
		<li>
			令牌的 <code>expiration</code> 标签<strong>存在</strong>且设置为未来的 unix 时间戳，
		</li>
		<li>对于 upload/media/delete，令牌带有包含 blob 的 sha256 的 <code>x</code> 标签，</li>
		<li>
			<code>server</code> 标签（如果存在）正好是配置的 <code>blossom.host</code>
			（仅主机名，无 scheme/path），
		</li>
		<li>令牌是在最近 10 分钟内签名的（防止重放的新鲜度窗口），</li>
		<li>且签名密钥是上传者自己的。</li>
	</ul>

	<h3>上传失败并返回 <code>403</code></h3>
	<p>
		设置了 <code>blossom.restrict_uploads = true</code> 且该公钥不在白名单中 — 用
		<code>nostrfy blossom allow npub1...</code> 添加它（守护进程会自动重载）。如果列表看起来
		不对，<code>nostrfy blossom list</code> 会显示它。
	</p>

	<h3>上传失败并返回 <code>409</code></h3>
	<p>
		客户端发送的 <code>X-SHA-256</code> 头与实际请求体不匹配（
		声明的哈希是在不同字节上计算的 — 例如文件在哈希和发送之间发生了变化）。
		客户端可以完全省略该头。
	</p>

	<h3>媒体主机上的 <code>GET /</code> 返回 NIP-11 文档</h3>
	<p>
		请求没有带着 Blossom Host 头到达中继。在反向代理中将 <code>media.example.com</code>
		（或 <code>blossom.host</code> 设置的值）指向同一端口，然后
		<code>nostrfy restart</code>。
	</p>

	<h3>blob 在上传后立即 404</h3>
	<p>
		文件以其 SHA-256 内容寻址：使用上传响应中返回的确切哈希获取它
		（<code>/&lt;sha256&gt;</code> 或 <code>/&lt;sha256&gt;.&lt;ext&gt;</code>）。不匹配意味着
		客户端请求的哈希与它发送的字节不同。
	</p>

	<h2 id="search-groups-auth">搜索、群组和认证</h2>

	<h3>搜索返回 0 条结果 / 意外结果</h3>
	<p>nostrfy 搜索匹配<strong>全词</strong>。注意：</p>
	<ul>
		<li>
			<code>search = "rust"</code> 匹配包含单词 "rust" 的事件，但 <code>"ru"</code>
			不会作为子串匹配 "rust"。
		</li>
		<li>只搜索事件内容中的单词。</li>
		<li>如果 <code>search_index = false</code>，搜索仍然可用但更慢。</li>
		<li>
			如果 NIP-50 被禁用（<code>disabled_nips = [50]</code>），<code>search</code> 被忽略
			（会发送 NOTICE）。
		</li>
	</ul>

	<h3>群组元数据（39000-39005）没有生成</h3>
	<p>
		<strong>原因：</strong>未设置 <code>relay.private_key</code>。群组快照由
		中继自己的密钥签名，因此没有它就不会生成任何东西。
	</p>
	<p><strong>修复：</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> 拒绝群组事件</h3>
	<p>
		<strong>原因：</strong>群组不存在。在 NIP-29 中，管理事件和加入请求
		（9021）不能在群组创建（kind 9007）之前针对它。
	</p>
	<p><strong>修复：</strong>先用一个 9007 事件创建群组。</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>原因：</strong>管理操作（添加成员等）需要管理员（带角色的成员）。
		创建者是管理员。
	</p>
	<p><strong>修复：</strong>请管理员授予你角色，或创建你自己的群组。</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>原因：</strong>群组是 <code>closed</code>；没有邀请码的加入请求
		不会被自动批准。
	</p>
	<p><strong>修复：</strong>向管理员索取邀请码（9009）并用 <code>code</code> 标签加入。</p>

	<h3>不小心离开了群组，或群组没有管理员</h3>
	<p>
		<strong>原因：</strong>NIP-29 离开请求（kind 9022）对任何成员都被处理 — 包括
		群组的最后一位管理员，他离开后不会留下管理员。没有管理员，就没人能发送管理事件
		（9000/9001/9002/9008）了。
	</p>
	<p>
		<strong>修复：</strong>用中继自己的密钥（<code>relay.private_key</code>，
		即 NIP-11 <code>self</code> 公布的公钥）签署一条管理事件。根据 NIP-29，管理事件可以来自
		"中继主密钥或……群组管理员"，因此即使群组没有管理员，中继也接受由自己的密钥签名的群组管理事件。
		例如，用 <code>kind:9000</code> 恢复一位管理员：
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		用中继密钥签名并发布它。或者，用中继签名的
		<code>kind:9008</code> 删除群组（其存储的事件被清除），然后用 <code>kind:9007</code> 重新创建。
		此恢复需要配置 <code>relay.private_key</code>。
	</p>

	<h3>受保护事件被 <code>auth-required</code> 拒绝</h3>
	<p>
		<strong>原因：</strong>NIP-70 受保护事件（带 <code>-</code> 标签）只能由
		已认证的作者<strong>在同一连接上</strong>发布。
	</p>
	<p><strong>修复：</strong>发布前在客户端启用 NIP-42 认证。</p>

	<h3>AUTH（NIP-42）返回 <code>false</code></h3>
	<p>常见原因：</p>
	<ol>
		<li>
			未设置或错误设置 <code>relay.public_url</code> — AUTH 事件的 <code>relay</code> 标签与
			中继的 URL 不匹配。设置 <code>wss://...</code> 并重启。
		</li>
		<li>挑战过期 — 你在不同的连接上发送了 AUTH，或复用了旧的挑战。</li>
		<li>
			客户端时钟偏差 — AUTH 事件的 <code>created_at</code> 必须在
			现在的 ±10 分钟内。
		</li>
	</ol>

	<h3>NIP-86 管理 API 返回 <code>401 unauthorized</code></h3>
	<p><strong>原因：</strong>凭据缺失或错误。</p>
	<p><strong>修复：</strong></p>
	<ul>
		<li>设置 <code>management_token</code> 并发送 <code>Authorization: Bearer &lt;token&gt;</code>。</li>
		<li>
			或设置 <code>admin_pubkey</code> 并发送 NIP-98 认证事件（<code>u</code> 标签必须与
			中继 URL 完全匹配；需要 <code>payload</code> 标签）。
		</li>
		<li>如果两者都未设置，管理 API 完全禁用。</li>
	</ul>

	<h3>NIP-98 认证事件因 scheme 或端口不同被拒绝</h3>
	<p>
		NIP-98 规范说 <code>u</code> 标签必须与绝对请求 URL <em>完全</em>相同，因此
		nostrfy 从 <code>relay.public_url</code> 推导期望的 URL：其 authority 加上
		从 WebSocket scheme 映射的 HTTP scheme（<code>wss://</code> → <code>https://</code>，
		<code>ws://</code> → <code>http://</code>，去掉 <code>nostr+</code>）。没有
		<code>public_url</code> 时，中继期望它提供的普通 <code>http://host:port</code>。带有
		其他 scheme、不同/省略端口，或不同路径或查询的标签会被拒绝 — 将
		<code>relay.public_url</code> 设置为客户端签名的公开地址。每个认证事件也是
		<strong>一次性</strong>的：在其 60 秒
		有效窗口内重放同一个 <code>Authorization</code> 头会被拒绝。
	</p>

	<h2 id="db-disk">数据库和磁盘</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>原因：</strong>达到了 LMDB 内存映射上限（默认 1 TB 虚拟地址空间；实际
		磁盘使用随数据增长）— 实际上就是数据库满了。
	</p>
	<p><strong>修复：</strong>提高 <code>database.max_map_size</code> 并重启。</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>原因：</strong>可用磁盘空间少于 32 MB。写入停止（以保护数据）；读取
		继续。
	</p>
	<p>
		<strong>修复：</strong>释放磁盘空间。一旦有空间，写入会自动恢复。
		（<code>df -h /path/to/data</code>）
	</p>

	<h3><code>nostrfy check</code> 报告 <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>原因：</strong><code>database.map_size</code> 大于 <code>max_map_size</code>。
	</p>
	<p>
		<strong>修复：</strong>将 <code>map_size</code> 设置为等于或低于 <code>max_map_size</code>（默认值
		就没问题）。
	</p>

	<h3>检查数据库大小</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>备份 / 移动数据库</h3>
	<p>
		所有数据都在 <code>database.path</code> 目录中。
		<strong>复制前先停止中继</strong>（复制活动数据库可能损坏它）。
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">守护进程操作</h2>

	<h3><code>nostrfy stats</code> 显示 <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>原因：</strong>统计文件不存在 — 守护进程未运行，或它在几
		秒前才启动。
	</p>
	<p><strong>修复：</strong>运行 <code>nostrfy start</code>，等几秒，然后重试。</p>

	<h3>日志无限增长</h3>
	<p>
		<strong>原因：</strong><code>max_log_size_bytes</code> 为 0（轮转已禁用）。
	</p>
	<p>
		<strong>修复：</strong>设置 <code>max_log_size_bytes = 52428800</code>（50 MB）和
		<code>max_log_files = 5</code>。轮转自动进行。
	</p>

	<h3>重载后配置更改没有生效</h3>
	<p>
		<strong>原因：</strong>你重载（SIGHUP）了启动时固定的设置：
		<code>private_key</code>、<code>api_host</code>、<code>metrics_enabled</code>、LiveKit 设置，以及
		NIP 启用/禁用列表。
	</p>
	<p>
		<strong>修复：</strong>使用 <code>nostrfy restart</code>。这种情况下日志包含 "a restart is required"
		警告。
	</p>

	<h3>中继不断自行死掉</h3>
	<p><strong>原因：</strong>机器重启了，或中继内存不足（OOM）。</p>
	<p><strong>修复：</strong></p>
	<ol>
		<li>检查日志末尾：<code>tail -50 nostrfy.log</code>。</li>
		<li>
			检查机器是否重启：<code>uptime</code>（非常短的运行时间意味着重启）。
		</li>
		<li>检查内存：<code>free -h</code>。</li>
		<li>再次启动中继：<code>nostrfy start</code>。</li>
	</ol>
	<Callout type="tip" title="提示">
		要在开机时自动启动 nostrfy，将它注册为 systemd 服务，以中继的启动
		命令作为 <code>ExecStart</code>。
	</Callout>

	<h3>systemd 无法在 80 端口启动中继</h3>
	<p>
		以 root 运行的 systemd 服务可以绑定 80 端口。如果你把 <code>User=</code> 设为普通用户，
		要么使用更高的端口（例如 8080），要么向单元添加
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code>。
	</p>

	<h2 id="still-not-solved">仍未解决？</h2>
	<ol>
		<li>
			<strong>检查日志</strong>：<code>tail -100 nostrfy.log</code> — 它通常会指出直接
			原因。
		</li>
		<li>
			<strong>重新校验配置</strong>：<code>nostrfy check</code> — 显示警告和错误。
		</li>
		<li>
			<strong>收集复现细节</strong>：你在做什么、哪个客户端、确切的错误。
		</li>
		<li>
			<strong>在项目仓库提问</strong>：
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — 提交
			issue 时，附上复现步骤和日志。
		</li>
	</ol>
</div>
