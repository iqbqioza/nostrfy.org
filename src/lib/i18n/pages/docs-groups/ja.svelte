<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);
</script>

<DocsTitle
	title="NIP-29 グループ"
	description="NIP-29 グループ:メンバーのみが書き込めるクローズドなチャット空間。モデレーションイベントとリレー署名付きスナップショットでグループの状態を管理します。"
/>

<div class="doc-body">
	<h2>グループを有効化する</h2>
	<ol>
		<li>
			<code>nostrfy genkey</code> を実行して <code>relay.private_key</code> を設定します
			(<strong>必須</strong> — これがないとグループメタデータは生成されません)。
		</li>
		<li>リレーを再起動します。</li>
	</ol>

	<h2>グループの仕組み</h2>
	<p>
		グループはイベントによって作成・管理されます。これらのモデレーションイベントから、リレーはクライアントが表示に使うリレー署名付きスナップショットを生成します:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>イベント</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>グループを作成(作成者が管理者になる)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>メンバーを追加(ロール付き)／メンバーを削除</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>メタデータを編集(名前、説明、公開／非公開など)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>イベントを削除(モデレーション)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>グループを削除(保存されたイベントは消去される)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>招待コードを作成</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>ピン留めリストを更新</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>参加リクエスト／退出リクエスト</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>リレー署名付きスナップショット</h3>
	<ul>
		<li><code>kind:39000</code> — グループメタデータ(名前、可視性設定など)</li>
		<li><code>kind:39001</code> — 管理者リスト</li>
		<li><code>kind:39002</code> — メンバーリスト</li>
		<li><code>kind:39005</code> — ピン留めされたイベント</li>
	</ul>

	<h2>グループの可視性設定</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>タグ</th>
				<th>意味</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>メンバーのみがメッセージを読める</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>メンバーのみが書き込める</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>メタデータは非メンバーに非表示になります</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>参加リクエストは自動承認されない(招待コードが必要)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>グループに LiveKit 音声／ビデオルームがある</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>サブグループ</h2>
	<p>
		グループは階層化できます — <code>parent</code>／<code>child</code> タグでネストします。循環は自動的に拒否されます。
	</p>

	<Callout type="warning" title="グループからの退出">
		<code>kind:9022</code> を使えば、最後の管理者を含むあらゆるメンバーが退出でき、退出したメンバーは自動的に削除されます。最後の管理者が退出すると、グループには管理者がいなくなります。事前に別の管理者を指名するか、<code>kind:9008</code> でグループを削除するか、リレー自身の鍵(<code>relay.private_key</code>、NIP-11 の self pubkey)でモデレーションイベントに署名して管理者不在のグループを復旧してください。手順は <a href={p('/docs/troubleshooting/')}>トラブルシューティング</a> を参照してください。
	</Callout>
</div>
