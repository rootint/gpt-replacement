<script>
	import { onMount } from 'svelte';
	import { chatStore } from '../stores/chatStore';
	import { MessageCircle, Plus } from 'lucide-svelte';

	let chats = [];

	async function handleCreateChat() {
		console.log('chat created!');
		await chatStore.handleCreateChat();
	}

	async function handlePickChat(id) {
		await chatStore.fetchChatMessages(id);
	}

	onMount(async () => {
		await chatStore.fetchChats();
		const unsubscribe = chatStore.chats.subscribe(async (value) => {
			chats = value;
		});

		return () => {
			unsubscribe(); // Cleanup on component unmount
		};
	});
</script>

<div class="wrapper">
	<button on:click={handleCreateChat} class="new-chat-btn">
		<Plus size="24" style="margin-right: 16px"></Plus>
		New Chat
	</button>
	{#each chats as chat}
		<button on:click={() => handlePickChat(chat.chat_id)} class="chat-list-btn"
			><MessageCircle></MessageCircle> {chat.chat_id}</button
		>
	{/each}
</div>

<style>
	.chat-list-btn {
		background-color: var(--bg-elevation-2);
		display: flex;
		align-items: center;
        margin-bottom: 16px;
        outline: none;
        border: none;
        justify-content: start;
        cursor: pointer;
	}
	.new-chat-btn {
		background-color: var(--bg-elevation-4);
		display: flex;
		align-items: center;
		padding: 12px 16px;
		border-radius: 12px;
		outline: none;
		border: 1px solid var(--border-2);
		font-weight: 500;
		cursor: pointer;
		margin-bottom: 32px;
	}
	.wrapper {
		height: 100%;
		/* position: absolute; */
		background-color: var(--bg-elevation-2);
		padding: 24px;
		display: flex;
		flex-direction: column;
		/* flex: 2; */
	}
</style>
