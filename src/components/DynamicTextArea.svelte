<script>
	import { chatStore } from '../stores/chatStore';
	import { Send } from 'lucide-svelte';

	let message = '';
	let isActive = false;
	let textareaHeight = 46;

	// // Adjust the height of textarea based on the number of lines and limit
	// function adjustHeight() {
	// 	let numberOfLines = (messageToSend.match(/\n/g) || []).length + 1; // Count the number of lines
	// 	let newHeight = numberOfLines * lineHeight;

	// 	if (newHeight > maxTextAreaHeight) {
	// 		textArea.style.height = `${maxTextAreaHeight}px`;
	// 		textArea.style.overflowY = 'auto'; // Enable scrolling after reaching max height
	// 	} else {
	// 		textArea.style.height = `${newHeight}px`;
	// 		textArea.style.overflowY = 'hidden'; // Hide scroll bar until max height is reached
	// 	}
	// }

	function handleFocus() {
		isActive = true;
	}

	function handleBlur() {
		isActive = false;
	}

	async function handleMessageSend() {
		await chatStore.handleSendMessage(message, 'user');
		message = '';
	}

	function handleInput(event) {
		message = event.target.value;
		// console.log((event.target.scrollHeight) / );
		// textareaHeight = event.target.scrollHeight;
		let amountOfLines = Math.round((event.target.scrollHeight + 2 - 24) / 20);
		console.log('amount of lines', Math.round((event.target.scrollHeight + 2 - 24) / 20));
		textareaHeight = 20 * (amountOfLines > 10 ? 10 : amountOfLines) + 24 + 2;
		console.log('scrollHeight', event.target.scrollHeight);
		console.log('offsetHeight', event.target.offsetHeight);
		console.log('textareaHeight', textareaHeight);
	}
</script>

<div class="textarea-row">
	<textarea
		on:focus={handleFocus}
		on:blur={handleBlur}
		bind:value={message}
		on:input={handleInput}
		style="height: {textareaHeight}px;"
		class:active={isActive}
		placeholder="Type your message..."
	></textarea>
	<button on:click={handleMessageSend}><Send color="#111" size="20" /></button>
</div>

<style>
	button {
		/* display: flex;
		align-items: center;
		justify-content: center; */
		padding: 10px 13px;
		background-color: var(--primary);
		/* margin-left: 12px; */
		border-radius: 8px;
		border: none;
		margin-left: 12px;
		line-height: 0;
	}
	.textarea-row {
		display: flex;
		margin-bottom: 24px;
	}
	textarea {
		width: 100%;
		padding: 12px;
		box-sizing: border-box;
		color: var(--text);
		background-color: var(--bg-elevation-1);
		border: var(--border) solid 1px;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.2s ease;
		outline: none;
		resize: none;
		scrollbar-width: thin;
		scrollbar-color: var(--border) var(--bg-elevation-1);
	}
	.active {
		border-color: var(--text-2);
	}

	textarea::placeholder {
		color: var(--placeholder-text);
	}
</style>
