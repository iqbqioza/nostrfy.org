<script lang="ts">
	import Icon from './Icon.svelte';

	let {
		text,
		label = 'Copy',
		copiedLabel = 'Copied',
		showLabel = true,
		size = 15,
		class: className = '',
		iconClass = ''
	}: {
		text: string;
		label?: string;
		copiedLabel?: string;
		showLabel?: boolean;
		size?: number;
		class?: string;
		iconClass?: string;
	} = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined = $state(undefined);

	async function onCopy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = text;
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			ta.remove();
		}
		copied = true;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = false), 2000);
	}
</script>

<button
	type="button"
	title={label}
	aria-label={label}
	onclick={onCopy}
	class="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface/60 text-zinc-400 transition-colors hover:border-line-2 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 {showLabel
		? 'px-2.5 py-1.5 text-xs font-medium'
		: 'p-1.5'} {className}"
>
	<Icon name={copied ? 'check' : 'copy'} size={size} class={copied ? 'text-accent-400 ' + iconClass : iconClass} />
	{#if showLabel}
		<span>{copied ? copiedLabel : label}</span>
	{/if}
</button>