<script>
	import { onMount, onDestroy } from 'svelte';
	import { chatStore } from '../stores/chatStore';
	import { ArrowUp } from 'lucide-svelte';

	let message = '';
	let isActive = false;
	let isButtonActive = false;
	let textareaHeight = 46;
	let inputElement;
	let responsePending;

	function handleFocus() {
		isActive = true;
	}

	function handleBlur() {
		isActive = false;
	}

	async function handleMessageSend() {
		console.log(responsePending);
		if (!message.trim() || responsePending) return;
		let messageCopy = message;
		message = '';
		isButtonActive = false;
		await chatStore.handleSendMessage(messageCopy, 'user');
	}

	function handleInput(event) {
		isButtonActive = message.trim();
		message = event.target.value;
		let amountOfLines = Math.round((event.target.scrollHeight + 2 - 24) / 20);
		console.log('amount of lines', Math.round((event.target.scrollHeight + 2 - 24) / 20));
		textareaHeight = 20 * (amountOfLines > 10 ? 10 : amountOfLines) + 24 + 2;
		console.log('scrollHeight', event.target.scrollHeight);
		console.log('offsetHeight', event.target.offsetHeight);
		console.log('textareaHeight', textareaHeight);
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

	onMount(() => {
		const unsubscribe = chatStore.awaitingForResponse.subscribe((value) => {
			responsePending = value;
		});

		return () => {
			unsubscribe(); // Cleanup on component unmount
		};
	});

	// // Cleanup
	// onDestroy(() => {
	// 	window.removeEventListener('keydown', handleKeyPress);
	// });
</script>

<svelte:window on:keydown={handleSlashPress} />

<div class="textarea-row">
	<textarea
		bind:this={inputElement}
		on:focus={handleFocus}
		on:blur={handleBlur}
		bind:value={message}
		on:input={handleInput}
		on:keydown={handleKeydown}
		style="height: {textareaHeight}px;"
		class:active={isActive}
		placeholder="Type your message..."
	></textarea>
	<button on:click={handleMessageSend} class:buttonactive={isButtonActive}
		><ArrowUp color="#000" size="20" /></button
	>
</div>

<style>
	.buttonactive {
		pointer-events: auto;
		cursor: pointer;
		background-color: var(--text-2);
	}
	button {
		padding: 13px;
		background-color: var(--bg-elevation-3);
		border-radius: 12px;
		border: none;
		margin-left: 12px;
		line-height: 0;
		pointer-events: none;
		cursor: default;
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
