<script>
  import { cn } from '$lib/utils.js';
  let className = undefined;
  export { className as class };
</script>

<div
  class={cn('animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800', className)}
  {...$$restProps}
></div>
