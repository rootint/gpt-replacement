<script>
	import { onMount } from 'svelte';
	import { chatStore } from '../stores/chatStore';
	import { MessageCircle, Plus } from 'lucide-svelte';

	let chats = [];
	let selectedChatId;

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
			chats = value.reverse();
		});

		const unsubscribeFromSelected = chatStore.chatId.subscribe(async (value) => {
			selectedChatId = value;
		});

		return () => {
			unsubscribe(); // Cleanup on component unmount
			unsubscribeFromSelected();
		};
	});
</script>

<div class="wrapper">
	<button on:click={handleCreateChat} class="new-chat-btn">
		<Plus size="24" style="margin-right: 16px"></Plus>
		New Chat
	</button>
	<div class="scroll-container">
		{#each chats as chat}
			{#if chat.chat_id == selectedChatId}
				<button on:click={() => handlePickChat(chat.chat_id)} class="chat-list-btn selected"
					><MessageCircle size="20"></MessageCircle><span class="text-container selected">
						{chat.name}</span
					></button
				>
			{:else}
				<button on:click={() => handlePickChat(chat.chat_id)} class="chat-list-btn"
					><MessageCircle size="20" color="#777"></MessageCircle>
					<span class="text-container"> {chat.name}</span></button
				>
			{/if}
		{/each}
	</div>
</div>

<style>
	.text-container {
		display: inline-block;
		max-width: 170px; /* Adjust this width as needed */
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		margin-left: 16px;
		color: var(--placeholder-text);
	}
	.chat-list-btn {
		background-color: var(--bg-elevation-2);
		display: flex;
		align-items: center;
		margin-bottom: 12px;
		outline: none;
		border: none;
		justify-content: start;
		cursor: pointer;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		padding: 12px 16px;
		color: var(--placeholder-text);
        width: 100%;
	}
	.selected {
		font-weight: 500;
		background-color: var(--bg-elevation-4);
		border-radius: 12px;
		color: var(--text);
	}
	.new-chat-btn {
		background-color: var(--bg-elevation-4);
		display: flex;
		align-items: center;
		padding: 12px 14px;
		border-radius: 12px;
		outline: none;
		border: 1px solid var(--border-2);
		font-weight: 500;
		cursor: pointer;
		margin-bottom: 16px;
	}
    .scroll-container {
        overflow-y: scroll;
        width: 100%;
        padding-top: 8px;
    }
	.wrapper {
		width: 300px;
		height: 100vh;
		/* position: absolute; */
		background-color: var(--bg-elevation-2);
		padding: 24px;
		display: flex;
		flex-direction: column;
		/* flex: 2; */
	}
</style>
