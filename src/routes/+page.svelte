<!-- src/Chat.svelte -->
<script>
	import { onMount } from 'svelte';
	import { createChat, listChats, sendMessage, getMessages } from '../services/api';

	let chats = [];
	let chatId = '2671c195-b0d3-4393-a813-ab8fdf9358b3'; // Default chatId
	let messageToSend = '';
    let messages = [];

	async function fetchChats() {
		chats = await listChats();
	}

    async function fetchChatMessages() {
        if (!chatId) return;
        messages = await getMessages(chatId);
    }

	async function handleCreateChat() {
		const chat = await createChat();
		chatId = chat.chat_id;
		await fetchChats(); // Refresh the chat list
        await fetchChatMessages(); // Fetch messages for the new chat
	}

	async function handleSendMessage() {
		if (!messageToSend.trim()) return; // Basic validation
		const response = await sendMessage(chatId, messageToSend, 'user');
		console.log(response);
        messageToSend = ''; // Clear the input after sending
        await fetchChatMessages(); // Refresh messages
	}

	onMount(() => {
		fetchChats();
        fetchChatMessages();
	});
</script>

<style>
    main {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        height: 100vh;
    }
    
    .chat-list, .message-input {
        grid-column: 3 / 4;
        display: flex;
        flex-direction: column;
    }
    
    .messages {
        grid-column: 2 / 3;
        overflow-y: auto;
        padding: 1rem;
    }
    
    .message-input {
        align-items: center;
        justify-content: flex-end;
        padding: 1rem;
    }
</style>

<main>
    <div class="messages">
        {#each messages as message}
            <p>{message.sender}: {message.text}</p>
        {/each}
    </div>
    <div class="chat-list">
        <button on:click={handleCreateChat}>Create Chat</button>
        <h2>Chats</h2>
        <ul>
            {#each chats as chat}
                <li on:click={() => {chatId = chat.chat_id; fetchChatMessages(); }}>
                    Chat ID: {chat.chat_id}
                </li>
            {/each}
        </ul>
    </div>
    <div class="message-input">
        <input bind:value={messageToSend} placeholder="Type a message" />
        <button on:click={handleSendMessage} disabled={!chatId}>Send Message</button>
    </div>
</main>