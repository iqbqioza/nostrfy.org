<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);
</script>

<DocsTitle
	title="NIP-29 群組"
	description="NIP-29 群組：只有成員可以寫入的封閉聊天空間，帶管理事件與中繼簽章的群組狀態快照。"
/>

<div class="doc-body">
	<h2>啟用群組</h2>
	<ol>
		<li>
			執行 <code>nostrfy genkey</code> 以設定 <code>relay.private_key</code>
			（<strong>必需</strong> — 沒有它就不會產生群組中繼資料）。
		</li>
		<li>重新啟動中繼。</li>
	</ol>

	<h2>群組如何運作</h2>
	<p>
		群組由事件建立與管理。中繼從這些管理事件產生中繼簽章的快照，供用戶端顯示使用：
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>事件</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>建立群組（建立者成為管理員）</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>新增成員（帶角色）/ 移除成員</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>編輯中繼資料（名稱、說明、公開/私密……）</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>刪除事件（管理）</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>刪除群組（其儲存的事件被清除）</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>建立邀請碼</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>更新置頂清單</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>加入請求 / 離開請求</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>中繼簽章的快照</h3>
	<ul>
		<li><code>kind:39000</code> — 群組中繼資料（名稱、可見性設定……）</li>
		<li><code>kind:39001</code> — 管理員清單</li>
		<li><code>kind:39002</code> — 成員清單</li>
		<li><code>kind:39005</code> — 置頂事件</li>
	</ul>

	<h2>群組可見性設定</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>標籤</th>
				<th>意義</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>只有成員可以讀取訊息</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>只有成員可以寫入</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>中繼資料對非成員隱藏</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>加入請求不會自動批准（需要邀請碼）</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>該群組有 LiveKit 影音房間</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>子群組</h2>
	<p>
		群組可以階層化 — 用 <code>parent</code> / <code>child</code> 標籤巢狀。循環會被
		自動拒絕。
	</p>

	<Callout type="warning" title="離開群組">
		任何成員 — 包括群組的最後一位管理員 — 都可以用 <code>kind:9022</code> 離開並被
		自動移除；如果最後一位管理員離開，群組將沒有管理員。請先授予另一位管理員，
		或用 <code>kind:9008</code> 刪除群組，或用中繼自己的金鑰（<code>relay.private_key</code>，即 NIP-11 self 公鑰）
		簽署一條管理事件來還原無管理員的群組。具體做法見
		<a href={p('/docs/troubleshooting/')}>疑難排解</a>。
	</Callout>
</div>
