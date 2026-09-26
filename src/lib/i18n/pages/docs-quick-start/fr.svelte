<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('fr', path);

	const initCmd = `nostrfy --config nostrfy.toml init`;
	const checkCmd = `nostrfy --config nostrfy.toml check`;
	const startCmd = `nostrfy --config nostrfy.toml start`;
	const healthCmd = `curl http://127.0.0.1:8080/health`;
	const serverHost = `[server]
host = "0.0.0.0"`;
	const stopRestart = `nostrfy --config nostrfy.toml stop
nostrfy --config nostrfy.toml restart
kill -HUP $(cat nostrfy.pid)  # rechargez la configuration sans redémarrage`;
</script>

<DocsTitle
	title="Guide de démarrage rapide"
	description="De l’installation à un relais Nostr en marche en quelques minutes : écrivez la configuration, validez-la, démarrez le démon et lancez le premier contrôle de santé."
/>

<div class="doc-body">
	<h2>1. Créer une configuration</h2>
	<p>
		<code>nostrfy init</code> écrit un <code>nostrfy.toml</code> par défaut entièrement commenté :
	</p>
	<CodeBlock code={initCmd} lang="bash" />
	<p>Ouvrez-le dans un éditeur de texte et ajustez-le — chaque option est commentée.</p>

	<h2>2. Valider la configuration</h2>
	<p>
		<code>nostrfy check</code> est fortement recommandé avant de démarrer ; en cas de problème, il indique précisément quoi corriger.
	</p>
	<CodeBlock code={checkCmd} lang="bash" />

	<h2>3. Démarrer le relais</h2>
	<CodeBlock
		code={startCmd}
		lang="bash"
		caption="S’exécute comme démon. Ajoutez --foreground pour rester dans le terminal."
	/>
	<p>Vérifiez ensuite que le relais est en marche avec le contrôle de santé :</p>
	<CodeBlock code={healthCmd} lang="bash" caption={'=> {"status":"ok"}'} />

	<h2>4. Pointer un client vers lui</h2>
	<p>
		Sur la même machine, connectez-vous à <code>ws://&lt;host&gt;:8080</code>. L’hôte par défaut est
		<code>127.0.0.1</code>, qui n’accepte que les connexions locales. Pour joindre le relais depuis d’autres machines, définissez dans la configuration <code>server.host = "0.0.0.0"</code> :
	</p>
	<CodeBlock code={serverHost} lang="toml" />
	<p>
		Pour <code>wss://</code>, il faut un proxy terminant le TLS (nginx ou Caddy) devant — voir la documentation sur le
		<a href={p('/docs/deploy/')}>déploiement</a>.
	</p>

	<h2>5. Arrêt et redémarrage</h2>
	<CodeBlock
		code={stopRestart}
		lang="bash"
		caption="restart relit la configuration ; SIGHUP recharge la plupart des réglages sans redémarrage."
	/>

	<h2>Exploitation efficace</h2>
	<ul>
		<li>
			<code>nostrfy stats</code> affiche les statistiques en direct — aussi via HTTP à
			<code>/relay/stats</code> et <code>/metrics</code>.
		</li>
		<li>Le journal est écrit dans <code>daemon.log_file</code> avec rotation automatique.</li>
		<li>
			<code>RUST_LOG</code> contrôle le niveau de journalisation (par ex. <code>RUST_LOG=nostrfy=debug</code>).
		</li>
	</ul>

	<Callout type="warning" title="Les clients externes ne peuvent pas se connecter ?">
		server.host vaut 127.0.0.1 par défaut. Définissez host = "0.0.0.0" et redémarrez.
	</Callout>

	<Callout type="tip" title="Suivant">
		Réglez tous les aspects du relais dans la <a href={p('/docs/configuration/')}>référence de configuration</a>.
	</Callout>
</div>
