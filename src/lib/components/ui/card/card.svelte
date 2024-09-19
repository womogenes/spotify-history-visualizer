<script>
	import { cn } from '$lib/utils.js';
	let className = undefined;
	export { className as class };
</script>

<div class={cn('rounded-lg border shadow-sm dark:bg-neutral-900/40', className)} {...$$restProps}>
	<slot />
</div>
