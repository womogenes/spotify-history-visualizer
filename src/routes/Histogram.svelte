<script>
  import { run } from 'svelte/legacy';

  import { Slider } from '$lib/components/ui/slider';
  import { onMount } from 'svelte';
  import { getSongPopularity } from '$lib/logic/summary';
  import { formatTimestamp, formatDuration } from '$lib/logic/utils';
  import { cyrb53 } from '$lib/logic/utils';

  /** @type {{history?: any}} */
  let { history = [] } = $props();

  let minTime = $state(0);
  let maxTime = $state(0);
  let sliderTimeValue = $state([0]);
  let sliderTime;
  run(() => {
    sliderTime = sliderTimeValue[0] * 1e3 + minTime;
  });
  let songPopularity = $state([]);

  let lastUpdatedGraph = $state(0);
  run(() => {
    (() => {
      // Don't update
      if (new Date() - lastUpdatedGraph < 100) return;
      songPopularity = getSongPopularity(history, sliderTime - 3600 * 24 * 7 * 1000, sliderTime);
      lastUpdatedGraph = new Date();
    })();
  });

  onMount(() => {
    console.log('history:', history.length);
    minTime = history[0].ts;
    maxTime = history[history.length - 1].ts;
    sliderTimeValue = [(maxTime - minTime) / 1e3];
    console.log('sliderTimeValue:', sliderTimeValue);
    sliderTime = 0;
  });
</script>

<div class="mx-auto flex h-full w-full max-w-4xl flex-col gap-1 overflow-x-auto">
  <p>
    {Math.floor((maxTime - minTime) / 1e3 / 3600 / 24).toLocaleString()} days
  </p>
  <p>Data range: {formatTimestamp(minTime)} &ndash; {formatTimestamp(maxTime)}</p>

  <div class="mb-2 mt-2 flex flex-col gap-4">
    <div class="mx-3">
      <Slider
        class="w-full"
        bind:value={sliderTimeValue}
        max={(maxTime - minTime) / 1e3}
        min={0}
        step={3600 * 24}
      />
    </div>
    <p class="mx-auto text-4xl tabular-nums">
      {formatTimestamp(sliderTime)}
    </p>
  </div>

  <div class="h-full overflow-y-auto py-2">
    <div class="flex flex-col gap-2">
      {#each songPopularity as [track, ms] (track.track_uri)}
        <div class="flex h-20 items-stretch text-white dark:text-white overflow-hidden rounded-md">
          <!-- Image -->
          <div
            class="w-20 shrink-0 rounded-l-md"
            style={`background-color: hsl(${cyrb53(track.artist_name, 0, track) % 256}, 30%, 20%)`}
          ></div>
					
          <div class="relative flex h-full grow items-center gap-4 rounded-r-md bg-neutral-500 py-2">
            <!-- Length -->
            <div
              class="absolute h-full"
              style={`
                width: ${(ms / songPopularity[0][1]) * 100}% !important;
                background-color: hsl(${cyrb53(track.artist_name, 0, track) % 256}, 30%, 30%);
              `}
></div>

            <!-- Track info -->
            <div class="px-6 z-10">
              <p class="line-clamp-1 font-bold">{track.track_name}</p>
              <p class="text-nowrap">{track.artist_name}</p>
            </div>

            <!-- Track listening-to duration -->
            <div class="my-auto ml-auto mr-2 z-10 tabular-nums px-4">{formatDuration(ms)}</div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
