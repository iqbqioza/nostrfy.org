<script lang="ts">
	let {
		size = 26,
		class: className = '',
		withWordmark = true
	}: { size?: number; class?: string; withWordmark?: boolean } = $props();
</script>

<a href="/" class="inline-flex items-center gap-2.5 {className}" aria-label="nostrfy home">
	<img src="/logo.png" width={size} height={size} alt="" class="rounded-[30%]" />
	{#if withWordmark}
		<span class="text-[17px] font-semibold tracking-tight text-zinc-50">nostrfy</span>
	{/if}
</a>