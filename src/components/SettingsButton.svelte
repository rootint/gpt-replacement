<script>
	import { Settings2, X } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { chatStore } from '../stores/chatStore';

	let toggled = false;
	let instruction;
	function toggleSettingsMenu() {
		toggled = !toggled;
		console.log('change instruction');
		chatStore.handleChangeInstruction(instruction);
	}

	onMount(() => {
		const unsubscribeFromInstruction = chatStore.instruction.subscribe((value) => {
			instruction = value;
		});

		return () => {
			unsubscribeFromInstruction();
		};
	});
</script>

{#if toggled}
	<button on:click={toggleSettingsMenu}><X size="20" color="#e1e1e1"></X></button>
	<div class="settings-menu">
		<h3>Custom Instruction</h3>
		<textarea bind:value={instruction}></textarea>
	</div>
{:else}
	<button on:click={toggleSettingsMenu}><Settings2 size="20" color="#e1e1e1"></Settings2></button>
{/if}

<style>
	textarea {
		border-radius: 8px;
		background-color: var(--bg-elevation-5);
		border: var(--border-2) solid 1px;
		padding: 16px;
		resize: none;
		width: 33vw;
	}
	h3 {
		font-weight: 500;
		color: var(--text);
		font-size: 16px;
		margin: 0;
		margin-bottom: 16px;
	}
	.settings-menu {
		border-radius: 12px;
		background-color: var(--bg-elevation-3);
		padding: 16px;
		margin-top: 16px;
		border: var(--border-2) solid 1px;
	}
	button {
		border-radius: 12px;
		background-color: var(--bg-elevation-1);
		outline: none;
		border: var(--border) solid 1px;
		padding: 12px;
		line-height: 0;
		cursor: pointer;
	}

	button:hover {
		background-color: var(--bg-elevation-3);
	}
</style>
