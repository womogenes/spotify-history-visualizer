<script>
  import { Slider } from '$lib/components/ui/slider';
  import { getSongPopularity } from '$lib/logic/summary';
  import { cyrb53, formatDuration, formatTimestamp } from '$lib/logic/utils';

  let { history = [] } = $props();

  let minTime = $state(0);
  let maxTime = $state(0);
  let queryRange = $state(3600 * 24 * 7 * 1000);
  let sliderTimeValue = $state([0]);
  let sliderTime = $derived(sliderTimeValue[0] * 1e3 + minTime);
  let songPopularity = $derived.by(() => {
    return getSongPopularity(history, sliderTime - queryRange, sliderTime);
  });

  $effect(() => {
    minTime = history[0].ts;
    maxTime = history[history.length - 1].ts;
    sliderTimeValue = [(maxTime - minTime) / 1e3]; // Jump to end of history
  });
</script>

<div class="mx-auto flex h-full w-full max-w-4xl flex-col gap-1 overflow-x-auto">
  <div class="mb-2 mt-2 flex flex-col">
    <div class="mx-3">
      <Slider
        type="range"
        class="mb-2 w-full"
        bind:value={sliderTimeValue}
        min={0}
        max={(maxTime - minTime) / 1e3}
        step={3600 * 24}
      />
      <div class="text-muted flex justify-between">
        <p>{formatTimestamp(minTime)}</p>
        <p>{formatTimestamp(maxTime)}</p>
      </div>
    </div>
    <p class="mx-auto mb-1">Top songs in range:</p>
    <p class="mx-auto text-4xl font-bold tabular-nums">
      {formatTimestamp(sliderTime - queryRange)}
      &ndash;
      {formatTimestamp(sliderTime)}
    </p>
  </div>

  <div class="h-full overflow-y-auto py-2">
    <!-- List container -->
    <div class="flex flex-col gap-2">
      {#each songPopularity as [track, ms] (track.track_uri)}
        <div class="flex h-16 items-stretch overflow-hidden rounded-md text-white dark:text-white">
          <!-- Image -->
          <div
            class="w-16 shrink-0 rounded-l-md"
            style={`background-color: hsl(${cyrb53(track.artist_name, 0, track) % 256}, 30%, 20%)`}
          ></div>

          <div
            class="relative flex h-full grow items-center gap-4 rounded-r-md bg-neutral-500 py-2"
          >
            <!-- Length -->
            <div
              class="absolute h-full"
              style={`
                width: ${(ms / songPopularity[0][1]) * 100}% !important;
                background-color: hsl(${cyrb53(track.artist_name, 0, track) % 256}, 30%, 30%);
              `}
            ></div>

            <!-- Track info -->
            <div class="z-10 px-4">
              <p class="line-clamp-1 font-bold">{track.track_name}</p>
              <p class="text-muted-dark text-nowrap text-sm">{track.artist_name}</p>
            </div>

            <!-- Track listening-to duration -->
            <div class="z-10 my-auto ml-auto mr-2 px-4 tabular-nums">{formatDuration(ms)}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
