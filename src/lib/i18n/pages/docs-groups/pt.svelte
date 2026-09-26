<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);
</script>

<DocsTitle
	title="Grupos NIP-29"
	description="Grupos NIP-29: espaços de conversa fechados onde só membros podem escrever, com eventos de moderação e instantâneos do estado do grupo assinados pelo relay."
/>

<div class="doc-body">
	<h2>Ativar grupos</h2>
	<ol>
		<li>
			Execute <code>nostrfy genkey</code> para definir <code>relay.private_key</code>
			(<strong>obrigatório</strong> — sem ele, os metadados do grupo não são gerados).
		</li>
		<li>Reinicie o relay.</li>
	</ol>

	<h2>Como funcionam os grupos</h2>
	<p>
		Os grupos são criados e moderados por eventos. A partir desses eventos de moderação, o relay gera
		instantâneos assinados pelo relay que os clientes usam para exibição:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Evento</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>kind:9007</code></td>
				<td>Criar grupo (o criador torna-se administrador)</td>
			</tr>
			<tr>
				<td><code>kind:9000</code> / <code>9001</code></td>
				<td>Adicionar membro (com funções) / remover membro</td>
			</tr>
			<tr>
				<td><code>kind:9002</code></td>
				<td>Editar metadados (nome, descrição, público/privado, ...)</td>
			</tr>
			<tr>
				<td><code>kind:9005</code></td>
				<td>Excluir evento (moderação)</td>
			</tr>
			<tr>
				<td><code>kind:9008</code></td>
				<td>Excluir grupo (seus eventos armazenados são purgados)</td>
			</tr>
			<tr>
				<td><code>kind:9009</code></td>
				<td>Criar código de convite</td>
			</tr>
			<tr>
				<td><code>kind:9010</code></td>
				<td>Atualizar lista de fixados</td>
			</tr>
			<tr>
				<td><code>kind:9021</code> / <code>9022</code></td>
				<td>Pedido de entrada / pedido de saída</td>
			</tr>
		</tbody>
	</table>
	</div>
	<h3>Instantâneos assinados pelo relay</h3>
	<ul>
		<li><code>kind:39000</code> — metadados do grupo (nome, configurações de visibilidade, ...)</li>
		<li><code>kind:39001</code> — lista de administradores</li>
		<li><code>kind:39002</code> — lista de membros</li>
		<li><code>kind:39005</code> — eventos fixados</li>
	</ul>

	<h2>Configurações de visibilidade do grupo</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Tag</th>
				<th>Significado</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>private</code></td>
				<td>Só membros podem ler mensagens</td>
			</tr>
			<tr>
				<td><code>restricted</code></td>
				<td>Só membros podem escrever</td>
			</tr>
			<tr>
				<td><code>hidden</code></td>
				<td>Metadados ficam ocultos para não membros</td>
			</tr>
			<tr>
				<td><code>closed</code></td>
				<td>Pedidos de entrada não são aprovados automaticamente (códigos de convite obrigatórios)</td>
			</tr>
			<tr>
				<td><code>livekit</code></td>
				<td>O grupo tem uma sala de áudio/vídeo LiveKit</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Subgrupos</h2>
	<p>
		Os grupos podem ser hierárquicos — aninhados com tags <code>parent</code> / <code>child</code>. Ciclos são
		rejeitados automaticamente.
	</p>

	<Callout type="warning" title="Sair de um grupo">
		Qualquer membro — incluindo o último administrador do grupo — pode sair com <code>kind:9022</code> e é
		removido automaticamente; se o último administrador sair, o grupo fica sem administradores. Promova outro administrador primeiro,
		ou exclua o grupo com <code>kind:9008</code>, ou recupere um grupo sem administrador assinando um
		evento de moderação com a própria chave do relay (<code>relay.private_key</code>, a pubkey <code>self</code> do NIP-11).
		Veja <a href={p('/docs/troubleshooting/')}>solução de problemas</a> para o passo a passo.
	</Callout>
</div>
