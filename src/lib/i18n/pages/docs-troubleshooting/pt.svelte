<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const fixPort = `# Troque port = 8080 no arquivo de configuração, depois:
nostrfy --config nostrfy.toml start`;
	const ssPort = `ss -tlnp | grep :8080`;
	const restartSame = `# Se o nostrfy já está rodando, reinicie
nostrfy --config nostrfy.toml restart`;
	const forceKill = `ps aux | grep nostrfy
kill -9 <PID>
# Remova o arquivo pid obsoleto, se existir
rm -f nostrfy.pid`;
	const tomlExample = `# Exemplos corretos
name = "my relay"        # strings usam aspas duplas
port = 8080              # números vão sem aspas
enabled_nips = [1, 50]   # listas ficam entre [ ]`;
	const initCmd = `nostrfy --config nostrfy.toml init`;
	const healthChecks = `curl http://127.0.0.1:8080/health

# De fora (usando o IP/porta do servidor)
curl http://YOUR_SERVER_IP:8080/health

# Verifique o firewall (exemplo: ufw)
sudo ufw status
# Abra a porta se preciso
sudo ufw allow 8080`;
	const genkeyRestart = `nostrfy --config nostrfy.toml genkey
nostrfy --config nostrfy.toml restart`;
	const recovery = `{
  "kind": 9000,
  "pubkey": "<relay self pubkey>",
  "tags": [["h", "<group-id>"], ["p", "<member-hex>", "admin"]]
}`;
	const dbSize = `curl http://127.0.0.1:8080/relay/stats
# => "db_size_bytes" em bytes`;
	const backup = `nostrfy --config nostrfy.toml stop
cp -a ./data ./data-backup
# Faça também backup de [blossom].local_path ao usar Blossom local.
nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Solução de problemas"
	description="Os erros mais prováveis — portas, permissões, TLS, NIP ausentes, publicação e tempos de espera — com correções passo a passo."
/>

<div class="doc-body">
	<p><strong>Três coisas para verificar primeiro:</strong></p>
	<ul>
		<li><code>nostrfy check</code> valida sua configuração (a maioria dos erros são erros de configuração).</li>
		<li><code>tail -f nostrfy.log</code> mostra o log — a causa está quase sempre lá.</li>
		<li><code>nostrfy restart</code> reinicia o daemon de forma limpa.</li>
	</ul>

	<h2 id="cannot-start">Não é possível iniciar</h2>

	<h3><code>error: cannot bind to 0.0.0.0:80: Permission denied</code></h3>
	<p><strong>Causa:</strong> A porta 80 só pode ser vinculada pelo root.</p>
	<p><strong>Correção:</strong> Execute com <code>sudo</code> ou mude a porta para algo como 8080.</p>
	<CodeBlock code={fixPort} lang="bash" />

	<h3><code>error: cannot bind to ...: Address already in use</code></h3>
	<p>
		<strong>Causa:</strong> Outro processo (um nostrfy antigo ou um servidor diferente) já está usando
		a porta.
	</p>
	<p><strong>Correção:</strong></p>
	<CodeBlock code={ssPort} lang="bash" />
	<CodeBlock code={restartSame} lang="bash" />

	<h3><code>already running (pid 1234); use 'nostrfy stop' or 'nostrfy restart'</code></h3>
	<p>
		<strong>Causa:</strong> o nostrfy já está em execução; <code>start</code> se recusa a iniciar uma
		segunda instância.
	</p>
	<p><strong>Correção:</strong> Use <code>nostrfy restart</code> ou apenas use a instância em execução.</p>

	<h3><code>nostrfy stop</code> trava / <code>did not stop in time</code></h3>
	<p><strong>Causa:</strong> O daemon está travado ou não está respondendo.</p>
	<p><strong>Correção:</strong></p>
	<CodeBlock code={forceKill} lang="bash" />

	<h3><code>error: invalid nostrfy.toml: TOML parse error</code></h3>
	<p>
		<strong>Causa:</strong> O arquivo de configuração não é um TOML válido. Erros comuns: esquecer aspas
		em uma string ou escrever a mesma chave duas vezes.
	</p>
	<p><strong>Correção:</strong> A mensagem de erro inclui um número de linha. Verifique e corrija essa linha.</p>
	<CodeBlock code={tomlExample} lang="toml" />

	<h3><code>error: cannot read nostrfy.toml: No such file or directory</code></h3>
	<p><strong>Causa:</strong> O arquivo de configuração não existe.</p>
	<p><strong>Correção:</strong></p>
	<CodeBlock code={initCmd} lang="bash" />

	<h3><code>error: relay.private_key is not a valid secp256k1 secret key</code></h3>
	<p>
		<strong>Causa:</strong> <code>relay.private_key</code> não é uma chave hexadecimal válida de 64
		caracteres.
	</p>
	<p>
		<strong>Correção:</strong> Execute <code>nostrfy genkey</code> para gerar uma chave correta (ou defina
		<code>private_key = ""</code>).
	</p>

	<h3>Muitos avisos no log ao iniciar</h3>
	<p>Linhas de log <code>[WARN]</code> indicam problemas de configuração. As principais:</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Aviso</th>
				<th>Significado e correção</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>relay.public_url is empty and server.host is "0.0.0.0"...</code></td>
				<td>
					<code>public_url</code> não está definido — autenticação NIP-42, vanish NIP-62 e autenticação
					admin NIP-98 não funcionarão. Defina <code>wss://your-public-url</code>.
				</td>
			</tr>
			<tr>
				<td><code>relay.private_key is empty while NIP-29 is enabled...</code></td>
				<td>Grupos precisam de uma chave secreta. Execute <code>nostrfy genkey</code>.</td>
			</tr>
			<tr>
				<td><code>unknown config key [relay].software is ignored</code></td>
				<td>Uma chave legada não utilizada (ou um erro de digitação) na configuração. Verifique o nome da chave.</td>
			</tr>
			<tr>
				<td><code>unknown config section [serve] is ignored</code></td>
				<td>
					Um erro de digitação no nome de uma seção (por ex. <code>[serve]</code> em vez de <code>[server]</code>).
					Corrija.
				</td>
			</tr>
			<tr>
				<td><code>relay.require_auth is true but relay.send_auth_challenge is false...</code></td>
				<td>Esta combinação bloqueia todo mundo. Altere uma das duas.</td>
			</tr>
			<tr>
				<td><code>relay.require_pow = 64 ... practically unmineable</code></td>
				<td>
					O requisito de PoW é tão alto que ninguém consegue publicar. Reduza <code>require_pow</code>.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="cannot-connect">Não conecta ou se comporta de forma estranha</h2>

	<h3>O cliente recebe <code>connection refused</code></h3>
	<p>
		<strong>Causa:</strong> O relay não está em execução ou um firewall está bloqueando a porta.
	</p>
	<p><strong>Correção:</strong></p>
	<CodeBlock code={healthChecks} lang="bash" />

	<h3>Clientes externos não conectam, os locais conectam</h3>
	<p>
		<strong>Causa:</strong> <code>server.host</code> ainda é <code>127.0.0.1</code> (o padrão),
		que aceita apenas conexões locais.
	</p>
	<p>
		<strong>Correção:</strong> Defina <code>host = "0.0.0.0"</code> na configuração e reinicie.
	</p>

	<h3>Não é possível conectar através de um túnel Cloudflare</h3>
	<p>Ao usar o Cloudflare Tunnel:</p>
	<ul>
		<li>
			O relay executa HTTP simples; a Cloudflare termina o TLS, então os clientes usam <code>wss://</code>. Defina
			<code>public_url = "wss://..."</code> no relay (isso faz a autenticação NIP-42 funcionar).
		</li>
		<li>
			A Cloudflare adiciona um cabeçalho <code>X-Forwarded-Proto</code>. O nostrfy trata
			valores <code>ws</code>/<code>wss</code>/<code>http</code>/<code>https</code> da mesma forma, então
			normalmente nenhuma configuração extra é necessária.
		</li>
	</ul>

	<h3><code>error: message too large</code> e a conexão é fechada</h3>
	<p>
		<strong>Causa:</strong> Uma única mensagem excede <code>max_ws_message_bytes</code> (padrão 1 MB).
	</p>
	<p>
		<strong>Correção:</strong> Aumente <code>limits.max_ws_message_bytes</code> se precisar de eventos maiores — mas
		verifique também os limites do próprio cliente.
	</p>

	<h3>Erros <code>too many subscriptions</code> / <code>too many filters</code></h3>
	<p>
		<strong>Causa:</strong> Os limites por conexão foram atingidos (assinaturas padrão 20, filtros
		padrão 20).
	</p>
	<p>
		<strong>Correção:</strong> Aumente <code>limits.max_subscriptions</code> /
		<code>limits.max_filters</code> (e verifique as configurações do cliente).
	</p>

	<h3>Novas conexões são recusadas sob carga</h3>
	<p>
		<strong>Causa:</strong> <code>max_connections</code> (padrão 10000) foi atingido, o limite por IP
		(<code>max_connections_per_ip</code>, padrão 64) foi acionado, ou o limite de taxa de conexão por segundo
		(<code>max_connections_per_sec_per_ip</code>) recusou o pico. Os limites se aplicam a todas as conexões —
		WebSocket e HTTP simples igualmente.
	</p>
	<p>
		<strong>Correção:</strong> Revise e ajuste as configurações. <code>max_connections_per_ip = 0</code> desativa
		o limite por IP; <code>max_connections_per_sec_per_ip = 0</code> desativa o limite de taxa. Essas três
		configurações exigem reinicialização.
	</p>

	<h3>Conexões caem depois de um tempo</h3>
	<p>
		<strong>Causa:</strong> Se <code>ws_idle_timeout_secs</code> estiver definido, conexões ociosas são fechadas.
		Clientes saudáveis respondem ao PING do relay com um PONG e permanecem conectados; apenas pares mortos são removidos.
	</p>
	<p>
		<strong>Correção:</strong> Isso é intencional — o padrão é 300 segundos. Defina
		<code>ws_idle_timeout_secs = 0</code> para desativar completamente.
	</p>

	<h3>Uma assinatura termina com <code>CLOSED ... response too large</code></h3>
	<p>
		<strong>Causa:</strong> Os eventos armazenados de um REQ excederam <code>max_req_response_bytes</code>
		(padrão 32 MiB). Só acontece com eventos muito grandes ou filtros muito amplos.
	</p>
	<p>
		<strong>Correção:</strong> Restrinja o filtro (<code>since</code>/<code>until</code> mais apertados, um
		<code>limit</code> menor) ou aumente <code>max_req_response_bytes</code> (0 desativa o orçamento).
	</p>

	<h3>Um NIP está ausente da lista NIP-11 <code>supported_nips</code></h3>
	<p>
		<strong>Causa:</strong> A lista anunciada é dinâmica — um NIP fica oculto quando todos os kinds que ele
		define são rejeitados: todos estão em <code>blocked_kinds</code>, nenhum deles está em
		<code>allowed_kinds</code>, ou são kinds efêmeros rejeitados por <code>reject_ephemeral</code>.
		NIP-29/43/66 exigem adicionalmente <code>relay.private_key</code> e NIP-86 exige
		<code>rpc.management_token</code> ou <code>rpc.admin_pubkey</code>.
	</p>
	<p>
		<strong>Correção:</strong> Verifique as listas de acesso ativas — NIP-86 <code>listallowedkinds</code> mostra a
		lista de kinds permitidos, e <code>GET /</code> mostra o <code>supported_nips</code> efetivo imediatamente.
		Remova o kind bloqueador ou a configuração <code>reject_ephemeral</code>.
	</p>

	<h2 id="publishing">Erros ao publicar</h2>
	<p>
		Quando a publicação falha, o 4º elemento da mensagem <code>OK</code> explica o motivo. Os comuns:
	</p>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Erro</th>
				<th>Significado e correção</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>invalid: signature verification failed</code></td>
				<td>A assinatura do evento é inválida (possivelmente uma chave de cliente quebrada).</td>
			</tr>
			<tr>
				<td><code>invalid: content too large</code></td>
				<td>
					O conteúdo excede <code>max_content_bytes</code> (padrão 64K caracteres). Encurte-o ou
					aumente o limite.
				</td>
			</tr>
			<tr>
				<td><code>invalid: too many tags</code></td>
				<td>Mais tags do que <code>max_tags</code> (padrão 2000).</td>
			</tr>
			<tr>
				<td><code>invalid: event creation date is in the future</code></td>
				<td>
					Timestamp muito no futuro (além de <code>max_created_at_future_secs</code>).
				</td>
			</tr>
			<tr>
				<td><code>mute: event contains secret key material</code></td>
				<td>
					O conteúdo ou as tags contêm uma string com aparência de nsec.
					<strong>Nunca publique chaves secretas.</strong> Remova a string e o evento será aceito.
				</td>
			</tr>
			<tr>
				<td><code>duplicate: event already stored</code></td>
				<td>O mesmo evento já está armazenado (normal).</td>
			</tr>
			<tr>
				<td><code>blocked: pubkey not allowed</code></td>
				<td>A pubkey está banida (<code>banpubkey</code>) ou fora da lista de permissão.</td>
			</tr>
			<tr>
				<td><code>blocked: kind not allowed</code></td>
				<td>Este kind não é permitido.</td>
			</tr>
			<tr>
				<td><code>rate-limited: too many events</code></td>
				<td>
					A pubkey excedeu <code>max_events_per_min_per_pubkey</code> (janela deslizante de 60
					segundos). Aguarde um minuto e tente novamente, ou aumente/desative o limite.
				</td>
			</tr>
			<tr>
				<td><code>blocked: event has been banned</code></td>
				<td>O id do evento está banido.</td>
			</tr>
			<tr>
				<td><code>blocked: event has been deleted</code></td>
				<td>Republicação de um evento excluído.</td>
			</tr>
			<tr>
				<td><code>auth-required: ...</code></td>
				<td>
					Autenticação é necessária (quando <code>relay.require_auth</code> está ativado).
				</td>
			</tr>
			<tr>
				<td><code>restricted: your account is too new</code></td>
				<td>
					A conta foi criada dentro de <code>new_pubkey_min_age_secs</code>. Aguarde e tente novamente.
				</td>
			</tr>
			<tr>
				<td><code>restricted: unknown group</code></td>
				<td>O grupo não existe (crie-o primeiro).</td>
			</tr>
			<tr>
				<td><code>restricted: this group is closed</code></td>
				<td>
					O grupo é <code>closed</code>; solicitações de participação sem código de convite não são atendidas.
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2 id="blossom">Servidor de arquivos Blossom</h2>

	<h3>Upload falha com <code>401</code></h3>
	<p>O evento de autorização de upload (kind 24242) foi rejeitado. Verifique se:</p>
	<ul>
		<li>
			a tag <code>expiration</code> do token está <strong>presente</strong> e definida como um timestamp unix
			no futuro,
		</li>
		<li>para upload/media/delete o token carrega uma tag <code>x</code> com o sha256 do blob,</li>
		<li>
			a tag <code>server</code> (quando presente) nomeia exatamente o <code>blossom.host</code>
			configurado (somente hostname, sem esquema/caminho),
		</li>
		<li>o token foi assinado nos últimos 10 minutos (uma janela de frescor contra replay),</li>
		<li>e a chave de assinatura é do próprio uploader.</li>
	</ul>

	<h3>Upload falha com <code>403</code></h3>
	<p>
		<code>blossom.restrict_uploads = true</code> está definido e a pubkey não está na lista de permissão — adicione-a
		com <code>nostrfy blossom allow npub1...</code> (o daemon recarrega automaticamente). Se a lista parecer
		errada, <code>nostrfy blossom list</code> a mostra.
	</p>

	<h3>Upload falha com <code>409</code></h3>
	<p>
		O cliente enviou um cabeçalho <code>X-SHA-256</code> que não corresponde ao corpo real da requisição (o
		hash declarado foi calculado sobre bytes diferentes — por ex. o arquivo mudou entre o cálculo do hash e o envio).
		Os clientes podem omitir o cabeçalho completamente.
	</p>

	<h3><code>GET /</code> no host de mídia serve o documento NIP-11</h3>
	<p>
		A requisição não chegou ao relay com o cabeçalho Blossom Host. Aponte <code>media.example.com</code>
		(ou qualquer que seja o <code>blossom.host</code> definido) para a mesma porta no proxy reverso, então
		<code>nostrfy restart</code>.
	</p>

	<h3>Um blob retorna 404 logo após o upload</h3>
	<p>
		O arquivo é endereçado pelo conteúdo via seu SHA-256: busque-o pelo hash exato retornado na resposta
		do upload (<code>/&lt;sha256&gt;</code> ou <code>/&lt;sha256&gt;.&lt;ext&gt;</code>). Uma incompatibilidade significa
		que o cliente solicitou um hash diferente dos bytes que enviou.
	</p>

	<h2 id="search-groups-auth">Busca, grupos e autenticação</h2>

	<h3>A busca retorna 0 resultados / resultados inesperados</h3>
	<p>A busca do nostrfy corresponde a <strong>palavras inteiras</strong>. Observe que:</p>
	<ul>
		<li>
			<code>search = "rust"</code> corresponde a eventos contendo a palavra "rust", mas <code>"ru"</code>
			NÃO corresponde a "rust" como substring.
		</li>
		<li>Apenas palavras no conteúdo do evento são pesquisadas.</li>
		<li>Se <code>search_index = false</code>, a busca ainda funciona, mas é mais lenta.</li>
		<li>
			Se o NIP-50 estiver desativado (<code>disabled_nips = [50]</code>), <code>search</code> é ignorado
			(um NOTICE é enviado).
		</li>
	</ul>

	<h3>Metadados de grupo (39000-39005) não são gerados</h3>
	<p>
		<strong>Causa:</strong> <code>relay.private_key</code> não está definido. Os snapshots de grupo são assinados pela
		própria chave do relay, então sem ela nada é gerado.
	</p>
	<p><strong>Correção:</strong></p>
	<CodeBlock code={genkeyRestart} lang="bash" />

	<h3><code>restricted: unknown group</code> rejeita eventos de grupo</h3>
	<p>
		<strong>Causa:</strong> O grupo não existe. No NIP-29, eventos de moderação e solicitações de participação
		(9021) não podem visar um grupo antes que ele seja criado (kind 9007).
	</p>
	<p><strong>Correção:</strong> Crie o grupo primeiro com um evento 9007.</p>

	<h3><code>restricted: you are not an admin of this group</code></h3>
	<p>
		<strong>Causa:</strong> A moderação (adicionar membros, etc.) exige um admin (um membro com uma função).
		O criador é um admin.
	</p>
	<p><strong>Correção:</strong> Peça a um admin para conceder uma função a você ou crie seu próprio grupo.</p>

	<h3><code>restricted: this group is closed</code></h3>
	<p>
		<strong>Causa:</strong> O grupo é <code>closed</code>; solicitações de participação sem código de convite não
		são aprovadas automaticamente.
	</p>
	<p><strong>Correção:</strong> Peça a um admin um código de convite (9009) e participe com uma tag <code>code</code>.</p>

	<h3>Saiu acidentalmente de um grupo, ou o grupo não tem admins</h3>
	<p>
		<strong>Causa:</strong> Solicitações de saída NIP-29 (kind 9022) são atendidas para qualquer membro — incluindo o
		último admin do grupo, que não deixa admins para trás. Sem admin, ninguém pode enviar eventos de moderação
		(9000/9001/9002/9008) mais.
	</p>
	<p>
		<strong>Correção:</strong> Assine um evento de moderação com a própria chave do relay (<code>relay.private_key</code>,
		a pubkey anunciada como <code>self</code> do NIP-11). Pelo NIP-29, eventos de moderação podem vir da "chave
		mestra do relay ou ... dos admins do grupo", então o relay aceita moderação de grupo assinada pela própria chave mesmo
		quando o grupo não tem admins. Por exemplo, restaure um admin com um <code>kind:9000</code>:
	</p>
	<CodeBlock code={recovery} lang="json" />
	<p>
		Assine e publique com a chave do relay. Alternativamente, exclua o grupo com um
		<code>kind:9008</code> assinado pelo relay (seus eventos armazenados são purgados) e recrie-o com <code>kind:9007</code>.
		Esta recuperação precisa que <code>relay.private_key</code> esteja configurado.
	</p>

	<h3>Eventos protegidos são rejeitados com <code>auth-required</code></h3>
	<p>
		<strong>Causa:</strong> Eventos protegidos NIP-70 (com tag <code>-</code>) só podem ser publicados pelo
		autor autenticado <strong>na mesma conexão</strong>.
	</p>
	<p><strong>Correção:</strong> Ative a autenticação NIP-42 no cliente antes de publicar.</p>

	<h3>AUTH (NIP-42) retorna <code>false</code></h3>
	<p>Causas comuns:</p>
	<ol>
		<li>
			<code>relay.public_url</code> não definido ou errado — a tag <code>relay</code> do evento AUTH não
			corresponde à URL do relay. Defina <code>wss://...</code> e reinicie.
		</li>
		<li>Challenge expirado — você enviou AUTH em uma conexão diferente ou reutilizou um challenge antigo.</li>
		<li>
			O relógio do cliente está errado — o <code>created_at</code> do evento AUTH deve estar dentro de ±10 minutos de
			agora.
		</li>
	</ol>

	<h3>API de gerenciamento NIP-86 retorna <code>401 unauthorized</code></h3>
	<p><strong>Causa:</strong> Credenciais ausentes ou erradas.</p>
	<p><strong>Correção:</strong></p>
	<ul>
		<li>Defina <code>management_token</code> e envie <code>Authorization: Bearer &lt;token&gt;</code>.</li>
		<li>
			Ou defina <code>admin_pubkey</code> e envie um evento de autenticação NIP-98 (a tag <code>u</code> deve corresponder
			exatamente à URL do relay; uma tag <code>payload</code> é necessária).
		</li>
		<li>Se nenhum estiver definido, a API de gerenciamento está totalmente desativada.</li>
	</ul>

	<h3>Eventos de autenticação NIP-98 são rejeitados por esquema ou porta diferentes</h3>
	<p>
		A especificação NIP-98 diz que a tag <code>u</code> deve ser <em>exatamente</em> igual à URL absoluta da
		requisição, então o nostrfy deriva a URL esperada de <code>relay.public_url</code>: sua autoridade mais o
		esquema HTTP mapeado do esquema WebSocket (<code>wss://</code> → <code>https://</code>,
		<code>ws://</code> → <code>http://</code>, <code>nostr+</code> removido). Sem
		<code>public_url</code> o relay espera o simples <code>http://host:port</code> que serve. Uma tag com
		outro esquema, uma porta diferente/omitida, ou um caminho ou query diferente é rejeitada — defina
		<code>relay.public_url</code> para o endereço público que os clientes assinam. Cada evento de autenticação também é
		<strong>de uso único</strong>: repetir o mesmo cabeçalho <code>Authorization</code> dentro de sua janela de validade de 60
		segundos é recusado.
	</p>

	<h2 id="db-disk">Banco de dados e disco</h2>

	<h3><code>database map is full: increase database.max_map_size</code></h3>
	<p>
		<strong>Causa:</strong> O teto do memory-map do LMDB (padrão 1 TB de espaço de endereço virtual; o uso real
		de disco cresce com os dados) foi atingido — efetivamente, o banco de dados está cheio.
	</p>
	<p><strong>Correção:</strong> Aumente <code>database.max_map_size</code> e reinicie.</p>

	<h3><code>disk is full: refusing to commit N events</code></h3>
	<p>
		<strong>Causa:</strong> Menos de 32 MB de espaço livre em disco. As escritas param (para proteger os dados); as leituras
		continuam.
	</p>
	<p>
		<strong>Correção:</strong> Libere espaço em disco. As escritas são retomadas automaticamente quando houver espaço disponível.
		(<code>df -h /path/to/data</code>)
	</p>

	<h3><code>nostrfy check</code> relata <code>map_size must not exceed max_map_size</code></h3>
	<p>
		<strong>Causa:</strong> <code>database.map_size</code> é maior que <code>max_map_size</code>.
	</p>
	<p>
		<strong>Correção:</strong> Defina <code>map_size</code> igual ou abaixo de <code>max_map_size</code> (os padrões
		estão bons).
	</p>

	<h3>Verificando o tamanho do banco de dados</h3>
	<CodeBlock code={dbSize} lang="bash" />

	<h3>Fazer backup / mover o banco de dados</h3>
	<p>
		Todos os dados ficam no diretório <code>database.path</code>.
		<strong>Pare o relay antes de copiar</strong> (copiar um banco de dados ativo pode corrompê-lo).
	</p>
	<CodeBlock code={backup} lang="bash" />

	<h2 id="daemon">Operação do daemon</h2>

	<h3><code>nostrfy stats</code> diz <code>nostrfy is not running (no stats file)</code></h3>
	<p>
		<strong>Causa:</strong> O arquivo de stats não existe — o daemon não está em execução ou iniciou há
		menos de alguns segundos.
	</p>
	<p><strong>Correção:</strong> Execute <code>nostrfy start</code>, aguarde alguns segundos e tente novamente.</p>

	<h3>O log cresce sem parar</h3>
	<p>
		<strong>Causa:</strong> <code>max_log_size_bytes</code> é 0 (rotação desativada).
	</p>
	<p>
		<strong>Correção:</strong> Defina <code>max_log_size_bytes = 52428800</code> (50 MB) e
		<code>max_log_files = 5</code>. A rotação é automática.
	</p>

	<h3>Mudanças na configuração não têm efeito após recarregar</h3>
	<p>
		<strong>Causa:</strong> Você recarregou (SIGHUP) configurações que são fixas na inicialização:
		<code>private_key</code>, <code>api_host</code>, <code>metrics_enabled</code>, configurações LiveKit e
		as listas de ativação/desativação de NIPs.
	</p>
	<p>
		<strong>Correção:</strong> Use <code>nostrfy restart</code>. O log contém um aviso "a restart is required"
		neste caso.
	</p>

	<h3>O relay continua morrendo sozinho</h3>
	<p><strong>Causa:</strong> A máquina reiniciou ou o relay ficou sem memória (OOM).</p>
	<p><strong>Correção:</strong></p>
	<ol>
		<li>Verifique o final do log: <code>tail -50 nostrfy.log</code>.</li>
		<li>
			Verifique se a máquina reiniciou: <code>uptime</code> (um uptime muito curto significa reinicialização).
		</li>
		<li>Verifique a memória: <code>free -h</code>.</li>
		<li>Inicie o relay novamente: <code>nostrfy start</code>.</li>
	</ol>
	<Callout type="tip" title="Dica">
		Para iniciar o nostrfy automaticamente na inicialização, registre-o como um serviço systemd com o comando de
		inicialização do relay como <code>ExecStart</code>.
	</Callout>

	<h3>systemd não consegue iniciar o relay na porta 80</h3>
	<p>
		Um serviço systemd executando como root pode vincular a porta 80. Se você definiu <code>User=</code> para um usuário comum,
		use uma porta mais alta (por ex. 8080) ou adicione
		<code>AmbientCapabilities=CAP_NET_BIND_SERVICE</code> à unit.
	</p>

	<h2 id="still-not-solved">Ainda não resolveu?</h2>
	<ol>
		<li>
			<strong>Verifique o log</strong>: <code>tail -100 nostrfy.log</code> — geralmente indica a causa
			direta.
		</li>
		<li>
			<strong>Revalide a configuração</strong>: <code>nostrfy check</code> — mostra avisos e erros.
		</li>
		<li>
			<strong>Reúna detalhes de reprodução</strong>: o que você estava fazendo, qual cliente, qual erro exato.
		</li>
		<li>
			<strong>Pergunte no repositório do projeto</strong>:
			<a href="https://github.com/iqbqioza/nostrfy">https://github.com/iqbqioza/nostrfy</a> — ao abrir
			uma issue, inclua as etapas de reprodução e o log.
		</li>
	</ol>
</div>
