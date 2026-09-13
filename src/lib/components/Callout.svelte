<script lang="ts">
	import Icon from './Icon.svelte';
	import type { Snippet } from 'svelte';

	let {
		type = 'note',
		title,
		class: className = '',
		children
	}: {
		type?: 'note' | 'tip' | 'warning' | 'danger';
		title?: string;
		class?: string;
		children?: Snippet;
	} = $props();

	const config = {
		note: {
			icon: 'file-text',
			colors:
				'border-sky-400/25 bg-sky-400/[0.06] text-sky-100/90 [--callout-icon:#7dd3fc]',
			label: 'Note'
		},
		tip: {
			icon: 'sparkles',
			colors:
				'border-accent-400/30 bg-accent-400/[0.07] text-accent-100/90 [--callout-icon:#ec9d75]',
			label: 'Tip'
		},
		warning: {
			icon: 'activity',
			colors:
				'border-amber-400/30 bg-amber-400/[0.07] text-amber-100/90 [--callout-icon:#fbbf24]',
			label: 'Warning'
		},
		danger: {
			icon: 'shield',
			colors:
				'border-rose-400/30 bg-rose-400/[0.07] text-rose-100/90 [--callout-icon:#fb7185]',
			label: 'Danger'
		}
	};
	const c = $derived(config[type]);
</script>

<div class="my-4 rounded-xl border p-4 {c.colors} {className}">
	<div class="mb-1 flex items-center gap-2 text-sm font-semibold">
		<Icon name={c.icon} size={16} class="text-[var(--callout-icon)]" />
		<span>{title ?? c.label}</span>
	</div>
	<div class="text-sm leading-relaxed opacity-90">
		{@render children?.()}
	</div>
</div>