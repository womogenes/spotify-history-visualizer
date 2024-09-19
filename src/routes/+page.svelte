<script>
	// https://github.com/DVLP/localStorageDB
	import ldb from 'localdata';

	import { ArrowUp, Loader } from 'lucide-svelte';
	import { mergeHistory, parseHistoryJSON } from '$lib/logic/history-json-parser';
	import Dropzone from 'svelte-file-dropzone';
	import { cn } from 'lib/utils';
	import { Skeleton } from 'lib/components/ui/skeleton';

	// UI loading state vars
	let uploadedFiles = 0;
	let loadedFiles = 0;
	let loadedLocalStorage = false;
	$: doneUploading = loadedFiles === uploadedFiles;

	let history = [];
	ldb.get('streaming_history', (v) => {
		history = mergeHistory(history, v);
		loadedLocalStorage = true;
	});

	const handleFileDrop = (e) => {
		const { acceptedFiles } = e.detail;
		acceptedFiles.forEach((file) => {
			if (!file.name.match(/Streaming_History_Audio_/g)) return;
			const reader = new FileReader();
			uploadedFiles++;
			reader.readAsText(file);
			reader.onload = (e) => {
				// Reader has finished parsing the file; add it to localStorage
				const json = e.target.result;
				const parsedJson = parseHistoryJSON(json);
				ldb.set('streaming_history', mergeHistory(history, parsedJson));
				history = mergeHistory(history, parsedJson);
				loadedFiles++;
			};
		});
	};
</script>

<div class="flex h-full">
	<div class="flex h-full max-w-64 flex-col justify-end border-r">
		<!-- Stats -->
		<div class="p-4">
			<div class="flex items-center gap-1">
				<b>Streams:</b>
				{#if loadedLocalStorage}
					{history.length.toLocaleString('en-US')}
				{:else}
					<Skeleton class="ml-2 mt-1 h-4 w-10" />
				{/if}
			</div>
		</div>

		<!-- Container for uploading files -->
		<div class="flex flex-col gap-2 border-t p-4">
			<b>Upload listening history</b>

			<Dropzone
				class={cn(
					'flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-8 transition-all hover:bg-neutral-200 dark:hover:bg-neutral-900',
					!doneUploading && 'pointer-events-none opacity-50'
				)}
				disabled={!doneUploading}
				on:drop={handleFileDrop}
			>
				{#if doneUploading}
					<ArrowUp class="stroke-2" />
					<p class="text-sm">Add a file</p>
				{:else}
					<Loader class="animate-spin stroke-2" />
					<p class="text-sm">Uploading...</p>
				{/if}
			</Dropzone>

			<p class="text-sm dark:text-neutral-400">Files are stored in IndexedDB.</p>
		</div>
	</div>
</div>
