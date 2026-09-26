<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list

nostrfy blossom allow npub1...
nostrfy blossom deny npub1...
nostrfy blossom list`;

	const reqCode = `["REQ", "my-feed", {"outbox": "npub1..."}]
["REQ", "mentions", {"inbox": "npub1...", "kinds": [1, 7]}]`;

	const migrateCode = `# primeiro uma simulação — verifica cada evento e não grava nada
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run

# importação (pare antes o relay nostrfy)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db`;
</script>

<DocsTitle
	title="Referência de comandos"
	description="Todos os comandos do nostrfy: init, start, stop, stats, upgrade e migrate-strfry, além das listas de acesso da CLI e dos filtros de assinatura inbox/outbox."
/>

<div class="doc-body">
	<h2>Visão geral</h2>
	<p>Todos os comandos aceitam <code>--config &lt;path&gt;</code> (padrão <code>nostrfy.toml</code>).</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Comando</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>nostrfy init</code></td>
				<td>Grava um nostrfy.toml padrão e sai; o arquivo é criado com 0600</td>
			</tr>
			<tr>
				<td><code>nostrfy genkey</code></td>
				<td>Gera uma chave secreta para grupos NIP-29, grava em relay.private_key, define a configuração como 0600 e imprime a chave pública; se o arquivo mudou desde a leitura, aborta sem gravar</td>
			</tr>
			<tr>
				<td><code>nostrfy check</code></td>
				<td>Valida a configuração (execute antes de iniciar)</td>
			</tr>
			<tr>
				<td><code>nostrfy start</code></td>
				<td>Inicia como daemon; <code>--foreground</code> roda no terminal</td>
			</tr>
			<tr>
				<td><code>nostrfy stop</code></td>
				<td>Para o daemon em execução</td>
			</tr>
			<tr>
				<td><code>nostrfy restart</code></td>
				<td>Para e inicia de novo (relê a configuração)</td>
			</tr>
			<tr>
				<td><code>nostrfy stats</code></td>
				<td>Mostra estatísticas ao vivo</td>
			</tr>
			<tr>
				<td><code>nostrfy upgrade [version]</code></td>
				<td>Atualiza o binário para a última release do GitHub (ou a versão indicada); baixa o asset da plataforma, verifica seu sha256 e executa uma sonda <code>--version</code>, depois substitui o binário de forma atômica; execuções concorrentes são serializadas por arquivo de lock; sem versão indicada nunca faz downgrade; <code>--force</code> força a reinstalação</td>
			</tr>
			<tr>
				<td><code>nostrfy migrate-strfry</code></td>
				<td>Importa eventos de um relay strfry — seja executando <code>strfry export</code> via <code>--strfry-db</code>, lendo um arquivo JSONL com <code>--input</code> ou recebendo via stdin; repetível, com <code>--dry-run</code>, <code>--since</code> e a mesclagem opcional de configurações</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Gerenciar as listas de acesso</h2>
	<p>
		As listas de permissão/bloqueio do relay e a allowlist de upload do Blossom ficam no LMDB e valem imediatamente — o daemon em execução recarrega automaticamente:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<p>Uma chave negada é sempre rejeitada ao publicar e nunca é servida ao ler.</p>
	<p>
		<code>nostrfy access unblockip &lt;ip&gt;</code> Remove um IP da lista persistida de IPs bloqueados pelo NIP-86 (recuperação de autobloqueio); reinicie o daemon para aplicar.
	</p>

	<h2>Filtros de assinatura inbox/outbox</h2>
	<p>
		O nostrfy estende a sintaxe de filtros REQ para o modelo de roteamento inbox/outbox com duas chaves práticas — uma extensão do nostrfy, não parte de nenhum NIP. <code>"outbox"</code> se expande para <code>"authors"</code>: só eventos <em>criados por</em> essa pubkey. <code>"inbox"</code> se expande para <code>"#p"</code>: só eventos <em>endereçados a</em> essa pubkey (menções, respostas, zaps e DMs). Os valores podem ser hex de 64 caracteres ou <code>npub1</code>, ou arrays mesclados a uma chave <code>authors</code>/<code>#p</code> existente; uma pubkey inválida rejeita a assinatura:
	</p>
	<CodeBlock code={reqCode} lang="jsonc" />
	<p>
		Os endpoints também têm restrição de escrita: <code>/outbox</code> aceita só eventos criados pela pubkey autenticada via NIP-42 da conexão (<code>server.outbox_write_policy = "any"</code>), ou só eventos do próprio relay (<code>"relay"</code>); <code>/inbox</code> aceita só eventos com tag <code>p</code>.
	</p>

	<h2>Migrar do strfry</h2>
	<p>
		Um único comando traz os eventos de um relay strfry existente. A migração é offline (pare antes o relay nostrfy — ela se recusa a rodar com o banco em uso), lê o próprio formato de exportação do strfry e é segura de repetir: duplicatas são ignoradas e os efeitos de exclusão são reaplicados.
	</p>
	<CodeBlock code={migrateCode} lang="sh" />
	<p>
		Também oferece mesclar as configurações equivalentes do strfry em <code>nostrfy.toml</code>, e após uma interrupção dá para
		retomar com <code>--since</code>. Grupos NIP-29 e papéis NIP-43 são reconstruídos a partir dos eventos importados na primeira inicialização. O manual completo está no
		<a href={p('/docs/migrating-from-strfry/')}>guia de migração</a>.
	</p>

	<Callout type="tip" title="Passo a passo">
		A maioria dos comandos também é explicada passo a passo no <a href={p('/docs/quick-start/')}>guia de início rápido</a>.
	</Callout>
</div>
