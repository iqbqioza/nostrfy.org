<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import { highlight } from '$lib/utils/highlight';

	let {
		code,
		lang = 'bash',
		filename,
		caption,
		class: className = '',
		title,
		maxHeight
	}: {
		code: string;
		lang?: string;
		filename?: string;
		caption?: string;
		class?: string;
		title?: string;
		maxHeight?: string;
	} = $props();

	const langLabel: Record<string, string> = {
		bash: 'sh',
		sh: 'sh',
		shell: 'sh',
		toml: 'toml',
		json: 'json',
		jsonc: 'jsonc',
		nginx: 'nginx',
		caddy: 'caddy',
		text: 'text',
		plaintext: 'text'
	};

	const inner = $derived(highlight(code, lang));
</script>

{#if title}
	<div class="mb-1.5 text-xs font-medium uppercase tracking-wide text-zinc-500">{title}</div>
{/if}
<div
	class="group relative overflow-hidden rounded-xl border border-line bg-[#0b0b0f] shadow-md shadow-black/30 {className}"
>
	<div class="flex items-center justify-between gap-3 border-b border-line/70 bg-surface/70 py-2 pl-3 pr-2">
		<div class="flex min-w-0 items-center gap-2">
			<span class="h-2 w-2 shrink-0 rounded-full bg-accent-500/80" aria-hidden="true"></span>
			<span class="shrink-0 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-500">
				{filename ?? langLabel[lang] ?? lang}
			</span>
		</div>
		<CopyButton text={code} label="Copy" showLabel={false} />
	</div>
	{#if maxHeight}
		<div class="overflow-auto" style="max-height: {maxHeight}">
			<pre class="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-zinc-300"><code>{@html inner}</code></pre>
		</div>
	{:else}
		<pre class="overflow-x-auto px-4 py-3.5 font-mono text-[12.5px] leading-[1.7] text-zinc-300"><code>{@html inner}</code></pre>
	{/if}
</div>
{#if caption}
	<p class="mt-1.5 text-xs text-zinc-500">{caption}</p>
{/if}