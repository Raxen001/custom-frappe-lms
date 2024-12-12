<template>
	<div class="flex h-screen bg-gray-50">
	  <!-- Main Chat Container -->
	  <div class="flex-1 flex flex-col">
		<!-- Username Input (shown if username is not set) -->
		<div v-if="!username" class="flex-1 flex items-center justify-center">
		  <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
			<h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Welcome to AI Chatbot</h2>
			<form @submit.prevent="setUsername" class="space-y-4">
			  <div>
				<label for="username" class="block text-sm font-medium text-gray-700">Choose a unique username</label>
				<input
				  id="username"
				  v-model="tempUsername"
				  type="text"
				  required
				  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
				  placeholder="Enter your username"
				/>
			  </div>
			  <button
				type="submit"
				class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
			  >
				Start Chatting
			  </button>
			</form>
			<p v-if="usernameError" class="mt-2 text-sm text-red-600">{{ usernameError }}</p>
		  </div>
		</div>

		<!-- Chat Interface (shown if username is set) -->
		<template v-else>
		  <!-- Chat Messages -->
		  <div
			ref="chatContainer"
			class="flex-1 overflow-y-auto px-4 py-6"
		  >
			<div class="max-w-3xl mx-auto space-y-6">
			  <!-- Welcome Message -->
			  <div v-if="messages.length === 0" class="text-center py-8">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
				  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
				  </svg>
				</div>
				<h2 class="text-2xl font-semibold mb-2 text-gray-800">Welcome, {{ username }}!</h2>
				<p class="text-gray-600">How can I assist you today?</p>
			  </div>

			  <!-- Messages -->
			  <div
				v-for="(message, index) in messages"
				:key="index"
				class="flex items-start space-x-4"
				:class="message.role === 'user' ? 'justify-end' : 'justify-start'"
			  >
				<!-- Avatar -->
				<div
				  v-if="message.role === 'assistant'"
				  class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
				>
				  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				  </svg>
				</div>

				<!-- Message Bubble -->
				<div
				  class="max-w-[80%] rounded-lg px-4 py-2 shadow-sm"
				  :class="[
					message.role === 'user'
					  ? 'bg-blue-500 text-white'
					  : 'bg-white text-gray-800'
				  ]"
				>
				  <p class="whitespace-pre-wrap">{{ message.content }}</p>
				</div>

				<!-- User Avatar -->
				<div
				  v-if="message.role === 'user'"
				  class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"
				>
				  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
				  </svg>
				</div>
			  </div>

			  <!-- Loading Indicator -->
			  <div v-if="isLoading" class="flex items-center space-x-2">
				<div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
				<div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style="animation-delay: 0.2s"></div>
				<div class="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style="animation-delay: 0.4s"></div>
			  </div>
			</div>
		  </div>

		  <!-- Input Area -->
		  <div class="border-t border-gray-200 bg-white px-4 py-4">
			<div class="max-w-3xl mx-auto">
			  <form @submit.prevent="sendMessage" class="relative">
				<input
				  v-model="userInput"
				  type="text"
				  placeholder="Type your message..."
				  class="w-full rounded-lg pl-4 pr-12 py-3 bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				  :disabled="isLoading"
				/>
				<button
				  type="submit"
				  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 disabled:opacity-50"
				  :disabled="isLoading || !userInput.trim()"
				>
				  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
				  </svg>
				</button>
			  </form>
			</div>
		  </div>
		</template>
	  </div>
	</div>
  </template>

  <script>
  import { ref, onMounted, nextTick, inject } from 'vue';

  export default {
	name: 'Aichatbot',
	setup() {
	  const messages = ref([]);
	  const userInput = ref('');
	  const chatContainer = ref(null);
	  const isLoading = ref(false);
	  // const username = ref('student');
	  const tempUsername = ref('');
	  const usernameError = ref('');

	  const user = inject('$user');
	  const username = ref("student");
	  console.log("fuck: ", username.value)

	  const scrollToBottom = () => {
		if (chatContainer.value) {
		  chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
		}
	  };

	  const setUsername = async () => {
		if (tempUsername.value.trim()) {
		  // Here you would typically check with your backend if the username is unique
		  // For this example, we'll simulate an API call with a timeout
		  isLoading.value = true;
		  await new Promise(resolve => setTimeout(resolve, 1000));
		  isLoading.value = false;

		  // Simulating a unique username check
		  if (tempUsername.value.toLowerCase() === 'admin') {
			usernameError.value = 'This username is already taken. Please choose another.';
		  } else {
			username.value = tempUsername.value;
			usernameError.value = '';
		  }
		}
	  };

	  const sendMessage = async () => {
		if (!userInput.value.trim() || isLoading.value) return;

		const userMessage = { role: 'user', content: userInput.value };
		messages.value.push(userMessage);
		userInput.value = '';
		isLoading.value = true;

		await nextTick();
		scrollToBottom();

		try {
		  // const url = 'http://localhost:11434/api/chat'
		  // const url = 'http://legion.tailaadcc.ts.net:11434/api/chat'
		  const url = "https://abraham-loq-15ahp9.tail6c571d.ts.net/api/chat"
		  const response = await fetch(url, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(
			{
			        // model: "qwen2.5-coder:7b",
			        model: "llama3.2",
				messages: [{
					content: userMessage.content,
					role: 'user',
				}],
				stream: false,
			}),
		  });

		  if (!response.ok) {
			throw new Error('Network response was not ok');
		  }

		  const reader = response.body.getReader();
		  let assistantMessage = { role: 'assistant', content: '' };

		  while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = new TextDecoder().decode(value);
			const lines = chunk.split('\n');

			for (const line of lines) {
			  if (line.trim() !== '') {
				try {
				  const jsonResponse = JSON.parse(line);
				  if (jsonResponse.message) {
					assistantMessage.content += jsonResponse.message.content;
					// Update the message in real-time
					if (!messages.value.includes(assistantMessage)) {
					  messages.value.push({ ...assistantMessage });
					} else {
					  messages.value[messages.value.length - 1] = { ...assistantMessage };
					}
					await nextTick();
					scrollToBottom();
				  }
				} catch (e) {
				  console.error('Error parsing JSON:', e);
				}
			  }
			}
		  }
		} catch (error) {
		  console.error('Error:', error);
		  messages.value.push({
			role: 'assistant',
			content: 'Sorry, there was an error processing your request.',
		  });
		} finally {
		  isLoading.value = false;
		  await nextTick();
		  scrollToBottom();
		}
	  };

	  onMounted(() => {
		// No need to check for dark mode preference in light mode
	  });

	  return {
		messages,
		userInput,
		sendMessage,
		chatContainer,
		isLoading,
		username,
		tempUsername,
		setUsername,
		usernameError,
	  };
	},
  };
  </script>

  <style>
  /* Smooth scrolling for chat container */
  .overflow-y-auto {
	scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  .overflow-y-auto::-webkit-scrollbar {
	width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
	background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
	background-color: rgba(156, 163, 175, 0.5);
	border-radius: 3px;
  }
  </style>
