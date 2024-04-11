import { writable } from 'svelte/store';
import {
	listChats,
	sendMessage,
	getMessages,
	changeInstruction,
	getInstruction
} from '../services/api';

function createChatStore() {
	const messages = writable([]);
	// const initialChatId = localStorage.getItem('chatId') || '';
	const chatId = writable('');
	// const chatId = writable('66cac883-e10c-480f-b11c-5458f8579718');
	const awaitingForResponse = writable(false);
	const chats = writable([]);
	const instruction = writable('');

	async function fetchChatMessages(id) {
		if (id != '') {
			const fetchedMessages = await getMessages(id);
			const fetchedInstruction = await getInstruction(id);
			chatId.set(id);
			instruction.set(fetchedInstruction);
			localStorage.setItem('chatId', id);
			localStorage.setItem('instruction', fetchedInstruction);
			messages.set(fetchedMessages);
		} else {
			messages.set([]);
		}
	}

	async function handleSendMessage(messageToSend, fileToSend, sender) {
		awaitingForResponse.set(true);
		messages.update((currentMessages) => {
			// Return a new array with the new message appended
			return [...currentMessages.reverse(), { sender: 'user', text: messageToSend }];
		});
		let currentChatId = '';
		const unsubscribe = chatId.subscribe((value) => {
			currentChatId = value;
		});
		unsubscribe();
		let response = await sendMessage(currentChatId, messageToSend, fileToSend, sender);
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
				// messages.update((currentMessages) => {
				// 	if (currentMessages.at(-1).sender != 'user') {
				// 		return [
				// 			{ sender: 'assistant', text: completeResponse },
				// 			...currentMessages.slice(0, currentMessages.length - 1)
				// 		];
				// 	} else {
				// 		return [...currentMessages, { sender: 'assistant', text: completeResponse }];
				// 	}
				// });
				// Since we're using reversed lists, prepend the streamed response.
				messages.update((currentMessages) => {
					let lastMessage = currentMessages[0];
					if (lastMessage && lastMessage.sender === 'assistant') {
						// Update last assistant message if it's still being received
						currentMessages[0].text = completeResponse;
					} else {
						// Otherwise, prepend new assistant message
						currentMessages = [{ sender: 'assistant', text: completeResponse }, ...currentMessages];
					}
					return currentMessages.reverse();
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
				chatId.set('');
			}
		}
	}

	// Call initChatId in a browser-only context
	if (typeof window !== 'undefined') {
		initChatId();
	}

	async function handleCreateChat() {
		chatId.set('');
		// localStorage.setItem('chatId', '');
		// let response = await createChat();
		// console.log('New Chat ID', response.chat_id);
		// chatId.set(response.chat_id);
		// Save the new chat ID to localStorage
	}

	async function fetchChats() {
		let response = await listChats();
		chats.set(response);
	}

	async function handleChangeInstruction(instruction) {
		let currentChatId = '';
		const unsubscribe = chatId.subscribe((value) => {
			currentChatId = value;
		});
		unsubscribe();
		await changeInstruction(currentChatId, instruction);
	}

	return {
		messages,
		chatId,
		awaitingForResponse,
		chats,
		instruction,
		fetchChatMessages,
		handleCreateChat,
		handleSendMessage,
		fetchChats,
		handleChangeInstruction,
		getInstruction
	};
}

export const chatStore = createChatStore();
