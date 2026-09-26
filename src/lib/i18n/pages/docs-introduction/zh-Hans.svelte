<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="nostrfy 简介"
	description="nostrfy 是什么、开箱即用的功能，以及这款用 Rust 编写的一体化 Nostr 中继引擎背后的设计理念。"
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> 是
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a> 协议的中继服务器。
		它存储客户端发送的事件（帖子、反应、个人资料……），并响应订阅请求将其投递。
	</p>

	<h2>核心特性</h2>
	<ul>
		<li><strong>简单稳定</strong> — 用 Rust 编写；一个二进制文件完成一切。</li>
		<li>
			<strong>快速存储与搜索</strong> — LMDB 数据库，带全文搜索索引（NIP-50）。
		</li>
		<li>
			<strong>广泛的 NIP 支持</strong> — 实现 36 个 NIP，外加 Blossom 文件服务器：
			删除、工作量证明、委托、群组、搜索和管理 API。
		</li>
		<li>
			<strong>易于运维</strong> — 守护进程模式、日志轮转、配置热重载
			（SIGHUP）、实时统计、REST API 和 Prometheus 指标。
		</li>
		<li>
			<strong>易于迁移</strong> — 一条命令导入现有的
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			数据库，支持 dry-run、设置合并和安全重复运行
			（<a href={p('/docs/migrating-from-strfry/')}>迁移指南</a>）。
		</li>
	</ul>

	<h2>开箱即用的功能</h2>
	<p>
		单个 <code>nostrfy</code> 二进制文件在一个端口上提供：
	</p>
	<ul>
		<li><strong>WebSocket 中继</strong>和 NIP-11 信息文档。</li>
		<li>只读 <strong>REST API</strong>，位于 <code>/api/v1/...</code> — 独立的读取线程意味着 REST 流量永远不会阻塞 WebSocket 订阅者。</li>
		<li><strong>Blossom 文件服务器</strong>（媒体托管），运行在独立主机名上。</li>
		<li><strong>NIP-86 管理 RPC</strong>、健康检查和 Prometheus <code>/metrics</code>。</li>
	</ul>

	<h2>资源占用</h2>
	<p>
		nostrfy 已验证可在 <strong>0.25 vCPU / 512 MB VPS</strong> 上运行。LMDB 内存映射是
		1 TiB 的稀疏虚拟预留 — 物理磁盘只随真实数据增长 — 进程内存保持平稳：
		数据库 252 MB 的中继仅占用 <strong>7.9 MB 私有 RSS</strong>。
	</p>

	<h2>快速体验</h2>
	<p>三条命令完成安装、初始化和启动：</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>然后验证中继已启动：</p>
	<CodeBlock code={health} lang="bash" />
	<p>并获取它的 NIP-11 文档：</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="下一步">
		按照<a href={p('/docs/quick-start/')}>快速入门</a>完成首次运行，或直接跳到
		<a href={p('/docs/configuration/')}>配置参考</a>来调整中继。
	</Callout>
</div>
