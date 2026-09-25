<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('zh-Hant', path);
</script>

<DocsTitle
	title="支援的 NIP 參考"
	description="nostrfy 實作的每個中繼端 NIP — 類型、說明與注意事項 — 以及 NIP-11 supported_nips 清單如何動態計算。"
/>

<div class="doc-body">
	<h2>已實作的 NIP</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>說明</th>
			</tr>
		</thead>
		<tbody>
			<tr><td>1</td><td>基礎協定（事件、訂閱）</td></tr>
			<tr><td>9</td><td>事件刪除</td></tr>
			<tr><td>11</td><td>中繼資訊文件</td></tr>
			<tr><td>13</td><td>工作量證明</td></tr>
			<tr><td>17</td><td>私訊（kind 14 包裝在 kind 15 中；開啟 NIP-42 認證時，kind 1059 與臨時 kind 21059 禮物包裝僅向收件人提供）</td></tr>
			<tr><td>22</td><td>留言（kind 1111，透過 #e 索引討論串化）</td></tr>
			<tr><td>26</td><td>委派事件簽章</td></tr>
			<tr><td>28</td><td>公開聊天（用戶端側：作為一般事件儲存與提供，不公佈）</td></tr>
			<tr><td>29</td><td>基於中繼的群組</td></tr>
			<tr><td>32</td><td>標籤（kind 1985，#l/#L 已索引）</td></tr>
			<tr><td>33</td><td>參數化可替換事件</td></tr>
			<tr><td>34</td><td>git 相關（類型 1617-1619、1621、1622、1630-1633、30617/30618 — 透過 <code>relay.enabled_git</code> 選用啟用，預設關閉）</td></tr>
			<tr><td>40</td><td>過期時間戳</td></tr>
			<tr><td>42</td><td>用戶端認證</td></tr>
			<tr><td>43</td><td>中繼存取中繼資料（角色）— 類型 33534/13534/8000/8001 加上臨時 28934/28935/28936；中繼簽章的中繼資料受 AUTH 門控。邀請碼透過 NIP-86 <code>createclaim</code>/<code>deleteclaim</code> 簽發；攜帶已列碼的 kind:28934 會接納其作者</td></tr>
			<tr><td>45</td><td>結果計數（COUNT）</td></tr>
			<tr><td>46</td><td>Nostr Connect</td></tr>
			<tr><td>47</td><td>Nostr Wallet Connect</td></tr>
			<tr><td>50</td><td>搜尋能力（全文，依相關性排序）</td></tr>
			<tr><td>57</td><td>閃電 Zap（類型 9734/9735）</td></tr>
			<tr><td>59</td><td>禮物包裝（僅向收件人提供）</td></tr>
			<tr><td>62</td><td>消除請求</td></tr>
			<tr><td>65</td><td>中繼清單中繼資料</td></tr>
			<tr><td>66</td><td>中繼探索與存活（類型 30166/10166 儲存與提供；自動發布 kind 30166）</td></tr>
			<tr><td>67</td><td>EOSE 完整性提示</td></tr>
			<tr><td>70</td><td>受保護事件</td></tr>
			<tr><td>77</td><td>Negentropy 同步（失敗的替換會依 NIP-77 用 NEG-ERR 關閉該 id）</td></tr>
			<tr><td>78</td><td>應用特定資料（kind 30078，受 AUTH 門控）</td></tr>
			<tr><td>84</td><td>精選</td></tr>
			<tr><td>85</td><td>可信斷言（類型 30382/30383/30384/30385/10040，可定址）</td></tr>
			<tr><td>86</td><td>中繼管理 API</td></tr>
			<tr><td>87</td><td>Cashu 與 Fedimint 公告（類型 38000/38172/38173）</td></tr>
			<tr><td>88</td><td>投票</td></tr>
			<tr><td>94</td><td>檔案中繼資料（kind 1063）</td></tr>
			<tr><td>98</td><td>HTTP 認證</td></tr>
			<tr><td>A3</td><td>支付目標（kind 10133，可替換），草案；會被提供但不在 <code>supported_nips</code> 中公佈</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom（BUD-01/02）不是 NIP，也不在 NIP-11 文件中公佈 — 它作為
		獨立檔案伺服器執行在 <code>[blossom]</code> 主機名稱上。詳情見
		<a href={p('/docs/blossom/')}>Blossom 檔案伺服器</a>頁面。
	</p>

	<h2>動態 NIP 公佈</h2>
	<p>
		<code>supported_nips</code> 清單不是靜態的：當某個 NIP 定義的所有類型都被中繼的
		存取控制拒絕時，它就會從清單中移除。
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — 封鎖某個 NIP 的所有類型會隱藏它（例如封鎖
			kind 5 會隱藏 NIP-09）。只封鎖部分類型則保留該 NIP。
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — 類型只有被列出才被接受；所有類型都未列出的
			NIP 會被隱藏。
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — 不在 NIP 強制豁免清單
			（<code>22242</code>、<code>27235</code>、<code>28934</code>/<code>28935</code>/<code>28936</code>、
			<code>24133</code>、<code>23194</code>/<code>23195</code>、<code>24242</code>、<code>21059</code>）
			中的臨時類型會被拒絕，因此依賴它們的 NIP 會被隱藏。
		</li>
		<li>
			<strong>前置條件</strong> — NIP-29、NIP-43 與 NIP-66 依賴中繼簽章的事件，沒有
			<code>relay.private_key</code> 時會被隱藏；NIP-86 在未設定
			<code>rpc.management_token</code> 或 <code>rpc.admin_pubkey</code> 時會被隱藏（否則每次
			管理呼叫都被拒絕）。
		</li>
		<li>
			沒有專用類型的 NIP（<code>1</code>、<code>11</code>、<code>13</code>、<code>26</code>、<code>33</code>、
			<code>40</code>、<code>45</code>、<code>50</code>、<code>67</code>、<code>70</code>、
			<code>77</code>）在啟用時始終公佈。
		</li>
	</ul>
	<p>
		執行階段所做的變更 — NIP-86 <code>allowkind</code>/<code>disallowkind</code>，或對
		<code>reject_ephemeral</code> 的 SIGHUP 重載 — 會在下一次 NIP-11 取得中體現。
		<code>enabled_nips</code>/<code>disabled_nips</code> 仍然需要重新啟動。
	</p>
</div>
