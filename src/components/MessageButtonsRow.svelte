<script>
	import { Copy, RotateCcw, Check } from 'lucide-svelte';

	export let message;
	export let isLast;

	let isCopyButtonClicked = false;

	function handleCopyButton(message) {
		navigator.clipboard.writeText(message.text);
		if (!isCopyButtonClicked) {
			isCopyButtonClicked = true;
			setTimeout(() => {
				isCopyButtonClicked = false;
			}, 2000);
		}
	}

	function handleRegenButton() {}
</script>

<div class="buttons-row">
	<div class="text-button" on:click={() => handleCopyButton(message)}>
		{#if isCopyButtonClicked}
			<Check color="#777" size="16" />
			<p class="text-button-label">Copied!</p>
		{:else}
			<Copy color="#777" size="16" />
			<p class="text-button-label">Copy</p>
		{/if}
	</div>
	{#if isLast}
		<div class="text-button" on:click={handleRegenButton}>
			<RotateCcw color="#777" size="16" />
			<p class="text-button-label">Regenerate</p>
		</div>
	{/if}
</div>

<style>
	.text-button-label {
		font-size: 12px;
		font-weight: 500;
		margin: 0;
		padding: 0;
		margin-left: 8px;
		color: inherit;
	}
	.buttons-row {
		margin-top: 8px;
		display: flex;
	}

	.text-button:hover {
		color: var(--text-2);
	}

	.text-button {
		margin-right: 16px;
		display: flex;
		cursor: pointer;
		color: var(--placeholder-text);
		/* color: var(--placeholder-text); */
	}
</style>
