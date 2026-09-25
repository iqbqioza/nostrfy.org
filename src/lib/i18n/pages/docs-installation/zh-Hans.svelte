<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const lowSpecConfig = `[database]
search_index = false   # halves the database size and saves CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="安装指南"
	description="环境要求、从源码构建、安装预编译二进制、校验和验证，以及在 FreeBSD 上运行 nostrfy 的注意事项。"
/>

<div class="doc-body">
	<h2>环境要求</h2>
	<ul>
		<li>较新的稳定版 Rust 工具链（仅在构建中继时需要）。</li>
		<li>Linux 机器。</li>
		<li>建议 2 GB 或更多内存 — 0.25 vCPU / 512 MB VPS 请参阅下方的低配说明。</li>
	</ul>

	<h3>低配 VPS（0.25 vCPU / 512 MB）</h3>
	<p>
		即使数据库超过内存，nostrfy 也已验证可稳定运行。LMDB 映射是
		<strong>稀疏的 1 TiB 虚拟预留</strong> — 物理磁盘只随写入的数据增长 —
		进程内存保持平稳：数据库 252 MB 的中继仅占用 <strong>7.9 MB 私有 RSS</strong>
		（其余是可回收的文件缓存，内核会在压力下驱逐）。
	</p>
	<p>对于微型 VPS，一项设置影响最大：</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>设置</th>
				<th>效果</th>
				<th>实测</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					禁用 NIP-50 词索引 — 搜索仍然可用（全词匹配）但更慢
				</td>
				<td>每 10,000 事件 41.8 MB → 20.5 MB</td>
			</tr>
			<tr>
				<td>默认值</td>
				<td>已针对低内存调优</td>
				<td>512 MB 无需更改</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>从源码构建</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>构建完成后，二进制文件位于 <code>target/release/nostrfy</code>。</p>

	<h2>安装预编译二进制</h2>
	<p>
		发布工作流附带 <strong>Linux x86_64</strong>、<strong>Linux aarch64</strong> 和
		<strong>FreeBSD x86_64</strong> 的预编译二进制。同一个
		<code>install.sh</code> 在两个系统上都可用 — 它会检测平台、下载匹配的二进制并验证其校验和：
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy 可在 FreeBSD 13.x 和 14.x（amd64）上构建和运行。安装 Rust 并构建：</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>平台说明：</p>
	<ul>
		<li>
			<code>start</code>/<code>stop</code>/<code>restart</code> 使用的进程存活检查在 FreeBSD 上通过
			<code>kern.proc.pid.&lt;pid&gt;.comm</code> sysctl 读取进程名（在 Linux 上使用
			<code>/proc/&lt;pid&gt;/comm</code>），因此两个平台都能检测到 pid 被其他程序复用的陈旧 pid 文件。
		</li>
		<li>
			<code>nostrfy start</code> 像在 Linux 上一样守护进程化；标准的双 fork 守护进程可与默认的
			<code>rc</code> 集成（<code>service nostrfy start</code>）配合使用。
		</li>
		<li>
			Blossom 的 <code>min_free_bytes</code> 检查使用 <code>statvfs</code>，两个系统都提供；没有
			使用其他平台特定代码（中继本身只是基于 tokio 的纯异步 Rust）。
		</li>
	</ul>

	<h3>在 80 端口上运行</h3>
	<p>
		普通用户无法绑定 80 端口。要么用 <code>sudo</code> 运行，要么使用 8080 等更高的端口。
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="示例：在 8080 端口运行（普通用户即可；请先在配置中更改端口）。"
	/>

	<Callout type="tip" title="下一步">
		nostrfy 已安装完成，请按照<a href={p('/docs/quick-start/')}>快速开始</a>指南操作。
	</Callout>
</div>
