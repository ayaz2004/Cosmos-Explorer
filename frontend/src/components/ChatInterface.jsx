import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

export default function ChatInterface({
  messages,
  isLoading,
  error,
  onSubmit,
  onRetry,
  onQuestionClick,
}) {
  const messagesEndRef = useRef(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto pb-4 space-y-1 transition-all duration-500 ${
          hasMessages ? 'pt-3' : 'pt-2'
        }`}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {!hasMessages && !error && (
          <EmptyState onQuestionClick={onQuestionClick} />
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        {error && <ErrorState error={error} onRetry={onRetry} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 pt-2">
        <ChatInput onSubmit={onSubmit} isLoading={isLoading} />

        <p className="text-[10px] text-text-muted text-center mt-2 select-none">
          CosmosChat can make mistakes. Verify important space facts.
        </p>
      </div>
    </div>
  );
}
