<!-- 1160px -->
<script>
	import { chatStore } from '../stores/chatStore';
	import SvelteMarkdown from 'svelte-markdown';
	import { tick, onMount, afterUpdate } from 'svelte';
	import DynamicTextArea from '../components/DynamicTextArea.svelte';
	import MessageButtonsRow from '../components/MessageButtonsRow.svelte';
	// import CodeComponent from '../components/CodeComponent.svelte';
	import ChatsSidebar from '../components/ChatsSidebar.svelte';

	let chatId = ''; // Removed default chatId for selection purpose
	let messageList = [];
	let messagesView;

	const isUserAtBottom = (node) => {
		// Threshold in pixels to consider the user "at the bottom"
		// For instance, if the user is within 100px from the bottom, it's considered at the bottom.
		const threshold = 100;
		const position = node.scrollTop + node.offsetHeight;
		const difference = node.scrollHeight - position;
		return difference < threshold;
	};

	const scrollToBottom = async (node) => {
		// console.log('scrolling', node);

		node.scroll({ top: node.scrollHeight });
	};

	const messageScrollToBottom = async (node) => {
		// if (isUserAtBottom(node)) {
		// node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
		node.scroll({ top: node.scrollHeight });
		// }
	};

	function containsFilePlaceholder(message) {
		return message.includes('<PDF_HERE>');
	}

	onMount(async () => {
		const unsubscribeFromId = chatStore.chatId.subscribe(async (value) => {
			chatId = value;
			await chatStore.fetchChatMessages(chatId);
		});
		const unsubscribe = chatStore.messages.subscribe(async (value) => {
			messageList = value;
			await tick();
			// TODO: figure out smoothness
			scrollToBottom(messagesView);
		});

		console.log(messageList);
		await tick();
		scrollToBottom(messagesView);
		return () => {
			unsubscribe(); // Cleanup on component unmount
			unsubscribeFromId();
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
	<div class="sidebar">
		<ChatsSidebar></ChatsSidebar>
	</div>
	<div class="chat-view">
		<!-- <div class="gradient-mask"></div> -->
		<div class="messages-view" bind:this={messagesView}>
			{#each messageList as message}
				<div class={message.sender == 'user' ? 'user-message' : 'bot-message'}>
					<div class="message">
						<div class="sender-name">
							{#if message.sender != 'user'}
								<div class="gpt-circle"></div>
							{/if}
							<h4>
								{message.sender == 'user' ? 'You' : 'ChatGPT'}
							</h4>
						</div>
						<!-- <p>{message.text}</p> -->
						<!-- <SvelteMarkdown source={message.text} renderers={{ code: CodeComponent }} /> -->
						{#if containsFilePlaceholder(message.text)}
							<div class="file-attached-badge">File attached</div>
						{/if}
						<SvelteMarkdown source={message.text} />
						{#if message.sender == 'assistant'}
							<MessageButtonsRow {message} isLast={messageList.at(-1) === message}
							></MessageButtonsRow>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		<div class="textfield">
			<DynamicTextArea></DynamicTextArea>
		</div>
	</div>
</main>

<style>
	.file-attached-badge {
		padding: 8px 12px;
		color: var(--text); /* Example badge color */
		background-color: var(--bg-elevation-3);
		border-radius: 8px;
		font-size: 12px;
		margin-top: 12px;
        margin-bottom: 12px;
		display: inline-block; /* Or flex depending on your design */
	}
	.sidebar {
		width: 300px;
	}
	/* .new-chat-btn {
        position: absolute;

	} */
	.user-message {
		background-color: var(--bg-elevation-1);
		width: 100%;
		display: flex;
		justify-content: center;
		/* max-width: unset; */
	}
	.bot-message {
		width: 100%;
		display: flex;
		justify-content: center;
		/* max-width: unset; */
	}
	.gpt-circle {
		width: 12px;
		height: 12px;
		border-radius: 12px;
		background-color: var(--text-2);
		margin-right: 8px;
		margin-bottom: 1.5px;
		margin-left: -21px;
	}
	.sender-name {
		display: flex;
		align-items: center;
		/* margin-bottom: 8px; */
	}
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
	}
	.textfield {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.message {
		width: 100%;
		max-width: 768px;
		display: flex;
		align-items: start;
		flex-direction: column;
		padding: 16px 0;
		/* overflow-x: hidden; */
	}
	.messages-view {
		/* flex: 1; */
		/* flex-grow: 1; */
		overflow-y: auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 24px;
		padding-bottom: 8px;
	}
	.chat-view {
		flex-grow: 1;
		width: 100%;
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
