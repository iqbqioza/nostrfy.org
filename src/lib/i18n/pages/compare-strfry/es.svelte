<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const rows: { label: string; nostrfy: string; strfry: string }[] = [
		{ label: 'Lenguaje', nostrfy: 'Rust', strfry: 'C++' },
		{ label: 'Licencia', nostrfy: 'MIT o Apache-2.0', strfry: 'GPL-3.0' },
		{ label: 'Almacenamiento', nostrfy: 'LMDB (sin base de datos externa)', strfry: 'LMDB (sin base de datos externa)' },
		{ label: 'Configuración', nostrfy: 'Un solo nostrfy.toml, recarga en caliente (SIGHUP)', strfry: 'strfry.conf, recarga en caliente' },
		{ label: 'NIP anunciados', nostrfy: '34 (36 implementados, incl. opcionales)', strfry: '11 NIP principales' },
		{ label: 'Grupos NIP-29 + LiveKit', nostrfy: 'Integrado', strfry: '—' },
		{ label: 'Servidor de medios Blossom', nostrfy: 'Integrado (disco local o S3/R2)', strfry: '—' },
		{ label: 'REST API', nostrfy: '/api/v1 integrado', strfry: '—' },
		{ label: 'API de gestión', nostrfy: 'NIP-86 JSON-RPC con administradores delegados', strfry: '—' },
		{ label: 'Negentropy (NIP-77)', nostrfy: 'Sí', strfry: 'Sí — strfry lo originó' },
		{ label: 'Políticas de escritura / plugins', nostrfy: 'Listas allow/deny integradas + NIP-86', strfry: 'Interfaz de plugins write-policy' },
		{ label: 'Herramienta de migración', nostrfy: 'nostrfy migrate-strfry', strfry: 'strfry import / export / sync' }
	];

	const base = 'https://nostrfy.org';
	const pageJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'nostrfy vs strfry',
		url: `${base}/es/compare/strfry/`,
		description:
			'Una comparación honesta de nostrfy y strfry para relés Nostr autoalojados — funciones, licencias, operación y cómo migrar desde strfry con un solo comando.',
		inLanguage: 'es',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` }
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${pageJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="nostrfy vs strfry: comparación de relés Nostr"
	description="Una comparación honesta de nostrfy y strfry para relés Nostr autoalojados — funciones, licencias, operación y cómo migrar desde strfry con un solo comando."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-4xl px-4 pb-20 pt-16 sm:px-6">
		<p class="text-xs font-medium uppercase tracking-wider text-zinc-500">Comparación</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">nostrfy vs strfry</h1>
		<p class="mt-4 max-w-3xl text-[15px] leading-relaxed text-zinc-400">
			Ambos son relés Nostr de un solo binario, guardan los eventos en LMDB y hablan el mismo protocolo. Pero toman decisiones distintas:
			<strong class="text-zinc-200">strfry</strong> es el relé C++ maduro con sistema de plugins write-policy, mientras que
			<strong class="text-zinc-200">nostrfy</strong> es un motor escrito en Rust que reúne las funciones que necesita el operador — grupos, medios, REST, gestión — en un binario y un archivo de configuración.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">De un vistazo</h2>
		<div class="mt-5 overflow-x-auto">
			<table>
				<thead>
					<tr>
						<th></th>
						<th>nostrfy</th>
						<th>strfry</th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.label)}
						<tr>
							<td class="text-zinc-500">{row.label}</td>
							<td class="text-zinc-200">{row.nostrfy}</td>
							<td class="text-zinc-400">{row.strfry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Licencia</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry está bajo <strong class="text-zinc-200">GPL-3.0</strong>, que exige que las obras derivadas se publiquen bajo los mismos términos. nostrfy tiene doble licencia <strong class="text-zinc-200">MIT o Apache-2.0</strong>, por lo que puede integrarse en productos de código cerrado y relicenciarse libremente. Si tu relé forma parte de una pila comercial o con licencia, esto suele ser la diferencia decisiva.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Configuración y operación</h2>
		<ul class="mt-3 space-y-3 text-[15px] leading-relaxed text-zinc-400">
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					nostrfy se configura mediante un único <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy.toml</code
					>: identidad, límites, almacenamiento, control de acceso, Blossom y RPC en un solo lugar. La mayoría de los ajustes se recargan en caliente con SIGHUP.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					Cada opción la valida <code
						class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300">nostrfy check</code
					> antes de arrancar el relé — tipos erróneos, límites imposibles y combinaciones que bloquean el acceso se reportan con correcciones.
				</span>
			</li>
			<li class="flex gap-3">
				<Icon name="check" size={16} class="mt-1 shrink-0 text-accent-400" />
				<span>
					El demonio incluye rotación de registros, estadísticas en vivo, un endpoint de comprobación de estado y métricas Prometheus; la CLI gestiona listas de acceso, actualizaciones y migraciones.
				</span>
			</li>
		</ul>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Funciones integradas</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			En lugar de añadir servicios auxiliares, nostrfy incorpora lo que un relé público suele necesitar:
		</p>
		<div class="mt-5 grid gap-4 sm:grid-cols-2">
			{#each [
				['network', 'Grupos NIP-29 + LiveKit', 'Grupos impuestos por el relé, eventos de moderación y metadatos de grupo firmados por el relé, además de salas de audio/vídeo vía LiveKit.'],
				['database', 'Servidor de medios Blossom', 'Las subidas direccionadas por contenido se ejecutan en su propio nombre de host, en disco local o en un bucket compatible con S3 (AWS S3, Cloudflare R2).'],
				['server', 'REST API', 'API /api/v1 de solo lectura en su propio hilo de lectura: consulta eventos por npub, nevent o naddr, con recuentos, estadísticas y búsqueda.'],
				['lock', 'Gestión NIP-86', 'API de gestión JSON-RPC con autenticación Bearer o NIP-98, concesiones de métodos delegadas y códigos de invitación.']
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

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Donde strfry destaca</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			strfry sigue siendo una excelente opción: originó el protocolo negentropy, admite reinicios sin tiempo de inactividad y compresión WebSocket opcional, y su interfaz de plugins write-policy permite ejecutar lógica arbitraria en cada publicación. Si necesitas un entorno aislado (sandbox) de plugins y nada más de esta lista, strfry es ideal. Si prefieres grupos, medios, REST y gestión integrados — o necesitas una licencia permisiva — nostrfy es el camino más corto.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-tight">Migrar desde strfry</h2>
		<p class="mt-3 text-[15px] leading-relaxed text-zinc-400">
			No tienes que empezar de cero. <code
				class="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[13px] text-accent-300"
				>nostrfy migrate-strfry</code
			> lee el propio formato de exportación de strfry, verifica cada evento e importa toda la base de datos — incluidas las eliminaciones NIP-09, los efectos secundarios de moderación NIP-29 y las marcas de primera aparición. Es offline, admite dry-run y es seguro de repetir.
		</p>

		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/migrating-from-strfry/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Leer la guía de migración <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				Inicio rápido <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={p('/docs/nips/')}
				class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-100"
			>
				Referencia completa de NIP
			</a>
		</div>
	</div>
</div>
