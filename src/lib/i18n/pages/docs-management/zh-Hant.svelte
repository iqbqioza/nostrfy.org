<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const call = `curl -X POST http://127.0.0.1:8080/ \\
  -H "Content-Type: application/nostr+json+rpc" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{"method":"supportedmethods","params":[]}'`;
</script>

<DocsTitle
	title="NIP-86 管理"
	description="JSON-RPC 管理 API：審核、存取清單、中繼身分、角色、邀請碼與委派方法授權，支援 Bearer 或 NIP-98 認證。"
/>

<div class="doc-body">
	<h2>啟用</h2>
	<p>
		NIP-86 是用於管理中繼的 JSON-RPC API。它需要兩種認證方式之一，
		否則每次呼叫都會被拒絕：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方式</th>
				<th>設定</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Bearer token</td>
				<td>
					設定 <code>rpc.management_token</code> 並傳送 <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					設定 <code>rpc.admin_pubkey</code> 並傳送由管理員金鑰簽章的 NIP-98 認證事件
					（kind 27235），放在 <code>Authorization: Nostr &lt;base64&gt;</code> 中 — 需要一個
					<code>payload</code> 標籤；每個事件在其 60 秒視窗內只能使用一次
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>呼叫 API</h2>
	<p>POST /，使用 <code>Content-Type: application/nostr+json+rpc</code>：</p>
	<CodeBlock code={call} lang="bash" />

	<h2>方法</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方法</th>
				<th>參數</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr><td><code>supportedmethods</code></td><td>[]</td><td>支援的方法清單</td></tr>
			<tr><td><code>banpubkey</code></td><td>["pubkey", "reason (optional)"]</td><td>封鎖公鑰使其不能發布（同時將其從允許清單移除）</td></tr>
			<tr><td><code>unbanpubkey</code></td><td>["pubkey"]</td><td>解除封鎖公鑰</td></tr>
			<tr><td><code>listbannedpubkeys</code></td><td>[]</td><td>列出被封鎖的公鑰及原因</td></tr>
			<tr><td><code>allowpubkey</code></td><td>["pubkey", "reason (optional)"]</td><td>加入允許清單（同時解除封鎖）</td></tr>
			<tr><td><code>unallowpubkey</code></td><td>["pubkey"]</td><td>從允許清單移除</td></tr>
			<tr><td><code>listallowedpubkeys</code></td><td>[]</td><td>列出允許清單</td></tr>
			<tr><td><code>allowkind</code> / <code>disallowkind</code></td><td>[kind]</td><td>允許 / 禁止某個類型</td></tr>
			<tr><td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td><td>[]</td><td>列出允許 / 禁止的類型</td></tr>
			<tr><td><code>changerelayname</code> / <code>changerelaydescription</code> / <code>changerelayicon</code></td><td>["new value"]</td><td>變更中繼名稱 / 說明 / 圖示（持久化到設定檔；檔案無法寫入時回報錯誤）</td></tr>
			<tr><td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td><td>[id, label, description, color, order]</td><td>NIP-43 角色管理（類型錯誤的欄位被拒絕；刪除不存在的角色會成功）</td></tr>
			<tr><td><code>assignrole</code> / <code>unassignrole</code></td><td>["pubkey", "role id"]</td><td>指派 / 取消指派角色（重複授予或撤銷不存在的角色會成功）</td></tr>
			<tr><td><code>assignmethod</code> / <code>unassignmethod</code></td><td>["pubkey", "method"]</td><td>向非管理員公鑰授予 / 撤銷 NIP-86 方法 — 只有審核與讀取方法可被授予</td></tr>
			<tr><td><code>listmethodassignees</code></td><td>[]</td><td>列出方法授權（<code>[&#123;pubkey, methods&#125;]</code>）</td></tr>
			<tr><td><code>blockip</code> / <code>unblockip</code></td><td>["ip", "reason (optional)"]</td><td>封鎖 / 解除封鎖 IP（封鎖還會中斷現有連線）</td></tr>
			<tr><td><code>listblockedips</code></td><td>[]</td><td>列出被封鎖 IP</td></tr>
			<tr><td><code>banevent</code></td><td>["event id", "reason (optional)"]</td><td>封鎖事件（封鎖未知 id 會預先封鎖；同時將其從允許清單移除）</td></tr>
			<tr><td><code>allowevent</code></td><td>["event id", "reason (optional)"]</td><td>將事件加入允許清單（同時解除封鎖；允許未知 id 會預先允許）</td></tr>
			<tr><td><code>unallowevent</code> / <code>unbanevent</code></td><td>["event id"]</td><td>從允許 / 封鎖清單移除事件（條目不存在也會成功）</td></tr>
			<tr><td><code>listbannedevents</code></td><td>[]</td><td>列出被封鎖的事件（查詢失敗會顯示錯誤，絕不會傳回空清單）</td></tr>
			<tr><td><code>listallowedevents</code></td><td>[]</td><td>列出允許的事件</td></tr>
			<tr><td><code>listeventsneedingmoderation</code></td><td>[]</td><td>等待審核的事件（此中繼上始終為空）</td></tr>
			<tr><td><code>listclaims</code></td><td>[]</td><td>列出 NIP-43 邀請碼</td></tr>
			<tr><td><code>createclaim</code> / <code>deleteclaim</code></td><td>["claim"]</td><td>簽發 / 撤銷 NIP-43 邀請碼（攜帶已列出邀請碼的 kind:28934 會接納其作者）</td></tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="委派管理">
		<code>rpc.admin_pubkey</code>（與管理權杖）仍是擁有所有方法的最高權限登入。其他
		公鑰用 NIP-98 認證，並且只能執行透過 <code>assignmethod</code> 授予它們的方法
		（<code>supportedmethods</code> 顯示它們自己的子集）。權限、角色、邀請碼與中繼身分
		管理保持僅管理員，因此被授權者永遠無法提權。被封鎖的公鑰即使有授權也會被拒絕。
	</Callout>

	<Callout type="note" title="在公開 POST / 路由上提供">
		NIP-86 RPC 掛載在中繼的公開 POST / 路由上。變更會以已認證身分記錄在
		限速稽核日誌中（每分鐘最多 600 條）。超過 <code>rpc.max_admin_body_bytes</code> 的請求
		會被 413 拒絕。
	</Callout>
</div>
