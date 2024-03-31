import { writable } from 'svelte/store';
import { createChat, listChats, sendMessage, getMessages } from '../services/api';

function createChatStore() {
	const messages = writable([]);
	const chatId = writable('aabd3c1e-ecaf-4e74-9ae5-1fdc4c74a11a');
	const awaitingForResponse = writable(false);

	async function fetchChatMessages(id) {
		const fetchedMessages = await getMessages(id);
		messages.set(fetchedMessages);
	}

	async function handleSendMessage(messageToSend, sender) {
		awaitingForResponse.set(true);
		messages.update((currentMessages) => {
			// Return a new array with the new message appended
			return [...currentMessages, { sender: 'user', text: messageToSend }];
		});
		let response = await sendMessage('aabd3c1e-ecaf-4e74-9ae5-1fdc4c74a11a', messageToSend, sender);
		console.log(response);
		// Check if the HTTP response status indicates success before proceeding to read the stream
		if (response.ok) {
			const reader = response.body.getReader();
			let decoder = new TextDecoder();
			let completeResponse = '';

			// Continuously read from the stream
			reader.read().then(function processText({ done, value }) {
				if (done) {
					console.log('Stream complete');
					console.log('Complete Response: ', completeResponse);
					// Assuming the entire response is now in `completeResponse`, you can update the Svelte store
					// messages.update((currentMessages) => [
					// 	...currentMessages,
					// 	{ sender: 'assistant', text: completeResponse }
					// ]);
					awaitingForResponse.set(false);
					return;
				}

				// Decode the stream chunk to text
				let chunkText = decoder.decode(value, { stream: true });
				// Accumulate the streamed chunks (optional)
				completeResponse += chunkText;

				// Log the chunk to console (optional)
				console.log('Received Chunk: ', chunkText);
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
		// console.log(newMessage);
		// messages.update((currentMessages) => {
		// 	// Return a new array with the new message appended
		// 	return [...currentMessages, { sender: 'assistant', text: newMessage.response }];
		// });
		// awaitingForResponse.update((_) => {
		// 	return false;
		// });
		// await fetchChatMessages('46d58954-e7a2-48f5-8266-85a2655561fe'); // Refresh messages after sending
	}

	return {
		messages,
		chatId,
		awaitingForResponse,
		fetchChatMessages, // Expose this function
		handleSendMessage
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
