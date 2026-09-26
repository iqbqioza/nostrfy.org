<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';

	const support = 'curl -i http://127.0.0.1:8080/.well-known/nip29/livekit';
	const config = `[relay]
livekit_url = "wss://livekit.example.com"
livekit_api_key = "..."
livekit_api_secret = "..."`;
</script>

<DocsTitle
	title="Аудио- и видеокомнаты LiveKit"
	description="Аудио- и видеокомнаты для групп NIP-29 через сервер LiveKit: конечные точки токенов, подпись JWT и метаданные группы, рекламирующие комнаты."
/>

<div class="doc-body">
	<h2>Настройка</h2>
	<ol>
		<li>
			Задайте <code>relay.livekit_url</code>, <code>relay.livekit_api_key</code> и
			<code>relay.livekit_api_secret</code> в файле конфигурации.
		</li>
		<li>
			Добавьте тег <code>livekit</code> в метаданные группы через правку
			<code>kind:9002</code> от имени администратора.
		</li>
		<li>
			Клиенты получают JWT из <code>/.well-known/nip29/livekit/&lt;group-id&gt;</code> с аутентификацией NIP-98
			(публичный ключ, заблокированный через <code>banpubkey</code> по NIP-86, отклоняется).
		</li>
	</ol>

	<h2>Проверка поддержки</h2>
	<CodeBlock
		code={support}
		lang="bash"
		caption="204 означает, что сервер комнат включён."
	/>

	<h3>Конфигурация</h3>
	<CodeBlock code={config} lang="toml" />

	<Callout type="tip">
		Настройки LiveKit фиксируются при запуске — их изменение требует перезапуска.
	</Callout>
</div>
