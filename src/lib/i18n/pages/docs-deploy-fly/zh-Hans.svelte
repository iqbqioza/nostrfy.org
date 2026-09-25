<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);

	const launchCmd = `cd /path/to/nostrfy
fly launch --no-deploy --name <your-app-name> --region <region>`;
	const volumeCmd = `fly volumes create data --size 1 --region <region>`;
	const flyToml = `[relay]
name = "My Relay"                              # 通过 NIP-11 向客户端显示
description = "A friendly relay for everyone"
private_key = "..."                            # NIP-29 群组需要
public_url = "wss://<your-app-name>.fly.dev"   # NIP-42/62/98 需要`;
	const deployCmd = `fly deploy`;
	const verifyCmd = `# 日志行："relay listening on ws://0.0.0.0:8080"
fly logs

# 通过公开地址获取 NIP-11 信息文档
curl https://<your-app-name>.fly.dev/

# 将你的 Nostr 客户端指向 wss://<your-app-name>.fly.dev`;
</script>

<DocsTitle
	title="部署到 Fly.io"
	description="用现成模板在几分钟内将 nostrfy 部署到 Fly.io — 卷、机器、TLS 终止和简单更新。"
/>

<div class="doc-body">
	<h2>仓库中提供的内容</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>文件</th>
				<th>用途</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>Dockerfile</code></td>
				<td>
					容器镜像 — 从 GitHub 发布资产<strong>下载预编译的发布二进制</strong>
					（x86_64 / aarch64，按构建架构选择）并验证其
					sha256 校验和。Fly 上不发生编译
				</td>
			</tr>
			<tr>
				<td><code>fly.toml</code></td>
				<td>
					Fly 应用配置：8080 端口的 HTTP 服务、健康检查、
					<code>/data</code> 卷挂载、常开机器
				</td>
			</tr>
			<tr>
				<td><code>deploy/nostrfy.container.toml</code></td>
				<td>
					烘焙到镜像中 <code>/etc/nostrfy/nostrfy.toml</code> 的中继配置
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>前置条件</h2>
	<ul>
		<li>一个 Fly.io 账户</li>
		<li>flyctl CLI（<code>fly version</code>）</li>
		<li>已登录：<code>fly auth login</code></li>
	</ul>

	<h2>四步部署</h2>

	<h3>1. 启动应用（暂不部署）</h3>
	<CodeBlock code={launchCmd} lang="sh" />
	<ul>
		<li>
			<code>&lt;your-app-name&gt;</code> 在 Fly 上必须唯一（它成为中继 URL 的一部分：
			<code>wss://&lt;your-app-name&gt;.fly.dev</code>）
		</li>
		<li>
			<code>&lt;region&gt;</code>：例如 <code>nrt</code>（东京）、<code>fra</code>、
			<code>iad</code>、<code>sjc</code> — 选择离你的用户最近的区域
		</li>
		<li>
			这可能会覆盖模板的 <code>fly.toml</code> 值（应用名、区域）— 没问题
		</li>
	</ul>

	<h3>2. 创建持久卷</h3>
	<p>LMDB 数据库位于挂载到 <code>/data</code> 的 Fly 卷上：</p>
	<CodeBlock code={volumeCmd} lang="sh" />
	<p>
		1 GB 起步足够（数据库随使用增长）。之后可以调整大小，或一开始就创建更大的
		卷。
	</p>

	<h3>3. 配置中继</h3>
	<p>部署前编辑 <code>deploy/nostrfy.container.toml</code>：</p>
	<CodeBlock code={flyToml} lang="toml" />
	<ul>
		<li>
			<code>private_key</code>：在本地用 <code>nostrfy genkey</code>（针对临时配置）生成并粘贴密钥，或用任何 Nostr 工具生成
		</li>
		<li>
			<code>public_url</code> <strong>必须</strong>与你的应用名匹配 — 没有它，NIP-42 AUTH、
			NIP-62 消除和 NIP-86 管理 API 将无法工作
		</li>
		<li>其他一切保持默认即可</li>
	</ul>

	<h3>4. 部署</h3>
	<CodeBlock code={deployCmd} lang="sh" />
	<p>
		Fly 构建镜像（几分钟 — 二进制下载很快，镜像很小），创建
		机器并对 <code>/health</code> 运行健康检查。
	</p>

	<h2>验证</h2>
	<CodeBlock code={verifyCmd} lang="sh" />

	<h2>扩缩容与更新</h2>
	<ul>
		<li>
			<strong>更新中继</strong>：编辑 <code>deploy/nostrfy.container.toml</code> 并
			再次 <code>fly deploy</code> — 镜像总是下载<strong>最新</strong>的 GitHub
			发布二进制，因此更新只是简单的重新部署
		</li>
		<li>
			<strong>固定版本</strong>：<code>docker build --build-arg NOSTRFY_VERSION=v0.1.16 ...</code>
			或更改 Dockerfile 中的 <code>ARG</code>
		</li>
		<li>
			<strong>扩容</strong>：中继默认是单台机器。
			<code>fly machines clone &lt;id&gt;</code> 创建第二台机器；两者共享卷（Fly
			卷支持同一区域的多台机器）
		</li>
		<li>
			<strong>指标</strong>：Fly 采集 <code>/metrics</code> 端点（见
			<code>fly.toml</code> 中的 <code>[metrics]</code>）并在 Fly 仪表盘的 Metrics 下显示
		</li>
	</ul>

	<h2>自定义配置</h2>
	<p>
		镜像读取 <code>/etc/nostrfy/nostrfy.toml</code>，它由
		<code>deploy/nostrfy.container.toml</code> 烘焙而来。两种自定义方式：
	</p>
	<ol>
		<li>
			<strong>在仓库中编辑 <code>deploy/nostrfy.container.toml</code></strong> 并重新部署
			（最简单）
		</li>
		<li>
			<strong>挂载你自己的配置</strong>：构建一个镜像分支，将你的配置文件
			复制到 <code>/etc/nostrfy/nostrfy.toml</code>
		</li>
	</ol>
	<p>每个选项都记录在<a href={p('/docs/configuration/')}>配置参考</a>中。</p>

	<h2>说明</h2>
	<ul>
		<li>
			<strong>设计为常开</strong>：<code>fly.toml</code> 中的
			<code>auto_stop_machines = false</code> — 中继绝不应在空闲期间被停止
		</li>
		<li>
			容器以<strong>前台模式</strong>运行中继
			（<code>nostrfy start --foreground</code>）；日志写入 stdout/stderr 并由 Fly 收集
		</li>
		<li>
			TLS 由 Fly 终止；中继本身在 8080 端口提供普通 WebSocket
		</li>
		<li>
			<strong>Blossom 媒体主机</strong>：要同时提供 Blossom 服务器，请在配置中设置
			<code>blossom.host = "media.example.com"</code>，将
			<code>media.example.com</code> 添加为同一 Fly 应用的<strong>附加主机名</strong>
			（<code>fly.toml [[services]] http_options.allowed_http_hostnames</code> 或
			<code>fly hostnames</code>），并在 Fly
			仪表盘中添加 <code>media.</code> TLS 证书 — 中继在内部拆分主机（类似 <code>server.api_host</code>）
		</li>
	</ul>

	<Callout type="note" title="TLS 由 Fly 终止">
		中继本身在 8080 端口提供普通 WebSocket。
	</Callout>
</div>
