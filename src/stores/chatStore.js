import { writable } from 'svelte/store';
import { createChat, listChats, sendMessage, getMessages } from '../services/api';

function createChatStore() {
	const messages = writable([]);
	// const initialChatId = localStorage.getItem('chatId') || '';
	const chatId = writable('');
	// const chatId = writable('66cac883-e10c-480f-b11c-5458f8579718');
	const awaitingForResponse = writable(false);
	const chats = writable([]);

	async function fetchChatMessages(id) {
		const fetchedMessages = await getMessages(id);
		chatId.set(id);
    localStorage.setItem('chatId', id);
		messages.set(fetchedMessages);
	}

	async function handleSendMessage(messageToSend, sender) {
		awaitingForResponse.set(true);
		messages.update((currentMessages) => {
			// Return a new array with the new message appended
			return [...currentMessages, { sender: 'user', text: messageToSend }];
		});
		let currentChatId = '';
		const unsubscribe = chatId.subscribe((value) => {
			currentChatId = value;
		});
		unsubscribe();
		let response = await sendMessage(currentChatId, messageToSend, sender);
		// Check if the HTTP response status indicates success before proceeding to read the stream
		if (response.ok) {
			const reader = response.body.getReader();
			let decoder = new TextDecoder();
			let completeResponse = '';

			// Continuously read from the stream
			reader.read().then(function processText({ done, value }) {
				if (done) {
					awaitingForResponse.set(false);
					return;
				}

				// Decode the stream chunk to text
				let chunkText = decoder.decode(value, { stream: true });
				// Accumulate the streamed chunks (optional)
				completeResponse += chunkText;

				// Log the chunk to console (optional)
				messages.update((currentMessages) => {
					if (currentMessages.at(-1).sender != 'user') {
						return [
							...currentMessages.slice(0, currentMessages.length - 1),
							{ sender: 'assistant', text: completeResponse }
						];
					} else {
						return [...currentMessages, { sender: 'assistant', text: completeResponse }];
					}
				});

				// Recursively read the next chunk
				reader.read().then(processText);
			});
		} else {
			// Handle HTTP error responses
			console.error('Fetch error: Failed to load the stream');
			awaitingForResponse.set(false);
		}
	}

	// Custom function to safely initialize the chatId from localStorage
	function initChatId() {
		if (typeof localStorage !== 'undefined') {
			const storedChatId = localStorage.getItem('chatId');
			if (storedChatId) {
				chatId.set(storedChatId);
			} else {
				// Handle case where there is no stored ID, e.g., set a default or generate one as needed
				chatId.set('66cac883-e10c-480f-b11c-5458f8579718');
			}
		}
	}

	// Call initChatId in a browser-only context
	if (typeof window !== 'undefined') {
		initChatId();
	}

	async function handleCreateChat() {
		let response = await createChat();
		console.log('New Chat ID', response.chat_id);
		chatId.set(response.chat_id);
		// Save the new chat ID to localStorage
		localStorage.setItem('chatId', response.chat_id);
	}

	async function fetchChats() {
		let response = await listChats();
		chats.set(response);
	}

	return {
		messages,
		chatId,
		awaitingForResponse,
		chats,
		fetchChatMessages,
		handleCreateChat,
		handleSendMessage,
		fetchChats,
	};
}

export const chatStore = createChatStore();

// function createChatStore() {
// 	const messages = writable([]); // This stores the chat messages
// 	const chatId = writable('46d58954-e7a2-48f5-8266-85a2655561fe'); // This stores the current chat ID

// 	async function fetchChats() {
// 		chats = await listChats();
// 		if (chats && chats.length > 0 && !chatId) {
// 			chatId.set(chats[0].chat_id); // Automatically select the first chat on load
// 			await fetchChatMessages();
// 		}
// 	}

// 	async function fetchChatMessages(id) {
// 		if (!id) return;
// 		const fetchedMessages = await getMessages(id);
// 		messages.set(fetchedMessages); // Update the messages store
// 		chatId.set(id); // Update the chat ID store
// 		// console.log('messages:',);
// 	}

// 	async function handleSendMessage(messageToSend, sender) {
// 		if (!messageToSend.trim()) return;
// 		await sendMessage(chatId, messageToSend, sender);
// 		await fetchChatMessages(chatId); // Refresh messages after sending
// 	}

// 	return {
// 		subscribe: messages.subscribe,
// 		fetchChatMessages,
// 		handleSendMessage,
// 		chatId
// 	};
// }
