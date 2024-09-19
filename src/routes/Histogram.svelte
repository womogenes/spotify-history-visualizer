<script>
	import { Slider } from 'lib/components/ui/slider';
	import { onMount } from 'svelte';

	export let history = [];

	let minTime = 0;
	let maxTime = 0;
	let sliderTimeValue = [0];
	$: sliderTime = sliderTimeValue[0] * 1e3 + minTime;

	onMount(() => {
		console.log('history:', history.length);
		minTime = history[0].ts;
		maxTime = history[history.length - 1].ts;
	});

	// $: minTime = history[0]?.ts ?? 0;
	// $: maxTime = history[history.length - 1]?.ts ?? 1;
</script>

<div class="flex w-full flex-col gap-2">
	<h1>Hello world</h1>
	<p>{history.length.toLocaleString('en-US')} streams</p>

	<div id="histogram">
		<pre class="mono text-sm">{JSON.stringify(history[0], null, 2)}</pre>
		<pre class="mono text-sm">{JSON.stringify(history[history.length - 1], null, 2)}</pre>
	</div>

	<div class="mt-1 flex flex-col gap-4">
		<div class="mx-1.5">
			<Slider
				class="w-full"
				bind:value={sliderTimeValue}
				max={(maxTime - minTime) / 1e3}
				min={0}
				step={3600 * 1e2 + 103}
			/>
		</div>
		<p class="tabular-nums">
			{new Date(sliderTime).toLocaleString('en-US', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric',
				hour12: false
			})}
		</p>
	</div>
</div>
