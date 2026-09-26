<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # 无需重启即可重载配置`;
</script>

<DocsTitle
	title="快速入门指南"
	description="从安装到运行中的 Nostr 中继只需几分钟：编写配置、校验、启动守护进程并运行首次健康检查。"
/>

<div class="doc-body">
	<h2>1. 创建配置</h2>
	<p>
		<code>nostrfy init</code> 会写入一份带完整注释的默认 <code>nostrfy.toml</code>：
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>用文本编辑器打开并调整 — 每个选项都有注释。</p>

	<h2>2. 校验配置</h2>
	<p>
		<code>nostrfy check</code> 强烈建议在启动前运行；如果哪里有问题，它会准确报告问题所在。
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. 启动中继</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="以守护进程方式运行。添加 --foreground 可在终端中运行。"
	/>
	<p>然后用健康端点验证中继已启动：</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. 将客户端指向它</h2>
	<p>
		在同一台机器上，连接到 <code>ws://&lt;host&gt;:8080</code>。默认主机是
		<code>127.0.0.1</code>，只接受本地连接。要从其他机器访问中继，
		请在配置中设置 <code>server.host = "0.0.0.0"</code>：
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		要使用 <code>wss://</code>，需要在前端部署终止 TLS 的代理（nginx 或 Caddy）— 参见
		<a href={p('/docs/deploy/')}>部署</a>文档。
	</p>

	<h2>5. 停止与重启</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart 会重新读取配置；SIGHUP 无需重启即可重载大部分设置。"
	/>

	<h2>有效运维</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> 显示实时统计 — 也可通过 HTTP 以
			<code>/relay/stats</code> 和 <code>/metrics</code> 获取。
		</li>
		<li>日志写入 <code>daemon.log_file</code> 并自动轮转。</li>
		<li>
			<code>RUST_LOG</code> 控制日志级别（例如 <code>RUST_LOG=nostrfy=debug</code>）。
		</li>
	</ul>

	<Callout type="warning" title="外部客户端无法连接？">
		server.host 默认为 127.0.0.1。设置为 host = "0.0.0.0" 并重启。
	</Callout>

	<Callout type="tip" title="下一步">
		在<a href={p('/docs/configuration/')}>配置参考</a>中调整中继的方方面面。
	</Callout>
</div>
