<script>
  // https://github.com/DVLP/localStorageDB
  import ldb from 'localdata';

  import { ArrowUp, Loader } from 'lucide-svelte';
  import { mergeHistory, parseHistoryJSON } from '$lib/logic/history-json-parser';
  import Dropzone from 'svelte-file-dropzone';
  import { cn } from 'lib/utils';
  import { Skeleton } from 'lib/components/ui/skeleton';
  import Histogram from './Histogram.svelte';

  // UI loading state vars
  let uploadedFiles = $state(0);
  let loadedFiles = $state(0);
  let loadedLocalStorage = $state(false);
  let doneUploading = $derived(loadedFiles === uploadedFiles);

  let history = $state([]);
  ldb.get('streaming_history', (v) => {
    if (v) history = mergeHistory(history, v);
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
  <!-- Left sidebar -->
  <div class="flex h-full w-full max-w-64 shrink-0 flex-col border-r">
    <div class="border-b p-4">
      <h1 class="text-lg font-bold">Spotify history visualizer</h1>
      <p class="text-sm">
        Instructions: Request Spotify data as per <a
          class="underline"
          href="https://support.spotify.com/us/article/understanding-my-data/">this site</a
        > and upload it back here to visualize your streaming history.
      </p>
    </div>

    <!-- Stats -->
    <div class="flex flex-col gap-2 p-4">
      <div>
        <b>Date range:</b>
        {#if loadedLocalStorage}
          <p>
            {new Date(history[0].ts).toLocaleDateString()}
            &ndash;
            {new Date(history[history.length - 1].ts).toLocaleDateString()}
          </p>
        {:else}
          <Skeleton class="mt-1 h-4 w-12" />
        {/if}
      </div>
      <div>
        <b>Streams:</b>
        {#if loadedLocalStorage}
          <p>{history.length.toLocaleString('en-US')}</p>
        {:else}
          <Skeleton class="mt-1 h-4 w-12" />
        {/if}
      </div>
    </div>

    <!-- Container for uploading files -->
    <div class="mt-auto flex flex-col gap-2 border-t p-4">
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

  <!-- Main data -->
  <div class="w-full p-4">
    {#if history.length > 0 && loadedLocalStorage}
      <Histogram {history} />
    {:else if loadedLocalStorage}
      <div class="flex h-full items-center justify-center">Upload some files to start.</div>
    {:else}
      <div class="flex flex-col gap-2">
        <Skeleton class="h-6 w-1/2 rounded-full" />
        <Skeleton class="h-6 w-3/4 rounded-full" />
        <Skeleton class="h-6 w-1/4 rounded-full" />
        <Skeleton class="h-6 w-1/2 rounded-full" />
      </div>
    {/if}
  </div>
</div>
