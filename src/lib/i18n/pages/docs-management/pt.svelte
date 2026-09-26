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
	title="Gerenciamento NIP-86"
	description="A API de gerenciamento JSON-RPC: moderação, listas de acesso, identidade do relay, papéis, códigos de convite e delegações de métodos, com autenticação Bearer ou NIP-98."
/>

<div class="doc-body">
	<h2>Ativação</h2>
	<p>
		NIP-86 é uma API JSON-RPC para gerenciar o relay. Ela precisa de um dos dois métodos de autenticação, caso contrário cada chamada é recusada:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Método</th>
				<th>Configuração</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Token Bearer</td>
				<td>
					Defina <code>rpc.management_token</code> e envie <code>Authorization: Bearer
					&lt;token&gt;</code>
				</td>
			</tr>
			<tr>
				<td>NIP-98</td>
				<td>
					Defina <code>rpc.admin_pubkey</code> e envie um evento de autenticação NIP-98 (kind 27235) assinado pela chave de administração em <code>Authorization: Nostr &lt;base64&gt;</code> — uma tag <code>payload</code> é obrigatória; cada evento é de uso único dentro da sua janela de 60 segundos
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Chamar a API</h2>
	<p>POST / com <code>Content-Type: application/nostr+json+rpc</code>:</p>
	<CodeBlock code={call} lang="bash" />

	<h2>Métodos</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Método</th>
				<th>Parâmetros</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>supportedmethods</code></td>
				<td>[]</td>
				<td>Lista de métodos suportados</td>
			</tr>
			<tr>
				<td><code>banpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Banir uma pubkey de publicar (também a remove da lista de permissão)</td>
			</tr>
			<tr>
				<td><code>unbanpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Desbanir uma pubkey</td>
			</tr>
			<tr>
				<td><code>listbannedpubkeys</code></td>
				<td>[]</td>
				<td>Listar pubkeys banidas e motivos</td>
			</tr>
			<tr>
				<td><code>allowpubkey</code></td>
				<td>["pubkey", "reason (optional)"]</td>
				<td>Adicionar à lista de permissão (também remove o ban)</td>
			</tr>
			<tr>
				<td><code>unallowpubkey</code></td>
				<td>["pubkey"]</td>
				<td>Remover da lista de permissão</td>
			</tr>
			<tr>
				<td><code>listallowedpubkeys</code></td>
				<td>[]</td>
				<td>Listar a lista de permissão</td>
			</tr>
			<tr>
				<td><code>allowkind</code> / <code>disallowkind</code></td>
				<td>[kind]</td>
				<td>Permitir / negar um kind</td>
			</tr>
			<tr>
				<td><code>listallowedkinds</code> / <code>listdisallowedkinds</code></td>
				<td>[]</td>
				<td>Listar kinds permitidos / negados</td>
			</tr>
			<tr>
				<td>
					<code>changerelayname</code> / <code>changerelaydescription</code> /
					<code>changerelayicon</code>
				</td>
				<td>["new value"]</td>
				<td>Alterar o nome / descrição / ícone do relay (persistido no arquivo de configuração; retorna um erro quando o arquivo não pode ser escrito)</td>
			</tr>
			<tr>
				<td><code>createrole</code> / <code>editrole</code> / <code>deleterole</code></td>
				<td>[id, label, description, color, order]</td>
				<td>Gerenciamento de papéis NIP-43 (campos com tipo errado são rejeitados; excluir um papel inexistente retorna sucesso)</td>
			</tr>
			<tr>
				<td><code>assignrole</code> / <code>unassignrole</code></td>
				<td>["pubkey", "role id"]</td>
				<td>Atribuir / remover um papel (uma concessão duplicada ou uma revogação inexistente retorna sucesso)</td>
			</tr>
			<tr>
				<td><code>assignmethod</code> / <code>unassignmethod</code></td>
				<td>["pubkey", "method"]</td>
				<td>Conceder / revogar um método NIP-86 a uma pubkey não administradora — apenas métodos de moderação e leitura podem ser delegados</td>
			</tr>
			<tr>
				<td><code>listmethodassignees</code></td>
				<td>[]</td>
				<td>Listar concessões de métodos (<code>[&#123;pubkey, methods&#125;]</code>)</td>
			</tr>
			<tr>
				<td><code>blockip</code> / <code>unblockip</code></td>
				<td>["ip", "reason (optional)"]</td>
				<td>Bloquear / desbloquear um IP (bloquear também encerra as conexões existentes)</td>
			</tr>
			<tr>
				<td><code>listblockedips</code></td>
				<td>[]</td>
				<td>Listar IPs bloqueados</td>
			</tr>
			<tr>
				<td><code>banevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Banir um evento (banir um id desconhecido pré-bane-o; também o remove da lista de permissão)</td>
			</tr>
			<tr>
				<td><code>allowevent</code></td>
				<td>["event id", "reason (optional)"]</td>
				<td>Adicionar um evento à lista de permissão (também levanta o ban; permitir um id desconhecido pré-permite-o)</td>
			</tr>
			<tr>
				<td><code>unallowevent</code> / <code>unbanevent</code></td>
				<td>["event id"]</td>
				<td>Remover um evento da lista de permissão / bloqueio (uma entrada inexistente retorna sucesso)</td>
			</tr>
			<tr>
				<td><code>listbannedevents</code></td>
				<td>[]</td>
				<td>Listar eventos banidos (uma busca com falha retorna um erro, nunca uma lista vazia)</td>
			</tr>
			<tr>
				<td><code>listallowedevents</code></td>
				<td>[]</td>
				<td>Listar eventos permitidos</td>
			</tr>
			<tr>
				<td><code>listeventsneedingmoderation</code></td>
				<td>[]</td>
				<td>Eventos a aguardar moderação (sempre vazio neste relay)</td>
			</tr>
			<tr>
				<td><code>listclaims</code></td>
				<td>[]</td>
				<td>Listar códigos de convite NIP-43</td>
			</tr>
			<tr>
				<td><code>createclaim</code> / <code>deleteclaim</code></td>
				<td>["claim"]</td>
				<td>Emitir / revogar um código de convite NIP-43 (um kind:28934 com um código listado admite o seu autor)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<Callout type="note" title="Administração delegada">
		<code>rpc.admin_pubkey</code> (e o token de gerenciamento) continua sendo o acesso raiz, com todos os métodos. As outras pubkeys se autenticam com NIP-98 e só podem executar os métodos concedidos via <code>assignmethod</code> (<code>supportedmethods</code> mostra o próprio subconjunto). O gerenciamento de permissões, papéis, códigos de convite e identidade do relay continua restrito ao admin, então um usuário com concessão nunca consegue escalar privilégios. Uma pubkey banida é recusada mesmo com concessões.
	</Callout>

	<Callout type="note" title="Servido nas rotas públicas POST /">
		O RPC NIP-86 fica nas rotas públicas POST / do relay. As alterações são registradas em um log de auditoria com limite de taxa (no máximo 600 entradas por minuto) com a identidade autenticada. Requisições acima de <code>rpc.max_admin_body_bytes</code> são recusadas com 413.
	</Callout>
</div>
