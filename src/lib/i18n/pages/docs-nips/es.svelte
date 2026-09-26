<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);
</script>

<DocsTitle
	title="Referencia de NIP compatibles"
	description="Todos los NIP del lado del relé que implementa nostrfy — kinds, notas y advertencias — y cómo se calcula dinámicamente la lista supported_nips de NIP-11."
/>

<div class="doc-body">
	<h2>NIP implementados</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>NIP</th>
				<th>Descripción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>Protocolo básico (eventos, suscripciones)</td>
			</tr>
			<tr>
				<td>9</td>
				<td>Eliminación de eventos</td>
			</tr>
			<tr>
				<td>11</td>
				<td>Documento de información del relé</td>
			</tr>
			<tr>
				<td>13</td>
				<td>Prueba de trabajo</td>
			</tr>
			<tr>
				<td>17</td>
				<td>DM privados (kind 14 envuelto en kind 15; los gift wraps kind 1059 y efímero kind 21059 se sirven solo al destinatario cuando la auth NIP-42 está activada)</td>
			</tr>
			<tr>
				<td>22</td>
				<td>Comentarios (kind 1111, hilos mediante el índice #e)</td>
			</tr>
			<tr>
				<td>26</td>
				<td>Firma delegada de eventos</td>
			</tr>
			<tr>
				<td>28</td>
				<td>Chat público (lado cliente: almacenado y servido como eventos normales, no anunciado)</td>
			</tr>
			<tr>
				<td>29</td>
				<td>Grupos basados en relé</td>
			</tr>
			<tr>
				<td>32</td>
				<td>Etiquetado (kind 1985, indexado #l/#L)</td>
			</tr>
			<tr>
				<td>33</td>
				<td>Eventos reemplazables parametrizados</td>
			</tr>
			<tr>
				<td>34</td>
				<td>
					Funciones git (kinds 1617-1619, 1621, 1622, 1630-1633, 30617/30618 — opcional vía
					<code>relay.enabled_git</code>, desactivado por defecto)
				</td>
			</tr>
			<tr>
				<td>40</td>
				<td>Marca de expiración</td>
			</tr>
			<tr>
				<td>42</td>
				<td>Autenticación de clientes</td>
			</tr>
			<tr>
				<td>43</td>
				<td>
					Metadatos de acceso del relé (roles) — kinds 33534/13534/8000/8001 más efímeros 28934/28935/28936;
					los metadatos firmados por el relé están protegidos por AUTH. Los códigos de invitación se emiten con NIP-86
					<code>createclaim</code>/<code>deleteclaim</code>; un kind:28934 con un código listado admite
					a su autor
				</td>
			</tr>
			<tr>
				<td>45</td>
				<td>Conteo de resultados (COUNT)</td>
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
				<td>Capacidad de búsqueda (texto completo, ordenada por relevancia)</td>
			</tr>
			<tr>
				<td>57</td>
				<td>Zaps Lightning (kinds 9734/9735)</td>
			</tr>
			<tr>
				<td>59</td>
				<td>Gift wrap (servido solo al destinatario)</td>
			</tr>
			<tr>
				<td>62</td>
				<td>Solicitud de desaparición</td>
			</tr>
			<tr>
				<td>65</td>
				<td>Metadatos de lista de relés</td>
			</tr>
			<tr>
				<td>66</td>
				<td>Descubrimiento de relés y actividad (kinds 30166/10166 almacenados y servidos; autopublica kind 30166)</td>
			</tr>
			<tr>
				<td>67</td>
				<td>Sugerencia de completitud EOSE</td>
			</tr>
			<tr>
				<td>70</td>
				<td>Eventos protegidos</td>
			</tr>
			<tr>
				<td>77</td>
				<td>Sincronización Negentropy (un reemplazo fallido cierra el id con NEG-ERR según NIP-77)</td>
			</tr>
			<tr>
				<td>78</td>
				<td>Datos específicos de aplicación (kind 30078, protegido por AUTH)</td>
			</tr>
			<tr>
				<td>84</td>
				<td>Destacados</td>
			</tr>
			<tr>
				<td>85</td>
				<td>Afirmaciones de confianza (kinds 30382/30383/30384/30385/10040, direccionables)</td>
			</tr>
			<tr>
				<td>86</td>
				<td>API de gestión del relé</td>
			</tr>
			<tr>
				<td>87</td>
				<td>Anuncios Cashu y Fedimint (kinds 38000/38172/38173)</td>
			</tr>
			<tr>
				<td>88</td>
				<td>Encuestas</td>
			</tr>
			<tr>
				<td>94</td>
				<td>Metadatos de archivos (kind 1063)</td>
			</tr>
			<tr>
				<td>98</td>
				<td>Auth HTTP</td>
			</tr>
			<tr>
				<td>A3</td>
				<td>
					Destinos de pago (kind 10133, reemplazable), un borrador; servido pero no anunciado
					en <code>supported_nips</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Blossom (BUD-01/02) no es un NIP y no se anuncia en el documento NIP-11 — se sirve como
		servidor de archivos separado en el nombre de host <code>[blossom]</code>. Consulta la
		<a href={p('/docs/blossom/')}>página del servidor de archivos Blossom</a> para más detalles.
	</p>

	<h2>Anuncio dinámico de NIP</h2>
	<p>
		La lista <code>supported_nips</code> no es estática: un NIP se elimina de ella cuando cada kind que el
		NIP define es rechazado por el control de acceso del relé.
	</p>
	<ul>
		<li>
			<strong><code>blocked_kinds</code></strong> — bloquear todos los kinds de un NIP lo oculta (p. ej. bloquear el
			kind 5 oculta NIP-09). Bloquear solo algunos kinds conserva el NIP.
		</li>
		<li>
			<strong><code>allowed_kinds</code></strong> — un kind solo se acepta cuando está listado; un NIP cuyos
			kinds están todos sin listar se oculta.
		</li>
		<li>
			<strong><code>reject_ephemeral</code></strong> — los kinds efímeros que no están en la lista de exención
			obligatoria del NIP (<code>22242</code>, <code>27235</code>, <code>28934</code>/<code>28935</code>/
			<code>28936</code>, <code>24133</code>, <code>23194</code>/<code>23195</code>, <code>24242</code>,
			<code>21059</code>) se rechazan, por lo que los NIP que dependen de ellos se ocultan.
		</li>
		<li>
			<strong>Prerrequisitos</strong> — NIP-29, NIP-43 y NIP-66 dependen de eventos firmados por el relé y se
			ocultan sin <code>relay.private_key</code>; NIP-86 se oculta a menos que se configure
			<code>rpc.management_token</code> o <code>rpc.admin_pubkey</code> (de lo contrario cada
			llamada de gestión es rechazada).
		</li>
		<li>
			Los NIP sin kinds dedicados (<code>1</code>, <code>11</code>, <code>13</code>, <code>26</code>, <code>33</code>,
			<code>40</code>, <code>45</code>, <code>50</code>, <code>67</code>, <code>70</code>,
			<code>77</code>) siempre se anuncian cuando están habilitados.
		</li>
	</ul>
	<p>
		Los cambios en tiempo de ejecución — NIP-86 <code>allowkind</code>/<code>disallowkind</code>, o una recarga SIGHUP de
		<code>reject_ephemeral</code> — se reflejan en la próxima consulta NIP-11.
		<code>enabled_nips</code>/<code>disabled_nips</code> siguen requiriendo un reinicio.
	</p>
</div>
