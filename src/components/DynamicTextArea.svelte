<script>
	import { onMount, onDestroy } from 'svelte';
	import { chatStore } from '../stores/chatStore';
	import { ArrowUp, Paperclip } from 'lucide-svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let message = '';
	let isActive = false;
	let isButtonActive = false;
	let textareaHeight = 46;
	let inputElement;
	let responsePending;
	let fileInput;
	let fileToSend = null;
	let chatInstruction;

	function handleFocus() {
		isActive = true;
	}

	function handleBlur() {
		isActive = false;
	}

	async function handleMessageSend() {
		if (!message.trim() || responsePending) return;
		let messageCopy = message;
		message = '';
		isButtonActive = false;
		textareaHeight = 46;
		await chatStore.handleSendMessage(messageCopy, fileToSend, 'user');
		fileToSend = null;
	}

	function handleInput(event) {
		isButtonActive = message.trim();
		message = event.target.value;
		let amountOfLines = Math.round((event.target.scrollHeight + 2 - 24) / 20);
		// console.log('amount of lines', Math.round((event.target.scrollHeight + 2 - 24) / 20));
		textareaHeight = 20 * (amountOfLines > 10 ? 10 : amountOfLines) + 24 + 2;
		// console.log('scrollHeight', event.target.scrollHeight);
		// console.log('offsetHeight', event.target.offsetHeight);
		// console.log('textareaHeight', textareaHeight);
		if (!isButtonActive) {
			textareaHeight = 46;
		}
	}

	function handleKeydown(event) {
		// Check for Enter without Shift
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault(); // Prevents the default action of inserting a new line
			handleMessageSend();
		}
		// For Shift+Enter, just allow the default behavior which is to insert new line
	}

	function focusInput() {
		inputElement.focus();
	}

	function handleSlashPress(event) {
		if (event.key === '/' && !isActive) {
			event.preventDefault(); // Prevent any default action associated with the "/" key
			focusInput();
		}
	}

	function attachFile() {
		console.log('button clicked!');
		fileInput.click();
	}

	// Function to handle file selection
	function handleFileChange(event) {
		const file = event.target.files[0];
		if (!file) return;
		fileToSend = file;
		console.log(file); // For debugging: to see the selected file details
		// Here, you can also call a function to upload the file
	}

	function handleChangeInstruction() {
		console.log('change instruction');
		chatStore.handleChangeInstruction(chatInstruction);
	}

	onMount(() => {
		const unsubscribe = chatStore.awaitingForResponse.subscribe((value) => {
			responsePending = value;
		});

		const unsubscribeFromInstruction = chatStore.instruction.subscribe((value) => {
			chatInstruction = value;
		});

		return () => {
			unsubscribe(); // Cleanup on component unmount
			unsubscribeFromInstruction();
		};
	});
</script>

<svelte:window on:keydown={handleSlashPress} />

{#if fileToSend != null}
	{fileToSend}
{/if}
<textarea type="text" bind:value={chatInstruction} class="instruction-input" /><button
	on:click={handleChangeInstruction}
	class="attach-file-btn">Change Instruction</button
>
<div class="textarea-row">
	<input
		type="file"
		accept="application/pdf"
		bind:this={fileInput}
		on:change={handleFileChange}
		class="hidden-file-input"
	/>
	<button class="attach-file-btn" on:click={attachFile}>
		<Paperclip></Paperclip>
	</button>
	<textarea
		bind:this={inputElement}
		on:focus={handleFocus}
		on:blur={handleBlur}
		bind:value={message}
		on:input={handleInput}
		on:keydown={handleKeydown}
		style="height: {textareaHeight}px;"
		class:active={isActive}
		placeholder="Message ChatGPT 4..."
	></textarea>
	<button on:click={handleMessageSend} class:buttonactive={isButtonActive}>
		{#if responsePending}
			<LoadingSpinner />
		{:else}
			<ArrowUp color="#000" size="24" />
		{/if}
	</button>
</div>

<style>
	.attach-file-btn {
		cursor: pointer;
		pointer-events: auto;
		margin-right: 12px;
	}

	.hidden-file-input {
		display: none;
	}
	.buttonactive {
		pointer-events: auto;
		cursor: pointer;
		background-color: var(--text-2);
	}
	button {
		padding: 11px;
		background-color: var(--bg-elevation-3);
		border-radius: 12px;
		border: none;
		margin-left: 12px;
		line-height: 0;
		pointer-events: none;
		cursor: default;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.textarea-row {
		width: 100%;
		display: flex;
		margin-bottom: 24px;
		max-width: 768px;
		margin-right: 18px;
		align-items: end;
	}
	textarea {
		width: 100%;
		padding: 12px;
		box-sizing: border-box;
		color: var(--text);
		background-color: var(--bg-elevation-1);
		border: var(--border) solid 1px;
		border-radius: 12px;
		font-size: 14px;
		transition: border-color 0.2s ease;
		outline: none;
		resize: none;
		scrollbar-width: thin;
		scrollbar-color: var(--border) var(--bg-elevation-1);
	}
	.active {
		border-color: var(--placeholder-text);
	}

	textarea::placeholder {
		color: var(--placeholder-text);
	}
</style>
