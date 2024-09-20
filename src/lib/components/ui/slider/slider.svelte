<script>
  import { Slider as SliderPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  let className = undefined;
  export let value = [0];
  export { className as class };
</script>

<SliderPrimitive.Root
  bind:value
  class={cn('relative flex w-full cursor-pointer touch-none select-none items-center', className)}
  {...$$restProps}
  let:thumbs
>
  <span
    class="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-400 dark:bg-neutral-800"
  >
    <SliderPrimitive.Range class="absolute h-full bg-black dark:bg-neutral-200" />
  </span>
  {#each thumbs as thumb}
    <SliderPrimitive.Thumb
      {thumb}
      class="block h-4 w-4 rounded-full bg-white dark:bg-neutral-600 ring-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-black dark:ring-neutral-200"
    />
  {/each}
</SliderPrimitive.Root>
