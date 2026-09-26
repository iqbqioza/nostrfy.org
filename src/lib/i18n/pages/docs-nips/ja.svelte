<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);
</script>

<DocsTitle
	title="サポートされている NIP リファレンス"
	description="nostrfy が実装するすべてのリレー側 NIP — kind、注記と注意点 — および NIP-11 の supported_nips リストが動的に計算される仕組み。"
/>

<div class="doc-body">
	<h2>実装済み NIP</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>基本プロトコル(イベント、サブスクリプション)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>イベント削除</td>
			</tr>
			<tr>
				<td>11</td>
				<td>リレー情報ドキュメント</td>
			</tr>
			<tr>
				<td>13</td>
				<td>プルーフ・オブ・ワーク</td>
			</tr>
			<tr>
				<td>17</td>
				<td>プライベート DM(kind 14 を kind 15 でラップ;NIP-42 認証が有効な場合、kind 1059 およびエフェメラルな kind 21059 のギフトラップは受信者のみに提供)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>コメント(kind 1111、#e インデックスによるスレッド化)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>委任イベント署名</td>
			</tr>
			<tr>
				<td>28</td>
				<td>パブリックチャット(クライアント側:通常イベントとして保存・提供され、広告されない)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>リレーベースのグループ</td>
			</tr>
			<tr>
				<td>32</td>
				<td>ラベリング(kind 1985、#l/#L インデックス付き)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>パラメータ化された置換可能イベント</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					git 関連(kind 1617-1619、1621、1622、1630-1633、30617/30618 —
					<code>relay.enabled_git</code> によるオプトイン、既定では無効)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>有効期限タイムスタンプ</td>
			</tr>
			<tr>
				<td>42</td>
				<td>クライアント認証</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					リレーアクセスメタデータ(ロール)— kinds 33534/13534/8000/8001 およびエフェメラル 28934/28935/28936;
					リレー署名付きメタデータは AUTH ゲート付き。招待コードは NIP-86
					<code>createclaim</code>/<code>deleteclaim</code> で発行;リスト掲載コードを含む kind:28934 はその作成者を許可する
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>結果カウント(COUNT)</td>
			</tr>
			<tr>
				<td>46</td>
				<td>Nostr Connect</td>
			</tr>
			<tr>
				<td>47</td>
				<td>Nostr Wallet Connect</td>
			</tr>
			<tr>
				<td>50</td>
				<td>検索機能(全文検索、関連度順)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Lightning ザップ(kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>ギフトラップ(受信者のみに提供)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>消去リクエスト</td>
			</tr>
			<tr>
				<td>65</td>
				<td>リレーリストメタデータ</td>
			</tr>
			<tr>
				<td>66</td>
				<td>リレー探索と活性(kinds 30166/10166 を保存・提供;kind 30166 を自己公開)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>EOSE 完全性ヒント</td>
			</tr>
			<tr>
				<td>70</td>
				<td>保護されたイベント</td>
			</tr>
			<tr>
				<td>77</td>
				<td>negentropy 同期(置換に失敗すると NIP-77 に従い NEG-ERR でその id を閉じる)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>アプリケーション固有データ(kind 30078、AUTH 必須)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>ハイライト</td>
			</tr>
			<tr>
				<td>85</td>
				<td>信頼できるアサーション(kinds 30382/30383/30384/30385/10040、アドレス可能)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>リレー管理 API</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Cashu および Fedimint アナウンス(kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>投票</td>
			</tr>
			<tr>
				<td>94</td>
				<td>ファイルメタデータ(kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>HTTP 認証</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					支払いターゲット(kind 10133、置換可能)、ドラフト;提供されるが
					<code>supported_nips</code> では広告されない
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom(BUD-01/02)は NIP ではなく、NIP-11 ドキュメントでも広告されません — 独立したファイルサーバーとして
		<code>[blossom]</code> ホスト名上で提供されます。詳細は
		<a href={p('/docs/blossom/')}>Blossom ファイルサーバー</a> ページを参照してください。
	</p>

	<h2>動的な NIP 広告</h2>
	<p>
		<code>supported_nips</code> リストは静的ではありません:NIP が定義するすべての kind がリレーのアクセス制御で拒否されると、その NIP はリストから除外されます。
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — NIP のすべての kind をブロックすると非表示になります(例:kind 5 のブロックで NIP-09 が非表示)。一部の kind のみのブロックでは NIP は残ります。
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — kind はリスト掲載時のみ受け入れられます;すべての kind が未掲載の NIP は非表示になります。
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — NIP で義務付けられた除外リスト(<code>22242</code>、<code>27235</code>、<code>28934</code>/<code>28935</code>/
			<code>28936</code>、<code>24133</code>、<code>23194</code>/<code>23195</code>、<code>24242</code>、
			<code>21059</code>)にないエフェメラル kind は拒否されるため、それらに依存する NIP は非表示になります。
		</li>
		<li>
			<strong>前提条件</strong> — NIP-29、NIP-43、NIP-66 はリレー署名付きイベントに依存し、
			<code>relay.private_key</code> なしでは非表示になります;NIP-86 は
			<code>rpc.management_token</code> または <code>rpc.admin_pubkey</code> が設定されていない限り非表示になります(そうでない場合、すべての管理呼び出しが拒否されます)。
		</li>
		<li>
			専用 kind を持たない NIP(<code>1</code>、<code>11</code>、<code>13</code>、<code>26</code>、<code>33</code>、
			<code>40</code>、<code>45</code>、<code>50</code>、<code>67</code>、<code>70</code>、
			<code>77</code>)は、有効な場合つねに広告されます。
		</li>
	</ul>
	<p>
		ランタイムでの変更 — NIP-86 の <code>allowkind</code>/<code>disallowkind</code>、または <code>reject_ephemeral</code> の SIGHUP リロード
		— は次回の NIP-11 取得に反映されます。
		<code>enabled_nips</code>/<code>disabled_nips</code> は依然として再起動が必要です。
	</p>
</div>
