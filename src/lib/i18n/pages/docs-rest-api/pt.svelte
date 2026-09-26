<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const baseUrl = `http://<host>:<port>/api/v1/{identifier}
http://<host>:<port>/api/v1/{identifier}/{kind}`;
	const sample = `{
  "events": [
    {
      "id": "32-byte hex event id",
      "pubkey": "32-byte hex pubkey",
      "created_at": 1700000000,
      "kind": 1,
      "tags": [["t", "example"]],
      "content": "hello",
      "sig": "64-byte hex signature"
    }
  ],
  "count": 1,
  "more": false
}`;
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # página 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # página 2 (quando more era true)`;
	const npub = 'npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc';
	const notesEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1"`;
	const paginateEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?limit=10&offset=10&sort=asc"`;
	const byIdEx = `curl "http://127.0.0.1:8080/api/v1/note1..."
curl "http://127.0.0.1:8080/api/v1/nevent1..."`;
	const naddrEx = `curl "http://127.0.0.1:8080/api/v1/naddr1..."`;
	const searchEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/1?search=rust"`;
	const tagEx = `curl "http://127.0.0.1:8080/api/v1/${npub}/7?e=<event-id>&limit=100"`;
</script>

<DocsTitle
	title="Referência da API REST"
	description="API HTTP somente leitura para consultar eventos Nostr armazenados em GET /api/v1/... — endpoints, parâmetros, paginação, regras de visibilidade e erros."
/>

<div class="doc-body">
	<h2>URL base</h2>
	<p>
		A API é servida sob <code>/api/v1</code> na mesma porta do relay WebSocket:
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Roteamento por host (<code>server.api_host</code>)</h2>
	<p>
		Quando <code>server.api_host</code> (ex.: <code>api.example.com</code>) está configurado, a API e o relay são separados pelo cabeçalho Host: <code>api.example.com</code> recebe <code>/api/v1</code>,
		<code>/health</code> e <code>/metrics</code>; qualquer outro host recebe o relay WebSocket e NIP-11.
		Sem <code>api_host</code>, a API é servida em todos os hosts. Apenas GET é suportado — solicitações de upgrade WebSocket para <code>/api/v1</code> são recusadas com 403.
	</p>

	<h2>Endpoints</h2>
	<h3>Caminhos baseados em identificadores</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Caminho</th>
				<th>Retorna</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>Evento de perfil kind-0 mais recente</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>O evento único com este id</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>Eventos do endereço (kind + autor + tag d)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>Eventos por pubkey, filtrados por kind (aceita npub1... ou nprofile1...; 400 caso contrário)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Identificadores de autor aceitam <code>npub1...</code>, <code>nprofile1...</code> ou uma pubkey hexadecimal de 64 caracteres (insensível a maiúsculas) em cada endpoint.
	</p>
	<h3>Endpoints de consulta e agregação</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — consulta genérica com filtro sem identificador.</li>
		<li><code>GET /api/v1/count</code> — contagem total para os mesmos parâmetros de filtro (semântica NIP-45).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — contagens de eventos por kind para um autor, os mais usados primeiro.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — contagens por dia para um mês;
			o mês deve ser 1–12, e cada dia é relatado com preenchimento de zeros até o último dia (cada entrada e o total trazem uma marca <code>approximate</code>).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — um evento único pelo seu id hexadecimal de 64 caracteres (prefixos rejeitados).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — resumo do autor (total, primeira/última atividade, divisão por kind); <code>first_seen</code>/<code>last_seen</code>/meses são <code>null</code> quando não existem eventos visíveis.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — contagens por hora para um dia; todas as 24 horas são relatadas com preenchimento de zeros (mesmas marcas <code>approximate</code> de daily).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — respostas (#e) e citações (#q) que referenciam o evento; o id do caminho é convertido para minúsculas antes da comparação, e um parâmetro de consulta <code>e</code> é combinado com OR no lado #e.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — a lista de seguidos kind-3 mais recente do autor.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — os kinds mais comuns no relay (amostra limitada, filtrada por visibilidade; marcas <code>approximate</code> e <code>filtered</code>).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — os autores mais ativos no relay (amostra limitada, filtrada por visibilidade; marcas <code>approximate</code> e <code>filtered</code>).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — a lista de relays NIP-65 mais recente do autor (kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — contagens por mês, com preenchimento de zeros no intervalo since/until (padrão: todo o período; limitado a 120 meses).
		</li>
	</ul>

	<h2>Parâmetros de consulta</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Parâmetro</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Máx. de resultados (padrão 100, limitado por max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Número de resultados visíveis a ignorar (paginação)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Apenas eventos com created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Apenas eventos com created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> para os mais antigos primeiro; padrão é os mais recentes primeiro</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>Busca de texto completo NIP-50 (correspondência de palavras inteiras)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Filtrar por tags #e / #p / #t / #d</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Excluir eventos com essa tag — aplicado antes da paginação, para que eventos excluídos nunca consumam espaços de limit nem passos de offset
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Formato de resposta</h2>
	<p>Respostas bem-sucedidas retornam <code>200 OK</code> com o seguinte corpo JSON:</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Campo</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>Os eventos desta página (mais recentes primeiro por padrão)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>O número de eventos nesta página</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td><code>true</code> quando existem mais páginas (use offset para buscá-las)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Paginação</h2>
	<p>
		A paginação é feita com <code>offset</code> e a marca <code>more</code>, calculados sobre a sequência <strong>visível</strong> — eventos ocultos nunca pulam nem duplicam uma página:
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="Peculiaridades dos endpoints">
		Endpoints singleton (perfil, <code>/ids/&#123;hex&#125;</code>, follows, relays) ainda aceitam <code>offset</code> — <code>?offset=1</code> ignora o único evento e retorna <code>[]</code>.
		Os parâmetros de consulta <code>authors</code>/<code>kinds</code> filtram apenas o endpoint genérico <code>/query</code>: em endpoints kind são silenciosamente ignorados (ambos pré-preenchidos), enquanto em endpoints id são combinados com AND. A divisão por kind de <code>stats</code> é ordenada por kind, ao contrário de <code>/kinds</code> (primeiro por contagem).
	</Callout>

	<h2>Regras de visibilidade</h2>
	<p>A API não é autenticada, por isso oculta os mesmos eventos que uma conexão WebSocket anônima:</p>
	<ul>
		<li>Eventos protegidos NIP-70 (com tag <code>-</code>)</li>
		<li>Gift wraps NIP-59 (kind 1059)</li>
		<li>Conteúdo de grupo privado/oculto NIP-29 (visível apenas para membros)</li>
	</ul>

	<h2>Erros e códigos de estado</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Código</th>
				<th>Significado</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Sucesso</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Identificador ou parâmetro de consulta inválido</td>
			</tr>
			<tr>
				<td>403</td>
				<td>Tentativa de upgrade WebSocket para /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Caminho desconhecido, ou Host incorreto para a API (api_host configurado)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>Limite de concorrência da API atingido — tente novamente em breve</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Exemplos</h2>
	<p>Buscar as notas de um usuário (mais recentes primeiro):</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Paginar e ordenar:</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Buscar um evento único por id (tanto note1... quanto nevent1... funcionam):</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Buscar um evento endereçável (naddr1...):</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Pesquisar:</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Filtro por tag:</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
