<script>
	import { chatStore } from '../stores/chatStore';
	import SvelteMarkdown from 'svelte-markdown';
	import { tick, onMount, afterUpdate } from 'svelte';
	import DynamicTextArea from '../components/DynamicTextArea.svelte';

	let chats = [];
	let chatId = 'aabd3c1e-ecaf-4e74-9ae5-1fdc4c74a11a'; // Removed default chatId for selection purpose
	let messageList = [];
	let messagesView;

	function scrollToBottom() {
		if (messagesView) {
			console.log('scrollTop', messagesView.scrollTop);
			console.log('scrollHeight', messagesView.scrollHeight);
			messagesView.scrollTop = messagesView.scrollHeight;
			console.log('scrollTop', messagesView.scrollTop);
            console.log('scrollHeight', messagesView.scrollHeight);
		}
	}

	afterUpdate(scrollToBottom);

	onMount(async () => {
		scrollToBottom();
		await chatStore.fetchChatMessages(chatId);
		const unsubscribe = chatStore.messages.subscribe(async (value) => {
			messageList = value;
		});

		console.log(messageList);
		await tick();
		scrollToBottom();
		return () => {
			unsubscribe(); // Cleanup on component unmount
		};
	});
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
	<div class="chat-view" bind:this={messagesView}>
		<div class="messages-view">
			{#each messageList as message}
				<div class="message">
					<h4>{message.sender == 'user' ? 'You' : 'ChatGPT'}</h4>
					<!-- <p>{message.text}</p> -->
					<SvelteMarkdown source={message.text}></SvelteMarkdown>
				</div>
			{/each}
		</div>
		<div class="textfield">
			<DynamicTextArea></DynamicTextArea>
		</div>
	</div>
</main>

<style>
	p {
		margin: 0;
		padding: 0;
	}
	h4 {
		font-weight: 500;
		font-size: 16px;
		margin: 0;
		padding: 0;
		margin-bottom: 8px;
	}
	.textfield {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.message {
		width: 100vw;
		max-width: 768px;
		display: flex;
		align-items: start;
		flex-direction: column;
		padding: 16px 0;
		/* overflow-x: hidden; */
	}
	.messages-view {
		flex: 1;
		flex-grow: 1;
		overflow-y: auto;
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.chat-view {
		width: 100vw;
		height: 100vh;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	main {
		height: 100vh;
		width: 100vw;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		/* overflow: hidden; */
	}
</style>
