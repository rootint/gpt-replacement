<!-- <script>
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let text;

	let lineHeight = 24;
	let maxLines = 10; // Assuming max height is 10 lines (240px)
	let textArea;
	let isActive = false;

	// Function to adjust textarea height dynamically
	function adjustHeight() {
		// textArea.style.height = 'auto';
		const totalLines = Math.min(textArea.scrollHeight / lineHeight, maxLines);
		const newHeight = totalLines * lineHeight;
		textArea.style.height = `${newHeight}px`;

		// Set overflow based on text length
		textArea.style.overflowY = totalLines >= maxLines ? 'auto' : 'hidden';
	}

	// Listen to input event to dynamically adjust height
	function handleInput() {
		adjustHeight();
		dispatch('textChange', { text });
	}

	function handleFocus() {
		isActive = true;
	}

	function handleBlur() {
		isActive = false;
	}

	onMount(() => {
		adjustHeight();
	});
</script>

<textar
	bind:this={textArea}
	bind:value={text}
	on:input={handleInput}
	on:focus={handleFocus}
	on:blur={handleBlur}
	class:active={isActive}
	rows="1"
	placeholder="Enter your message..."
></textarea>

<style>
	textarea {
		width: 100%;
		resize: none;
		overflow-y: hidden;
		padding: 12px;
		box-sizing: border-box;
		color: var(--text);
		background-color: var(--bg-elevation-1);
		border: var(--border) solid 1px;
		border-radius: 8px;
		font-size: 14px;
		transition: border-color 0.3s ease;
		outline: none;
	}

	.active {
		border-color: var(--text-2); /* Change border color to white when active */
	}

	textarea::placeholder {
		color: var(--placeholder-text);
	}
</style> -->
