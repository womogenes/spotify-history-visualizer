<script>
  import { cn } from '$lib/utils.js';
  /** @type {{class?: any, [key: string]: any}} */
  let { class: className = undefined, ...rest } = $props();
  
</script>

<div
  class={cn('animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800', className)}
  {...rest}
></div>
