<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const health = 'curl http://127.0.0.1:8080/health';
	const niip11 = `curl -H "Accept: application/nostr+json" http://127.0.0.1:8080/`;
</script>

<DocsTitle
	title="Знакомство с nostrfy"
	description="Что такое nostrfy, что он умеет из коробки и какие идеи лежат в основе универсального движка Nostr-релея на Rust."
/>

<div class="doc-body">
	<p>
		<strong>nostrfy</strong> — сервер релея для протокола
		<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer">Nostr</a>. Он хранит события (посты, реакции, профили…), отправленные клиентами, и доставляет их в ответ на запросы по подпискам.
	</p>

	<h2>Ключевые возможности</h2>
	<ul>
		<li><strong>Простой и стабильный</strong>  — написан на Rust; один бинарник делает всё.</li>
		<li>
			<strong>Быстрое хранилище и поиск</strong>  — база LMDB с индексом полнотекстового поиска (NIP-50).
		</li>
		<li>
			<strong>Широкая поддержка NIP</strong>  — реализовано 36 NIP плюс файловый сервер Blossom: удаление, proof-of-work, делегирование, группы, поиск и API управления.
		</li>
		<li>
			<strong>Прост в эксплуатации</strong>  — режим демона, ротация логов, горячая перезагрузка конфигурации (SIGHUP), живая статистика, REST API и метрики Prometheus.
		</li>
		<li>
			<strong>Лёгкая миграция</strong>  — одна команда импортирует существующую
			<a href="https://github.com/hoytech/strfry" target="_blank" rel="noopener noreferrer">strfry</a>
			базы данных: dry-run, объединение настроек и безопасные повторные запуски (<a href={p('/docs/migrating-from-strfry/')}>руководство по миграции</a>).
		</li>
	</ul>

	<h2>Что вы получаете из коробки</h2>
	<p>
		Один бинарник <code>nostrfy</code> на одном порту предоставляет:
	</p>
	<ul>
		<li><strong>WebSocket-релей</strong> и информационный документ NIP-11.</li>
		<li>Доступный только для чтения <strong>REST API</strong>, расположенный по адресу <code>/api/v1/...</code> — отдельный поток чтения гарантирует, что REST-трафик никогда не задержит WebSocket-подписчиков.</li>
		<li><strong>файловый сервер Blossom</strong> (размещение медиа) на отдельном домене.</li>
		<li><strong>RPC управления NIP-86</strong>, проверка работоспособности и метрики Prometheus <code>/metrics</code>.</li>
	</ul>

	<h2>Потребление ресурсов</h2>
	<p>
		Проверено, что nostrfy работает на <strong>0.25 vCPU / 512 MB VPS</strong>. Карта памяти LMDB — разреженная виртуальная резервация на 1 TiB, физический диск растёт только с реальными данными, а память процесса остаётся стабильной: релей с базой 252 MB занимал <strong>7.9 MB приватного RSS</strong>.
	</p>

	<h2>Быстрое знакомство</h2>
	<p>Три команды — установка, инициализация и запуск:</p>
	<CodeBlock
		code={`curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh
nostrfy --config nostrfy.toml init
nostrfy --config nostrfy.toml start`}
		lang="bash"
	/>
	<p>Затем убедитесь, что релей запущен:</p>
	<CodeBlock code={health} lang="bash" />
	<p>И получите его документ NIP-11:</p>
	<CodeBlock code={niip11} lang="bash" />

	<Callout type="tip" title="Что дальше">
		Начните с <a href={p('/docs/quick-start/')}>быстрого старта</a> для первого запуска или сразу перейдите к
		<a href={p('/docs/configuration/')}>справочнику по конфигурации</a>, чтобы настроить релей.
	</Callout>
</div>
