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
	description="JSON-RPC 管理 API:Bearer または NIP-98 認証によるモデレーション、アクセスリスト、リレー識別情報、ロール、招待クレーム、委任されたメソッド付与。"
/>

<div class="doc-body">
	<h2>有効化</h2>
	<p>
		NIP-86 はリレーを管理するための JSON-RPC API です。次の2つの認証方法のいずれかが必要であり、そうでない場合はすべての呼び出しが拒否されます:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>方法</th>
				<th>設定</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Bearer トークン</td>
				<td>
					<code>rpc.management_token</code> を設定し、<code>Authorization: Bearer
					&lt;token&gt;</code> を送信する
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					<code>rpc.admin_pubkey</code> を設定し、管理者キーで署名した NIP-98 認証イベント(kind 27235)を <code>Authorization: Nostr &lt;base64&gt;</code> で送信する — <code>payload</code> タグが必須であり、各イベントは 60 秒の有効期間内で使い捨てです
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>API の呼び出し</h2>
	<p>POST / に <code>Content-Type: application/nostr+json+rpc</code> を指定:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>メソッド</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>メソッド</th>
				<th>パラメータ</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>サポートされているメソッドの一覧</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>pubkey の投稿を禁止する(許可リストからも削除される)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>pubkey の禁止を解除する</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>禁止中の pubkey と理由を一覧表示する</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>許可リストに追加する(禁止も解除される)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>許可リストから削除する</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>許可リストを一覧表示する</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>kind を許可 / 不許可にする</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>許可 / 不許可の kind を一覧表示する</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>リレー名 / 説明 / アイコンを変更する(設定ファイルに保存される。ファイルに書き込めない場合はエラーを報告する)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>NIP-43 ロール管理(型の誤ったフィールドは拒否される。存在しないロールの削除は成功する)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>ロールを割り当て / 割り当て解除する(重複した付与や存在しない取り消しも成功する)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>管理者以外の pubkey に NIP-86 メソッドを付与 / 取り消す — モデレーション用および読み取りメソッドのみ付与可能です</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>メソッド付与を一覧表示する(<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>IP をブロック / ブロック解除する(ブロック時は既存の接続も切断される)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>ブロック中の IP を一覧表示する</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>イベントを禁止する(未知の ID の禁止は事前禁止となる。許可リストからも削除される)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>イベントを許可リストに追加する(禁止も解除される。未知の ID の許可は事前許可となる)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>イベントを許可 / 禁止リストから削除する(存在しないエントリでも成功する)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>禁止中のイベントを一覧表示する(参照に失敗した場合はエラーを返し、空のリストは返しません)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>許可中のイベントを一覧表示する</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>モデレーション待ちのイベント(このリレーでは常に空です)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>NIP-43 招待コードを一覧表示する</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>NIP-43 招待コードを発行 / 取り消す(リストにあるコードを含む kind:28934 がその作成者を承認します)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="委任管理">
		<code>rpc.admin_pubkey</code>(および管理トークン)は、すべてのメソッドを持つルート権限のままです。その他の pubkey は NIP-98 で認証し、<code>assignmethod</code> で付与されたメソッドのみ実行できます(<code>supportedmethods</code> には自身のサブセットが表示されます)。権限、ロール、招待クレーム、リレー識別情報の管理は管理者のみのため、被付与者が権限を昇格させることはできません。禁止された pubkey は付与があっても拒否されます。
	</Callout>

	<Callout type="note" title="公開 POST / ルートで提供">
		NIP-86 RPC はリレーの公開 POST / ルートにマウントされます。変更は認証済み ID とともにレート制限付き監査ログ(1分あたり最大 600 エントリ)に記録されます。<code>rpc.max_admin_body_bytes</code> を超えるリクエストは 413 で拒否されます。
	</Callout>
</div>
