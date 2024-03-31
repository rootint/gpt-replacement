<script>
	import { chatStore } from '../stores/chatStore';
	import SvelteMarkdown from 'svelte-markdown';
	import { tick, onMount, afterUpdate } from 'svelte';
	import DynamicTextArea from '../components/DynamicTextArea.svelte';
	import MessageButtonsRow from '../components/MessageButtonsRow.svelte';

	let chats = [];
	let chatId = 'aabd3c1e-ecaf-4e74-9ae5-1fdc4c74a11a'; // Removed default chatId for selection purpose
	let messageList = [];
	let messagesView;

	const scrollToBottom = async (node) => {
		// console.log('scrolling', node);
		node.scroll({ top: node.scrollHeight });
	};

	const smoothScrollToBottom = async (node) => {
		node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
	};

	onMount(async () => {
		await chatStore.fetchChatMessages(chatId);
		const unsubscribe = chatStore.messages.subscribe(async (value) => {
			messageList = value;
			await tick();
			smoothScrollToBottom(messagesView);
		});

		console.log(messageList);
		await tick();
		scrollToBottom(messagesView);
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
	<div class="gradient-mask"></div>
	<div class="chat-view">
		<div class="messages-view" bind:this={messagesView}>
			{#each messageList as message}
				<div class="message">
					<h4>{message.sender == 'user' ? 'You' : 'ChatGPT'}</h4>
					<!-- <p>{message.text}</p> -->
					<SvelteMarkdown source={message.text}></SvelteMarkdown>
					{#if message.sender == 'assistant'}
						<MessageButtonsRow {message} isLast={messageList.at(-1) === message}
						></MessageButtonsRow>
					{/if}
				</div>
			{/each}
		</div>
		<div class="textfield">
			<DynamicTextArea></DynamicTextArea>
		</div>
	</div>
</main>

<style>
	.gradient-mask {
		z-index: 2;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50px;
		background-image: linear-gradient(rgba(0, 0, 0, 255), rgba(0, 0, 0, 0));
	}
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
		padding-top: 24px;
		padding-bottom: 8px;
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
