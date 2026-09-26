<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ja', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# まず dry-run — すべてのイベントを検証し、何も書き込みません
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# インポート（先に nostrfy リレーを停止）
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="コマンドリファレンス"
	description="すべての nostrfy コマンド:init、start、stop、stats、upgrade、migrate-strfry に加え、CLI のアクセスリストと inbox/outbox 購読フィルター。"
/>

<div class="doc-body">
	<h2>概要</h2>
	<p>すべてのコマンドは次のオプションを受け付けます: <code>--config &lt;path&gt;</code>(既定では <code>nostrfy.toml</code>)。</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>コマンド</th>
				<th>説明</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>既定の nostrfy.toml を書き込んで終了します。ファイルは 0600 で作成されます</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>NIP-29 グループ用の秘密鍵を生成して relay.private_key に書き込み、設定を 0600 に設定して公開鍵を表示します。読み取り後にファイルが変更されている場合は書き込まずに中止します</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>設定を検証します(起動前に実行)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>デーモンとして起動します。<code>--foreground</code> を付けるとターミナルで実行します</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>実行中のデーモンを停止します</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>停止して再起動します(設定を読み直します)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>ライブ統計を表示します</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>バイナリを最新の GitHub リリース(または指定バージョン)に更新します。プラットフォームに合ったアセットをダウンロードし、sha256 チェックサムを検証して <code>--version</code> で動作確認し、バイナリをアトミックに置き換えます。並行実行はロックファイルで直列化されます。バージョンを指定しない限りダウングレードしません。<code>--force</code> で再インストールします</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>strfry リレーからイベントをインポートします — <code>--strfry-db</code> を指定して <code>strfry export</code> を実行するか、<code>--input</code> で JSONL ファイルを読み取るか、stdin 経由でパイプ入力します。再実行可能で、<code>--dry-run</code>、<code>--since</code> と任意の設定の統合に対応します</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>アクセスリストの管理</h2>
	<p>
		リレーの公開鍵許可/拒否リストと Blossom アップロード許可リストは LMDB に保存され、即座に有効になります — 実行中のデーモンは自動的にリロードされます:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>拒否された公開鍵は投稿時も読み取り時も常に拒否されます。</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> は永続化された NIP-86 ブロック IP リストから IP を削除します(セルフロックアウトからの復旧)。適用にはデーモンの再起動が必要です。
	</p>

	<h2>Inbox/outbox 購読フィルター</h2>
	<p>
		nostrfy は inbox/outbox ルーティングモデル向けに REQ フィルター構文を拡張し、2 つの便利キーを追加しました — これは nostrfy の拡張であり、どの NIP にも含まれません。<code>"outbox"</code> は <code>"authors"</code> に展開されます:<em>その公開鍵</em>が<em>作成した</em>イベントのみを含みます。
		<code>"inbox"</code> は <code>"#p"</code> に展開されます:<em>その公開鍵</em>宛てのイベント(メンション、返信、Zap、DM)のみを含みます。値は 64 桁の 16 進数または <code>npub1</code> エンコード、または既存の <code>authors</code>/<code>#p</code>
		 キーとマージされる配列です。無効な公開鍵はその購読を拒否します:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		エンドポイントにも書き込み制限があります:<code>/outbox</code> は、接続の NIP-42 認証済み公開鍵が作成したイベント(<code>server.outbox_write_policy = "any"</code>)、またはリレー自身のイベント(<code>"relay"</code>)のみを受け付けます。
		<code>/inbox</code> は、<code>p</code> タグ付きのイベントのみ受け付けます。
	</p>

	<h2>strfry からの移行</h2>
	<p>
		1 つのコマンドで既存の strfry リレーのイベントを取り込みます。移行はオフラインで(先に nostrfy リレーを停止 — データベースが使用中の場合は実行を拒否します)、strfry 自身のエクスポート形式を読み取り、安全に再実行できます。重複はスキップされ、削除の副作用は再適用されます。
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		同等の strfry 設定を <code>nostrfy.toml</code> に統合することも提案します。中断後は <code>--since</code>
		オプションで再開できます。NIP-29 グループと NIP-43 ロールは初回起動時にインポートされたイベントから再構築されます。完全な手順は
		<a href={p('/docs/migrating-from-strfry/')}>移行ガイド</a>。
	</p>

	<Callout type="tip" title="ステップバイステップ">
		ほとんどのコマンドは<a href={p('/docs/quick-start/')}>クイックスタートガイド</a>にも手順があります。
	</Callout>
</div>
