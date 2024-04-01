// src/api.js

// const BASE_URL = 'http://localhost:1337'; // Adjust this to your Flask app's URL
const BASE_URL = 'https://9f24-46-146-18-167.ngrok-free.app';
// const BASE_URL = 'http://46.146.18.167:1337';

// Helper function for fetching data
async function fetchWithTimeout(resource, options = {}) {
	const response = await fetch(resource, {
		headers: { 'ngrok-skip-browser-warning': 'skip-browser-warning' },
		...options
	});
	if (!response.ok) throw new Error(response.statusText);
	return response;
}

export async function createChat() {
	const response = await fetchWithTimeout(`${BASE_URL}/create-chat`, {
		method: 'POST'
	});
	return response.json();
}

export async function listChats() {
	const response = await fetchWithTimeout(`${BASE_URL}/list-chats`, {
		method: 'GET'
	});
	return response.json();
}

export async function sendMessage(chatId, text, sender) {
	const response = await fetchWithTimeout(`${BASE_URL}/send-receive-message`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			chat_id: chatId,
			text,
			sender
		})
	});
	return response;
}

export async function getMessages(chatId) {
	const response = await fetchWithTimeout(`${BASE_URL}/get-messages/${chatId}`, {
		method: 'GET'
	});
	return response.json();
}

// async function fetchStream() {
// 	const response = await fetch('http://localhost:1338/send-receive-message', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({ message: 'some user message' })
// 	});

// 	const reader = response.body.getReader();
// 	while (true) {
// 		const { done, value } = await reader.read();
// 		if (done) break;
// 		const chunk = new TextDecoder().decode(value);
// 		messages += chunk;
// 		// This ensures Svelte re-renders when messages update.
// 		messages = messages;
// 	}
// }
