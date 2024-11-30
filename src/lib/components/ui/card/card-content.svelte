<script>
  import { cn } from '$lib/utils.js';
  /** @type {{class?: any, children?: import('svelte').Snippet, [key: string]: any}} */
  let { class: className = undefined, children, ...rest } = $props();
  
</script>

<div class={cn('p-6 pt-0', className)} {...rest}>
  {@render children?.()}
</div>
