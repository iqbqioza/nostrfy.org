<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import CopyButton from '$lib/components/CopyButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site, installVariants, clients } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const installLabels: Record<string, string> = {
		'Specific version': 'Versión específica',
		'System-wide': 'Instalar en todo el sistema',
		'Overwrite existing': 'Sobrescribir el existente',
		'Build from source': 'Compilar desde el código fuente'
	};

	const clientText: Record<string, { tagline: string; quote: string }> = {
		Ditto: {
			tagline: 'Cliente social Nostr de código abierto',
			quote:
				'Ditto realmente usa estos NIP — búsqueda NIP-50, comentarios en hilo NIP-22, zaps NIP-57, medios NIP-94 y estadísticas NIP-85 son parte de su día a día — y cada uno corresponde a una función del relé nostrfy.'
		},
		Nostrich: {
			tagline: 'Cliente Nostr gratuito para web, iOS, Android y Mac',
			quote:
				'Un cliente completo que realmente usa estos NIP — búsqueda NIP-50, mensajes privados NIP-17/59, zaps NIP-57, encuestas NIP-88 y medios Blossom funcionan con tu relé.'
		}
	};

	const displayClients = clients.map((client) => ({
		...client,
		...(clientText[client.name] ?? {})
	}));

	const features = [
		{
			icon: 'layers',
			title: 'Totalmente conforme',
			body: 'Todos los NIP del lado del relé implementados y verificados contra las especificaciones oficiales — más de 36 NIP y el servidor de archivos Blossom.'
		},
		{
			icon: 'shield',
			title: 'Nunca se cae',
			body: 'La protección contra sobrecarga, los hilos de lectura dedicados, el aislamiento de pánicos y los límites estrictos de recursos mantienen el relé en servicio bajo abuso sostenido.'
		},
		{
			icon: 'server',
			title: 'Servidor de medios Blossom',
			body: 'Subidas direccionadas por SHA-256 en su propio nombre de host — disco local o buckets compatibles con S3 (AWS S3, Cloudflare R2), con borrado firmado por el propietario.'
		},
		{
			icon: 'database',
			title: 'REST API',
			body: 'Una API /api/v1 de solo lectura para consultar eventos por npub1, nevent1 o naddr1 — su propio hilo de lectura hace que el tráfico REST nunca bloquee a los suscriptores WebSocket.'
		},
		{
			icon: 'database',
			title: 'Persistencia LMDB',
			body: 'Almacenamiento duradero y a prueba de fallos mediante heed. El mapa de memoria se reserva de forma dispersa hasta su límite — sin redimensionado en caliente y con un consumo físico mínimo.'
		},
		{
			icon: 'wrench',
			title: 'Todo configurable',
			body: 'Todos los ajustes están en nostrfy.toml — sin opciones de compilación. Edita, SIGHUP, listo. Límites, interruptores de NIP, almacenamiento y más.'
		},
		{
			icon: 'network',
			title: 'Funciona tras proxies TLS',
			body: 'nginx, Caddy, Cloudflare Tunnel — se respetan las actualizaciones WebSocket y X-Forwarded-Proto, así que wss:// funciona detrás de cualquier proxy.'
		},
		{
			icon: 'cpu',
			title: 'Rust + FreeBSD',
			body: 'Un único binario Rust estático para Linux x86_64, Linux aarch64 y FreeBSD x86_64 — verificado en un VPS de 0,25 vCPU / 512 MB.'
		}
	];

	const benchmarks = [
		{ value: '~21k', label: 'eventos/s de entrada', note: 'una conexión' },
		{ value: '100%', label: 'Distribución en vivo', note: '10.000 / 10.000 entregas' },
		{ value: '0,32s', label: 'consulta almacenada', note: '20.000 eventos' },
		{ value: '0,26s', label: 'búsqueda NIP-50', note: '10.000 resultados' },
		{ value: '7,9 MB', label: 'RSS privado', note: 'con una base de 252 MB' }
	];

	const nips = [
		'1', '9', '11', '13', '17', '22', '26', '28', '29', '32', '33', '34', '40', '42', '43',
		'45', '46', '47', '50', '57', '59', '62', '65', '66', '67', '70', '77', '78', '84', '85',
		'86', '87', '88', '94', '98', 'A3', 'Blossom'
	];

	const softwareJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: 'nostrfy',
		description:
			'Motor de servidor de relé Nostr todo en uno escrito en Rust. Totalmente conforme a las especificaciones, hecho para no caerse nunca y configurable desde nostrfy.toml.',
		url: 'https://nostrfy.org/',
		applicationCategory: 'DeveloperApplication',
		operatingSystem: 'Linux, FreeBSD',
		license: ['https://opensource.org/licenses/MIT', 'https://www.apache.org/licenses/LICENSE-2.0'],
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		softwareVersion: '0.1.16',
		installUrl: 'https://nostrfy.org/es/docs/quick-start/',
		screenshot: 'https://nostrfy.org/og-image.png',
		inLanguage: 'es'
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${softwareJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="El relé Nostr que nunca se cae"
	description="nostrfy es un motor de servidor de relé Nostr todo en uno escrito en Rust. Totalmente conforme a las especificaciones, hecho para no caerse nunca y configurable desde nostrfy.toml."
/>

<!-- ===== Hero ===== -->
<section class="relative overflow-hidden">
	<div class="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true"></div>
	<div
		class="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent-500/15 blur-[120px]"
		aria-hidden="true"
	></div>

	<div class="relative mx-auto max-w-6xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-24">
		<img
			src="/logo.png"
			width={220}
			height={220}
			alt=""
			class="mx-auto rounded-[2.5rem]"
		/>
		<div
			class="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-1.5 text-xs text-zinc-400"
		>
			<span class="h-1.5 w-1.5 rounded-full bg-accent-400" aria-hidden="true"></span>
			<span>
				Rust · MIT o Apache-2.0 · última versión
				<a href={`${site.github}/releases`} target="_blank" rel="noopener noreferrer" class="font-semibold text-accent-300 hover:text-accent-200">
					{site.latestRelease}
				</a>
			</span>
		</div>

		<h1 class="mx-auto mt-7 max-w-3xl text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
			El relé Nostr que
			<span class="text-accent-gradient">nunca se cae.</span>
		</h1>

		<p class="mx-auto mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg">
			<strong class="text-zinc-200">nostrfy</strong> es un motor de servidor de relé Nostr todo en uno. Rápido por diseño, ligero por naturaleza, potente por defecto. Instalación en una línea, configuración en un solo archivo TOML y ejecución en prácticamente cualquier VPS.
		</p>

		<div class="mt-9 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} />
				Instalar nostrfy
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
			>
				Inicio rápido
				<Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={17} />
				Ver el código fuente
			</a>
		</div>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
			<span class="inline-flex items-center gap-1.5">
				<Icon name="circle-check" size={15} class="text-emerald-400" /> más de 36 NIP del lado del relé
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="cpu" size={15} class="text-accent-400" /> Linux · FreeBSD · contenedores
			</span>
			<span class="inline-flex items-center gap-1.5">
				<Icon name="box" size={15} class="text-sky-400" /> Un binario, sin dependencias
			</span>
		</div>
	</div>
</section>

<!-- ===== Live relays ===== -->
<section class="relative border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
		<div class="mx-auto flex max-w-6xl justify-center">
			{#each site.relays as relay (relay.url)}
				<div class="flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-line bg-bg/60 p-5">
					<div class="min-w-0">
						<div class="flex items-center gap-2">
							<span class="h-2 w-2 shrink-0 animate-pulse rounded-full bg-emerald-400" aria-hidden="true"></span>
							<span class="text-xs font-medium uppercase tracking-wider text-zinc-500">Relé activo</span>
						</div>
						<a
							href={relay.url}
							class="mt-1.5 block truncate font-mono text-sm text-zinc-100 hover:text-accent-300"
						>
							{relay.url}
						</a>
					</div>
					<CopyButton text={relay.url} label="Copiar la URL del relé" showLabel={false} size={16} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Install ===== -->
<section id="install" class="relative scroll-mt-24">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Instalación en una línea</h2>
			<p class="mt-3 text-zinc-400">
				El script de instalación detecta tu sistema operativo y arquitectura, descarga el binario precompilado correspondiente, verifica su suma SHA-256 y lo coloca en tu <code class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">PATH</code>. Sin clonar, sin compilar y sin sudo.
			</p>
		</div>

		<div class="mt-8">
			<CodeBlock code={site.installCommand} lang="bash" />
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-3">
			{#each [
				['terminal', 'sin sudo', 'Se instala en ~/.local/bin, ~/bin o ~/.cargo/bin — el primero que ya esté en el PATH.'],
				['cpu', 'Linux + FreeBSD', 'Binarios precompilados para Linux x86_64 y aarch64, además de FreeBSD x86_64.'],
				['wrench', 'Suma de comprobación verificada', 'La suma de comprobación de la versión se obtiene y verifica antes de que el binario toque el disco.']
			] as [icon, title, body] (title)}
				<div class="rounded-xl border border-line bg-surface/50 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-zinc-500">{body}</p>
				</div>
			{/each}
		</div>

		<div class="mt-8 grid gap-3 md:grid-cols-2">
			{#each installVariants as variant (variant.title)}
				<div class="min-w-0">
					<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{installLabels[variant.title] ?? variant.title}</div>
					<CodeBlock code={variant.command} lang="bash" />
				</div>
			{/each}
		</div>

		<div class="mt-8 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-surface/50 p-5 sm:flex-row sm:items-center">
			<div class="flex items-start gap-3">
				<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg">
					<Icon name="database" size={17} class="text-accent-400" />
				</div>
				<div>
					<h3 class="text-sm font-semibold text-zinc-100">¿Migras desde strfry?</h3>
					<p class="mt-1 text-sm text-zinc-500">
						Trae tus eventos existentes con un solo comando — sin conexión, verificado y seguro de repetir.
					</p>
				</div>
			</div>
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Guía de migración <Icon name="arrow-right" size={15} />
			</a>
		</div>
	</div>
</section>

<!-- ===== Quick start ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="grid items-center gap-12 lg:grid-cols-2">
			<div>
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
					En marcha en menos de un minuto
				</h2>
				<p class="mt-3 leading-relaxed text-zinc-400">
					nostrfy incluye un demonio, un validador de configuración, estadísticas en vivo, rotación de registros y recarga en caliente — todo lo que necesita un operador, en un solo binario.
				</p>
				<ul class="mt-6 space-y-3">
					{#each [
						'nostrfy init escribe un nostrfy.toml predeterminado con todos los comentarios',
						'nostrfy check valida la configuración antes de arrancar',
						'SIGHUP recarga la mayoría de los ajustes sin reiniciar',
						'nostrfy upgrade actualiza el binario a la última versión'
					] as line (line)}
						<li class="flex gap-3 text-sm text-zinc-300">
							<Icon name="check" size={16} class="mt-0.5 shrink-0 text-accent-400" />
							{line}
						</li>
					{/each}
				</ul>
				<a
					href={p('/docs/quick-start/')}
					class="mt-8 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-line-2 hover:text-white"
				>
					Abrir la guía de inicio
					<Icon name="arrow-right" size={16} />
				</a>
			</div>

			<div class="space-y-4">
				<CodeBlock code={'nostrfy init\n# escribe un nostrfy.toml predeterminado y sale'} lang="bash" />
				<CodeBlock code={'nostrfy start\n# ejecuta el relé como demonio'} lang="bash" />
				<CodeBlock code={'nostrfy stats\n# conexiones, eventos, tamaño de la base'} lang="bash" />
				<CodeBlock
					code={'curl http://localhost:8080/health\n# {"status":"ok"}'}
					lang="bash"
					caption="Apunta tu cliente Nostr a ws://<host>:8080 — listo."
				/>
			</div>
		</div>
	</div>
</section>

<!-- ===== Features ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Para relés en producción</h2>
			<p class="mt-3 text-zinc-400">
				Cada función responde a dos objetivos: nunca caerse y ser totalmente conforme a las especificaciones. El resultado es un relé que sobrevive a abusos, discos bloqueados y hosts con poca memoria.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each features as feature (feature.title)}
				<div class="group rounded-xl border border-line bg-surface/50 p-5 transition-colors hover:border-line-2">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg transition-colors group-hover:border-accent-500/40">
						<Icon name={feature.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{feature.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{feature.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Performance ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">Rendimiento medido</h2>
		<p class="mx-auto mt-3 max-w-2xl text-center text-zinc-400">
			Compilación release, base de datos nueva, portátil de 8 hilos. La velocidad de escritura está limitada por un único hilo escritor de LMDB y confirmaciones por lotes sin fsync; los lectores nunca lo bloquean.
		</p>
		<div class="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
			{#each benchmarks as b (b.label)}
				<div class="rounded-xl border border-line bg-bg/60 p-5 text-center">
					<div class="text-2xl font-bold tracking-tight text-accent-300">{b.value}</div>
					<div class="mt-1 text-xs font-medium text-zinc-300">{b.label}</div>
					<div class="mt-0.5 text-[11px] text-zinc-600">{b.note}</div>
				</div>
			{/each}
		</div>
		<p class="mt-6 text-center text-xs text-zinc-600">
			Reproducible con los benchmarks incluidos — consulta
			<a href={p('/docs/operation/#throughput')} class="text-zinc-400 hover:text-accent-300">notas de rendimiento</a>.
		</p>
	</div>
</section>

<!-- ===== NIPs ===== -->
<section class="relative">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
			<div class="max-w-2xl">
				<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Compatibilidad completa con NIP según la especificación</h2>
				<p class="mt-3 text-zinc-400">
					Todos los NIP del lado del relé están implementados y verificados. La lista publicada en NIP-11 es dinámica — un NIP desaparece automáticamente cuando se bloquean sus kinds.
				</p>
			</div>
			<a
				href={p('/docs/nips/')}
				class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent-300 hover:text-accent-200"
			>
				Referencia completa de NIP <Icon name="arrow-right" size={15} />
			</a>
		</div>

		<div class="mt-8 flex flex-wrap gap-2">
			{#each nips as nip (nip)}
				<span class="rounded-lg border border-line bg-surface/50 px-3 py-1.5 font-mono text-xs text-zinc-300">
					{nip}
				</span>
			{/each}
		</div>
	</div>
</section>

<!-- ===== Clients ===== -->
<section class="border-y border-line/70 bg-surface/30">
	<div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight sm:text-3xl">Un ecosistema de grandes clientes</h2>
			<p class="mt-3 leading-relaxed text-zinc-400">
				nostrfy habla los estándares NIP abiertos en los que confían los clientes — las mejores aplicaciones Nostr se conectan y obtienen la experiencia completa. Cualquier cliente compatible con NIP funciona con tu relé.
			</p>
		</div>

		<div class="mt-10 grid gap-4 md:grid-cols-2">
			{#each displayClients as client (client.name)}
				<a
					href={client.url}
					target="_blank"
					rel="noopener noreferrer"
					class="group rounded-xl border border-line bg-bg/60 p-5 transition-colors hover:border-line-2"
				>
					<div class="flex items-center gap-3">
						{#if client.icon}
							<img
								src={client.icon}
								alt=""
								width={40}
								height={40}
								class="rounded-lg"
								loading="lazy"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface-2 text-sm font-semibold text-accent-300"
							>
								{client.name.charAt(0)}
							</div>
						{/if}
						<div class="min-w-0">
							<div class="flex items-center gap-1.5 text-sm font-semibold text-zinc-100 group-hover:text-white">
								{client.name}
								<Icon name="arrow-up-right" size={13} class="text-zinc-500 group-hover:text-accent-300" />
							</div>
							<div class="truncate text-xs text-zinc-500">{client.tagline}</div>
						</div>
					</div>
					<p class="mt-3 text-sm leading-relaxed text-zinc-500">{client.quote}</p>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each client.features as feature (feature)}
							<span
								class="rounded-md border border-line bg-surface/50 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
								{feature}
							</span>
						{/each}
					</div>
				</a>
			{/each}
		</div>

		<p class="mt-6 text-center text-xs text-zinc-600">
			¿Desarrollas en Nostr? Apunta cualquier cliente a tu relé — consulta
			<a href={p('/docs/nips/')} class="text-zinc-400 hover:text-accent-300">Referencia completa de NIP</a>.
		</p>
	</div>
</section>

<!-- ===== CTA ===== -->
<section class="relative overflow-hidden">
	<div
		class="absolute inset-x-0 bottom-0 h-72 bg-accent-500/10 blur-[100px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-6xl px-4 pb-24 pt-8 text-center sm:px-6">
		<h2 class="mx-auto max-w-xl text-balance text-3xl font-bold tracking-tight">
			Ejecuta tu propio relé en minutos
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-zinc-400">
			Desde el VPS más pequeño hasta una flota global — el binario precompilado, el validador de configuración y las guías de despliegue lo hacen indoloro.
		</p>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<a
				href="#install"
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				<Icon name="terminal" size={17} /> Instalar ahora
			</a>
			<a
				href={p('/docs/deploy/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Guías de despliegue <Icon name="arrow-right" size={16} />
			</a>
			<a href={p('/donate/')} class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100">
				<Icon name="heart" size={16} class="text-accent-400" /> Apoyar el desarrollo
			</a>
		</div>
		<p class="mt-6 text-sm text-zinc-500">
			¿Preguntas? <a href={p('/faq/')} class="text-zinc-300 hover:text-accent-300">FAQ</a> o <a href={p('/compare/strfry/')} class="text-zinc-300 hover:text-accent-300">la comparación entre nostrfy y strfry</a> — y <a href={p('/docs/migrating-from-strfry/')} class="text-zinc-300 hover:text-accent-300">migra con un solo comando</a>.
		</p>
	</div>
</section>
