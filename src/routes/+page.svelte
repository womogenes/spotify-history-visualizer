<script>
	import * as Card from '$lib/components/ui/card';
	import { ArrowUp } from 'lucide-svelte';
	import { parseHistoryJSON } from '$lib/logic/history-json-parser';

	import Dropzone from 'svelte-file-dropzone';

	const files = [];
	Object.keys(localStorage).forEach((key) => {
		if (!key.startsWith('raw_stream_history_')) return;
		files.push({ name: key, data: localStorage.getItem(key) });
	});

	const handleFileDrop = (e) => {
		const { acceptedFiles } = e.detail;
		let loaded = 0;

		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			const text = reader.readAsText(file);
			reader.onload = (e) => {
				// Reader has finished parsing the file
				const json = e.target.result;
				const parsedJson = JSON.stringify(parseHistoryJSON(json), null, 0);
				const filename = `raw_stream_history_${file.name}`;
				localStorage.setItem(filename, parsedJson);
				files.push({ name: filename, data: json });

				loaded++;
			};
		});
	};
</script>

<div class="flex h-full items-center justify-center">
	<Card.Root class="max-w-sm">
		<Card.Header>
			<Card.Title>Get Started</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<p>To start visualizing your listening history, drop a file below.</p>

			<Dropzone
				class="flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-4 py-8 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-950"
				on:drop={handleFileDrop}
			>
				<ArrowUp class="stroke stroke-2" />
				<p class="text-sm">Add a file</p>
			</Dropzone>

			<p class="text-sm dark:text-neutral-400">Files are stored in localStorage.</p>
		</Card.Content>
	</Card.Root>
</div>
