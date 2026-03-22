import { useState, useRef } from 'react';

export default function ChatInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue('');

    /* Reset textarea height */
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    /* Auto-resize textarea */
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-strong rounded-2xl p-2 flex items-end gap-2 transition-all duration-300
        focus-within:shadow-[0_0_30px_rgba(139,92,246,0.2)] focus-within:border-border-glass-strong"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? 'CosmosChat is exploring…' : 'Ask about the cosmos…'}
        disabled={isLoading}
        rows={1}
        className="flex-1 bg-transparent border-none outline-none resize-none text-sm
          text-text-primary placeholder:text-text-muted px-3 py-2 max-h-[120px]
          disabled:opacity-50"
        aria-label="Chat message input"
        id="chat-input"
      />

      <button
        type="submit"
        disabled={!canSend}
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          cursor-pointer transition-all duration-300
          disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100
          hover:scale-110 active:scale-95"
        style={{
          background: canSend
            ? 'linear-gradient(135deg, var(--color-nebula-500), var(--color-stellar-500))'
            : 'rgba(255,255,255,0.05)',
          boxShadow: canSend ? '0 0 20px rgba(139, 92, 246, 0.4)' : 'none',
        }}
        aria-label="Send message"
        id="send-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-5 h-5 transition-transform duration-200 ${
            canSend ? 'text-white translate-x-0.5' : 'text-text-muted'
          }`}
        >
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </form>
  );
}
