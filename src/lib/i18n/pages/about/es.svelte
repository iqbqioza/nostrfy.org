<script lang="ts">
	import PageMeta from '$lib/components/PageMeta.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { site } from '$lib/data/site';

	const principles = [
		{
			icon: 'zap',
			title: 'Nunca se cae',
			body: 'Protección contra sobrecarga, hilos de lectura dedicados, aislamiento de pánicos y límites estrictos de recursos. Un relé solo importa si está funcionando.'
		},
		{
			icon: 'layers',
			title: 'Totalmente conforme',
			body: 'Todos los NIP del lado del relé implementados y verificados contra las especificaciones oficiales — incluidos búsqueda, grupos, medios y API de gestión.'
		},
		{
			icon: 'box',
			title: 'Un solo binario',
			body: 'Un único binario Rust estático lo hace todo: relé, API REST, servidor de archivos Blossom, gestión NIP-86, demonio, rotación de registros y estadísticas.'
		},
		{
			icon: 'cpu',
			title: 'Ligero por naturaleza',
			body: 'Funciona cómodamente en un VPS de 0,25 vCPU / 512 MB. El mapa LMDB es una reserva virtual dispersa; la memoria se mantiene estable a medida que crece la base de datos.'
		}
	];

	const base = 'https://nostrfy.org';
	const aboutJsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'AboutPage',
		name: 'Acerca de nostrfy',
		url: `${base}/es/about/`,
		description:
			'nostrfy es un motor de servidor de relé Nostr de código abierto escrito en Rust, con doble licencia MIT o Apache-2.0. Conoce el proyecto y sus principios de diseño.',
		inLanguage: 'es',
		isPartOf: { '@type': 'WebSite', name: 'nostrfy', url: `${base}/` },
		mainEntity: {
			'@type': 'SoftwareApplication',
			name: 'nostrfy',
			applicationCategory: 'DeveloperApplication',
			operatingSystem: 'Linux, FreeBSD',
			license: [
				'https://opensource.org/licenses/MIT',
				'https://www.apache.org/licenses/LICENSE-2.0'
			]
		}
	});
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${aboutJsonLd}</script>`}
</svelte:head>

<PageMeta
	title="Acerca del proyecto nostrfy"
	description="nostrfy es un motor de servidor de relé Nostr de código abierto escrito en Rust, con doble licencia MIT o Apache-2.0. Conoce el proyecto y sus principios de diseño."
/>

<div class="relative overflow-hidden">
	<div class="absolute -top-40 left-1/2 h-[360px] w-[680px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-[120px]" aria-hidden="true"></div>
	<div class="relative mx-auto max-w-3xl px-4 pb-20 pt-16 sm:px-6">
		<div class="flex items-center gap-4">
			<img src="/logo.png" width={56} height={56} alt="" class="rounded-2xl" />
			<div>
				<h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Acerca de nostrfy</h1>
				<p class="mt-1 text-sm text-zinc-500">Motor de servidor de relé Nostr todo en uno</p>
			</div>
		</div>

		<div class="mt-8 space-y-5 text-[15px] leading-relaxed text-zinc-400">
			<p>
				<strong class="text-zinc-200">nostrfy</strong> es un servidor de relé para el protocolo
				<a href="https://nostr.com/" target="_blank" rel="noopener noreferrer" class="text-accent-300 hover:underline">Nostr</a>
				, escrito en Rust. Almacena los eventos enviados por los clientes (Amethyst, Damus, Iris y otros) y los entrega en respuesta a las suscripciones — con una fracción de los recursos de un relé típico.
			</p>
			<p>
				El proyecto empezó como un experimento: ¿y si un relé pudiera <strong class="text-zinc-200">definirse con un solo archivo de configuración</strong>, en el servidor más pequeño que puedas alquilar, y aun así implementar todos los NIP del lado del relé — además de servidor de archivos, API REST e interfaz de gestión? nostrfy es la respuesta, y es gratis: con licencia MIT o Apache-2.0.
			</p>
			<p>
				nostrfy ejecuta el relé oficial del proyecto, y el mismo binario se ha verificado en Linux (x86_64 y aarch64) y FreeBSD — desde un VPS de 512 MB hasta un solo host sirviendo cientos de miles de conexiones.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2">
			{#each principles as p (p.title)}
				<div class="rounded-xl border border-line bg-surface/40 p-5">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg">
						<Icon name={p.icon} size={17} class="text-accent-400" />
					</div>
					<h3 class="mt-3 text-sm font-semibold text-zinc-100">{p.title}</h3>
					<p class="mt-1.5 text-[13px] leading-relaxed text-zinc-500">{p.body}</p>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex flex-wrap gap-3">
			<a
				href={site.github}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-line-2 hover:text-white"
			>
				<Icon name="github" size={16} /> Ver el código fuente en GitHub
			</a>
			{#each site.relays as relay (relay.url)}
				<a
					href={relay.url}
					class="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 font-mono text-sm text-zinc-300 transition-colors hover:border-line-2 hover:text-white"
				>
					<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
					{relay.url}
				</a>
			{/each}
		</div>
	</div>
</div>
