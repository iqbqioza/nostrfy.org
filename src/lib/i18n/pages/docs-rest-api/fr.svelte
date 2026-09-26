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
	const page1 = `curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=0"     # page 1
curl "http://127.0.0.1:8080/api/v1/npub180cvv07tjdrrgpa0j7j7tmnyl2yr6yr7l8j4s3evf6u64th6gkws3w8ktc/1?limit=50&offset=50"    # page 2 (quand more était vrai)`;
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
	title="Référence de l’API REST"
	description="API HTTP en lecture seule pour interroger les événements Nostr stockés via GET /api/v1/... — points de terminaison, paramètres, pagination, règles de visibilité et erreurs."
/>

<div class="doc-body">
	<h2>URL de base</h2>
	<p>
		L’API est servie sous <code>/api/v1</code> sur le même port que le relais WebSocket :
	</p>
	<CodeBlock code={baseUrl} lang="text" />

	<h2>Routage par hôte (<code>server.api_host</code>)</h2>
	<p>
		Lorsque <code>server.api_host</code> (p. ex. <code>api.example.com</code>) est configuré, l’API et le relais sont séparés par l’en-tête Host : <code>api.example.com</code> reçoit <code>/api/v1</code>,
		<code>/health</code> et <code>/metrics</code> ; tout autre hôte reçoit le relais WebSocket et NIP-11.
		Sans <code>api_host</code>, l’API est servie sur tous les hôtes. Seul GET est pris en charge — les demandes de mise à niveau WebSocket vers <code>/api/v1</code> sont refusées avec 403.
	</p>

	<h2>Points de terminaison</h2>
	<h3>Chemins basés sur un identifiant</h3>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Chemin</th>
				<th>Retourne</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;</code></td>
				<td>Dernier événement de profil (kind 0)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;note1&gt;</code> / <code>&lt;nevent1&gt;</code></td>
				<td>L’événement unique portant cet identifiant</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;naddr1&gt;</code></td>
				<td>Événements de l’adresse (kind + auteur + tag d)</td>
			</tr>
			<tr>
				<td><code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;</code></td>
				<td>Événements par pubkey, filtrés par kind (accepte npub1... ou nprofile1... ; 400 sinon)</td>
			</tr>
		</tbody>
	</table>
	</div>
	<p>
		Les identifiants d’auteur acceptent <code>npub1...</code>, <code>nprofile1...</code> ou une pubkey hexadécimale de 64 caractères (insensible à la casse) sur chaque point de terminaison.
	</p>
	<h3>Points de terminaison de requête et d’agrégation</h3>
	<ul>
		<li><code>GET /api/v1/query</code> — requête générique avec filtre sans identifiant.</li>
		<li><code>GET /api/v1/count</code> — nombre total pour les mêmes paramètres de filtre (sémantique NIP-45).</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/kinds</code> — nombres d’événements par kind pour un auteur, les plus utilisés d’abord.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/daily</code> — nombres par jour pour un mois ;
			le mois doit être entre 1 et 12, et chaque jour est rapporté avec remplissage par zéro jusqu’au dernier jour (chaque entrée et le total portent un drapeau <code>approximate</code>).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;</code> — un événement unique par son id hexadécimal de 64 caractères (préfixes rejetés).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/stats</code> — résumé de l’auteur (total, première/dernière activité, répartition par kind) ; <code>first_seen</code>/<code>last_seen</code>/les mois valent <code>null</code> lorsqu’il n’existe aucun événement visible.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/hourly</code> — nombres par heure pour un jour ; les 24 heures sont rapportées avec remplissage par zéro (mêmes drapeaux <code>approximate</code> que daily).
		</li>
		<li>
			<code>GET /api/v1/ids/&lt;hex&gt;/related</code> — réponses (#e) et citations (#q) référençant l’événement ; l’id du chemin est mis en minuscules avant comparaison, et un paramètre de requête <code>e</code> est combiné par OR avec le côté #e.
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/follows</code> — la dernière liste de suivis kind-3 de l’auteur.
		</li>
		<li><code>GET /api/v1/relay/kinds</code> — les kinds les plus courants sur le relais (échantillon borné, filtré par visibilité ; drapeaux <code>approximate</code> et <code>filtered</code>).</li>
		<li>
			<code>GET /api/v1/relay/top-authors</code> — les auteurs les plus actifs sur le relais (échantillon borné, filtré par visibilité ; drapeaux <code>approximate</code> et <code>filtered</code>).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/relays</code> — la dernière liste de relais NIP-65 de l’auteur (kind 10002).
		</li>
		<li>
			<code>GET /api/v1/&lt;npub1...&gt;/&lt;kind&gt;/monthly</code> — nombres par mois, avec remplissage par zéro sur la plage since/until (défaut : toute la période ; plafonné à 120 mois).
		</li>
	</ul>

	<h2>Paramètres de requête</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Paramètre</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>limit</code></td>
				<td>Résultats max (défaut 100, plafonné par max_api_limit)</td>
			</tr>
			<tr>
				<td><code>offset</code></td>
				<td>Nombre de résultats visibles à ignorer (pagination)</td>
			</tr>
			<tr>
				<td><code>since</code></td>
				<td>Uniquement les événements avec created_at &gt;= since</td>
			</tr>
			<tr>
				<td><code>until</code></td>
				<td>Uniquement les événements avec created_at &lt;= until</td>
			</tr>
			<tr>
				<td><code>sort</code></td>
				<td><code>asc</code>/<code>ascending</code> pour les plus anciens d’abord ; défaut : les plus récents d’abord</td>
			</tr>
			<tr>
				<td><code>search</code></td>
				<td>Recherche plein texte NIP-50 (correspondance de mots entiers)</td>
			</tr>
			<tr>
				<td><code>e</code> / <code>p</code> / <code>t</code> / <code>d</code></td>
				<td>Filtrer par tags #e / #p / #t / #d</td>
			</tr>
			<tr>
				<td><code>no_p</code> / <code>no_e</code> / <code>no_t</code> / <code>no_d</code></td>
				<td>
					Exclure les événements portant ce tag — appliqué avant la pagination, donc les événements exclus ne consomment jamais de places <code>limit</code> ni d’étapes <code>offset</code>
				</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Format de réponse</h2>
	<p>Les réponses réussies retournent <code>200 OK</code> avec le corps JSON suivant :</p>
	<CodeBlock code={sample} lang="json" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Champ</th>
				<th>Description</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>events</code></td>
				<td>Les événements de cette page (les plus récents d’abord par défaut)</td>
			</tr>
			<tr>
				<td><code>count</code></td>
				<td>Le nombre d’événements dans cette page</td>
			</tr>
			<tr>
				<td><code>more</code></td>
				<td><code>true</code> quand d’autres pages existent (utilisez offset pour les récupérer)</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Pagination</h2>
	<p>
		La pagination se fait avec <code>offset</code> et le drapeau <code>more</code>, calculés sur la séquence <strong>visible</strong> — les événements masqués ne sautent ni ne dupliquent jamais une page :
	</p>
	<CodeBlock code={page1} lang="bash" />

	<Callout type="note" title="Particularités des points de terminaison">
		Les points de terminaison singleton (profil, <code>/ids/&#123;hex&#125;</code>, follows, relays) acceptent tout de même <code>offset</code> — <code>?offset=1</code> ignore l’unique événement et retourne <code>[]</code>.
		Les paramètres de requête <code>authors</code>/<code>kinds</code> ne filtrent que le point de terminaison générique <code>/query</code> : sur les points de terminaison kind ils sont silencieusement ignorés (tous deux pré-remplis), tandis que sur les points de terminaison id ils sont combinés par AND. La répartition par kind de <code>stats</code> est ordonnée par kind, contrairement à <code>/kinds</code> (d’abord par nombre).
	</Callout>

	<h2>Règles de visibilité</h2>
	<p>L’API n’est pas authentifiée, elle retient donc les mêmes événements qu’une connexion WebSocket anonyme :</p>
	<ul>
		<li>Événements protégés NIP-70 (portant un tag <code>-</code>)</li>
		<li>Gift wraps NIP-59 (kind 1059)</li>
		<li>Contenu de groupe privé/masqué NIP-29 (visible uniquement par les membres)</li>
	</ul>

	<h2>Erreurs et codes de statut</h2>
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Code</th>
				<th>Signification</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>200</td>
				<td>Succès</td>
			</tr>
			<tr>
				<td>400</td>
				<td>Identifiant ou paramètre de requête invalide</td>
			</tr>
			<tr>
				<td>403</td>
				<td>Tentative de mise à niveau WebSocket vers /api/v1</td>
			</tr>
			<tr>
				<td>404</td>
				<td>Chemin inconnu, ou mauvais Host pour l’API (api_host configuré)</td>
			</tr>
			<tr>
				<td>503</td>
				<td>Limite de concurrence de l’API atteinte — réessayez sous peu</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Exemples</h2>
	<p>Récupérer les notes d’un utilisateur (les plus récentes d’abord) :</p>
	<CodeBlock code={notesEx} lang="bash" />
	<p>Paginer et trier :</p>
	<CodeBlock code={paginateEx} lang="bash" />
	<p>Récupérer un événement unique par id (note1... ou nevent1... fonctionnent tous deux) :</p>
	<CodeBlock code={byIdEx} lang="bash" />
	<p>Récupérer un événement adressable (naddr1...) :</p>
	<CodeBlock code={naddrEx} lang="bash" />
	<p>Recherche :</p>
	<CodeBlock code={searchEx} lang="bash" />
	<p>Filtre par tag :</p>
	<CodeBlock code={tagEx} lang="bash" />
</div>
