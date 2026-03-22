import { useChat } from '@ai-sdk/react';
import Starfield from './components/Starfield';
import ChatInterface from './components/ChatInterface';
import AppHeader from './components/AppHeader';

export default function App() {
  const {
    messages,
    status,
    error,
    sendMessage,
    regenerate,
  } = useChat({
    api: '/api/chat',
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  /* Handle sending a message from our custom input */
  const handleSend = (text) => {
    sendMessage({ text });
  };

  /* Handle clicking a suggested question */
  const handleQuestionClick = (question) => {
    sendMessage({ text: question });
  };

  /* Handle retry after error */
  const handleRetry = () => {
    regenerate();
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <Starfield />

      <AppHeader isLoading={isLoading} />

      {/* Chat Area */}
      <main className="relative z-10 flex-1 flex flex-col max-w-3xl w-full mx-auto overflow-hidden">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSubmit={handleSend}
          onRetry={handleRetry}
          onQuestionClick={handleQuestionClick}
        />
      </main>
    </div>
  );
}
