<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';

	const startCode = `nostrfy --config nostrfy.toml start`;
	const foregroundCode = `nostrfy --config nostrfy.toml start --foreground`;
	const stopCode = `nostrfy --config nostrfy.toml stop`;
	const healthCode = `curl http://127.0.0.1:8080/health`;
	const healthCaption = '=> {"status":"ok"}';

	const tailCode = `tail -f nostrfy.log`;
	const statsCode = `nostrfy stats`;
	const statsHttpCode = `curl http://127.0.0.1:8080/relay/stats`;
	const metricsCode = `curl http://127.0.0.1:8080/metrics`;

	const hupCode = `kill -HUP $(cat nostrfy.pid)`;

	const instancesCode = `[server]
port = 8080

[database]
path = "/var/lib/nostrfy-a"

[daemon]
pid_file = "/var/run/nostrfy-a.pid"
log_file = "/var/log/nostrfy-a.log"
stats_file = "/var/lib/nostrfy-a/stats.json"

[server]
port = 8081

[database]
path = "/var/lib/nostrfy-b"

[daemon]
pid_file = "/var/run/nostrfy-b.pid"
log_file = "/var/log/nostrfy-b.log"
stats_file = "/var/lib/nostrfy-b/stats.json"`;
</script>

<DocsTitle
	title="运行中继"
	description="针对你的 nostrfy 中继：启动与停止、日志与统计、配置热重载、多实例和大规模调优。"
/>

<div class="doc-body">
	<h2>启动与停止</h2>
	<p>以后台守护进程方式启动中继：</p>
	<CodeBlock code={startCode} lang="bash" caption="=> nostrfy started (pid 12345)" />
	<p>或在终端中前台运行：</p>
	<CodeBlock code={foregroundCode} lang="bash" />
	<p>停止：</p>
	<CodeBlock code={stopCode} lang="bash" />
	<p>验证已启动：</p>
	<CodeBlock code={healthCode} lang="bash" caption={healthCaption} />

	<h2>日志与统计</h2>
	<p>
		守护进程写入 <code>daemon.log_file</code>。当文件超过 <code>max_log_size_bytes</code> 时会
		自动轮转（<code>nostrfy.log.1</code>、<code>.2</code>……最多 <code>max_log_files</code> 代）：
	</p>
	<CodeBlock code={tailCode} lang="bash" />
	<p>日志级别由 <code>RUST_LOG</code> 环境变量控制（例如 <code>RUST_LOG=debug</code>）。</p>
	<h3>统计</h3>
	<p>从 CLI 获取实时统计：</p>
	<CodeBlock code={statsCode} lang="bash" />
	<p>或通过 HTTP：</p>
	<CodeBlock code={statsHttpCode} lang="bash" />
	<p>显示连接数、接受/拒绝的事件、数据库大小等。</p>
	<h3>Prometheus 指标</h3>
	<CodeBlock code={metricsCode} lang="bash" />

	<h2>热重载（SIGHUP）</h2>
	<p>编辑配置文件后，无需重启即可重载：</p>
	<CodeBlock code={hupCode} lang="bash" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>重载时生效</th>
				<th>需要重启</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>中继身份、public_url</td>
				<td>private_key</td>
			</tr>
			<tr>
				<td>大部分 [limits]、reject_ephemeral、enabled_git、enabled_nip78_auth</td>
				<td>api_host、metrics_enabled、LiveKit 设置</td>
			</tr>
			<tr>
				<td>—</td>
				<td>enabled_nips / disabled_nips、server.host / port / ws_paths</td>
			</tr>
			<tr>
				<td>—</td>
				<td>database.*（含 search_index）、blossom.*</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>当需要重启的设置发生变化时，日志会发出警告。</p>

	<h2>运行多个实例</h2>
	<p>
		nostrfy 支持在同一台服务器上运行多个独立中继（不同端口）。每个实例需要自己的
		<code>server.port</code>、<code>[daemon]</code> 的
		<code>pid_file</code>/<code>log_file</code>/<code>stats_file</code>
		（共享值会让第二个实例以 <code>already running</code> 拒绝启动）、
		<code>database.path</code>，以及（如使用）各自的 <code>api_host</code> / <code>blossom.host</code>：
	</p>
	<CodeBlock code={instancesCode} lang="toml" />
	<p>每个实例用各自的配置管理：<code>nostrfy --config /etc/nostrfy/a.toml start</code> 等。</p>

	<h2>大规模部署</h2>
	<p>
		该中继设计为可在单个主机上扩展到数十万连接 — 实时投递只唤醒能匹配事件的订阅者，
		且每连接内存占用很小。推向百万级需要主机级调优：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>设置</th>
				<th>值</th>
				<th>原因</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>ulimit -n</code> / systemd LimitNOFILE</td>
				<td>≥ 目标连接数的 2 倍（+1000）</td>
				<td>每个连接占用一个 fd</td>
			</tr>
			<tr>
				<td><code>net.core.somaxconn</code></td>
				<td>≥ 1024</td>
				<td>连接突发时的待处理 accept 队列</td>
			</tr>
			<tr>
				<td><code>net.ipv4.tcp_fin_timeout</code></td>
				<td>较低（例如 10）</td>
				<td>更快回收 TIME_WAIT socket</td>
			</tr>
			<tr>
				<td><code>vm.overcommit_memory</code></td>
				<td>1 或 2</td>
				<td>LMDB 映射是大型稀疏虚拟预留</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		在 FreeBSD 上，对应的参数是 <code>kern.maxfiles</code> / <code>kern.maxfilesperproc</code> 加
		<code>ulimit -n</code>，并用 <code>kern.ipc.somaxconn</code> 替代 <code>net.core.somaxconn</code>。
		每连接的内核内存约 80 KiB、用户空间约 10 KiB，因此一百万连接在数据库之外大约需要 90 GiB 的
		内核 + 用户内存。
	</p>

	<h2 id="throughput">吞吐量（每秒事件数）</h2>
	<p>
		事件写入受两项成本约束：Schnorr 签名验证（每个事件约 30-50 µs）和 LMDB 写入器在每个提交批次后
		执行的同步磁盘刷新。两者都可以在 <code>nostrfy.toml</code> 中调整：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>设置</th>
				<th>原因</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>database.disabled_fsync = true</code></td>
				<td>提交到操作系统页缓存（微秒级）；断电只会丢失上次刷新以来的写入 — 从这里开始</td>
			</tr>
			<tr>
				<td>CPU 核心 ≥ 8 vCPU</td>
				<td>批量 EVENT 路径跨核心并行验证签名</td>
			</tr>
			<tr>
				<td><code>database.search_index = false</code></td>
				<td>为写入密集型实例去掉每事件的 NIP-50 词索引写入</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		并行签名验证在待处理批次中一次验证所有签名，使用工作线程池
		（上限 8；少于 16 个事件的批次内联验证）。每个事件的廉价检查仍然先行，因此拒绝
		原因文本与顺序路径完全相同 — 只有 Schnorr 工作分散到各核心。单线程
		构建保持顺序执行。
	</p>

	<h2>固定的反滥用边界</h2>
	<p>
		为保持中继在滥用下仍能响应，有几项硬边界是固定的（不可配置）：
	</p>
	<ul>
		<li>
			单个过滤器最多携带 <strong>512</strong> 个 <code>ids</code>、<code>authors</code> 或
			<code>kinds</code> 条目；<code>#...</code> 标签值每个过滤器共享单独的 <strong>512</strong>
			值预算。更大的过滤器会被拒绝（<code>CLOSED invalid: ...</code>）。
		</li>
		<li>
			<code>max_connections_per_sec_per_ip</code> 最多跟踪 10,000 个源 IP；满时，未见过的
			IP 会被拒绝（fail closed）。
		</li>
		<li>
			<code>ids</code> 过滤器中的事件 id 可以是前缀，但只有完整的 32 字节 id 和偶数长度
			前缀才能匹配（奇数长度/空条目在历史和实时投递中都会被忽略）。
		</li>
		<li>
			过长的索引键（标签值、内容词、超出 LMDB 键大小限制的 <code>d</code> 标签）在
			索引时会被跳过；事件仍会被存储。
		</li>
	</ul>
</div>
