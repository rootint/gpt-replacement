<script>
	import { chatStore } from '../stores/chatStore';
	import SvelteMarkdown from 'svelte-markdown';
	import { tick, onMount, afterUpdate } from 'svelte';
	import DynamicTextArea from '../components/DynamicTextArea.svelte';
	import MessageButtonsRow from '../components/MessageButtonsRow.svelte';
	import CodeComponent from '../components/CodeComponent.svelte';
	import { Plus } from 'lucide-svelte';

	let chats = [];
	let chatId = '66cac883-e10c-480f-b11c-5458f8579718'; // Removed default chatId for selection purpose
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

	let testString =
		'very_long_list = [{"number_" + str(i): i**2 for i in range(10)}, {"number_" + str(j): j**2 for j in range(10)}, {"number_" + str(k): k**2 for k in range(10)}, {"number_" + str(l): l**2 for l in range(10)}, {"number_" + str(m): m**2 for m in range(10)}, {"number_" + str(n): n**2 for n in range(10)}, {"number_" + str(o): o**2 for o in range(10)}, {"number_" + str(p): p**2 for p in range(10)}, {"number_" + str(q): q**2 for q in range(10)}, {"number_" + str(r): r**2 for r in range(10)}, {"number_" + str(s): s**2 for s in range(10)}, {"number_" + str(t): t**2 for t in range(10)}, {"number_" + str(u): u**2 for u in range(10)}, {"number_" + str(v): v**2 for v in range(10)}, {"number_" + str(w): w**2 for w in range(10)}, {"number_" + str(x): x**2 for x in range(10)}, {"number_" + str(y): y**2 for y in range(10)}, {"number_" + str(z): z**2 for z in range(10)}]';
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
	<!-- <button class="new-chat-btn"><Plus></Plus></button> -->
	<div class="gradient-mask"></div>
	<div class="chat-view">
		<div class="messages-view" bind:this={messagesView}>
			{#each messageList as message}
				<div class={message.sender == 'user' ? 'user-message' : ''}>
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
