<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';
	import { localePath } from '$lib/i18n/locale';

	const p = (path: string) => localePath('es', path);

	const faqs = [
		{
			q: '¿Qué es nostrfy?',
			a: 'nostrfy es un motor de servidor de relé Nostr todo en uno escrito en Rust. Almacena eventos de clientes Nostr y los entrega en respuesta a suscripciones, implementando todos los NIP del lado del relé, más un servidor de medios Blossom opcional, una API REST de solo lectura y una API de gestión NIP-86 — todo en un solo binario.'
		},
		{
			q: '¿nostrfy es gratis y de código abierto?',
			a: 'Sí. nostrfy es software libre, con doble licencia MIT o Apache-2.0, a tu elección. El código fuente está en GitHub y no hay niveles de pago, telemetría ni dependencia forzada.'
		},
		{
			q: '¿Qué necesito para ejecutar nostrfy?',
			a: 'Un único binario estático se ejecuta en Linux (x86_64 y aarch64) y FreeBSD (x86_64). Se ha verificado en un VPS de 0,25 vCPU / 512 MB. El almacenamiento es una base LMDB local: no se necesita ningún servidor de base de datos externo.'
		},
		{
			q: '¿Cómo instalo nostrfy?',
			a: 'Una línea: curl -fsSL https://raw.githubusercontent.com/iqbqioza/nostrfy/main/install.sh | sh. El script detecta tu sistema operativo y arquitectura, descarga el binario precompilado correspondiente, verifica su suma de comprobación y lo coloca en el PATH. También puedes compilar desde el código fuente con Cargo o copiar una plantilla de configuración lista.'
		},
		{
			q: '¿Cómo se configura nostrfy?',
			a: 'Todo está en un único archivo nostrfy.toml totalmente comentado — identidad del relé, límites, almacenamiento, control de acceso, Blossom y RPC. nostrfy check lo valida antes de arrancar, y la mayoría de los ajustes se recargan en caliente con SIGHUP.'
		},
		{
			q: '¿Qué NIP admite nostrfy?',
			a: 'nostrfy implementa 36 NIP, incluidos NIP-01, eliminación NIP-09, grupos NIP-29, autenticación NIP-42, búsqueda NIP-50, zaps NIP-57, gift wrap NIP-59, listas de relés NIP-65, negentropy NIP-77, gestión NIP-86 y autenticación HTTP NIP-98. La lista supported_nips de NIP-11 es dinámica: un NIP desaparece cuando sus kinds se bloquean o desactivan.'
		},
		{
			q: '¿Aloja nostrfy archivos multimedia?',
			a: 'Sí. El servidor de archivos Blossom integrado aloja subidas direccionadas por contenido en su propio nombre de host — disco local o un bucket compatible con S3 como AWS S3 o Cloudflare R2. Las subidas se autorizan con eventos kind-24242 firmados y pueden restringirse a una allowlist.'
		},
		{
			q: '¿Puedo migrar desde strfry?',
			a: 'Sí. nostrfy migrate-strfry importa directamente una base de strfry o un export JSONL, aplicando la semántica reemplazable/direccionable, las eliminaciones NIP-09 y los efectos secundarios de moderación NIP-29, y puede fusionar los ajustes equivalentes de strfry en nostrfy.toml. La migración es offline, admite simulacro (dry-run) y es segura de repetir.'
		},
		{
			q: '¿Puede nostrfy funcionar detrás de un proxy inverso o Cloudflare?',
			a: 'Sí. Configura server.trusted_proxies con las direcciones del proxy (loopback para nginx o Caddy en el mismo host, el rango del balanceador en la nube) para que los límites por IP, blockip y los registros vean la dirección real del cliente. El TLS lo termina tu proxy o túnel; nostrfy sirve HTTP y WebSocket sin cifrar detrás de él.'
		},
		{
			q: '¿Tiene nostrfy una API REST?',
			a: 'Sí — una API /api/v1 de solo lectura en el mismo puerto que el relé WebSocket, en su propio hilo de lectura, por lo que el tráfico REST nunca bloquea a los suscriptores. Consulta eventos por npub, nevent o naddr y ofrece recuentos, estadísticas de autor, desgloses por día/mes y búsqueda de texto completo.'
		},
		{
			q: '¿Cómo se mantiene nostrfy en línea bajo carga o abuso?',
			a: 'Protección contra sobrecarga, hilos de lectura dedicados, aislamiento de pánicos y límites estrictos de recursos. Las colas acotadas fallan rápido en lugar de agotar la memoria; los límites de conexiones por IP detienen los floods de sockets, y un disco bloqueado no bloquea las lecturas. Los subsistemas están aislados y el relé sigue sirviendo.'
		},
		{
			q: '¿Cómo gestiono usuarios, baneos y roles?',
			a: 'A través de la API de gestión JSON-RPC NIP-86 con un token Bearer o una clave de administrador NIP-98: banear claves, bloquear IPs, gestionar allowlists de kinds, roles y códigos de invitación. Las concesiones de métodos permiten delegar la moderación en otras claves sin dar permisos completos de administrador.'
		}
	];

	const faqJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		inLanguage: 'es',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${faqJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Preguntas frecuentes"
	description="Respuestas sobre nostrfy: instalación, configuración, compatibilidad con NIP, medios Blossom, migración desde strfry, proxies inversos, licencia y gestión."
/>

<div class="relative overflow-hidden">
	<div
		class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]"
		aria-hidden="true"
	></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Preguntas frecuentes</h1>
		<p class="mt-4 text-[15px] leading-relaxed text-zinc-400">
			Respuestas breves sobre cómo ejecutar nostrfy. Todo lo de abajo enlaza a la
			<a href={p('/docs/')} class="text-accent-300 hover:text-accent-200">documentación</a> — y si lo prefieres, puedes
			<a href={p('/compare/strfry/')} class="text-accent-300 hover:text-accent-200">compararlo con strfry</a>.
		</p>

		<div class="mt-10 space-y-3">
			{#each faqs as faq (faq.q)}
				<details class="group rounded-xl border border-line bg-surface/50 p-5">
					<summary class="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-zinc-100">
						{faq.q}
						<Icon
							name="chevron-down"
							size={16}
							class="shrink-0 text-zinc-500 transition-transform group-open:rotate-180"
						/>
					</summary>
					<p class="mt-3 text-sm leading-relaxed text-zinc-400">{faq.a}</p>
				</details>
			{/each}
		</div>

		<div class="mt-12 flex flex-wrap items-center gap-3">
			<a
				href={p('/docs/quick-start/')}
				class="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-400"
			>
				Instalar nostrfy <Icon name="arrow-right" size={16} />
			</a>
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Ver el código fuente
			</a>
		</div>
	</div>
</div>
