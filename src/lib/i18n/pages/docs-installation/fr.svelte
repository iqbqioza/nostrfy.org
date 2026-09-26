<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const lowSpecConfig = `[database]
search_index = false   # divise la taille de la base par deux et économise CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Guide d’installation"
	description="Prérequis, compilation depuis les sources, installation d’un binaire précompilé, vérification des sommes de contrôle et notes pour exécuter nostrfy sur FreeBSD."
/>

<div class="doc-body">
	<h2>Prérequis</h2>
	<ul>
		<li>Une chaîne d’outils Rust stable récente (nécessaire uniquement pour compiler le relais).</li>
		<li>Une machine Linux.</li>
		<li>2 Go de RAM ou plus sont recommandés — pour un VPS 0,25 vCPU / 512 Mo, voir la note sur les configurations modestes ci-dessous.</li>
	</ul>

	<h3>VPS modeste (0,25 vCPU / 512 Mo)</h3>
	<p>
		nostrfy a été vérifié comme stable même lorsque la base dépasse la RAM. La carte LMDB est une
		<strong>réservation virtuelle creuse de 1 TiB</strong> — le disque physique ne grandit qu’avec les données écrites — et la mémoire du processus reste stable : un relais avec une base de 252 Mo n’occupait que <strong>7,9 Mo de RSS privé</strong>
		(le reste est du cache de fichiers récupérable que le noyau évince sous pression).
	</p>
	<p>Sur un tout petit VPS, un réglage fait la plus grande différence :</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Réglage</th>
				<th>Effet</th>
				<th>Mesuré</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Désactive l’index de mots NIP-50 — la recherche fonctionne toujours (mots entiers) mais est plus lente
				</td>
				<td>41,8 Mo → 20,5 Mo pour 10 000 événements</td>
			</tr>
			<tr>
				<td>Valeurs par défaut</td>
				<td>Déjà optimisé pour la faible mémoire</td>
				<td>Aucun changement nécessaire pour 512 Mo</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Compiler depuis les sources</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>Une fois la compilation terminée, le binaire se trouve dans <code>target/release/nostrfy</code>.</p>

	<h2>Installer un binaire précompilé</h2>
	<p>
		Le workflow de release joint des binaires précompilés <strong>Linux x86_64</strong>, <strong>Linux aarch64</strong> et
		<strong>FreeBSD x86_64</strong>. Le même
		<code>install.sh</code> fonctionne sur les deux OS — il détecte la plateforme, télécharge le binaire correspondant et vérifie sa somme de contrôle :
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy se compile et s’exécute sur FreeBSD 13.x et 14.x (amd64). Installez Rust et compilez avec :</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Notes sur la plateforme :</p>
	<ul>
		<li>
			La vérification de processus actif utilisée par <code>start</code>/<code>stop</code>/<code>restart</code> lit le nom du processus via le
			sysctl <code>kern.proc.pid.&lt;pid&gt;.comm</code> sur FreeBSD (elle utilise
			<code>/proc/&lt;pid&gt;/comm</code> sous Linux), donc un fichier pid obsolète dont le pid a été réutilisé par un autre programme est détecté sur les deux plateformes.
		</li>
		<li>
			<code>nostrfy start</code> se lance en démon comme sous Linux ; le démon à double fork standard fonctionne avec l’intégration
			<code>rc</code> (<code>service nostrfy start</code>).
		</li>
		<li>
			Le contrôle <code>min_free_bytes</code> utilise <code>statvfs</code>, fourni par les deux systèmes ; aucun autre code spécifique à une plateforme n’est utilisé (le relais lui-même est du Rust asynchrone pur sur tokio).
		</li>
	</ul>

	<h3>Exécution sur le port 80</h3>
	<p>
		Les utilisateurs normaux ne peuvent pas lier le port 80. Exécutez avec <code>sudo</code> ou utilisez un port plus élevé comme 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Exemple : exécution sur le port 8080 (accessible aux utilisateurs normaux ; changez d’abord le port dans la configuration)."
	/>

	<Callout type="tip" title="Suivant">
		nostrfy est installé. Suivez le <a href={p('/docs/quick-start/')}>démarrage rapide</a>.
	</Callout>
</div>
