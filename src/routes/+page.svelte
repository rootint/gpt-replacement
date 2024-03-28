<script>
	import { chatStore } from '../stores/chatStore';
	import SvelteMarkdown from 'svelte-markdown';
	import { onMount } from 'svelte';
	import DynamicTextArea from '../components/DynamicTextArea.svelte';

	let chats = [];
	let chatId = '46d58954-e7a2-48f5-8266-85a2655561fe'; // Removed default chatId for selection purpose
	let messageList = [];
	let messagesView;

	onMount(async () => {
		scrollToBottom();
		await chatStore.fetchChatMessages(chatId);
		const unsubscribe = chatStore.messages.subscribe((value) => {
			messageList = value;
			scrollToBottom();
		});
		console.log(messageList);
		return () => {
			unsubscribe(); // Cleanup on component unmount
		};
	});

	function scrollToBottom() {
		if (messagesView) {
			messagesView.scrollTop = messagesView.scrollHeight;
		}
	}
</script>

<svelte:head>
	<title>ChatGPT</title>
	<meta name="description" content="Testing the OpenAI API functionality" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Roboto+Mono&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main>
	<div class="chat-view">
		<div class="messages-view" bind:this={messagesView}>
			{#each messageList as message}
				<p><strong>{message.sender}</strong>: <SvelteMarkdown source={message.text} /></p>
			{/each}
		</div>
		<DynamicTextArea></DynamicTextArea>
	</div>
</main>

<style>
	.messages-view {
		flex: 1;
		overflow-y: auto;
	}
	.chat-view {
		max-width: 800px;
		height: 100vh;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	main {
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: center;
	}
</style>
