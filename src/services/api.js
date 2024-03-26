// src/api.js

const BASE_URL = 'http://localhost:1337'; // Adjust this to your Flask app's URL

// Helper function for fetching data
async function fetchWithTimeout(resource, options = {}) {
	const response = await fetch(resource, {
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
	return response.json();
}

// In ../services/api.js

export async function getMessages(chatId) {
	const response = await fetchWithTimeout(`${BASE_URL}/get-messages/${chatId}`, {
		method: 'GET'
	});
	return response.json();
}
