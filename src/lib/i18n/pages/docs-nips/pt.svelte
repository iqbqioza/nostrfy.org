<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('pt', path);
</script>

<DocsTitle
	title="Referência de NIPs suportados"
	description="Todos os NIP do lado do relay implementados pelo nostrfy — kinds, notas e ressalvas — e como a lista supported_nips do NIP-11 é calculada dinamicamente."
/>

<div class="doc-body">
	<h2>NIPs implementados</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Descrição</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Protocolo básico (eventos, assinaturas)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Exclusão de eventos</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Documento de informações do relay</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Prova de trabalho</td>
			</tr>
			<tr>
				<td>17</td>
				<td>DMs privadas (kind 14 embrulhado em kind 15; os gift wraps kind 1059 e efêmero kind 21059 são servidos somente ao destinatário quando a auth NIP-42 está ativada)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Comentários (kind 1111, threads via índice #e)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Assinatura delegada de eventos</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Chat público (lado cliente: armazenado e servido como eventos normais, não anunciado)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Grupos baseados em relay</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Rotulagem (kind 1985, indexado #l/#L)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Eventos substituíveis parametrizados</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					Recursos Git (kinds 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — opcional via
					<code>relay.enabled_git</code>, desativado por padrão)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Carimbo de expiração</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Autenticação de clientes</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Metadados de acesso do relay (funções) — kinds 33534/13534/8000/8001 mais efêmeros 28934/28935/28936;
					os metadados assinados pelo relay são protegidos por AUTH. Códigos de convite são emitidos com NIP-86
					<code>createclaim</code>/<code>deleteclaim</code>; um kind:28934 com um código listado admite
					seu autor
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Contagem de resultados (COUNT)</td>
			</tr>
			<tr>
				<td>46</td>
				<td>Nostr Connect</td>
			</tr>
			<tr>
				<td>47</td>
				<td>Nostr Wallet Connect</td>
			</tr>
			<tr>
				<td>50</td>
				<td>Capacidade de busca (texto completo, ordenada por relevância)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Zaps Lightning (kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift wrap (servido somente ao destinatário)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Pedido de desaparecimento</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Metadados de lista de relays</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Descoberta de relays e atividade (kinds 30166/10166 armazenados e servidos; autopublica kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>Dica de completude EOSE</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Eventos protegidos</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Sincronização Negentropy (uma substituição com falha fecha o id com NEG-ERR conforme NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Dados específicos de aplicação (kind 30078, protegido por AUTH)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Destaques</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Declarações confiáveis (kinds 30382/30383/30384/30385/10040, endereçáveis)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>API de gerenciamento do relay</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Anúncios Cashu e Fedimint (kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Enquetes</td>
			</tr>
			<tr>
				<td>94</td>
				<td>Metadados de arquivos (kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>Auth HTTP</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Destinos de pagamento (kind 10133, substituível), um rascunho; servido mas não anunciado
					em <code>supported_nips</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) não é um NIP e não é anunciado no documento NIP-11 — é servido como
		servidor de arquivos separado no nome de host <code>[blossom]</code>. Consulte a
		<a href={p('/docs/blossom/')}>página do servidor de arquivos Blossom</a> para detalhes.
	</p>

	<h2>Anúncio dinâmico de NIP</h2>
	<p>
		A lista <code>supported_nips</code> não é estática: um NIP é removido dela quando cada kind definido pelo
		NIP é rejeitado pelo controle de acesso do relay.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — bloquear todos os kinds de um NIP o oculta (p. ex. bloquear o
			kind 5 oculta o NIP-09). Bloquear apenas alguns kinds mantém o NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — um kind só é aceito quando listado; um NIP cujos
			kinds estão todos não listados é ocultado.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — kinds efêmeros que não estão na lista de isenção
			obrigatória do NIP (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>) são rejeitados, de modo que os NIPs que dependem deles ficam ocultos.
		</li>
		<li>
			<strong>Pré-requisitos</strong> — NIP-29, NIP-43 e NIP-66 dependem de eventos assinados pelo relay e ficam
			ocultos sem <code>relay.private_key</code>; NIP-86 fica oculto a menos que
			<code>rpc.management_token</code> ou <code>rpc.admin_pubkey</code> esteja definido (caso contrário cada
			chamada de gerenciamento é recusada).
		</li>
		<li>
			NIPs sem kinds dedicados (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) são sempre anunciados quando ativados.
		</li>
	</ul>
	<p>
		Alterações em tempo de execução — NIP-86 <code>allowkind</code>/<code>disallowkind</code>, ou uma recarga a quente (SIGHUP) de
		<code>reject_ephemeral</code> — são refletidas na próxima busca NIP-11.
		<code>enabled_nips</code>/<code>disabled_nips</code> ainda exigem reinicialização.
	</p>
</div>
