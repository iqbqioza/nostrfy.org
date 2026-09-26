<script lang="ts">
	import DocsTitle from '$lib/components/docs/DocsTitle.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Callout from '$lib/components/Callout.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('ru', path);

	const lowSpecConfig = `[database]
search_index = false   # вдвое уменьшает размер базы данных и экономит CPU/IO`;
	const buildSource = `git clone https://github.com/iqbqioza/nostrfy.git
cd nostrfy
cargo build --release`;
	const installScript = `curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh`;
	const freebsdBuild = `pkg install -y rust
cargo build --release`;
	const port80Run = `nostrfy --config nostrfy.toml start`;
</script>

<DocsTitle
	title="Руководство по установке"
	description="Требования, сборка из исходников, установка готового бинарника, проверка контрольных сумм и заметки о запуске nostrfy на FreeBSD."
/>

<div class="doc-body">
	<h2>Требования</h2>
	<ul>
		<li>Свежий стабильный инструментарий Rust (нужен только для сборки релея).</li>
		<li>Машина с Linux.</li>
		<li>Рекомендуется 2 GB RAM или больше — для VPS 0.25 vCPU / 512 MB см. заметку о малых ресурсах ниже.</li>
	</ul>

	<h3>VPS с малыми ресурсами (0.25 vCPU / 512 MB)</h3>
	<p>
		nostrfy проверен на стабильную работу даже когда база превышает объём памяти. Карта LMDB — это
		<strong>разреженная виртуальная резервация на 1 TiB</strong> — физический диск растёт только с записанными данными — а память процесса остаётся стабильной: релей с базой 252 MB использовал <strong>7.9 MB приватного RSS</strong>
		(остальное — освобождаемый файловый кэш, который ядро вытесняет под давлением).
	</p>
	<p>Для крошечного VPS одна настройка даёт наибольший эффект:</p>
	<CodeBlock code={lowSpecConfig} lang="toml" />
		<div class="overflow-x-auto">
		<table>
		<thead>
			<tr>
				<th>Настройка</th>
				<th>Эффект</th>
				<th>Измерено</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><code>search_index = false</code></td>
				<td>
					Отключает индекс слов NIP-50 — поиск продолжает работать (совпадение по словам), но медленнее
				</td>
				<td>41.8 MB → 20.5 MB на 10 000 событий</td>
			</tr>
			<tr>
				<td>По умолчанию</td>
				<td>Уже оптимизировано под малый объём памяти</td>
				<td>Для 512 MB изменений не требуется</td>
			</tr>
		</tbody>
	</table>
	</div>

	<h2>Сборка из исходников</h2>
	<CodeBlock code={buildSource} lang="bash" />
	<p>После сборки бинарник находится в <code>target/release/nostrfy</code>.</p>

	<h2>Установка готового бинарника</h2>
	<p>
		Релизный процесс прилагает <strong>Linux x86_64</strong>, <strong>Linux aarch64</strong> и
		<strong>FreeBSD x86_64</strong>  готовые бинарники. Тот же
		<code>install.sh</code>  работает в обеих ОС — определяет платформу, скачивает подходящий бинарник и проверяет его контрольную сумму:
	</p>
	<CodeBlock code={installScript} lang="bash" />

	<h3>FreeBSD</h3>
	<p>nostrfy собирается и работает на FreeBSD 13.x и 14.x (amd64). Установите Rust и соберите:</p>
	<CodeBlock code={freebsdBuild} lang="sh" />
	<p>Заметки о платформе:</p>
	<ul>
		<li>
			Проверка живости процесса, используемая командами
			<code>start</code>/<code>stop</code>/<code>restart</code>, читает имя процесса через
			<code>kern.proc.pid.&lt;pid&gt;.comm</code> sysctl (в Linux используется
			<code>/proc/&lt;pid&gt;/comm</code>), поэтому на обеих платформах обнаруживается устаревший pid-файл, чей pid был переиспользован другой программой.
		</li>
		<li>
			<code>nostrfy start</code> запускается как демон, как в Linux; стандартный демон с двойным fork работает со стандартной
			<code>rc</code>-интеграцией (<code>service nostrfy start</code>).
		</li>
		<li>
			Проверка Blossom <code>min_free_bytes</code> использует <code>statvfs</code>, которую предоставляют обе системы; другого платформенного кода нет (сам релей — обычный асинхронный Rust на tokio).
		</li>
	</ul>

	<h3>Запуск на порту 80</h3>
	<p>
		Обычные пользователи не могут занять порт 80. Запустите через <code>sudo</code> или используйте более высокий порт, например 8080.
	</p>
	<CodeBlock
		code={port80Run}
		lang="bash"
		caption="Пример: запуск на порту 8080 (доступно обычным пользователям; сначала измените порт в конфигурации)."
	/>

	<Callout type="tip" title="Далее">
		nostrfy установлен. Следуйте <a href={p('/docs/quick-start/')}>быстрому старту</a>.
	</Callout>
</div>
