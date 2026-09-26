<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);

	const initCode = `nostrfy --config nostrfy.toml init`;
	const checkCode = `nostrfy --config nostrfy.toml check`;

	const syntaxCode = `[section]
key = "string"
key = 8080
key = [1, 2]
key = true`;

	const accessListCode = `nostrfy relay allow npub1...
nostrfy relay deny npub1...
nostrfy relay list`;
</script>

<DocsTitle
	title="Referência de configuração"
	description="Referência completa do nostrfy.toml: cada chave, seu tipo, seu valor padrão e exatamente o que faz — limites, banco de dados, daemon, controle de acesso e Blossom."
/>

<div class="doc-body">
	<h2>Conceitos básicos</h2>
	<p>
		A configuração é um arquivo <a href="https://toml.io/" target="_blank" rel="noopener noreferrer">TOML</a>, por padrão chamado <code>nostrfy.toml</code>. Crie-o com <code>init</code>:
	</p>
	<CodeBlock code={initCode} lang="bash" />
	<p>Valide-o (recomendado antes de cada inicialização):</p>
	<CodeBlock code={checkCode} lang="bash" />
	<p>Cada comando aceita <code>--config &lt;path&gt;</code> (padrão <code>nostrfy.toml</code>).</p>
	<p>Sintaxe geral:</p>
	<CodeBlock code={syntaxCode} lang="toml" />

	<h2>Seções de configuração</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Seção</th><th>Finalidade</th></tr></thead>
		<tbody>
			<tr><td><code>[relay]</code></td><td>Identidade, URLs e chaves de ativação de NIP</td></tr>
			<tr><td><code>[server]</code></td><td>Vinculação de rede, separação de API, métricas</td></tr>
			<tr><td><code>[rpc]</code></td><td>RPC de gerenciamento NIP-86 (autenticação, limite do corpo)</td></tr>
			<tr><td><code>[limits]</code></td><td>Todos os limites e proteções contra sobrecarga</td></tr>
			<tr><td><code>[database]</code></td><td>Armazenamento LMDB, índice de pesquisa, limites de fila</td></tr>
			<tr><td><code>[daemon]</code></td><td>Arquivos PID, de log e de estatísticas e rotação</td></tr>
			<tr><td><code>[access]</code></td><td>Listas iniciais de controle de acesso (alteráveis em tempo de execução)</td></tr>
			<tr><td><code>[blossom]</code></td><td>Servidor de arquivos Blossom (hospedagem de mídia)</td></tr>
		</tbody>
	</table>
	</div>
	<p>Cada chave é opcional; uma chave ausente usa seu valor padrão.</p>

	<h2>Seção [relay] — identidade do relay</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>name</code></td><td>string</td><td><code>"nostrfy"</code></td><td>Nome do relay exibido aos clientes via NIP-11</td></tr>
			<tr><td><code>description</code></td><td>string</td><td><code>"A minimal and stable Nostr relay"</code></td><td>Descrição do relay (NIP-11)</td></tr>
			<tr><td><code>pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Chave pública do administrador (campo pubkey do NIP-11)</td></tr>
			<tr><td><code>contact</code></td><td>string</td><td><code>""</code></td><td>URI de contato do administrador (mailto: ou https://)</td></tr>
			<tr><td><code>icon</code></td><td>string</td><td><code>""</code></td><td>URL da imagem do ícone do relay</td></tr>
			<tr><td><code>post_policy</code></td><td>string</td><td><code>""</code></td><td>URL que aponta para a política de publicação do relay</td></tr>
			<tr><td><code>private_key</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Chave secreta própria do relay; necessária para grupos NIP-29</td></tr>
			<tr><td><code>public_url</code></td><td>string</td><td><code>""</code></td><td>URL pública, ex. wss://relay.example.com</td></tr>
			<tr><td><code>livekit_url</code></td><td>string</td><td><code>""</code></td><td>URL do servidor LiveKit para salas de áudio/vídeo NIP-29</td></tr>
			<tr><td><code>livekit_api_key</code></td><td>string</td><td><code>""</code></td><td>Chave API do LiveKit</td></tr>
			<tr><td><code>livekit_api_secret</code></td><td>string</td><td><code>""</code></td><td>Segredo API do LiveKit (usado para assinar JWTs)</td></tr>
			<tr><td><code>enabled_nips</code></td><td>array de inteiros</td><td><code>[]</code></td><td>Lista explícita de NIPs permitidos</td></tr>
			<tr><td><code>disabled_nips</code></td><td>array de inteiros</td><td><code>[]</code></td><td>NIPs a desativar (ignorado quando enabled_nips não está vazio)</td></tr>
			<tr><td><code>reject_ephemeral</code></td><td>boolean</td><td><code>false</code></td><td>Rejeitar eventos efêmeros NIP-01 (kinds 20000-29999)</td></tr>
			<tr><td><code>enabled_git</code></td><td>boolean</td><td><code>false</code></td><td>Aceitar eventos git NIP-34 (kinds 1617-1633, 30617/30618)</td></tr>
			<tr><td><code>require_pow</code></td><td>integer</td><td><code>0</code></td><td>Prova de trabalho exigida em bits zero iniciais</td></tr>
			<tr><td><code>new_pubkey_min_age_secs</code></td><td>integer</td><td><code>0</code></td><td>Recusar eventos de pubkeys mais novas que isto (segundos; 0 = desligado)</td></tr>
			<tr><td><code>max_events_per_min_per_pubkey</code></td><td>integer</td><td><code>0</code></td><td>Limite de publicação por pubkey (por minuto; 0 = sem limite)</td></tr>
			<tr><td><code>max_groups</code></td><td>integer</td><td><code>1000</code></td><td>Limite do armazenamento de grupos NIP-29 em memória</td></tr>
			<tr><td><code>require_auth</code></td><td>boolean</td><td><code>false</code></td><td>Exigir autenticação NIP-42 para REQ/EVENT/COUNT/NEG</td></tr>
			<tr><td><code>send_auth_challenge</code></td><td>boolean</td><td><code>true</code></td><td>Enviar o desafio AUTH ao conectar</td></tr>
			<tr><td><code>enabled_nip78_auth</code></td><td>boolean</td><td><code>true</code></td><td>Exigir AUTH NIP-42 antes de aceitar eventos kind 78/30078</td></tr>
			<tr><td><code>enabled_command_events</code></td><td>boolean</td><td><code>false</code></td><td>Executar comandos de operador kind:1 criados pela pubkey do admin</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Detalhes das chaves</h3>
	<ul>
		<li>
			<strong>private_key</strong> — a chave secreta própria do relay, usada para assinar eventos gerados pelo relay: metadados de grupos NIP-29 (39000-39005) e eventos de função/membros NIP-43. Gere com <code>nostrfy genkey</code>; mantenha-a em segredo. Ela é lida uma vez na inicialização, portanto alterá-la exige reiniciar.
		</li>
		<li>
			<strong>public_url</strong> — usada para validar tags com URL dos clientes: AUTH NIP-42, vanish NIP-62 e auth de admin NIP-98. Quando vazia, o relay recorre a <code>host:port</code>, que nunca corresponde a uma URL real de cliente ao vincular <code>0.0.0.0</code> ou <code>127.0.0.1</code> (um aviso é registrado). <strong>Defina-a sempre.</strong>
		</li>
		<li>
			<strong>enabled_nips vs disabled_nips</strong> — a lista de permissão vence: quando <code>enabled_nips</code> não está vazio, apenas seus NIPs são anunciados e <code>disabled_nips</code> é ignorado. Ambos exigem reiniciar.
		</li>
		<li>
			<strong>reject_ephemeral</strong> — os kinds 20000-29999 são rejeitados, mas os kinds isentos que os NIPs exigem retransmitir ainda são encaminhados: 22242, 27235, 28934/28935/28936, 24133, 23194/23195, 24242 e 21059. Aplica-se com SIGHUP.
		</li>
		<li>
			<strong>enabled_git</strong> — NIP-34 opcional: aceita os kinds 1617-1633 e 30617/30618 e anuncia NIP-34. Desligado por padrão porque cargas de patch podem ser grandes. Aplica-se com SIGHUP.
		</li>
	</ul>

	<h2>Seção [server] — configurações do servidor</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>"127.0.0.1"</code></td><td>Endereço de vinculação; 0.0.0.0 aceita conexões de qualquer lugar</td></tr>
			<tr><td><code>port</code></td><td>integer</td><td><code>8080</code></td><td>Porta (1-65535); a porta 80 exige root</td></tr>
			<tr><td><code>api_host</code></td><td>string</td><td><code>""</code></td><td>Nome de host dedicado à API REST</td></tr>
			<tr><td><code>metrics_enabled</code></td><td>boolean</td><td><code>true</code></td><td>Servir métricas Prometheus em /metrics</td></tr>
			<tr><td><code>ws_paths</code></td><td>string</td><td><code>"root"</code></td><td>Caminhos do endpoint WebSocket: root, inbox-outbox ou all</td></tr>
			<tr><td><code>inbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>Quem pode escrever em /inbox: "any" ou "relay" (eventos ainda devem ter tag p)</td></tr>
			<tr><td><code>outbox_write_policy</code></td><td>string</td><td><code>"any"</code></td><td>Quem pode escrever em /outbox: "any" (próprios eventos da pubkey autenticada NIP-42) ou "relay"</td></tr>
			<tr><td><code>trusted_proxies</code></td><td>array de strings</td><td><code>[]</code></td><td>Endereços/CIDR de proxies reversos cujo X-Forwarded-For é confiável (vazio = não confiar em nenhum proxy)</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Detalhes das chaves</h3>
	<ul>
		<li><strong>host</strong> — <code>0.0.0.0</code> vincula todas as interfaces IPv4; <code>127.0.0.1</code> é somente local.</li>
		<li><strong>port</strong> — 1-65535; a porta 80 exige root. Esta única porta serve o relay WebSocket, o documento NIP-11, a API REST e o RPC NIP-86 juntos.</li>
		<li>
			<strong>api_host</strong> — dedica a API REST a um único nome de host para que a API e o relay possam compartilhar uma porta atrás de um proxy reverso. Fixo na inicialização — exige reiniciar.
		</li>
		<li>
			<strong>ws_paths</strong> — <code>root</code> serve apenas /, <code>inbox-outbox</code> serve apenas /inbox e /outbox, <code>all</code> serve ambos. Fixo na inicialização — exige reiniciar.
		</li>
		<li>
			<strong>trusted_proxies</strong> — liste apenas os endereços próprios do proxy (loopback para nginx/Caddy no mesmo host, o intervalo de origem do balanceador na nuvem). Com ele definido, o IP do cliente é derivado da última entrada não confiável de <code>X-Forwarded-For</code> para os limites por IP, o limite de taxa, <code>blockip</code> e os logs. Nunca adicione um endereço que os clientes possam alcançar diretamente — eles poderiam falsificar o cabeçalho e contornar os limites por IP. Fixo na inicialização — exige reiniciar.
		</li>
	</ul>

	<h2>Seção [rpc] — gerenciamento NIP-86</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>management_token</code></td><td>string</td><td><code>""</code></td><td>Token Bearer para as APIs de gerenciamento</td></tr>
			<tr><td><code>admin_pubkey</code></td><td>string (64 hex)</td><td><code>""</code></td><td>Pubkey do administrador para auth de gerenciamento NIP-98</td></tr>
			<tr><td><code>max_admin_body_bytes</code></td><td>integer</td><td><code>65536</code></td><td>Limite do corpo para o RPC de gerenciamento NIP-86</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		O RPC NIP-86 é montado nas rotas públicas <code>POST /</code> do relay — não há porta de gerenciamento separada. <code>management_token</code> e <code>admin_pubkey</code> às vezes aparecem sob <code>[server]</code> em guias antigos; essas grafias são apelidos legados destas chaves <code>[rpc]</code>.
	</p>

	<h2>Seção [limits] — limites e proteções</h2>
	<h3>Conexões e mensagens</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>max_connections</code></td><td>integer</td><td><code>10000</code></td><td>Conexões simultâneas máximas</td></tr>
			<tr><td><code>max_connections_per_ip</code></td><td>integer</td><td><code>64</code></td><td>Conexões máximas por IP de origem</td></tr>
			<tr><td><code>max_ws_message_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>Bytes máximos por mensagem/frame WebSocket</td></tr>
			<tr><td><code>socket_recv_buffer_kb</code></td><td>integer</td><td><code>64</code></td><td>Buffer de recepção do kernel por conexão (KiB)</td></tr>
			<tr><td><code>max_out_queue_bytes</code></td><td>integer</td><td><code>262144</code></td><td>Limite da fila de saída por conexão (bytes)</td></tr>
			<tr><td><code>ws_idle_timeout_secs</code></td><td>integer</td><td><code>300</code></td><td>Fechar conexões ociosas após este tempo</td></tr>
			<tr><td><code>http_read_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>Tempo limite do cabeçalho HTTP (defesa slow-loris)</td></tr>
			<tr><td><code>max_connections_per_sec_per_ip</code></td><td>integer</td><td><code>0</code></td><td>Conexões novas máximas por segundo por IP de origem</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Assinaturas e consultas</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>max_filters</code></td><td>integer</td><td><code>20</code></td><td>Filtros máximos por REQ</td></tr>
			<tr><td><code>max_subscriptions</code></td><td>integer</td><td><code>20</code></td><td>Assinaturas máximas por conexão</td></tr>
			<tr><td><code>max_limit</code></td><td>integer</td><td><code>500</code></td><td>Teto para o limit do REQ</td></tr>
			<tr><td><code>max_count</code></td><td>integer</td><td><code>2000</code></td><td>Teto para resultados COUNT</td></tr>
			<tr><td><code>max_sub_id_len</code></td><td>integer</td><td><code>64</code></td><td>Comprimento máximo do id de assinatura (caracteres, não bytes)</td></tr>
			<tr><td><code>max_sub_bytes</code></td><td>integer</td><td><code>1048576</code></td><td>Bytes totais de filtros de assinatura por conexão</td></tr>
			<tr><td><code>max_req_response_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>Teto de bytes totais que uma única resposta REQ pode enviar</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Eventos</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>max_content_bytes</code></td><td>integer</td><td><code>65536</code></td><td>Comprimento máximo do conteúdo do evento em caracteres</td></tr>
			<tr><td><code>max_tags</code></td><td>integer</td><td><code>2000</code></td><td>Tags máximas por evento</td></tr>
			<tr><td><code>max_tag_value_bytes</code></td><td>integer</td><td><code>1024</code></td><td>Bytes máximos por valor de tag</td></tr>
			<tr><td><code>max_created_at_future_secs</code></td><td>integer</td><td><code>3600</code></td><td>Desvio futuro tolerado de created_at</td></tr>
			<tr><td><code>group_late_publish_secs</code></td><td>integer</td><td><code>3600</code></td><td>Atraso tolerado para eventos de admin de grupos NIP-29 (segundos)</td></tr>
			<tr><td><code>max_neg_items</code></td><td>integer</td><td><code>100000</code></td><td>Registros máximos por sincronização de negentropia NIP-77</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		Apelidos legados: <code>limits.require_pow</code>, <code>limits.new_pubkey_min_age_secs</code> e <code>limits.max_indexed_words</code> ainda são aceitos como apelidos de <code>relay.require_pow</code>, <code>relay.new_pubkey_min_age_secs</code> e <code>database.max_indexed_words</code>.
	</p>
	<h3>API REST</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>max_api_concurrent</code></td><td>integer</td><td><code>8</code></td><td>Solicitações /api/v1 simultâneas máximas</td></tr>
			<tr><td><code>max_api_limit</code></td><td>integer</td><td><code>5000</code></td><td>Teto para o parâmetro limit da API</td></tr>
			<tr><td><code>max_api_offset</code></td><td>integer</td><td><code>50000</code></td><td>Teto para o parâmetro offset da API</td></tr>
			<tr><td><code>max_api_fetch</code></td><td>integer</td><td><code>55001</code></td><td>Janela máxima de sobrebusca para consultas com offset — deve cobrir max_api_offset + max_api_limit + 1 (0 = sem limite)</td></tr>
			<tr><td><code>max_api_search_bytes</code></td><td>integer</td><td><code>2048</code></td><td>Bytes máximos do parâmetro search da API</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Distribuição ao vivo</h3>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>live_batch_interval_ms</code></td><td>integer</td><td><code>20</code></td><td>Frequência de descarga de eventos ao vivo (ms)</td></tr>
			<tr><td><code>live_batch_size</code></td><td>integer</td><td><code>32</code></td><td>Eventos máximos por lote ao vivo</td></tr>
			<tr><td><code>live_buffer</code></td><td>integer</td><td><code>65536</code></td><td>Tamanho da fila de distribuição ao vivo</td></tr>
		</tbody>
	</table>
	</div>

	<h2>Seção [database] — banco de dados</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>path</code></td><td>string</td><td><code>"./data"</code></td><td>Diretório do banco de dados (LMDB)</td></tr>
			<tr><td><code>max_dbs</code></td><td>integer</td><td><code>32</code></td><td>Máximo de bancos de dados nomeados LMDB</td></tr>
			<tr><td><code>max_readers</code></td><td>integer</td><td><code>128</code></td><td>Máximo de leitores simultâneos LMDB</td></tr>
			<tr><td><code>map_size</code></td><td>integer</td><td><code>1073741824</code> (1 GB)</td><td>Tamanho mínimo do mapa de memória (bytes)</td></tr>
			<tr><td><code>max_map_size</code></td><td>integer</td><td><code>1099511627776</code> (1 TB)</td><td>Tamanho máximo do mapa de memória (bytes)</td></tr>
			<tr><td><code>purge_interval_secs</code></td><td>integer</td><td><code>300</code></td><td>Intervalo de purga NIP-40 (segundos)</td></tr>
			<tr><td><code>search_index</code></td><td>boolean</td><td><code>true</code></td><td>Habilitar o índice de palavras NIP-50</td></tr>
			<tr><td><code>reader_threads</code></td><td>integer</td><td><code>2</code></td><td>Threads dedicadas de varredura</td></tr>
			<tr><td><code>max_indexed_words</code></td><td>integer</td><td><code>32</code></td><td>Palavras do conteúdo de cada evento indexadas para pesquisa</td></tr>
			<tr><td><code>meta_index</code></td><td>boolean</td><td><code>true</code></td><td>Gravar o cabeçalho de metadados por evento usado pelo pré-filtro de varredura</td></tr>
			<tr><td><code>disabled_fsync</code></td><td>boolean</td><td><code>false</code></td><td>Pular a descarga síncrona em disco após cada lote de gravação</td></tr>
			<tr><td><code>db_buffer_size</code></td><td>integer</td><td><code>2048</code></td><td>Buffer WebSocket inicial por conexão (bytes)</td></tr>
			<tr><td><code>db_request_timeout_secs</code></td><td>integer</td><td><code>30</code></td><td>Tempo máximo que uma solicitação ao banco de dados pode aguardar antes de falhar</td></tr>
			<tr><td><code>max_db_queue_msgs</code></td><td>integer</td><td><code>4096</code></td><td>Mensagens pendentes máximas na fila antes de falhar rápido</td></tr>
			<tr><td><code>max_db_queue_events</code></td><td>integer</td><td><code>262144</code></td><td>Eventos máximos em lotes na fila antes de falhar rápido</td></tr>
			<tr><td><code>max_db_queue_bytes</code></td><td>integer</td><td><code>268435456</code> (256 MiB)</td><td>Bytes máximos de solicitações ao banco de dados na fila antes de falhar rápido (0 = sem limite de bytes)</td></tr>
		</tbody>
	</table>
	</div>
	<h3>Detalhes das chaves</h3>
	<ul>
		<li>
			<strong>map_size</strong> — o mínimo do mapa de memória: o mapa é sempre aberto com pelo menos este tamanho.
		</li>
		<li>
			<strong>max_map_size</strong> — o máximo, aberto como reserva virtual esparsa: o disco físico só cresce com os dados realmente gravados. Aumente-o quando vir <code>database map is full</code>.
		</li>
		<li>
			<strong>search_index = false</strong> — a pesquisa continua funcionando (correspondência de palavras inteiras contra o conteúdo) mas as varreduras ficam mais lentas; em um VPS pequeno isso reduz o banco de dados pela metade. Recomendado em instâncias pequenas.
		</li>
		<li>
			<strong>disabled_fsync</strong> — troca durabilidade por taxa de transferência: as gravações são confirmadas no cache de páginas do SO e uma queda de energia pode perder as gravações mais recentes.
		</li>
	</ul>

	<h2>Seção [daemon] — daemon</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>pid_file</code></td><td>string</td><td><code>"./nostrfy.pid"</code></td><td>Caminho do arquivo PID</td></tr>
			<tr><td><code>log_file</code></td><td>string</td><td><code>"./nostrfy.log"</code></td><td>Caminho do arquivo de log</td></tr>
			<tr><td><code>stats_file</code></td><td>string</td><td><code>"./nostrfy.stats.json"</code></td><td>Caminho do arquivo de estatísticas</td></tr>
			<tr><td><code>stats_interval_secs</code></td><td>integer</td><td><code>5</code></td><td>Intervalo de gravação de estatísticas (segundos)</td></tr>
			<tr><td><code>max_log_size_bytes</code></td><td>integer</td><td><code>52428800</code> (50 MB)</td><td>Tamanho de rotação do log (0 = sem rotação)</td></tr>
			<tr><td><code>max_log_files</code></td><td>integer</td><td><code>5</code></td><td>Gerações de logs rotacionados a manter</td></tr>
		</tbody>
	</table>
	</div>
	<p>Os caminhos são resolvidos em relação ao diretório do arquivo de configuração, portanto permanecem válidos depois que o daemon muda seu diretório de trabalho.</p>

	<h2>Seção [access] — controle de acesso</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>restrict_relay</code></td><td>boolean</td><td><code>false</code></td><td>Somente pubkeys na lista de permissão podem publicar</td></tr>
			<tr><td><code>blocked_kinds</code></td><td>array de inteiros</td><td><code>[]</code></td><td>Kinds a rejeitar</td></tr>
			<tr><td><code>allowed_kinds</code></td><td>array de inteiros</td><td><code>[]</code></td><td>Lista de kinds permitidos; somente estes kinds são aceitos quando não vazia</td></tr>
			<tr><td><code>blocked_ips</code></td><td>array de strings</td><td><code>[]</code></td><td>Endereços IP recusados no momento da conexão</td></tr>
			<tr><td><code>method_grants</code></td><td>tabela: pubkey → array de strings</td><td><code>&#123;&#125;</code></td><td>Concessões de métodos NIP-86 para pubkeys não admin (gerenciadas em tempo de execução com <code>assignmethod</code>)</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		As listas de pubkeys permitidas/negadas <strong>não</strong> são chaves de configuração — elas vivem no banco de dados do relay (LMDB) e são gerenciadas em tempo de execução:
	</p>
	<CodeBlock code={accessListCode} lang="sh" />
	<ul>
		<li>
			<strong>restrict_relay = true</strong> — somente as pubkeys na lista de permissão podem <strong>publicar</strong>, enquanto a leitura permanece aberta a todos (qualquer cliente ainda pode assinar e buscar dados).
		</li>
		<li>Uma pubkey negada é sempre rejeitada ao publicar e nunca é servida ao ler.</li>
		<li>
			<strong>method_grants</strong> — concessões de métodos NIP-86 para pubkeys não admin (pubkey → nomes de método, ex. um moderador com <code>banevent</code> e <code>listbannedevents</code>). Semeadas a partir da configuração na primeira execução, depois gerenciadas em tempo de execução com <code>assignmethod</code>/<code>unassignmethod</code> do NIP-86 (inspecionadas com <code>listmethodassignees</code>). Somente métodos de moderação e leitura podem ser concedidos — o gerenciamento de permissões, funções, convites e identidade do relay permanece somente admin, e uma pubkey banida é recusada mesmo com concessões. Veja a <a href={p('/docs/management/')}>API de gerenciamento</a>.
		</li>
	</ul>

	<h2>Seção [blossom] — servidor de arquivos Blossom</h2>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Chave</th><th>Tipo</th><th>Padrão</th><th>Descrição</th></tr></thead>
		<tbody>
			<tr><td><code>host</code></td><td>string</td><td><code>""</code></td><td>Nome de host para o servidor Blossom (vazio = desativado)</td></tr>
			<tr><td><code>storage</code></td><td>string</td><td><code>"local"</code></td><td>Backend: "local" (local_path) ou "s3" (bucket compatível com S3)</td></tr>
			<tr><td><code>local_path</code></td><td>string</td><td><code>"/var/lib/nostrfy/images"</code></td><td>Raiz de armazenamento local para arquivos de mídia</td></tr>
			<tr><td><code>max_upload_bytes</code></td><td>integer</td><td><code>20971520</code> (20 MB)</td><td>Tamanho máximo de arquivo de mídia</td></tr>
			<tr><td><code>min_free_bytes</code></td><td>integer</td><td><code>33554432</code> (32 MB)</td><td>Espaço em disco abaixo do qual uploads são recusados</td></tr>
			<tr><td><code>s3_endpoint</code></td><td>string</td><td><code>""</code></td><td>Endpoint compatível com S3 (ex. R2)</td></tr>
			<tr><td><code>s3_region</code></td><td>string</td><td><code>""</code></td><td>Região S3 (R2 usa "auto")</td></tr>
			<tr><td><code>s3_bucket</code></td><td>string</td><td><code>""</code></td><td>Nome do bucket S3</td></tr>
			<tr><td><code>s3_access_key</code></td><td>string</td><td><code>""</code></td><td>Chave de acesso S3</td></tr>
			<tr><td><code>s3_secret_key</code></td><td>string</td><td><code>""</code></td><td>Chave secreta S3</td></tr>
			<tr><td><code>restrict_uploads</code></td><td>boolean</td><td><code>false</code></td><td>Somente pubkeys na lista de permissão podem enviar arquivos</td></tr>
		</tbody>
	</table>
	</div>

	<h2>Recarga a quente (SIGHUP)</h2>
	<p>
		Editar o arquivo e enviar <code>kill -HUP $(cat nostrfy.pid)</code> recarrega a configuração <strong>sem reiniciar</strong>. A maioria das configurações tem efeito imediato; algumas são fixas na inicialização:
	</p>
	<div class="overflow-x-auto">
	<table>
		<thead><tr><th>Aplica-se com SIGHUP</th><th>Exige reiniciar</th></tr></thead>
		<tbody>
			<tr><td>relay.name, description, pubkey, contact, icon, post_policy, public_url</td><td>relay.private_key</td></tr>
			<tr><td>reject_ephemeral, enabled_git, enabled_nip78_auth</td><td>relay.livekit_*, enabled_nips / disabled_nips</td></tr>
			<tr><td>a maioria de [limits]</td><td>api_host, trusted_proxies, metrics_enabled, ws_paths, database.*, tamanhos do daemon, tetos de limite, blossom.*</td></tr>
		</tbody>
	</table>
	</div>
	<p>
		[access] não é aplicado por recarga — as listas são semeadas uma vez na inicialização e depois gerenciadas em tempo de execução via NIP-86. O log avisa quando uma configuração que exige reiniciar muda, e algumas configurações capturadas na inicialização não são verificadas pela recarga.
	</p>

	<Callout type="warning" title="Erros comuns">
		<div class="overflow-x-auto">
		<table>
			<thead><tr><th>Erro</th><th>Correção</th></tr></thead>
			<tbody>
				<tr><td>public_url não definido</td><td>defina <code>wss://...</code></td></tr>
				<tr><td>host deixado em 127.0.0.1</td><td>clientes externos não conseguem conectar</td></tr>
				<tr><td>private_key não definido com NIP-29</td><td>execute <code>nostrfy genkey</code> + reinicie</td></tr>
				<tr><td>restrict_relay true com allowlist vazia</td><td>todos bloqueados</td></tr>
				<tr><td>alterar chaves que só exigem reiniciar e só fazer SIGHUP</td><td>use <code>nostrfy restart</code></td></tr>
			</tbody>
		</table>
		</div>
	</Callout>
</div>
