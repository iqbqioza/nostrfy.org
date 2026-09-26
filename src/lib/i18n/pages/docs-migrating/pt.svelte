<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const quickCode = `# 1. pare o relay nostrfy (a migração precisa do diretório do banco)
nostrfy --config /etc/nostrfy/nostrfy.toml stop

# 2. simulação — analisa e verifica cada evento, não grava nada
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db --dry-run

# 3. importação
nostrfy --config /etc/nostrfy/nostrfy.toml migrate-strfry \\
    --strfry-db /var/lib/strfry-db

# 4. inicialização — grupos NIP-29 e papéis NIP-43 são reconstruídos a partir dos eventos importados
nostrfy --config /etc/nostrfy/nostrfy.toml start`;

	const configCode = `[relay]
name = "My Relay"
public_url = "wss://relay.example.com"   # necessário para NIP-42/62/98 e metadados NIP-29
private_key = "..."                       # necessário para metadados NIP-29/43 assinados pelo relay

[server]
host = "0.0.0.0"
port = 8080

[database]
path = "/var/lib/nostrfy"
map_size = 1073741824`;

	const inputCode = `# Opção A — o próprio nostrfy executa \`strfry export\` (strfry no PATH)
nostrfy migrate-strfry --strfry-db /var/lib/strfry-db

# Opção B — você exportou para um arquivo
strfry export > /tmp/strfry-export.jsonl
nostrfy migrate-strfry --input /tmp/strfry-export.jsonl

# Opção C — pipe (stdin é a entrada padrão)
strfry export | nostrfy migrate-strfry`;

	const verifyCode = `R=wss://relay.example.com      # para o nak (WebSocket)
H=https://relay.example.com    # para o curl (HTTP)

nak relay "$R"                              # o relay responde e anuncia seus NIPs
curl -s "$H/api/v1/query?limit=1"           # os eventos são servidos
nak req -i <deleted-event-id> "$R"          # um evento excluído continua fora
nak req -k 39000 "$R"                       # metadados de grupo NIP-29 (se migrados)
nak req --auth --force-pre-auth --sec <nsec> -k 13534 "$R"   # participação NIP-43 (AUTH)`;
</script>

<DocsTitle
	title="Migrando do strfry"
	description="Mova os eventos de um relay strfry existente para o nostrfy com um comando — preparação, simulação, migração, verificação e reversão."
/>

<div class="doc-body">
	<h2>Visão geral</h2>
	<p>
		<code>nostrfy migrate-strfry</code> lê o formato de exportação próprio do
		<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
		(JSONL, um evento NIP-01 por linha), por isso funciona entre versões do banco strfry e não depende do esquema
		LMDB interno do strfry. Nunca escreve no banco do strfry.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Migrado</th>
					<th>Não migrado</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Cada evento armazenado (semântica substituível/endereçável aplicada)</td>
					<td>Configurações do strfry sem equivalente no nostrfy (o relatório de merge lista cada uma com motivo)</td>
				</tr>
				<tr>
					<td>Expiração NIP-40 — eventos já expirados são ignorados</td>
					<td>Mídias Blossom e mapeamentos de donos (strfry não tem servidor Blossom)</td>
				</tr>
				<tr>
					<td>Deleções NIP-09, incluindo bloqueios de republicação para eventos já deletados pelo strfry</td>
					<td>Listas de acesso (bans NIP-86, listas de pubkeys do relay, allowlist Blossom)</td>
				</tr>
				<tr>
					<td>Efeitos de moderação NIP-29 <code>9005</code>/<code>9008</code></td>
					<td>Códigos de convite NIP-43 (emita novos com <code>createclaim</code>)</td>
				</tr>
				<tr>
					<td>Timestamps first-seen (quando o gate de novas pubkeys está configurado)</td>
					<td>Pedidos vanish NIP-62 a menos que <code>--apply-vanish</code> seja dado</td>
				</tr>
				<tr>
					<td>Grupos NIP-29, papéis NIP-43 e seus metadados assinados pelo relay, reconstruídos na primeira inicialização</td>
					<td>Identidade/chaves próprias do relay (ficam em <code>nostrfy.toml</code>)</td>
				</tr>
				<tr>
					<td>As configurações equivalentes do strfry, oferecidas para merge em <code>nostrfy.toml</code> (opcional)</td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<p>
		Ignorados esperados no resumo: <strong>eventos efêmeros</strong> (kinds 20000-29999, que o nostrfy nunca
		armazena) e <strong>eventos já expirados</strong>.
	</p>

	<h2>Início rápido</h2>
	<CodeBlock code={quickCode} lang="sh" />

	<Callout type="warning" title="A migração é offline">
		Ela escreve diretamente em <code>database.path</code> e recusa-se a rodar enquanto um daemon nostrfy (ou outra
		migração) mantiver o diretório do banco. <strong>Pare o relay primeiro.</strong> O strfry pode continuar
		rodando — <code>strfry export</code> lê um snapshot consistente.
	</Callout>

	<h2>Requisitos</h2>
	<ul>
		<li>
			O binário <code>strfry</code> (para <code>--strfry-db</code>), ou um arquivo JSONL exportado por você.
		</li>
		<li>nostrfy v0.1.15 ou mais novo (subcomando <code>migrate-strfry</code>).</li>
		<li>A config nostrfy do relay de destino, com <code>database.path</code>, <code>public_url</code> e <code>private_key</code> definidos.</li>
		<li>
			Espaço livre: cerca do tamanho do export do strfry mais seus índices. O índice de palavras NIP-50 soma
			um pouco mais; em disco muito apertado você pode desativá-lo (<code>database.search_index = false</code>),
			migrar e reativá-lo depois (o índice é reconstruído na inicialização).
		</li>
		<li>Nenhuma instância nostrfy rodando no <code>database.path</code> de destino.</li>
	</ul>

	<h2>Preparar a config</h2>
	<CodeBlock code={configCode} lang="toml" />
	<p>
		Gere a chave do relay com <code>nostrfy genkey</code> se não tiver uma, depois valide:
	</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml check'} lang="sh" />

	<h3>Fundir as configurações do strfry (opcional)</h3>
	<p>
		Antes de abrir o banco, <code>migrate-strfry</code> procura a config do strfry (<code>--strfry-config</code>, depois
		<code>$STRFRY_CONFIG</code>, <code>/etc/strfry.conf</code>, <code>./strfry.conf</code>), mostra as configurações que têm
		equivalente no nostrfy e diferem do seu <code>nostrfy.toml</code>, e pergunta se deve fundi-las. Só as chaves listadas
		são reescritas — comentários e todas as outras linhas são preservados, e um valor que invalidaria a config é ignorado com
		seu motivo enquanto o resto ainda funde.
	</p>
	<ul>
		<li><code>--merge-config</code> aplica sem perguntar (para scripts); <code>--no-merge-config</code> pula a etapa.</li>
		<li>Sem terminal, as propostas são impressas e o merge é pulado a menos que <code>--merge-config</code> seja dado.</li>
		<li><code>--dry-run</code> mostra as propostas mas nunca escreve.</li>
	</ul>

	<h2>Simulação</h2>
	<p>Olhe antes de pular — uma simulação analisa e verifica todo o export sem tocar no banco:</p>
	<CodeBlock code={'nostrfy migrate-strfry --strfry-db /var/lib/strfry-db --dry-run'} lang="sh" />
	<p>
		Uma contagem <code>bad signature</code> diferente de zero significa que o export contém eventos que o strfry aceitou sem
		verificação; eles serão ignorados. Se você confia neles, passe <code>--no-verify</code> para importar mesmo assim.
	</p>

	<h2>Migrar</h2>
	<p>Escolha um dos três modos de entrada — todos produzem o mesmo resultado:</p>
	<CodeBlock code={inputCode} lang="sh" />
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Flag</th>
					<th>Por quê</th>
				</tr>
			</thead>
			<tbody>
				<tr><td><code>--strfry-bin &lt;PATH&gt;</code></td><td>strfry não está no <code>PATH</code></td></tr>
				<tr><td><code>--since &lt;UNIX&gt;</code></td><td>Retomar/alcançar: eventos com este <code>created_at</code> ou mais novos (inclusivo)</td></tr>
				<tr><td><code>--apply-vanish</code></td><td>Respeitar pedidos vanish NIP-62 do export (desligado por padrão)</td></tr>
				<tr><td><code>--no-verify</code></td><td>Pular verificação de assinatura para dumps confiáveis (mais rápido)</td></tr>
				<tr><td><code>--batch &lt;N&gt;</code></td><td>Eventos por transação do banco (padrão 512)</td></tr>
				<tr><td><code>--dry-run</code></td><td>Apenas analisar e verificar</td></tr>
			</tbody>
		</table>
	</div>
	<p>
		A migração é <strong>segura para reexecutar</strong>: duplicatas são ignoradas e os efeitos de deleção são
		reaplicados, então uma execução interrompida pode simplesmente ser repetida (ou retomada com <code>--since</code>).
	</p>

	<h2>Iniciar e verificar</h2>
	<p>
		A primeira inicialização reconstrói o store de grupos NIP-29 e o store de papéis NIP-43 a partir dos eventos importados
		e republica os metadados assinados pelo relay (<code>39000</code>/<code>39001</code>/<code>39002</code>/<code>39005</code>
		por grupo, a lista de membros <code>13534</code>). Num banco grande pode demorar; observe o log.
	</p>
	<CodeBlock code={verifyCode} lang="sh" />
	<p>
		Para comparação exata, <code>strfry scan '&#123;&#125;' | wc -l</code> menos os eventos efêmeros/expirados
		reportados pelo resumo deve igualar o que os clientes conseguem recuperar.
	</p>

	<h2>Retomando uma migração interrompida</h2>
	<Callout type="warning" title="Não inicie o relay antes de reexecutar">
		Os efeitos de grupo NIP-29 (<code>9005</code>/<code>9008</code>) são aplicados após a importação; uma execução
		interrompida armazenou esses eventos mas ainda não suas deleções, então a primeira inicialização poderia servir
		histórico que a deleção deveria remover. Reexecute primeiro a migração — ela completa os efeitos (a purga é
		idempotente) — depois inicie o relay.
	</Callout>
	<ul>
		<li>
			<strong>Exportado para arquivo / via pipe:</strong> reexecute o mesmo comando. Duplicatas são ignoradas e os
			bloqueios de deleção são reaplicados.
		</li>
		<li>
			<strong>Usou <code>--strfry-db</code>:</strong> o resumo imprime uma dica de retomada; reexecute com aquele
			<code>--since</code> (inclusivo, o segundo limite é reimportado e deduplicado).
		</li>
		<li>
			Se falhou com <code>database writer unavailable</code>, verifique espaço livre e <code>database.map_size</code>, depois reexecute.
		</li>
	</ul>

	<h2>Reversão</h2>
	<p>A migração só escreve no banco nostrfy. Para reverter, pare o relay e restaure o banco pré-migração ou remova-o:</p>
	<CodeBlock code={'nostrfy --config /etc/nostrfy/nostrfy.toml stop\nrm -rf /var/lib/nostrfy            # ou restaure o backup pré-migração'} lang="sh" />

	<h2>Solução de problemas</h2>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Mensagem</th>
					<th>Causa / correção</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><code>cannot lock the database directory ...; stop the relay before migrating</code></td>
					<td>Um daemon nostrfy (ou outra migração) mantém o diretório: primeiro <code>nostrfy stop</code></td>
				</tr>
				<tr>
					<td><code>strfry database directory ... does not exist</code></td>
					<td><code>--strfry-db</code> deve nomear o diretório que contém <code>data.mdb</code></td>
				</tr>
				<tr>
					<td><code>cannot run 'strfry': ...</code></td>
					<td>Instale o strfry, defina <code>--strfry-bin</code>, ou use <code>--input</code></td>
				</tr>
				<tr>
					<td><code>database writer unavailable; the migration did not complete</code></td>
					<td>A thread de escrita parou ou a fila sobrecarregou: verifique disco/tamanho map, reexecute (seguro)</td>
				</tr>
				<tr>
					<td><code>group purge for &lt;id&gt; did not complete</code></td>
					<td>A purga foi interrompida: reexecute a migração</td>
				</tr>
				<tr>
					<td>Contagem <code>bad signature</code> alta</td>
					<td>O BD strfry contém eventos não verificados: inspecione-os; importe com <code>--no-verify</code> só se confiar na fonte</td>
				</tr>
				<tr>
					<td>Metadados NIP-29 ausentes após iniciar</td>
					<td>Sem <code>relay.private_key</code>: rode <code>nostrfy genkey</code> e reinicie</td>
				</tr>
				<tr>
					<td>O merge de configurações não é oferecido</td>
					<td>Config do strfry não encontrada: passe <code>--strfry-config /etc/strfry.conf</code></td>
				</tr>
			</tbody>
		</table>
	</div>

	<h2>Checklist</h2>
	<ul>
		<li>Relay nostrfy parado</li>
		<li>Banco strfry e config nostrfy com backup</li>
		<li><code>nostrfy check</code> passa</li>
		<li>Configurações strfry fundidas (ou relatório revisado)</li>
		<li>Simulação revisada (sem bad signatures inesperadas)</li>
		<li>Migração concluída sem erros</li>
		<li>Relay inicia; reconstrução grupos/papéis logada</li>
		<li>Contagens batem (menos efêmeros/expirados)</li>
		<li>Eventos deletados continuam fora (republicação rejeitada)</li>
		<li>Visibilidade de grupos privados checada anonimamente e como membro</li>
		<li>Proxy reverso / DNS / listas de relays dos clientes atualizados</li>
	</ul>

	<Callout type="tip" title="strfry ainda rodando?">
		Se o strfry ficou live durante o export, faça uma passada de catch-up quando estiver pronto para trocar: pare o nostrfy,
		reexecute a migração com <code>--since &lt;last created_at&gt;</code>, depois inicie de novo.
	</Callout>
</div>
