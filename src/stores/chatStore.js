import { writable } from 'svelte/store';
import { createChat, listChats, sendMessage, getMessages } from '../services/api';

function createChatStore() {
	const messages = writable([]);
	const chatId = writable('46d58954-e7a2-48f5-8266-85a2655561fe');

	async function fetchChatMessages(id) {
		const fetchedMessages = await getMessages(id);
		messages.set(fetchedMessages);
	}

	async function handleSendMessage(messageToSend, sender) {
		if (!messageToSend.trim()) return;
		messages.update((currentMessages) => {
			// Return a new array with the new message appended
			return [...currentMessages, { sender: 'user', text: messageToSend }];
		});
		let newMessage = await sendMessage(
			'46d58954-e7a2-48f5-8266-85a2655561fe',
			messageToSend,
			sender
		);
		console.log(newMessage);
		messages.update((currentMessages) => {
			// Return a new array with the new message appended
			return [...currentMessages, { sender: 'assistant', text: newMessage.response }];
		});
		// await fetchChatMessages('46d58954-e7a2-48f5-8266-85a2655561fe'); // Refresh messages after sending
	}

	return {
		messages,
		chatId,
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
