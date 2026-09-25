<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hans', path);
</script>

<DocsTitle
	title="支持的 NIP 参考"
	description="nostrfy 实现的每个中继侧 NIP — 类型、说明和注意事项 — 以及 NIP-11 supported_nips 列表如何动态计算。"
/>

<div class="doc-body">
	<h2>已实现的 NIP</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>说明</th>
			</tr>
		</thead>
		<tbody>
			<tr><td>1</td><td>基础协议（事件、订阅）</td></tr>
			<tr><td>9</td><td>事件删除</td></tr>
			<tr><td>11</td><td>中继信息文档</td></tr>
			<tr><td>13</td><td>工作量证明</td></tr>
			<tr><td>17</td><td>私信（kind 14 包装在 kind 15 中；开启 NIP-42 认证时，kind 1059 和临时 kind 21059 礼物包装仅向收件人提供）</td></tr>
			<tr><td>22</td><td>评论（kind 1111，通过 #e 索引线程化）</td></tr>
			<tr><td>26</td><td>委托事件签名</td></tr>
			<tr><td>28</td><td>公共聊天（客户端侧：作为普通事件存储和提供，不公布）</td></tr>
			<tr><td>29</td><td>基于中继的群组</td></tr>
			<tr><td>32</td><td>标签（kind 1985，#l/#L 已索引）</td></tr>
			<tr><td>33</td><td>参数化可替换事件</td></tr>
			<tr><td>34</td><td>git 相关（类型 1617-1619、1621、1622、1630-1633、30617/30618 — 通过 <code>relay.enabled_git</code> 可选启用，默认关闭）</td></tr>
			<tr><td>40</td><td>过期时间戳</td></tr>
			<tr><td>42</td><td>客户端认证</td></tr>
			<tr><td>43</td><td>中继访问元数据（角色）— 类型 33534/13534/8000/8001 加上临时 28934/28935/28936；中继签名的元数据受 AUTH 门控。邀请码通过 NIP-86 <code>createclaim</code>/<code>deleteclaim</code> 签发；携带已列码的 kind:28934 会接纳其作者</td></tr>
			<tr><td>45</td><td>结果计数（COUNT）</td></tr>
			<tr><td>46</td><td>Nostr Connect</td></tr>
			<tr><td>47</td><td>Nostr Wallet Connect</td></tr>
			<tr><td>50</td><td>搜索能力（全文，按相关性排序）</td></tr>
			<tr><td>57</td><td>闪电 Zap（类型 9734/9735）</td></tr>
			<tr><td>59</td><td>礼物包装（仅向收件人提供）</td></tr>
			<tr><td>62</td><td>消除请求</td></tr>
			<tr><td>65</td><td>中继列表元数据</td></tr>
			<tr><td>66</td><td>中继发现与存活（类型 30166/10166 存储和提供；自动发布 kind 30166）</td></tr>
			<tr><td>67</td><td>EOSE 完整性提示</td></tr>
			<tr><td>70</td><td>受保护事件</td></tr>
			<tr><td>77</td><td>Negentropy 同步（失败的替换会按 NIP-77 用 NEG-ERR 关闭该 id）</td></tr>
			<tr><td>78</td><td>应用特定数据（kind 30078，受 AUTH 门控）</td></tr>
			<tr><td>84</td><td>高亮</td></tr>
			<tr><td>85</td><td>可信断言（类型 30382/30383/30384/30385/10040，可寻址）</td></tr>
			<tr><td>86</td><td>中继管理 API</td></tr>
			<tr><td>87</td><td>Cashu 和 Fedimint 公告（类型 38000/38172/38173）</td></tr>
			<tr><td>88</td><td>投票</td></tr>
			<tr><td>94</td><td>文件元数据（kind 1063）</td></tr>
			<tr><td>98</td><td>HTTP 认证</td></tr>
			<tr><td>A3</td><td>支付目标（kind 10133，可替换），草案；会被提供但不在 <code>supported_nips</code> 中公布</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom（BUD-01/02）不是 NIP，也不在 NIP-11 文档中公布 — 它作为
		独立文件服务器运行在 <code>[blossom]</code> 主机名上。详情见
		<a href={p('/docs/blossom/')}>Blossom 文件服务器</a>页面。
	</p>

	<h2>动态 NIP 公布</h2>
	<p>
		<code>supported_nips</code> 列表不是静态的：当某个 NIP 定义的所有类型都被中继的
		访问控制拒绝时，它就会从列表中移除。
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — 屏蔽某个 NIP 的所有类型会隐藏它（例如屏蔽
			kind 5 会隐藏 NIP-09）。只屏蔽部分类型则保留该 NIP。
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — 类型只有被列出才被接受；所有类型都未列出的
			NIP 会被隐藏。
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — 不在 NIP 强制豁免列表
			（<code>22242</code>、<code>27235</code>、<code>28934</code>/<code>28935</code>/<code>28936</code>、
			<code>24133</code>、<code>23194</code>/<code>23195</code>、<code>24242</code>、<code>21059</code>）
			中的临时类型会被拒绝，因此依赖它们的 NIP 会被隐藏。
		</li>
		<li>
			<strong>前置条件</strong> — NIP-29、NIP-43 和 NIP-66 依赖中继签名的事件，没有
			<code>relay.private_key</code> 时会被隐藏；NIP-86 在未设置
			<code>rpc.management_token</code> 或 <code>rpc.admin_pubkey</code> 时会被隐藏（否则每次
			管理调用都被拒绝）。
		</li>
		<li>
			没有专用类型的 NIP（<code>1</code>、<code>11</code>、<code>13</code>、<code>26</code>、<code>33</code>、
			<code>40</code>、<code>45</code>、<code>50</code>、<code>67</code>、<code>70</code>、
			<code>77</code>）在启用时始终公布。
		</li>
	</ul>
	<p>
		运行时所做的更改 — NIP-86 <code>allowkind</code>/<code>disallowkind</code>，或对
		<code>reject_ephemeral</code> 的 SIGHUP 重载 — 会在下一次 NIP-11 获取中体现。
		<code>enabled_nips</code>/<code>disabled_nips</code> 仍然需要重启。
	</p>
</div>
